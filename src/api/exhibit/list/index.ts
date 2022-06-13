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
      group_name: string
      exhibit_type: string
    }[]
  }
}
