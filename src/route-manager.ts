import * as UrlPattern from "url-pattern"

export class RouteManager {
  private routes = new Map<string, UrlPattern>()

  addRoute(name: string, path: string, queryParams?: string[]): void {
    const urlPattern = new UrlPattern(path)
    this.routes.set(name, urlPattern)
  }

  matchRoute(path: string, search?: string): { name: string; params: any } {
    const match = Array.from(this.routes.entries()).find(entry => entry[1].match(path))
    if (!match) {
      throw new Error(`No route found for path ${path}`)
    }

    const name = match[0]
    const urlPattern = match[1]

    const params = urlPattern.match(path)

    return { name, params }
  }

  buildRoute(name: string, params?: any): string {
    const urlPattern = this.routes.get(name)
    if (!urlPattern) {
      throw new Error(`No route found for name: ${name}`)
    }

    return urlPattern.stringify(params)
  }
}
