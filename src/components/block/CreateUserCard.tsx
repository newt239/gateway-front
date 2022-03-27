import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import { pageStateSelector } from '#/recoil/page';
import axios from "axios";

import { Typography, TextField, MenuItem, Box, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

import { userTypeProp } from "#/components/functional/generalProps";

import ErrorDialog from "./ErrorDialog";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;


const CreateUserCard = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "管理者用" });
  }, []);

  const token = useRecoilValue(tokenState);

  const [userIdValue, setUserId] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [displayNameValue, setDisplayName] = useState("");
  const [userTypeValue, setUserType] = useState<userTypeProp>("exhibit");
  const [loading, setLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState<string[]>([]);
  const [createHistory, setCreateHistory] = useState<string[]>([]);

  const userTypeList: { value: userTypeProp; label: string }[] = [
    { value: "moderator", label: "管理者" },
    { value: "executive", label: "文化祭実行委員" },
    { value: "exhibit", label: "展示担当者" },
    { value: "analysis", label: "データ分析" }
  ];

  const createUser = async () => {
    if (!loading) {
      setLoading(true);
      if (userIdValue === "" || displayNameValue === "" || userIdValue.length > 10 || displayNameValue.length > 20) {
        setErrorDialogMessage([
          userIdValue === "" ? "ユーザーidを入力してください。" : "",
          displayNameValue === "" ? "表示名を入力してください。" : "",
          userIdValue.length > 10 ? "ユーザーidは10字以内で設定してください。" : "",
          displayNameValue.length > 20 ? "表示名は10字以内で設定してください。" : "",
        ]);
        setLoading(false);
        setShowErrorDialog(true);
        return;
      }
      const payload = {
        userId: userIdValue,
        password: passwordValue,
        displayName: displayNameValue,
        userType: userTypeValue
      };
      const res = await axios.post(`${API_BASE_URL}/v1/admin/create`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => { return res });
      console.log(res);
      if (res.data.status == "success") {
        setCreateHistory([...createHistory, userIdValue]);
        console.log("operation of create user was succeed.");
      } else {
        setErrorDialogMessage([res.data.message]);
        setShowErrorDialog(true);
      }
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowErrorDialog(false);
    setErrorDialogMessage([]);
  };

  return (
    <>
      <Typography variant="h3">ユーザーの作成</Typography>
      <TextField
        id="userId"
        label="ユーザーid"
        type="text"
        value={userIdValue}
        error={userIdValue.length > 10}
        helperText={userIdValue.length > 10 && 'ユーザーidは10字以内で設定してください。'}
        onChange={e => setUserId(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        id="password"
        label="パスワード"
        type="text"
        value={passwordValue}
        onChange={e => setPassword(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        id="displayName"
        label="表示名"
        type="text"
        value={displayNameValue}
        error={displayNameValue.length > 20}
        helperText={displayNameValue.length > 20 && '表示名は10字以内で設定してください。'}
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
        <Button
          onClick={createUser}
          disabled={loading}
          variant="contained"
          startIcon={loading && <CircularProgress size={24} />}
        >
          作成
        </Button>
      </Box>
      <ErrorDialog
        open={showErrorDialog}
        message={errorDialogMessage}
        onClose={handleClose}
      />
      <Typography variant="h4">作成履歴</Typography>
      <List dense={true}>
        {createHistory.map(history => (
          <ListItem key={history}>
            <ListItemText
              primary={history}
            />
          </ListItem>
        ))}
        {createHistory.length === 0 && <Typography>まだユーザーを作成していません。</Typography>}
      </List>
    </>
  );
};

export default CreateUserCard; 