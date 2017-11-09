import {newRouter, path} from "typed-mobx-router"
import * as React from "react"

class P1Comp extends React.Component<{ r1: number; q1?: boolean; extra?: string }> {
  render() {
    return <div />
  }
}

function p2Comp(args: { r1: string; r2: string; q1?: string }) {
  return (
    <div>
      {args.r1} {args.r2} {args.q1 && args.q1}
    </div>
  )
}

declare function p1OnLoad(args: { r1: number; q1: boolean }): void
declare function p2OnLoad(args: { r1: string; r2: string; q1?: string }): void

const nr = newRouter({} as any)
  .addRoute({
    name: "p1",
    path: path`/p1/${"r1"}`,
    queryParams: ["q1"],
    onLoad: p1OnLoad,
    defaults: { q1: true },
    converters: [
      { names: ["r1"], from: (id: number) => id.toString() },
      { names: ["q1"], from: (nid: boolean) => nid.toString() }
    ],
    component: P1Comp
  })
  .addRoute({
    name: "p2",
    path: path`/p2/${"r1"}/${"r2"}`,
    queryParams: ["q1"],
    onLoad: p2OnLoad,
    component: p2Comp
  })
  .addRoute({
    name: "p3",
    path: path`/p3/${"r1"}/${"r2"}`,
    queryParams: ["q1", "q2"],
    defaults: {
      r1: 1,
      r2: true
    },
    converters: [
      { names: ["r1", "q1"], from: (a: number) => a.toString() },
      { names: ["r2", "q2"], from: (a: boolean) => a.toString() }
    ]
  })
  .addRoute({
    name: "noQuery",
    path: path`/noQuery/${"r1"}/${"r2"}`,
    onLoad: (args: { r1: number; r2: boolean }) => args,
    defaults: { r1: 0 },
    converters: [
      { names: ["r1"], from: (id: number) => id.toString() },
      { names: ["r2"], from: (nid: boolean) => nid.toString() }
    ]
  })
  .addRoute({
    name: "noRequired",
    path: "/noRequired",
    queryParams: ["q1", "q2"],
    onLoad: (args: { q1: number; q2?: string }) => args,
    defaults: { q1: 2 },
    converters: [{ names: ["q1"], from: (id: number) => id.toString() }]
  })
  .addRoute({
    name: "noArgs",
    path: "/noArgs",
    onLoad: () => console.log("nothing")
  })
  .start()

nr.goTo.p1({ r1: 2 })
nr.goTo.p1({ r1: 2, q1: false })
nr.goTo.p2({ r1: "", r2: "e" })
nr.goTo.p2({ r1: "", r2: "e", q1: "" })
nr.goTo.p3({
  r1: 1,
  r2: false
})
nr.goTo.p3({q1: 4 })
nr.goTo.p3()
nr.goTo.noQuery({ r2: true })
nr.goTo.noQuery({ r1: 1, r2: false })

nr.goTo.noRequired()
nr.goTo.noRequired({ q2: "str" })
nr.goTo.noRequired({ q1: 1 })

nr.goTo.noArgs()
