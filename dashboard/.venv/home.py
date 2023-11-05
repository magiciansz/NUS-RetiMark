import altair as alt
from copy import deepcopy
import datetime
import extra_streamlit_components as stx
import numpy as np
import pandas as pd
import random
import requests
import streamlit as st
from dotenv import dotenv_values
import os

# Streamlit app
st.set_page_config(
    page_title="RetiMark Fundus Dashboard",
    page_icon=":eye:",
    layout="wide"
)

#Set this to True when debugging, as it will allow you to view all cookies, perform page navigation and print status messages
_DEBUG = False

@st.cache_resource(hash_funcs={"_thread.RLock": lambda _: None})
def init_router(): 
    return stx.Router({"/login": login, "/home": home})

@st.cache_resource(experimental_allow_widgets=True)
def get_manager():
    return stx.CookieManager()
config = dotenv_values(".env")
if not config:
    config = os.environ

cookie_manager = get_manager()
cookies = cookie_manager.get_all()

if (_DEBUG):
    st.subheader("All Cookies:")
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

#def this function returns the region in string format based on UTC offset value
#input: string with +/- and hours difference
#output: string, indicating region as Asia/Singapore or Asia/Tokyo (same as Korea) for now
def get_region_from_UTC_offset(val):
    regions = {"+08": "Asia/Singapore", "+09": "Asia/Tokyo"}
    return regions[val]

#functions to tack login status using sessions states
def submitted():
    st.session_state.submitted_login = True
def reset():
    st.session_state.submitted_login = False
#login function
def login():
    if 'submitted_login' not in st.session_state:
        st.session_state['submitted_login'] = False
                         
    def attempt_login(username, password):
        ##BEGIN API CALL
        # tz_string = datetime.datetime.now().astimezone().tzinfo
        tz_string = get_region_from_UTC_offset(datetime.datetime.now().astimezone().tzname())
        cookie_manager.set(key='time_zone', cookie='time_zone', val=tz_string)
        API_ENDPOINT = config['ENDPOINT_URL']+"/auth/login"
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
        #create 3 columns
        left_space, middle, right_space = st.columns(3)
        with middle:
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
                    #upon successful login, clear the form
                    middle.empty()
    
    
    if (cookie_manager.get(cookie='login_status')):
        cookie_manager.delete(key='login_status', cookie='login_status')
    if (cookie_manager.get(cookie='user_username')):
        cookie_manager.delete(key='user_username', cookie='user_username')
    if (cookie_manager.get(cookie='access_token')):
        cookie_manager.delete(key='access_token', cookie='access_token')
    if (cookie_manager.get(cookie='access_token_expiry_time')):
        cookie_manager.delete(key='access_token_expiry_time', cookie='access_token_expiry_time')
    if (cookie_manager.get(cookie='refresh_token')):
        cookie_manager.delete(key='refresh_token', cookie='refresh_token')
    if (cookie_manager.get(cookie='refresh_token_expiry_time')):
        cookie_manager.delete(key='refresh_token_expiry_time', cookie='refresh_token_expiry_time')
    return landing

def home():
    #initialize session state variables
    if 'submitted_logout' not in st.session_state:
        st.session_state['submitted_logout'] = False
    if 'reset_thresholds' not in st.session_state:
        st.session_state['reset_thresholds'] = False
    if 'no_data_flag' not in st.session_state:
        st.session_state['no_data_flag'] = False
    #set lower and upper bouinds ion session state
    if 'd_lower' not in st.session_state:
        st.session_state['d_lower'] = 0.0
    if 'd_upper' not in st.session_state:
        st.session_state['d_upper'] = 1.0
    if 'o_lower' not in st.session_state:
        st.session_state['o_lower'] = 0.0
    if 'o_upper' not in st.session_state:
        st.session_state['o_upper'] = 1.0
    if 'g_lower' not in st.session_state:
        st.session_state['g_lower'] = 0.0
    if 'g_upper' not in st.session_state:
        st.session_state['g_upper'] = 1.0
    if 'lock_normal_threshold' not in st.session_state:
        st.session_state['lock_normal_threshold'] = False
    if 'lock_disease_threshold' not in st.session_state:
        st.session_state['lock_disease_threshold'] = False
    
    st.session_state['submitted_login'] = False

    def get_patient_history(d_lower, d_upper, o_lower, o_upper, g_lower, g_upper):
        ##BEGIN API CALL
        API_ENDPOINT = config['ENDPOINT_URL']+"/patient-history"
        PARAMS = {
            'timezone':cookie_manager.get(cookie="time_zone"),
            'diabetic_retinopathy_lower_threshold':d_lower,
            'diabetic_retinopathy_upper_threshold':d_upper,
            'ocular_lower_threshold':o_lower,
            'ocular_upper_threshold':o_upper,
            'glaucoma_lower_threshold':g_lower,
            'glaucoma_upper_threshold':g_upper
            }
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
            if (_DEBUG):
                st.write("Entered Except block")
                st.json(r.json())
            error_code = r.status_code
            # if (error_code==400):
            #     st.error("Please provide a valid username and password")
            if (error_code==401):
                router.route("login")
                st.error("Session expired")
            # else:
            #     st.error("Oops, something went wrong, please contact your administrator: " + str(err))
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
        # if curr_date not in date_list:
        #     return sorted_dates[0]
        if (sorted_dates.index(curr_date)==0):
            return "NA"
        else:
            return sorted_dates[sorted_dates.index(curr_date)-1]

    #def: this function returns a list of linked values under a patient
    #input: dictionary holding the data in record format, id of patient, [desired columns]
    #output: array of array of values
    def query_patient_multiple(dict, id, col_list):
        record_list = dict[id]
        result = []
        for entry in record_list:
            result.append([entry.get(col) for col in col_list])
        return result

    def query_risk(dict, id, visit_date, disease, laterality):
        code = encode_disease(disease)
        risk_col = laterality + '_' + code + '_prob'
        return query_patient_value(dict, id, visit_date, risk_col)
    
    ##Formatting related functions
    ##This function takes in a tuple and concatenates the first element with scond element separated by a dash '-'
    def concat_tuples(x):
        return str(x[0]) + ' - ' + x[1]

    #this function parses ISO8601 datetimes into a more readable format
    def strip_time_from_isodatetime(iso_datetime):
        converted = datetime.datetime.fromisoformat(iso_datetime)
        date = converted.date()
        time = converted.time()
        return (str(date)+' '+str(time))

    #functions to track session states
    def submitted_logout():
        st.session_state.submitted_logout = True
    def toggle_reset_thresholds():
        unlock_all_thresholds()
        
        if st.session_state.reset_thresholds:
            st.session_state.reset_thresholds=False
        else:
            st.session_state.reset_thresholds=True
            #Uncomment the below if you would like the filters to be reset every time the button is toggled off
            # st.session_state.d_lower=0.0
            # st.session_state.d_upper=1.0
            # st.session_state.o_lower=0.0
            # st.session_state.o_upper=1.0
            # st.session_state.g_lower=0.0
            # st.session_state.g_upper=1.0

        # set_all_thresholds()
    def set_diabetic_retinopathy_threshold():
        st.session_state.d_lower = d_threshold[0]/100
        st.session_state.d_upper = d_threshold[1]/100
    def set_ocular_threshold():
        st.session_state.o_lower = o_threshold[0]/100
        st.session_state.o_upper = o_threshold[1]/100
    def set_glaucoma_threshold():
        st.session_state.g_lower = g_threshold[0]/100
        st.session_state.g_upper = g_threshold[1]/100
    def set_all_thresholds():
        set_diabetic_retinopathy_threshold()
        set_ocular_threshold()
        set_glaucoma_threshold()
        # unlock_all_thresholds()
    def lock_normal_threshold():
        st.session_state.lock_normal_threshold = True
        st.session_state.lock_disease_threshold = False
        # set_all_thresholds()
    def lock_disease_threshold():
        st.session_state.lock_disease_threshold = True
        st.session_state.lock_normal_threshold = False
        # set_all_thresholds()
    def unlock_normal_threshold():
        st.session_state.lock_normal_threshold = False
    def unlock_disease_threshold():
        st.session_state.lock_disease_threshold = False
    def unlock_all_thresholds():
        unlock_normal_threshold()
        unlock_disease_threshold()
        # set_all_thresholds()
    def logout():
        ##BEGIN API CALL
        API_ENDPOINT = config['ENDPOINT_URL']+"/auth/logout"
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
            st.error("Oops, something went wrong, please contact your administrator: " + str(err))
        else:
            if (_DEBUG):
                st.write("Entered Else block")
            
            st.session_state.submitted_logout = False
            router.route('login')
            cookie_manager.delete(key='login_status', cookie='login_status')
            cookie_manager.delete(key='user_username', cookie='user_username')
            cookie_manager.delete(key='access_token', cookie='access_token')
            cookie_manager.delete(key='access_token_expiry_date', cookie='access_token_expiry_time')
            cookie_manager.delete(key='refresh_token', cookie='refresh_token')
            cookie_manager.delete(key='refresh_token_expiry_time', cookie='refresh_token_expiry_time')
        ##END API CALL

    #retrieving data from database
    if (cookie_manager.get(cookie="access_token")):
        patients_history = get_patient_history(st.session_state.d_lower, st.session_state.d_upper,
                                               st.session_state.o_lower, st.session_state.d_upper,
                                               st.session_state.g_lower, st.session_state.g_upper)
        if (patients_history==None or patients_history=={}):
            st.session_state.no_data_flag = True
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
        st.sidebar.image("./static/retimark-logo_on.png")
        st.sidebar.write(f'Welcome, *{cookie_manager.get(cookie="user_username")}*')
        st.sidebar.button(label='Logout', on_click=submitted_logout, key='logout_button')
        logo, title = st.columns([0.08,0.92])
        with title:
            st.title('RetiMark Fundus Dashboard')
        with logo:
            st.image("./static/retimark-logo_on.png")

        # Filters
        with st.expander(label="Filter Risk Thresholds", expanded=False):
            options1, options2, options3, confirm = st.columns([0.25, 0.3, 0.3, 0.15])
            with options1:
                pre_filter_on = st.toggle('Filter by risk values', on_change=toggle_reset_thresholds, help="Turn on risk level filtering feature")
            with options2:
                if pre_filter_on:
                    use_default_disease = st.button('Show default disease thresholds', on_click=lock_disease_threshold, help="Preset sliders to default thresholds associated with high risk")
                else:
                    use_default_disease = st.button('Show default disease thresholds', disabled=True)
            with options3:
                if pre_filter_on:
                    use_default_normal = st.button('Show default normal thresholds', on_click=lock_normal_threshold, help="Preset sliders to default thresholds associated with low risk")
                else:
                    use_default_normal = st.button('Show default normal thresholds', disabled=True)
            with confirm:
                if pre_filter_on:
                    confirm_sel = st.button('Filter results', on_click=set_all_thresholds, type="primary")
                else:
                    confirm_sel = st.button('Filter results', type="primary", disabled=True)

            pre_filter1, pre_filter2, pre_filter3 = st.columns(3)
            with pre_filter1:
                if pre_filter_on:
                    if use_default_disease or st.session_state.lock_disease_threshold:
                        d_threshold = st.slider("Risk of Diabetic Retinopathy:", 0, 100, (20,100), help="Drag sliders to desired risk thresholds")
                    elif use_default_normal or st.session_state.lock_normal_threshold:
                        d_threshold = st.slider("Risk of Diabetic Retinopathy:", 0, 100, (0,20), help="Drag sliders to desired risk thresholds")
                    else:
                        d_threshold = st.slider("Risk of Diabetic Retinopathy:", 0, 100, (0,100), help="Drag sliders to desired risk thresholds")
                else:
                    d_threshold = st.slider("Risk of Diabetic Retinopathy:", 0, 100, (0,100), disabled=True)
            with pre_filter2:
                if pre_filter_on:
                    if use_default_disease or st.session_state.lock_disease_threshold:
                        o_threshold = st.slider("Risk of Age-related Macular Degeneration:", 0, 100, (20,100), help="Drag sliders to desired risk thresholds")
                    elif use_default_normal or st.session_state.lock_normal_threshold:
                         o_threshold = st.slider("Risk of Age-related Macular Degeneration:", 0, 100, (0,20), help="Drag sliders to desired risk thresholds")
                    else:
                         o_threshold = st.slider("Risk of Age-related Macular Degeneration:", 0, 100, (0,100), help="Drag sliders to desired risk thresholds")
                else:
                     o_threshold = st.slider("Risk of Age-related Macular Degeneration:", 0, 100, (0,100), disabled=True)
            with pre_filter3:
                if pre_filter_on:
                    if use_default_disease  or st.session_state.lock_disease_threshold:
                        g_threshold = st.slider("Risk of Glaucoma:", 0, 100, (20,100), help="Drag sliders to desired risk thresholds")
                    elif use_default_normal  or st.session_state.lock_normal_threshold:
                        g_threshold = st.slider("Risk of Glaucoma:", 0, 100, (0,20), help="Drag sliders to desired risk thresholds")
                    else:
                        g_threshold = st.slider("Risk of Glaucoma:", 0, 100, (0,100), help="Drag sliders to desired risk thresholds")
                else:
                    g_threshold = st.slider("Risk of Glaucoma:", 0, 100, (0,100), disabled=True)
        with st.expander(label="Search and Filter", expanded=True):
            
            try:
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
                    selected_date = st.selectbox(label='Date', options=selected_patient_date_list_flatten, format_func=strip_time_from_isodatetime, help='Select visit date')
            except TypeError as e:
                st.write("No data to display.")
            except UnboundLocalError as e:
                st.write("No data to display.")
        st.session_state['reset_thresholds'] = False

        try:
            # if st.session_state.no_data_flag:
            #     st.write("No data to display")

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
                        #query last visit date
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
                    left_risk = query_risk(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'left')
                    if (temp_diagnosed_date == "NA"):
                        left_risk_prev = 0
                    else:
                        left_risk_prev = query_risk(patient_dict, selected_patient_id, temp_diagnosed_date, selected_disease_type, 'left')
                    
                    if (temp_diagnosed_date != "NA"):
                        st.metric("Left Eye Risk", str(round(left_risk*100,2))+'%', str(round((left_risk-left_risk_prev)*100,2))+'%', delta_color="inverse")
                    else:
                        st.metric("Left Eye Risk", str(round(left_risk*100,2))+'%')
            with right:
                    st.subheader("Right Fundus")
                    right_img_url = query_patient_value(patient_dict, selected_patient_id, selected_date, 'right_eye_image')
                    st.image(right_img_url, use_column_width="auto")
                    right_risk = query_risk(patient_dict, selected_patient_id, selected_date, selected_disease_type, 'right')
                    if (temp_diagnosed_date == "NA"):
                        right_risk_prev = 0
                    else:
                        right_risk_prev = query_risk(patient_dict, selected_patient_id, temp_diagnosed_date, selected_disease_type, 'right')
                    
                    if (temp_diagnosed_date != "NA"):
                        st.metric("Right Eye Risk", str(round(right_risk*100,2))+'%', str(round((right_risk-right_risk_prev)*100,2))+'%', delta_color="inverse")
                    else:
                        st.metric("Right Eye Risk", str(round(right_risk*100,2))+'%')
        except TypeError as e:
                st.write("No data to display.")
        except UnboundLocalError as e:
                st.write("No data to display.")
        
        st.divider()
        
        st.subheader("Risk Trend")

        try:
            #extract date, stage, risk value L, risk value R, image L, image R
            risk_l_col = "left_" + encode_disease(selected_disease_type) + "_prob"
            risk_r_col = "right_" + encode_disease(selected_disease_type) + "_prob"

            chart_data = query_patient_multiple(patient_dict, selected_patient_id, ['visit_date', risk_l_col, risk_r_col, 'left_eye_image', 'right_eye_image'])

            df = pd.DataFrame(chart_data, columns = ['date','risk_l', 'risk_r', 'image_l', 'image_r'])
            melted_df = df.melt(id_vars=['date'], value_vars=['risk_l', 'risk_r'], var_name='laterality', value_name='risk')
            melted_df2 = df.melt(id_vars=['date'], value_vars=['image_l', 'image_r'], var_name='laterality', value_name='image')
            melted_df['laterality'] = melted_df['laterality'].map(lambda x: x[-1])
            melted_df2['laterality'] = melted_df2['laterality'].map(lambda x: x[-1])
            melted_res = melted_df.merge(melted_df2, on=['date', 'laterality'])
            melted_res['laterality'] = melted_df['laterality'].map(lambda x: 'left' if x == 'l' else 'right')

            # Create a selection that chooses the nearest point & selects based on x-value
            nearest = alt.selection_point(nearest=True, on='mouseover', fields=['date'], empty=False)

            base = alt.Chart(melted_res).mark_line(point=True).encode(
                    alt.X('date:T', axis=alt.Axis(format="%b %Y")),
                    alt.Y('risk:Q', title='Risk (%)').axis(format='.2%'),
                    alt.Color('laterality').scale(scheme="category10"),
                    # tooltip=['date:T', alt.Tooltip("risk:Q", format=".2%"), 'image']
                    tooltip=['date:T', alt.Tooltip("risk:Q", format=".2%")]
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
            if selected_disease_type=="Diabetic Retinopathy":
                avg_left = alt.Chart(melted_res).mark_rule(color='#1f77b4', strokeOpacity=0.4, strokeWidth=2).encode(
                    alt.Y('mean(amplified_risk):Q').axis(format='.2%')
                ).transform_filter(alt.FieldEqualPredicate(field='laterality', equal='left'))
                avg_right = alt.Chart(melted_res).mark_rule(color='#ff7f0e', strokeOpacity=0.4, strokeWidth=2).encode(
                alt.Y('mean(amplified_risk):Q').axis(format='.2%')
                ).transform_filter(alt.FieldEqualPredicate(field='laterality', equal='right'))
            else:
                avg_left = alt.Chart(melted_res).mark_rule(color='#1f77b4', strokeOpacity=0.4, strokeWidth=2).encode(
                    alt.Y('mean(risk):Q').axis(format='.2%')
                ).transform_filter(alt.FieldEqualPredicate(field='laterality', equal='left'))
                avg_right = alt.Chart(melted_res).mark_rule(color='#ff7f0e', strokeOpacity=0.4, strokeWidth=2).encode(
                alt.Y('mean(risk):Q').axis(format='.2%')
                ).transform_filter(alt.FieldEqualPredicate(field='laterality', equal='right'))

            curr_date = alt.Chart(pd.DataFrame({
            'date': [selected_date],
            'laterality': ['red']
            })).mark_rule(strokeDash=[6,6]).encode(
            x='date:T',
            color=alt.Color('laterality:N', scale=None)
            )

            st.altair_chart((base+selectors+points+text+rules+avg_left+avg_right+curr_date.interactive()), theme="streamlit", use_container_width=True)
        except TypeError as e:
                st.write("No data to display.")
        except UnboundLocalError as e:
                st.write("No data to display.")

        if (st.session_state.submitted_logout):
            logout()
            if (_DEBUG):
                st.write("Routing to login")
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