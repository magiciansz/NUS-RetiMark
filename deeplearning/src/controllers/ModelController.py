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
import numpy as np
import sys
import types

verificationWeightsUrl = 'https://retimark-flask-models.s3.ap-southeast-1.amazonaws.com/validation_state_dict.pth'
verificationModelUrl = 'https://retimark-flask-models.s3.ap-southeast-1.amazonaws.com/ValidationClassifier.py'
amdWeightsUrl = 'https://retimark-flask-models.s3.ap-southeast-1.amazonaws.com/amd_state_dict.pth'
amdModelUrl = 'https://retimark-flask-models.s3.ap-southeast-1.amazonaws.com/AmdClassifier.py'
glaucomaWeightsUrl = 'https://retimark-flask-models.s3.ap-southeast-1.amazonaws.com/glaucoma_state_dict.pth'
glaucomaModelUrl = 'https://retimark-flask-models.s3.ap-southeast-1.amazonaws.com/GlaucomaClassifier.py'
diabeticWeightsUrl = 'https://retimark-flask-models.s3.ap-southeast-1.amazonaws.com/diabetic_state_dict.pth'
diabeticModelUrl = 'https://retimark-flask-models.s3.ap-southeast-1.amazonaws.com/DiabeticClassifier.py'

def importModel(weightsUrl, modelUrl, moduleName="imported_module", className="EyeClassifier"):
    response = requests.get(modelUrl)
    module = sys.modules.setdefault(moduleName, types.ModuleType(moduleName))
    exec(response.text, module.__dict__)
    model = getattr(module, className)
    model = model()

    response = requests.get(weightsUrl)
    model.load_state_dict(torch.load(BytesIO(response.content), map_location=torch.device('cpu')))
    model.eval()
    return model

verificationModel = importModel(verificationWeightsUrl, verificationModelUrl)
amdModel = importModel(amdWeightsUrl, amdModelUrl)
glaucomaModel = importModel(glaucomaWeightsUrl, glaucomaModelUrl)
diabeticModel = importModel(diabeticWeightsUrl, diabeticModelUrl)

def crop_img(image):
    image = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    _, thresholded = cv.threshold(image, 0, 255, cv.THRESH_OTSU)
    x, y, w, h = cv.boundingRect(thresholded)
    cropped_image = cv.cvtColor(image[y:y+h, x:x+w], cv.COLOR_GRAY2RGB)
    return Image.fromarray(cropped_image)

def preprocess_img(input):
    content = input.read()
    nparr = np.frombuffer(content, np.uint8)
    image = cv.imdecode(nparr, cv.IMREAD_COLOR)

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
        image = request.files['image']

        if not image:
            abort(400, description = 'Please enter an image')

        if not image.mimetype.startswith('image/'):
            abort(400, description = 'The image has to be of jpeg or png.')
        
        try:
            output = {}
            image = preprocess_img(image)

            with torch.no_grad():
                amdOutput = amdModel(image)
            amdOutput_np = amdOutput.numpy()
            output.update({'amd': amdOutput_np.tolist()[0][0]})

            with torch.no_grad():
                glaucomaOutput = glaucomaModel(image)
            glaucomaOutput_np = glaucomaOutput.numpy()
            output.update({'glaucoma': glaucomaOutput_np.tolist()[0][0]})

            with torch.no_grad():
                diabeticOutput = diabeticModel(image)
            diabeticOutput_np = diabeticOutput.numpy()
            output.update({'diabetic': diabeticOutput_np.tolist()[0][0]})

            return jsonify(output)
        except Exception as e:
            print(e)

class VerifyController(Resource):
    def post(self):
        image = request.files['image']

        if not image:
            abort(400, description = 'Please enter an image')

        if not image.mimetype.startswith('image/'):
            abort(400, description = 'The image has to be of jpeg or png.')
        
        try:
            image = preprocess_img(image)

            with torch.no_grad():
                verificationOutput = verificationModel(image)
            verification_np = verificationOutput.numpy()
            return verification_np.tolist()[0][0] > 0.5

        except Exception as e:
            print(e)
            return -1
