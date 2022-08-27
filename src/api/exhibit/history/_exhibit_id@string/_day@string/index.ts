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
      time: string;
      count: number;
    }[];
  };
};
