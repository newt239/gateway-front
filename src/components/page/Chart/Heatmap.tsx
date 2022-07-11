import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { pageStateSelector } from "#/recoil/page";

import { Box } from "@mui/material";

const Heatmap = () => {
  const setPageInfo = useSetRecoilState(pageStateSelector);
  useEffect(() => {
    setPageInfo({ title: "ヒートマップ" });
  }, []);

  type propTypes = {
    exhibit_id: string;
    room_name: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }
  const exhibitList: propTypes[] = [
    { exhibit_id: "1", room_name: "1201", x: 1000, y: 100, width: 50, height: 50 },
    { exhibit_id: "2", room_name: "1202", x: 940, y: 100, width: 50, height: 50 },
    { exhibit_id: "3", room_name: "1203", x: 880, y: 100, width: 50, height: 50 },
    { exhibit_id: "4", room_name: "1204", x: 780, y: 80, width: 50, height: 50 },
    { exhibit_id: "5", room_name: "1205", x: 780, y: 140, width: 50, height: 50 },
    { exhibit_id: "6", room_name: "1206", x: 780, y: 200, width: 50, height: 50 },
    { exhibit_id: "7", room_name: "1207", x: 780, y: 260, width: 50, height: 50 },
    { exhibit_id: "8", room_name: "1208", x: 780, y: 320, width: 50, height: 50 }
  ]

  const EachExhibit = ({ posProps }: { posProps: propTypes }) => {
    return (<svg width={posProps.width} height={posProps.height} xmlns="http://www.w3.org/2000/svg" style={{ position: "fixed", top: posProps.y, left: posProps.x }}>
      <rect width={posProps.width} height={posProps.height} rx="10" ry="10" fill="#e74c3c" />
      <text x="50%" y="50%" fontFamily="serif" fontWeight="bold" fontSize={15} textAnchor="middle" dominantBaseline="middle" fill="#fff">
        {posProps.room_name}
      </text>
    </svg>)
  }

  return (
    <Box sx={{ p: 2, backgroundColor: "white", zIndex: 1200, position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
      {exhibitList.map((eachExhibit) => {
        return <EachExhibit posProps={eachExhibit} key={eachExhibit.exhibit_id} />
      })}
    </Box>
  );
};

export default Heatmap;
