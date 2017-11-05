import { newRouter } from "../src/typed-mobx-router"
import createMemoryHistory from "history/createMemoryHistory"
import { path } from "router-impl"

const history = createMemoryHistory()
const mainOnLoad = jest.fn()
const peopleOnLoad = jest.fn()
const personOnLoad = jest.fn()

const router = newRouter(history)
  .addRoute({
    name: "main",
    path: path`/`,
    queryParams: ["test"],
    onLoad: () => mainOnLoad()
  })
  .addRoute({
    name: "people",
    path: path`/people`,
    queryParams: ["page"],
    onLoad: () => peopleOnLoad()
  })
  .addRoute({
    name: "person",
    path: path`/people/${"id"}`,
    queryParams: ["test"],
    onLoad: params => personOnLoad(params)
  })
  .start()

describe("Router test", () => {
  it("is on main page to start", () => {
    expect(router.routerStore.routeName).toBe("main")
    expect(mainOnLoad).toBeCalled()
  })

  it("goes to people when function called", () => {
    expect(peopleOnLoad).not.toBeCalled()
    router.people({})
    expect(router.routerStore.routeName).toBe("people")
    expect(peopleOnLoad).toBeCalled()
    expect(history.location.pathname + history.location.search).toBe("/people")
  })

  it("goes to person when function called", () => {
    expect(personOnLoad).not.toBeCalled()
    router.person({ id: "42" })
    expect(router.routerStore.routeName).toEqual("person")
    expect(router.routerStore.params).toEqual({ id: "42" })
    expect(personOnLoad).toBeCalledWith({ id: "42" })
    expect(history.location.pathname + history.location.search).toBe("/people/42")
  })
})
