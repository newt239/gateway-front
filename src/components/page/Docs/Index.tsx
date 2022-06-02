import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";
// @ts-ignore
import ReactMarkdown from "react-markdown";
import { } from "react-markdown/lib/ast-to-react";

import { Grid, Card } from "@mui/material";

const DocsIndex = () => {
  const [md, setMd] = useState<string>("");
  useEffect(() => {
    fetch(require(`./markdown/top.md`))
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        setMd(text);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ドキュメント" });
  }, []);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <ReactMarkdown children={md} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default DocsIndex;
