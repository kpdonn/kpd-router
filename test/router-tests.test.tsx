import * as raf from "raf"
raf.polyfill(global)

import createMemoryHistory from "history/createMemoryHistory"
import { History } from "history"

import { newRouter, path, Router } from "typed-mobx-router"
import * as React from "react"
import { createRenderer } from "react-test-renderer/shallow"
const Main = (a: any) => <span>Main</span>
const PersonList = (a: any) => <div>PersonList</div>
const Person = (a: any) => <div>Person</div>
const numConverter = {
  toString: (id: number) => id.toString(),
  fromString: (arg: string) => Number.parseInt(arg)
}

describe("is on main page to start", () => {
  const { router, mainOnLoad, renderer } = createRouter("/")

  it("current route main", () => expect(router.currentRoute.route).toBe("main"))
  it("mainOnLoad called", () => expect(mainOnLoad).toBeCalled())

  it("Should render main no props", () => expect(renderer.getRenderOutput()).toMatchSnapshot())
})

describe("goes to people when function called", () => {
  const { router, personListOnLoad, history, renderer } = createRouter("/")

  router.goTo.personList()

  it("current route personList", () => expect(router.currentRoute.route).toBe("personList"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ page: 1 }))

  it("called on load correctly", () => expect(personListOnLoad).toBeCalledWith({ page: 1 }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people?page=1"))

  it("Should render personlist page 1 num", () =>
    expect(renderer.getRenderOutput()).toMatchSnapshot())
})

describe("is on people page 2 to start", () => {
  const { router, personListOnLoad, history, renderer } = createRouter("/people?page=2")

  it("current route personList", () => expect(router.currentRoute.route).toBe("personList"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ page: 2 }))

  it("called on load correctly", () => expect(personListOnLoad).toBeCalledWith({ page: 2 }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people?page=2"))

  it("Should render personlist page 2 num", () =>
    expect(renderer.getRenderOutput()).toMatchSnapshot())
})

describe("goes to person when function called", () => {
  const { router, personOnLoad, history, renderer } = createRouter("/")

  router.goTo.person({ id: "42" })

  it("current route person", () => expect(router.currentRoute.route).toEqual("person"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ id: "42" }))

  it("called on load correctly", () => expect(personOnLoad).toBeCalledWith({ id: "42" }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people/42"))

  it("should render person id 42 string", () =>
    expect(renderer.getRenderOutput()).toMatchSnapshot())
})

describe("is on person page to start", () => {
  const { router, personOnLoad, history, renderer } = createRouter("/people/100")

  it("current route person", () => expect(router.currentRoute.route).toEqual("person"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ id: "100" }))

  it("called on load correctly", () => expect(personOnLoad).toBeCalledWith({ id: "100" }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people/100"))

  it("should render person id 100 string", () =>
    expect(renderer.getRenderOutput()).toMatchSnapshot())
})

function createRouter(initialPath: string = "/") {
  const history = createMemoryHistory({ initialEntries: [initialPath] })
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = newRouter(history)
    .addRoute({
      name: "main",
      path: "/",
      onLoad: mainOnLoad,
      component: Main
    })
    .addRoute({
      name: "personList",
      path: path`/people`,
      queryParams: ["page"],
      defaults: { page: 1 },
      converters: [{ names: ["page"], ...numConverter }],
      onLoad: personListOnLoad,
      component: PersonList
    })
    .addRoute({
      name: "person",
      path: path`/people/${"id"}`,
      onLoad: personOnLoad,
      component: Person
    })
    .start()

  const renderer = createRenderer()
  renderer.render(<Router router={router} />)

  return {
    router,
    mainOnLoad,
    personListOnLoad,
    personOnLoad,
    history,
    renderer
  }
}
