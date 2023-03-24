from flask import Flask, request
from pymongo import MongoClient
from pymongo.collation import Collation
from pymongo import ReturnDocument
import re
import pymongo
import datetime

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client['recipe_db']
recipes = db['recipes']

recipes.delete_many({}) # delete all entries in database

recipes.insert_one({'name':'Meatballs',
                'time_mins':45,
                'energy':'moderate',
                'type':'dinner',
                'date_added': datetime.datetime(2023, 3, 23, 17, 15, 46), 
                'views': 0,
                })

recipes.insert_one({'name':'Veggieballs',
                'time_mins':20,
                'energy':'jules',
                'type':'side',
                'date_added': datetime.datetime(2023, 3, 23, 17, 16, 52),
                'views': 0,
                })

recipes.insert_one({'name':'Meat Pie',
                'time_mins':90,
                'energy':'big dick',
                'type':'dinner',
                'date_added': datetime.datetime(2023, 3, 23, 17, 17, 6),
                'views': 0,
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
    recipes.update_many({"name": regx},{'$inc': {'views': 1}})
    return list_of_matches

def filter_by_name():
    return list(recipes.find().sort("name").collation(Collation(locale= "en", caseLevel=True))) 
    # Collation ensures that for example sequence AbBA is sorted AaBb and not ABab

def filter_by_date_added():
    return list(recipes.find().sort("date_added"))

def filter_by_views():
    return list(recipes.find().sort("views", pymongo.DESCENDING))