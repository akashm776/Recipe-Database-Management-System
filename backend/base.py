from flask import Flask, request
from pymongo import MongoClient
import re

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client['recipe_db']
recipes = db['recipes']


@app.route("/query", methods=['POST'])
def index():
    data = request.get_json()
    name = data["name"]
    results = search_by_name(name)
    response_body = {
        "message": f"Recieved POST: {results}"
    }
    return response_body

def search_by_name(query):
    list_of_matches = []
    regx = re.compile(".*" + re.escape(query), re.IGNORECASE)
    for entry in recipes.find({"name": regx}):
        list_of_matches.append(entry)
    return list_of_matches