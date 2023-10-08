"""
Define the REST verbs relative to the users
"""

from flask import request, abort, Response
from flask.json import jsonify
from flask_restful import Resource
from flask_restful.reqparse import Argument
from wtforms import ValidationError

from ..util import parse_params

import torch
from torch import nn
from torchvision import transforms as T, models
import cv2 as cv
from PIL import Image

class ModelController(Resource):
    def post(self):
        """ Create an user based on the sent information """
        image = request.files['image']

        if not image:
            abort(400, description = 'Please enter an  image')

        if not image.mimetype.startswith('image/'):
            abort(400, description = 'The right_eye_image has to be an image of jpeg or png.')
        

        # process left_eye_image and right_eye_image here; variables below are the binaries of the images
        # left_eye_image_binary = left_eye_image.read()
        # right_eye_image_binary = right_eye_image.read()
        # return jsonify({"left_glaucoma_prob": left_eye_image.mimetype})

