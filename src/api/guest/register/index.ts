/* eslint-disable */
export type Methods = {
  /** 同一の予約からの登録はひとつにまとめる。人数が超過したら(する前にフロントで警告が出るはずだが)エラーを返す */
  post: {
    reqHeaders?:
      | {
          Authorization: string;
        }
      | undefined;

    status: 200;

    reqBody: {
      reservation_id: string;
      guest_type: string;
      guest_id: string[];
      part: number;
    };
  };
};
