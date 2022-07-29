/* eslint-disable */
export type Methods = {
  get: {
    reqHeaders?: {
      Authorization: string
    } | undefined

    status: 200
    /** 正常レスポンス */
    resBody: {
      exhibit_id: string
      enter_at: string
      exit_at: string
    }[]
  }
}
