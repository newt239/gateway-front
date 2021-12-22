import React from "react"
import { Routes, Route } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Operate from './Operate/Index';

const Body = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="operate" element={<Operate />} />
        </Routes>
    )
}

export default Body;