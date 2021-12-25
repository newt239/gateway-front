import React, { useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/index'
import Home from './Home';
import Login from './Login';
import Operate from './Operate/Index';

const Body = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.token);
    useEffect(() => {
        console.log(location);
        if (location.pathname !== "/login") {
            if (token === "") {
                navigate("/login", { replace: true });
            }
        }
    }, [token, location]);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="operate" element={<Operate />} />
        </Routes>
    )
}

export default Body;