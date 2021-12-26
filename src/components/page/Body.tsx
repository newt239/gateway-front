import React, { useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../stores/index';
import { setToken } from '../../stores/auth';
import Home from './Home';
import Login from './Login';
import Operate from './Operate/Index';

const Body = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    useEffect(() => {
        if (location.pathname !== "/login") {
            if (!token) {
                const localStorageToken: string | null = localStorage.getItem('gatewayApiToken');
                if (localStorageToken) {
                    dispatch(setToken(localStorageToken));
                } else {
                    navigate("/login", { replace: true });
                }
            }
        }
    }, [localStorage.getItem('gatewayApiToken'), location]);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="operate" element={<Operate />} />
        </Routes>
    )
}

export default Body;