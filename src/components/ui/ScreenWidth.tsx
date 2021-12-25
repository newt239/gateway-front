import * as React from 'react';
import PC from './pc/Index'
import SM from './sm/Index'
import useMediaQuery from '@mui/material/useMediaQuery';

const ScreenWidth = () => {
    function MediaQuery() {
        const sm = useMediaQuery('(max-width:600px)');
        if (sm) {
            return <SM />
        } else {
            return <PC />
        }
    }
    return (
        <MediaQuery />
    )
}

export default ScreenWidth