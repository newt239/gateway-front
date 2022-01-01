import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import store from '../../stores/index';
import { pauseQrReader } from '../../stores/scan';
import { Grid, Typography, Button, FormControl, InputLabel, IconButton, InputAdornment, OutlinedInput, Box, LinearProgress, Card, List, ListItem, ListItemIcon, ListItemText, Snackbar } from '@mui/material';
import Scanner from '../ui/Scanner';
import axios from 'axios';
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

import SelectExhibit from './SelectExhibit';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

type ExhibitScanProps = {
    scanType: string;
}

const ExhibitScan: React.FunctionComponent<ExhibitScanProps> = ({ scanType }) => {
    const dispatch = useDispatch();
    const token = store.getState().auth.token;
    const user = store.getState().user;
    const exhibit = store.getState().exhibit;
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [guestInfo, setGuestInfo] = useState({
        guest_id: "",
        guest_type: "",
        reservation_id: "",
        exhibit_id: "",
        part: "",
        available: false,
        note: "",
        regist_at: ""
    });
    const [message, setMessage] = useState({ type: "beforeScan", title: "" });
    const [disabled, setButtonStatus] = useState<boolean>(true);
    const [copySnack, setCopySnack] = useState(false);
    const handleScan = async (scanText: string | null) => {
        if (scanText) {
            if (scanText.length === 10 && scanText.startsWith('G')) {
                dispatch(pauseQrReader(false));
                setText(scanText);
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/v1/guests/info/${scanText}`, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
                setLoading(false);
                if (res.data.status === "success") {
                    setGuestInfo(res.data.data);
                    const guestData = res.data.data;
                    if (!guestData.available) {
                        setMessage({ type: "scanError", title: "このゲストは無効です" });
                    } else {
                        setMessage({ type: "scanSuccess", title: `スキャンに成功しました` });
                    }
                };
                setButtonStatus(false);
            }
        }
    };
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setCopySnack(false);
    };
    const postApi = async () => {
        const payload = {
            guest_id: text,
            guest_type: guestInfo.guest_type,
            exhibit_id: exhibit.current.exhibit_id,
            userid: user.userid
        };
        const res = await axios.post(`${API_BASE_URL}/v1/activity/${scanType}`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
        dispatch(pauseQrReader(true));
        console.log(res);
    };
    const retry = () => {
        dispatch(pauseQrReader(true));
        setText("");
        setMessage({ type: "beforeScan", title: "スキャンしてください" });
    }
    return (
        <>
            <Grid item xs={12} md={6}>
                <Scanner handleScan={handleScan} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h4' sx={{ minWidth: '7rem' }}>認識したid</Typography>
                    <FormControl sx={{ m: 1 }} variant="outlined">
                        <OutlinedInput
                            type='text'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="copy id to clipboard" onClick={() => {
                                        if (text !== "") { navigator.clipboard.writeText(text); setCopySnack(true); }
                                    }} edge="end">
                                        <ContentCopyRoundedIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            disabled
                            fullWidth
                        />
                        <Snackbar
                            open={copySnack}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            message="コピーしました"
                        />
                    </FormControl>
                </Box>
                {loading && (<Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>)}
                {message.type === "scanSuccess" && (
                    <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h4">ゲスト情報</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant='h4' sx={{ minWidth: '7rem' }}>展示名</Typography>
                            <SelectExhibit />
                        </Box>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <PermIdentityRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={guestInfo.guest_type === "student" ? "生徒" : guestInfo.guest_type}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AccessTimeRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={guestInfo.part === "all" ? "全時間帯" : guestInfo.part}
                                />
                            </ListItem>
                        </List>
                        <Box
                            m={1}
                            sx={{ display: 'flex', justifyContent: "flex-end", alignItems: "flex-end", gap: "1rem" }}>
                            <Button variant="outlined" onClick={retry}>スキャンし直す</Button>
                            <Button variant="contained" onClick={postApi} disabled={disabled}>登録</Button>
                        </Box>
                    </Card>)
                }
            </Grid >
        </>
    );
};

export default ExhibitScan;