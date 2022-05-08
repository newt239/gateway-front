import { exhibitCurrentGuestProp } from "#/components/functional/generalProps";

export interface infoSuccessProp {
  status: "success";
  data: {
    exhibit_id: string;
    exhibit_name: string;
  }[];
}

export interface enterChartSuccessProp {
  status: "success";
  data: { time: string; count: number }[];
}

export interface currentEachExhibitSuccessProp {
  status: "success";
  data: exhibitCurrentGuestProp[];
}
