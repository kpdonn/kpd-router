import * as UrlPattern from "url-pattern"
import * as qs from "qs"
import * as React from "react"
import { Route } from "typed-mobx-router"

type RouteInfo = {
  urlPattern: UrlPattern
  queryParams: string[]
  converterMap: Map<string, Converter>
  defaults: any
}

type Converter = { toString: (arg: any) => string; fromString: (arg: string) => any }

export class RouteManager {
  private routes = new Map<string, RouteInfo>()

  addRoute(route: Route): void {
    const defaults = route.defaults || {}

    const queryParams = route.queryParams || []
    let path
    if (typeof route.path === "string") {
      path = route.path
    } else {
      path = route.path[0]
    }

    const urlPattern = new UrlPattern(path)

    const routeConverters = route.converters || []

    const converterMap = new Map<string, Converter>()

    routeConverters.forEach(rc =>
      rc.names.forEach(field =>
        converterMap.set(field, { fromString: rc.fromString, toString: rc.toString })
      )
    )

    this.routes.set(route.name, { urlPattern, queryParams, converterMap, defaults })
  }

  matchRoute(path: string, search?: string): { name: string; params: any } {
    const match = Array.from(this.routes.entries()).find(entry => entry[1].urlPattern.match(path))
    if (!match) {
      throw new Error(`No route found for path ${path}`)
    }

    const name = match[0]
    const routeInfo = match[1]

    const urlParams = routeInfo.urlPattern.match(path)

    const queryParams = search ? qs.parse(search, { ignoreQueryPrefix: true }) : {}

    Object.keys(urlParams)
      .filter(key => routeInfo.converterMap.has(key))
      .forEach(
        key => (urlParams[key] = routeInfo.converterMap.get(key)!.fromString(urlParams[key]))
      )

    Object.keys(queryParams)
      .filter(key => routeInfo.converterMap.has(key))
      .forEach(
        key => (queryParams[key] = routeInfo.converterMap.get(key)!.fromString(queryParams[key]))
      )

    const params = { ...routeInfo.defaults, ...queryParams, ...urlParams }

    return { name, params }
  }

  buildRoute(name: string, params: any = {}): string {
    const routeInfo = this.routes.get(name)
    if (!routeInfo) {
      throw new Error(`No route found for name: ${name}`)
    }

    const defaultedParams = { ...routeInfo.defaults, ...params }

    Object.keys(defaultedParams)
      .filter(key => routeInfo.converterMap.has(key))
      .forEach(
        key =>
          (defaultedParams[key] = routeInfo.converterMap.get(key)!.toString(defaultedParams[key]))
      )

    const path = routeInfo.urlPattern.stringify(params)

    const queryParams = Object.keys(defaultedParams)
      .filter(key => routeInfo.queryParams.includes(key))
      .reduce(
        (obj, key) => {
          obj[key] = params[key]
          return obj
        },
        {} as any
      )

    const queryString = qs.stringify(queryParams)

    return queryString ? `${path}?${queryString}` : path
  }
}
