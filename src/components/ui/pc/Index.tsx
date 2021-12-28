import * as React from 'react';
import { Container, Box, Toolbar } from '@mui/material';

import Drawer from './Drawer';
import TopBar from '../TopBar';
import Body from '../../page/Body';

const PC = () => {
    return (
        <>
            <TopBar />
            <Box sx={{ display: 'flex' }}>
                <Drawer />
                <Container sx={{ display: 'flex', flexWrap: 'wrap', m: 0 }}>
                    <Toolbar sx={{ p: 1 }} />
                    <Body />
                </Container>
            </Box>
        </>
    )
}

export default PC