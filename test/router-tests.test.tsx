import * as raf from "raf"
raf.polyfill(global)

import createMemoryHistory from "history/createMemoryHistory"

import { newRouter, path } from "typed-mobx-router"
import * as React from "react"
import * as ReactSixteenAdapter from "enzyme-adapter-react-16"
import { configure, shallow } from "enzyme"
import { Router } from "Router"

configure({ adapter: new ReactSixteenAdapter() })

let history = createMemoryHistory()
const mainOnLoad = jest.fn()
const personListOnLoad = jest.fn()
const personOnLoad = jest.fn()

const Main = (a: any) => <div>Main</div>
const PersonList = (a: any) => <div>PersonList</div>
const Person = (a: any) => <div>Person</div>

test("is on main page to start", () => {
  const router = createRouter()

  expect(router.currentRoute.route).toBe("main")
  expect(mainOnLoad).toBeCalled()

  const wrapper = shallow(<Router router={router} />)
  expect(wrapper.some(Main)).toBeTruthy()
  expect(wrapper.some(PersonList)).toBeFalsy()
  expect(wrapper.some(Person)).toBeFalsy()
})

test("goes to people when function called", () => {
  const router = createRouter()

  expect(personListOnLoad).not.toBeCalled()
  router.goTo.personList({})
  expect(router.currentRoute.route).toBe("personList")
  expect(router.currentRoute.params).toEqual({ page: 1 })

  expect(personListOnLoad).toBeCalledWith({ page: 1 })
  expect(history.location.pathname + history.location.search).toBe("/people?page=1")

  const wrapper = shallow(<Router router={router} />)
  expect(wrapper.some(<PersonList page={1} />)).toBeTruthy()
  expect(wrapper.some(Main)).toBeFalsy()
  expect(wrapper.some(Person)).toBeFalsy()
})

test("goes to person when function called", () => {
  const router = createRouter()

  expect(personOnLoad).not.toBeCalled()
  router.goTo.person({ id: "42" })
  expect(router.currentRoute.route).toEqual("person")
  expect(router.currentRoute.params).toEqual({ id: "42" })
  expect(personOnLoad).toBeCalledWith({ id: "42" })
  expect(history.location.pathname + history.location.search).toBe("/people/42")

  const wrapper = shallow(<Router router={router} />)
  expect(wrapper.some(<Person id="42" />)).toBeTruthy()
  expect(wrapper.some(Main)).toBeFalsy()
  expect(wrapper.some(PersonList)).toBeFalsy()
})

test("is on person page to start", () => {
  expect(personListOnLoad).not.toBeCalled()

  const router = createRouter("/people/100")
  expect(router.currentRoute.route).toBe("person")
  expect(router.currentRoute.params).toEqual({ id: "100" })
  expect(personOnLoad).toBeCalledWith({ id: "100" })
  expect(history.location.pathname + history.location.search).toBe("/people/100")

  const wrapper = shallow(<Router router={router} />)
  expect(wrapper.some(<Person id="100" />)).toBeTruthy()
  expect(wrapper.some(Main)).toBeFalsy()
  expect(wrapper.some(PersonList)).toBeFalsy()
})

const numberConverter = {
  from: (num: number) => num.toString()
}

function createRouter(initialPath: string = "/") {
  history = createMemoryHistory({ initialEntries: [initialPath] })
  return newRouter(history)
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
      converters: [{ names: ["page"], ...numberConverter }],
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
}
