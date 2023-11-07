import React, {
    useState, useEffect, useCallback
  } from 'react';

import './modal.css';
import {FaSearch} from "react-icons/fa"

import PatientApi from '../../../apis/PatientApi';
import { getAccessToken } from '../../auth/Auth';

// Component: Main modal after user clicks on 'Start' button
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
    const [keywords, setKeywords] = useState('')
    const [leftEyeRes, setLeftEyeRes] = useState(null)
    const [rightEyeRes, setRightEyeRes] = useState(null)

    const showHideClassname = isOpen ? ' show-modal' : ' hide-modal';
    
    const handleSubmit = async (e) => {
        e.preventDefault();
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
        const accessTokenData = await getAccessToken();
        if (!accessTokenData) return;
        const requestParams = {
            accessToken: accessTokenData,
        };
        if (keywords) requestParams.query = keywords;
        try {
            const res = await PatientApi.searchPatient(requestParams);
            setFilteredPatients(res.data?.patients);
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
        clearInputs()
        onClose();
    };

    const switchToCreateMode = () => {
        setMode('create');
        setUserEdit({ gender: '' });
        newPatient(true)
    };
    
    const switchToSearchMode = () => {
        setMode('search');
        setInput('');
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
        }
        setMode('next');
    };

    const handleChange = (value) => {
        setInput(value);
        setKeywords(value)
    };

	const clearInput = () => {
        setInput("");   
		setFilteredPatients([])     
    };

    const handlePatientClick = (selectedPatient) => {
		setPatient(selectedPatient);
		setInput(selectedPatient.name); 
		setFilteredPatients([])   
    };
    
    const runModels = async (image, eye) => {
        const formData = new FormData();
        formData.append('image', image)
        try {
            const response = await fetch(`${process.env.REACT_APP_FLASK_ENDPOINT_URL}/model-staging/api/v1/model`, {
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
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const img = new Image();
            img.onload = function () {
                // Checking for dimensions. If any requirements needs to be added, you can
                // add it below. Adding checks for dpi is not possible because dpi depends on the width and height of a user's system.
                const width = this.width;
                const height = this.height;
                const minWidth = 100;
                const minHeight = 100; 

                // Code below defines max file size. can be adapted for min file size as well.
                // const maxFileSize = 1 * 1024 * 1024 * 1024; // 1 GB
                
                // Checking if image meets height and width requirements.
                // Add any requirements below. If you want to access file size, you can use file.size
                // and check it against maxFileSize.
                if (
                    width >= minWidth &&
                    height >= minHeight
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
                    // Image does not meet the requirements, show error message according to which eye doesnt meet requirements
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

