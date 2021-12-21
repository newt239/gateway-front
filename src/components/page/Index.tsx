import React from "react"
import {
    Routes,
    Route
} from "react-router-dom";
import Home from '../page/Home';
import Login from '../page/Login';
import Operate from '../page/Operate';

const Index: React.VFC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/operate" element={<Operate />} />
        </Routes>
    )
}

export default Index;