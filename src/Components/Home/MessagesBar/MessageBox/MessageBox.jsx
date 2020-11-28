import React, {Component} from 'react';
import css from './MessageBox.module.css';
import {Button}  from "react-bootstrap";
import axios from 'axios';
import ReceivedMessage from "./ReceivedMessage/ReceivedMessage";
import SentMessage from "./SentMessage/SentMessage";
import { connect } from 'react-redux';


class MessageBox extends Component {

    state = {
        boxOpen: false,
        messages: [],
        limit: 10
    }

    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }

    componentDidMount() {
        const url = "http://127.0.0.1:8000/getMessages";
        const data = {
            token: this.props.token,
            friendId: this.props.friend.id,
            limit: this.state.limit
        }
        axios.post(url, data).then((response) => {
            if (response.data.error) {
                return
            }
            const messages = response.data.messages;
            this.setState({...this.state, messages: messages})
        })
        this.props.socket.on('message/' + this.props.friend.id, (data) => {
            const newMessages = this.state.messages;
            newMessages.push(data)
            this.setState({...this.state, messages: newMessages})
        })

    }

    componentDidUpdate() {
        if (this.state.boxOpen) {
            this.executeScroll()
        }
    }

    sendMessage = () => {
        const newMessage = document.getElementById("NewMessage");
        this.props.socket.emit("SEND_MESSAGE", {content: newMessage.value, receiverId: this.props.friend.id})
        newMessage.value = "";
    }

    toggleSize = () => {
        const newState = !this.state.boxOpen;
        this.setState({...this.state, boxOpen: newState});
    }

    render() {

        let messageField = null;
        if (this.state.boxOpen) {
            const messages = this.state.messages.map((message, idx) => {
                if ( message.receiverId === this.props.id) {
                    return <ReceivedMessage key={idx} message={message.content}/>
                } else {
                    return <SentMessage key={idx} message={message.content}/>
                }
            });
            messageField =
                <div className={css.Messages}>
                    <div id="messageField" className={css.MessageField}>
                        {messages}
                        <div ref={this.myRef}></div>
                    </div>
                    <div className={css.NewMessage}>
                        <input type="text" id="NewMessage" className={css.MessageText} autoComplete="off"/>
                    </div>
                    <Button className={css.SendButton} onClick={this.sendMessage}>-></Button>
                </div>
        }

        let margin = "0";
        if (this.props.index === 1) {
            margin = "calc(" + this.props.index * 15 + "% + 5px)";
        }
        return <div className={this.state.boxOpen ? css.MessageBoxOpen : css.MessageBox} style={{marginRight: margin}}>
            <p className={css.Name} onClick={this.toggleSize}>
                {this.props.friend.firstname + " " + this.props.friend.lastname}
            </p>
            <Button className={css.Button} size="sm" variant="outline-dark" onClick={() => this.props.onClose(this.props.friend.id)}>X</Button>
            {messageField}
        </div>
    }

    executeScroll = () => this.myRef.current.scrollIntoView()
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        id: state.auth.id,
    }
}

export default connect(mapStateToProps, null)(MessageBox);