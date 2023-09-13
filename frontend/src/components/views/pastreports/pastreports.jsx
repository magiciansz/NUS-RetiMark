import React, { useState, useEffect, useCallback, useRef } from 'react';
import {FaSearch} from "react-icons/fa"

import './pastreports.css';


const patients = [
	{name: 'jiahui', age: '22', gender: 'F'},
	{name: 'xianghan', age: '24', gender: 'M'},
	{name: 'jiajun', age: '24', gender: 'M'},
	{name: 'glenn', age: '24', gender: 'M'},
	{name: 'josiah', age: '24', gender: 'M'},
]

const PastReports = () => {
    const [selectedFile, setSelectedFile] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [showReport, setShowReport] = useState(false);
	const [patient, setPatient] = useState()
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [existingPatient, setExistingPatient] = useState(false)
	const [filteredPatients, setFilteredPatients] = useState([])
	const [input, setInput] = useState("");

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
    return (
        <div className='past-reports'>
            <div className='info'>
				<div className='title'>
					Past Reports
				</div>
				<div className='description'>
					{/* Access and review comprehensive medical histories for patients by searching for their name, empowering you with vital historical data for making informed healthcare decisions. */}
                    Streamline your patient care with the ability to access and thoroughly review comprehensive medical histories simply by searching for the patient's name. This invaluable feature equips you with essential historical data, offering insights that empower your decision-making in the field of healthcare.
				</div>
			</div>
            <div className='search-container'>
                <div className='input-wrapper'>
                    <input
                        className='input'
                        placeholder="Search patient"
                        value={input}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                    <div>
                        {input.length === 0 ? <FaSearch id='search-icon' /> : <div className='cross-btn' onClick={() => clearInput()}> X </div>}
                    </div>
                </div>
            </div>
            <div className='results-container'>
                <div className='results-list'>
                    {filteredPatients && filteredPatients.map((p, id) => (
                        <div className='search-results' key={id} onClick={() => handlePatientClick(p)}>{p.name}</div>
                    ))}
                </div>
            </div>
            {/* <div>
                {patient && <div> Selected patient: {patient.name} </div>}
            </div> */}
        </div>
    )
}

export default PastReports