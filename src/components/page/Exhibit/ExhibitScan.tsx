import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import store from '#/stores/index';
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

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

type ExhibitScanProps = {
    scanType: string;
};
type guestInfoProp = {
    guest_id: string;
    guest_type: string;
    exhibit_id: string;
    part: string;
    available: false;
    note: string;
} | null;
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ExhibitScan: React.FunctionComponent<ExhibitScanProps> = ({ scanType }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const dispatch = useDispatch();
    const token = store.getState().auth.token;
    const user = store.getState().user;
    const exhibit = store.getState().exhibit;
    const [text, setText] = useState<string>("");
    const [scanStatus, setScanStatus] = useState<"waiting" | "success" | "error">("waiting");
    const [message, setMessage] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [guestInfo, setGuestInfo] = useState<guestInfoProp>(null);
    const [snackbar, setSnackbar] = useState<{ status: boolean; message: string; severity: "success" | "error"; }>({ status: false, message: "", severity: "success" });
    const [smDrawerOpen, setSmDrawerStatus] = useState(false);
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
                    if (guestData.available === 0) {
                        setScanStatus("error");
                        setMessage(["このゲストは無効です。"]);
                        setSmDrawerStatus(true);
                    } else if (scanType === "enter" && guestData.exhibit_id !== "") {
                        setScanStatus("error");
                        setMessage([`このゲストはすでに${guestData.exhibit_id}に入室しています。`, "入室処理と間違えていませんか？"]);
                        setSmDrawerStatus(true);
                    } else {
                        setScanStatus("success");
                        setSmDrawerStatus(true);
                    }
                } else {
                    setScanStatus("error");
                    setMessage([res.data.message]);
                    setSmDrawerStatus(true);
                };
            } else {
                setScanStatus("error");
                setMessage(["ゲストidの形式が正しくありません。"]);
                setSmDrawerStatus(true);
            };
        };
    };
    const postApi = async () => {
        if (guestInfo) {
            const payload = {
                guest_id: text,
                guest_type: guestInfo.guest_type,
                exhibit_id: exhibit.current.exhibit_id,
                userid: user.userid
            };
            const res = await axios.post(`${API_BASE_URL}/v1/activity/${scanType}`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
            if (res.data.status === "success") {
                dispatch(pauseQrReader(true));
                setText("");
                setMessage([]);
                setSnackbar({ status: false, message: "", severity: "success" });
                setScanStatus("waiting");
                setSmDrawerStatus(false);
            } else {
                console.log(res.data);
                if (res.data.message) {
                    setSnackbar({ status: true, message: res.data.message, severity: "error" });
                } else {
                    setSnackbar({ status: true, message: "何らかのエラーが発生しました。", severity: "error" });
                }
                setText("");
                dispatch(pauseQrReader(true));
                setSmDrawerStatus(false);
            };
        };
    };
    const retry = () => {
        dispatch(pauseQrReader(true));
        setText("");
        setMessage([]);
        setSnackbar({ status: false, message: "", severity: "success" });
        setScanStatus("waiting");
        setSmDrawerStatus(false);
    };
    const GuestInfoCard = () => {
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
                {guestInfo && (
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
                            <Button variant="text" onClick={retry}>スキャンし直す</Button>
                            <Button variant="contained" onClick={postApi}>登録</Button>
                        </Box>
                    </Card >
                )}
            </>
        )
    };

    return (
        <>
            <Grid item xs={12} md={6} lg={4}>
                <Scanner handleScan={handleScan} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
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
                        <GuestInfoCard />
                    ) : (
                        <SwipeableDrawer
                            anchor="bottom"
                            open={smDrawerOpen}
                            onClose={() => retry()}
                            onOpen={() => setSmDrawerStatus(true)}
                        >
                            <GuestInfoCard />
                        </SwipeableDrawer>
                    )
                )}
            </Grid >
            <Snackbar
                open={snackbar.status}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ status: false, message: "", severity: "success" })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </>
    );
};

export default ExhibitScan;