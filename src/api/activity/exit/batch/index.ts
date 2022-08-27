/* eslint-disable */
export type Methods = {
  post: {
    reqHeaders?: {
      Authorization: string
    } | undefined

    status: 200
    reqBody: {
      guest_id: string
      exhibit_id: string
    }[]
  }
}
