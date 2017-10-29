import { History } from 'history'
import { ObjectOmit } from 'type-utils'

export interface RouterBuilder<T> {
  start(): T & { routerStore: RouterStore }

  addRoute<
    N extends string,
    R extends string,
    L extends ((params: Params<R, Q>) => void),
    Q extends string,
    D extends { [name: string]: string }
  >(
    route: Route<N, R, L, Q, D>
  ): RouterBuilder<T & Record<N, L>>

  addRoute<
    N extends string,
    R extends string,
    L extends (params: Record<R, string>) => void,
    Q extends string,
    D extends { [name: string]: string }
  >(
    route: ObjectOmit<Route<N, R, L, Q, D>, 'queryParams' | 'onLoad'>
  ): RouterBuilder<T & Record<N, L>>
}

export type Params<R extends string, Q extends string> = { [K in R]: string } &
  { [K in Q]?: string }

export interface RouterStore {
  routeName: string

  params: object

  readonly currentPath: string
}

export interface Route<N, R, L, Q, D> {
  name: N
  path: [string, R[]]
  queryParams: Q[]
  onLoad: L
  defaults?: D
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
