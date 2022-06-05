import type { AspidaClient, BasicHeaders } from 'aspida'
import type { Methods as Methods0 } from './activity/enter'
import type { Methods as Methods1 } from './activity/exit'
import type { Methods as Methods2 } from './admin/exhibit/create'
import type { Methods as Methods3 } from './admin/exhibit/delete/_exhibit_id@string'
import type { Methods as Methods4 } from './admin/user/create'
import type { Methods as Methods5 } from './admin/user/created-by-me'
import type { Methods as Methods6 } from './admin/user/delete/_user_id@string'
import type { Methods as Methods7 } from './auth/login'
import type { Methods as Methods8 } from './auth/me'
import type { Methods as Methods9 } from './exhibit/current/_exhibit_id@string'
import type { Methods as Methods10 } from './exhibit/history/_exhibit_id@string/_day@string'
import type { Methods as Methods11 } from './exhibit/info/_exhibit_id@string'
import type { Methods as Methods12 } from './exhibit/list'
import type { Methods as Methods13 } from './guest/info/_guest_id@string'
import type { Methods as Methods14 } from './guest/register'
import type { Methods as Methods15 } from './reservation/info/_reservation_id@string'

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'https://api.sh-fes.com/v1' : baseURL).replace(/\/$/, '')
  const PATH0 = '/activity/enter'
  const PATH1 = '/activity/exit'
  const PATH2 = '/admin/exhibit/create'
  const PATH3 = '/admin/exhibit/delete'
  const PATH4 = '/admin/user/create'
  const PATH5 = '/admin/user/created-by-me'
  const PATH6 = '/admin/user/delete'
  const PATH7 = '/auth/login'
  const PATH8 = '/auth/me'
  const PATH9 = '/exhibit/current'
  const PATH10 = '/exhibit/history'
  const PATH11 = '/exhibit/info'
  const PATH12 = '/exhibit/list'
  const PATH13 = '/guest/info'
  const PATH14 = '/guest/register'
  const PATH15 = '/reservation/info'
  const GET = 'GET'
  const POST = 'POST'
  const DELETE = 'DELETE'

  return {
    activity: {
      enter: {
        /**
         * @returns 正常レスポンス
         */
        post: (option: { body: Methods0['post']['reqBody'], headers?: Methods0['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
          fetch<Methods0['post']['resBody'], BasicHeaders, Methods0['post']['status']>(prefix, PATH0, POST, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $post: (option: { body: Methods0['post']['reqBody'], headers?: Methods0['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
          fetch<Methods0['post']['resBody'], BasicHeaders, Methods0['post']['status']>(prefix, PATH0, POST, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH0}`
      },
      exit: {
        /**
         * @returns 正常レスポンス
         */
        post: (option: { body: Methods1['post']['reqBody'], headers?: Methods1['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
          fetch<Methods1['post']['resBody'], BasicHeaders, Methods1['post']['status']>(prefix, PATH1, POST, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $post: (option: { body: Methods1['post']['reqBody'], headers?: Methods1['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
          fetch<Methods1['post']['resBody'], BasicHeaders, Methods1['post']['status']>(prefix, PATH1, POST, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH1}`
      }
    },
    admin: {
      exhibit: {
        create: {
          post: (option: { body: Methods2['post']['reqBody'], headers?: Methods2['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
            fetch<void, BasicHeaders, Methods2['post']['status']>(prefix, PATH2, POST, option).send(),
          $post: (option: { body: Methods2['post']['reqBody'], headers?: Methods2['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
            fetch<void, BasicHeaders, Methods2['post']['status']>(prefix, PATH2, POST, option).send().then(r => r.body),
          $path: () => `${prefix}${PATH2}`
        },
        delete: {
          _exhibit_id: (val3: string) => {
            const prefix3 = `${PATH3}/${val3}`

            return {
              delete: (option?: { headers?: Methods3['delete']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
                fetch<void, BasicHeaders, Methods3['delete']['status']>(prefix, prefix3, DELETE, option).send(),
              $delete: (option?: { headers?: Methods3['delete']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
                fetch<void, BasicHeaders, Methods3['delete']['status']>(prefix, prefix3, DELETE, option).send().then(r => r.body),
              $path: () => `${prefix}${prefix3}`
            }
          }
        }
      },
      user: {
        create: {
          post: (option: { body: Methods4['post']['reqBody'], headers?: Methods4['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
            fetch<void, BasicHeaders, Methods4['post']['status']>(prefix, PATH4, POST, option).send(),
          $post: (option: { body: Methods4['post']['reqBody'], headers?: Methods4['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
            fetch<void, BasicHeaders, Methods4['post']['status']>(prefix, PATH4, POST, option).send().then(r => r.body),
          $path: () => `${prefix}${PATH4}`
        },
        created_by_me: {
          /**
           * @returns 正常レスポンス
           */
          get: (option?: { headers?: Methods5['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
            fetch<Methods5['get']['resBody'], BasicHeaders, Methods5['get']['status']>(prefix, PATH5, GET, option).json(),
          /**
           * @returns 正常レスポンス
           */
          $get: (option?: { headers?: Methods5['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
            fetch<Methods5['get']['resBody'], BasicHeaders, Methods5['get']['status']>(prefix, PATH5, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH5}`
        },
        delete: {
          _user_id: (val3: string) => {
            const prefix3 = `${PATH6}/${val3}`

            return {
              delete: (option?: { headers?: Methods6['delete']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
                fetch<void, BasicHeaders, Methods6['delete']['status']>(prefix, prefix3, DELETE, option).send(),
              $delete: (option?: { headers?: Methods6['delete']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
                fetch<void, BasicHeaders, Methods6['delete']['status']>(prefix, prefix3, DELETE, option).send().then(r => r.body),
              $path: () => `${prefix}${prefix3}`
            }
          }
        }
      }
    },
    auth: {
      login: {
        /**
         * @returns 正常レスポンス
         */
        post: (option: { body: Methods7['post']['reqBody'], config?: T | undefined }) =>
          fetch<Methods7['post']['resBody'], BasicHeaders, Methods7['post']['status']>(prefix, PATH7, POST, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $post: (option: { body: Methods7['post']['reqBody'], config?: T | undefined }) =>
          fetch<Methods7['post']['resBody'], BasicHeaders, Methods7['post']['status']>(prefix, PATH7, POST, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH7}`
      },
      me: {
        /**
         * @returns 正常レスポンス
         */
        get: (option?: { headers?: Methods8['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
          fetch<Methods8['get']['resBody'], BasicHeaders, Methods8['get']['status']>(prefix, PATH8, GET, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $get: (option?: { headers?: Methods8['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
          fetch<Methods8['get']['resBody'], BasicHeaders, Methods8['get']['status']>(prefix, PATH8, GET, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH8}`
      }
    },
    exhibit: {
      current: {
        _exhibit_id: (val2: string) => {
          const prefix2 = `${PATH9}/${val2}`

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (option?: { headers?: Methods9['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
              fetch<Methods9['get']['resBody'], BasicHeaders, Methods9['get']['status']>(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (option?: { headers?: Methods9['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
              fetch<Methods9['get']['resBody'], BasicHeaders, Methods9['get']['status']>(prefix, prefix2, GET, option).json().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        }
      },
      history: {
        _exhibit_id: (val2: string) => {
          const prefix2 = `${PATH10}/${val2}`

          return {
            _day: (val3: string) => {
              const prefix3 = `${prefix2}/${val3}`

              return {
                /**
                 * @returns 正常レスポンス
                 */
                get: (option?: { headers?: Methods10['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
                  fetch<Methods10['get']['resBody'], BasicHeaders, Methods10['get']['status']>(prefix, prefix3, GET, option).json(),
                /**
                 * @returns 正常レスポンス
                 */
                $get: (option?: { headers?: Methods10['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
                  fetch<Methods10['get']['resBody'], BasicHeaders, Methods10['get']['status']>(prefix, prefix3, GET, option).json().then(r => r.body),
                $path: () => `${prefix}${prefix3}`
              }
            }
          }
        }
      },
      info: {
        _exhibit_id: (val2: string) => {
          const prefix2 = `${PATH11}/${val2}`

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (option?: { headers?: Methods11['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
              fetch<Methods11['get']['resBody'], BasicHeaders, Methods11['get']['status']>(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (option?: { headers?: Methods11['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
              fetch<Methods11['get']['resBody'], BasicHeaders, Methods11['get']['status']>(prefix, prefix2, GET, option).json().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        }
      },
      list: {
        /**
         * @returns 正常レスポンス
         */
        get: (option?: { headers?: Methods12['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
          fetch<Methods12['get']['resBody'], BasicHeaders, Methods12['get']['status']>(prefix, PATH12, GET, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $get: (option?: { headers?: Methods12['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
          fetch<Methods12['get']['resBody'], BasicHeaders, Methods12['get']['status']>(prefix, PATH12, GET, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH12}`
      }
    },
    guest: {
      info: {
        _guest_id: (val2: string) => {
          const prefix2 = `${PATH13}/${val2}`

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (option?: { headers?: Methods13['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
              fetch<Methods13['get']['resBody'], BasicHeaders, Methods13['get']['status']>(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (option?: { headers?: Methods13['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
              fetch<Methods13['get']['resBody'], BasicHeaders, Methods13['get']['status']>(prefix, prefix2, GET, option).json().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        }
      },
      register: {
        /**
         * 同一の予約からの登録はひとつにまとめる。人数が超過したら(する前にフロントで警告が出るはずだが)エラーを返す
         */
        post: (option: { body: Methods14['post']['reqBody'], headers?: Methods14['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
          fetch<void, BasicHeaders, Methods14['post']['status']>(prefix, PATH14, POST, option).send(),
        /**
         * 同一の予約からの登録はひとつにまとめる。人数が超過したら(する前にフロントで警告が出るはずだが)エラーを返す
         */
        $post: (option: { body: Methods14['post']['reqBody'], headers?: Methods14['post']['reqHeaders'] | undefined, config?: T | undefined }) =>
          fetch<void, BasicHeaders, Methods14['post']['status']>(prefix, PATH14, POST, option).send().then(r => r.body),
        $path: () => `${prefix}${PATH14}`
      }
    },
    reservation: {
      info: {
        _reservation_id: (val2: string) => {
          const prefix2 = `${PATH15}/${val2}`

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (option?: { headers?: Methods15['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
              fetch<Methods15['get']['resBody'], BasicHeaders, Methods15['get']['status']>(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (option?: { headers?: Methods15['get']['reqHeaders'] | undefined, config?: T | undefined } | undefined) =>
              fetch<Methods15['get']['resBody'], BasicHeaders, Methods15['get']['status']>(prefix, prefix2, GET, option).json().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        }
      }
    }
  }
}

export type ApiInstance = ReturnType<typeof api>
export default api
