import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


import './home.css';

import Report from './report'
// import Placeholder from './ai.png';
import Placeholder from '../../../css/imgs/ai.png';
import Placeholder2 from '../../../css/imgs/img2.jpg';
import Placeholder3 from '../../../css/imgs/img3.png';


function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [patient, setPatient] = useState()
  // const scrollToRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      // scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // } else {
    //   setSelectedFile(null);
    //   setPreviewImage(null);
    //   alert('Please select a valid JPEG or PNG image file.');
    // }
  };
  const runPredictor = () => {
    // Perform image analysis and generate a report
    // Set the report data or state

    // Show the report when "Run predictor" action occurs
    setShowReport(true);
  };


  // useEffect(() => {
  //     if (previewImage) {
  //         scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
  //     }
  // }, [previewImage]);

  return (
    <div className='home-page'>
      <div className='info'>
        <div className='title'>
          Eye Disease Predictor
        </div>
        <div className='description'>
        The OcularRisk AI Predictor is a cutting-edge platform meticulously designed to analyze medical images of the eye with unparalleled precision. Leveraging the capabilities of advanced artificial intelligence, this system conducts a thorough examination of submitted ocular images to offer insightful predictions regarding potential ocular diseases.
        </div>
      </div>
      {/* <hr class="horizontal-line"></hr> */}
        {!showReport && <div className='image-input'>
          <div className='image-requirements'>
            To start, simply upload an image.
            
            The uploaded image should be in line with the following examples: 
          </div>
          <div className='images'>
            <div className='image'>
              <img src={Placeholder} alt="Example" /> 
              <div className='req'>
                The image is clear
              </div>
            </div>
            <div className='image'>
              <img src={Placeholder2} alt="Example" /> 
              <div className='req'>
                The eye is in the center of the image
              </div>
            </div>
            <div className='image'>
              <img src={Placeholder3} alt="Example" /> 
              <div className='req'>
                The background is plain
              </div>
            </div>
          </div>
          <div className='select-image'>
            <input
                type="text"
                placeholder="Search patient"
                onChange={(e) => setPatient(e.target.value)}
                // value={searchQuery}
              />
            {/* <button>Search</button> */}
            {previewImage && <div className='header'>
              Your selected image for {patient}:
            </div>}
            {previewImage && <img src={previewImage} className='preview' alt="Preview" />}
            
            <div className='buttons'>
              <div className="run-test">
                <label className="add-button">
                  <input type="file" style={{display:'none'}} accept=".jpg, .png" onChange={handleFileChange} />
                  <div className="text">
                    {previewImage ? "Change Image" : "Select Image"}
                  </div>
                </label>
              </div>
            </div>
            {previewImage && <div className='run-test' onClick={runPredictor}>
                Run predictor
            </div>}
          </div>
        </div>}
        {showReport && <Report patient={patient} image={previewImage}/>}
    </div>
  );
}

export default Home;