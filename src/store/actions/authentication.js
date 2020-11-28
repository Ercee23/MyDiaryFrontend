import {AUTH_FAILED, AUTH_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, LOGOUT} from './index'
import axios from 'axios';
import jwt from 'jsonwebtoken'

export const authSuccess = data => {
    const decodedData = jwt.decode(data)
    return {
        type: AUTH_SUCCESS,
        token: data,
        id: decodedData.id,
        email: decodedData.email,
        firstname: decodedData.firstname,
        lastname: decodedData.lastname
    }
}

export const authFailed = err => {
    return {
        type: AUTH_FAILED,
        error: err
    }
}

export const registerSuccess = _ => {
    return {
        type: REGISTER_SUCCESS
    }
}

export const registerFail = err => {
    return {
        type: REGISTER_FAIL,
        error: err
    }
}


export const register = (email, password, firstname, lastname) => {
    return dispatch => {
        const data = {
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname
        }
        const url = "http://127.0.0.1:8000/register";
        axios.post(url, data).then(response => {
            if (response.data.error) {
                console.log(response.data.error)
                dispatch(registerFail(response.data.error));
            } else {
                console.log(response.data)
                dispatch(registerSuccess(response.data));
            }
        }).catch(err => {
            dispatch(registerFail(err));
        });
    }
}

export const logout = () => {
    localStorage.removeItem("token")
    return {
        type: LOGOUT,
    }
}


export const auth = (email, password) => {
    return dispatch => {
        const data = {
            email: email,
            password: password
        }
        const url = "http://127.0.0.1:8000/login";
        axios.post(url, data).then(response => {
            if (response.data.error) {
                dispatch(authFailed(response.data.error));
            } else {
                console.log(response.data.token)
                localStorage.setItem("token", response.data.token)
                dispatch(authSuccess(response.data.token));
            }
        }).catch(err => {
            dispatch(authFailed(err));
        });
    }
}

export const autoSignIn = () => {
    return dispatch => {
        const token = localStorage.getItem("token")
        if (token) {
            dispatch(authSuccess(token));
        }
        console.log(token);
    }
}