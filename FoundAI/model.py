import flask
from flask import Flask, request, jsonify
import os
import FoundAI
import pymongo
import json

from pymongo import MongoClient

uri = os.getenv('MONGODB_KEY')

cluster = MongoClient(uri)
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

"""

@FoundAI.app.teardown_appcontext
def close_db(error):

    assert error or not error  # Needed to avoid superfluous style error
    sqlite_db = flask.g.pop('sqlite_db', None)
    if sqlite_db is not None:
        sqlite_db.commit()
        sqlite_db.close()
"""