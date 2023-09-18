import numpy as np
import pandas as pd
import random
import math
import streamlit as st
import streamlit_authenticator as stauth
import yaml
from yaml.loader import SafeLoader

# Streamlit app
st.set_page_config(
    page_title="RetiMark Fundus Dashboard",
    page_icon=":eye:",
    layout="wide"
)

with open('../config.yaml') as file:
    config = yaml.load(file, Loader=SafeLoader)
authenticator = stauth.Authenticate(
    config['credentials'],
    config['cookie']['name'],
    config['cookie']['key'],
    config['cookie']['expiry_days'],
    config['preauthorized']
)

name, authentication_status, username = authenticator.login('Login', 'main')

# Create some sample data
chart_data = pd.DataFrame(
    np.random.randn(20, 2),
    columns=['left', 'right'])
# patients = pd.read_csv("./test-data/sample_patients.csv")
# patients = pd.read_csv("./test-data/patient.csv")
patients_history = pd.read_csv("./test-data/patient_history_table.csv")

#list like [{column -> value}, … , {column -> value}]
patient_raw_dict = patients_history.to_dict(orient="records")
#dict like {column -> [values]}
patient_series_dict = patients_history.to_dict(orient="list")

#group by id
patient_dict = {}
for d in patient_raw_dict:
  if d['id'] not in patient_dict:
    patient_dict[d['id']] = [d]
  else:
    patient_dict[d['id']].append(d)

#helper functions
#def: this function queries a specific attribute (column) of a patient
#input: dictionary holding the data in record format, id of patient, desired visit date of record, the name of the column/attribute
#output: single value int/str/float depending on the desired column
def query_patient_value(dict, id, visit_date, column_name):
    record_list = dict[id]
    record = {}
    for e in record_list:
        if e['visit_date'] == visit_date:
            record = e
    if record:
        return record[column_name]
    else:
        return "NA"

def encode_disease(disease):
    code = ''
    if (disease == 'Diabetic Retinopathy'):
        code = 'diabetic_retinopathy'
    elif (disease == 'Age-related Macular Degeneration'):
        code = 'ocular'
    elif (disease == 'Glaucoma'):
        code = 'glaucoma'
    return code
#def: this function queries last diagnosed date for a patient under a particular disease context
#input: dictionary holding the data in record format, id of patient, desired visit date of record, disease ('d' for diabetic retinopathy, 'a' for age-related macular degen., 'g' for glaucoma)
#output: single value int/str/float depending on the desired column
def query_last_diagnosed_date(dict, id, visit_date, disease):
    code = encode_disease(disease)
    record_list = dict[id]
    record = {}
    for e in record_list:
        if e['visit_date'] == visit_date:
            record = e
    if record:
        search_col = "last_diagnosed_date_" + code
        answer = record[search_col]
        if str(answer)=="nan":
            return "NA"
        else:
            return answer
    else:
        return "NA"
  
#def: this function returns a list of visit dates under a patient
#input: dictionary holding the data in record format, id of patient
#output: array of dates (str)
def query_patient_visit_dates(dict, id):
    record_list = dict[id]
    date_list = []
    for e in record_list:
      date_list.append(e['visit_date'])
    return date_list

def query_risk(dict, id, visit_date, disease, laterality, stage):
    code = encode_disease(disease)
    if code == 'diabetic_retinopathy':
        risk_col = laterality + '_' + code + '_stage_' + str(stage)
    else:
        risk_col = laterality + '_' + code
    return query_patient_value(dict, id, visit_date, risk_col)

def concat_tuples(x):
    return str(x[0]) + ' - ' + x[1]

#demo variables
patient_ids = patient_series_dict['id']
patient_names = patient_series_dict['name']
#format id column as a string
# patients['id'] = patient_ids
disease_types = ['Diabetic Retinopathy', 'Age-related Macular Degeneration', 'Glaucoma']
# risk_levels = ['High', 'Medium', 'Low']
# stages = ['Stage 1 Risk', 'Stage 2 Risk', 'Stage 3 Risk']


if st.session_state["authentication_status"]:
    st.sidebar.image("http://retimark.com/layout/images/common/logo_on.png")
    st.sidebar.write(f'Welcome, *{st.session_state["name"]}*')
    authenticator.logout('Logout', 'sidebar', key='logout_button')
    logo, title = st.columns([0.08,0.92])
    with title:
        st.title('RetiMark Fundus Dashboard')
    with logo:
        st.image("http://retimark.com/layout/images/common/logo_on.png")
    # selected_category = st.sidebar.selectbox('Select Category', data['Category'].unique())

    # if st.sidebar.button('Log in', type="primary"):
    #     st.sidebar.write('Welcome, Dr. Swift')
    # st.sidebar.button("Sign out", type="secondary")

    # Filters
    with st.expander(label="Search and Filter", expanded=True):
        filter1, filter2, filter3 = st.columns(3)
        with filter1:
            patient_w_id_options = list(set(zip(patient_ids, patient_names)))
            patient_w_id_options.sort()
            selected_patient_id_selectbox = st.selectbox(label='Patient', options=patient_w_id_options, format_func = concat_tuples, help='Search patient by name or id', placeholder='Select a patient')
            selected_patient_id = selected_patient_id_selectbox[0]
        with filter2:
            selected_disease_type = st.selectbox(label='Disease', options=disease_types, help='Select disease type')
        with filter3:
            selected_date = st.selectbox(label='Date', options=query_patient_visit_dates(patient_dict, selected_patient_id), help='Select visit date')

    info, left, right = st.columns([0.35, 0.275, 0.275])
    patient_id = selected_patient_id_selectbox[0]
    with info:
        st.subheader("Patient Details")
        st.write(f"**Patient ID:** {selected_patient_id}")
        #query patient's age
        temp_age =  query_patient_value(patient_dict, patient_id, selected_date, 'age')
        st.write(f"**Age:** {temp_age}")
        #query patient's sex
        temp_sex = query_patient_value(patient_dict, patient_id, selected_date, 'sex')
        st.write(f"**Sex:** {temp_sex}")
        #query notes
        temp_notes = query_patient_value(patient_dict, patient_id, selected_date, 'notes')
        st.markdown(f"**Notes:** {temp_notes}")
        # #query date
        # temp_upload_date = query_patient_value(patient_dict, patient_id, selected_date, 'visit_date')
        # st.write(f"**Last Upload Date:** {temp_upload_date}")
        #query diagnosed date
        #placeholder information for now
        temp_diagnosed_date = query_last_diagnosed_date(patient_dict, patient_id, selected_date, selected_disease_type)
        st.write(f"**Diagnosed Date:** {temp_diagnosed_date}")
        
    with left:
        st.subheader("Left Fundus")
        left_img_url = query_patient_value(patient_dict, patient_id, selected_date, 'left_eye_image')
        st.image(left_img_url, use_column_width="auto")
        left_risk = query_risk(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'left', 0)
        stage, risk = st.columns([0.5, 0.5])
        with stage:
            st.metric("Most Probable Stage", 2)
        with risk:
            st.metric("Left Eye Risk", str(round(left_risk*100,2))+'%', str(random.randint(-5,5))+'%')
    with right:
        st.subheader("Right Fundus")
        right_img_url = query_patient_value(patient_dict, patient_id, selected_date, 'right_eye_image')
        st.image(right_img_url, use_column_width="auto")
        right_risk = query_risk(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'right', 0)
        stage, risk = st.columns([0.5, 0.5])
        with stage:
            st.metric("Most Probable Stage", 2)
        with risk:
            st.metric("Right Eye Risk", str(round(right_risk*100,2))+'%', str(random.randint(-5,5))+'%')

    st.divider()
    st.subheader("Risk Trend")
    st.line_chart(chart_data)

elif st.session_state["authentication_status"] is False:
    st.error('Username/password is incorrect')
elif st.session_state["authentication_status"] is None:
    st.warning('Please enter your username and password')