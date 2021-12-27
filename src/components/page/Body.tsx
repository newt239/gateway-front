import React, { useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../stores/index';
import { setToken } from '../../stores/auth';
import Home from './Home';
import Login from './Login';
import Operate from './Operate/Index';
import Enter from './Operate/Enter';
import Exit from './Operate/Exit';
import Pass from './Operate/Pass';
import Crowd from './Crowd';
import Chart from './Chart/Index';

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
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="operate" >
                    <Route index element={<Operate />} />
                    <Route path="enter" element={<Enter />} />
                    <Route path="exit" element={<Exit />} />
                    <Route path="pass" element={<Pass />} />
                </Route>
                <Route path="crowd" element={<Crowd />} />
                <Route path="chart" element={<Chart />} />
            </Route>
        </Routes>
    )
}

export default Body;