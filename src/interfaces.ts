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

export interface RouterBuilder<T = {}, L = never, S = never> {
  start(): RouterStore<T, L, S>

  addRoute<
    Name extends string,
    RawReq extends string,
    RawOpt extends string,
    Req extends Literal<RawReq>,
    Opt extends Literal<RawOpt>,
    Params extends Req | Opt,
    Conv extends Exactly<Converters<Params>, Conv>,
    Converted extends { [P in Params]: Conv[P] extends Converter<infer T> ? T : string },
    Defaults extends Exactly<Partial<Converted>, Defaults>,
    GoToArgs extends PartPartial<Converted, Opt | Literal<keyof Defaults>>,
    OnLoadArgs extends PartPartial<Converted, Exclude<Opt, Literal<keyof Defaults>>>
  >(route: {
    name: Name
    path: [string, RawReq[]] | string
    queryParams?: RawOpt[]
    onLoad?: (arg: OnLoadArgs) => void
    defaults?: Defaults
    converters?: Conv
    component?: ReactComponentCreator<OnLoadArgs>
  }): RouterBuilder<
    T & GoToFun<Name, GoToArgs>,
    L | ({ route: Name } & GoToArgs),
    S | RouteState<Name, OnLoadArgs>
  >
}

export type GoToFun<Name extends string, Args> = {} extends Args
  ? Record<Name, (arg?: Args) => void>
  : Record<Name, (arg: Args) => void>

export type ReactComponentCreator<P> =
  | (new (props: P) => React.Component<any>)
  | React.StatelessComponent<P>

export type Converters<Params extends string> = Partial<Record<Params, Converter<any>>>

export interface Converter<T> {
  toString: (arg: T) => string
  fromString: (arg: string) => T
}
