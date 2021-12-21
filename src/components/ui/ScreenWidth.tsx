import * as React from 'react';
import Drawer from './pc/Drawer'
import BottomNav from './sm/BottomNav'
import useMediaQuery from '@mui/material/useMediaQuery';

const ScreenWidth = () => {
    function MediaQuery() {
        const sm = useMediaQuery('(max-width:600px)');
        if (sm) {
            return <BottomNav />
        } else {
            return <Drawer />
        }
    }
    return (
        <MediaQuery />
    )
}

export default ScreenWidth