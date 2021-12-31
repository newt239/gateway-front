import React from 'react';
import { Container, Toolbar } from '@mui/material';

import BottomNav from './BottomNav';
import TopBar from '../TopBar';
import Body from '../../page/Body';
const SM = () => {
    return (
        <>
            <TopBar />
            <Container sx={{ display: 'flex', flexWrap: 'wrap', pb: 7 }}>
                <Toolbar sx={{ p: 1 }} />
                <Body />
            </Container>
            <BottomNav />
        </>
    )
}

export default SM