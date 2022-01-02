import React from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import PC from '#/components/ui/pc/Index';
import SM from '#/components/ui/sm/Index';

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