import React, {
    useState, useEffect, useCallback, useRef, useNavigate 
  } from 'react';

import './modal.css';
import {FaAccessibleIcon, FaSearch} from "react-icons/fa"

import PatientApi from '../../../apis/PatientApi';
import Cookies from 'js-cookie';
import { getAccessToken } from '../../auth/Auth';

function Modal({ isOpen, onClose, showReport, selectedPatient, leftEyeImage, rightEyeImage, newPatient, leftEyeResults, rightEyeResults}) {
    const [userEdit, setUserEdit] = useState({gender: ''});
    const [mode, setMode] = useState('');
    const [input, setInput] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([])
    const [patient, setPatient] = useState()
    const [leftEye, setLeftEye] = useState(null);
    const [rightEye, setRightEye] = useState(null);
    const [errorMessageLeftEye, setErrorMessageLeftEye] = useState('');
    const [errorMessageRightEye, setErrorMessageRightEye] = useState('');
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [keywords, setKeywords] = useState('')
    const [leftEyeRes, setLeftEyeRes] = useState(null)
    const [rightEyeRes, setRightEyeRes] = useState(null)

    // if (!isOpen) return null;
    // Handle form submission
    const showHideClassname = isOpen ? ' show-modal' : ' hide-modal';
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // call postapi to backend 
        // console.log('Patient Data:', userEdit);
        // setUserEdit({gender: 'male'})
        console.log("all details")
        console.log("userEdit", userEdit)
        console.log("patient", patient)
        console.log("left eye", leftEye)
        console.log(rightEye)
        // Close the modal
        showReport(true)
        selectedPatient(patient)
        leftEyeImage(leftEye)
        rightEyeImage(rightEye)
        leftEyeResults(leftEyeRes)
        rightEyeResults(rightEyeRes)
        clearInputs()
        onClose();
    };

    const fetchPatients = useCallback(async () => {
        console.log("running fetch patients")
        // setFilteredPatients([]);
        const accessTokenData = await getAccessToken();
        if (!accessTokenData) return;
        console.log("access token in fetch", accessTokenData)
        const requestParams = {
            accessToken: accessTokenData,
        };
        console.log("keywords", keywords)
        if (keywords) requestParams.query = keywords;
        try {
            setLoading(true)
            const res = await PatientApi.searchPatient(requestParams);
            console.log("getting results frm search", res.data)
            setFilteredPatients(res.data?.patients);
            setLoading(false)
        } catch (err) {
        console.error(err);
        }
        

    }, [keywords]);

    const clearInputs = () => {
        setUserEdit({gender: ''})
        setMode('')
        setLeftEye(null)
        setRightEye(null)
        setPatient()
        setInput("")
        setFilteredPatients([])
    }

    const handleClose = () => {
        // setUserEdit({ gender: 'male' });
        console.log("clicking close")
        clearInputs()
        onClose();
        

    };

    const switchToCreateMode = () => {
        setMode('create');
        setUserEdit({ gender: '' }); // Clear the userEdit data when switching modes
        newPatient(true)
    };
    
    const switchToSearchMode = () => {
        setMode('search');
        setInput(''); // Clear the search text when switching modes
        setPatient()
        setFilteredPatients([])
        newPatient(false)
    };

    const switchToNextMode = () => {
        if (
            userEdit.name &&
            userEdit.gender &&
            userEdit.dateOfBirth
        ) {
            const { name, gender, dateOfBirth } = userEdit;
            
            // Calculate age based on date of birth
            const dob = new Date(dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
        
            setPatient({
              name,
              gender,
              age,
              dateOfBirth
            })

            // setPatient(userEdit)
        }
        setMode('next');
    };

    // const fetchData = (value) => {
    //     const results = patients.filter((user) => {
    //         return (
    //           value &&
    //           user &&
    //           user.name &&
    //           user.name.toLowerCase().includes(value)
    //         );
    //     });
    //     setFilteredPatients(results)
    //     console.log("results", results);
    // }

    const handleChange = (value) => {
        setInput(value);
        setKeywords(value)
        // fetchData(value); 
    };

	const clearInput = () => {
        setInput("");   
		setFilteredPatients([])     
    };

    const handlePatientClick = (selectedPatient) => {
		setPatient(selectedPatient);
		setInput(selectedPatient.name); // Update the search input with the selected patient's name
		setFilteredPatients([])   
        console.log("selected patient", selectedPatient)
    };
    
    const runModels = async (image, eye) => {
        const formData = new FormData();
        formData.append('image', image)
        try {
            const response = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/model-staging/api/v1/model`, {
                method: 'POST',
                body: formData
            })
            const result = await response.json()
            console.log(result)
            eye == "left" ? setLeftEyeRes(result) : setRightEyeRes(result)
        } catch (error) {
            console.error(error)
        }
    }

    const handleFileChange = (event, eye) => {
		const file = event.target.files[0];
        console.log("uploading file")
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const img = new Image();
            img.onload = function () {
                const width = this.width;
                const height = this.height;
                
                // Define your image resolution and dimensions requirements
                const minWidth = 100;
                const minHeight = 100; 
                // const maxWidth = 800; 
                // const maxHeight = 800; 
                const minDpi = 95; 
            
                // Calculate DPI based on image dimensions
                const dpi = Math.round((width / (width * 0.0254)));
                console.log("dpi", dpi)
                console.log("width, height", width, height)

                if (
                    width >= minWidth &&
                    height >= minHeight
                    // width <= maxWidth &&
                    // height <= maxHeight
                ) {
                    if (eye === 'left') {
                        setLeftEye(URL.createObjectURL(file));
                        setErrorMessageLeftEye("")
                    } else {
                        setRightEye(URL.createObjectURL(file));
                        setErrorMessageRightEye("")
                    }
                    runModels(file, eye)
                } else {
                    // Image does not meet the requirements
                    console.log("image doesnt fit size")
                    event.target.value = '';
                    if (eye === 'left') {
                        setLeftEye(null)
                        setErrorMessageLeftEye("Image of left eye doesn't follow the requirements. Please upload another image.")
                    } else {
                        setRightEye(null)
                        setErrorMessageRightEye("Image of right eye doesn't follow the requirements. Please upload another image.") 
                    }
                    
                }
            };
            img.src = URL.createObjectURL(file);
        } 
	};

    const isFormValid = () => {
        console.log("in form value", userEdit)
        const { name, gender, dateOfBirth } = userEdit;
    
        // Check if all required fields are filled
        if (name && gender && dateOfBirth) {
            return true;
        }
    
        return false;
    };

    const bothImagesUploaded = () => {
        return leftEye && rightEye;
    };    

    useEffect(() => {   
        fetchPatients();
    }, [fetchPatients]); 

    console.log("filtered patients", filteredPatients)
    console.log("if patient", filteredPatients === true)

    return (
      <div className={`modal${showHideClassname}`}>
        <div className={`modal-content${showHideClassname}`}>
            <div className='close-button' onClick={handleClose}>
                X
            </div>
            {mode === '' && <div className="mode-toggle">
                <button className='mode-btn' onClick={switchToCreateMode}>
                    Create Patient
                </button>
                <button className='mode-btn' onClick={switchToSearchMode}>
                    Search Patient
                </button>
            </div>}
            <form onSubmit={handleSubmit}>
                {mode === 'create' && <div>
                    <h3 className="section-title">Add New Patient</h3>
                    <div className='inputs'>   
                        <div>
                            <label>
                                Name
                            </label>
                            <input
                                className="text-input"
                                type="text"
                                onChange={(e) => { setUserEdit({ ...userEdit, name: e.target.value }); }}
                                value={userEdit?.name || ''}
                                required
                            />
                        </div>
                        <div>
                            <label>
                                Gender
                            </label>
                            <select
                                className="text-input"
                                onChange={(e) => { setUserEdit({ ...userEdit, gender: e.target.value }); }}
                                value={userEdit?.gender}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                        <div>
                            <label>
                                Date of Birth
                            </label>
                            <input
                                className="text-input"
                                type="date"
                                onChange={(e) => { setUserEdit({ ...userEdit, dateOfBirth: e.target.value }); }}
                                value={userEdit?.dateOfBirth || ''}
                                max="1999-12-31"
                                required
                            />
                        </div>
                    </div>
                    <div className={`submit-btn ${!isFormValid() ? 'disabled' : ''}`} onClick={switchToNextMode}>
                        Next
                    </div>
                </div>}
                {mode === 'search' && <div>
                    <h3 className="section-title">Search Existing Patient</h3>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <input
                                className='input'
                                placeholder="Search patient"
                                value={input}
                                onChange={(e) => handleChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <div>
                                {input.length === 0 ? <FaSearch id='search-icon' /> : <div className='cross-btn' onClick={() => clearInput()}> X </div>}
                            </div>
                        </div>
                    </div>
                    <div className='results-list' style={{ height: filteredPatients.length === 0 ? 'auto' : '200px' }}>
                        {filteredPatients && filteredPatients.map((p, id) => (
                            <div className='search-results' key={id} onClick={() => handlePatientClick(p)}>{p.name}</div>
                        ))}
                    </div>
                    <div>
                        {patient && <div className='selected-patient'> 
                            <div className='patient-name'>Patient Details:</div>
                            <div>
                                Name: {patient.name} 
                                <br/>
                                DOB: {patient.date_of_birth} 
                                <br/>
                                Gender: {patient.sex} 
                            </div>
                            <div className='submit-btn' onClick={switchToNextMode}>
                                Next
                            </div>
                        </div>}
                    </div>
                
                
                </div>}
                {mode === 'next' && <div>
                    <h3 className="section-title">Upload Images</h3>
                    <div className='img-container'>
                        <div className='img-div'>
                            <label className='img-label'>
                                Image of left eye
                            </label>
                            <input type="file" accept=".jpg, .png" onChange={(e) => handleFileChange(e, 'left')} />
                            {errorMessageLeftEye && <p className="error-message">{errorMessageLeftEye}</p>}
                            {leftEye && <img src={leftEye} className='preview' alt="Preview" />}
                    
                        </div>
                        <div className="vertical-line"></div>
                        <div className='right-img-div'>
                            <label className='img-label'>
                                Image of right eye
                            </label>
                            <input type="file" accept=".jpg, .png" onChange={(e) => handleFileChange(e, 'right')} />
                            {errorMessageRightEye && <p className="error-message">{errorMessageRightEye}</p>}
                            {rightEye && <img src={rightEye} className='preview' alt="Preview" />}
                        </div>
                    </div>
                    <button className={`submit-btn ${!bothImagesUploaded() ? 'disabled' : ''}`} type="submit" disabled={!bothImagesUploaded()}>Run Predictor</button>   
                </div>}
                
            </form>
        </div>
      </div>
    );
  }
  
  export default Modal

