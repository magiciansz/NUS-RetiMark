import React, { useState, useEffect, useCallback } from 'react';
// import { useSelector } from 'react-redux';
import './home.css';

// import Placeholder from './ai.png';
import Placeholder from '../../../css/imgs/ai.png';


function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
      alert('Please select a valid JPEG or PNG image file.');
    }
  };

  return (
    <div className='home-page'>
        <div className='title'>
          Retimark Eye Disease Predictor
        </div>
        <div className='description'>
          Description of the predictor
        </div>
        <br/>
        <div className='image-input'>
          <div className='image-requirements'>
            These are the requirements for the image:
            <br/>
            1. The image should not be pixelated
            <br/>
            2. Input image should follow the following examples 
          </div>
          <div className='images'>
            <div>
              <img src={Placeholder} alt="Example" /> 
              <div>
                req 1 
              </div>
            </div>
            <div>
              <img src={Placeholder} alt="Example" /> 
              <div>
                req 2
              </div>
            </div>
            <div>
              <img src={Placeholder} alt="Example" /> 
              <div>
                req 3
              </div>
            </div>
          </div>
          <div className='select-image'>
            {/* <div>
              Select Image
            </div> */}
            <div className="run-test">
              <label className="add-button">
                <input type="file" style={{display:'none'}} accept=".jpg, .png" onChange={handleFileChange} />
                <div className="text">
                  Select Image
                </div>
              </label>
            </div>
            {previewImage && <img src={previewImage} alt="Preview" />}
          </div>
          


          <div className='run-test'>
            Run predictor
          </div>
        </div>
    </div>
  );
}

export default Home;