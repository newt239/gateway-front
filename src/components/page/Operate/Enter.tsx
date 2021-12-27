import * as React from 'react';
import Box from '@mui/material/Box';

import QrReader from '../../ui/QrReader';

export default function Enter() {
    return (
        <Box>
            <div>enter</div>
            <Box>
                <QrReader type="enter" />
            </Box>
        </Box>
    );
}