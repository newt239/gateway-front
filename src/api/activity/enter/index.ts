/* eslint-disable */
export type Methods = {
  post: {
    reqHeaders?:
      | {
          Authorization: string;
        }
      | undefined;

    status: 200;

    /** 正常レスポンス */
    resBody: {
      session_id: string;
    };

    reqBody: {
      guest_id: string;
      exhibit_id: string;
    };
  };
};
