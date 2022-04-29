import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from '#/recoil/page';

import { Grid, Card } from '@mui/material';

const AdminCheckGuest = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ゲスト照会" });
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 2 }}>

        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminCheckGuest;