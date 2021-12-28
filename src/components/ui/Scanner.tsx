import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import store from "../../stores/index";
import { pauseQrReader } from '../../stores/scan';
import QrReader from 'react-qr-reader';

type ScannerProps = {
    handleScan: (text: string | null) => void;
}

const Scanner: React.FunctionComponent<ScannerProps> = ({ handleScan }) => {

    // location以外のパスに移動したときにカメラを切る
    const location = useLocation();
    const dispatch = useDispatch();
    const qrReaderState = store.getState().scan;
    useEffect(() => {
        if (location.pathname.match(/entrance|exhibit/)) {
            dispatch(pauseQrReader({ state: true }));
        } else {
            dispatch(pauseQrReader({ state: false }));
        }
    }, [location]);

    // out of memory の対策として、5 分ごとに react-qr-reader を unmount して、直後に mount している
    // https://github.com/afes-website/cappuccino-app/blob/d0201aa5506e6b3aa7c3cc887171d83b0e773b18/src/components/QRScanner.tsx#L146
    const [refreshQrReader, refreshQrReaderSet] = useState(true);
    useEffect(() => {
        const intervalId = setInterval(() => {
            refreshQrReaderSet(false);
        }, 5 * 60 * 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);
    useEffect(() => {
        if (!refreshQrReader) refreshQrReaderSet(true);
    }, [refreshQrReader]);

    const handleError = (err: any) => {
        console.log(err);
    }
    return (<>
        {qrReaderState.state && refreshQrReader && (
            <QrReader
                delay={1}
                onError={handleError}
                onScan={(text) => handleScan(text)}
                style={{ margin: 'auto', width: '100%', maxWidth: '70vh' }}
            />)}
    </>)
}

export default Scanner;