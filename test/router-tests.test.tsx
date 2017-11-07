
import createMemoryHistory from "history/createMemoryHistory"

import {newRouter, path} from "typed-mobx-router"
let history = createMemoryHistory()
const mainOnLoad = jest.fn()
const peopleOnLoad = jest.fn()
const personOnLoad = jest.fn()


it("is on main page to start", () => {
  const router = createRouter()

  expect(router.currentRoute.route).toBe("main")
  expect(mainOnLoad).toBeCalled()
})

it("goes to people when function called", () => {
  const router = createRouter()

  expect(peopleOnLoad).not.toBeCalled()
  router.goTo.people({})
  expect(router.currentRoute.route).toBe("people")
  expect(peopleOnLoad).toBeCalled()
  expect(history.location.pathname + history.location.search).toBe("/people")
})

it("goes to person when function called", () => {
  const router = createRouter()

  expect(personOnLoad).not.toBeCalled()
  router.goTo.person({ id: "42" })
  expect(router.currentRoute.route).toEqual("person")
  expect(router.currentRoute.params).toEqual({ id: "42" })
  expect(personOnLoad).toBeCalledWith({ id: "42" })
  expect(history.location.pathname + history.location.search).toBe("/people/42")
})


it("is on people page to start", () => {
  expect(peopleOnLoad).not.toBeCalled()

  const router = createRouter("/people")
  expect(router.currentRoute.route).toBe("people")
  expect(peopleOnLoad).toBeCalled()
  expect(history.location.pathname + history.location.search).toBe("/people")
})


function createRouter(initialPath: string = "/") {
  history = createMemoryHistory({initialEntries: [initialPath]})
  return newRouter(history)
    .addRoute({
      name: "main",
      path: path`/`,
      queryParams: ["test"],
      onLoad: mainOnLoad
    })
    .addRoute({
      name: "people",
      path: path`/people`,
      queryParams: ["page"],
      onLoad: peopleOnLoad
    })
    .addRoute({
      name: "person",
      path: path`/people/${"id"}`,
      queryParams: ["test"],
      onLoad: personOnLoad
    })
    .start()
}
