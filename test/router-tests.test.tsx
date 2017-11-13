import * as raf from "raf"
raf.polyfill(global)

import createMemoryHistory from "history/createMemoryHistory"
import { newRouter, path, Router } from "typed-mobx-router"
import * as React from "react"
import { createRenderer, ShallowRenderer } from "react-test-renderer/shallow"
import { create } from "react-test-renderer"
import * as ReactTestUtils from "react-dom/test-utils"

import { History } from "history"
import * as ReactDOM from "react-dom"

const Main = (a: any) => <div id="main">Main</div>
const PersonList = (a: any) => <div id="personList">PersonList</div>
const Person = (a: any) => <div id="person">Person</div>

const numConverter = {
  toString: (id: number) => id.toString(),
  fromString: (arg: string) => Number.parseInt(arg)
}

describe("is on main page to start", () => {
  const { router, mainOnLoad, renderer } = createRouter("/")

  it("current route main", () => expect(router.currentRoute.name).toBe("main"))
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

  it("current route personList", () => expect(router.currentRoute.name).toBe("personList"))
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

  it("current route personList", () => expect(router.currentRoute.name).toBe("personList"))
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

  it("current route person", () => expect(router.currentRoute.name).toEqual("person"))
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

  it("current route person", () => expect(router.currentRoute.name).toEqual("person"))
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
  expect(router.currentRoute.name).not.toBe("main")
  expect(url(history)).not.toBe("/")
  history.goBack()

  it("called main on load after going back", () => expect(mainOnLoad).toHaveBeenCalled())
  it("current route main after going back", () => expect(router.currentRoute.name).toBe("main"))
  it("current route params empty", () => expect(router.currentRoute.params).toEqual({}))
  it("main url after", () => expect(history.location.pathname + history.location.search).toBe("/"))
  describe("router component should render component with", () => {
    it("type", () => expect(renderer.getRenderOutput().type).toEqual(Main))
    it("props", () => expect(renderer.getRenderOutput().props).toEqual({}))
  })
})

describe("Link renders as expected", () => {
  let renderer: ShallowRenderer
  beforeEach(() => {
    renderer = createRenderer()
  })
  const { router } = createRouter()
  const Link = router.Link

  it("Link main page", () => {
    renderer.render(<Link route="main">Main Page</Link>)
    expect(renderer.getRenderOutput().type).toEqual("a")
    expect(renderer.getRenderOutput().props).toEqual(
      expect.objectContaining({ href: "/", children: "Main Page" })
    )
  })

  it("Link person list default", () => {
    renderer.render(<Link route="personList">Person List</Link>)
    expect(renderer.getRenderOutput().type).toEqual("a")
    expect(renderer.getRenderOutput().props).toEqual(
      expect.objectContaining({ href: "/people?page=1", children: "Person List" })
    )
  })

  it("Link person list explicit page", () => {
    renderer.render(
      <Link route="personList" page={4}>
        Page 4
      </Link>
    )
    expect(renderer.getRenderOutput().type).toEqual("a")
    expect(renderer.getRenderOutput().props).toEqual(
      expect.objectContaining({ href: "/people?page=4", children: "Page 4" })
    )
  })

  it("Link person", () => {
    renderer.render(
      <Link route="person" id="2">
        Person 2
      </Link>
    )
    expect(renderer.getRenderOutput().type).toEqual("a")
    expect(renderer.getRenderOutput().props).toEqual(
      expect.objectContaining({ href: "/people/2", children: "Person 2" })
    )
  })
})

describe("clicking Link changes pages", () => {
  const { router, history, personListOnLoad } = createRouter()
  const Link = router.Link
  const rendered = ReactTestUtils.renderIntoDocument(
    <div>
      <Router router={router} />
      <Link route="personList">People</Link>
      <Link route="person" id="5">
        Person 5
      </Link>
    </div>
  ) as Element

  expect(personListOnLoad).not.toHaveBeenCalled()

  const peopleLink = Array.from(rendered.querySelectorAll("a")).filter(
    a => a.textContent && a.textContent.includes("People")
  )

  expect(peopleLink).toHaveLength(1)
  ReactTestUtils.Simulate.click(peopleLink[0])

  it("renders personlist", () => expect(rendered.querySelector("#personList")).toBeTruthy())
  it("url changed", () => expect(url(history)).toEqual("/people?page=1"))
  it("called on load correctly", () => expect(personListOnLoad).toBeCalledWith({ page: 1 }))
  it("current route is person list", () => expect(router.currentRoute.name).toBe("personList"))
  it("current route params", () => expect(router.currentRoute.params).toEqual({ page: 1 }))
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
