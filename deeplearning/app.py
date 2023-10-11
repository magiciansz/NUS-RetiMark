import src.routes as routes
import traceback

from flask import Flask, json
from flask.blueprints import Blueprint
from werkzeug.exceptions import HTTPException
from dotenv import load_dotenv
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

@app.errorhandler(Exception)
def handle_exception(e):
    # return jsonify(error=str(e))
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    traceback_str = traceback.format_exc()
    # replace the body with JSON
    response.data = json.dumps({
        "status": e.code,
        "message": e.description,
        "stack": traceback_str,
    }, sort_keys=False)
    response.content_type = "application/json"
    return response

@app.errorhandler(400)
def handle_bad_request(e):
    response = e.get_response()
    traceback_str = traceback.format_exc()
    response.data = json.dumps({
        "status": 400,
        "message": e.description,
        "stack": traceback_str,
    }, sort_keys=False)
    response.content_type = "application/json"
    return response

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        app.register_blueprint(blueprint, url_prefix=os.getenv('APPLICATION_ROOT') + os.getenv('API_PATH_ROOT'))


@app.route(os.getenv('APPLICATION_ROOT') + '/health')
def hello():
    return '<h1>Hello, World!</h1>'
