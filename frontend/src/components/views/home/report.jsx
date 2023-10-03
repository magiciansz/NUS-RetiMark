import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Modal from './doc-notes';
import SaveModal from './save-modal';
import { getAccessToken } from '../../auth/Auth';
import PatientApi from '../../../apis/PatientApi';


import './report.css';

function Report({patient, leftEyeImage, rightEyeImage, onSave}) {
    const reportRef = useRef(null);
    const [docNotes, setDocNotes] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [openSaveModal, setOpenSaveModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('Saving In Progress')

    const handleDownloadPDF = () => {
        if (reportRef.current) {
            html2canvas(reportRef.current).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]); // Use canvas dimensions for PDF
                
                // Add the captured image to the PDF
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                
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

    const closeSaveModal = () => {
		setOpenSaveModal(false);
        onSave();
	};

    // const handleSave = () => {
	//     onSave();
	// };

    const handleSave = async () => {
        // First, capture the content of the report as a PDF
        console.log("saving report")
        setModalMessage('Saving In Progress')
        setOpenSaveModal(true)
        if (reportRef.current) {
          html2canvas(reportRef.current).then(async (canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]); // Use canvas dimensions for PDF
            
            // Add the captured image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
            // Convert the PDF to a blob
            const pdfBlob = pdf.output('blob');
      
            // Now, send the PDF blob to the API
            const accessTokenData = await getAccessToken();
            if (accessTokenData) {
                console.log("theres access token", accessTokenData)
                const rightEyeBlob = await fetch(rightEyeImage).then((response) => response.blob());
                const leftEyeBlob = await fetch(leftEyeImage).then((response) => response.blob());

                const requestParams = {
                    accessToken: accessTokenData,
                    leftEye: leftEyeBlob,
                    rightEye: rightEyeBlob,
                    report: pdfBlob,
                };
                try {
                    const res = await PatientApi.createPatient(requestParams);
                    console.log("res from create in save report", res)
                    setModalMessage("Successfully saved!")
                } catch (err) {
                    console.log("failed to call endpoint")
                    setModalMessage(err.response.data.status === 401 ? "Save failed. Authentication failed." : 
                    "Save failed. A patient with the same name and DOB has been created before.");
                    console.log(err.response.data.message)
                    console.error(err);
                }
              
            }
          });
        }
        // onSave();
    };
      

    return (
        <div>
            <div className='report-container' id='report-container' >
                <div className='report' ref={reportRef}> 
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
            <div className='button-container'>
                <div className='pdf-button'>
                    <div className='button' onClick={handleOpenModal}>
                        Add Doctor's Note
                    </div>
                </div>
                <div className='pdf-button'>
                    <div className='button' onClick={handleDownloadPDF}>
                        Download PDF
                    </div>
                </div>
            </div>
            <SaveModal isOpen={openSaveModal} onClose={closeSaveModal} modalMessage={modalMessage}/>
            <div className='download-button'>
                <div className='button' onClick={handleSave}>
                    Save
                </div>
            </div>
            
        </div>
    );
}

export default Report;