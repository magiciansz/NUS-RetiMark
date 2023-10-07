import altair as alt
from copy import deepcopy
import datetime
import extra_streamlit_components as stx
import json
import numpy as np
import pandas as pd
import random
import requests
import streamlit as st
import time

# Streamlit app
st.set_page_config(
    page_title="RetiMark Fundus Dashboard",
    page_icon=":eye:",
    layout="wide"
)

_DEBUG = False

@st.cache_resource(hash_funcs={"_thread.RLock": lambda _: None})
def init_router(): 
    return stx.Router({"/login": login, "/home": home})

@st.cache_resource(experimental_allow_widgets=True)
def get_manager():
    return stx.CookieManager()

cookie_manager = get_manager()
cookies = cookie_manager.get_all()

if (_DEBUG):
    st.subheader("All Cookies:")
    # cookies = cookie_manager.get_all()
    st.write(cookies)
    c1, c2, c3 = st.columns(3)

    with c1:
        st.subheader("Get Cookie:")
        cookie = st.text_input("Cookie", key="0")
        clicked = st.button("Get")
        if clicked:
            value = cookie_manager.get(cookie=cookie)
            st.write(value)
    with c2:
        st.subheader("Set Cookie:")
        cookie = st.text_input("Cookie", key="1")
        val = st.text_input("Value")
        if st.button("Add"):
            cookie_manager.set(cookie, val) # Expires in a day by default
    with c3:
        st.subheader("Delete Cookie:")
        cookie = st.text_input("Cookie", key="2")
        if st.button("Delete"):
            cookie_manager.delete(cookie)





def get_region_from_UTC_offset(val):
    regions = {"+08": "Asia/Singapore", "+09": "Asia/Tokyo"}
    return regions[val]

# timezone = get_region_from_UTC_offset(datetime.datetime.now().astimezone().tzname())



def submitted():
    st.session_state.submitted_login = True
def reset():
    st.session_state.submitted_login = False
def login():
    if 'submitted_login' not in st.session_state:
        st.session_state['submitted_login'] = False
                                                               
    def attempt_login(username, password):
        ##BEGIN API CALL
        # tz_string = datetime.datetime.now().astimezone().tzinfo
        tz_string = get_region_from_UTC_offset(datetime.datetime.now().astimezone().tzname())
        cookie_manager.set(key='time_zone', cookie='time_zone', val=tz_string)
        API_ENDPOINT = "http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/auth/login"
        PARAMS = {'timezone':tz_string}
        data = {
            "username":username,
            "password":password
        }
        try:
            if (_DEBUG):   
                st.write("Entered Try block")
            r = requests.post(url=API_ENDPOINT, params=PARAMS, json=data)
            # r = requests.post(url=API_ENDPOINT, json=data)
            r.raise_for_status()

        except requests.exceptions.HTTPError as err:
            if (_DEBUG):
                st.write("Entered Except block")
                st.json(r.json())
            error_code = r.status_code
            if (error_code==400):
                st.error("Please provide a valid username and password")
            elif (error_code==401):
                st.error("Wrong username or password")
            else:
                st.error("Oops, something went wrong, please contact your administrator: " + str(err))
        else:
            if (_DEBUG):
                st.write("Entered Else block")
            success_json = r.json()
            user_dict = success_json['user']
            tokens_dict = success_json['tokens']

            user_id = user_dict['id']
            user_username = user_dict['username']
            access_token = tokens_dict['accessToken']['token']
            access_token_expiry_time = datetime.datetime.fromisoformat(tokens_dict['accessToken']['expires']).isoformat()
            refresh_token = tokens_dict['refreshToken']['token']
            refresh_token_expiry_time = datetime.datetime.fromisoformat(tokens_dict['accessToken']['expires']).isoformat()

            cookie_manager.set(key='user_username', cookie='user_username', val=user_username)
            cookie_manager.set(key='access_token', cookie='access_token', val=access_token)
            cookie_manager.set(key='access_token_expiry_time', cookie='access_token_expiry_time', val=access_token_expiry_time)
            cookie_manager.set(key='refresh_token', cookie='refresh_token', val=refresh_token)
            cookie_manager.set(key='refresh_token_expiry_time', cookie='refresh_token_expiry_time', val=refresh_token_expiry_time)
            
            # validate_login()
            cookie_manager.set(key='login_status', cookie='login_status', val=True)
            return True
        ##END API CALL
        
    # Create an empty container
    landing = st.container()
    # Insert a form in the container
    with landing:
        with st.form("login"):
            st.markdown("#### Login")
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            success = st.form_submit_button("Login", on_click=submitted)
            # success = st.form_submit_button("Login", on_click=attempt_login, args=[username, password])
    if (st.session_state.submitted_login):
        attempt_login(username, password)
        if (cookie_manager.get(cookie="login_status")):
            router.route("home")
            # If the form is submitted and the email and password are correct,
            # clear the form/container and display a success message
            landing.empty()
            st.success("Login successful")
    elif (not st.session_state.submitted_login):
          return st.warning("Please enter your credentials")
    else:
        st.error("Username/password is incorrect")
    return landing

def home():
    if 'submitted_logout' not in st.session_state:
        st.session_state['submitted_logout'] = False
    
    st.session_state['submitted_login'] = False

    # patients_history = pd.read_csv("./test-data/patient_history_table.csv")
    def get_patient_history():
        ##BEGIN API CALL
        # tz_string = datetime.datetime.now().astimezone().tzinfo
        # tz_string = get_region_from_UTC_offset(datetime.datetime.now().astimezone().tzname())
        # cookie_manager.set(key='time_zone', cookie='time_zone', val=tz_string)
        API_ENDPOINT = "http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/patient-history"
        PARAMS = {'timezone':cookie_manager.get(cookie="time_zone")}
        HEADERS = {
            "Authorization": "Bearer " + cookie_manager.get(cookie="access_token")
        }
        try:
            if (_DEBUG):   
                st.write("Entered Try block")
            r = requests.get(url=API_ENDPOINT, params=PARAMS, headers=HEADERS)
            # r = requests.post(url=API_ENDPOINT, json=data)
            r.raise_for_status()

        except requests.exceptions.HTTPError as err:
            print("Oops, something went wrong, please contact your administrator: " + str(err))
        else:
            if (_DEBUG):
                st.write("Entered Else block")
            res_json = r.json()
            
            return res_json
            ##END API CALL

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
    def strip_time_from_isodatetime(iso_datetime):
        converted = datetime.datetime.fromisoformat(iso_datetime) 
        return converted.date()
    def submitted_logout():
        st.session_state.submitted_logout = True
    def logout():
        ##BEGIN API CALL
        # tz_string = datetime.datetime.now().astimezone().tzinfo
        # tz_string = 'Asia/Singapore'
        API_ENDPOINT = "http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/auth/logout"
        # PARAMS = {'timezone':tz_string}
        # HEADERS={"Content-Type": "application/json"}
        HEADERS = {
            "Authorization": "Bearer " + cookie_manager.get(cookie='access_token')
        }
        data = {
            "refreshToken":cookie_manager.get(cookie='refresh_token')
        }
        try:
            if (_DEBUG):   
                st.write("Entered Try block")
            # r = requests.post(url=API_ENDPOINT, params=PARAMS, json=data)
            r = requests.post(url=API_ENDPOINT, headers=HEADERS, json=data)
            r.raise_for_status()

        except requests.exceptions.HTTPError as err:
            if (_DEBUG):
                st.write("Entered Except block")
            # st.json(r.json)
            # error_code = r.status_code
            # if (error_code=="400"):
            #     st.error("Please provide a valid username and password.")
            # elif (error_code=="401"):
            #     st.error("Wrong username or password.")
            st.error("Oops, something went wrong, please contact your administrator: " + str(err))
        else:
            if (_DEBUG):
                st.write("Entered Else block")
            cookie_manager.set(key='login_status', cookie='login_status', val=False)
            st.session_state.submitted_logout = False
            router.route('login')
            cookie_manager.delete(key='user_username', cookie='user_username')
            cookie_manager.delete(key='access_token', cookie='access_token')
            cookie_manager.delete(key='access_token_expiry_date', cookie='access_token_expiry_time')
            cookie_manager.delete(key='refresh_token', cookie='refresh_token')
            cookie_manager.delete(key='refresh_token_expiry_time', cookie='refresh_token_expiry_time')

            
            # st.experimental_rerun()
            return True
    
    ##END API CALL
    
    patients_history = get_patient_history()
    patient_raw_dict = deepcopy(patients_history)
    #group by id
    patient_dict = patients_history
    #demo variables
    for key in patient_raw_dict.keys():
        patient_raw_dict[key] = patient_raw_dict[key][0]["name"]
    patient_w_id_options_raw = []
    for key,value in patient_raw_dict.items():
        patient_w_id_options_raw.append((key,value))
    #format id column as a string
    disease_types = ['Diabetic Retinopathy', 'Age-related Macular Degeneration', 'Glaucoma']
    
    main = st.container()
    with main:
        st.sidebar.image("http://retimark.com/layout/images/common/logo_on.png")
        st.sidebar.write(f'Welcome, *{cookie_manager.get(cookie="user_username")}*')
        st.sidebar.button(label='Logout', on_click=submitted_logout, key='logout_button')
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
                patient_w_id_options = patient_w_id_options_raw
                patient_w_id_options.sort(key=lambda x: int(x[0]))
                selected_patient_id_selectbox = st.selectbox(label='Patient', options=patient_w_id_options, format_func = concat_tuples, help='Search patient by name or id', placeholder='Select a patient')
                selected_patient_id = selected_patient_id_selectbox[0]
            with filter2:
                selected_disease_type = st.selectbox(label='Disease', options=disease_types, help='Select disease type')
            with filter3:
                selected_patient_date_list = query_patient_multiple(patient_dict, selected_patient_id, ['visit_date'])
                selected_patient_date_list_flatten = sorted([date[0] for date in selected_patient_date_list], reverse=True)
                selected_date = st.selectbox(label='Date', options=selected_patient_date_list_flatten, help='Select visit date', format_func=strip_time_from_isodatetime)

        info, left, right = st.columns([0.35, 0.275, 0.275])

        with info:
            st.subheader("Patient Details")
            st.write(f"**Patient ID:** {selected_patient_id}")
            #query patient's age
            temp_age =  query_patient_value(patient_dict, selected_patient_id, selected_date, 'age')
            st.write(f"**Age:** {temp_age}")
            #query patient's sex
            temp_sex = query_patient_value(patient_dict, selected_patient_id, selected_date, 'sex')
            st.write(f"**Sex:** {temp_sex}")
            #query notes
            temp_notes = query_patient_value(patient_dict, selected_patient_id, selected_date, 'doctor_notes')
            st.markdown(f"**Notes:** {temp_notes}")
            # #query date
            # temp_upload_date = query_patient_value(patient_dict, patient_id, selected_date, 'visit_date')
            # st.write(f"**Last Upload Date:** {temp_upload_date}")
            #query diagnosed date
            #placeholder information for now
            temp_diagnosed_date = query_last_visit_date(selected_date, selected_patient_date_list_flatten)
            if (temp_diagnosed_date!="NA"):
                display_diagnosed_date = strip_time_from_isodatetime(temp_diagnosed_date)
            else:
                display_diagnosed_date = temp_diagnosed_date
            st.write(f"**Last Visit Date:** {display_diagnosed_date}")
            
        with left:
            st.subheader("Left Fundus")
            left_img_url = query_patient_value(patient_dict, selected_patient_id, selected_date, 'left_eye_image')
            st.image(left_img_url, use_column_width="auto")
            left_stage = query_stage(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'left')
            left_risk = query_risk(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'left')
            if (temp_diagnosed_date == "NA"):
                left_risk_prev = 0
            else:
                left_risk_prev = query_risk(patient_dict, selected_patient_id, temp_diagnosed_date, selected_disease_type, 'left')
            stage, risk = st.columns([0.5, 0.5])
            with stage:
                st.metric("Most Probable Stage", left_stage)
            with risk:
                st.metric("Left Eye Risk", str(round(left_risk*100,2))+'%', str(round((left_risk-left_risk_prev)*100,2))+'%', delta_color="inverse")
        with right:
            st.subheader("Right Fundus")
            right_img_url = query_patient_value(patient_dict, selected_patient_id, selected_date, 'right_eye_image')
            st.image(right_img_url, use_column_width="auto")
            right_stage = query_stage(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'right')
            right_risk = query_risk(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'right')
            if (temp_diagnosed_date == "NA"):
                right_risk_prev = 0
            else:
                right_risk_prev = query_risk(patient_dict, selected_patient_id, temp_diagnosed_date, selected_disease_type, 'right')
            stage, risk = st.columns([0.5, 0.5])
            with stage:
                st.metric("Most Probable Stage", right_stage)
            with risk:
                st.metric("Right Eye Risk", str(round(right_risk*100,2))+'%', str(round((right_risk-right_risk_prev)*100,2))+'%', delta_color="inverse")

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

        if (st.session_state.submitted_logout):
            logout()
            if (_DEBUG):
                st.write("Routing to login")
            # if (cookie_manager.get(cookie="login_status") == False):
                
            #     router.route('login')
    if (cookie_manager.get(cookie='login_status')):   
        return main
    else:
        router.route("login")
        st.warning("You must log in first")

router = init_router()
router.show_route_view()


#routing
if (_DEBUG):
    c1, c2, c3 = st.columns(3)
    with c1:
        st.header("Current route")
        current_route = router.get_url_route()
        st.write(f"{current_route}")
    with c2:
        st.header("Set route")
        new_route = st.text_input("route")
        if st.button("Route now!"):
            router.route(new_route)
    with c3:
        st.header("Session state")
        st.write(st.session_state)
if (st.session_state['stx_router_route'] =="/"):
    router.route("login")
if (st.session_state['stx_router_route'] =="/login" and cookie_manager.get(cookie='login_status')):
    router.route("home")