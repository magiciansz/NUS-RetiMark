import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Modal from './doc-notes';

import './report.css';

function Report({patient, leftEyeImage, rightEyeImage, onSave}) {
    const reportRef = useRef(null);
    const [docNotes, setDocNotes] = useState('')
    const [openModal, setOpenModal] = useState(false)

    const handleDownloadPDF = () => {
        if (reportRef.current) {
            html2canvas(reportRef.current).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Add the captured image to the PDF
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                
                // Save the PDF
                pdf.save('report.pdf');
            });
        }
    };

    const handleOpenModal = () => {
		setOpenModal(true);
	};

    const closeModal = () => {
		setOpenModal(false);
	};

    const doctorNotes = (value) => {
		setDocNotes(value);
	};

    const handleSave = () => {
	    onSave();
	};

    return (
        <div>
            <div className='report-container' id='report-container' ref={reportRef}>
                <div className='report'>
                    <div className='report-header'>
                        REPORT
                    </div>
                    <div className='patient-details'>
                        <div className='sub-header'>
                            Patient details
                        </div>
                        Name: {patient.name}
                        <br/>
                        Age: {patient.age}
                        <br/>
                        Sex: {patient.gender}
                    </div>
                    <div className='eye-image'>
                        <div className='sub-header'>
                            Eye Images
                        </div>
                        <div className='eye-images'>
                            <div className='indiv-eye'>
                                <img src={leftEyeImage}/>
                                <div className='img-caption'>
                                    Left Eye
                                </div>
                            </div>
                            <div className='indiv-eye'>
                                <img src={rightEyeImage}/>
                                <div className='img-caption'>
                                    Right Eye
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='results'>
                        <div className='sub-header'>
                            Results
                        </div>
                        Probability of Diabetic Retinopathy: 70%
                        <br/>
                        Probability of Age-related Macular Degeneration: 50%
                        <br/>
                        Probability of Glaucoma: 20%
                    </div>
                    {docNotes && <div className='doc-notes'>
                        <div className='sub-header'>
                            Doctor's Notes
                        </div>
                        {docNotes}
                    </div>}
                </div>
            </div>
            <Modal isOpen={openModal} onClose={closeModal} doctorNotes={doctorNotes}/>
            <div className='download-button'>
                <div className='button' onClick={handleOpenModal}>
                    Add Doctor's Note
                </div>
            </div>
            <div className='download-button'>
                <div className='button' onClick={handleDownloadPDF}>
                    Download PDF
                </div>
            </div>
            <div className='download-button'>
                <div className='button' onClick={handleSave}>
                    Save
                </div>
            </div>
            
        </div>
    );
}

export default Report;