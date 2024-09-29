import flask
from flask import Flask, request, jsonify
import os
import FoundAI
import pymongo
import json
import boto3
from werkzeug.utils import secure_filename
#from . import finder
from io import BytesIO
from urllib.parse import urlparse
from PIL import Image
from pymongo import MongoClient
import requests
import io
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet18
from PIL import Image
from scipy.spatial.distance import cosine
from bson import ObjectId, json_util


S3_SECRET_KEY = "u9FdWUgR0loNEqCC3z/X17Vpr2/7ZUISlEH1bMbN"
uri = os.getenv('MONGODB_KEY')
cluster = MongoClient(uri)
db = cluster["foundai"]
found_collection = db["found"]
lost_collection = db["lost"]


S3_BUCKET = os.getenv('S3_BUCKET')
S3_REGION = os.getenv('S3_REGION')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')



# Ensure Text Index exists
lost_collection.create_index([('title', 'text'), ('description', 'text')])
found_collection.create_index([('title', 'text'), ('description', 'text')])

model = resnet18(pretrained=True)
model.eval()

# Remove the last fully-connected layer
feature_extractor = torch.nn.Sequential(*list(model.children())[:-1])

# Image preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def get_image_features(image_url):
    # Fetch image from S3
    response = requests.get(image_url)
    image_data = io.BytesIO(response.content)
    
    try:
        image = Image.open(image_data).convert('RGB')
    except Exception as e:
        print(f"Error opening image from {image_url}: {str(e)}")
        return None
    
    # Preprocess image
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0)
    
    # Extract features
    with torch.no_grad():
        features = feature_extractor(input_batch)
    
    return features.squeeze().numpy()

def calculate_similarity(features1, features2):
    if features1 is None or features2 is None:
        return 0
    similarity = 1 - cosine(features1, features2)
    return similarity


s3 = boto3.client('s3',
                 aws_access_key_id=S3_ACCESS_KEY,
                 aws_secret_access_key=S3_SECRET_KEY,
                 region_name=S3_REGION)


@FoundAI.app.route('/api/get_found', methods=['GET'])
def get_found():
   documents = list(found_collection.find({})) #Finds all of the stuff in found
   documents = json.loads(json.dumps(documents, default=str))
   return jsonify(documents)


@FoundAI.app.route('/api/get_lost', methods=['GET'])
def get_lost():
   documents = list(lost_collection.find({})) #Finds all of the stuff in found
   documents = json.loads(json.dumps(documents, default=str))
   return jsonify(documents)


@FoundAI.app.route('/api/insert_found', methods=['POST'])
def insert_found():
   data = request.json
   result = found_collection.insert_one(data)
   return jsonify({
       'message': 'Data inserted successfully!',
       'inserted_id': str(result.inserted_id)
   }), 201


@FoundAI.app.route('/api/insert_lost', methods=['POST'])
def insert_lost():
   data = request.json
   result = lost_collection.insert_one(data)
   return jsonify({
       'message': 'Data inserted successfully!',
       'inserted_id': str(result.inserted_id)
   }), 201
  
  


@FoundAI.app.route('/api/upload_found', methods=['POST'])
def upload_found():
   if 'file' not in request.files:
       return jsonify({'error': 'No file part in the request'}), 400


   file = request.files['file']


   if file.filename == '':
       return jsonify({'error': 'No file selected'}), 400


   if file:
       # Secure the filename
       filename = secure_filename(file.filename)
       s3_folder = "found/"
       s3_key = f"{s3_folder}{filename}"


       try:
           # Upload file to S3
           s3.upload_fileobj(
               file,
               S3_BUCKET,
               s3_key,
               ExtraArgs={"ContentType": file.content_type}
           )


           # Generate S3 file URL
           s3_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{s3_key}"


           return jsonify({'message': 'File uploaded successfully!', 's3_url': s3_url}), 201


       except Exception as e:
           return jsonify({'error': str(e)}), 500
      
      


      
@FoundAI.app.route('/api/upload_lost', methods=['POST'])
def upload_lost():
   if 'file' not in request.files:
       return jsonify({'error': 'No file part in the request'}), 400


   file = request.files['file']


   if file.filename == '':
       return jsonify({'error': 'No file selected'}), 400


   if file:
       # Secure the filename
       filename = secure_filename(file.filename)
       s3_folder = "lost/"
       s3_key = f"{s3_folder}{filename}"


       try:
           # Upload file to S3
           s3.upload_fileobj(
               file,
               S3_BUCKET,
               s3_key,
               ExtraArgs={ "ContentType": file.content_type}
           )


           # Generate S3 file URL
           s3_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{s3_key}"


           return jsonify({'message': 'File uploaded successfully!', 's3_url': s3_url}), 201


       except Exception as e:
           return jsonify({'error': str(e)}), 500


@FoundAI.app.route('/api/search_text_found', methods=['POST'])
def search_found_posts():
   # Perform text search and sort by relevance
   query = request.json['searchText']
   results = found_collection.find(
       {'$text': {'$search': query}},
       {'score': {'$meta': 'textScore'}}
   ).sort([('score', {'$meta': 'textScore'})])
  
   posts = []
   for post in results:
       posts.append({
           'title': post.get('title', ''),
           'description': post.get('description', ''),
           'email': post.get('email', ''),
           'number': post.get('number', ''),
           'location': post.get('location', ''),
           'date': post.get('date', ''),
           'time': post.get('time', ''),
           'picture': post.get('picture', ''),
           'score': post.get('score', 0)
       })
  
   return jsonify(posts), 200


   # documents = list(results)
   # documents = json.loads(json.dumps(documents, default=str))
   # return jsonify(documents)


@FoundAI.app.route('/api/search_text_lost', methods=['POST'])
def search_lost_posts():
   # Perform text search and sort by relevance
   query = request.json['searchText']
   results = lost_collection.find(
       {'$text': {'$search': query}},
       {'score': {'$meta': 'textScore'}}
   ).sort([('score', {'$meta': 'textScore'})])
  
   posts = []
   for post in results:
       posts.append({
           'title': post.get('title', ''),
           'description': post.get('description', ''),
           'email': post.get('email', ''),
           'number': post.get('number', ''),
           'location': post.get('location', ''),
           'date': post.get('date', ''),
           'time': post.get('time', ''),
           'picture': post.get('picture', ''),
           'score': post.get('score', 0)
       })
  
   return jsonify(posts), 200


@FoundAI.app.route('/api/search_photo_found', methods=['POST'])
def compare_images():
    data = request.json
    input_image_url = data.get('s3_url')
    
    if not input_image_url:
        return jsonify({'error': 'Input image URL is required'}), 400
    
    try:
        input_features = get_image_features(input_image_url)
        
        results = []
        
        # Fetch all images from MongoDB
        all_images = found_collection.find()
        
        for db_image in all_images:
            db_image_url = db_image['picture']
            db_image_features = get_image_features(db_image_url)
            
            similarity_score= calculate_similarity(input_features, db_image_features)
            
            
            if (similarity_score > 0.55):
                results.append([similarity_score, db_image])
        
        sorted_rank = sorted(results, key=lambda x: x[0])
        list_of_documents = [t[1] for t in sorted_rank]
        
        return FoundAI.app.response_class(
            json_util.dumps(list_of_documents),
            mimetype='application/json'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

