import flask
from flask import Flask, request, jsonify
import os
import FoundAI
import pymongo
import json
from pymongo import MongoClient

uri = os.getenv('MONGODB_KEY')

cluster = MongoClient("mongodb+srv://dbUser:yL51I81EjJTyn1CE@cluster0.ztuqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = cluster["foundai"]
found_collection = db["found"]
lost_collection = db["lost"]

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