"""
Defines the blueprint for the users
"""
from flask import Blueprint
from flask_restful import Api

from ..controllers import ModelController

MODEL_BLUEPRINT = Blueprint("model", __name__)
Api(MODEL_BLUEPRINT).add_resource( ModelController, "/model"
)