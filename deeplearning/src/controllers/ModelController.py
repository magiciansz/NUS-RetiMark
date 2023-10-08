"""
Define the REST verbs relative to the users
"""

from flask import request, abort, Response
from flask.json import jsonify
from flask_restful import Resource
from flask_restful.reqparse import Argument
from wtforms import ValidationError

from ..util import parse_params

import requests
from io import BytesIO
import torch
from torch import nn
from torchvision import transforms as T, models
import cv2 as cv
from PIL import Image

from AmdClassifier import EyeClassifier

amdUrl = 'https://amd-retimark.s3.ap-southeast-1.amazonaws.com/amd_state_dict.pth'
amdResponse = requests.get(amdUrl)

amdModel = EyeClassifier()
amdModel.load_state_dict(torch.load(BytesIO(amdResponse.content), map_location=torch.device('cpu')))

def crop_img(image):
    # image = cv.imread(image)
    image = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    _, thresholded = cv.threshold(image, 0, 255, cv.THRESH_OTSU)
    x, y, w, h = cv.boundingRect(thresholded)
    cropped_image = cv.cvtColor(image[y:y+h, x:x+w], cv.COLOR_GRAY2RGB)
    return Image.fromarray(cropped_image)

def preprocess_img(image):
    transform = T.Compose([
            T.Resize([224, 224]),
            T.ToTensor(),
            T.Normalize((0.485, 0.456, 0.406),
                       (0.229, 0.224, 0.225))
        ])
    
    cropped_image = crop_img(image)
    return transform(cropped_image).unsqueeze(0)

class ModelController(Resource):
    def post(self):
        """ Create an user based on the sent information """
        image = request.files['image']

        if not image:
            abort(400, description = 'Please enter an image')

        if not image.mimetype.startswith('image/'):
            abort(400, description = 'The right_eye_image has to be an image of jpeg or png.')
        
        try:
            with torch.no_grad():
                output = amdModel(preprocess_img(image))
        except Exception as e:
            print(e)


        # process left_eye_image and right_eye_image here; variables below are the binaries of the images
        # left_eye_image_binary = left_eye_image.read()
        # right_eye_image_binary = right_eye_image.read()
        # return jsonify({"left_glaucoma_prob": left_eye_image.mimetype})

