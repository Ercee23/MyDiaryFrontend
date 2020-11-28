import css from "./SentMessage.module.css";
import React, {Component} from "react";


class SentMessage extends Component {

    render() {
        return <div className={css.Message}>
            <p className={css.MessageContent}>{this.props.message}</p>
        </div>;
    }
}

export default SentMessage;