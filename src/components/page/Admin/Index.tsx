import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from '#/recoil/page';

import { Grid, Card } from '@mui/material';

import CreateUserCard from '#/components/block/CreateUserCard';
import DeleteUserCard from '#/components/block/DeleteUserCard';
import UserListCard from '#/components/block/UserListCard';

const AdminIndex = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "管理者用" });
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <CreateUserCard />
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <DeleteUserCard />
        </Card>
        <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
          <UserListCard />
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminIndex;