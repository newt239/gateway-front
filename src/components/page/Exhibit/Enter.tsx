import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import store, { RootState } from '../../../stores/index';
import { pauseQrReader } from '../../../stores/scan';
import { Grid, Typography, Button } from '@mui/material';
import Scanner from '../../ui/Scanner';
import axios from 'axios';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

export default function ExhibitEnter() {
    const dispatch = useDispatch();
    const place = useSelector((state: RootState) => state.place);
    const [text, setText] = useState<string>("");
    const [message, setMessage] = useState({ type: "", title: "" });
    const [disabled, setButtonStatus] = useState<boolean>(true);
    const handleScan = (scanText: string | null) => {
        if (scanText) {
            if (scanText.length === 8 && scanText.startsWith('G')) {
                dispatch(pauseQrReader({ state: false }));
                setText(scanText);
                axios.get(`${API_BASE_URL}/v1/guests/info/${scanText}`).then(res => {
                    if (res.data.status === "success") {
                        const guestData = res.data.data;
                        if (!guestData.available) {
                            setMessage({ type: "error", title: "このゲストは無効です" });
                        } else {
                            setMessage({ type: "success", title: `スキャンに成功しました` });
                        }
                    };
                });
                setButtonStatus(true);
            }
        }
    };
    const postApi = () => {
        const token = store.getState().auth.token;
        const user = store.getState().user;
        const payload = {
            guest_id: text,
            place_id: place.list[place.current].place_id,
            userid: user.userid
        };
        axios.post(API_BASE_URL + `/v1/activity/enter`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => {
            console.log(res);
            if (res.data.status === "success") {
                setText("");
                setMessage({ type: "", title: "" });
            } else {
                setText("error");
                setMessage({ type: "error", title: "error" });
            };
            dispatch(pauseQrReader({ state: false }));
        });
    };
    return (
        <>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                    <Typography variant='h3'>入室を記録するリストバンドのQRコードをかざしてください</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Scanner handleScan={handleScan} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4">認識したid</Typography>
                    <Typography>{text}</Typography>
                    <Typography variant="h4">ゲスト情報</Typography>
                    <Typography>{message.title}</Typography>
                    {message.type === "success" && (
                        <Button variant="contained" onClick={postApi} disabled={disabled}>登録</Button>
                    )}
                </Grid>
            </Grid>
        </>
    );
}