import React , {Component} from 'react';
import css from './Register.module.css';
import {register} from "../../store/actions/authentication";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Form, Button} from 'react-bootstrap';


class Register extends Component {


    register = (event) => {
        event.preventDefault();
        const email = document.getElementById("formGroupEmail").value;
        const password = document.getElementById("formGroupPassword").value;
        const firstname = document.getElementById("formGroupFirstName").value;
        const lastname = document.getElementById("formGroupLastName").value;
        this.props.onRegister(email, password, firstname, lastname);
    };

    componentDidUpdate() {
        if (this.props.registered) {
            this.props.history.push("/login")
        } else {
            // toast comes here with error message
        }
    }

    render() {



        return (
            <div className={css.container}>
                <h1> Register NOW</h1>
                <Form onSubmit={(event) => this.register(event)} autoComplete="nope">
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label className={css.inputLabel}>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" className={css.inputField}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Label className={css.inputLabel}>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" className={css.inputField}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Label className={css.inputLabel}>Password Again</Form.Label>
                        <Form.Control type="password" placeholder="Password" className={css.inputField}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupFirstName">
                        <Form.Label className={css.inputLabel}>Firstname</Form.Label>
                        <Form.Control type="text" placeholder="First Name" className={css.inputField}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupLastName">
                        <Form.Label className={css.inputLabel}>Lastname</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" className={css.inputField}/>
                    </Form.Group>
                    <div className={css.termsField}>
                        <input type="checkbox"/>
                        <a href="/"> Agree terms and conditions</a>
                    </div>
                    <Button variant="outline-secondary" className={css.regButton} size="lg" type="submit">Register</Button>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        registered: state.auth.registered,
        error: state.auth.error,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        onRegister: (email, password, firstname, lastname) => dispatch(register(email, password, firstname, lastname))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
