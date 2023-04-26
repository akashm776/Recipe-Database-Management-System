from flask import Flask, request
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from pymongo.collation import Collation
from bson.objectid import ObjectId
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
    """ 
    This takes care of filtering and sorting

    Input format:
        data: {
            name: string
            sort: string ("name", "date_added", "views")
            time_mins: int
            ingredients: {"include":list, "exclude":list},
            energy: {"include":list, "exclude":list},
            meal_type: {"include":list, "exclude:list"},
        }
    """
    data = request.get_json()

    cursor = search(data)
    cursor = sort(cursor, data["sort"])

    response_body = {
        "results": convert_to_json(cursor)
    }
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
        entry["_id"] = str(entry["_id"])
    json = str(json).replace("'", '"')  # using ' instead of " will break it
    return json


def search(data):
    name = data["name"]
    regx = re.compile(".*" + re.escape(name), re.IGNORECASE)
    
    search_filters = [{"name":regx}]

    if len(data["ingredients"]["include"]) > 0:
        search_filters.append({"ingredients.name":{"$all": data["ingredients"]["include"]}})
    if len(data["ingredients"]["exclude"]) > 0:
        search_filters.append({"ingredients.name":{"$nin": data["ingredients"]["exclude"]}})

    if len(data["energy"]["include"]) > 0:
        search_filters.append({"energy":{"$in": data["energy"]["include"]}})
    if len(data["energy"]["exclude"]) > 0:
        search_filters.append({"energy":{"$nin": data["energy"]["exclude"]}})

    if len(data["meal_type"]["include"]) > 0:
        search_filters.append({"meal_type":{"$in": data["meal_type"]["include"]}})
    if len(data["meal_type"]["exclude"]) > 0:
        search_filters.append({"meal_type":{"$nin": data["meal_type"]["exclude"]}})

    if data["time_mins"][0] > 0:
        search_filters.append({"time_mins":{"$gte": data["time_mins"][0]}})
    if data["time_mins"][1] > 0:
        search_filters.append({"time_mins":{"$lte": data["time_mins"][1]}})
    
    return recipes.find({"$and":search_filters})

def sort(cursor, sort):
    match sort:
        case "alphabetical":
            return cursor.sort("name").collation(Collation(locale= "en", caseLevel=True))
        case "date":
            return cursor.sort("date_added")
        case "views":
            return cursor.sort("views", pymongo.DESCENDING)
    return cursor.sort("name").collation(Collation(locale= "en", caseLevel=True))


@app.route("/ingredientlist", methods=["GET"])
def listOfIngredients():
    """
    This returns all unique ingredient names in the database
    """
    ingredients = recipes.find().distinct("ingredients.name")
    return json.dumps(ingredients)

@app.route("/fetchrecipe", methods=["POST"])
def fetchRecipe():
    """
    This fetches a recipe given its recipe id (rid)


    Input format:
        data: {
            rid
        }
    """
    data = request.get_json()
    rid = data["rid"]
    recRes = recipes.find_one({"_id": ObjectId(rid["linkRecipeId"])})
    recRes["_id"] = str(recRes["_id"])
    jsonRecipe = str(dict(recRes)).replace("'", '"')
    response_body = {
        "results": jsonRecipe
    }
    return response_body


@app.route("/newrecipe", methods=["POST"])
def new_recipe():
    """
    Creates a new recipe. You need to use formdata because it accepts an image

    Input format:
        image: img
        data: {
            name: string
            ingredients': list of {'name': string, 'notes': string},
            time_mins: int
            energy: string
            meal_type: string
            utensils: list
            instructions: string
            views: int
            date_added: int
            image_path: string relative to public directory ex:'/images/meatball.jpg'
        }
    """
    data = json.loads(request.form['data'])

    print(data)

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


@app.route("/editrecipe", methods=["POST"])
def edit_recipe():
    """
    Similar to new recipe, but needs recipe id

    Input format:
        image: img
        data: {
            _id: int
            name: string
            ingredients': list of {'name': string, 'notes': string},
            time_mins: int
            energy: string
            meal_type: string
            utensils: list
            instructions: string
            views: int
            date_added: int
            image_path: string relative to public directory ex:'/images/meatball.jpg'
        }
    """
    data = json.loads(request.form['data'])
    
    data["_id"] = ObjectId(data["_id"]["linkRecipeId"])
    print(data)

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
    else:
        print("No image provided")
    
    insert_result = "Test"
    insert_result = recipes.replace_one({'_id': data["_id"]}, data)
    print("Number of matches: " + str(insert_result.matched_count) +
               "\nNumber of documents modified: " + str(insert_result.modified_count))
    
    return str(insert_result.modified_count)

@app.route("/incrementviews", methods=["POST"])
def increment_views():
    data = request.get_json()
    rid = ObjectId(data["rid"])
    old_views = data["views"]
    new_views = old_views + 1
    
    view_result = recipes.update_one({'_id': rid}, {'$set': {'views': new_views}}, upsert=False)
    print("Number of matches: " + str(view_result.matched_count) +
               "\nNumber of documents modified: " + str(view_result.modified_count))
    
    return str(view_result.modified_count)

@app.route("/deleterecipe", methods=["POST"])
def delete_reciepe():
    data = request.get_json()
    #data["_id"] = ObjectId(data["_id"]["linkRecipeId"])
    rid = ObjectId(data["rid"])

    delete_result = recipes.delete_one({'_id': rid})

    response_body = {
        "results": str(delete_result.deleted_count)
    }
    return str(delete_result.deleted_count)
