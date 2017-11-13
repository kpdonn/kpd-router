import {newRouter, routerPath} from "../src/typed-mobx-router"
const numConverter = {toString: (id: number) => id.toString(), fromString: (arg: string) => Number.parseInt(arg) }
const boolConverter = { toString: (nid: boolean) => nid.toString(), fromString: (arg: string) => arg === "true"  }
const nr = newRouter({} as any)
  .addRoute({
    name: "p1",
    path: routerPath`/p1/${"r1"}/${"r2"}`,
    queryParams: ["q1"],
    defaults: { q1: "" }
  })
  .addRoute({
    name: "p2",
    path: routerPath`/p2/${"r1"}/${"r2"}`,
    defaults: { r1: "" }
  })
  .addRoute({
    name: "p3",
    path: routerPath`/p3/${"r1"}/${"r2"}`,
    defaults: { r1: 4 },
    converters: [
      { names: ["r1"], ...numConverter },
      { names: ["r2"], ...boolConverter }
    ]
  })
  .start()

nr.goTo.p1({ r1: "hello" })
nr.goTo.p1({ r2: "hello" })
nr.goTo.p1({ q1: "hello" })
nr.goTo.p1({ r1: "hello", q1: "hello" })

nr.goTo.p2({ r1: "hello" })

nr.goTo.p3({ r1: 2 })
nr.goTo.p3({})
nr.goTo.p3()
