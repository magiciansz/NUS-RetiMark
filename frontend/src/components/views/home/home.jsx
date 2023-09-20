import React, { useState, useEffect, useCallback, useRef } from 'react';
import {FaSearch} from "react-icons/fa"
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './home.css';
import Report from './report'
import Modal from './modal';


import Placeholder from '../../../css/imgs/ai.png';
import Placeholder2 from '../../../css/imgs/img2.jpg';
import Placeholder3 from '../../../css/imgs/img3.png';

const patients = [
	{name: 'jiahui', age: '22', gender: 'F'},
	{name: 'xianghan', age: '24', gender: 'M'},
	{name: 'jiajun', age: '24', gender: 'M'},
	{name: 'glenn', age: '24', gender: 'M'},
	{name: 'josiah', age: '24', gender: 'M'},
]


function Home() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [showReport, setShowReport] = useState(false);
	const [patient, setPatient] = useState()
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [existingPatient, setExistingPatient] = useState(false)
	const [filteredPatients, setFilteredPatients] = useState([])
	const [input, setInput] = useState("");
	const [leftEye, setLeftEye] = useState(null);
	const [rightEye, setRightEye] = useState(null);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
		setSelectedFile(file);
		setPreviewImage(URL.createObjectURL(file));
		}
	};

	const runPredictor = () => {
		setShowReport(true);
	};

	const handleNewPrediction = () => {
		setSelectedFile(null)
		setPreviewImage(null)
		setPatient()
		setShowReport(false);
		setExistingPatient(false)
		setInput("")
		setFilteredPatients([])    
	};

	const handleExistingPatient = () => {
        setExistingPatient(true)
    };

	const fetchData = (value) => {
        const results = patients.filter((user) => {
            return (
              value &&
              user &&
              user.name &&
              user.name.toLowerCase().includes(value)
            );
        });
        setFilteredPatients(results)
        console.log("results", results);
    }

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    };

	const clearInput = () => {
        setInput("");   
		setFilteredPatients([])     
    };

	const handlePatientClick = (selectedPatient) => {
		setPatient(selectedPatient);
		setInput(selectedPatient.name); // Update the search input with the selected patient's name
		setFilteredPatients([])   
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
				<Modal isOpen={isModalOpen} onClose={closeModal} showReport={handleShowReport} selectedPatient={selectedPatient} leftEyeImage={leftEyeImage} rightEyeImage={rightEyeImage}/>
			</div>}
			{showReport && <Report patient={patient} leftEyeImage={leftEye} rightEyeImage={rightEye}/>}
			<div className='prediction-container'>
				{showReport && <div className='new-prediction' onClick={handleNewPrediction}>
					Make a new prediction
				</div>}
			</div>
		</div>
	);
}

export default Home;