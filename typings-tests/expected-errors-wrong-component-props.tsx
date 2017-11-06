import { path } from "router-impl"
import { newRouter } from "typed-mobx-router"
import * as React from "react"

class P3Comp extends React.Component<{ q1?: boolean; extra: string }> {
  render() {
    return <div />
  }
}

newRouter({} as any).addRoute({
  name: "p1",
  path: path`/p1/${"r1"}`,
  queryParams: ["q1"],
  defaults: { q1: true },
  component: (arg: { r1: string; q1: boolean }) => (
    <div>
      {" "}
      {arg.r1} {arg.q1}{" "}
    </div>
  ),
  converters: [
    { names: ["r1"], from: (id: number) => id.toString() },
    { names: ["q1"], from: (nid: boolean) => nid.toString() }
  ]
})

newRouter({} as any).addRoute({
  name: "p2",
  path: path`/p2/${"r1"}`,
  queryParams: ["q1"],
  defaults: { r1: "" },
  component: (arg: { r1: string; q1: string }) => <div />
})

newRouter({} as any).addRoute({
  name: "noQuery",
  path: path`/noQuery/${"r1"}/${"r2"}`,
  component: P3Comp,
  defaults: { r1: 0, r2: false },
  converters: [
    { names: ["r1"], from: (id: number) => id.toString() },
    { names: ["r2"], from: (nid: boolean) => nid.toString() }
  ]
})
