import React from "react";
import "./button.scss";
export default function Button(props) {
    return (
        <div>
            <button className={`button ${props.className}`} onClick={props.onClick}>
                {props.children}
            </button>
        </div>
    );
}
