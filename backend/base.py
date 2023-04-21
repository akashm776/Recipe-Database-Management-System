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

recipes.delete_many({})  # delete all entries in database

recipes.insert_one({'name': 'Meatballs',
                    'ingredients': [{'name': 'ground beef', 'notes': '1lb, preferrably 80%% or above'},
                                    {'name': 'mild sausage', 'notes': '1/2lb'}],
                    'time_mins': 45,
                    'energy': 'moderate',
                    'type': 'dinner',
                    'utensils': ['measuring spoons', '1 bowl', 'stovetop', 'pan', 'baking sheet'],
                    'instructions': '''1) Preheat Oven to 400℉
2) Mix all ingredients but the olive oil in a medium bowl
3) Using your hands, take about 2tbs worth of meat mixture, and form it into a packed ball. Continue this until your bowl is empty and you have an army of uncooked meatballs.
4) Oil a pan using the olive oil and, over medium heat, give each meatball a couple minutes of cooking on 3 sides. I know they’re spheres and don’t have sides.
5) Transfer the half-cooked meatballs to a foil-lined baking tray and bake for 20 minutes or until the insides are up to temp.''',
                    'views': 1,
                    'date_added': datetime.datetime(2023, 3, 26, 6, 36, 48)
                    })

recipes.insert_one({'name': 'Brownies',
                    'ingredients': [{'name': 'semi sweet chocolate', 'notes': '8oz, chopped'},
                                    {'name': 'butter', 'notes': '12tbsp, melted'}],
                    'time_mins': 45,
                    'energy': 'moderate',
                    'type': 'sweets',
                    'utensils': ['measuring spoons', '1 bowl', 'stovetop', '8x8 pan', 'spatula', 'parchment paper', 'whisk', 'some patience'],
                    'instructions': '''1) Preheat Oven to 350℉
2) Line an 8x8 pan with parchment paper and grease
3) Melt 4oz of the chopped chocolate in the microwave.
4) In a large bowl, cream the butter and sugar together with a mixer, then beat in the eggs and vanilla fro 2 minutes until the mixture becomes light and fluffy.
5) Whisk in the melted chocolate. Sift in the flour, cocoa powder, and salt, incorporating them by folding with a spatula.
6) Fold in the remaining 4oz of chopped chocolate and transfer batter to the prepared 8x8 pan.
7) Bake for 20-25 minutes- check using the toothpick method
8) Eat and burn your mouth because you forgot to let them cool''',
                    'views': 3,
                    'date_added': datetime.datetime.utcnow()
                    })

recipes.insert_one({'name': 'Slow Cooker Mashed Potatoes',
                    'ingredients': [{'name': 'potatoes', 'notes': '4lbs'},
                                    {'name': 'butter', 'notes': '1 1/2cups'}],
                    'time_mins': 240,
                    'energy': 'moderate',
                    'type': 'side dish',
                    'utensils': ['measuring spoons', 'cutting board', 'slow cooker', 'knife'],
                    'instructions': '''1) Peel and dice potatoes into ~1in cubes
2) Dump all ingredients except for the milk into crock pot
3) Cook on high for 4 hours
4) Remove the lid and mash the potatoes, mixing in the milk as you go.
5) Eat''',
                    'views': 1,
                    'date_added': datetime.datetime(2022, 4, 13, 23, 2, 27)
                    })

recipes.insert_one({'name': 'Snickerdoodles',
                    'ingredients': [{'name': 'all purpose flour', 'notes': '2 3/4cups'},
                                    {'name': 'cream of tartar', 'notes': '2tsp'}],
                    'time_mins': 20,
                    'energy': 'moderate',
                    'type': 'sweets',
                    'utensils': ['measuring spoons', '2 bowls', 'stove', 'baking sheet'],
                    'instructions': '''1) Preheat Oven to 350℉
2) In a large bowl, cream together butter and sugar. Then add eggs and vanilla and blend well.
3) Mix flour, cream of tartar, baking soda, and salt together in another bowl and then slowly combine wet and dry ingredients.
4) Combine sugar and cinnamon for the cinnamon sugar coating.
5) Scoop out dough and roll into a ball. Roll the ball into the cinnamon sugar coating and set onto an ungreased baking sheet 2 inches apart.
6) Bake for 8-10 minutes''',
                    'views': 4,
                    'date_added': datetime.datetime(2022, 11, 15, 15, 22, 50)
                    })

recipes.insert_one({'name': 'Slow Cooker Honey Teriyaki Chicken',
                    'ingredients': [{'name': 'chicken breasts', 'notes': '2lbs'},
                                    {'name': 'soy sauce', 'notes': '1/2 cup'},
                                    {'name': 'honey', 'notes': '1/2 cup'},
                                    {'name': 'rice wine vinegar',
                                        'notes': '1/4 cup'},
                                    {'name': 'chopped onion', 'notes': '1/2'},
                                    {'name': 'garlic', 'notes': '2 cloves'},
                                    {'name': 'ginger', 'notes': '1 tsp'},
                                    {'name': 'corn flour', 'notes': '3 tbsp'},
                                    {'name': 'water', 'notes': '1/4 cup'}, ],
                    'time_mins': 260,
                    'energy': 'easy',
                    'type': 'dinner',
                    'utensils': ['measuring spoons', 'slow cooker', 'spoon'],
                    'instructions': '''1) Reminder to set your rice to cook if serving over rice.
                2) You could mix the sauce in a separate bowl, but that adds on dishes to do later. Alternatively: mix the soy sauce, ginger, onion, rice wine vinegar, garlic, and pepper inside the crock pot first.
3) Add oil to the mixture as well as the chicken breasts.
4) Because we took a shortcut and didn’t mix the sauce in a separate bowl, make sure to mix the sauce thoroughly over the chicken.
5) Cover and cook on high for 3-4hrs.
6) Remove chicken and drain. Sred using a couple of forks and some determination. 
7) Return the sauce drained to the now shredded chicken and mix.
8) Serve on top of rice.
''',
                    'views': 8,
                    'date_added':datetime.datetime(2021, 1, 1, 1, 1, 1)
                    })

recipes.insert_one({'name': 'Slow Cooker Beef Stew',
                    'ingredients': [{'name': 'flour', 'notes': '1/4 cup'},
                                    {'name': 'black pepper', 'notes': '1/2 tsp'},
                                    {'name': 'garlic powder', 'notes': '1/2 tsp'},
                                    {'name': 'salt', 'notes': '1 tsp'},
                                    {'name': 'stew meat (or cut up chuck roast)',
                                     'notes': '2 lbs'},
                                    {'name': 'olive oil', 'notes': '4 tbsp'},
                                    {'name': 'butter', 'notes': '3 tbsp'},
                                    {'name': 'onion', 'notes': '2 cups'},
                                    {'name': 'garlic', 'notes': '4 cloves'},
                                    {'name': 'red wine (optional)',
                                     'notes': '1 cup'},
                                    {'name': 'beef broth', 'notes': '4 cups'},
                                    {'name': 'beef bouillon', 'notes': '2 cubes'},
                                    {'name': 'worcestershire sauce',
                                        'notes': '2 tbsp'},
                                    {'name': 'tomato paste', 'notes': '3 tbsp'},
                                    {'name': 'medium carrots',
                                        'notes': '5 carrots'},
                                    {'name': 'golden potatoes', 'notes': '1 lb'},
                                    {'name': 'bay leaves', 'notes': '2 leaves'},
                                    {'name': 'rosemary', 'notes': '1 sprig'},
                                    {'name': 'cold water', 'notes': '1/4 cup'},
                                    {'name': 'cornstarch', 'notes': '3 tbsp'}, ],
                    'time_mins': 260,
                    'energy': 'moderate',
                    'type': 'dinner',
                    'utensils': ['measuring spoons', '1 bowl', 'crock pot', 'knife', 'cutting board'],
                    'instructions': '''1) Cut meat, potatoes, onions, and carrots into 1” pieces.
2) Mix everything but the water, cornstarch, and 2 tbsp butter into the crock pot.
3) Cook on high for 4 hrs.
4) After cooking, mix the leftover water and cornstarch together and add to the pot. Mix to thicken.
5) Then, add the last 2 tbsp of butter and mix.
6) Serve.
''',
                    'views': 2,
                    'date_added':datetime.datetime(1993, 8, 7, 0, 2, 17)
                    })


@app.route("/query", methods=['POST'])
def index():
    data = request.get_json()
    name = data["name"]
    sortBy = data["sort"]
    good_ingredients = data["include_ingredients"]
    bad_ingredients = data["exclude_ingredients"]
    print(data)
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
        entry['date_added'] = entry['date_added'].timestamp()
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
        case "type":
            return cursor.sort("type")
        case "time_mins":
            return cursor.sort("time_mins")
        case "energy":
            return cursor.sort("energy")
    return cursor.sort("name").collation(Collation(locale= "en", caseLevel=True))

def listOfIngredients():
    ingredients = []
    for recipe in recipes.find():
        for ingredient in recipe['ingredients']:
            ingredients.append(ingredient['name'])
    return ingredients





