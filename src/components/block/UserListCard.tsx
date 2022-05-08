import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import axios, { AxiosResponse, AxiosError } from "axios";

import { Typography, List, ListItem, ListItemText } from "@mui/material";

import { createdByMeSuccessProp } from "#/types/admin";

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const UserListCard = () => {
  const token = useRecoilValue(tokenState);

  const [createHistory, setCreateHistory] = useState<
    { user_id: string; display_name: string; user_type: string }[]
  >([]);

  // 過去に自分が作成したユーザーのリスト
  useEffect(() => {
    const getData = () => {
      if (token) {
        axios
          .get(`${API_BASE_URL}/v1/admin/created-by-me`, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res: AxiosResponse<createdByMeSuccessProp>) => {
            if (res.data.data.length !== 0) {
              setCreateHistory([...createHistory, ...res.data.data]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      getData();
    };
  }, []);

  return (
    <>
      <Typography variant="h3">作成したユーザー一覧</Typography>
      <List dense={true}>
        {createHistory.map((history) => (
          <ListItem key={history.user_id}>
            <ListItemText
              primary={
                history.display_name +
                " ( ユーザーid: " +
                history.user_id +
                " )"
              }
            />
          </ListItem>
        ))}
        {createHistory.length === 0 && (
          <Typography>まだユーザーを作成していません。</Typography>
        )}
      </List>
    </>
  );
};

export default UserListCard;
