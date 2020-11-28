import React, {Component} from 'react';
import css from './Layout.module.css';
import { connect } from 'react-redux';
import NavigationBar from "../Navigation/Navigation";
import Register from "../Register/Register";
import Login from "../Login/Login";
import LandingPage from "../Landing/Landing";
import { Switch, Route } from 'react-router';
import HomePage from '../Home/Feeds/Feeds';
import Logout from "../Logout/Logout";
import FriendsLayout from "../Home/FriendsLayout/FriendsLayout";
import LeftCommandBar from "../Home/LeftCommandBar/LeftCommandBar";
import {Col, Container, Row} from "react-bootstrap";
import MessagesBar from "../Home/MessagesBar/MessagesBar";
import {io} from "socket.io-client";
import {getFriends} from "../../store/actions/user";
import axios from 'axios';
import NewDiary from "../Home/NewDiary/NewDiary";
import Profile from "../Home/Profile/Profile";
import {autoSignIn} from "../../store/actions/authentication";


class Layout extends Component {


    state = {
        messageFriends : [],
        socket: null,
        checkUnRead: false,
        midLayout: <HomePage/>
    }


    changeLayout = (layoutName) => {
        let midLayout = <HomePage/>;
        switch (layoutName) {
            case "Profile":
                midLayout = <Profile/>
                break;
            case "Add":
                midLayout = <NewDiary/>
                break;
        }
        this.setState({...this.state, midLayout: midLayout})
    }

    removeFriend = (friendId) => {
        const newList = [...this.state.messageFriends]
        for (let i = 0; i < newList.length; i++ ) {
            if (newList[i].id === friendId) {
                newList.splice(i, 1)
            }
        }
        this.setState({...this.state, messageFriends: newList})

    }

    addFriend = (friendId, firstname, lastname) => {
        const newList = [...this.state.messageFriends]
        for (let i = 0; i <newList.length; i++ ) {
            if (this.state.messageFriends[i].id === friendId) {
                return;
            }
        }
        newList.push({id: friendId, firstname: firstname, lastname:lastname})
        this.setState({...this.state, messageFriends: newList})
    }


    componentDidUpdate() {
        if (this.props.token) {
            if (this.state.socket === null) {
                const socket = io("http://127.0.0.1:8000");
                socket.on('connect', () => {
                    socket.emit('SEND_ID', this.props.token)
                })

                this.setState({...this.state, socket: socket})
                this.props.getFriends(this.props.token)
            } else {
                if (!this.state.checkUnRead) {
                    const url =  "http://127.0.0.1:8000/getUnread";
                    axios.get(url, {params: {token: this.props.token}}).then(response => {
                        if (response.data.messages && response.data.messages.length !== 0) {
                            response.data.messages.map(userId => {
                                for (let i = 0; i < this.props.friends.length; i++) {
                                    if (this.props.friends[i].id === userId) {
                                        const myFriend = this.props.friends[i];
                                        this.addFriend(myFriend.id, myFriend.firstname, myFriend.lastname)
                                    }
                                }
                            })
                        }
                    })
                    this.setState({...this.state, checkUnRead: true})
                }
                if (this.props.friends.length !== 0) {
                    this.props.friends.map(friend => {
                        for ( let i = 0; i < this.state.messageFriends.length; i++) {
                            if (this.state.messageFriends[i].id === friend.id) {
                                return;
                            }
                        }
                        this.state.socket.on("message/" + friend.id, (_) => {
                            for (let i = 0; i < this.props.friends.length; i++) {
                                if (this.props.friends[i].id === friend.id) {
                                    const myFriend = this.props.friends[i];
                                    this.addFriend(myFriend.id, myFriend.firstname, myFriend.lastname)
                                }
                            }
                        })
                    })
                }
            }
        }
        return true;
    }



    render() {
        let redirectPage =  <LandingPage/>;
        if (this.props.token) {
            redirectPage =
            <Container fluid={true} className={css.Container}>
                <Row>
                    <Col xl={2} sm={2} className={css.leftCommandBar}>
                        <LeftCommandBar changeMidLayout={(layoutName) => this.changeLayout(layoutName)}/>
                    </Col>
                    <Col xl={8} sm={5}>
                        {this.state.midLayout}
                    </Col>
                    <Col xl={2} sm={2} className={css.FriendsLayout}>
                        <FriendsLayout addFriend={this.addFriend}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MessagesBar openMessages={this.state.messageFriends}
                                     removeFriend={this.removeFriend}
                                     socket={this.state.socket}/>
                    </Col>
                </Row>
            </Container>;
        }
        return (
            <div>
                <NavigationBar/>
                <div className={css.background}/>
                <Switch>
                    <Route path="/register" exact component={Register}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/my-diary">
                        {redirectPage}
                    </Route>
                    <Route path="/">
                        {redirectPage}
                    </Route>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        friends: state.user.friends
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getFriends: token => dispatch(getFriends(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);