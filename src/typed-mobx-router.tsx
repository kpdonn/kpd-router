import { History, createBrowserHistory } from "history"
import { ReactComponentCreator, RouterBuilder, RouterStore } from "./interfaces"
import * as React from "react"
import { autorun, computed, observable, runInAction } from "mobx"
import { RouteManager } from "./route-manager"
import { observer } from "mobx-react"

export const routerPath = <T extends string>(
  literals: TemplateStringsArray,
  ...args: T[]
): [string, T[]] => {
  const builtPath = literals
    .map((litString, i) => (args[i] ? litString + ":" + args[i] : litString))
    .join("")

  return [builtPath, args]
}

export function newRouter(history: History = createBrowserHistory()): RouterBuilder {
  return new RouterBuilderImpl(history) as any
}

class RouterStoreImpl
  implements RouterStore<{ [index: string]: Function }, any, { name: string; params: any }> {
  goTo: { [index: string]: Function } = {}
  Link: React.ComponentClass<any>

  @observable currentRoute: { name: string; params: any }

  constructor(
    public routeManager: RouteManager,
    readonly history: History,
    readonly componentMap: Map<string, ReactComponentCreator<any>>
  ) {}

  @computed
  get currentPath(): string {
    return this.routeManager.buildRoute(this.currentRoute.name, this.currentRoute.params)
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

    this.routerStore.currentRoute = { name: match.name, params: match.params }
  }

  start(): RouterStoreImpl {
    this.setRouteInfoFromLocation()

    autorun(() => {
      const { name } = this.routerStore.currentRoute
      const onLoadFun = this.onLoadMap.get(name)
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

    this.history.listen((newLocation, action) => {
      if (action !== "POP") {
        return
      }
      const match = this.routeManager.matchRoute(
        this.history.location.pathname,
        this.history.location.search
      )

      if (match) {
        runInAction(() => {
          this.routerStore.currentRoute = { name: match.name, params: match.params }
        })
      }
    })

    const link = createLink(this.routerStore)
    this.routerStore.Link = link

    return this.routerStore
  }

  addRoute(route: Route): this {
    this.routeManager.addRoute(route)

    const defaults = route.defaults || {}

    this.routerStore.goTo[route.name] = (args: any) => {
      runInAction(() => {
        this.routerStore.currentRoute = { name: route.name, params: { ...defaults, ...args } }
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

    const { name, params } = this.props.router.currentRoute

    const Component = routerStoreImpl.componentMap.get(name)

    if (Component) {
      return <Component {...params} />
    } else {
      return null
    }
  }
}

function createLink(router: RouterStoreImpl) {
  @observer
  class Link extends React.Component<{ route: string; children: any; [params: string]: any }> {
    render() {
      const El = this.props.as ? this.props.as : "a"

      const { route, children, className, ...params } = this.props

      const href = router.routeManager.buildRoute(route, params)

      return (
        <El href={href} onClick={this.onClick} {...{ className }}>
          {children}
        </El>
      )
    }

    onClick = (e: React.MouseEvent<any>) => {
      if (e.ctrlKey || e.metaKey) {
        return
      }
      e.preventDefault()
      const { route, ...params } = this.props
      router.goTo[route](params)
    }
  }

  return Link
}
