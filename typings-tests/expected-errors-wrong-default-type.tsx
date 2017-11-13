import {newRouter, routerPath} from  "../src/typed-mobx-router"


const numConverter = {toString: (id: number) => id.toString(), fromString: (arg: string) => Number.parseInt(arg) }

newRouter({} as any).addRoute({
  name: "p1",
  path: routerPath`/p1/${"r1"}`,
  queryParams: ["q1"],
  defaults: { q1: true }
})

newRouter({} as any).addRoute({
  name: "p1",
  path: routerPath`/p1/${"r1"}`,
  queryParams: ["q1"],
  defaults: { r1: "str" },
  converters: [{ names: ["r1"], ...numConverter }]
})

// Would be nice for the following to fail but it currently won't because of
// https://github.com/Microsoft/TypeScript/issues/13195
//
// newRouter({} as any)
//   .addRoute({
//     name: "p1",
//     routerPath: routerPath`/p1/${"r1"}`,
//     queryParams: ["q1"],
//     defaults: { r1: undefined },
//   })
