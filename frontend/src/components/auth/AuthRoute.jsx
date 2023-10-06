import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'
import { getAccessToken } from './Auth';

const AuthRoute = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAccessToken() {
            const token = await getAccessToken();
            setAccessToken(token);
            setLoading(false);
        }

        fetchAccessToken();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        accessToken ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default AuthRoute