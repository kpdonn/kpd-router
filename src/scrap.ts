import { Converters, OptParams, ReqParams } from "./interfaces"

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

type Literal<T extends string> = string extends T ? never : T

type PartPartial<T, U extends string> = string extends U
  ? T
  : { [K in Extract<keyof T, U>]?: T[K] } & { [K in Exclude<keyof T, U>]: T[K] }

const strToNum = (arg: string) => arg.length

type Exactly<T, X> = { [K in keyof X]: K extends keyof T ? T[K] : never }

interface Rb<G = {}> {
  start(): { goTo: G }

  add<
    Name extends string,
    ReqParams extends string,
    OptParams extends string,
    Params extends Literal<ReqParams> | Literal<OptParams>,
    Converters extends Exactly<Partial<Record<Params, (str: string) => any>>, Converters>,
    ConvertedArgs extends {
      [ConvArg in Params]: Converters[ConvArg] extends (arg: string) => infer T ? T : string
    },
    GoToArgs extends PartPartial<ConvertedArgs, Literal<OptParams> | Literal<keyof Defaults>>,
    Defaults extends Exactly<Partial<ConvertedArgs>, Defaults>
  >(route: {
    name: Name
    params: ReqParams[]
    optParams?: OptParams[]
    converters?: Converters
    defaults?: Defaults
  }): Rb<G & Record<Name, (arg: GoToArgs) => void>>
}

declare const rb: Rb

const r = rb
  .add({
    name: "hello",
    params: ["a", "b"],
    optParams: ["c", "d"],
    converters: {
      a: (arg: string) => arg.length,
      c: (arg: string) => arg.length
    },
    defaults: {
      a: 3
    }
  })
  .start()

r.goTo.hello({ b: "", c: 5 })
