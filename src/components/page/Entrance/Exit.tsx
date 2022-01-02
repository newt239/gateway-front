import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import store from '#/stores/index';
import { pauseQrReader } from '#/stores/scan';
import axios from 'axios';

import { Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Button } from '@mui/material';

import Scanner from '#/components/block/Scanner';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

export default function EntranceEnter() {
    const dispatch = useDispatch();
    const token = store.getState().auth.token;
    const user = store.getState().user;
    const qrReaderState = store.getState().scan;
    const [open, setOpen] = useState(false);
    const [text, setText] = useState<string | null>("");
    const handleScan = (scanText: string | null) => {
        if (scanText) {
            console.log(scanText);
            if (scanText.length === 8 && scanText.startsWith('G')) {
                dispatch(pauseQrReader(false));
                setText(scanText);
            }
        }
    };
    const postApi = () => {
        const payload = {
            guest_id: text,
            userid: user.userid
        }
        axios.post(`${API_BASE_URL}/v1/guests/revoke`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => {
            if (res.data.status === "success") {
                setOpen(true);
            };
        });
    };
    const handleClose = () => {
        dispatch(pauseQrReader(false));
        setOpen(false);
    };
    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                    <Typography variant='h3'>退場を記録するリストバンドのQRコードをかざしてください</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Scanner handleScan={handleScan} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4">認識したid</Typography>
                    <Typography>{text}</Typography>
                    {text && (
                        <Button variant="contained" onClick={postApi}>登録</Button>
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