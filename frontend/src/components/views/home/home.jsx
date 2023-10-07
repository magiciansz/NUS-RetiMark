import React, { useState, useEffect, useCallback, useRef } from 'react';
import {FaSearch} from "react-icons/fa"
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './home.css';
import Report from './report'
import Modal from './modal';


import Placeholder from '../../../css/imgs/ai.png';
import Placeholder2 from '../../../css/imgs/img2.jpg';
import Placeholder3 from '../../../css/imgs/img3.png';

function Home() {
	const [showReport, setShowReport] = useState(false);
	const [patient, setPatient] = useState()
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [leftEye, setLeftEye] = useState(null);
	const [rightEye, setRightEye] = useState(null);
	const [isNewPatient, setIsNewPatient] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		console.log("Before: isModalOpen", isModalOpen);
		setIsModalOpen(false);
		console.log("After: isModalOpen", isModalOpen);
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
	return (
		<div className='home-page'>
			{!showReport && <div>
				<div className='info'>
					<div className='title'>
						Eye Disease Predictor
					</div>
					<div className='description'>
						The OcularRisk AI Predictor is a cutting-edge platform meticulously designed to analyze medical images of the eye with unparalleled precision. Leveraging the capabilities of advanced artificial intelligence, this system conducts a thorough examination of submitted ocular images to offer insightful predictions regarding potential ocular diseases.
					</div>
				</div>
				<div className='instructions'>
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
				</div>
				<div className='btn-div'>
					<div className='run-test' onClick={openModal}>
						Start
					</div>
				</div>
				<Modal isOpen={isModalOpen} onClose={closeModal} showReport={handleShowReport} selectedPatient={selectedPatient} leftEyeImage={leftEyeImage} rightEyeImage={rightEyeImage} newPatient={newPatient}/>
			</div>}
			{showReport && <Report patient={patient} leftEyeImage={leftEye} rightEyeImage={rightEye} onSave={closeReport} newPatient={isNewPatient}/>}
			{/* <div className='prediction-container'>
				{showReport && <div className='new-prediction' onClick={handleNewPrediction}>
					Save
				</div>}
			</div> */}
		</div>
	);
}

export default Home;