import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import store, { RootState } from '../../stores/index';
import { pauseQrReader } from '../../stores/scan';
import { Grid, Typography, Button, FormControl, InputLabel, IconButton, InputAdornment, OutlinedInput, Box, LinearProgress, Card, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Scanner from '../ui/Scanner';
import axios from 'axios';
import { VisibilityOff } from '@mui/icons-material';
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

type ExhibitScanProps = {
    scanType: string;
}

const ExhibitScan: React.FunctionComponent<ExhibitScanProps> = ({ scanType }) => {
    const dispatch = useDispatch();
    const token = store.getState().auth.token;
    const user = store.getState().user;
    const place = store.getState().place;
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [guestInfo, setGuestInfo] = useState({
        guest_id: "",
        guest_type: "",
        reservation_id: "",
        place_id: "",
        part: "",
        available: false,
        note: "",
        regist_at: ""
    });
    const [message, setMessage] = useState({ type: "beforeScan", title: "" });
    const [disabled, setButtonStatus] = useState<boolean>(true);
    const handleScan = async (scanText: string | null) => {
        if (scanText) {
            if (scanText.length === 10 && scanText.startsWith('G')) {
                dispatch(pauseQrReader({ state: false }));
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
    const postApi = async () => {
        const payload = {
            guest_id: text,
            place_id: place.list[place.current].place_id,
            userid: user.userid
        };
        const res = await axios.post(`${API_BASE_URL}/v1/activity/${scanType}`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
        dispatch(pauseQrReader({ state: true }));
        console.log(res);
    };
    const retry = () => {
        dispatch(pauseQrReader({ state: true }));
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
                                    <IconButton aria-label="" edge="end"
                                    ><VisibilityOff /></IconButton>
                                </InputAdornment>
                            }
                            fullWidth
                        />
                    </FormControl>
                </Box>
                {loading && (<Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>)}
                {message.type === "scanSuccess" && (
                    <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h4">ゲスト情報</Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <PermIdentityRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={guestInfo.guest_type}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PermIdentityRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={guestInfo.part}
                                />
                            </ListItem>
                        </List>
                        <Box
                            m={1}
                            sx={{ display: 'flex', justifyContent: "flex-end", alignItems: "flex-end" }}>
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