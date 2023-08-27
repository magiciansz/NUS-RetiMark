import streamlit as st
import pandas as pd
import numpy as np
# import matplotlib.pyplot as plt

# Create some sample data
data = pd.DataFrame({
    'Date': pd.date_range(start='2023-01-01', periods=10, freq='D'),
    'Value': np.random.randint(10, 100, 10),
    'Category': np.random.choice(['A', 'B', 'C'], 10)
})
fundus_data = pd.read_csv("../test-data/sample_fundus_data.csv")

#demo variables
patient_ids = fundus_data["patient-id"]
disease_types = ['Diabetic Retinopathy', 'Age-related Macular Degeneration', 'Glaucoma']
# risk_levels = ['High', 'Medium', 'Low']
stages = ['Stage 1', 'Stage 2', 'Stage 3']

# Streamlit app
st.set_page_config(
    page_title="RetiMark Fundus Dashboard",
    page_icon=":eye:",
    layout="wide"
)
st.title('RetiMark Fundus Dashboard')
selected_category = st.sidebar.selectbox('Select Category', data['Category'].unique())

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
with body:
    tab1, tab2, tab3 = st.tabs(stages)
    with tab1:
        st.header("A cat")
        st.image("https://static.streamlit.io/examples/cat.jpg", width=200)

    with tab2:
        st.header("A dog")
        st.image("https://static.streamlit.io/examples/dog.jpg", width=200)

    with tab3:
        st.header("An owl")
        st.image("https://static.streamlit.io/examples/owl.jpg", width=200)
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