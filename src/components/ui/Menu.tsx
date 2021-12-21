import * as React from 'react';
import Drawer from '../block/Drawer'
import BottomNav from '../block/BottomNav'
import useMediaQuery from '@mui/material/useMediaQuery';

class GrobalMenu extends React.Component {
    render() {
        function Menu() {
            const sm = useMediaQuery('(max-width:600px)');
            if (sm) {
                return <BottomNav />
            } else {
                return <Drawer />
            }
        }
        return (
            <Menu />
        )
    }
}

export default GrobalMenu