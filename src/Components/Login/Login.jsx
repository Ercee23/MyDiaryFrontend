import React , {Component} from 'react';
import css from './Login.module.css';
import {NavLink} from "react-router-dom";
import { connect } from 'react-redux';
import {auth} from '../../store/actions/authentication'
import {withRouter} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';

class Login extends Component {


    login = (event) => {
        event.preventDefault();
        const email = document.getElementById("formGroupEmail").value;
        const password = document.getElementById("formGroupPassword").value;
        this.props.onAuth(email, password);
    };

    componentDidUpdate() {
        if (this.props.token) {
            this.props.history.push("/my-diary")
        } else {
            // toast comes here with error message
        }
    }

    render() {

        return (
            <div className={css.container} onSubmit={(event) => this.login(event)}>
                <h1> Login</h1>
                <Form>
                    <Form.Group controlId="formGroupEmail" className={css.group}>
                        <Form.Label className={css.inputLabel}>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" className={css.inputField}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Label className={css.inputLabel}>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" className={css.inputField}/>
                    </Form.Group>
                    <Button variant="outline-secondary" className={css.logButton} size="lg" type="submit">Login</Button>
                </Form>
                <NavLink className={css.forgetPassword} to="/register">Create an account?</NavLink>
                <NavLink className={css.forgetPassword} to="/register">Forget your password?</NavLink>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        error: state.auth.error,
        registered: state.auth.registered

    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(auth(email, password))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));