import { History } from 'history'
import { Diff } from 'type-utils'
import { pb } from 'router-impl'

export interface RouterBuilder<T> {
  start(): T & { routerStore: RouterStore }

  addRoute<
    N extends string,
    R extends string,
    L extends ((params: OnLoadParams<R, Q, CN1, CT1, CN2, CT2, D>) => void),
    Q extends string,
    CN1 extends string,
    CT1,
    CN2 extends string,
    CT2,
    D extends Defaults<R, Q, CN1, CT1, CN2, CT2>,
    Extra
  >(route: {
    name: N
    path: [string, R[]]
    queryParams?: Q[]
    onLoad?: L & Extra
    defaults?: D
    converters?: Converters<CN1, CT1, CN2, CT2>
  }): RouterBuilder<
    T & Record<N, (args: GoToRouteParams<R, Q, CN1, CT1, CN2, CT2, D>) => void>
  >
}

export type GoToRouteParams<
  R extends string,
  Q extends string,
  CN1 extends string,
  CT1,
  CN2 extends string,
  CT2,
  D extends Defaults<R, Q, CN1, CT1, CN2, CT2>
> = ReqParams<MultiDiff<R, CN1, CN2, keyof D>> &
  OptParams<MultiDiff<Q | keyof D, CN1, CN2>> &
  ReqParams<Diff<CN1, Q> & Diff<R, keyof D>, CT1> &
  OptParams<Diff<CN1, Diff<R, keyof D>>, CT1> &
  ReqParams<Diff<CN2, Q> & Diff<R, keyof D>, CT2> &
  OptParams<Diff<CN2, Diff<R, keyof D>>, CT2>

export type MultiDiff<
  A extends string,
  M1 extends string,
  M2 extends string = string,
  M3 extends string = string,
  M4 extends string = string
> = Diff<Diff<Diff<Diff<A, M1>, M2>, M3>, M4>

export type Defaults<
  R extends string,
  Q extends string,
  CN1 extends string,
  CT1,
  CN2 extends string,
  CT2
> = OptParams<MultiDiff<R | Q, CN1, CN2>> &
  OptParams<CN1, CT1> &
  OptParams<CN2, CT2>

export type OnLoadParams<
  R extends string,
  Q extends string,
  CN1 extends string,
  CT1,
  CN2 extends string,
  CT2,
  D extends Defaults<R, Q, CN1, CT1, CN2, CT2>
> = ReqParams<MultiDiff<R | keyof D, CN1, CN2>> &
  OptParams<MultiDiff<Q, CN1, CN2, keyof D>> &
  ReqParams<(R | keyof D) & CN1, CT1> &
  OptParams<Diff<Q & CN1, keyof D>, CT1> &
  ReqParams<(R | keyof D) & CN2, CT2> &
  OptParams<Diff<Q & CN2, keyof D>, CT2>

export interface Converters<CN1 extends string, CT1, CN2 extends string, CT2> {
  [0]?: Converter<CN1, CT1>
  [1]?: Converter<CN2, CT2>

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
    ]
  })
  .start()

nr.test({ id: 3, hello: true })

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
