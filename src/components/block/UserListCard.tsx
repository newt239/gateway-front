import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import aspidaClient from "@aspida/axios";
import api from "#/api/$api";

import { Typography, List, ListItem, ListItemText } from "@mui/material";

const UserListCard = () => {
  const token = useRecoilValue(tokenState);

  const [createHistory, setCreateHistory] = useState<
    { user_id: string; display_name: string; user_type: string }[]
  >([]);

  // 過去に自分が作成したユーザーのリスト
  useEffect(() => {
    const getData = () => {
      if (token) {
        api(aspidaClient()).admin.user.created_by_me.$get({
          headers: { Authorization: "Bearer " + token },
        })
          .then((res) => {
            if (res.length !== 0) {
              setCreateHistory([...createHistory, ...res]);
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
