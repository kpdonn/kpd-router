import { History } from "history"
import { RouterBuilder } from "interfaces"

export const path = <T extends string>(
  literals: TemplateStringsArray,
  ...args: T[]
): [string, T[]] => {
  const builtPath = literals
    .map((litString, i) => (args[i] ? litString + ":" + args[i] : litString))
    .join()

  return [builtPath, args]
}

export function newRouter(history: History): RouterBuilder {
  // return new RouterBuilderImpl(history)
  return { history } as any
}
