import React, {Component} from 'react';
import css from './FriendsLayout.module.css';
import {Container, Row, Col, Button} from "react-bootstrap";
import { connect } from 'react-redux';

class FriendsLayout extends Component {

    state = {
        friendsLayoutSize: css.stretch,
    };

    toggleHeight = () => {
        const newSize = this.state.friendsLayoutSize ? null : css.stretch;
        this.setState({...this.state, friendsLayoutSize: newSize})
    }

    render() {

        const friends = this.props.friends.map(friend => {
            return <Row key={friend.id} className={this.state.friendsLayoutSize ? css.FriendBodyVisible : css.FriendBodyInvisible}>
                <p onClick={() => this.props.addFriend(friend.id, friend.firstname, friend.lastname)} className={css.Friend}>{friend.firstname + " " + friend.lastname}</p>
            </Row>
        })

        return (
            <Container className={[css.FriendsLayout, this.state.friendsLayoutSize].join(' ')}>
                <Row className={css.FriendHeader}>
                    <Col className={css.FriendHeaderText}>
                        FRIENDS
                    </Col>
                    <Col className={css.FriendHeaderButton}>
                        <Button onClick={() => this.toggleHeight()}>-</Button>
                    </Col>
                </Row>
                {friends}
            </Container>);
    }
}

const mapStateToProps = state => {
    return {
        friends: state.user.friends
    }
}

export default connect(mapStateToProps, null)(FriendsLayout);