import { spawnSync } from "child_process"

const tscOptions = [
  "configs/definitions.d.ts",
  "--noEmit",
  "--jsx",
  "react",
  "--experimentalDecorators",
  "--moduleResolution",
  "node",
  "--target",
  "es5",
  "--module",
  "es2015",
  "--lib",
  "es2015,dom,es7",
  "--strict",
  "--noUnusedLocals",
  "false",
  "--skipLibCheck",
  "--allowSyntheticDefaultImports"
]

it("Verify output of no-errors matches expected", () => {
  const { stdout, stderr, status } = spawnSync("node_modules/typescript/bin/tsc", [
    "typings-tests/no-errors.tsx",
    ...tscOptions
  ])

  expect(stdout.toString()).toMatchSnapshot()
  expect(stderr.toString()).toMatchSnapshot()
  expect(status).toBe(0)
})

it("Verify expected errors from missing required goto params matches expected", () => {
  const { stdout, stderr, status } = spawnSync("node_modules/typescript/bin/tsc", [
    "typings-tests/expected-errors-missing-required-goto-params.tsx",
    ...tscOptions
  ])

  expect(stdout.toString()).toMatchSnapshot()
  expect(stderr.toString()).toMatchSnapshot()
  expect(status).toBe(1)
})

it("Verify expected errors from wrong component props matches expected", () => {
  const { stdout, stderr, status } = spawnSync("node_modules/typescript/bin/tsc", [
    "typings-tests/expected-errors-wrong-component-props.tsx",
    ...tscOptions
  ])

  expect(stdout.toString()).toMatchSnapshot()
  expect(stderr.toString()).toMatchSnapshot()
  expect(status).toBe(1)
})

it("Verify expected errors from wrong default types matches expected", () => {
  const { stdout, stderr, status } = spawnSync("node_modules/typescript/bin/tsc", [
    "typings-tests/expected-errors-wrong-default-type.tsx",
    ...tscOptions
  ])

  expect(stdout.toString()).toMatchSnapshot()
  expect(stderr.toString()).toMatchSnapshot()
  expect(status).toBe(1)
})

it("Verify expected errors from wrong onload params matches expected", () => {
  const { stdout, stderr, status } = spawnSync("node_modules/typescript/bin/tsc", [
    "typings-tests/expected-errors-wrong-onload-params.tsx",
    ...tscOptions
  ])

  expect(stdout.toString()).toMatchSnapshot()
  expect(stderr.toString()).toMatchSnapshot()
  expect(status).toBe(1)
})
