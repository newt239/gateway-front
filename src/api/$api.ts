import type { AspidaClient, BasicHeaders } from "aspida";
import type { Methods as Methods0 } from "./activity/enter";
import type { Methods as Methods1 } from "./activity/exit";
import type { Methods as Methods2 } from "./admin/exhibit/create";
import type { Methods as Methods3 } from "./admin/exhibit/delete/_exhibit_id@string";
import type { Methods as Methods4 } from "./auth/login";
import type { Methods as Methods5 } from "./auth/me";
import type { Methods as Methods6 } from "./exhibit/current";
import type { Methods as Methods7 } from "./exhibit/current/_exhibit_id@string";
import type { Methods as Methods8 } from "./exhibit/history/_exhibit_id@string/_day@string";
import type { Methods as Methods9 } from "./exhibit/info";
import type { Methods as Methods10 } from "./exhibit/info/_exhibit_id@string";
import type { Methods as Methods11 } from "./exhibit/list";
import type { Methods as Methods12 } from "./guest/info/_guest_id@string";
import type { Methods as Methods13 } from "./guest/register";
import type { Methods as Methods14 } from "./reservation/info/_reservation_id@string";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (
    baseURL === undefined ? "https://api.sh-fes.com/v1" : baseURL
  ).replace(/\/$/, "");
  const PATH0 = "/activity/enter";
  const PATH1 = "/activity/exit";
  const PATH2 = "/admin/exhibit/create";
  const PATH3 = "/admin/exhibit/delete";
  const PATH4 = "/auth/login";
  const PATH5 = "/auth/me";
  const PATH6 = "/exhibit/current";
  const PATH7 = "/exhibit/history";
  const PATH8 = "/exhibit/info";
  const PATH9 = "/exhibit/list";
  const PATH10 = "/guest/info";
  const PATH11 = "/guest/register";
  const PATH12 = "/reservation/info";
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
      exhibit: {
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
        delete: {
          _exhibit_id: (val3: string) => {
            const prefix3 = `${PATH3}/${val3}`;

            return {
              delete: (
                option?:
                  | {
                      headers?: Methods3["delete"]["reqHeaders"] | undefined;
                      config?: T | undefined;
                    }
                  | undefined
              ) =>
                fetch<void, BasicHeaders, Methods3["delete"]["status"]>(
                  prefix,
                  prefix3,
                  DELETE,
                  option
                ).send(),
              $delete: (
                option?:
                  | {
                      headers?: Methods3["delete"]["reqHeaders"] | undefined;
                      config?: T | undefined;
                    }
                  | undefined
              ) =>
                fetch<void, BasicHeaders, Methods3["delete"]["status"]>(
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
          body: Methods4["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods4["post"]["resBody"],
            BasicHeaders,
            Methods4["post"]["status"]
          >(prefix, PATH4, POST, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $post: (option: {
          body: Methods4["post"]["reqBody"];
          config?: T | undefined;
        }) =>
          fetch<
            Methods4["post"]["resBody"],
            BasicHeaders,
            Methods4["post"]["status"]
          >(prefix, PATH4, POST, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH4}`,
      },
      me: {
        /**
         * @returns 正常レスポンス
         */
        get: (
          option?:
            | {
                headers?: Methods5["get"]["reqHeaders"] | undefined;
                config?: T | undefined;
              }
            | undefined
        ) =>
          fetch<
            Methods5["get"]["resBody"],
            BasicHeaders,
            Methods5["get"]["status"]
          >(prefix, PATH5, GET, option).json(),
        /**
         * @returns 正常レスポンス
         */
        $get: (
          option?:
            | {
                headers?: Methods5["get"]["reqHeaders"] | undefined;
                config?: T | undefined;
              }
            | undefined
        ) =>
          fetch<
            Methods5["get"]["resBody"],
            BasicHeaders,
            Methods5["get"]["status"]
          >(prefix, PATH5, GET, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH5}`,
      },
    },
    exhibit: {
      current: {
        _exhibit_id: (val2: string) => {
          const prefix2 = `${PATH6}/${val2}`;

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
      history: {
        _exhibit_id: (val2: string) => {
          const prefix2 = `${PATH7}/${val2}`;

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
          const prefix2 = `${PATH8}/${val2}`;

          return {
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
              >(prefix, prefix2, GET, option).json(),
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
              >(prefix, prefix2, GET, option)
                .json()
                .then((r) => r.body),
            $path: () => `${prefix}${prefix2}`,
          };
        },
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
          >(prefix, PATH8, GET, option).json(),
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
          >(prefix, PATH8, GET, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH8}`,
      },
      list: {
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
          >(prefix, PATH9, GET, option).json(),
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
          >(prefix, PATH9, GET, option)
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH9}`,
      },
    },
    guest: {
      info: {
        _guest_id: (val2: string) => {
          const prefix2 = `${PATH10}/${val2}`;

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (
              option?:
                | {
                    headers?: Methods12["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods12["get"]["resBody"],
                BasicHeaders,
                Methods12["get"]["status"]
              >(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (
              option?:
                | {
                    headers?: Methods12["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods12["get"]["resBody"],
                BasicHeaders,
                Methods12["get"]["status"]
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
          body: Methods13["post"]["reqBody"];
          headers?: Methods13["post"]["reqHeaders"] | undefined;
          config?: T | undefined;
        }) =>
          fetch<void, BasicHeaders, Methods13["post"]["status"]>(
            prefix,
            PATH11,
            POST,
            option
          ).send(),
        /**
         * 同一の予約からの登録はひとつにまとめる。人数が超過したら(する前にフロントで警告が出るはずだが)エラーを返す
         */
        $post: (option: {
          body: Methods13["post"]["reqBody"];
          headers?: Methods13["post"]["reqHeaders"] | undefined;
          config?: T | undefined;
        }) =>
          fetch<void, BasicHeaders, Methods13["post"]["status"]>(
            prefix,
            PATH11,
            POST,
            option
          )
            .send()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH11}`,
      },
    },
    reservation: {
      info: {
        _reservation_id: (val2: string) => {
          const prefix2 = `${PATH12}/${val2}`;

          return {
            /**
             * @returns 正常レスポンス
             */
            get: (
              option?:
                | {
                    headers?: Methods14["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods14["get"]["resBody"],
                BasicHeaders,
                Methods14["get"]["status"]
              >(prefix, prefix2, GET, option).json(),
            /**
             * @returns 正常レスポンス
             */
            $get: (
              option?:
                | {
                    headers?: Methods14["get"]["reqHeaders"] | undefined;
                    config?: T | undefined;
                  }
                | undefined
            ) =>
              fetch<
                Methods14["get"]["resBody"],
                BasicHeaders,
                Methods14["get"]["status"]
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
