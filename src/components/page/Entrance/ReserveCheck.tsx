import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../stores/index';
import { updateReservationInfo } from '../../../stores/reservation';
import { Grid, Box, Typography, Button } from '@mui/material';
import Scanner from '../../ui/Scanner';
import axios from 'axios';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

export default function ReserveCheck() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const reservationInfo = useSelector((state: RootState) => state.reservation);
    const [text, setText] = useState("");
    const handleScan = (text: string | null) => {
        if (text) {
            if (text.length === 8 && text.startsWith('G')) {
                setText(text);
                axios.get(`${API_BASE_URL}/v1/reservation/${text}`).then(res => {
                    if (res.data.status === "success") {
                        dispatch(updateReservationInfo(res.data.data));
                    };
                });
            };
        };
    };
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12}>
                <Typography variant='h3'>Step1: 予約用QRコードをスキャンしてください</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Scanner handleScan={handleScan} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h4">認識したid</Typography>
                <Typography>{text}</Typography>
                {reservationInfo.available && (
                    <>
                        <Typography variant="h4">ゲストタイプ</Typography>
                        <Typography>{reservationInfo.guest_type}</Typography>
                        <Typography variant="h4">時間帯</Typography>
                        <Typography>{reservationInfo.part}</Typography>
                        <Typography variant="h4">人数</Typography>
                        <Typography>{reservationInfo.count}人</Typography>
                        <Button variant="contained" onClick={() => navigate("/entrance/enter", { replace: true })}>リストバンドを登録</Button>
                    </>
                )}
            </Grid>
        </Grid>
    );
}