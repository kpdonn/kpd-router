import RouteNode from 'route-node'

import { autorun, computed, observable, runInAction } from 'mobx'
import { History } from 'history'

export interface RouterBuilder<T> {
  start(): T & { routerStore: RouterStore }

  addRoute<
    L extends (params: P) => void,
    P extends { [name: string]: string },
    N extends string
  >(
    route: Route<L, P, N>
  ): RouterBuilder<T & Record<N, L>>
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
