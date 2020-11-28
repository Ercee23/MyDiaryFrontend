import React, {Component} from 'react';
import css from './Feeds.module.css';
import {connect} from 'react-redux';
import axios from 'axios';
import moment from "moment";
import {Button} from "react-bootstrap";

class Feeds extends Component {

    state = {
        limit: 1,
        diaries: [],
        refreshButton: false,
        newItems: []
    }

    componentDidMount() {
        const eventSource = new EventSource("http://127.0.0.1:8000/newDiary?token=" + this.props.token)
        eventSource.onmessage = message => {
            const newMessages = JSON.parse(message.data);
            const newItems = [];
            for (let new_diary of newMessages.messages) {
                let isAdded = false;
                this.state.diaries.map(diary => {
                    if (diary.id === new_diary.id) {
                        isAdded = true;
                    }
                })
                if (!isAdded) {
                    newItems.unshift(new_diary);
                }
            }
            this.setState({...this.state, refreshButton: true, newItems: [...newItems, ...this.state.newItems]});
        };
        axios.get("http://127.0.0.1:8000/getFeeds", {params: {token: this.props.token, limit: this.state.limit}}).then(response => {
            if (response.data.error) {

            } else {
                const newLimit = this.state.limit + 1;
                this.setState({...this.state, diaries: response.data.diaries, limit: newLimit})
            }
        })
    }

    refreshButtonHandler = () => {
        this.setState({...this.state, newItems: [], refreshButton: false, diaries: [...this.state.newItems, ...this.state.diaries]})
    }

    checkScroll = event => {
        console.log(event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight)
        if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) {
            console.log(event.target.scrollHeight)
            const oldHeight = event.target.scrollTop
            console.log(event.target.clientHeight)
            axios.get("http://127.0.0.1:8000/getFeeds", {params: {token: this.props.token, limit: this.state.limit}}).then(response => {
                if (response.data.error) {

                } else {
                    const newLimit = this.state.limit + 1;
                    const new_diaries = [...this.state.diaries, ...response.data.diaries];
                    this.setState({...this.state, diaries: new_diaries, limit: newLimit}, () => event.target.scrollTop = oldHeight)
                }
            })
        }
    }

    render() {
        let refreshButton = null;
        if (this.state.refreshButton) {
            refreshButton = <Button className={css.refreshButton} onClick={this.refreshButtonHandler}>Retrieve new entries...</Button>
        }
        let diaries = <h6 className={css.NoDiary}>You dont have any diary start adding</h6>;
        if (this.state.diaries.length) {
            diaries = this.state.diaries.map((diary, index) => {
                return <div key={index} className={css.Diary}>
                    <h6 className={css.Title} title={diary.title}>Title: {diary.title}</h6>
                    <h6 className={css.Date}>Date: {moment(diary.date).format("YYYY-MM-DD")}</h6>
                    <div><h6 className={css.MonthHeader}>{diary.user.firstname + "'s"} day!</h6> <p className={css.Content}>{diary.content}</p></div>;
                </div>
            })
        }
        return (
            <div className={css.Home} onScroll={event => this.checkScroll(event)}>
                <h1 className={css.Header}>Feeds</h1>
                {refreshButton}
                {diaries}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        id: state.auth.id
    }
}

export default connect(mapStateToProps, null)(Feeds);