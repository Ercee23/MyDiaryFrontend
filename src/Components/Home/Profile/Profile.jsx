import React, {Component} from 'react';
import css from './Profile.module.css';
import axios from 'axios';
import {connect} from 'react-redux';
import moment from "moment";

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class Profile extends Component {

    state = {
        diaries: {}
    }

    componentDidMount() {
        axios.get("http://127.0.0.1:8000/getMyDiaries", {params: {token: this.props.token}}).then(response => {
            if (response.data.error) {

            } else {
                const newDiary = {}
                for (let data of response.data) {
                    const year = new Date(data.date).getFullYear();
                    const month = months[new Date(data.date).getMonth() - 1]
                    const day = days[new Date(data.date).getDay()]
                    data.state = "close";
                    data.day = day;
                    if (!newDiary[year]) {
                        newDiary[year] = {}
                    }
                    if (!newDiary[year][month]) {
                        newDiary[year][month] = [];
                    }
                    newDiary[year][month].push(data);
                }
                this.setState({...this.state, diaries: newDiary})
            }
        })
    }

    toggleBox = (event, year, month, index) => {
        const newDiary = this.state.diaries
        newDiary[year][month][index].state = newDiary[year][month][index].state === "close" ? "open" : "close"

        this.setState({...this.state, diaries: newDiary});
    }

    render() {
        let diaries = <h6 className={css.NoDiary}>You dont have any diary start adding</h6>
        if (this.state.diaries.length !== 0) {
            const keys = Object.keys(this.state.diaries)
            diaries = keys.reverse().map(year => {
                const months = Object.keys(this.state.diaries[year]);
                return months.map((month) => {
                    return <div>
                        <h2 className={css.MonthHeader}>{year + " " + month}</h2>
                        {this.state.diaries[year][month].map((diary, index) => {
                            let content = null;
                            if (diary.state !== "close") {
                                content = <div><h6 className={css.MonthHeader}>Your day!</h6> <p className={css.Content}>{diary.content}</p></div>;
                            }
                            return <div key={index} className={css.Diary} onClick={(event) => this.toggleBox(event, year, month, index)}>
                                <h6 className={css.Title} title={diary.title}>Title: {diary.title}</h6>
                                <h6 className={css.Date}>Date: {moment(diary.date).format("YYYY-MM-DD") + ", " + diary.day}</h6>
                                {content}
                            </div>
                        })}
                    </div>
                })
            })
        }
        return <div className={css.Profile}>
            <h1 className={css.Header}>Your Diaries</h1>
            {diaries}
        </div>
    }
}

const mapDispatchToProps = state => {
    return {
        token: state.auth.token
    }
}

export default connect(mapDispatchToProps, null)(Profile);