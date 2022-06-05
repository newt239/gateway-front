/* eslint-disable */
export type Methods = {
  post: {
    reqHeaders?: {
      Authorization: string
    } | undefined

    status: 200

    reqBody: {
      exhibit_id: string
      exhibit_name: string
      room_name: string
      exhibit_type: string
      capacity: number
    }
  }
}
