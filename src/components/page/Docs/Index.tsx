import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from '#/recoil/page';
import ReactMarkdown from 'react-markdown';
import { } from 'react-markdown/lib/ast-to-react';

import { Grid, Card } from '@mui/material';

const DocsIndex = () => {
    const [md, setMd] = useState<string>("");
    useEffect(() => {
        fetch(require(`./markdown/top.md`))
            .then(response => {
                return response.text()
            })
            .then(text => {
                setMd(text);
            })
    }, []);

    const setPageInfo = useSetRecoilState(pageStateSelector);
    useEffect(() => {
        setPageInfo({ title: "ドキュメント" });
    }, []);

    const linkBlock = ({ ...props }) => {
        const { href, children } = props;
        if (href.match('http')) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        } else if (href.slice(0, 1) == '#') {
            // ページ内リンク
            return <a href={href}>{children}</a>;
        } else {
            return <Link to={href}>{children}</Link>;
        };
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2 }}>
                    <ReactMarkdown children={md} components={{
                        a: linkBlock,
                    }} />
                </Card>
            </Grid>
        </Grid>
    )
}

export default DocsIndex;