import { History } from 'history'
import { ObjectOmit, StringDiff } from 'type-utils'
import { pb } from 'router-impl'

export interface RouterBuilder<T> {
  start(): T & { routerStore: RouterStore }

  addRoute<
    N extends string,
    R extends string,
    L extends ((
      params: Params<
        StringDiff<R | keyof D, CN>,
        StringDiff<StringDiff<Q, keyof D>, CN>
      > &
        Record<StringDiff<CN, StringDiff<Q, keyof D>> & R | keyof D, CT> &
        Partial<
          Record<StringDiff<CN, R | keyof D> & StringDiff<Q, keyof D>, CT>
        >
    ) => void),
    Q extends string,
    D extends Partial<
      Params<StringDiff<R, CN>, StringDiff<Q, CN>> &
        Record<StringDiff<CN, Q> & R, CT> &
        Partial<Record<StringDiff<CN, R> & Q, CT>>
    >,
    CN extends string,
    CT,
    Extra,
    Extra2
  >(route: {
    name: N
    path: [string, R[]]
    queryParams?: Q[]
    onLoad?: L & Extra
    defaults?: D
    converter?: [CN[], (arg: CT) => string]
  }): RouterBuilder<
    T &
      Record<
        N,
        (
          args: Params<
            StringDiff<StringDiff<R, keyof D>, CN>,
            StringDiff<Q | keyof D, CN>
          > &
            Record<StringDiff<CN, Q> & StringDiff<R, keyof D>, CT> &
            Partial<
              Record<StringDiff<CN, StringDiff<R, keyof D>> & (Q | keyof D), CT>
            >
        ) => void
      >
  >
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
    onLoad: args => 'hello',
    defaults: { other: 2 },
    converter: [['id', 'other'], (nid: number) => nid.toString()]
  })
  .start()

nr.test({ id: 3, other: 2 })

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
