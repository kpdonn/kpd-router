


import * as React from "react"
import {observer} from "mobx-react"

export type TODO_FIX_ANY = any

@observer
export class Router extends React.Component<{router: TODO_FIX_ANY}> {


  render() {
    return this.props.router.activeRouteComponent
  }

}
