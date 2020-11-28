import css from "./ReceivedMessage.module.css";
import React, {Component} from "react";


class ReceivedMessage extends Component {

    render() {
        return <div className={css.MessageFriend}>
            <p className={css.MessageContentFriend}>{this.props.message}</p>
        </div>;
    }
}

export default ReceivedMessage;