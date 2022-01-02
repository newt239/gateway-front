import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "#/stores/index";
import { pauseQrReader, setDeviceList, setCurrentDevice } from '#/stores/scan';
import QrReader from 'react-qr-reader';

import { Box, Dialog, DialogContent, DialogActions, Button, IconButton, Autocomplete, TextField, DialogTitle } from '@mui/material';
import CameraswitchRoundedIcon from '@mui/icons-material/CameraswitchRounded';

type ScannerProps = {
    handleScan: (text: string | null) => void;
}

const Scanner: React.FunctionComponent<ScannerProps> = ({ handleScan }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [selectCameraModalOpen, setSelectCameraModalOpen] = useState(false);
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((mediaDevices) => mediaDevices
            .filter((device) => device.kind === 'videoinput')
            .map((device) => {
                return {
                    label: device.label,
                    deviceId: device.deviceId,
                };
            })).then((devices) => {
                console.log(devices);
                dispatch(setDeviceList(devices));
                dispatch(setCurrentDevice(devices[0]));
            });
    }, []);
    const deviceList = useSelector((state: RootState) => state.scan.deviceList);
    const currentDevice = useSelector((state: RootState) => state.scan.deviceId);

    // location以外のパスに移動したときにカメラを切る
    const qrReaderState = useSelector((state: RootState) => state.scan);
    useEffect(() => {
        if (location.pathname.match(/entrance|exhibit/)) {
            dispatch(pauseQrReader(true));
        } else {
            dispatch(pauseQrReader(false));
        }
    }, [location]);

    // out of memory の対策として、5 分ごとに react-qr-reader を unmount して、直後に mount している
    // https://github.com/afes-website/cappuccino-app/blob/d0201aa5506e6b3aa7c3cc887171d83b0e773b18/src/components/QRScanner.tsx#L146
    const [refreshQrReader, setRefreshQrReader] = useState(true);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRefreshQrReader(false);
        }, 5 * 60 * 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);
    useEffect(() => {
        if (!refreshQrReader) setRefreshQrReader(true);
    }, [refreshQrReader]);

    const handleError = (err: any) => {
        console.log(err);
    };

    const changeCamera = (event: React.SyntheticEvent, value: any, reason: string) => {
        dispatch(setCurrentDevice(value));
        setRefreshQrReader(false);
    };

    return (<Box sx={{ margin: 'auto', width: '100%', maxWidth: '70vh', aspectRatio: '1 / 1', backgroundColor: 'black', borderRadius: '1rem' }}>
        {(qrReaderState.state && refreshQrReader) && (
            <div style={{ position: 'relative' }}>
                <QrReader
                    onScan={(text) => handleScan(text)}
                    onError={handleError}
                    delay={1}
                    showViewFinder={false}
                    facingMode="environment"
                    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-qr-reader/index.d.ts
                    // @types/react-qr-readerがv2.1.0用でv2.1.1に追加されたconstraints propの型定義に対応していなかったため追記
                    constraints={{ deviceId: currentDevice.deviceId, facingMode: "environment" }}
                    className="qrcode"
                />
                <IconButton onClick={() => setSelectCameraModalOpen(true)} sx={{ position: 'absolute', color: "white", top: 0, left: 0 }}>
                    <CameraswitchRoundedIcon />
                </IconButton>
                <Dialog open={selectCameraModalOpen} onClose={() => setSelectCameraModalOpen(false)}>
                    <DialogContent>
                        <DialogTitle>カメラ切り替え</DialogTitle>
                        <Autocomplete
                            disablePortal
                            disableClearable
                            onChange={changeCamera}
                            options={deviceList}
                            getOptionLabel={(option) => option.label}
                            value={currentDevice}
                            renderInput={(params) => <TextField {...params} />}
                            size="small"
                            sx={{ width: 300, p: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectCameraModalOpen(false)}>閉じる</Button>
                    </DialogActions>
                </Dialog>
            </div>)
        }
    </Box >)
}

export default Scanner;