import React, {
    useState, useEffect, useCallback, useRef, useNavigate 
  } from 'react';
import './doc-notes.css';
import {FaSearch} from "react-icons/fa"

function Modal({ isOpen, onClose, doctorNotes }) {
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        // setUserEdit({ gender: 'male' });
        setNotes('')
        onClose();
    
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        doctorNotes(notes)
        onClose();
    };

    return (
      <div className="modal">
        <div className="modal-content">
            <div className='close-button' onClick={handleClose}>
                X
            </div>
            <h3 className="section-title">Add Doctor's Notes</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    {/* <label htmlFor="doctorNotes">Doctor's Notes</label> */}
                    <textarea
                        id="doctorNotes"
                        name="doctorNotes"
                        // rows="7"
                        // cols="70"
                        value={notes}
                        onChange={handleNotesChange}
                        placeholder="Add doctor's notes here..."
                        required
                        className="custom-textarea"
                    ></textarea>
                </div>
                <button className='save-notes' type="submit">Save Notes</button>
            </form>
        </div>
      </div>
    );
  }
  
  export default Modal

