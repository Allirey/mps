import React from "react";
import {Link} from 'react-router-dom'


export default class extends React.Component{
    render() {
        return (<>
            <h1>Login page coming soon..</h1>
                <p>not registered? <Link to={"/signup"} style={{textDecoration: "none", color: "blue"}}>Register here</Link>!</p>
            </>
        )
    }
}