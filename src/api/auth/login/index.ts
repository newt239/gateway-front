/* eslint-disable */
export type Methods = {
  post: {
    status: 200;

    /** 正常レスポンス */
    resBody: {
      token: string;
    };

    reqBody: {
      user_id: string;
      password: string;
    };
  };
};
