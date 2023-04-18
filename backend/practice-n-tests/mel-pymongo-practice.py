# I made this following along with this tutorial:
# https://pymongo.readthedocs.io/en/stable/tutorial.html

from pymongo import MongoClient
from pymongo.collation import Collation
import pymongo
client = MongoClient('localhost', 27017)

db = client['test_database']
# same as: db = client.test_database
collection = db['test-collection']
# my understanding is that bc of the hyphen, collection = db.test-collection
# would not work here.
# This collection never gets created bc Mongo is lazy and will not create it
# until it would be used, and this one never gets used.

import datetime
post = {"author": "Mike",
        "text": "My first blog post!",
        "tags" : ["mongodb", "python", "pymongo"],
        "date": datetime.datetime.utcnow(),
        'ingredients':[{'name':'semi sweet chocolate', 'notes':'8oz, chopped'},
                               {'name':'butter', 'notes':'12tbsp, melted'}]}

posts = db.posts
# same as: posts = db['posts']
posts.delete_many({}) # delete all entries in database
post_id = posts.insert_one(post).inserted_id
print(post_id)

print(db.list_collection_names())
print()

import pprint


print("find_one():")
pprint.pprint(posts.find_one())
print()

print("find_one({\"author\": \"Mike\"}):")
pprint.pprint(posts.find_one({"author": "Mike"}))
print()

print("find_one({\"author\": \"Eliot\"}):")
pprint.pprint(posts.find_one({"author": "Eliot"}))
print()

print("find_one({\"_id\": post_id}):")
pprint.pprint(posts.find_one({"_id": post_id}))
print()

print("find_one({\"_id\": post_id_as_str}):")
post_id_as_str = str(post_id)
pprint.pprint(posts.find_one({"_id": post_id_as_str}))
print()

from bson.objectid import ObjectId

# apparently web frameworks sometimes return the _id as a string, in which case
# we might need cast it as an ObjectId
print("find_one({\"_id\": ObjectId(post_id_as_str)}):")
post_id_as_str = str(post_id)
pprint.pprint(posts.find_one({"_id": ObjectId(post_id_as_str)}))
print()


new_posts = [{"author": "Mike",
              "text": "Another post!",
              "tags": ["bulk", "insert"],
              "date": datetime.datetime(2009, 11, 12, 11, 14),
              "views": 0,
              'ingredients':[{'name':'potatoes', 'notes':'4lbs'},
                               {'name':'butter', 'notes':'1 1/2cups'}]},
              
             {"author": "Eliot",
              "title": "MongoDB is fun",
              "text": "and pretty easy too!",
              "date": datetime.datetime(2009, 11, 10, 10, 45),
              "views": 0, 
              'ingredients':[{'name':'all purpose flour', 'notes':'2 3/4cups'},
                               {'name':'cream of tartar', 'notes':'2tsp'}]},
             {"author": "Chelsea",
              "title": "I require sustenance",
              "text": "Your firstborn will suffice",
              "date": datetime.datetime(1999, 12, 31, 23, 59),
              "views": 0, 
              'ingredients':[{'name':'semi sweet chocolate', 'notes':'8oz, chopped'},
                               {'name':'butter', 'notes':'12tbsp, melted'}]}]
result = posts.insert_many(new_posts)
print(result.inserted_ids)
print()

print("find")
pprint.pprint(list(posts.find().sort("date", pymongo.DESCENDING)))

print("\n")
for post in posts.find():
   # print(post['ingredients'])
    for ingredient in post['ingredients']:
        print(ingredient['name'])

print("Loop")
for post in posts.find():
    pprint.pprint(post)
print()


for post in posts.find({"author": "Mike"}):
    pprint.pprint(post)
print()

# a query where we limit results to posts older than a certain date, but also
# sort the results by author
d = datetime.datetime(2009, 11, 12, 12)
for post in posts.find({"date": {"$lt": d}}).sort("author"):
    pprint.pprint(post)
print()



# regex
import re
print("search for posts by authors whose names match a regex")
the_query = "el"
# this regex matches strings that have a word that starts with "el". If "el" is
# only in the middle of a word, no match. So "Eliot" matches, but "Chelsea"
# does not.
# More python regex info here:
# https://docs.python.org/3/howto/regex.html
regx = re.compile("^" + re.escape(the_query) + "|.*\s" + re.escape(the_query), re.IGNORECASE | re.MULTILINE)
for post in posts.find({"author": regx}):
    pprint.pprint(post)
print()

print("search for posts by authors whose name contains the substring \"el\"")
# this regex matches strings that contain "el"
regx = re.compile(".*" + re.escape(the_query), re.IGNORECASE)
for post in posts.find({"author": regx}):
    pprint.pprint(post)
results = posts.update_many({"author": regx}, {'$inc': {'views': 1}})
print(results.matched_count)
print(results.modified_count)
print()

# Search within list of lists.
print("Search for specific ingredient")
query = "butter"
regx = re.compile(".*" + re.escape(query), re.IGNORECASE)
print(regx)
for post in posts.find({"ingredients.name": regx}).sort("author").collation(Collation(locale= "en", caseLevel=True)):
    pprint.pprint(post)
print()