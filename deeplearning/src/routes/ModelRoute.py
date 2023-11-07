"""
Defines the blueprint for the users
"""
from flask import Blueprint
from flask_restful import Api

from ..controllers.ModelController import ModelController, VerifyController

MODEL_BLUEPRINT = Blueprint("model", __name__)
Api(MODEL_BLUEPRINT).add_resource( ModelController, "/model")

MODEL_BLUEPRINT = Blueprint("verify", __name__)
Api(MODEL_BLUEPRINT).add_resource( VerifyController, "/verify")