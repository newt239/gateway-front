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
      part: number
      count: number
      registered: {
        guest_id: string
        is_spare: number
      }[]
      available: number
    }
  }
}
