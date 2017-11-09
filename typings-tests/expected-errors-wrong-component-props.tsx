import {newRouter, path} from "typed-mobx-router"
import * as React from "react"

class P3Comp extends React.Component<{ q1?: boolean; extra: string }> {
  render() {
    return <div />
  }
}
const numConverter = {from: (id: number) => id.toString(), to: (arg: string) => Number.parseInt(arg) }
const boolConverter = { from: (nid: boolean) => nid.toString(), to: (arg: string) => arg === "true"  }

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
    { names: ["r1"],...numConverter },
    { names: ["q1"], ...boolConverter}
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
    { names: ["r1"], ...numConverter },
    { names: ["r2"], ...boolConverter }
  ]
})
