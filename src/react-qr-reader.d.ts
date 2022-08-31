import * as React from "react";
import type SxProps from "@mui/material/styles";
declare namespace QrReader {
  export interface props {
    onScan: (data: string | null) => void;
    onError: (err: unknown) => void;
    onLoad?:
      | ((data: { mirrorVideo: boolean; streamLabel: string }) => void)
      | undefined;
    onImageLoad?:
      | ((event: React.SyntheticEvent<HTMLImageElement>) => void)
      | undefined;
    delay?: number | false | undefined;
    facingMode?: "user" | "environment" | undefined;
    legacyMode?: boolean | undefined;
    resolution?: number | undefined;
    showViewFinder?: boolean | undefined;
    style?: SxProps;
    className?: string | undefined;
    constraints?: MediaTrackConstraints;
  }
}

export as namespace QrReader;

declare class QrReader extends React.Component<QrReader.props> {
  openImageDialog: () => void;
}

export = QrReader;
