import * as React from "react"


export class TestComp extends React.Component<{a: string}, {}> {

  render() {
    return <div>
      {this.props.a}
    </div>
  }
}
