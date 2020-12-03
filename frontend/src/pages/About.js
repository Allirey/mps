import React from "react";
import Container from "@material-ui/core/Container";

export default class extends React.Component{

    render() {
        return (
            <Container maxWidth={"sm"}>
            <h1>Hello, wanderer!</h1>
                <p>I'm python/js developer, and it's my home-project, sandbox for testing things, and implementing some little useful services for myself.
                If u have an idea or wishes for some services to implement - feel free to contact
                    me via <a href={"https://t.me/inf13"} style={{textDecoration:"none", color: "blue"}}>telegram</a>.
                </p>

                </Container>
        )
    }

}