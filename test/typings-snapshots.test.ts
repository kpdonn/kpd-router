import { spawnSync } from "child_process"

it("Verifies output of typings checker matches expected", () => {
  const { stdout, stderr, status } = spawnSync("node_modules/typescript/bin/tsc", [
    "--project",
    "typings-tests"
  ])

  expect(stdout.toString()).toMatchSnapshot()
  expect(stderr.toString()).toMatchSnapshot()
  expect(status).toBe(0)
})
