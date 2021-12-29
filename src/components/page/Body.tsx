import React, { useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../stores/index';
import { setToken } from '../../stores/auth';
import Home from './Home';
import Login from './Login';
import Exhibit from './Exhibit/Index';
import ExhibitEnter from './Exhibit/Enter';
import ExhibitExit from './Exhibit/Exit';
import ExhibitPass from './Exhibit/Pass';
import Crowd from './Crowd/Index';
import Heatmap from './Crowd/Heatmap';
import Status from './Crowd/Status';
import Entrance from './Entrance/Index';
import ReserveCheck from './Entrance/ReserveCheck';
import EntranceEnter from './Entrance/Enter';
import EntranceExit from './Entrance/Exit';
import Settings from './Settings';

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
                <Route path="exhibit" >
                    <Route index element={<Exhibit />} />
                    <Route path="enter" element={<ExhibitEnter />} />
                    <Route path="exit" element={<ExhibitExit />} />
                    <Route path="pass" element={<ExhibitPass />} />
                </Route>
                <Route path="entrance" >
                    <Route index element={<Entrance />} />
                    <Route path="reserve-check" element={<ReserveCheck />} />
                    <Route path="enter" element={<EntranceEnter />} />
                    <Route path="exit" element={<EntranceExit />} />
                </Route>
                <Route path="crowd" >
                    <Route index element={<Crowd />} />
                    <Route path="heatmap" element={<Heatmap />} />
                    <Route path="status" element={<Status />} />
                </Route>
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}

export default Body;