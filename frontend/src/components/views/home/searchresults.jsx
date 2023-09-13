import React, { useState, useEffect, useCallback, useRef } from 'react';

import {FaSearch} from "react-icons/fa"
import './searchresults.css';

function SearchResults({patients}) {
    console.log("results in search", patients)
    return (
        <div className='results-list'>
            {patients && patients.map((patient, id) => (
                <div className='results' key={id}>{patient.name}</div>
            ))}
        </div>
    )
}
    
export default SearchResults
