import {newRouter, path} from "typed-mobx-router"
import * as React from "react"


const numConverter = {toString: (id: number) => id.toString(), fromString: (arg: string) => Number.parseInt(arg) }
const boolConverter = { toString: (nid: boolean) => nid.toString(), fromString: (arg: string) => arg === "true"  }


newRouter({} as any).addRoute({
  name: "p1",
  path: path`/p1/${"r1"}`,
  queryParams: ["q1"],
  defaults: { q1: true },
  onLoad: (arg: { r1: string; q1: boolean }) => arg,
  converters: [
    { names: ["r1"], ...numConverter },
    { names: ["q1"], ...boolConverter }
  ]
})

newRouter({} as any).addRoute({
  name: "p2",
  path: path`/p2/${"r1"}`,
  queryParams: ["q1"],
  onLoad: (arg: { r1: string; q1: boolean }) => arg,
  converters: [{ names: ["q1"], ...boolConverter }]
})

newRouter({} as any).addRoute({
  name: "noQuery",
  path: path`/noQuery/${"r1"}/${"r2"}`,
  onLoad: (args: { missingArg: string }) => args,
  defaults: { r1: 0, r2: false },
  converters: [
    { names: ["r1"], ...numConverter },
    { names: ["r2"], ...boolConverter }
  ]
})

newRouter({} as any).addRoute({
  name: "noArgs",
  path: "/noArgs",
  onLoad: (args: { q1: string }) => args
})
