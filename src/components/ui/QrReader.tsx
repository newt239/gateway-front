import React, { useState, useEffect } from "react";
import QrReader from 'react-qr-reader';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores/index';
import axios from 'axios';

import { Grid, Container, Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import registActivity from '../functional/registActivity';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;
type QrReaderProps = {
    type: "enter" | "exit" | "pass";
}

const UserInfo: React.FC<QrReaderProps> = (QrReaderProps) => {
    const { type } = QrReaderProps;
    const [id, updateId] = useState("");
    const place = useSelector((state: RootState) => state.place);
    const [open, setOpen] = useState(false);
    const [dialog, updateDialog] = useState({ type: "success", title: "success scan", message: "hello" });

    const handleScan = (data: any) => {
        if (data) {
            axios.get(`${API_BASE_URL}/v1/guests/info/${data}`).then(res => {
                if (res.data.status === "success") {
                    const guestData = res.data.data;
                    if (!guestData.available) {
                        updateDialog({ type: "error", title: "このゲストは無効です", message: "認識したID:" + data });
                    } else if (type === "enter" && guestData.place_id) {
                        updateDialog({ type: "error", title: `このゲストはすでに展示「${guestData.place_id}」に入室しています。`, message: "認識したID:" + data });
                    } else {
                        updateDialog({ type: "success", title: `スキャンに成功しました`, message: `id:${data}<br>type:${guestData.guest_type}` });
                    }
                };
            });
            updateId(data);
            setOpen(true);
        }
    }
    const handleError = (err: any) => {
        setOpen(true);
        console.log(err);
    }
    const handleClose = () => {
        setOpen(false);
    };
    const postApi = async () => {
        const result = await registActivity(type, id, place.list[place.current].place_id);
        if (true) {
            updateDialog({ type: "success", title: "登録が完了しました", message: "hello" });
        };
    };
    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                    <QrReader
                        delay={1}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ margin: 'auto', width: '100%', maxWidth: '70vh' }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant='h4'>認識したテキスト：</Typography>
                    <Typography sx={{ color: 'primary.main' }}>{id}</Typography>
                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle sx={{ color: `${dialog.type}.main`, display: "inline-flex", alignItems: "center" }}>
                    {dialog.type === "success" && <CheckCircleRoundedIcon />}
                    {dialog.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialog.message}
                        {type}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ display: dialog.type === 'error' ? "block" : "none" }}>やり直す</Button>
                    <Button onClick={postApi} sx={{ display: dialog.type === 'success' ? "block" : "none" }}>登録</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UserInfo;