import React, {
    useState
  } from 'react';
import './doc-notes.css';

// Component: Doctor's Notes modal
function Modal({ isOpen, onClose, doctorNotes }) {
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
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
                    <textarea
                        id="doctorNotes"
                        name="doctorNotes"
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

