from flask import Flask, request

app = Flask(__name__)


@app.route("/query", methods=['POST'])
def index():
    data = request.get_json()
    name = data["name"]
    response_body = {
        "message": f"Recieved POST: {name}"
    }
    return response_body

