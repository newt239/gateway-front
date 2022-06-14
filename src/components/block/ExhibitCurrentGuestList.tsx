import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { tokenState } from "#/recoil/user";
import apiClient from "#/axios-config";

import { Grid, Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AxiosError } from "axios";
import moment from "moment";

const columns: GridColDef[] = [
  { field: "id", headerName: "ゲストID" },
  { field: "guest_type", headerName: "属性" },
  { field: "enter_at", headerName: "入室時刻", width: 150 },
];

type exhibitCurrentGuestTableListProp = {
  id: string;
  guest_type: string;
  enter_at: string;
}[];

const ExhibitCurrentGuestList: React.FunctionComponent<{
  exhibit_id: string;
}> = ({ exhibit_id }) => {
  const [rows, setRows] = useState<exhibitCurrentGuestTableListProp>([]);
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    if (token && exhibit_id !== "") {
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .exhibit.current._exhibit_id(exhibit_id)
        .$get({
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const currentGuestList = res.map((v) => {
            return {
              ...v,
              guest_type:
                v.guest_type === "student"
                  ? "生徒"
                  : v.guest_type === "family"
                    ? "保護者"
                    : "その他",
              enter_at: moment(v.enter_at).format("MM/DD HH:MM:SS"),
            };
          });
          setRows(currentGuestList);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [exhibit_id]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Box sx={{ height: "60vh", width: "100%" }}>
          <DataGrid rows={rows} columns={columns} rowHeight={50} hideFooter checkboxSelection />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ExhibitCurrentGuestList;
