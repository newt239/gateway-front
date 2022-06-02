import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";
// @ts-ignore
import ReactMarkdown from "react-markdown";

import { Grid, Card } from "@mui/material";

const DocsEach = () => {
  const { doc_id } = useParams<{ doc_id: string }>() || "top";
  const [md, setMd] = useState<string>("");
  useEffect(() => {
    if (doc_id) {
      fetch(require(`./markdown/${doc_id}.md`))
        .then((res) => {
          return res.text();
        })
        .then((text) => {
          setMd(text);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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

export default DocsEach;
