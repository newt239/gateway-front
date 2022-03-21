import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { profileState } from "#/recoil/user";
import { pageStateSelector } from '#/recoil/page';

import { Grid, Card, Button, Typography } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import ExhibitEnterCountBarChart from '../../block/ExhibitEnterCountBarChart';
import ExhibitCurrentGuestList from '#/components/block/ExhibitCurrentGuestList';

export default function ChartExhibit() {
    const exhibit_id = useParams<{ exhibit_id: string; }>().exhibit_id || "";
    const navigate = useNavigate();
    const profile = useRecoilValue(profileState);
    const [status, setStatus] = useState<{ status: boolean; message: string; }>({ status: false, message: "読込中..." });

    const setPageInfo = useSetRecoilState(pageStateSelector);
    useEffect(() => {
        setPageInfo({ title: `${exhibit_id} - 現在の滞在状況` });
    }, []);

    useEffect(() => {
        if (profile) {
            if (exhibit_id === "") {
                navigate("/chart/all", { replace: true });
            } else if (profile.user_type === "group" && profile.role.indexOf(exhibit_id) !== -1) {
                setStatus({ status: false, message: "このアカウントにはこのページを表示する権限がありません。" });
                navigate("/chart/all", { replace: true });
            } else {
                setStatus({ status: true, message: "" });
            };
        } else {
            setStatus({ status: false, message: "読込中..." });
        };
    }, [profile]);

    return (
        <>
            {status.status ? (<Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12}>
                    <Button variant="text" startIcon={<ArrowBackIosNewRoundedIcon />} onClick={(e) => navigate("/chart/all", { replace: true })}>一覧に戻る</Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                        <Typography variant="h3">現在滞在中のゲスト一覧</Typography>
                        <ExhibitCurrentGuestList exhibit_id={exhibit_id} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                        <Typography variant="h3">時間帯別入場者数</Typography>
                        <ExhibitEnterCountBarChart exhibit_id={exhibit_id} />
                    </Card>
                </Grid>
            </Grid>) :
                (<>
                    {status.message}
                </>)
            }
        </>
    );
};