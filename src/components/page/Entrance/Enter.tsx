import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import store, { RootState } from '#/stores/index';
import axios from 'axios';

import { Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Button } from '@mui/material';

import Scanner from '#/components/block/Scanner';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;
type guestListProp = {
    guest_id: string;
    guest_type: string;
    reservation_id: string;
    userid: string;
}
export default function EntranceEnter() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = store.getState().auth.token;
    const user = store.getState().user;
    const [open, setOpen] = useState(false);
    const [guestList, setGuest] = useState<guestListProp[]>([]);
    const reservationInfo = useSelector((state: RootState) => state.reservation);
    const [text, setText] = useState<string | null>("");
    const handleScan = (scanText: string | null) => {
        if (scanText) {
            setText(scanText);
            if (scanText.length === 8 && scanText.startsWith('G')) {
                setGuest([...guestList, {
                    guest_id: scanText,
                    guest_type: reservationInfo.guest_type,
                    reservation_id: reservationInfo.reservation_id,
                    userid: user.userid
                }]);
            }
        }
    };
    const postApi = () => {
        axios.post(`${API_BASE_URL}/v1/guests/regist`, guestList, { headers: { Authorization: "Bearer " + token } }).then(res => {
            if (res.data.status === "success") {
                setOpen(true);
            };
        });
    };
    const handleClose = () => {
        setOpen(false);
        navigate("/entrance/reserve-check", { replace: true });
    };
    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                    <Typography variant='h3'>Step2: 登録するリストバンドのQRコードをかざしてください</Typography>
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
                            <Typography> / {reservationInfo.count}人中</Typography>
                            <Button variant="contained" onClick={postApi}>すべて登録</Button>
                        </>
                    )}
                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle sx={{ color: `primary.main`, display: "inline-flex", alignItems: "center" }}>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>登録が完了しました。</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} >閉じる</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}