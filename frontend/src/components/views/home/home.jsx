import React, { useState, useEffect, useCallback, useRef } from 'react';
import {FaSearch} from "react-icons/fa"

import './home.css';
import Report from './report'
import Modal from './modal';
import SearchBar from './searchbar';
import SearchResults from './searchresults';


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
	  };

	const handleFilterPatients = useCallback(() => {

		setFilteredPatients(patients.filter((p) =>
		  p.name && patient && p.name.toLowerCase().includes(patient.toLowerCase()))
		);
	  }, [patient]);

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
					{existingPatient && <div>
						{/* <input
							type="text"
							placeholder="Search patient"
							value={patient}
							onChange={(e) => {setPatient(e.target.value);}}
						/> */}
						{/* <SearchBar setFilteredPatients={setFilteredPatients}/> */}
						<div className='input-wrapper'>
							<input
								placeholder="Search patient"
								value={input}
								onChange={(e) => handleChange(e.target.value)}
							/>
							<div>
								{input.length === 0 ? <FaSearch id='search-icon' /> : <div onClick={() => clearInput()}> X </div>}
							</div>
						</div>
						<div className='results-list'>
							{filteredPatients && filteredPatients.map((p, id) => (
								<div className='results' key={id} onClick={() => handlePatientClick(p)}>{p.name}</div>
							))}
						</div>
						<div>
							Selected patient: {patient?.name}
						</div>
						{/* <SearchResults patients={filteredPatients} /> */}
					</div>}
					{/* {existingPatient && <div>
						<input
							type="text"
							placeholder="Search patient"
							value={patient}
							onChange={(e) => {
								setPatient(e.target.value);
								handleFilterPatients(); // Call the filter function here
							}}
						/>
						<ul>
						{filteredPatients?.map((patient) => (
							<li key={patient.name}>{patient.name}</li>
						))}
						</ul>

					</div>} */}
					{previewImage && <div className='header'>
						Your selected image for {patient}:
					</div>}
					{previewImage && <img src={previewImage} className='preview' alt="Preview" />}
					{!existingPatient && <div>
						<div className='run-test' onClick={openModal}>
							New Patient
						</div>
						<div className='run-test' onClick={handleExistingPatient}>
							Existing Patient
						</div>	
					</div>}
					
					<Modal isOpen={isModalOpen} onClose={closeModal} />
					
					
					{existingPatient && <div className='buttons'>
						<div className="run-test">
							<label className="add-button">
							<input type="file" style={{display:'none'}} accept=".jpg, .png" onChange={handleFileChange} />
							<div className="text">
								{previewImage ? "Change Image" : "Select Image"}
							</div>
							</label>
						</div>
					</div>}
					{previewImage && <div className='run-test' onClick={runPredictor}>
						Run predictor
					</div>}
				</div>
			</div>}
			{showReport && <Report patient={patient} image={previewImage}/>}
			<div className='prediction-container'>
				{showReport && <div className='new-prediction' onClick={handleNewPrediction}>
					Make a new prediction
				</div>}
			</div>
		</div>
	);
}

export default Home;