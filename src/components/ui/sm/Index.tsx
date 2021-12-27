import React from 'react';
import { Container, Toolbar } from '@mui/material';

import BottomNav from './BottomNav';
import TopBar from '../TopBar';
import Body from '../../page/Body';
const SM = () => {
    return (
        <>
            <BottomNav />
            <Container sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Toolbar sx={{ p: 1 }} />
                <Body />
            </Container>
            <TopBar />
        </>
    )
}

export default SM