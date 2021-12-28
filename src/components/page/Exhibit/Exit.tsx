import * as React from 'react';
import { Container, Box, Typography } from '@mui/material';

import QrReader from '../../ui/QrReader';

export default function Enter() {
    return (
        <Container sx={{ width: '100%' }}>
            <Typography variant='h3'>QRコードスキャン</Typography>
            <Box sx={{ mt: 2 }}>
                <QrReader type="exit" />
            </Box>
        </Container>
    );
}