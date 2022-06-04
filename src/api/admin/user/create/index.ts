/* eslint-disable */
export type Methods = {
  post: {
    reqHeaders?:
      | {
          Authorization: string;
        }
      | undefined;

    status: 200;

    reqBody: {
      user_id: string;
      password: string;
      display_name: string;
      user_type: string;
    };
  };
};
