import * as React from "react"
import { Diff } from "type-utils"

export interface RouterStore<GoToFuns, LinkProps, States> {
  readonly currentPath: string
  goTo: GoToFuns
  Link: React.ComponentClass<LinkProps>
  currentRoute: States
}

export type RouteState<
  N extends string,
  R extends string,
  Q extends string,
  D,
  CN0 extends string,
  CT0,
  CN1 extends string,
  CT1
> = {
  name: N
  params: Readonly<OnLoadParams<R, Q, D, CN0, CT0, CN1, CT1>>
}
export interface RouterBuilder<T = {}, L = never, S = never> {
  start(): RouterStore<T, L, S>

  addRoute<
    N extends string,
    R extends string,
    Q extends string,
    CN0 extends string,
    CT0,
    CN1 extends string,
    CT1,
    D extends DefaultsAllReq<R, Q, CN0, CT0, CN1, CT1>
  >(route: {
    name: N
    path: [string, R[]]
    queryParams?: Q[]
    onLoad?: (params: OnLoadParams<R, Q, D, CN0, CT0, CN1, CT1>) => void
    defaults: D
    converters?: Converters<CN0, CT0, CN1, CT1>
    component?: ReactComponentCreator<OnLoadParams<R, Q, D, CN0, CT0, CN1, CT1>>
  }): RouterBuilder<
    T & Record<N, (args?: GoToRouteParams<R, Q, D, CN0, CT0, CN1, CT1>) => void>,
    L | ({ route: N } & GoToRouteParams<R, Q, D, CN0, CT0, CN1, CT1>),
    S | RouteState<N, R, Q, D, CN0, CT0, CN1, CT1>
  >
  addRoute<
    N extends string,
    R extends string,
    Q extends string,
    CN0 extends string,
    CT0,
    CN1 extends string,
    CT1,
    D extends Defaults<R, Q, CN0, CT0, CN1, CT1>
  >(route: {
    name: N
    path: string
    queryParams?: Q[]
    onLoad?: (params: OnLoadParams<R, Q, D, CN0, CT0, CN1, CT1>) => void
    defaults?: D
    converters?: Converters<CN0, CT0, CN1, CT1>
    component?: ReactComponentCreator<OnLoadParams<R, Q, D, CN0, CT0, CN1, CT1>>
  }): RouterBuilder<
    T & Record<N, (args?: GoToRouteParams<R, Q, D, CN0, CT0, CN1, CT1>) => void>,
    L | ({ route: N } & GoToRouteParams<R, Q, D, CN0, CT0, CN1, CT1>),
    S | RouteState<N, R, Q, D, CN0, CT0, CN1, CT1>
  >
  addRoute<
    N extends string,
    R extends string,
    Q extends string,
    CN0 extends string,
    CT0,
    CN1 extends string,
    CT1,
    D extends Defaults<R, Q, CN0, CT0, CN1, CT1>
  >(route: {
    name: N
    path: [string, R[]] | string
    queryParams?: Q[]
    onLoad?: (params: OnLoadParams<R, Q, D, CN0, CT0, CN1, CT1>) => void
    defaults?: D
    converters?: Converters<CN0, CT0, CN1, CT1>
    component?: ReactComponentCreator<OnLoadParams<R, Q, D, CN0, CT0, CN1, CT1>>
  }): RouterBuilder<
    T & Record<N, (args: GoToRouteParams<R, Q, D, CN0, CT0, CN1, CT1>) => void>,
    L | ({ route: N } & GoToRouteParams<R, Q, D, CN0, CT0, CN1, CT1>),
    S | RouteState<N, R, Q, D, CN0, CT0, CN1, CT1>
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
  CT1
> = ReqParams<MultiDiff<R, CN0, CN1, keyof D>> &
  OptParams<MultiDiff<Q | keyof D, CN0, CN1>> &
  GoToRouteConvertedParams<R, Q, D, CN0, CT0> &
  GoToRouteConvertedParams<R, Q, D, CN1, CT1>

export type GoToRouteConvertedParams<
  R extends string,
  Q extends string,
  D,
  CN extends string,
  CT
> = ReqParams<Diff<CN, Q> & Diff<R, keyof D>, CT> & OptParams<Diff<CN, Diff<R, keyof D>>, CT>

export type MultiDiff<
  A extends string,
  M1 extends string,
  M2 extends string = string,
  M3 extends string = string
> = Diff<Diff<Diff<A, M1>, M2>, M3>

export type DefaultsAllReq<
  R extends string,
  Q extends string,
  CN0 extends string,
  CT0,
  CN1 extends string,
  CT1
> = ReqParams<MultiDiff<R, CN0, CN1>> &
  ReqParams<Diff<CN0, Q>, CT0> &
  ReqParams<Diff<CN1, Q>, CT1> &
  OptParams<MultiDiff<Q, CN0, CN1>> &
  OptParams<Diff<CN0, R>, CT0> &
  OptParams<Diff<CN1, R>, CT1>

export type Defaults<
  R extends string,
  Q extends string,
  CN0 extends string,
  CT0,
  CN1 extends string,
  CT1
> = OptParams<MultiDiff<R | Q, CN0, CN1>> & OptParams<CN0, CT0> & OptParams<CN1, CT1>

export type OnLoadParams<
  R extends string,
  Q extends string,
  D,
  CN0 extends string,
  CT0,
  CN1 extends string,
  CT1
> = ReqParams<MultiDiff<R, CN0, CN1>> &
  ReqParams<MultiDiff<keyof D, CN0, CN1>> &
  OptParams<MultiDiff<Q, CN0, CN1, keyof D>> &
  OnLoadConvertedParams<R, Q, D, CN0, CT0> &
  OnLoadConvertedParams<R, Q, D, CN1, CT1>

export type OnLoadConvertedParams<
  R extends string,
  Q extends string,
  D,
  CN extends string,
  CT
> = ReqParams<Diff<R, Diff<R, CN>>, CT> &
  ReqParams<Diff<keyof D, Diff<keyof D, CN>>, CT> &
  OptParams<Diff<Q & CN, keyof D>, CT>

export interface Converters<CN0 extends string, CT0, CN1 extends string, CT1> {
  [0]?: Converter<CN0, CT0>
  [1]?: Converter<CN1, CT1>
  [2]?: never // Error on more than 6 elements since that can't be typed correctly

  [index: number]: Converter<any, any> | undefined
}

export interface Converter<N extends string, T> {
  names: N[]
  toString: (arg: T) => string
  fromString: (arg: string) => T
}

export type ReqParams<K extends string, T = string> = Record<K, T>
export type OptParams<K extends string, T = string> = Partial<Record<K, T>>
