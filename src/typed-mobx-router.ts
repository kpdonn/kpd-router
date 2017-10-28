import RouteNode from 'route-node'

import { autorun, computed, observable, runInAction } from 'mobx'
import { History } from 'history'

export type StringDiff<T extends string, U extends string> = ({ [K in T]: K } &
  { [K in U]: never } & { [K: string]: never })[T]

export type ObjectOmit<T extends object, K extends keyof T> = Pick<
  T,
  StringDiff<keyof T, K>
>

export type ObjectDiff<T extends object, U extends object> = ObjectOmit<
  T,
  keyof U & keyof T
> &
  { [K in (keyof U & keyof T)]?: T[K] }

export interface RouterBuilder<T> {
  start(): T & { routerStore: RouterStore }

  addRoute<
    L extends (params: P) => void,
    P extends { [name: string]: string },
    N extends string
  >(
    route: Route<L, P, N>
  ): RouterBuilder<T & Record<N, L>>

  newAddRoute<
    N extends string,
    P,
    L extends (params: Params<P, Q, D>) => void,
    Q extends string,
    D extends { [name: string]: string }
  >(
    route: NewRoute<N, P, L, Q, D>
  ): RouterBuilder<T & Record<N, L>>
}

export type Params<R, Q extends string, D extends object> = ObjectDiff<
  R & { [K in Q]?: string },
  D
>

export interface NewRoute<
  N extends string,
  P,
  L extends (params: Params<P, Q, D>) => void,
  Q extends string,
  D extends { [name: string]: string }
> {
  name: N
  path: [string, string[], P]
  queryParams?: Q[]
  onLoad?: L
  defaults?: D
}

export interface Route<
  L extends (params: P) => void,
  P extends { [name: string]: string },
  N extends string
> {
  name: N
  path: string
  onLoad: L
}

export function newRouter(history: History): RouterBuilder<{}> {
  return new RouterBuilderImpl(history)
}

class RouterBuilderImpl<T = {}> implements RouterBuilder<T> {
  private router: any = { routerStore: new RouterStore() }

  constructor(readonly history: History) {}

  start(): T & { routerStore: RouterStore } {
    const routerStore = this.router.routerStore

    const match = routerStore.rootNode.matchPath(
      this.history.location.pathname + this.history.location.search
    )
    if (match) {
      this.router[match.name](match.params)
    }

    this.history.listen((newLocation, action) => {
      if (action !== 'POP') {
        return
      }
      const match = routerStore.rootNode.matchPath(
        newLocation.pathname + newLocation.search
      )
      if (match) {
        this.router[match.name](match.params)
      }
    })

    autorun(() => {
      const path = routerStore.currentPath
      if (
        path !==
        this.history.location.pathname + this.history.location.search
      ) {
        this.history.push(path)
      }
    })

    return this.router as T & { routerStore: RouterStore }
  }

  addRoute<
    L extends (params: P) => void,
    P extends { [name: string]: string },
    N extends string
  >(route: Route<L, P, N>): RouterBuilder<T & Record<N, L>> {
    const routerStore = this.router.routerStore
    routerStore.rootNode.addNode(route.name, route.path)
    this.router[route.name] = function(args: P) {
      runInAction(() => {
        routerStore.routeName = route.name
        routerStore.params = args
        route.onLoad(args)
      })
    }

    return this as any
  }

  newAddRoute(route: any) {
    return this as any
  }
}

export class RouterStore {
  @observable routeName: string

  @observable params: object

  rootNode = new RouteNode()

  @computed
  get currentPath(): string {
    return this.rootNode.buildPath(this.routeName, this.params)
  }
}

export function path<T extends string>(
  literals: TemplateStringsArray,
  ...args: T[]
): [string, string[], Record<T, string>] {
  return {} as any
}
