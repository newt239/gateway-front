import React from 'react';
import { Container, Box, Toolbar } from '@mui/material';

import BottomNav from './BottomNav';
import TopBar from '../TopBar';
import Body from '../../page/Body';
const Index = () => {
    return (
        <>
            <BottomNav />
            <Container>
                <Toolbar />
                <Body />
            </Container>
            <TopBar />
        </>
    )
}

export default Index