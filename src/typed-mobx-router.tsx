import { History } from "history"
import { ReactComponentCreator, RouterBuilder, RouterStore } from "interfaces"
import * as React from "react"
import { autorun, computed, observable, runInAction } from "mobx"
import { RouteManager } from "route-manager"
import { observer } from "mobx-react"

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

  constructor(
    private routeManager: RouteManager,
    readonly history: History,
    readonly componentMap: Map<string, ReactComponentCreator<any>>
  ) {}

  @computed
  get currentPath(): string {
    return this.routeManager.buildRoute(this.currentRoute.route, this.currentRoute.params)
  }
}

class RouterBuilderImpl {
  private routerStore: RouterStoreImpl

  private onLoadMap = new Map<string, (params: any) => void>()

  private routeManager = new RouteManager()
  private componentMap = new Map<string, ReactComponentCreator<any>>()

  constructor(readonly history: History) {
    this.routerStore = new RouterStoreImpl(this.routeManager, this.history, this.componentMap)
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

    if (route.component) {
      this.componentMap.set(route.name, route.component)
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

@observer
export class Router extends React.Component<{ router: RouterStore<any, any, any> }> {
  render() {
    const routerStoreImpl = this.props.router as RouterStoreImpl

    const { route, params } = this.props.router.currentRoute

    const Component = routerStoreImpl.componentMap.get(route)
    console.log("render component: ", Component)

    if (Component) {
      return <Component {...params} />
    } else {
      return null
    }
  }
}
