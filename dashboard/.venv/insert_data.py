import datetime
import numpy as np
import pandas as pd
import random
import requests
import time
from home import get_region_from_UTC_offset

#GLOBALS
tz_string = get_region_from_UTC_offset(datetime.datetime.now().astimezone().tzname())
token = "token"
def createPatient(dob, sex, name, left_img_path, right_img_path, lds, ldp, rds, rdp, lop, rop, lgp, rgp, doctors_notes, pdf_path):
        ##BEGIN API CALL
        # tz_string = datetime.datetime.now().astimezone().tzinfo
        # tz_string = 'Asia/Singapore'
        API_ENDPOINT = "http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/patient"
        # PARAMS = {'timezone':tz_string}
        # HEADERS={"Content-Type": "application/json"}
        HEADERS = {
            "Authorization": "Bearer " + token
        }
        data = {
            "date_of_birth": dob,
            "sex":sex,
            "name":name,
            "left_diabetic_retinography_stage":lds,
            "left_diabetic_retinography_prob": ldp,
            "right_diabetic_retinography_stage": rds,
            "right_diabetic_retinography_prob": rdp,
            "left_ocular_prob": lop,
            "right_ocular_prob": rop,
            "left_glaucoma_prob":lgp,
            "right_glaucoma_prob":rgp,
            "doctor_notes": doctors_notes
        }
        files ={
             'report_pdf':open(pdf_path, 'rb'),
             'left_eye_image':open(right_img_path, 'rb'),
             'right_eye_image':open(left_img_path, 'rb')
        }
        try:
            # r = requests.post(url=API_ENDPOINT, params=PARAMS, json=data)
            r = requests.post(url=API_ENDPOINT, headers=HEADERS, data=data, files=files)
            r.raise_for_status()

        except requests.exceptions.HTTPError as err:
            print("Oops, something went wrong, please contact your administrator: " + str(err))
        else:
            print("Success")
            # st.experimental_rerun()
            return True

    ##END API CALL

createPatient("11-11-1998", "M", "Nanami Kento", "../fundus-images/0_left.jpg", "../fundus-images/0_right.jpg", 1, 0.5, 1, 0.5, 0.3, 0.3, 0.3, 0.2, "healthy eye", "../report.pdf")