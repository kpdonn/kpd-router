export type Literal<T extends string> = string extends T ? never : T

export type PartPartial<T, U extends string> = string extends U
  ? T
  : Identity<{ [K in Extract<keyof T, U>]?: T[K] } & { [K in Exclude<keyof T, U>]: T[K] }>

export type Identity<T> = { [K in keyof T]: T[K] }

export type Exactly<T, X> = { [K in keyof X]: K extends keyof T ? T[K] : never }
