import * as UrlPattern from "url-pattern"
import * as qs from "qs"

export class RouteManager {
  private routes = new Map<string, [UrlPattern, string[]]>()
  private defaultsMap = new Map<string, object>()

  addRoute(name: string, path: string, queryParams?: string[], defaults?: any): void {
    if (defaults) {
      this.defaultsMap.set(name, defaults)
    }

    const urlPattern = new UrlPattern(path)
    this.routes.set(name, [urlPattern, queryParams || []])
  }

  matchRoute(path: string, search?: string): { name: string; params: any } {
    const match = Array.from(this.routes.entries()).find(entry => entry[1][0].match(path))
    if (!match) {
      throw new Error(`No route found for path ${path}`)
    }

    const name = match[0]
    const urlPattern = match[1][0]

    const urlParams = urlPattern.match(path)

    const queryParams = search ? qs.parse(search) : {}

    const defaults = this.defaultsMap.get(name) || {}

    const params = { ...defaults, ...queryParams, ...urlParams }

    return { name, params }
  }

  buildRoute(name: string, params: any = {}): string {
    const routeInfo = this.routes.get(name)
    if (!routeInfo) {
      throw new Error(`No route found for name: ${name}`)
    }

    const path = routeInfo[0].stringify(params)

    const queryParams = Object.keys(params)
      .filter(key => routeInfo[1].includes(key))
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
