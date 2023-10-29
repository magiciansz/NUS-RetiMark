import React, { useState } from "react";

import "./home.css";
import Report from "./report";
import Modal from "./modal";

import BlurEye from '../../../css/imgs/blur_eye.JPG';
import CroppedEye from '../../../css/imgs/cropped_eye.JPG';
import GoodEye from '../../../css/imgs/eye_right.jpeg';

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
	
	const leftEyeResults = (value) => {
    setLeftEyeRes(value);
  };

  const rightEyeResults = (value) => {
    setRightEyeRes(value);
  };

  const closeReport = () => {
    setShowReport(false);
  };

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
                <img src={BlurEye} alt="Example" />
                <div className="req">Bad example. The image is blur.</div>
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
						leftEyeResults={leftEyeResults}
            rightEyeResults={rightEyeResults}
          />
        </div>
      )}
      {showReport && (
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
