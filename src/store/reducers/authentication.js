import {LOGOUT, AUTH_FAILED, AUTH_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL} from '../actions'

const initialState = {
    token: null,
    firstname: "",
    lastname: "",
    email: null,
    error: false,
    registered: false,
    id: null
};

const auth_failed = (state, action) => {
    return {...state, email: "", error: action.error, id: null, token: null, firstname: "", lastname: ""}
}

const auth_success = (state, action) => {
    return {...state, email: action.email, error: false, id: action.id, firstname: action.firstname, lastname: action.lastname, token: action.token}
}

const register_success = (state, action) => {
    return {...state, error: null, registered: true}
}

const register_fail = (state, action) => {
    return {...state, error: action.error, registered: false}
}

const logout = (state, action) => {
    return {...state, registered: false, email: null, id: null, firstname: "", lastname: "", token: null}
}


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case AUTH_SUCCESS: return auth_success(state, action);
        case AUTH_FAILED: return auth_failed(state, action);
        case REGISTER_SUCCESS: return register_success(state, action);
        case REGISTER_FAIL: return register_fail(state, action);
        case LOGOUT: return logout(state, action);
        default:
            return state;
    }
};

export default reducer;