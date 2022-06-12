/* eslint-disable */
export type Methods = {
  get: {
    reqHeaders?: {
      Authorization: string
    } | undefined

    status: 200
    /** 正常レスポンス */
    resBody: {
      id: string
      exhibit_name: string
      count: number
      capacity: number
    }[]
  }
}
