import * as React from "react"
import { Exactly, Literal, PartPartial } from "./type-utils"

export interface RouterStore<GoToFuns, LinkProps, States> {
  readonly currentPath: string
  goTo: GoToFuns
  Link: React.ComponentClass<LinkProps & { children: any; as?: any; className?: string }>
  currentRoute: States
}

export type RouteState<N extends string, OnLoadArgs> = {
  name: N
  params: Readonly<OnLoadArgs>
}

export type Props<Req extends string, Opt extends string> = Literal<Req> | Literal<Opt>

export type PropTypes<R extends string, Q extends string, PC extends Converters<Props<R, Q>>> = {
  [P in Props<R, Q>]: P extends keyof PC ? (PC[P] extends Converter<infer T> ? T : never) : string
}

export type LoadArgs<
  R extends string,
  Q extends string,
  PC extends Converters<Props<R, Q>>,
  D
> = PartPartial<PropTypes<R, Q, PC>, Exclude<Literal<Q>, Literal<keyof D>>>

export interface RouterBuilder<T = {}, L = never, S = never> {
  start(): RouterStore<T, L, S>

  addRoute<
    N extends string,
    R extends string,
    Q extends string,
    PC extends Exactly<Converters<Props<R, Q>>, PC>,
    D extends Exactly<Partial<PropTypes<R, Q, PC>>, D>
  >(route: {
    name: N
    path: [string, R[]] | string
    queryParams?: Q[]
    onLoad?: (arg: LoadArgs<R, Q, PC, D>) => void
    defaults?: D
    converters?: PC
    component?: ReactComponentCreator<LoadArgs<R, Q, PC, D>>
  }): RouterBuilder<
    T & GoToFun<N, R, Q, PC, D>,
    L | ({ route: N } & GoToFunArgs<R, Q, PC, D>),
    S | RouteState<N, LoadArgs<R, Q, PC, D>>
  >
}
export type GoToFunArgs<
  R extends string,
  Q extends string,
  PC extends Converters<Props<R, Q>>,
  D
> = PartPartial<PropTypes<R, Q, PC>, Literal<Q> | Literal<keyof D>>

export type GoToFun<
  N extends string,
  R extends string,
  Q extends string,
  PC extends Converters<Props<R, Q>>,
  D
> = {} extends GoToFunArgs<R, Q, PC, D>
  ? Record<N, (arg?: GoToFunArgs<R, Q, PC, D>) => void>
  : Record<N, (arg: GoToFunArgs<R, Q, PC, D>) => void>

export type ReactComponentCreator<P> =
  | (new (props: P) => React.Component<any>)
  | React.StatelessComponent<P>

export type Converters<Params extends string> = Partial<Record<Params, Converter<any>>>

export interface Converter<T> {
  toString: (arg: T) => string
  fromString: (arg: string) => T
}
