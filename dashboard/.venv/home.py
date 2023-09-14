import numpy as np
import pandas as pd
import random
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
def query_patient_value(dict, id, visit_date, column_name):
  record_list = dict[id]
  record = {}
  for e in record_list:
    if e['visit_date'] == visit_date:
      record = e
      print(e)
  if record:
    return record[column_name]
  else:
    return None
  
def query_risk(dataset, patient_id, disease, laterality, stage):
    code = ""
    if (disease == 'Diabetic Retinopathy'):
        risk_col = laterality + '_diabetic_retinopathy_stage_' + str(stage)
        # code = '_diabetic_retinopathy'
    elif (disease == 'Age-related Macular Degeneration'):
        risk_col = laterality + '_ocular'
    elif (disease == 'Glaucoma'):
        # code = 'glaucoma'
        risk_col = laterality + '_glaucoma'
    req_risk = dataset[dataset['id'] == patient_id][risk_col]
    return req_risk

def concat_tuples(x):
    return x[0] + ' - ' + x[1]

#demo variables
patient_ids = map(str, patient_series_dict['id'])
patient_names = patient_series_dict['name']
#format id column as a string
# patients['id'] = patient_ids
disease_types = ['Diabetic Retinopathy', 'Age-related Macular Degeneration', 'Glaucoma']
# risk_levels = ['High', 'Medium', 'Low']
stages = ['Stage 1 Risk', 'Stage 2 Risk', 'Stage 3 Risk']


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
            patient_w_id_options = zip(patient_ids, patient_names)
            selected_patient_id_selectbox = st.selectbox(label='Patient', options=patient_w_id_options, format_func = concat_tuples, help='Search patient by name or id', placeholder='Select a patient')
            selected_patient_id = selected_patient_id_selectbox[0]
        with filter2:
            selected_disease_type = st.selectbox(label='Disease', options=disease_types, help='Select disease type')
        with filter3:
            selected_date = st.selectbox(label='Date', options=["12/09/21", "25/11/21", "03/05/22", "18/08/22", "30/01/23"], help='Select visit date')

    info, left, right = st.columns([0.35, 0.275, 0.275])
    temp_index = patients[patients['id'] == selected_patient_id]['id']
    with info:
        st.subheader("Patient Details")
        st.write(f"**Patient ID:** {selected_patient_id}")
        #query patient's age
        temp_age = patients[patients['id'] == selected_patient_id]['age'].astype(int).to_string(index=False)
        st.write(f"**Age:** {temp_age}")
        #query patient's sex
        temp_sex = patients[patients['id'] == selected_patient_id]['sex'].to_string(index=False)
        st.write(f"**Sex:** {temp_sex}")
        #query notes
        temp_notes = patients[patients['id'] == selected_patient_id]['notes'].to_string(index=False)
        st.markdown(f"**Notes:** {temp_notes}")
        #query date
        temp_upload_date = patients[patients['id'] == selected_patient_id]['last_upload_date'].to_string(index=False)
        st.write(f"**Last Upload Date:** {temp_upload_date}")
        #query diagnosed date
        #placeholder information for now
        temp_diagnosed_date = patients[patients['id'] == selected_patient_id]['last_diagnosed_date'].to_string(index=False)
        st.write(f"**Diagnosed Date:** {temp_diagnosed_date}")
        
    with left:
        st.subheader("Left Fundus")
        left_img_url = patients[patients['id'] == selected_patient_id]['left_eye_image'].to_string(index=False)
        st.image(left_img_url, use_column_width="auto")
        # right_risk = query_risk(patients, selected_patient_id, selected_disease_type, 'right', 1)*100
        left_risk = query_risk(patients, selected_patient_id, selected_disease_type, 'left', 1)*100
        # overall_risk = (right_risk+left_risk)/2
        stage, risk = st.columns([0.5, 0.5])
        with stage:
            st.metric("Most Probable Stage", 2)
        with risk:
            st.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
    with right:
        st.subheader("Right Fundus")
        right_img_url = patients[patients['id'] == selected_patient_id]['right_eye_image'].to_string(index=False)
        st.image(right_img_url, use_column_width="auto")
        right_risk = query_risk(patients, selected_patient_id, selected_disease_type, 'right', 1)*100
        # left_risk = query_risk(patients, selected_patient_id, selected_disease_type, 'left', 1)*100
        # overall_risk = (right_risk+left_risk)/2
        # st.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
        stage, risk = st.columns([0.5, 0.5])
        with stage:
            st.metric("Most Probable Stage", 2)
        # st.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
        with risk:
            st.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')

    st.divider()
    st.subheader("Risk Trend")
    st.line_chart(chart_data)

elif st.session_state["authentication_status"] is False:
    st.error('Username/password is incorrect')
elif st.session_state["authentication_status"] is None:
    st.warning('Please enter your username and password')