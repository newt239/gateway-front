import React, { useState } from 'react';
import store, { RootState } from '../../../stores/index';
import { Grid, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Button } from '@mui/material';
import Scanner from '../../ui/Scanner';
import axios from 'axios';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;
type guestListProp = {
    guest_id: string;
    guest_type: string;
    reservation_id: string;
    userid: string;
}
export default function EntranceEnter() {
    const token = store.getState().auth.token;
    const user = store.getState().user;
    const [open, setOpen] = useState(false);
    const [text, setText] = useState<string | null>("");
    const handleScan = (scanText: string | null) => {
        if (scanText) {
            if (scanText.length === 8 && scanText.startsWith('G')) {
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