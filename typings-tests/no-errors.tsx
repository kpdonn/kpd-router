import { path } from "router-impl"
import { newRouter } from "typed-mobx-router"
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
    path: path`/p3/${"r1"}/${"r2"}/${"r3"}/${"r4"}/${"r5"}/${"r6"}`,
    queryParams: ["q1", "q2", "q3", "q4", "q5", "q6"],
    defaults: {
      r1: 1,
      r2: true,
      r3: { nested1: "" },
      r4: { nested2: "" },
      q5: { nested3: "" },
      q6: { nested4: "" }
    },
    converters: [
      { names: ["r1", "q1"], from: (a: number) => a.toString() },
      { names: ["r2", "q2"], from: (a: boolean) => a.toString() },
      { names: ["r3", "q3"], from: (a: { nested1: string }) => a.nested1 },
      { names: ["r4", "q4"], from: (a: { nested2: string }) => a.nested2 },
      { names: ["r5", "q5"], from: (a: { nested3: string }) => a.nested3 },
      { names: ["r6", "q6"], from: (a: { nested4: string }) => a.nested4 }
    ]
  })
  .start()

nr.p1({ r1: 2 })
nr.p1({ r1: 2, q1: false })
nr.p2({ r1: "", r2: "e" })
nr.p2({ r1: "", r2: "e", q1: "" })
nr.p3({
  r1: 1,
  r2: false,
  r3: { nested1: "" },
  r4: { nested2: "" },
  r5: { nested3: "" },
  r6: { nested4: "" },
  q1: 4,
  q3: { nested1: "" }
})
nr.p3({ r5: { nested3: "" }, r6: { nested4: "" }, q1: 4, q3: { nested1: "" } })
