import { History } from 'history'
import { pb } from 'router-impl'
import { ObjectDiff, ObjectOmit, Overwrite, StringDiff } from 'type-utils'

export interface RouterBuilder<T> {
  start(): T

  route<
    N extends string,
    P extends object,
    R extends string,
    Q extends string,
    DK extends string
  >(
    route: FinishedRoute<N, P, R, Q, DK>
  ): RouterBuilder<T & Record<N, (args: P) => void>>
}

function route<N extends string, R extends string>(
  name: N,
  pathArgs: PathOutput<R>
): RouteBuilder<
  N,
  Record<R, string>,
  Record<R, string>,
  R,
  never,
  never,
  never
> {
  return {} as any
}

export interface RouteBuilder<
  N extends string,
  P extends object,
  AT extends object,
  R extends string,
  Q extends string,
  DK extends string,
  E extends RouteBuilderKeys
> {
  __ignore: {
    __excluded: E
    __name: N
    __params: P
    __allthere: AT
    __required: R
    __query: Q
    __defaulted: DK
  }

  queryParams<Q extends string>(
    ...queryParams: Q[]
  ): RBReturn<
    N,
    P & Partial<Record<Q, string>>,
    AT & Record<Q, string>,
    R,
    Q,
    DK,
    E,
    'queryParams'
  >

  converter<CN extends keyof P & keyof AT, C>(
    name: CN | CN[],
    fun: (arg: string) => C,
    otherway: (arg: C) => string
  ): RBReturn<
    N,
    ObjectOmit<P, CN> & Record<CN & R, C> & Partial<Record<CN & Q, C>>,
    Overwrite<AT, CN, C>,
    R,
    Q,
    DK,
    E
  >

  defaults<D extends Partial<P>>(
    obj: D
  ): RBReturn<N, ObjectDiff<P, D>, AT, R, Q, keyof D, E, 'converter'>

  onLoad(
    cb: (args: Optionalize<AT, Q, DK>) => void
  ): RBReturn<N, P, AT, R, Q, DK, E, 'converter' | 'queryParams' | 'defaults'>
}

export type Optionalize<
  AT extends object,
  Q extends string,
  DK extends string
> = Pick<AT, StringDiff<keyof AT, StringDiff<Q, DK>>> &
  Partial<
    Pick<AT, StringDiff<keyof AT, StringDiff<keyof AT, StringDiff<Q, DK>>>>
  >

//   DK extends string> = Pick<AT,StringDiff<keyof AT, StringDiff<Q, DK>>> & {[K in (keyof AT & Q)]?: AT[K]}

// ObjectOmit<AT, StringDiff<Q, DK>> & Pick<AT, StringDiff<Q, DK>>
export type RouteBuilderKeys = keyof RouteBuilder<
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

export type RBReturn<
  N extends string,
  P extends object,
  AT extends object,
  R extends string,
  Q extends string,
  DK extends string,
  E extends RouteBuilderKeys,
  NE extends RouteBuilderKeys = never
> = ObjectOmit<RouteBuilder<N, P, AT, R, Q, DK, E | NE>, E | NE>

export interface FinishedRoute<
  N extends string,
  P extends object,
  R extends string,
  Q extends string,
  DK extends string
> {
  __ignore: {
    __name: N
    __params: P
  }
}

const r = newRouter({} as any)
  .route(
    route('test', pb`/test/${'id'}/${'page'}`)
      .queryParams('query', 'q2', 'q3')
      .converter(['page', 'id'], id => Number(id), id => id.toString())
      .defaults({ page: 1, query: '' })
      .onLoad(args => ttt(args.query))
  )
  .start()

r.test({ id: 1, query: '%' })

function ttt(arg: string): void {
  console.log(arg)
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

export type PathOutput<T extends string> = [string, T[]]

export interface PathTemplate {
  <T extends string>(literals: TemplateStringsArray, ...args: T[]): PathOutput<
    T
  >
}
