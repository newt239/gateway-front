import type { AspidaClient, BasicHeaders } from "aspida";
import type { Methods as Methods0 } from "./activity/enter";
import type { Methods as Methods1 } from "./activity/exit";
import type { Methods as Methods2 } from "./admin/user/create";
import type { Methods as Methods3 } from "./admin/user/created-by-me";
import type { Methods as Methods4 } from "./admin/user/delete/_user_id@string";
import type { Methods as Methods5 } from "./auth/login";
import type { Methods as Methods6 } from "./auth/me";
import type { Methods as Methods7 } from "./exhibit/current/_exhibit_id@string";
import type { Methods as Methods8 } from "./exhibit/history/_exhibit_id@string/_day@string";
import type { Methods as Methods9 } from "./exhibit/info/_exhibit_id@string";
import type { Methods as Methods10 } from "./exhibit/list";
import type { Methods as Methods11 } from "./guest/info/_guest_id@string";
import type { Methods as Methods12 } from "./guest/register";
import type { Methods as Methods13 } from "./reservation/info/_reservation_id@string";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (
    baseURL === undefined ? "https://api.sh-fes.com/v1" : baseURL
  ).replace(/\/$/, "");
  const PATH0 = "/activity/enter";
  const PATH1 = "/activity/exit";
  const PATH2 = "/admin/user/create";
  const PATH3 = "/admin/user/created-by-me";
  const PATH4 = "/admin/user/delete";
  const PATH5 = "/auth/login";
  const PATH6 = "/auth/me";
  const PATH7 = "/exhibit/current";
  const PATH8 = "/exhibit/history";
  const PATH9 = "/exhibit/info";
  const PATH10 = "/exhibit/list";
  const PATH11 = "/guest/info";
  const PATH12 = "/guest/register";
  const PATH13 = "/reservation/info";
  const GET = "GET";
  const POST = "POST";
  const DELETE = "DELETE";

  return {
    activity: {
      enter: {
        /**
         * @returns 正常レスポンス
         */
        post: (option: {
          body: Methods0["post"]["reqBody"];
          headers?: Methods0["post"]["reqHeaders"] | undefined;
          config?: T | undefined;
        }) =>
          fetch<
            Methods0["post"]["resBody"],
            BasicHeaders,
            Methods0["post"]["status"]
          >(prefix, PATH0, POST, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $post: (option: {
          body: Methods0["post"]["reqBody"];
          headers?: Methods0["post"]["reqHeaders"] | undefined;
          config?: T | undefined;
        }) =>
          fetch<
            Methods0["post"]["resBody"],
            BasicHeaders,
            Methods0["post"]["status"]
          >(prefix, PATH0, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH0}`,
      },
      exit: {
        /**
         * @returns 正常レスポンス
         */
        post: (option: {
          body: Methods1["post"]["reqBody"];
          headers?: Methods1["post"]["reqHeaders"] | undefined;
          config?: T | undefined;
        }) =>
          fetch<
            Methods1["post"]["resBody"],
            BasicHeaders,
            Methods1["post"]["status"]
          >(prefix, PATH1, POST, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $post: (option: {
          body: Methods1["post"]["reqBody"];
          headers?: Methods1["post"]["reqHeaders"] | undefined;
          config?: T | undefined;
        }) =>
          fetch<
            Methods1["post"]["resBody"],
            BasicHeaders,
            Methods1["post"]["status"]
          >(prefix, PATH1, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH1}`,
      },
    },
    admin: {
      user: {
        create: {
          post: (option: {
            body: Methods2["post"]["reqBody"];
            headers?: Methods2["post"]["reqHeaders"] | undefined;
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods2["post"]["status"]>(
              prefix,
              PATH2,
              POST,
              option
            ).send(),
          $post: (option: {
            body: Methods2["post"]["reqBody"];
            headers?: Methods2["post"]["reqHeaders"] | undefined;
            config?: T | undefined;
          }) =>
            fetch<void, BasicHeaders, Methods2["post"]["status"]>(
              prefix,
              PATH2,
              POST,
              option
            )
              .send()
              .then((r) => r.body),
          $path: () => `${prefix}${PATH2}`,
        },
        created_by_me: {
          /**
           * @returns 正常レスポンス
           */
          get: (
            option?:
              | {
                  headers?: Methods3["get"]["reqHeaders"] | undefined;
                  config?: T | undefined;
                }
              | undefined
          ) =>
            fetch<
              Methods3["get"]["resBody"],
              BasicHeaders,
              Methods3["get"]["status"]
            >(prefix, PATH3, GET, option).json(),
          /**
           * @returns 正常レスポンス
           */
          $get: (
            option?:
              | {
                  headers?: Methods3["get"]["reqHeaders"] | undefined;
                  config?: T | undefined;
                }
              | undefined
          ) =>
            fetch<
              Methods3["get"]["resBody"],
              BasicHeaders,
              Methods3["get"]["status"]
            >(prefix, PATH3, GET, option)
              .json()
              .then((r) => r.body),
          $path: () => `${prefix}${PATH3}`,
        },
        delete: {
          _user_id: (val3: string) => {
            const prefix3 = `${PATH4}/${val3}`;

            return {
              delete: (
                option?:
                  | {
                      headers?: Methods4["delete"]["reqHeaders"] | undefined;
                      config?: T | undefined;
                    }
                  | undefined
              ) =>
                fetch<void, BasicHeaders, Methods4["delete"]["status"]>(
                  prefix,
                  prefix3,
                  DELETE,
                  option
                ).send(),
              $delete: (
                option?:
                  | {
                      headers?: Methods4["delete"]["reqHeaders"] | undefined;
                      config?: T | undefined;
                    }
                  | undefined
              ) =>
                fetch<void, BasicHeaders, Methods4["delete"]["status"]>(
                  prefix,
                  prefix3,
                  DELETE,
                  option
                )
                  .send()
                  .then((r) => r.body),
              $path: () => `${prefix}${prefix3}`,
            };
          },
        },
      },
    },
    auth: {
      login: {
        /**
         * @returns 正常レスポンス
         */
        post: (option: {
          body: Methods5["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods5["post"]["resBody"],
            BasicHeaders,
            Methods5["post"]["status"]
          >(prefix, PATH5, POST, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $post: (option: {
          body: Methods5["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods5["post"]["resBody"],
            BasicHeaders,
            Methods5["post"]["status"]
          >(prefix, PATH5, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH5}`,
      },
      me: {
        /**
         * @returns 正常レスポンス
         */
        get: (
          option?:
            | {
                headers?: Methods6["get"]["reqHeaders"] | undefined;
                config?: T | undefined;
              }
            | undefined
        ) =>
          fetch<
            Methods6["get"]["resBody"],
            BasicHeaders,
            Methods6["get"]["status"]
          >(prefix, PATH6, GET, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $get: (
          option?:
            | {
                headers?: Methods6["get"]["reqHeaders"] | undefined;
                config?: T | undefined;
              }
            | undefined
        ) =>
          fetch<
            Methods6["get"]["resBody"],
            BasicHeaders,
            Methods6["get"]["status"]
          >(prefix, PATH6, GET, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH6}`,
      },
    },
    exhibit: {
      current: {
        _exhibit_id: (val2: string) => {
          const prefix2 = `${PATH7}/${val2}`;

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (
              option?:
                | {
                    headers?: Methods7["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods7["get"]["resBody"],
                BasicHeaders,
                Methods7["get"]["status"]
              >(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (
              option?:
                | {
                    headers?: Methods7["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods7["get"]["resBody"],
                BasicHeaders,
                Methods7["get"]["status"]
              >(prefix, prefix2, GET, option)
                .json()
                .then((r) => r.body),
            $path: () => `${prefix}${prefix2}`,
          };
        },
      },
      history: {
        _exhibit_id: (val2: string) => {
          const prefix2 = `${PATH8}/${val2}`;

          return {
            _day: (val3: string) => {
              const prefix3 = `${prefix2}/${val3}`;

              return {
                /**
                 * @returns 正常レスポンス
                 */
                get: (
                  option?:
                    | {
                        headers?: Methods8["get"]["reqHeaders"] | undefined;
                        config?: T | undefined;
                      }
                    | undefined
                ) =>
                  fetch<
                    Methods8["get"]["resBody"],
                    BasicHeaders,
                    Methods8["get"]["status"]
                  >(prefix, prefix3, GET, option).json(),
                /**
                 * @returns 正常レスポンス
                 */
                $get: (
                  option?:
                    | {
                        headers?: Methods8["get"]["reqHeaders"] | undefined;
                        config?: T | undefined;
                      }
                    | undefined
                ) =>
                  fetch<
                    Methods8["get"]["resBody"],
                    BasicHeaders,
                    Methods8["get"]["status"]
                  >(prefix, prefix3, GET, option)
                    .json()
                    .then((r) => r.body),
                $path: () => `${prefix}${prefix3}`,
              };
            },
          };
        },
      },
      info: {
        _exhibit_id: (val2: string) => {
          const prefix2 = `${PATH9}/${val2}`;

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (
              option?:
                | {
                    headers?: Methods9["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods9["get"]["resBody"],
                BasicHeaders,
                Methods9["get"]["status"]
              >(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (
              option?:
                | {
                    headers?: Methods9["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods9["get"]["resBody"],
                BasicHeaders,
                Methods9["get"]["status"]
              >(prefix, prefix2, GET, option)
                .json()
                .then((r) => r.body),
            $path: () => `${prefix}${prefix2}`,
          };
        },
      },
      list: {
        /**
         * @returns 正常レスポンス
         */
        get: (
          option?:
            | {
                headers?: Methods10["get"]["reqHeaders"] | undefined;
                config?: T | undefined;
              }
            | undefined
        ) =>
          fetch<
            Methods10["get"]["resBody"],
            BasicHeaders,
            Methods10["get"]["status"]
          >(prefix, PATH10, GET, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $get: (
          option?:
            | {
                headers?: Methods10["get"]["reqHeaders"] | undefined;
                config?: T | undefined;
              }
            | undefined
        ) =>
          fetch<
            Methods10["get"]["resBody"],
            BasicHeaders,
            Methods10["get"]["status"]
          >(prefix, PATH10, GET, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH10}`,
      },
    },
    guest: {
      info: {
        _guest_id: (val2: string) => {
          const prefix2 = `${PATH11}/${val2}`;

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (
              option?:
                | {
                    headers?: Methods11["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods11["get"]["resBody"],
                BasicHeaders,
                Methods11["get"]["status"]
              >(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (
              option?:
                | {
                    headers?: Methods11["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods11["get"]["resBody"],
                BasicHeaders,
                Methods11["get"]["status"]
              >(prefix, prefix2, GET, option)
                .json()
                .then((r) => r.body),
            $path: () => `${prefix}${prefix2}`,
          };
        },
      },
      register: {
        /**
         * 同一の予約からの登録はひとつにまとめる。人数が超過したら(する前にフロントで警告が出るはずだが)エラーを返す
         */
        post: (option: {
          body: Methods12["post"]["reqBody"];
          headers?: Methods12["post"]["reqHeaders"] | undefined;
          config?: T | undefined;
        }) =>
          fetch<void, BasicHeaders, Methods12["post"]["status"]>(
            prefix,
            PATH12,
            POST,
            option
          ).send(),
        /**
         * 同一の予約からの登録はひとつにまとめる。人数が超過したら(する前にフロントで警告が出るはずだが)エラーを返す
         */
        $post: (option: {
          body: Methods12["post"]["reqBody"];
          headers?: Methods12["post"]["reqHeaders"] | undefined;
          config?: T | undefined;
        }) =>
          fetch<void, BasicHeaders, Methods12["post"]["status"]>(
            prefix,
            PATH12,
            POST,
            option
          )
            .send()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH12}`,
      },
    },
    reservation: {
      info: {
        _reservation_id: (val2: string) => {
          const prefix2 = `${PATH13}/${val2}`;

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (
              option?:
                | {
                    headers?: Methods13["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods13["get"]["resBody"],
                BasicHeaders,
                Methods13["get"]["status"]
              >(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (
              option?:
                | {
                    headers?: Methods13["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods13["get"]["resBody"],
                BasicHeaders,
                Methods13["get"]["status"]
              >(prefix, prefix2, GET, option)
                .json()
                .then((r) => r.body),
            $path: () => `${prefix}${prefix2}`,
          };
        },
      },
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
