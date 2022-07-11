/* eslint-disable */
export type Methods = {
  /** リストバンドを紛失した保護者へインフォメーションセンターで新しいリストバンドを発行 */
  post: {
    reqHeaders?: {
      Authorization: string
    } | undefined

    status: 200

    reqBody: {
      reservation_id: string
      guest_type: string
      new_guest_id: string
      old_guest_id: string
      part: number
    }
  }
}
