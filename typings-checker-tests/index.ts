import { path } from "router-impl"
import { TestComp } from "TestComp"
import { newRouter } from "typed-mobx-router"

const nr = newRouter({} as any)
  .addRoute({
    name: "test",
    path: path`/test/${"id"} ${"other"}`,
    queryParams: ["hello"],
    onLoad: args => args,
    defaults: { other: true },
    converters: [
      { names: ["id"], from: (nid: number) => nid.toString() },
      { names: ["hello", "other"], from: (nid: boolean) => nid.toString() }
    ],
    component: TestComp
  })
  .start()
