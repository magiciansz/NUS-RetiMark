import streamlit as st
import pandas as pd
import numpy as np
import random
# import matplotlib.pyplot as plt

# Create some sample data
data = pd.DataFrame({
    'Date': pd.date_range(start='2023-01-01', periods=10, freq='D'),
    'Value': np.random.randint(10, 100, 10),
    'Category': np.random.choice(['A', 'B', 'C'], 10)
})
fundus_data = pd.read_csv("../test-data/sample_fundus_data.csv")

#helper functions
def query_risk(dataset, patient_id, disease, laterality, stage):
    code = ""
    if (disease == 'Diabetic Retinopathy'):
        code = 'd'
    elif (disease == 'Age-related Macular Degeneration'):
        code = 'a'
    elif (disease == 'Glaucoma'):
        code = 'g'
    risk_col = code + '-stage' + str(stage) + '-' +laterality + '-risk'
    req_risk = dataset[dataset['patient-id'] == patient_id][risk_col]
    return req_risk

#demo variables
patient_ids = fundus_data["patient-id"]
disease_types = ['Diabetic Retinopathy', 'Age-related Macular Degeneration', 'Glaucoma']
# risk_levels = ['High', 'Medium', 'Low']
stages = ['Stage 1 Risk', 'Stage 2 Risk', 'Stage 3 Risk']

# Streamlit app
st.set_page_config(
    page_title="RetiMark Fundus Dashboard",
    page_icon=":eye:",
    layout="wide"
)
st.title('RetiMark Fundus Dashboard')
# selected_category = st.sidebar.selectbox('Select Category', data['Category'].unique())

# Filters
with st.expander(label="Search and Filter", expanded=True):
    filter1, filter2 = st.columns(2)
    with filter1:
        selected_patient_id = st.selectbox(label='Patient ID', options=patient_ids, help='Select patient ID')
    with filter2:
        selected_disease_type = st.selectbox(label='Disease', options=disease_types, help='Select disease type')
    # with filter2:
    #     selected_risk_level = st.selectbox(label='Risk Level', options=risk_levels, help='Select desired risk level')
    # with filter3:
    #     selected_stage = st.selectbox(label='Stage', options=stages, help='select desired disease stage')

info, body = st.columns([0.2,0.8])
with info:
    st.subheader("Patient Details")
    st.text("Patient ID: " + selected_patient_id)
    #query patient's age
    temp_age = fundus_data[fundus_data['patient-id'] == selected_patient_id]['age'].to_string(index=False)
    st.text("Age: " + temp_age)
    #query patient's sex
    temp_sex = fundus_data[fundus_data['patient-id'] == selected_patient_id]['sex'].to_string(index=False)
    st.text("Sex: " + temp_sex)
    #query symptoms
    temp_symptoms = fundus_data[fundus_data['patient-id'] == selected_patient_id]['symptoms'].to_string(index=False)
    st.text("Doctor's Note: \n" + temp_symptoms)
    #query date
    temp_symptoms = fundus_data[fundus_data['patient-id'] == selected_patient_id]['last-upload-date'].to_string(index=False)
    st.text("Fundus Image Last Upload Date: \n" + temp_symptoms)
    
with body:
    with st.expander(label="Fundus Images", expanded=True):
        left, right = st.columns(2)
        temp_index = fundus_data[fundus_data['patient-id'] == selected_patient_id]['index'].to_string(index=False)
        with left:
            st.subheader("Left Fundus Image")
            st.image("../test-data/fundus-images/" + temp_index + "_left.jpg", use_column_width="auto")
        with right:
            st.subheader("Right Fundus Image")
            st.image("../test-data/fundus-images/" + temp_index + "_right.jpg", use_column_width="auto")
    tab1, tab2, tab3 = st.tabs(stages)
    with tab1:
        col1, col2, col3 = st.columns(3)
        right_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'r', 1)*100
        left_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'l', 1)*100
        overall_risk = (right_risk+left_risk)/2
        col1.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
        col2.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
        col3.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
    with tab2:
        col1, col2, col3 = st.columns(3)
        right_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'r', 2)*100
        left_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'l', 2)*100
        overall_risk = (right_risk+left_risk)/2
        col1.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
        col2.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
        col3.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')

    with tab3:
        col1, col2, col3 = st.columns(3)
        right_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'r', 3)*100
        left_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'l', 3)*100
        overall_risk = (right_risk+left_risk)/2
        col1.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
        col2.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
        col3.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
# filtered_data = data[data['Category'] == selected_category]

# # Placeholder line chart
# st.subheader('Placeholder Line Chart')
# st.line_chart(filtered_data.set_index('Date')['Value'])

# # Bar chart
# st.subheader('Bar Chart')
# category_counts = filtered_data['Category'].value_counts()
# st.bar_chart(category_counts)

# # Show the data
# st.subheader('Filtered Data')
# st.write(filtered_data)

