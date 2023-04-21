from flask import Flask, request
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from pymongo.collation import Collation
from pymongo import ReturnDocument
import random
import re
import os
import json
import pymongo

from reset_db import reset_db 
reset_db() # this will clear entries in the db and load a few presets

IMAGE_DIR = "../frontend/public/images/" # trailing / is required

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client['recipe_db']
recipes = db['recipes']


@app.route("/query", methods=['POST'])
def index():
    data = request.get_json()
    name = data["name"]
    sortBy = data["sort"]
    good_ingredients = data["include_ingredients"]
    bad_ingredients = data["exclude_ingredients"]
    #print(name)
    #print(good_ingredients)
    #print(bad_ingredients)

    cursor = search(name, good_ingredients, bad_ingredients)
    cursor = sort(cursor, sortBy)
    #print(type(cursor))

    response_body = {
        "results": convert_to_json(cursor)
    }
    #print()
    #print(response_body['results'])
    return response_body

def convert_to_json(cursor):
    """
    takes a mongodb cursor object and returns a JSON representation
    """
    json = list(cursor)
    #print(json)
    for entry in json:
        # _id field contains an object, which doesn't readily convert to JSON
        entry.pop("_id")
        #entry['date_added'] = entry['date_added'].timestamp()
    json = str(json).replace("'", '"')  # using ' instead of " will break it
    return json


def search(name, good_ingredients, bad_ingredients):
    regx = re.compile(".*" + re.escape(name), re.IGNORECASE)
    if len(good_ingredients) > 0: # note that the $all condition will be false when good_ingredients is empty, so we need a check
        return recipes.find({"$and":[{"name":regx},{"ingredients.name":{"$all": good_ingredients}},{"ingredients.name":{"$nin": bad_ingredients}}]})
    else:
        return recipes.find({"$and":[{"name":regx},{"ingredients.name":{"$nin": bad_ingredients}}]})

def sort(cursor, sort):
    match sort:
        case "alphabetical":
            return cursor.sort("name").collation(Collation(locale= "en", caseLevel=True))
        case "date":
            return cursor.sort("date_added")
        case "views":
            return cursor.sort("views", pymongo.DESCENDING)
        case "meal_type":
            return cursor.sort("meal_type")
        case "time_mins":
            return cursor.sort("time_mins")
        case "energy":
            return cursor.sort("energy")
    return cursor.sort("name").collation(Collation(locale= "en", caseLevel=True))


@app.route("/ingredientlist", methods=["GET"])
def listOfIngredients():
    ingredients = recipes.find().distinct("ingredients.name")
    return json.dumps(ingredients)


@app.route("/newrecipe", methods=["POST"])
def handle_upload():
    data = dict(request.form)

    print(data)
    # TODO verify dictionary keys before blindly inserting them

    if 'image' in request.files.keys():
        image = request.files['image']

        filename = secure_filename(image.filename)
        path = IMAGE_DIR+filename

        if filename == "": # secure_filename can return empty string in worst case
            return "Bad filename"

        while os.path.exists(path):
            # make up random filename
            file_extension = filename.split('.')[-1]
            alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

            filename = ''.join(random.choices(list(alphanumeric), k=16)) + "." + file_extension
            path = IMAGE_DIR+filename
        
        image.save(path)
        print(f"file saved to {path}")

        data["image_path"] = "/images/"+filename # remember we need the relative path from inside the public directory

    insert_result = recipes.insert_one(data)

    response_body = {
        "results": str(insert_result.inserted_id)
    }
    return str(insert_result.inserted_id)
