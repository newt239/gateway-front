import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import store from '../../stores/index';
import { pauseQrReader } from '../../stores/scan';

import { Slide, Grid, Dialog, Typography, Button, FormControl, IconButton, InputAdornment, OutlinedInput, Box, LinearProgress, Card, List, ListItem, ListItemIcon, ListItemText, Snackbar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { TransitionProps } from '@mui/material/transitions';

import Scanner from '../ui/Scanner';

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
    const [disabled, setButtonStatus] = useState<boolean>(true);
    const [copySnack, setCopySnack] = useState(false);
    const [smDialogOpen, setSmDialogStatus] = useState(false);
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
                        setMessage(["このゲストは無効です。"]);
                    } else {
                        setScanStatus("success");
                        setMessage(["スキャンに成功しました。"]);
                        setSmDialogStatus(true);
                    }
                } else {
                    setScanStatus("error");
                    setMessage(["何らかの問題が発生しました。"]);
                };
                setButtonStatus(false);
            } else {
                setScanStatus("error");
                setMessage(["ゲストidの形式が正しくありません。"]);
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
        if (guestInfo) {
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
    };
    const retry = () => {
        dispatch(pauseQrReader(true));
        setText("");
        setMessage([]);
    };
    const GuestInfoCard = () => {
        return (
            <>
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
                            <Button variant="outlined" onClick={retry}>スキャンし直す</Button>
                            <Button variant="contained" onClick={postApi} disabled={disabled}>登録</Button>
                        </Box>
                    </Card >
                )}
            </>
        )
    }
    return (
        <>
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
                {scanStatus === "success" && (
                    matches ? (
                        <GuestInfoCard />
                    ) : (
                        <Dialog
                            fullScreen
                            open={smDialogOpen}
                            onClose={handleClose}
                            TransitionComponent={Transition}
                        >
                            <GuestInfoCard />
                        </Dialog>
                    )
                )}
            </Grid >
        </>
    );
};

export default ExhibitScan;