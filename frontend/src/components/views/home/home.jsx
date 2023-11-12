import React, { useState } from "react";

import "./home.css";
import Report from "./report";
import Modal from "./modal";

import Basketball from '../../../css/imgs/basketball.jpeg';
import CroppedEye from '../../../css/imgs/cropped_eye.JPG';
import GoodEye from '../../../css/imgs/eye_right.jpeg';
import Loading from '../../../css/imgs/loading.png'

// Component: Home page
function Home() {
  const [showReport, setShowReport] = useState(false);
  const [patient, setPatient] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leftEye, setLeftEye] = useState(null);
  const [rightEye, setRightEye] = useState(null);
	const [isNewPatient, setIsNewPatient] = useState(false);
	const [leftEyeRes, setLeftEyeRes] = useState(null);
  const [rightEyeRes, setRightEyeRes] = useState(null);
  const [loading, setLoading] = useState(false)

  const runModels = async (image, eye) => {
    const formData = new FormData();
    formData.append("image", image);
    setLoading(true)
    try {
        const response = await fetch(`${process.env.REACT_APP_FLASK_ENDPOINT_URL}/model-staging/api/v1/model`, {
            method: 'POST',
            body: formData
        })
        const result = await response.json()
        eye == "left" ? setLeftEyeRes(result) : setRightEyeRes(result);
    } catch (error) {
        console.error(error);
    }
    setLoading(false)
};

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleShowReport = (value) => {
    setShowReport(value);
  };

  const selectedPatient = (value) => {
    setPatient(value);
  };

  const leftEyeImage = (value) => {
    setLeftEye(value);
  };

  const rightEyeImage = (value) => {
    setRightEye(value);
  };

  const newPatient = (value) => {
    setIsNewPatient(value);
	};

  const closeReport = () => {
    setShowReport(false);
  };

  const leftEyeFile = (value) => {
    runModels(value, 'left')
  }

  const rightEyeFile = (value) => {
    runModels(value, 'right')
  }

  return (
    <div className="home-page">
      {!showReport && (
        <div>
          <div className="info">
            <div className="title">Eye Disease Predictor</div>
            <div className="description">
              The OcularRisk AI Predictor is a cutting-edge platform
              meticulously designed to analyze medical images of the eye with
              unparalleled precision. Leveraging the capabilities of advanced
              artificial intelligence, this system conducts a thorough
              examination of submitted ocular images to offer insightful
              predictions regarding potential ocular diseases.
            </div>
          </div>
          <div className="instructions">
            <div className="image-requirements">
              To start, simply upload an image. The uploaded image should be in
              line with the following examples:
            </div>
            <div className="images">
              <div className="image">
                <img src={GoodEye} alt="Example" />
                <div className="req">Good example. Image is clear and the entire iris is visible.</div>
              </div>
              <div className="image">
                <img src={CroppedEye} alt="Example" />
                <div className="req">Bad example. The entire iris is not visible in the image.</div>
              </div>
              <div className="image">
                <img src={Basketball} alt="Example" />
                <div className="req">Bad example. The image uploaded is not an image of an eye.</div>
              </div>
            </div>
          </div>
          <div className="btn-div">
            <div className="run-test" onClick={openModal}>
              Start
            </div>
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            showReport={handleShowReport}
            selectedPatient={selectedPatient}
            leftEyeImage={leftEyeImage}
            rightEyeImage={rightEyeImage}
            newPatient={newPatient}
            leftEyeFile={leftEyeFile}
            rightEyeFile={rightEyeFile}
          />
        </div>
      )}
      {loading && <div className='loading-report'>
        <img src={Loading} alt="loading" className='loading-img'/>
      </div>}
      {!loading && showReport && (
        leftEyeRes && rightEyeRes &&
        <Report
          patient={patient}
          leftEyeImage={leftEye}
          rightEyeImage={rightEye}
          onSave={closeReport}
          newPatient={isNewPatient}
          leftEyeResults={leftEyeRes}
          rightEyeResults={rightEyeRes}
          /> 
      )}
    </div>
  );
}

export default Home;
