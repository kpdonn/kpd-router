import * as raf from "raf"
raf.polyfill(global)

import createMemoryHistory from "history/createMemoryHistory"
import { newRouter, path, Router } from "typed-mobx-router"
import * as React from "react"
import { createRenderer } from "react-test-renderer/shallow"
import { History } from "history"
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

  describe("router component should render component with", () => {
    it("type", () => expect(renderer.getRenderOutput().type).toEqual(Main))
    it("props", () => expect(renderer.getRenderOutput().props).toEqual({}))
  })
})

describe("goes to people when function called", () => {
  const { router, personListOnLoad, history, renderer } = createRouter("/")

  router.goTo.personList()
  const params = { page: 1 }

  it("current route personList", () => expect(router.currentRoute.route).toBe("personList"))
  it("correct params", () => expect(router.currentRoute.params).toEqual(params))

  it("called on load correctly", () => expect(personListOnLoad).toBeCalledWith(params))
  it("correct url", () => expect(url(history)).toBe("/people?page=1"))

  describe("router component should render component with", () => {
    it("type", () => expect(renderer.getRenderOutput().type).toEqual(PersonList))
    it("props", () => expect(renderer.getRenderOutput().props).toEqual(params))
  })
})

describe("is on people page 2 to start", () => {
  const { router, personListOnLoad, history, renderer } = createRouter("/people?page=2")

  const params = { page: 2 }

  it("current route personList", () => expect(router.currentRoute.route).toBe("personList"))
  it("correct params", () => expect(router.currentRoute.params).toEqual(params))

  it("called on load correctly", () => expect(personListOnLoad).toBeCalledWith(params))
  it("correct url", () => expect(url(history)).toBe("/people?page=2"))

  describe("router component should render component with", () => {
    it("type", () => expect(renderer.getRenderOutput().type).toEqual(PersonList))
    it("props", () => expect(renderer.getRenderOutput().props).toEqual(params))
  })
})

describe("goes to person when function called", () => {
  const { router, personOnLoad, history, renderer } = createRouter("/")
  const params = { id: "42" }

  router.goTo.person({ ...params })

  it("current route person", () => expect(router.currentRoute.route).toEqual("person"))
  it("correct params", () => expect(router.currentRoute.params).toEqual(params))

  it("called on load correctly", () => expect(personOnLoad).toBeCalledWith(params))
  it("correct url", () => expect(url(history)).toBe("/people/42"))

  describe("router component should render component with", () => {
    it("type", () => expect(renderer.getRenderOutput().type).toEqual(Person))
    it("props", () => expect(renderer.getRenderOutput().props).toEqual(params))
  })
})

describe("is on person page to start", () => {
  const { router, personOnLoad, history, renderer } = createRouter("/people/100")
  const params = { id: "100" }

  it("current route person", () => expect(router.currentRoute.route).toEqual("person"))
  it("correct params", () => expect(router.currentRoute.params).toEqual(params))

  it("called on load correctly", () => expect(personOnLoad).toBeCalledWith(params))
  it("correct url", () => expect(url(history)).toBe("/people/100"))

  describe("router component should render component with", () => {
    it("type", () => expect(renderer.getRenderOutput().type).toEqual(Person))
    it("props", () => expect(renderer.getRenderOutput().props).toEqual(params))
  })
})

describe("goes back when user clicks back", () => {
  const { router, mainOnLoad, history, renderer } = createRouter("/")

  expect(mainOnLoad).toHaveBeenCalled()
  mainOnLoad.mockClear()
  router.goTo.personList({ page: 5 })
  expect(renderer.getRenderOutput().type).toEqual(PersonList)
  expect(renderer.getRenderOutput().props).toEqual({ page: 5 })
  expect(mainOnLoad).not.toHaveBeenCalled()
  expect(router.currentRoute.route).not.toBe("main")
  expect(history.location.pathname + history.location.search).not.toBe("/")
  history.goBack()

  it("called main on load after going back", () => expect(mainOnLoad).toHaveBeenCalled())
  it("current route main after going back", () => expect(router.currentRoute.route).toBe("main"))
  it("current route params empty", () => expect(router.currentRoute.params).toEqual({}))
  it("main url after", () => expect(history.location.pathname + history.location.search).toBe("/"))
  describe("router component should render component with", () => {
    it("type", () => expect(renderer.getRenderOutput().type).toEqual(Main))
    it("props", () => expect(renderer.getRenderOutput().props).toEqual({}))
  })
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

function url(history: History): string {
  return history.location.pathname + history.location.search
}
