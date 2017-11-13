import {newRouter, routerPath} from  "../src/typed-mobx-router"
import * as React from "react"

class P3Comp extends React.Component<{ q1?: boolean; extra: string }> {
  render() {
    return <div />
  }
}
const numConverter = {toString: (id: number) => id.toString(), fromString: (arg: string) => Number.parseInt(arg) }
const boolConverter = { toString: (nid: boolean) => nid.toString(), fromString: (arg: string) => arg === "true"  }

newRouter({} as any).addRoute({
  name: "p1",
  path: routerPath`/p1/${"r1"}`,
  queryParams: ["q1"],
  defaults: { q1: true },
  component: (arg: { r1: string; q1: boolean }) => (
    <div>
      {" "}
      {arg.r1} {arg.q1}{" "}
    </div>
  ),
  converters: [
    { names: ["r1"],...numConverter },
    { names: ["q1"], ...boolConverter}
  ]
})

newRouter({} as any).addRoute({
  name: "p2",
  path: routerPath`/p2/${"r1"}`,
  queryParams: ["q1"],
  defaults: { r1: "" },
  component: (arg: { r1: string; q1: string }) => <div />
})

newRouter({} as any).addRoute({
  name: "noQuery",
  path: routerPath`/noQuery/${"r1"}/${"r2"}`,
  component: P3Comp,
  defaults: { r1: 0, r2: false },
  converters: [
    { names: ["r1"], ...numConverter },
    { names: ["r2"], ...boolConverter }
  ]
})
