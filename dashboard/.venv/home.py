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

#demo variables
patient_ids = [
    'A1B3C7D', 'E2F4G8H', 'I3J5K9L', 'M4N6P0Q', 'R5S7T1U',
    'V6W8X2Y', 'Z7A9B3C', 'D8E0F4G', 'H9I1J5K', 'L0M2N6P',
    'Q1R3S7T', 'U2V4W8X', 'Y3Z5A9B', 'C4D6E0F', 'G5H7I1J',
    'K6L8M2N', 'P9Q1R3S', 'T0U2V4W', 'X3Y5Z7A', 'B4C6D8E',
    'F5G7H9I', 'J6K8L0M', 'N9P1Q3R', 'S2T4U6V', 'W7X9Y1Z',
    'A3B5C7D', 'E6F8G0H', 'I2J4K6L', 'M0N2P4Q', 'R8S0T2U',
    'V4W6X8Y', 'Z1A3B5C', 'D7E9F1G', 'H5I7J9K', 'L3M5N7P',
    'Q1R3S5T', 'U7V9W1X', 'Y5Z7A9B', 'C3D5E7F', 'G9H1I3J',
    'K5L7M9N', 'P1Q3R5S', 'T7U9V1W', 'X5Y7Z9A', 'B3C5D7E',
    'F9G1H3I', 'J5K7L9M', 'N1P3Q5R', 'S7T9U1V', 'W5X7Y9Z',
    'A2B4C6D', 'E0F2G4H', 'I8J0K2L', 'M4N6P8Q', 'R2S4T6U',
    'V0W2X4Y', 'Z8A0B2C', 'D6E8F0G', 'H4I6J8K', 'L2M4N6P',
    'Q0R2S4T', 'U8V0W2X', 'Y6Z8A0B', 'C4D6E8F', 'G2H4I6J',
    'K0L2M4N', 'P8Q0R2S', 'T6U8V0W', 'X4Y6Z8A', 'B2C4D6E',
    'F0G2H4I', 'J8K0L2M', 'N6P8Q0R', 'S4T6U8V', 'W2X4Y6Z',
    'A9B1C3D', 'E7F9G1H', 'I5J7K9L', 'M3N5P7Q', 'R1S3T5U',
    'V9W1X3Y', 'Z7A9B1C', 'D5E7F9G', 'H3I5J7K', 'L1M3N5P',
    'Q9R1S3T', 'U7V9W1X', 'Y5Z7A9B', 'C3D5E7F', 'G1H3I5J',
    'K9L1M3N', 'P7Q9R1S', 'T5U7V9W', 'X3Y5Z7A', 'B1C3D5E',
    'F9G1H3I', 'J7K9L1M', 'N5P7Q9R', 'S3T5U7V', 'W1X3Y5Z'
]
disease_types = ['Diabetic Retinopathy', 'Age-related Macular Degeneration', 'Glaucoma']
risk_levels = ['High', 'Medium', 'Low']
stages = ['Stage 1', 'Stage 2', 'Stage 3']

# Streamlit app
st.set_page_config(
    page_title="RetiMark Fundus Dashboard",
    page_icon=":eye:",
    layout="wide"
)
st.title('RetiMark Fundus Dashboard')
selected_category = st.sidebar.selectbox('Select Category', data['Category'].unique())

# Filter by category
with st.expander(label="Search and Filter", expanded=True):
    filter1, filter2, filter3 = st.columns(3)
    with filter1:
        selected_patient_id = st.selectbox(label='Patient ID', options=patient_ids, help='Select patient ID')
    # with filter2:
    #     selected_disease_type = st.multiselect(label='Disease', options=disease_types, help='Select one or more diseases', default=None)
    with filter2:
        selected_risk_level = st.selectbox(label='Risk Level', options=risk_levels, help='Select desired risk level')
    with filter3:
        selected_stage = st.selectbox(label='Stage', options=stages, help='select desired disease stage')

info, body = st.columns([0.2,0.8])
with info:
    st.subheader("Patient Details")
with body:
    tab1, tab2, tab3 = st.tabs(disease_types)
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