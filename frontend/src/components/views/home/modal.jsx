import React, {
    useState, useEffect, useCallback, useRef,
  } from 'react';
import './modal.css';


function Modal({ isOpen, onClose}) {
    const [userEdit, setUserEdit] = useState({gender: 'male'});
    if (!isOpen) return null;
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // call postapi to backend 
        console.log('Patient Data:', userEdit);
        setUserEdit({gender: 'male'})
        // Close the modal
        onClose();
    };

    const handleClose = () => {
        setUserEdit({ gender: 'male' });
        onClose();
    };

    console.log(userEdit)
    return (
      <div className="modal">
        <div className="modal-content">
            <div className='close-button' onClick={handleClose}>
                X
            </div>
            <form onSubmit={handleSubmit}>
                <h3 className="section-title">Add New Patient</h3>
                <div className='inputs'>   
                    <div>
                        <label>
                            Name
                        </label>
                        <input
                            className="text-input"
                            type="text"
                            onChange={(e) => { setUserEdit({ ...userEdit, givenName: e.target.value }); }}
                            value={userEdit?.givenName || ''}
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
                            <option value="" disabled hidden>Choose here</option>
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
                <button className='submit-btn' type="submit">Add Patient</button>
            </form>
        </div>
      </div>
    );
  }
  
  export default Modal

