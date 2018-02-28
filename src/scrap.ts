type ever = string | number | boolean | object | null | undefined | {}

declare function f1<A extends string, C extends { [key: number]: { fields: A[]; t: any } }>(arg: {
  a: A[]
  conv: C
}): {
  [P in A]: {
    [K in keyof C]: C[K] extends { fields: P[]; t: infer T } ? T : string
  }[keyof C] extends never
    ? string
    : { [K in keyof C]: C[K] extends { fields: P[]; t: infer T } ? T : never }[keyof C]
}

type Output<
  A extends string,
  C extends { [key: number]: { fields: string[]; t: any } }
> = C extends { fields: A[]; t: infer T } ? T : "cond was false"

// type X1<F extends string, C2 extends {fields: string[], t: any}[]> = {[K in keyof Pick<C2, Extract<keyof C2, number>]: C2[K] extends {fields: F[]} ? 'mytrue' : C2[K] }[keyof C2]

// type X1<F extends string, C2 extends {fields: string[], t: any}[]> = {[K in keyof Pick<C2, Extract<keyof C2, number>>]: K}

type X1<F extends string, C> = {
  [K in keyof C]: C[K] extends { fields: F[] } ? "mytrue" : C
}[keyof C]
const t = f1({
  a: ["a", "b", "c"],
  conv: { 0: { fields: ["a"], t: 2 }, 1: { fields: ["b"], t: true } }
})

type OnLoad<R extends string> = (arg: Record<R, string>) => void

interface Rb<G = {}> {
  start(): { goTo: G }

  add<
    Name extends string,
    ReqParams extends string,
    Conv extends { [P in ReqParams]?: (str: string) => any },
    LoadArgs extends {
      [LoadArg in ReqParams]: Conv[LoadArg] extends (arg: string) => infer T ? T : string
    }
  >(route: {
    name: Name
    params: ReqParams[]
    converters?: Conv
  }): Rb<G & Record<Name, (arg: LoadArgs) => void>>
}

declare const rb: Rb

const r = rb
  .add({
    name: "hello",
    params: ["a", "b"],
    converters: {
      a: (arg: string) => arg.length
    }
  })
  .start()

r.goTo.hello({ a: 6, b: "" })
