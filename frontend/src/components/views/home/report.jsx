import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import './report.css';


function Report({patient, image}) {
    const reportRef = useRef(null);
    const handleDownloadPDF = () => {
        if (reportRef.current) {
          // Capture the report component as an image using html2canvas
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
                    Name: {patient}
                    <br/>
                    Age: 22
                    <br/>
                    Sex: Female
                </div>
                <div className='eye-image'>
                    <div className='sub-header'>
                        Eye Image
                    </div>
                    <img src={image}/>
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
            </div>
            
        </div>
        <div className='download-button'>
            <div className='button' onClick={handleDownloadPDF}>
                {/* <button onClick={handleDownloadPDF}>Download PDF</button> */}
                Download PDF
            </div>
        </div>
        </div>
    );
}

export default Report;