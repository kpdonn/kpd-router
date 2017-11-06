import { path } from "router-impl"
import { newRouter } from "typed-mobx-router"

newRouter({} as any).addRoute({
  name: "p1",
  path: path`/p1/${"r1"}`,
  queryParams: ["q1"],
  defaults: { q1: true }
})

newRouter({} as any).addRoute({
  name: "p1",
  path: path`/p1/${"r1"}`,
  queryParams: ["q1"],
  defaults: { r1: "str" },
  converters: [{ names: ["r1"], from: (id: number) => id.toString() }]
})

// Would be nice for the following to fail but it currently won't because of
// https://github.com/Microsoft/TypeScript/issues/13195
//
// newRouter({} as any)
//   .addRoute({
//     name: "p1",
//     path: path`/p1/${"r1"}`,
//     queryParams: ["q1"],
//     defaults: { r1: undefined },
//   })
