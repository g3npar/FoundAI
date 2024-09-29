import flask
from flask import Flask, request, jsonify
import os
import FoundAI
import pymongo
import json
import boto3
from werkzeug.utils import secure_filename

from pymongo import MongoClient

uri = os.getenv('MONGODB_KEY')
cluster = MongoClient(uri)
db = cluster["foundai"]
found_collection = db["found"]
lost_collection = db["lost"]

S3_BUCKET = os.getenv('S3_BUCKET')
S3_REGION = os.getenv('S3_REGION')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')

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
                ExtraArgs={"ACL": "public-read", "ContentType": file.content_type}
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
                ExtraArgs={"ACL": "public-read", "ContentType": file.content_type}
            )

            # Generate S3 file URL
            s3_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{s3_key}"

            return jsonify({'message': 'File uploaded successfully!', 's3_url': s3_url}), 201

        except Exception as e:
            return jsonify({'error': str(e)}), 500