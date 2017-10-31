import { History } from 'history'
import { Diff } from 'type-utils'
import { pb } from 'router-impl'

export interface RouterBuilder<T> {
  start(): T & { routerStore: RouterStore }

  addRoute<
    N extends string,
    R extends string,
    L extends ((params: OnLoadParams<R, Q, CN, CT, D>) => void),
    Q extends string,
    CN extends string,
    CT,
    D extends Defaults<R, Q, CN, CT>,
    Extra
  >(route: {
    name: N
    path: [string, R[]]
    queryParams?: Q[]
    onLoad?: L & Extra
    defaults?: D
    converters?: Converters<CN, CT>
  }): RouterBuilder<
    T & Record<N, (args: GoToRouteParams<R, Q, CN, CT, D>) => void>
  >
}

export type GoToRouteParams<
  R extends string,
  Q extends string,
  CN extends string,
  CT,
  D extends Defaults<R, Q, CN, CT>
> = Params<Diff<Diff<R, keyof D>, CN>, Diff<Q | keyof D, CN>> &
  Record<Diff<CN, Q> & Diff<R, keyof D>, CT> &
  Partial<Record<Diff<CN, Diff<R, keyof D>>, CT>>

export type Defaults<
  R extends string,
  Q extends string,
  CN extends string,
  CT
> = Partial<
  Record<Diff<R, CN>, string> & Record<Diff<Q, CN>, string> & Record<CN, CT>
>

export type OnLoadParams<
  R extends string,
  Q extends string,
  CN extends string,
  CT,
  D extends Defaults<R, Q, CN, CT>
> = Params<Diff<R | keyof D, CN>, Diff<Diff<Q, keyof D>, CN>> &
  Record<Diff<CN, Diff<Q, keyof D>> & R | keyof D, CT> &
  Partial<Record<Diff<CN, R | keyof D> & Diff<Q, keyof D>, CT>>

export interface Converters<CNA extends string, CTA> {
  [0]?: Converter<CNA, CTA>

  [index: number]: Converter<any, any> | undefined
}

export interface Converter<N extends string, T> {
  names: N
  from: (arg: T) => string
}

export type Params<R extends string, Q extends string> = { [K in R]: string } &
  { [K in Q]?: string }

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
    defaults: { other: '' },
    converters: [{ names: 'id', from: (nid: number) => nid.toString() }]
  })
  .start()

nr.test({ id: 3 })

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
