/* eslint-disable */
export type Methods = {
  get: {
    reqHeaders?:
      | {
          Authorization: string;
        }
      | undefined;

    status: 200;
    /** 正常レスポンス */
    resBody: {
      exhibit_id: string;
      exhibit_name: string;
      group_name: string;
      room_name: string;
      exhibit_type: string;
      count: number;
      capacity: number;
      status: number;
    }[];
  };
};
