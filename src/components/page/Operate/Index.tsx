import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import Enter from './Enter';
import Exit from './Exit';
import Pass from './Pass';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>{children}</Box>
            )}
        </div>
    );
}

export default function Operate() {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h2">入退室処理</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} variant="fullWidth" onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab icon={<PhoneMissedIcon />} iconPosition="start" label="入室" />
                    <Tab icon={<PhoneMissedIcon />} iconPosition="start" label="退室" />
                    <Tab icon={<PhoneMissedIcon />} iconPosition="start" label="通過" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Enter />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Exit />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Pass />
            </TabPanel>
        </Box>
    );
}