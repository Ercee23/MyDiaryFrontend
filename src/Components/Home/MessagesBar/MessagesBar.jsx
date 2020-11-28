import React, {Component} from 'react'
import css from './MessagesBar.module.css';
import MessageBox from "./MessageBox/MessageBox";
import { connect } from 'react-redux';

class MessagesBar extends Component {

    render() {
        const messages = this.props.openMessages.map((openMessage, index) => {
            return <MessageBox
                key={openMessage.id}
                socket={this.props.socket}
                friend={openMessage}
                onClose={this.props.removeFriend}
                index={index}/>
        })

        return (
            <div className={css.MessagesBar}>
                {messages}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        token: state.auth.token,
        friends: state.user.friends
    }
}

export default connect(mapStateToProps, null)(MessagesBar);