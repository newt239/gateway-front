import * as React from 'react';
import { Container } from '@mui/material';

import QrReader from '../../ui/QrReader';

export default function Enter() {
    return (
        <>
            <Container sx={{ width: '100%' }}>
                <div>enter</div>
                <QrReader type="enter" />
            </Container>
        </>
    );
}