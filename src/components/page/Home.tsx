import React from "react";
import { useDispatch } from 'react-redux';
import { clearToken } from '../../stores/auth';
import { Button } from '@mui/material';
const Home = () => {
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(clearToken());
    }
    return <div>トップ
        <Button color="primary" onClick={logout}>
            ログアウト
        </Button>
    </div>
}

export default Home;