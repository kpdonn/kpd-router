import { History } from "history"
import { RouterBuilder, RouterStore } from "interfaces"
import * as React from "react"
import * as RouteNode from "route-node"
import { autorun, computed, observable, runInAction } from "mobx"

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

  constructor(private rootNode: any, readonly history: History) {}

  @computed
  get currentPath(): string {
    return this.rootNode.buildPath(this.currentRoute.route, this.currentRoute.params)
  }
}

class RouterBuilderImpl {
  private rootNode = new RouteNode()

  private routerStore: RouterStoreImpl

  private onLoadMap = new Map<string, (params: any) => void>()

  constructor(readonly history: History) {
    this.routerStore = new RouterStoreImpl(this.rootNode, this.history)
  }

  start(): RouterStoreImpl {
    const initialMatch = this.rootNode.matchPath(
      this.history.location.pathname + this.history.location.search
    )

    this.routerStore.currentRoute = { route: initialMatch.name, params: initialMatch.params }

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
    if (typeof route.path === "string") {
      this.rootNode.addNode(route.name, route.path)
    } else {
      this.rootNode.addNode(route.name, route.path[0])
    }

    this.routerStore.goTo[route.name] = (args: any) => {
      runInAction(() => {
        this.routerStore.currentRoute = { route: route.name, params: args }
      })
    }

    if (route.onLoad) {
      this.onLoadMap.set(route.name, route.onLoad)
    }
    return this
  }
}

interface Route {
  name: string
  path: [string, string[]] | string
  queryParams?: string[]
  onLoad?: (params: any) => void
  defaults?: { [index: string]: any }
  converters?: { names: string[]; from: (arg: any) => string }[]
  component?: React.ComponentType
}
