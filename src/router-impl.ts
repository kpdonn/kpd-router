import RouteNode from "route-node"

import { computed, observable } from "mobx"
import { PathTemplate, RouterStore } from "typed-mobx-router"

export class RouterStoreImpl implements RouterStore {
  @observable routeName: string

  @observable params: object

  rootNode = new RouteNode()

  @computed
  get currentPath(): string {
    return this.rootNode.buildPath(this.routeName, this.params)
  }
}

export const path: PathTemplate = <T extends string>(
  literals: TemplateStringsArray,
  ...args: T[]
): [string, T[]] => {
  const builtPath = literals
    .map((litString, i) => (args[i] ? litString + ":" + args[i] : litString))
    .join()

  return [builtPath, args]
}
