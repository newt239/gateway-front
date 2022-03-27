import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from '#/recoil/page';
import axios from "axios";

import { Grid, Card, Typography, TextField, MenuItem, Box, Button } from '@mui/material';

import { userTypeProp } from "#/components/functional/generalProps";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const AdminIndex = () => {
    const setPageInfo = useSetRecoilState(pageStateSelector);
    useEffect(() => {
        setPageInfo({ title: "管理者用" });
    }, []);

    const token = useRecoilValue(tokenState);

    const [useridValue, setUserid] = useState("");
    const [passwordValue, setPassword] = useState("");
    const [displayNameValue, setDisplayName] = useState("");
    const [userTypeValue, setUserType] = useState<userTypeProp>("temporary");

    const userTypeList: { value: userTypeProp; label: string }[] = [
        { value: "moderator", label: "管理者" },
        { value: "executive", label: "文化祭実行委員" },
        { value: "exhibit", label: "展示担当者" },
        { value: "analysis", label: "データ分析" },
        { value: "temporary", label: "一時的なアカウント" }
    ]

    const createUser = async () => {
        const payload = {
            userid: useridValue,
            password: passwordValue,
            displayName: displayNameValue,
            userType: userTypeValue
        }
        const res = await axios.post(`${API_BASE_URL}/v1/admin/create`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
        console.log(res);
        if (res.data.status == "success") {
            console.log("operation of create user was succeed.");
        } else {
            console.log("error");
        };
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h3">ユーザーの作成</Typography>
                    <TextField
                        id="userid"
                        label="ユーザーid"
                        type="text"
                        defaultValue={useridValue}
                        onChange={e => setUserid(e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="password"
                        label="パスワード"
                        type="text"
                        defaultValue={passwordValue}
                        onChange={e => setPassword(e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="displayName"
                        label="パスワード"
                        type="text"
                        value={displayNameValue}
                        onChange={e => setDisplayName(e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="userType"
                        label="種別"
                        select
                        value={userTypeValue}
                        onChange={e => setUserType(e.target.value as userTypeProp)}
                        margin="normal"
                        fullWidth>
                        {userTypeList.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ width: '100%', textAlign: 'right' }}>
                        <Button onClick={createUser} variant="contained">
                            作成
                        </Button>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AdminIndex;