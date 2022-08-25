import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom, profileAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment from "moment";
import ReactGA from "react-ga4";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";

import { handleApiError } from "#/components/lib/commonFunction";

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

const ExhibitCurrentGuestList: React.VFC<{ exhibit_id: string }> = ({ exhibit_id }) => {
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [rows, setRows] = useState<exhibitCurrentGuestTableListProp>([]);
  const [selectedGuestList, setSelectedGuestList] = useState<GridRowId[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getCurrentGuestList = () => {
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
                  : v.guest_type === "teacher"
                    ? "教員"
                    : v.guest_type === "family"
                      ? "保護者"
                      : "その他",
              enter_at: moment(v.enter_at).format("MM/DD HH:mm:ss"),
            };
          });
          setRows(currentGuestList);
        })
        .catch((err: AxiosError) => {
          handleApiError(err, "exhibit_current_each_get");
        });
    }
  };

  useEffect(() => {
    getCurrentGuestList();
  }, [exhibit_id]);

  const leaveGuest = () => {
    if (token && profile && exhibit_id) {
      for (const guest of selectedGuestList) {
        if (typeof guest == "string") {
          const payload = {
            guest_id: guest,
            exhibit_id: exhibit_id,
          };
          apiClient(process.env.REACT_APP_API_BASE_URL)
            .activity.exit.$post({
              headers: { Authorization: "Bearer " + token },
              body: payload,
            })
            .then(() => {
              getCurrentGuestList();
              setDialogOpen(false);
              ReactGA.event({
                category: "exhibit",
                action: "leave_some_guest",
                label: profile.user_id,
              });
            })
            .catch((err: AxiosError) => {
              handleApiError(err, "activity_exit_post");
            });
        }
      }
    }
  };

  const ConfirmDialog = () => {
    const onClose = () => {
      setDialogOpen(false);
    };
    return (
      <Dialog open={dialogOpen} onClose={onClose}>
        <DialogTitle>一括退室処理</DialogTitle>
        <DialogContent>
          <DialogContentText>{selectedGuestList.join(", ")}</DialogContentText>
          <DialogContentText>
            上記ゲスト{selectedGuestList.length}名に退室処理を行います。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>閉じる</Button>
          <Button onClick={leaveGuest} color="error">
            実行
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Grid container spacing={1} sx={{ width: "100%" }}>
      <Grid item xs={12}>
        <Typography variant="h3">現在滞在中のゲスト一覧</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: "100%", textAlign: "right" }}>
          <Button
            disabled={selectedGuestList.length === 0}
            variant="outlined"
            color="error"
            onClick={() => setDialogOpen(true)}
          >
            選択中のゲストを退室処理
          </Button>
        </Box>
        <ConfirmDialog />
      </Grid>
      <Grid item xs={12} sx={{ height: "100%" }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          rowHeight={50}
          checkboxSelection
          hideFooter
          onSelectionModelChange={(newSelection) => {
            setSelectedGuestList(newSelection);
          }}
          localeText={{
            noRowsLabel: "現在この展示に滞在中のゲストはいません",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ExhibitCurrentGuestList;
