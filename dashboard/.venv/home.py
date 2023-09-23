import altair as alt
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import random
import math
import streamlit as st
import streamlit_authenticator as stauth
import yaml
from PIL import Image
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
#def: this function converts name of dieseases into a string format using in the column names of the databse
#input: 'Diabetic Retinopathy', 'Age-related Macular Degeneration' or 'Glaucoma' only
#output: formatted disease names for use in querying db
def encode_disease(disease):
    code = ''
    if (disease == 'Diabetic Retinopathy'):
        code = 'diabetic_retinopathy'
    elif (disease == 'Age-related Macular Degeneration'):
        code = 'ocular'
    elif (disease == 'Glaucoma'):
        code = 'glaucoma'
    return code

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

#def: this function queries last diagnosed date for a patient under a particular disease context
#input: dictionary holding the data in record format, id of patient, desired visit date of record, disease ('d' for diabetic retinopathy, 'a' for age-related macular degen., 'g' for glaucoma)
#output: single value int/str/float depending on the desired column
def query_last_visit_date(curr_date, date_list):
    sorted_dates = sorted(date_list)
    if (sorted_dates.index(curr_date)==0):
        return "NA"
    else:
        return sorted_dates[sorted_dates.index(curr_date)-1]

def get_cutoff_date(list_of_dates):
    list_of_dates = sorted(list_of_dates, reverse=True)
    if (len(list_of_dates)>10):
        return list_of_dates[9]
    else:
        return list_of_dates[-1]
    
#def: this function returns a list of linked values under a patient
#input: dictionary holding the data in record format, id of patient, [desired columns]
#output: array of array of values
def query_patient_multiple(dict, id, col_list):
    record_list = dict[id]
    result = []
    for entry in record_list:
      result.append([entry.get(col) for col in col_list])
    return result

def query_stage(dict, id, visit_date, disease, laterality):
    code = encode_disease(disease)
    if (code in ['ocular', 'glaucoma']):
        return "Unknown"
    else:
        stage_col = laterality + '_' + code + '_stage'
        return query_patient_value(dict, id, visit_date, stage_col)

def query_risk(dict, id, visit_date, disease, laterality):
    code = encode_disease(disease)
    risk_col = laterality + '_' + code + '_prob'
    return query_patient_value(dict, id, visit_date, risk_col)

def concat_tuples(x):
    return str(x[0]) + ' - ' + x[1]

#demo variables
patient_ids = patient_series_dict['id']
patient_names = patient_series_dict['name']
#format id column as a string

disease_types = ['Diabetic Retinopathy', 'Age-related Macular Degeneration', 'Glaucoma']

if st.session_state["authentication_status"]:
    st.sidebar.image("http://retimark.com/layout/images/common/logo_on.png")
    st.sidebar.write(f'Welcome, *{st.session_state["name"]}*')
    authenticator.logout('Logout', 'sidebar', key='logout_button')
    logo, title = st.columns([0.08,0.92])
    with title:
        st.title('RetiMark Fundus Dashboard')
    with logo:
        st.image("http://retimark.com/layout/images/common/logo_on.png")

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
            selected_patient_date_list = query_patient_multiple(patient_dict, selected_patient_id, ['visit_date'])
            selected_patient_date_list_flatten = sorted([date[0] for date in selected_patient_date_list], reverse=True)
            selected_date = st.selectbox(label='Date', options=selected_patient_date_list_flatten, help='Select visit date')

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
        temp_notes = query_patient_value(patient_dict, patient_id, selected_date, 'doctor_notes')
        st.markdown(f"**Notes:** {temp_notes}")
        # #query date
        # temp_upload_date = query_patient_value(patient_dict, patient_id, selected_date, 'visit_date')
        # st.write(f"**Last Upload Date:** {temp_upload_date}")
        #query diagnosed date
        #placeholder information for now
        temp_diagnosed_date = query_last_visit_date(selected_date, selected_patient_date_list_flatten)
        st.write(f"**Last Visit Date:** {temp_diagnosed_date}")
        
    with left:
        st.subheader("Left Fundus")
        left_img_url = query_patient_value(patient_dict, patient_id, selected_date, 'left_eye_image')
        st.image(left_img_url, use_column_width="auto")
        left_stage = query_stage(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'left')
        left_risk = query_risk(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'left')
        stage, risk = st.columns([0.5, 0.5])
        with stage:
            st.metric("Most Probable Stage", left_stage)
        with risk:
            st.metric("Left Eye Risk", str(round(left_risk*100,2))+'%', str(random.randint(-5,5))+'%')
    with right:
        st.subheader("Right Fundus")
        right_img_url = query_patient_value(patient_dict, patient_id, selected_date, 'right_eye_image')
        st.image(right_img_url, use_column_width="auto")
        right_stage = query_stage(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'right')
        right_risk = query_risk(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'right')
        stage, risk = st.columns([0.5, 0.5])
        with stage:
            st.metric("Most Probable Stage", right_stage)
        with risk:
            st.metric("Right Eye Risk", str(round(right_risk*100,2))+'%', str(random.randint(-5,5))+'%')

    st.divider()
    st.subheader("Risk Trend")

    #extract date, risk value L, risk value R, image L, image R
    risk_l_col = "left_" + encode_disease(selected_disease_type) + "_prob"
    risk_r_col = "right_" + encode_disease(selected_disease_type) + "_prob"
    chart_data = query_patient_multiple(patient_dict, selected_patient_id, ['visit_date', risk_l_col, risk_r_col, 'left_eye_image', 'right_eye_image'])

    df = pd.DataFrame(chart_data, columns = ['date', 'risk_l', 'risk_r', 'image_l', 'image_r'])
    melted_df = df.melt(id_vars=['date'], value_vars=['risk_l', 'risk_r'], var_name='laterality', value_name='risk')
    melted_df2 = df.melt(id_vars=['date'], value_vars=['image_l', 'image_r'], var_name='laterality', value_name='image')
    melted_df['laterality'] = melted_df['laterality'].map(lambda x: x[-1])
    melted_df2['laterality'] = melted_df2['laterality'].map(lambda x: x[-1])
    melted_res = melted_df.merge(melted_df2, on=['date', 'laterality'])
    melted_res['laterality'] = melted_df['laterality'].map(lambda x: 'left' if x == 'l' else 'right')
    
    #get 10th or latest date from this patient's record, whichever is smaller
    date_cutoff = get_cutoff_date(selected_patient_date_list_flatten)
    
    melted_res_subset = melted_res[melted_res['date']>= date_cutoff]

    # Create a selection that chooses the nearest point & selects based on x-value
    nearest = alt.selection_point(nearest=True, on='mouseover', fields=['date'], empty=False)

    base = alt.Chart(melted_res).mark_line(point=True).encode(
        alt.X('date:T', axis=alt.Axis(format="%b %Y")),
        alt.Y('risk:Q').axis(format='.2%'),
        alt.Color('laterality').scale(scheme="category10"),
        # alt.Tooltip('risk:Q', format="%", title="Valor"),
        tooltip=['date:T', alt.Tooltip("risk:Q", format=".2%"), 'image']
    )

    selectors = alt.Chart(melted_res).mark_point().encode(
        x='date:T',
        opacity=alt.value(0),
    ).add_params(
        nearest
    )

    # Draw points on the line, and highlight based on selection
    points = base.mark_point().encode(
        opacity=alt.condition(nearest, alt.value(1), alt.value(0))
    )

    # Draw text labels near the points, and highlight based on selection
    text = base.mark_text(align='left', dx=5, dy=-5).encode(
        text=alt.condition(nearest, 'risk:Q', alt.value(' '))
    )

    # Draw a rule at the location of the selection
    rules = alt.Chart(melted_res).mark_rule(color='gray').encode(
        x='date:T',
    ).transform_filter(
        nearest
    )
    curr_date = alt.Chart(pd.DataFrame({
    'date': [selected_date],
    'laterality': ['red']
    })).mark_rule(strokeDash=[6,6]).encode(
    x='date:T',
    color=alt.Color('laterality:N', scale=None)
    )
    st.altair_chart((base+selectors+points+text+rules+curr_date.interactive()), theme="streamlit", use_container_width=True)

elif st.session_state["authentication_status"] is False:
    st.error('Username/password is incorrect')
elif st.session_state["authentication_status"] is None:
    st.warning('Please enter your username and password')