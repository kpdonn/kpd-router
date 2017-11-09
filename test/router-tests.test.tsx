import * as raf from "raf"
raf.polyfill(global)

import createMemoryHistory from "history/createMemoryHistory"
import { History } from "history"

import { newRouter, path } from "typed-mobx-router"
import * as React from "react"
import * as ReactSixteenAdapter from "enzyme-adapter-react-16"
import { configure, shallow } from "enzyme"
import { Router } from "Router"

configure({ adapter: new ReactSixteenAdapter() })

const Main = (a: any) => <div>Main</div>
const PersonList = (a: any) => <div>PersonList</div>
const Person = (a: any) => <div>Person</div>

describe("is on main page to start", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/", { mainOnLoad, personListOnLoad, personOnLoad })

  it("current route main", () => expect(router.currentRoute.route).toBe("main"))
  it("mainOnLoad called", () => expect(mainOnLoad).toBeCalled())

  describe("Router component output", () => {
    const wrapper = shallow(<Router router={router} />)

    it("Renders main", () => expect(wrapper.contains(<Main />)).toBeTruthy())
    it("not render PersonList", () => expect(wrapper.find(PersonList)).toHaveLength(0))
    it("not render Person", () => expect(wrapper.find(Person)).toHaveLength(0))
  })
})

describe("goes to people when function called", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/", { mainOnLoad, personListOnLoad, personOnLoad })
  const history: History = (router as any).history

  router.goTo.personList({})

  it("current route personList", () => expect(router.currentRoute.route).toBe("personList"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ page: 1 }))

  it("called on load correctly", () => expect(personListOnLoad).toBeCalledWith({ page: 1 }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people?page=1"))

  describe("Router component output", () => {
    const wrapper = shallow(<Router router={router} />)
    it("Renders PersonList", () => expect(wrapper.contains(<PersonList page={1} />)).toBeTruthy())
    it("not render Main", () => expect(wrapper.find(Main)).toHaveLength(0))
    it("not render Person", () => expect(wrapper.find(Person)).toHaveLength(0))
  })
})

describe("goes to person when function called", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/", { mainOnLoad, personListOnLoad, personOnLoad })
  const history: History = (router as any).history

  router.goTo.person({ id: "42" })

  it("current route person", () => expect(router.currentRoute.route).toEqual("person"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ id: "42" }))

  it("called on load correctly", () => expect(personOnLoad).toBeCalledWith({ id: "42" }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people/42"))

  describe("Router component output", () => {
    const wrapper = shallow(<Router router={router} />)
    it("Renders PersonList", () => expect(wrapper.contains(<Person id="42" />)).toBeTruthy())
    it("not render Main", () => expect(wrapper.find(Main)).toHaveLength(0))
    it("not render PersonList", () => expect(wrapper.find(PersonList)).toHaveLength(0))
  })
})

describe("is on person list to start", () => {
  const mainOnLoad = jest.fn()
  const personListOnLoad = jest.fn()
  const personOnLoad = jest.fn()

  const router = createRouter("/people/100", { mainOnLoad, personListOnLoad, personOnLoad })
  const history: History = (router as any).history

  it("current route person", () => expect(router.currentRoute.route).toEqual("person"))
  it("correct params", () => expect(router.currentRoute.params).toEqual({ id: "100" }))

  it("called on load correctly", () => expect(personOnLoad).toBeCalledWith({ id: "100" }))
  it("correct url", () =>
    expect(history.location.pathname + history.location.search).toBe("/people/100"))

  describe("Router component output", () => {
    const wrapper = shallow(<Router router={router} />)
    it("Renders PersonList", () => expect(wrapper.contains(<Person id="100" />)).toBeTruthy())
    it("not render Main", () => expect(wrapper.find(Main)).toHaveLength(0))
    it("not render PersonList", () => expect(wrapper.find(PersonList)).toHaveLength(0))
  })
})

const numberConverter = {
  from: (num: number) => num.toString()
}

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
      converters: [{ names: ["page"], ...numberConverter }],
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
