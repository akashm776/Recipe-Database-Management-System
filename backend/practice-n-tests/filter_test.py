from pymongo import MongoClient
from pymongo.collation import Collation
from pymongo import ReturnDocument
import re
import pymongo
import datetime

client = MongoClient('localhost', 27017)
db = client['recipe_db']
recipes = db['recipes']

name = "meat"
bad_ingredients = ["mild sausag"]
good_ingredients = ["ground beef","mild sausage"]
bad_ingredients = []

regx = re.compile(".*" + re.escape(name), re.IGNORECASE)
# ans = recipes.find({"utensils":{"$all": list_of_ingredients}})
# ans = recipes.find({"$and": ["name":regx, "ingredients.name":{"$all": good_ingredients}, "ingredients.name":{"$nin": bad_ingredients}]})
if len(good_ingredients) > 0:
    ans = recipes.find({"$and":[{"name":regx},{"ingredients.name":{"$all": good_ingredients}},{"ingredients.name":{"$nin": bad_ingredients}}]})
else:
    ans = recipes.find({"$and":[{"name":regx},{"ingredients.name":{"$nin": bad_ingredients}}]})
print(list(ans))
