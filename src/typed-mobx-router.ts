import { History } from "history"
import { RouterBuilder, RouterStore } from "interfaces"
import * as React from "react"
import * as RouteNode from "route-node"
import { computed, observable, runInAction } from "mobx"

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
  // return new RouterBuilderImpl(history)
  return new RouterBuilderImpl(history) as any
}

class RouterStoreImpl
  implements RouterStore<{ [index: string]: Function }, any, { route: string; params: any }> {
  goTo: { [index: string]: Function } = {}
  Link: React.ComponentClass<any>

  @observable currentRoute: { route: string; params: any }

  constructor(private rootNode: any) {}

  @computed
  get currentPath(): string {
    return this.rootNode.buildPath(this.currentRoute.route, this.currentRoute.params)
  }
}

class RouterBuilderImpl {
  private rootNode = new RouteNode()
  private goTo: { [index: string]: Function } = {}

  private routerStore = new RouterStoreImpl(this.rootNode)

  constructor(public history: History) {}

  start(): RouterStoreImpl {
    return {} as any
  }

  addRoute(route: Route): this {
    if (typeof route.path === "string") {
      this.rootNode.addNode(route.name, route.path)
    } else {
      this.rootNode.addNode(route.name, route.path[0])
    }

    this.goTo[route.name] = (...args: any[]) => {
      runInAction(() => {
        this.routerStore.currentRoute = { route: route.name, params: args }
      })
    }
    return this
  }
}

interface Route {
  name: string
  path: [string, string[]] | string
  queryParams?: string[]
  onLoad?: (...args: any[]) => void
  defaults?: { [index: string]: any }
  converters?: { names: string[]; from: (arg: any) => string }[]
  component?: React.ComponentType
}
