import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from '#/recoil/page';

import { Grid, Card } from '@mui/material';

const AdminManageExhibit = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "展示管理" });
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

export default AdminManageExhibit;