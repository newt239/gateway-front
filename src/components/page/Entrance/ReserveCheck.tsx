import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '#/stores/index';
import { setReservationInfo, resetReservationInfo } from '#/stores/reservation';
import { pauseQrReader } from '#/stores/scan';
import axios from 'axios';

import { Alert, SwipeableDrawer, Slide, Grid, Dialog, Typography, Button, FormControl, IconButton, InputAdornment, OutlinedInput, Box, LinearProgress, Card, List, ListItem, ListItemIcon, ListItemText, Snackbar, AlertTitle } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { TransitionProps } from '@mui/material/transitions';

import Scanner from '#/components/block/Scanner';
import ReservationTicket from '#/components/block/ReservationTicket';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

export default function ReserveCheck() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.user).token;
    const reservationInfo = useSelector((state: RootState) => state.reservation);
    const [snackbar, setSnackbar] = useState<{ status: boolean; message: string; severity: "success" | "error"; }>({ status: false, message: "", severity: "success" });
    const [text, setText] = useState("");
    const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">("waiting");
    const [message, setMessage] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [smDrawerOpen, setSmDrawerStatus] = useState(false);
    const handleScan = async (scanText: string | null) => {
        if (scanText) {
            if (scanText.length === 7 && scanText.startsWith('R')) {
                dispatch(pauseQrReader(false));
                setText(scanText);
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/v1/reservation/${scanText}`, { headers: { Authorization: "Bearer " + token } });
                setLoading(false);
                if (res.data.status === "success") {
                    dispatch(setReservationInfo(res.data.data));
                    if (reservationInfo) {
                        if (reservationInfo.available === 0) {
                            setScanStatus("error");
                            setMessage(["この予約idは無効です。"]);
                            setSmDrawerStatus(true);
                        } else {
                            setScanStatus("success");
                            setSmDrawerStatus(true);
                        };
                    };
                } else {
                    setScanStatus("error");
                    setMessage([res.data.message]);
                    setSmDrawerStatus(true);
                };
            } else {
                setScanStatus("error");
                setMessage(["予約idの形式が正しくありません。"]);
                setSmDrawerStatus(true);
            };
        };
    };

    const retry = () => {
        dispatch(resetReservationInfo());
        dispatch(pauseQrReader(false));
    }
    const ReservationInfoCard = () => {
        return (
            <>
                {scanStatus === "error" && (
                    <Card variant="outlined" sx={{ p: 2 }} >
                        <Alert severity="error">
                            <AlertTitle>エラー</AlertTitle>
                            {message.map((text, index) => <span key={index}>{text}</span>)}
                        </Alert>
                    </Card>
                )}
                {reservationInfo && scanStatus === "success" && (
                    <Card variant="outlined" sx={{ p: 2 }} >
                        <Typography variant="h4">ゲスト情報</Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <PersonRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PeopleRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={reservationInfo.guest_type === "student" ? "生徒" : reservationInfo.guest_type}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AccessTimeRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={reservationInfo.part === "all" ? "全時間帯" : reservationInfo.part}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AccessTimeRoundedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${reservationInfo.count}人`}
                                />
                            </ListItem>
                        </List>
                        <Box
                            m={1}
                            sx={{ display: 'flex', justifyContent: "flex-end", alignItems: "flex-end", gap: "1rem" }}>
                            <Button variant="contained" onClick={retry}>スキャンし直す</Button>
                            <Button variant="contained" onClick={() => navigate("/entrance/enter", { replace: true })}>リストバンドの登録</Button>
                        </Box>
                    </Card>
                )}
            </>
        )
    }
    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12}>
                <Typography variant='h3'>Step1: 予約用QRコードスキャン</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Scanner handleScan={handleScan} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h4'>id:</Typography>
                    <FormControl sx={{ m: 1 }} variant="outlined">
                        <OutlinedInput
                            type='text'
                            size="small"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="copy id to clipboard" onClick={() => {
                                        if (text !== "") { navigator.clipboard.writeText(text); setSnackbar({ status: true, message: "コピーしました", severity: "success" }); }
                                    }} edge="end">
                                        <ContentCopyRoundedIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            disabled
                            fullWidth
                        />
                    </FormControl>
                </Box>
                {loading && (<Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>)}
                {scanStatus !== "waiting" && (
                    matches ? (
                        <ReservationInfoCard />
                    ) : (
                        <SwipeableDrawer
                            anchor="bottom"
                            open={smDrawerOpen}
                            onClose={() => retry()}
                            onOpen={() => setSmDrawerStatus(true)}
                        >
                            <ReservationInfoCard />
                        </SwipeableDrawer>
                    )
                )}
            </Grid>
            <Snackbar
                open={snackbar.status}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ status: false, message: "", severity: "success" })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Grid>
    );
};