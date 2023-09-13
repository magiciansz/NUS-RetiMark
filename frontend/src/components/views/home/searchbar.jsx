// import React, { useState, useEffect, useCallback, useRef } from 'react';

// import {FaSearch} from "react-icons/fa"
// import './searchbar.css';

// const patients = [
// 	{name: 'jiahui', age: '22', gender: 'F'},
// 	{name: 'xianghan', age: '24', gender: 'M'},
// 	{name: 'jiajun', age: '24', gender: 'M'},
// 	{name: 'glenn', age: '24', gender: 'M'},
// 	{name: 'josiah', age: '24', gender: 'M'},
// ]


// function SearchBar({setFilteredPatients}) {
//     const [input, setInput] = useState("");
//     const fetchData = (value) => {
//         const results = patients.filter((user) => {
//             return (
//               value &&
//               user &&
//               user.name &&
//               user.name.toLowerCase().includes(value)
//             );
//         });
//         setFilteredPatients(results)
//         console.log("results", results);
//     }

//     const handleChange = (value) => {
//         setInput(value);
//         fetchData(value);
        
//     };

//     return (
//         <div className='input-wrapper'>
//             <FaSearch id='search-icon' />
//             <input
//                 placeholder="Search patient"
//                 value={input}
//                 onChange={(e) => handleChange(e.target.value)}
//             />
//         </div>
//     )
// }
    
// export default SearchBar
