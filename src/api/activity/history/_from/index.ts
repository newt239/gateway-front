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
      activity_id: string;
      guest_id: string;
      exhibit_id: string;
      timestamp: string;
    }[];
  };
};
