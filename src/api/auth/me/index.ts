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
      user_id: string;
      display_name: string;
      user_type: string;
      available: number;
    };
  };
};
