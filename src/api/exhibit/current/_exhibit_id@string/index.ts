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
      id: string;
      guest_type: string;
      enter_at: string;
    }[];
  };
};
