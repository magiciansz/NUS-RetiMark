import React, { useState, useEffect, useCallback } from 'react';
// import { useSelector } from 'react-redux';
import './home.css';

// import Placeholder from './ai.png';
import Placeholder from '../../../css/imgs/ai.png';
import Placeholder2 from '../../../css/imgs/img2.jpg';
import Placeholder3 from '../../../css/imgs/img3.png';


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
      <div className='info'>
        <div className='title'>
          Eye Disease Predictor
        </div>
        <div className='description'>
          Description of the predictor
        </div>
      </div>
      <hr class="horizontal-line"></hr>
        <div className='image-input'>
          <div className='image-requirements'>
            The uploaded image should be in line with the following examples: 
          </div>
          <div className='images'>
            <div className='image'>
              <img src={Placeholder} alt="Example" /> 
              <div className='req'>
                clear image
              </div>
            </div>
            <div className='image'>
              <img src={Placeholder2} alt="Example" /> 
              <div className='req'>
                the eye is in the center of the image
              </div>
            </div>
            <div className='image'>
              <img src={Placeholder3} alt="Example" /> 
              <div className='req'>
                picture is not pixelated
              </div>
            </div>
          </div>
          <div className='select-image'>
   
            <div className='buttons'>
              <div className="run-test">
                <label className="add-button">
                  <input type="file" style={{display:'none'}} accept=".jpg, .png" onChange={handleFileChange} />
                  <div className="text">
                    Select Image
                  </div>
                </label>
              </div>
                {/* {previewImage && <div className='run-test'>
                Run predictor
              </div>} */}
            </div>
            {previewImage && <img src={previewImage} className='preview' alt="Preview" />}
          </div>
          {previewImage && <div className='run-test'>
            Run predictor
          </div>}
        </div>
    </div>
  );
}

export default Home;