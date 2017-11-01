import { History } from 'history'
import { Diff } from 'type-utils'
import { pb } from 'router-impl'
import * as React from 'react'
import { TestComp } from 'TestComp'

export interface RouterBuilder<T> {
  start(): T & { routerStore: RouterStore }

  addRoute<
    N extends string,
    R extends string,
    L extends ((
      params: OnLoadParams<
        R,
        Q,
        D,
        CN0,
        CT0,
        CN1,
        CT1,
        CN2,
        CT2,
        CN3,
        CT3,
        CN4,
        CT4,
        CN5,
        CT5
      >
    ) => void),
    Q extends string,
    CN0 extends string,
    CT0,
    CN1 extends string,
    CT1,
    CN2 extends string,
    CT2,
    CN3 extends string,
    CT3,
    CN4 extends string,
    CT4,
    CN5 extends string,
    CT5,
    D extends Defaults<
      R,
      Q,
      CN0,
      CT0,
      CN1,
      CT1,
      CN2,
      CT2,
      CN3,
      CT3,
      CN4,
      CT4,
      CN5,
      CT5
    >,
    ReactCompProps extends OnLoadParams<
      R,
      Q,
      D,
      CN0,
      CT0,
      CN1,
      CT1,
      CN2,
      CT2,
      CN3,
      CT3,
      CN4,
      CT4,
      CN5,
      CT5
    >,
    Extra
  >(route: {
    name: N
    path: [string, R[]]
    queryParams?: Q[]
    onLoad?: L & Extra
    defaults?: D
    converters?: Converters<
      CN0,
      CT0,
      CN1,
      CT1,
      CN2,
      CT2,
      CN3,
      CT3,
      CN4,
      CT4,
      CN5,
      CT5
    >
    component?: ReactComponentCreator<ReactCompProps>
  }): RouterBuilder<
    T &
      Record<
        N,
        (
          args: GoToRouteParams<
            R,
            Q,
            D,
            CN0,
            CT0,
            CN1,
            CT1,
            CN2,
            CT2,
            CN3,
            CT3,
            CN4,
            CT4,
            CN5,
            CT5
          >
        ) => void
      >
  >
}

export type ReactComponentCreator<P> =
  | (new (props: P) => React.Component<any>)
  | React.StatelessComponent<P>

export type GoToRouteParams<
  R extends string,
  Q extends string,
  D,
  CN0 extends string,
  CT0,
  CN1 extends string,
  CT1,
  CN2 extends string,
  CT2,
  CN3 extends string,
  CT3,
  CN4 extends string,
  CT4,
  CN5 extends string,
  CT5
> = ReqParams<MultiDiff<R, CN0, CN1, CN2, CN3, CN4, CN5, keyof D>> &
  OptParams<MultiDiff<Q | keyof D, CN0, CN1, CN2, CN3, CN4, CN5>> &
  GoToRouteConvertedParams<R, Q, D, CN0, CT0> &
  GoToRouteConvertedParams<R, Q, D, CN1, CT1> &
  GoToRouteConvertedParams<R, Q, D, CN2, CT2> &
  GoToRouteConvertedParams<R, Q, D, CN3, CT3> &
  GoToRouteConvertedParams<R, Q, D, CN4, CT4> &
  GoToRouteConvertedParams<R, Q, D, CN5, CT5>

export type GoToRouteConvertedParams<
  R extends string,
  Q extends string,
  D,
  CN extends string,
  CT
> = ReqParams<Diff<CN, Q> & Diff<R, keyof D>, CT> &
  OptParams<Diff<CN, Diff<R, keyof D>>, CT>

export type MultiDiff<
  A extends string,
  M1 extends string,
  M2 extends string = string,
  M3 extends string = string,
  M4 extends string = string,
  M5 extends string = string,
  M6 extends string = string,
  M7 extends string = string
> = Diff<Diff<Diff<Diff<Diff<Diff<Diff<A, M1>, M2>, M3>, M4>, M5>, M6>, M7>

export type Defaults<
  R extends string,
  Q extends string,
  CN0 extends string,
  CT0,
  CN1 extends string,
  CT1,
  CN2 extends string,
  CT2,
  CN3 extends string,
  CT3,
  CN4 extends string,
  CT4,
  CN5 extends string,
  CT5
> = OptParams<MultiDiff<R | Q, CN0, CN1, CN2, CN3, CN4, CN5>> &
  OptParams<CN0, CT0> &
  OptParams<CN1, CT1> &
  OptParams<CN2, CT2> &
  OptParams<CN3, CT3> &
  OptParams<CN4, CT4> &
  OptParams<CN5, CT5>

export type OnLoadParams<
  R extends string,
  Q extends string,
  D,
  CN0 extends string,
  CT0,
  CN1 extends string,
  CT1,
  CN2 extends string,
  CT2,
  CN3 extends string,
  CT3,
  CN4 extends string,
  CT4,
  CN5 extends string,
  CT5
> = ReqParams<MultiDiff<R | keyof D, CN0, CN1, CN2, CN3, CN4, CN5>> &
  OptParams<MultiDiff<Q, CN0, CN1, CN2, CN3, CN4, CN5, keyof D>> &
  OnLoadConvertedParams<R, Q, D, CN0, CT0> &
  OnLoadConvertedParams<R, Q, D, CN1, CT1> &
  OnLoadConvertedParams<R, Q, D, CN2, CT2> &
  OnLoadConvertedParams<R, Q, D, CN3, CT3> &
  OnLoadConvertedParams<R, Q, D, CN4, CT4> &
  OnLoadConvertedParams<R, Q, D, CN5, CT5>

export type OnLoadConvertedParams<
  R extends string,
  Q extends string,
  D,
  CN extends string,
  CT
> = ReqParams<(R | keyof D) & CN, CT> & OptParams<Diff<Q & CN, keyof D>, CT>

export interface Converters<
  CN0 extends string,
  CT0,
  CN1 extends string,
  CT1,
  CN2 extends string,
  CT2,
  CN3 extends string,
  CT3,
  CN4 extends string,
  CT4,
  CN5 extends string,
  CT5
> {
  [0]?: Converter<CN0, CT0>
  [1]?: Converter<CN1, CT1>
  [2]?: Converter<CN2, CT2>
  [3]?: Converter<CN3, CT3>
  [4]?: Converter<CN4, CT4>
  [5]?: Converter<CN5, CT5>
  [6]?: never // Error on more than 6 elements since that can't be typed correctly

  [index: number]: Converter<any, any> | undefined
}

export interface Converter<N extends string, T> {
  names: N[]
  from: (arg: T) => string
}

export type ReqParams<K extends string, T = string> = Record<K, T>
export type OptParams<K extends string, T = string> = Partial<Record<K, T>>

export interface RouterStore {
  routeName: string

  params: object

  readonly currentPath: string
}

const nr = newRouter({} as any)
  .addRoute({
    name: 'test',
    path: pb`/test/${'id'} ${'other'}`,
    queryParams: ['hello'],
    onLoad: args => args,
    defaults: { other: true },
    converters: [
      { names: ['id'], from: (nid: number) => nid.toString() },
      { names: ['hello', 'other'], from: (nid: boolean) => nid.toString() }
    ],
    component: TestComp
  })
  .start()

nr.test({ id: 3, hello: false })

declare function reqstring(arg: string): void

export interface Route<N, R, L, Q, D, CN, CT> {
  name: N
  path: [string, R[]]
  queryParams?: Q[]
  onLoad?: L
  defaults?: D
  converter?: [CN[], (arg: CT) => string]
}

export function newRouter(history: History): RouterBuilder<{}> {
  // return new RouterBuilderImpl(history)
  return {} as any
}

export interface PathTemplate {
  <T extends string>(literals: TemplateStringsArray, ...args: T[]): [
    string,
    T[]
  ]
}
