import React from "react";
import logo from "./assets/fox.jpg"

export default class extends React.Component {
    render() {
        return (
            <div>
                <h1>Privet, anon</h1>
                <img src={logo} alt={"logo"} width={window.innerWidth < 700? window.innerWidth/1.1: window.innerWidth/2}/>
            </div>
        );
    }
}