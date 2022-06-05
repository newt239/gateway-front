/* eslint-disable */
export type Methods = {
  get: {
    reqHeaders?: {
      Authorization: string
    } | undefined

    status: 200

    /** 正常レスポンス */
    resBody: {
      reservation_id: string
      guest_type: string
      part: string
      count: number
      registered: number
      available: number
    }
  }
}
