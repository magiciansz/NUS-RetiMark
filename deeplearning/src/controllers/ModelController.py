"""
Define the REST verbs relative to the users
"""

from flask import request, abort, Response
from flask.json import jsonify
from flask_restful import Resource
from flask_restful.reqparse import Argument
from wtforms import ValidationError

from ..util import parse_params


class ModelController(Resource):
    def post(self):
        """ Create an user based on the sent information """
        left_eye_image = request.files['left_eye_image']
        right_eye_image = request.files['right_eye_image']
        if not left_eye_image or not right_eye_image:
            abort(400, description = 'Please enter a left_eye_image or right_eye_image')
        if not left_eye_image.mimetype.startswith('image/'):
            abort(400, description = 'The left_eye_image has to be an image of jpeg or png.')
        if not right_eye_image.mimetype.startswith('image/'):
            abort(400, description = 'The right_eye_image has to be an image of jpeg or png.')
        

        # process left_eye_image and right_eye_image here; variables below are the binaries of the images
        left_eye_image_binary = left_eye_image.read()
        right_eye_image_binary = right_eye_image.read()
        return jsonify({"left_glaucoma_prob": left_eye_image.mimetype})

