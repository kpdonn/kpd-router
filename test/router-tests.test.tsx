import * as raf from "raf"
raf.polyfill(global)

import createMemoryHistory from "history/createMemoryHistory"
import { History } from "history"

import { newRouter, path, Router } from "typed-mobx-router"
import * as React from "react"
import * as TestRenderer from "react-test-renderer"
import { createRenderer } from "react-test-renderer/shallow"
const Main = (a: any) => <span>Main</span>
const PersonList = (a: any) => <div>PersonList</div>
const Person = (a: any) => <div>Person</div>
const numConverter = {
  toString: (id: number) => id.toString(),
  fromString: (arg: string) => Number.parseInt(arg)
}

describe("is on main page to start", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/", { mainOnLoad, personListOnLoad, personOnLoad })
  const renderer = createRenderer()
  renderer.render(<Router router={router} />)

  it("current route main", () => expect(router.currentRoute.route).toBe("main"))
  it("mainOnLoad called", () => expect(mainOnLoad).toBeCalled())

  it("renderer should match snapshot", () => expect(renderer.getRenderOutput()).toMatchSnapshot())
})

describe("goes to people when function called", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/", { mainOnLoad, personListOnLoad, personOnLoad })
  const renderer = createRenderer()
  renderer.render(<Router router={router} />)
  const history: History = (router as any).history

  router.goTo.personList({})

  it("current route personList", () => expect(router.currentRoute.route).toBe("personList"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ page: 1 }))

  it("called on load correctly", () => expect(personListOnLoad).toBeCalledWith({ page: 1 }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people?page=1"))

  it("renderer should match snapshot", () => expect(renderer.getRenderOutput()).toMatchSnapshot())
})

describe("is on people page 2 to start", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/people?page=2", { mainOnLoad, personListOnLoad, personOnLoad })
  const renderer = createRenderer()
  renderer.render(<Router router={router} />)
  const history: History = (router as any).history

  it("current route personList", () => expect(router.currentRoute.route).toBe("personList"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ page: 2 }))

  it("called on load correctly", () => expect(personListOnLoad).toBeCalledWith({ page: 2 }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people?page=2"))

  it("renderer should match snapshot", () => expect(renderer.getRenderOutput()).toMatchSnapshot())
})

describe("goes to person when function called", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/", { mainOnLoad, personListOnLoad, personOnLoad })
  const renderer = createRenderer()
  renderer.render(<Router router={router} />)
  const history: History = (router as any).history

  router.goTo.person({ id: "42" })

  it("current route person", () => expect(router.currentRoute.route).toEqual("person"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ id: "42" }))

  it("called on load correctly", () => expect(personOnLoad).toBeCalledWith({ id: "42" }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people/42"))

  it("renderer should match snapshot", () => expect(renderer.getRenderOutput()).toMatchSnapshot())
})

describe("is on person list to start", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/people/100", { mainOnLoad, personListOnLoad, personOnLoad })
  const renderer = createRenderer()
  renderer.render(<Router router={router} />)
  const history: History = (router as any).history

  it("current route person", () => expect(router.currentRoute.route).toEqual("person"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ id: "100" }))

  it("called on load correctly", () => expect(personOnLoad).toBeCalledWith({ id: "100" }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people/100"))

  it("renderer should match snapshot", () => expect(renderer.getRenderOutput()).toMatchSnapshot())
})

function createRouter(
  initialPath: string = "/",
  mocks: { mainOnLoad: any; personListOnLoad: any; personOnLoad: any }
) {
  const history = createMemoryHistory({ initialEntries: [initialPath] })
  return newRouter(history)
    .addRoute({
      name: "main",
      path: "/",
      onLoad: mocks.mainOnLoad,
      component: Main
    })
    .addRoute({
      name: "personList",
      path: path`/people`,
      queryParams: ["page"],
      defaults: { page: 1 },
      converters: [{ names: ["page"], ...numConverter }],
      onLoad: mocks.personListOnLoad,
      component: PersonList
    })
    .addRoute({
      name: "person",
      path: path`/people/${"id"}`,
      onLoad: mocks.personOnLoad,
      component: Person
    })
    .start()
}
