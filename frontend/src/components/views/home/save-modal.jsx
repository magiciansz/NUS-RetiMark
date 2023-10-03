import React, {
    useState, useEffect, useCallback, useRef, useNavigate 
  } from 'react';
import './save-modal.css';
import {FaSearch} from "react-icons/fa"
import Check from '../../../css/imgs/checked.png'
import Cross from '../../../css/imgs/cancel.png'
import Loading from '../../../css/imgs/loading.png'

function SaveModal({ isOpen, onClose, modalMessage}) {

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
    
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose();
    };

    const imageDictionary = {
        'Saving In Progress': Loading, 
        'Successfully saved!': Check,
        'Save failed. Authentication failed.': Cross, 
        'Save failed. A patient with the same name and DOB has been created before.': Cross,
    }

    return (
      <div className="save-modal">
        <div className="save-modal-content">
            <div className='close-button' onClick={handleClose}>
                X
            </div>
            <form onSubmit={handleSubmit}>
                <div className="save-form-group">
                    <img src={imageDictionary[modalMessage]} alt="Example" className='save-img'/> 
                    
                    <p className='modal-msg'>{modalMessage}</p>
                </div>
                <div className='btn-container'>
                    {modalMessage !== 'Saving In Progress' && (
                        <button className='save-btn' type="submit">Make Another Prediction</button>
                    )}
                </div>
            </form>
        </div>
      </div>
    );
  }
  
  export default SaveModal

