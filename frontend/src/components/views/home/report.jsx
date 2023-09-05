import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useSelector } from 'react-redux';

import './report.css';

// import Placeholder from './ai.png';
import Placeholder from '../../../css/imgs/ai.png';
import Placeholder2 from '../../../css/imgs/img2.jpg';
import Placeholder3 from '../../../css/imgs/img3.png';


function Report({patient, image}) {
  return (
    <div className='report-container'>
        <div className='report'>
            <div className='report-header'>
                REPORT
            </div>
            <div className='patient-details'>
                <div className='sub-header'>
                    Patient details
                </div>
                Name: {patient}
                <br/>
                Age: 22
                <br/>
                Sex: Female
            </div>
            <div className='eye-image'>
                <div className='sub-header'>
                    Eye Image
                </div>
                <img src={image}/>
            </div>
            <div className='results'>
                <div className='sub-header'>
                    Results
                </div>
                Probability of Diabetic Retinopathy: 70%
                <br/>
                Probability of Age-related Macular Degeneration: 50%
                <br/>
                Probability of Glaucoma: 20%
            </div>
        </div>
    </div>
  );
}

export default Report;