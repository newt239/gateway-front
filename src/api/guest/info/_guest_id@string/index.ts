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
      guest_id: string;
      guest_type: string;
      exhibit_id: string;
      reservation_id: string;
      part: string;
      available: number;
    };
  };
};
