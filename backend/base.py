from flask import Flask, request
from pymongo import MongoClient
import re

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client['recipe_db']
recipes = db['recipes']

recipes.delete_many({}) # delete all entries in database

recipes.insert_one({'name':'Meatballs',
                'time_mins':45,
                'energy':'moderate',
                'type':'dinner',
                })

recipes.insert_one({'name':'Veggieballs',
                'time_mins':20,
                'energy':'jules',
                'type':'side',
                })

recipes.insert_one({'name':'Meat Pie',
                'time_mins':90,
                'energy':'big dick',
                'type':'dinner',
                })

@app.route("/query", methods=['POST'])
def index():
    data = request.get_json()
    name = data["name"]
    results = search_by_name(name)
    response_body = {
        "results": str(results).replace("'",'"') # create array in JSON format
    }
    return response_body

def search_by_name(query):
    list_of_matches = []
    regx = re.compile(".*" + re.escape(query), re.IGNORECASE)
    for entry in recipes.find({"name": regx}):
        list_of_matches.append(entry["name"])
    return list_of_matches