import React, { useState, useEffect, useCallback, useRef } from 'react';
import {FaSearch} from "react-icons/fa"
import Cookies from 'js-cookie';
import PatientApi from '../../../apis/PatientApi';
import { getAccessToken } from '../../auth/Auth'
import { BrowserRouter as Router, Route, Link, Switch, useNavigate } from 'react-router-dom';

import './pastreports.css';


const patients = [
	{name: 'jiahui', dateOfBirth: '02-02-2001', gender: 'F'},
	{name: 'xianghan', age: '24', gender: 'M'},
	{name: 'jiajun', age: '24', gender: 'M'},
	{name: 'glenn', age: '24', gender: 'M'},
	{name: 'josiah', age: '24', gender: 'M'},
]

const PastReports = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [showReport, setShowReport] = useState(false);
	const [patient, setPatient] = useState()
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [existingPatient, setExistingPatient] = useState(false)
	const [filteredPatients, setFilteredPatients] = useState([])
	const [input, setInput] = useState("");
    const [pastReports, setPastReports] = useState([])
    const [keywords, setKeywords] = useState('')

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
        setKeywords(value)
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

    const addPatient = useCallback(async (accessToken, rightEye) => {
        console.log("running adding patient func")
        const requestParams = {
            accessToken,
            rightEye
        };
        try {
            const res = await PatientApi.createPatient(requestParams);
            console.log("res from create", res)
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchPatients = useCallback(async () => {
        console.log("running fetch patients")
        // setFilteredPatients([]);
        const accessTokenData = await getAccessToken();
        if (!accessTokenData) return;
        console.log("access token in fetch", accessTokenData)
        const requestParams = {
            accessToken: accessTokenData,
        };
        console.log("keywords", keywords)
        if (keywords) requestParams.query = keywords;
        try {
            const res = await PatientApi.searchPatient(requestParams);
            console.log("getting results frm search", res.data)
            setFilteredPatients(res.data?.patients);
        } catch (err) {
        console.error(err);
        }
        

    }, [keywords]);

    const handleSearch = async () => {
        const accessToken = await getAccessToken();
        console.log("acess in past reports", accessToken)
        if (accessToken) {
            // const requestParams = {
            //     accessToken, 
            //     query: 'jia'
            // };
            // try {
            //     const res = await PatientApi.searchPatient(requestParams);
            //     console.log("res from search", res)
            // } catch (err) {
            //     console.error(err);
            // }

            console.log("came in,", patient)

            const requestParams = {
                accessToken,
                id: patient.id,
                sort: 'descending',
            };
            
            try {
                const res = await PatientApi.getPastReports(requestParams);
                console.log("res from past reports", res)
                setPastReports(res.data?.reports)
            } catch (err) {
                console.error(err);
            }
        } else {
            // change to logout function !! 
            navigate("/login")
            console.log('No valid access token.');
        }

        // setPatient(input);
    };

    // const isFormValid = () => {
    //     console.log("in form value", userEdit)
    //     const { name, gender, dateOfBirth } = userEdit;
    
    //     // Check if all required fields are filled
    //     if (name && gender && dateOfBirth) {
    //         return true;
    //     }
    
    //     return false;
    // };


    useEffect(() => {   
        fetchPatients();
    }, [fetchPatients]); 

    console.log("past reports, patient", patient)
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
                <div className={`search-btn ${!patient ? 'disabled' : ''}`} onClick={() => handleSearch()}>
                    Get Past Reports
                </div>
            </div>
            <div className='results-container' style={{ height: filteredPatients.length === 0 ? 'auto' : '200px' }}>
                <div className='results-list'>
                    {filteredPatients && filteredPatients.map((p, id) => (
                        <div className='search-results' key={id} onClick={() => handlePatientClick(p)}>{p.name}</div>
                    ))}
                </div>
            </div>
            <div>
                <div className='patient-container'>
                    {patient && <div className='patient-details'> 
                        <div>
                            Selected Patient Details:
                        </div>
                        <div>
                            Name: {patient.name}
                        </div>
                        <div>
                            DOB: {patient.date_of_birth}  
                        </div>
                        <div>
                            Sex: {patient.sex}
                        </div>
                    
                    </div>}

                </div>
                
                {pastReports.length > 0 && <div className='report-table'>
                    <table className='table'>
                        <thead className='thead'>
                            <tr className="header">
                                <th>Date</th>
                                <th>Report Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastReports.map((v) => (
                            <tr key={`report${v.version}`}>
                                <td className='td'>{v.visit_date.slice(0, 10)}</td>
                                <td className='td'>
                                    <a href={v.report_link} target="_blank" rel="noopener noreferrer" className='custom-link'>
                                        {v.report_link}
                                    </a>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </div>
        </div>
    )
}

export default PastReports