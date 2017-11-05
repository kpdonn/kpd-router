export type Diff<T extends string, U extends string> = ({ [K in T]: K } &
  { [K in U]: never } & { [K: string]: never })[T]

export type ObjectOmit<T extends object, K extends string> = Pick<T, Diff<keyof T, K>>

export type ObjectDiff<T extends object, U extends object> = ObjectOmit<T, keyof U & keyof T> &
  { [K in (keyof U & keyof T)]?: T[K] }

export type Overwrite<T extends object, U extends keyof T, V> = ObjectOmit<T, U> & Record<U, V>
