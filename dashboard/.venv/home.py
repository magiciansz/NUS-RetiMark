import streamlit as st
import pandas as pd
import numpy as np
import random
# import matplotlib.pyplot as plt

# Create some sample data
chart_data = pd.DataFrame(
    np.random.randn(20, 2),
    columns=['left', 'right'])
fundus_data = pd.read_csv("./test-data/sample_fundus_data.csv")

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
# st.markdown(
#             f'''
#             <style>
#                 .reportview-container .sidebar-content {{
#                     padding-top: {1}rem;
#                 }}
#                 .reportview-container .main .block-container {{
#                     padding-top: {1}rem;
#                 }}
#             </style>
#             ''',unsafe_allow_html=True)

st.title('RetiMark Fundus Dashboard')
# selected_category = st.sidebar.selectbox('Select Category', data['Category'].unique())
st.sidebar.image("http://retimark.com/layout/images/common/logo_on.png")

if st.sidebar.button('Log in', type="primary"):
    st.sidebar.write('Welcome, Dr. Swift')
st.sidebar.button("Sign out", type="secondary")

# old filter code without sidebar
# Filters
with st.expander(label="Search and Filter", expanded=True):
    filter1, filter2 = st.columns(2)
    with filter1:
        selected_patient_id = st.selectbox(label='Patient ID', options=patient_ids, help='Select patient ID')
    with filter2:
        selected_disease_type = st.selectbox(label='Disease', options=disease_types, help='Select disease type')


# Filters
# selected_patient_id = st.sidebar.selectbox(label='Patient ID', options=patient_ids, help='Select patient ID')
# selected_disease_type = st.sidebar.selectbox(label='Disease', options=disease_types, help='Select disease type')

info, left, right = st.columns([0.35, 0.275, 0.275])
temp_index = fundus_data[fundus_data['patient-id'] == selected_patient_id]['index'].to_string(index=False)
with info:
    st.subheader("Patient Details")
    # st.write("**Patient ID:**" + selected_patient_id)
    st.write(f"**Patient ID:** {selected_patient_id}")
    # st.write(selected_patient_id)
    #query patient's age
    temp_age = fundus_data[fundus_data['patient-id'] == selected_patient_id]['age'].to_string(index=False)
    st.write(f"**Age:** {temp_age}")
    #query patient's sex
    temp_sex = fundus_data[fundus_data['patient-id'] == selected_patient_id]['sex'].to_string(index=False)
    st.write(f"**Sex:** {temp_sex}")
    #query symptoms
    temp_symptoms = fundus_data[fundus_data['patient-id'] == selected_patient_id]['symptoms'].to_string(index=False)
    st.write(f"**Notes:** {temp_symptoms}")
    #query date
    temp_date = fundus_data[fundus_data['patient-id'] == selected_patient_id]['last-upload-date'].to_string(index=False)
    st.write(f"**Last Upload Date:** {temp_date}")
    
with left:
    st.subheader("Left")
    st.image("./test-data/fundus-images/" + temp_index + "_left.jpg", use_column_width="auto")
    # st.caption("Left")
    
    right_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'r', 1)*100
    left_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'l', 1)*100
    overall_risk = (right_risk+left_risk)/2
    # st.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
    stage, risk = st.columns([0.5, 0.5])
    with stage:
        st.metric("Most Probable Stage", 2)
    # st.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
    with risk:
        st.metric("Left Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
    # st.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
with right:
    st.subheader("Right")
    st.image("./test-data/fundus-images/" + temp_index + "_right.jpg", use_column_width="auto")
    # st.caption("Right")
    
    right_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'r', 1)*100
    left_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'l', 1)*100
    overall_risk = (right_risk+left_risk)/2
    # st.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
    stage, risk = st.columns([0.5, 0.5])
    with stage:
        st.metric("Most Probable Stage", 2)
    # st.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
    with risk:
        st.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
    # st.subheader("Fundus Images")
    # with st.expander(label="View fundus images", expanded=True):
    # left, right = st.columns(2)
    
    # with left:
    #     st.image("../test-data/fundus-images/" + temp_index + "_left.jpg", use_column_width="auto")
    #     st.caption("Left")
    # with right:
    #     st.image("../test-data/fundus-images/" + temp_index + "_right.jpg", use_column_width="auto")
    #     st.caption("Right")
st.divider()
st.subheader("Risk Trend")
st.line_chart(chart_data)
    
# metrics, chart = st.columns([0.5,0.5])    
# with metrics:
#     tab1, tab2, tab3 = st.tabs(stages)
#     with tab1:
#         col1, col2, col3 = st.columns(3)
#         right_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'r', 1)*100
#         left_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'l', 1)*100
#         overall_risk = (right_risk+left_risk)/2
#         col1.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
#         col2.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
#         col3.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
#     with tab2:
#         col1, col2, col3 = st.columns(3)
#         right_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'r', 2)*100
#         left_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'l', 2)*100
#         overall_risk = (right_risk+left_risk)/2
#         col1.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
#         col2.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
#         col3.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')

#     with tab3:
#         col1, col2, col3 = st.columns(3)
#         right_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'r', 3)*100
#         left_risk = query_risk(fundus_data, selected_patient_id, selected_disease_type, 'l', 3)*100
#         overall_risk = (right_risk+left_risk)/2
#         col1.metric("Overall Risk", overall_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
#         col2.metric("Left Eye Risk", left_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')
#         col3.metric("Right Eye Risk", right_risk.to_string(index=False)+'%', str(random.randint(-5,5))+'%')

# with chart:
#     st.line_chart(chart_data)
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
