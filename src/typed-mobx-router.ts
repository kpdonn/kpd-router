import { History } from 'history'
import { ObjectOmit, StringDiff } from 'type-utils'
import { pb } from 'router-impl'

export interface RouterBuilder<T> {
  start(): T & { routerStore: RouterStore }

  addRoute<
    N extends string,
    R extends string,
    L extends ((
      params: Params<StringDiff<R, CN>, StringDiff<Q, CN>> &
        Record<StringDiff<CN, Q>, CT> &
        Partial<Record<StringDiff<CN, R>, CT>>
    ) => void),
    Q extends string,
    D extends { [name: string]: string },
    CN extends R | Q,
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
  }): RouterBuilder<T & Record<N, L>>
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
    converter: [['hello'], (nid: number) => nid.toString()]
  })
  .start()

nr.test({ id: '', other: '' })

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
