type Literal<T extends string> = string extends T ? never : T

type PartPartial<T, U extends string> = string extends U
  ? T
  : Identity<{ [K in Extract<keyof T, U>]?: T[K] } & { [K in Exclude<keyof T, U>]: T[K] }>

type Identity<T> = { [K in keyof T]: T[K] }

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
    Defaults extends Exactly<Partial<ConvertedArgs>, Defaults>,
    OnLoadArgs extends PartPartial<
      ConvertedArgs,
      Exclude<Literal<OptParams>, Literal<keyof Defaults>>
    >
  >(route: {
    name: Name
    params: ReqParams[]
    optParams?: OptParams[]
    converters?: Converters
    defaults?: Defaults
    onLoad?: (arg: OnLoadArgs) => void
  }): Rb<
    G &
      ({} extends GoToArgs
        ? Record<Name, (arg?: GoToArgs) => void>
        : Record<Name, (arg: GoToArgs) => void>)
  >
}

declare const rb: Rb

const r = rb
  .add({
    name: "hello",
    params: ["a", "b"],
    optParams: ["c", "d"],
    converters: {
      a: strToNum,
      c: strToNum
    },
    defaults: {
      a: 3,
      c: 1
    },
    onLoad: (arg: { c: number; b: string }) => console.log("")
  })
  .start()

r.goTo.hello({ b: "", c: 5 })
