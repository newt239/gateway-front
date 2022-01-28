import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '#/stores/index';
import { setPageInfo } from '#/stores/page';

import { Grid, Button, Typography } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import ExhibitEnterCountBarChart from '../../block/ExhibitEnterCountBarChart';
import ExhibitCurrentGuestList from '#/components/block/ExhibitCurrentGuestList';

export default function ChartExhibit() {
    const dispatch = useDispatch();
    const exhibit_id = useParams<{ exhibit_id: string; }>().exhibit_id || "";
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const exhibit = useSelector((state: RootState) => state.exhibit);
    const [status, setStatus] = useState<{ status: boolean; message: string; }>({ status: false, message: "読込中..." });

    useEffect(() => {
        if (exhibit.list.length !== 0) {
            const targetExhibit = exhibit.list.find((v) => v.exhibit_id === exhibit_id);
            if (targetExhibit) {
                dispatch(setPageInfo({ title: `${targetExhibit.exhibit_name}の滞在状況` }));
            } else {
                dispatch(setPageInfo({ title: `現在の滞在状況` }));
            };
        };
    }, [exhibit_id]);

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
                    <Typography variant="h3">時間帯別入場者数</Typography>
                    <ExhibitEnterCountBarChart exhibit_id={exhibit_id} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h3">現在滞在中のゲスト一覧</Typography>
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