import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom, profileAtom } from "#/components/lib/jotai";
import { AxiosError } from "axios";
import apiClient from "#/axios-config";
import moment from "moment";
import ReactGA from "react-ga4";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";

import { handleApiError } from "#/components/lib/commonFunction";

const columns: GridColDef[] = [
  { field: "id", headerName: "ゲストID" },
  { field: "guest_type", headerName: "属性" },
  { field: "enter_at", headerName: "入室時刻", width: 150 },
];

type ExhibitCurrentGuestTableListProp = {
  id: string;
  guest_type: string;
  enter_at: string;
}[];

const ExhibitCurrentGuestList: React.VFC<{ exhibit_id: string }> = ({
  exhibit_id,
}) => {
  const token = useAtomValue(tokenAtom);
  const profile = useAtomValue(profileAtom);
  const [rows, setRows] = useState<ExhibitCurrentGuestTableListProp>([]);
  const [selectedGuestList, setSelectedGuestList] = useState<GridRowId[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

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
      setLoading(true);
      const payload: { guest_id: string; exhibit_id: string }[] = [];
      for (const guest of selectedGuestList) {
        const eachPayload = {
          guest_id: guest as string,
          exhibit_id: exhibit_id,
        };
        payload.push(eachPayload);
      }
      apiClient(process.env.REACT_APP_API_BASE_URL)
        .activity.exit.batch.$post({
          headers: { Authorization: "Bearer " + token },
          body: payload,
        })
        .then(() => {
          getCurrentGuestList();
          setSnackbarMessage("一括退場処理が完了しました。");
          ReactGA.event({
            category: "exhibit",
            action: "leave_some_guest",
            label: profile.user_id,
          });
        })
        .catch((err: AxiosError) => {
          handleApiError(err, "activity_exit_post");
          setSnackbarMessage("一括退場処理に失敗しました。");
        }).finally(() => {
          setDialogOpen(false);
          setLoading(false);
        });
    }
  };

  const ConfirmDialog: React.VFC = () => {
    const onClose = () => {
      setDialogOpen(false);
    };
    return (
      <Dialog open={dialogOpen} onClose={onClose}>
        <DialogTitle>一括退室処理</DialogTitle>
        <DialogContent>
          <DialogContentText>
            選択中のゲスト{selectedGuestList.length}名に退室処理を行います。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {loading && (
            <CircularProgress size={30} thickness={6} sx={{ mx: 2 }} />
          )}
          <Button onClick={onClose}>閉じる</Button>
          <Button onClick={leaveGuest} color="error" disabled={loading}>
            実行
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
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
      <Snackbar
        open={snackbarMessage !== null}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
      >
        <Alert variant="filled" severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExhibitCurrentGuestList;
