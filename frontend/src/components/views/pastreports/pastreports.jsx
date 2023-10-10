import React, { useState, useEffect, useCallback, useRef } from 'react';
import {FaSearch} from "react-icons/fa"
import Cookies from 'js-cookie';
import PatientApi from '../../../apis/PatientApi';
import { getAccessToken } from '../../auth/Auth'
import { BrowserRouter as Router, Route, Link, Switch, useNavigate } from 'react-router-dom';

import './pastreports.css';

const PastReports = () => {
    const navigate = useNavigate();
	const [patient, setPatient] = useState()
	const [filteredPatients, setFilteredPatients] = useState([])
	const [input, setInput] = useState("");
    const [pastReports, setPastReports] = useState([])
    const [keywords, setKeywords] = useState('')
    const [sortOption, setSortOption] = useState('latest')

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

    const handleSortOptionChange = (event) => {
        console.log("sorting")
        const selectedOption = event.target.value;
        setSortOption(selectedOption);
      
        // Sort the data based on the selected option
        const sortedReports = [...pastReports]; // Create a copy of the current reports array
        if (selectedOption === 'oldest') {
          sortedReports.sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date));
        } else if (selectedOption === 'latest') {
          sortedReports.sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));
        }

        console.log("new sorted", sortedReports)
      
        setPastReports(sortedReports);
      };

    useEffect(() => {   
        fetchPatients();
    }, [fetchPatients]); 

    console.log("past reports, past reports", pastReports)
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
                        <div className='text'>
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

                <div className='sort-dropdown'>
                    Sort by:
                    <select value={sortOption} onChange={handleSortOptionChange}>
                        <option value='oldest'>Oldest to Latest</option>
                        <option value='latest'>Latest to Oldest</option>
                    </select>
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