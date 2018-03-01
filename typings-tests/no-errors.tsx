import {newRouter, routerPath} from "../src/kpd-router"
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

const numConverter = {toString: (id: number) => id.toString(), fromString: (arg: string) => Number.parseInt(arg) }
const boolConverter = { toString: (nid: boolean) => nid.toString(), fromString: (arg: string) => arg === "true"  }


const nr = newRouter({} as any)
  .addRoute({
    name: "p1",
    path: routerPath`/p1/${"r1"}`,
    queryParams: ["q1"],
    onLoad: p1OnLoad,
    defaults: { q1: true },
    converters: {
      r1: numConverter,
      q1: boolConverter,
    },
    component: P1Comp
  })
  .addRoute({
    name: "p2",
    path: routerPath`/p2/${"r1"}/${"r2"}`,
    queryParams: ["q1"],
    onLoad: p2OnLoad,
    component: p2Comp
  })
  .addRoute({
    name: "p3",
    path: routerPath`/p3/${"r1"}/${"r2"}`,
    queryParams: ["q1", "q2"],
    defaults: {
      r1: 1,
      r2: true
    },
    converters: {
      r1: numConverter,
      q1: numConverter,
      r2: boolConverter,
      q2: boolConverter
    },
  })
  .addRoute({
    name: "noQuery",
    path: routerPath`/noQuery/${"r1"}/${"r2"}`,
    onLoad: (args: { r1: number; r2: boolean }) => args,
    defaults: { r1: 0 },
    converters: {
      r1: numConverter,
      r2: boolConverter,
    },
  })
  .addRoute({
    name: "noRequired",
    path: "/noRequired",
    queryParams: ["q1", "q2"],
    onLoad: (args: { q1: number; q2?: string }) => args,
    defaults: { q1: 2 },
    converters: {
      q1: numConverter,
    },  })
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
