import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'
import { getAccessToken } from './Auth';

// Component: Routes that require authorisation 
const AuthRoute = () => {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        async function fetchAccessToken() {
            const token = await getAccessToken();
            setAccessToken(token);
        }

        fetchAccessToken();
    }, []);

    return (
        accessToken ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default AuthRoute