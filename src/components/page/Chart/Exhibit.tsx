import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '#/stores/index';

import { Grid, Button } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import ExhibitEnterCountBarChart from '../../block/ExhibitEnterCountBarChart';
import ExhibitCurrentGuestList from '#/components/block/ExhibitCurrentGuestList';

export default function ChartExhibit() {
    const exhibit_id = useParams<{ exhibit_id: string; }>().exhibit_id || "";
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const [status, setStatus] = useState<{ status: boolean; message: string; }>({ status: false, message: "読込中..." });

    useEffect(() => {
        if (user.info.available) {
            if (exhibit_id === "") {
                navigate("/chart/all", { replace: true });
            } else if (user.info.user_type === "group" && user.info.role.indexOf(exhibit_id) !== -1) {
                setStatus({ status: false, message: "このアカウントにはこのページを表示する権限がありません。" });
                navigate("/chart/all", { replace: true });
            } else {
                setStatus({ status: true, message: "" });
            };
        } else {
            setStatus({ status: false, message: "読込中..." });
        };
    }, [user]);
    return (
        <>
            {status.status ? (<Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12}>
                    <Button variant="text" startIcon={<ArrowBackIosNewRoundedIcon />} onClick={(e) => navigate("/chart/all", { replace: true })}>一覧に戻る</Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <ExhibitEnterCountBarChart exhibit_id={exhibit_id} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ExhibitCurrentGuestList exhibit_id={exhibit_id} />
                </Grid>
            </Grid>) :
                (<>
                    {status.message}
                </>)
            }
        </>
    );
}