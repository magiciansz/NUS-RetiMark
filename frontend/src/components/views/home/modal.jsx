import React, {
    useState, useEffect, useCallback, useRef, useNavigate 
  } from 'react';
import './modal.css';
import {FaSearch} from "react-icons/fa"
const patients = [
	{name: 'jiahui', age: '22', gender: 'F'},
	{name: 'xianghan', age: '24', gender: 'M'},
	{name: 'jiajun', age: '24', gender: 'M'},
	{name: 'glenn', age: '24', gender: 'M'},
	{name: 'josiah', age: '24', gender: 'M'},
]

function Modal({ isOpen, onClose, showReport, selectedPatient, leftEyeImage, rightEyeImage}) {
    const [userEdit, setUserEdit] = useState({gender: ''});
    const [mode, setMode] = useState('');
    const [input, setInput] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([])
    const [patient, setPatient] = useState()
    const [leftEye, setLeftEye] = useState(null);
    const [rightEye, setRightEye] = useState(null);
    const [navigateBack, setNavigateBack] = useState(false);
    // const navigate = useNavigate();

    if (!isOpen) return null;
    // Handle form submission
    const handleSubmit = (e) => {
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
        clearInputs()
        // navigate.push('/reports');
        onClose();
    };

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
        clearInputs()
        onClose();
        

    };

    const switchToCreateMode = () => {
        setMode('create');
        setUserEdit({ gender: '' }); // Clear the userEdit data when switching modes
    };
    
    const switchToSearchMode = () => {
        setMode('search');
        setInput(''); // Clear the search text when switching modes
        setPatient()
        setFilteredPatients([])
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
            })
        }
        setMode('next');
    };

    const fetchData = (value) => {
        const results = patients.filter((user) => {
            return (
              value &&
              user &&
              user.name &&
              user.name.toLowerCase().includes(value)
            );
        });
        setFilteredPatients(results)
        console.log("results", results);
    }

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    };

	const clearInput = () => {
        setInput("");   
		setFilteredPatients([])     
    };

    const handlePatientClick = (selectedPatient) => {
		setPatient(selectedPatient);
		setInput(selectedPatient.name); // Update the search input with the selected patient's name
		setFilteredPatients([])   
	};

    const handleFileChange = (event, eye) => {
		const file = event.target.files[0];
		if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            if (eye === 'left') {
                setLeftEye(URL.createObjectURL(file));
            } else {
                setRightEye(URL.createObjectURL(file));
            }
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

    return (
      <div className="modal">
        <div className="modal-content">
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
                                value={userEdit?.gender?.toLowerCase()}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
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
                            />
                            <div>
                                {input.length === 0 ? <FaSearch id='search-icon' /> : <div className='cross-btn' onClick={() => clearInput()}> X </div>}
                            </div>
                        </div>
                    </div>
                    <div className='results-list'>
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
                                Age: {patient.age} 
                                <br/>
                                Gender: {patient.gender} 
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
                            {leftEye && <img src={leftEye} className='preview' alt="Preview" />}
                    
                        </div>
                        <div className="vertical-line"></div>
                        <div className='right-img-div'>
                            <label className='img-label'>
                                Image of right eye
                            </label>
                            <input type="file" accept=".jpg, .png" onChange={(e) => handleFileChange(e, 'right')} />
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

