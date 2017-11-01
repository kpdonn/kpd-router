import RouteNode from 'route-node'

import { autorun, computed, observable, runInAction } from 'mobx'
import { History } from 'history'
import {
  PathTemplate,
  Route,
  RouterBuilder,
  RouterStore
} from 'typed-mobx-router'

class RouterBuilderImpl<T = {}> implements RouterBuilder<T> {
  private router: any = { routerStore: new RouterStoreImpl() }

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
    N extends string,
    R extends string,
    L extends (params: Params<R, Q>) => void,
    Q extends string,
    D extends { [name: string]: string }
  >({
    name,
    path,
    queryParams,
    defaults,
    onLoad
  }: Route<N, R, L, Q, D>): RouterBuilder<T & Record<N, L>> {
    const routerStore = this.router.routerStore
    routerStore.rootNode.addNode(name, path[0])
    this.router[name] = function(args: Params<R, Q>) {
      runInAction(() => {
        routerStore.routeName = name
        routerStore.params = args
        if (onLoad) {
          onLoad(args)
        }
      })
    }

    return this as any
  }
}

export class RouterStoreImpl implements RouterStore {
  @observable routeName: string

  @observable params: object

  rootNode = new RouteNode()

  @computed
  get currentPath(): string {
    return this.rootNode.buildPath(this.routeName, this.params)
  }
}

export const pb: PathTemplate = <T extends string>(
  literals: TemplateStringsArray,
  ...args: T[]
): [string, T[]] => {
  const builtPath = literals
    .map((litString, i) => (args[i] ? litString + ':' + args[i] : litString))
    .join()

  return [builtPath, args]
}
