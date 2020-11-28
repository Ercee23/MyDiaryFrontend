import React, {Component} from 'react';
import css from './NewDiary.module.css';
import DatePicker from 'react-datepicker';
import {ToggleButton, ButtonGroup, Form, Button} from "react-bootstrap";
import axios from 'axios';
import {connect} from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";

class NewDiary extends Component {

    state = {
        selectedDate: new Date(),
        selectedType: "Private",
    }

    setDate = date => {
        console.log(date)
        this.setState({...this.state, selectedDate: date})
    }

    changeSelected = value => {
        console.log(value)
        this.setState({...this.state, selectedType: value})
    }

    submit = (event) => {
        event.preventDefault()
        const title = document.getElementById("titleField").value;
        const content = document.getElementById("content").value;
        const data = {
            token: this.props.token,
            title: title,
            content: content,
            date: moment(this.state.selectedDate).format("YYYY-MM-DD"),
            type: this.state.selectedType
        }
        axios.post("http://127.0.0.1:8000/addDiary", data).then(response => {
            if (response.data.error) {

            } else {
                document.getElementById("titleField").value = "";
                document.getElementById("content").value = "";
                this.setState({...this.state, selectedDate: new Date(), selectedType: "Private"})
            }
        })
    }

    render() {
        const radios = [
            { name: "Private", value: 1 },
            { name: "Friends", value: 2 },
            { name: "Public", value: 3 }
        ]
        const radioGroup = radios.map((button, idx) => (
                <ToggleButton
                    key={idx}
                    type="radio"
                    variant="dark"
                    name="radio"
                    value={button.name}
                    checked={button.value === this.state.selectedType}
                    onChange={(e) => this.changeSelected(e.currentTarget.value)}>
                    {button.name}
                </ToggleButton>
            )
        )
        const DatePickerInput = ({ value, onClick }) => (
            <button id="dateField" className={css.datePicker} onClick={(e) => {e.preventDefault(); onClick()}}>
                {value}
            </button>
        );
        return <div className={css.NewDiary}>
            <h1 className={css.Header}>Create Your Diary</h1>
            <Form className={css.Form} onSubmit={event => this.submit(event)}>
                <Form.Group className={css.FormGroup}>
                    <Form.Label className={css.Label}>Type</Form.Label>
                    <ButtonGroup toggle>
                        {radioGroup}
                    </ButtonGroup>
                </Form.Group>
                <Form.Group className={css.FormGroup + " " + css.PickerField}>
                    <Form.Label className={css.Label}>Date</Form.Label>
                    <DatePicker placeholderText="Click to select a date"
                                dateFormat="dd/MM/yyyy"
                                selected={this.state.selectedDate}
                                onChange={(date) => this.setDate(date)}
                                customInput={<DatePickerInput />}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label className={css.Label}>Title</Form.Label>
                    <Form.Control id="titleField" type="text" placeholder="Title" className={css.title}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label className={css.Label}>Your Day</Form.Label>
                    <Form.Control id="content" as="textarea" className={css.content}/>
                </Form.Group>
                <Button type="submit" variant="secondary" className={css.Submit}>Post</Button>

            </Form>

        </div>;
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token
    }
}

export default connect(mapStateToProps,null)(NewDiary);