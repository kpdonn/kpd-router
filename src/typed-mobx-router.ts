import { History } from "history"
import { RouterBuilder, RouterStore } from "interfaces"
import * as React from "react"
import { autorun, computed, observable, runInAction } from "mobx"
import { RouteManager } from "route-manager"

export const path = <T extends string>(
  literals: TemplateStringsArray,
  ...args: T[]
): [string, T[]] => {
  const builtPath = literals
    .map((litString, i) => (args[i] ? litString + ":" + args[i] : litString))
    .join("")

  return [builtPath, args]
}

export function newRouter(history: History): RouterBuilder {
  return new RouterBuilderImpl(history) as any
}

class RouterStoreImpl
  implements RouterStore<{ [index: string]: Function }, any, { route: string; params: any }> {
  goTo: { [index: string]: Function } = {}
  Link: React.ComponentClass<any>

  @observable currentRoute: { route: string; params: any }

  constructor(private routeManager: RouteManager, readonly history: History) {}

  @computed
  get currentPath(): string {
    return this.routeManager.buildRoute(this.currentRoute.route, this.currentRoute.params)
  }
}

class RouterBuilderImpl {
  private routerStore: RouterStoreImpl

  private onLoadMap = new Map<string, (params: any) => void>()

  private routeManager = new RouteManager()

  constructor(readonly history: History) {
    this.routerStore = new RouterStoreImpl(this.routeManager, this.history)
  }

  setRouteInfoFromLocation() {
    const match = this.routeManager.matchRoute(
      this.history.location.pathname,
      this.history.location.search
    )

    this.routerStore.currentRoute = { route: match.name, params: match.params }
  }

  start(): RouterStoreImpl {
    this.setRouteInfoFromLocation()

    autorun(() => {
      const { route } = this.routerStore.currentRoute
      const onLoadFun = this.onLoadMap.get(route)
      if (onLoadFun) {
        const params = this.routerStore.currentRoute.params
        onLoadFun(params)
      }
    })

    autorun(() => {
      const path = this.routerStore.currentPath
      if (path !== this.history.location.pathname + this.history.location.search) {
        this.history.push(path)
      }
    })

    return this.routerStore
  }

  addRoute(route: Route): this {
    this.routeManager.addRoute(route)

    const defaults = route.defaults || {}

    this.routerStore.goTo[route.name] = (args: any) => {
      runInAction(() => {
        this.routerStore.currentRoute = { route: route.name, params: { ...defaults, ...args } }
      })
    }

    if (route.onLoad) {
      this.onLoadMap.set(route.name, route.onLoad)
    }
    return this
  }
}

export interface Route {
  name: string
  path: [string, string[]] | string
  queryParams?: string[]
  onLoad?: (params: any) => void
  defaults?: { [index: string]: any }
  converters?: {
    names: string[]
    toString: (arg: any) => string
    fromString: (arg: string) => any
  }[]
  component?: React.ComponentType
}
