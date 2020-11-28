import {ADD_FRIEND_SUCCESS, ADD_FRIEND_ERROR, SET_FRIENDS} from "../actions";

const initialState = {
    error: null,
    friends: []
};

const set_friends = (state, action) => {
    return {...state, friends: [...action.friends]}
}
const add_friend_success = (state, action) => {
    const new_friends = [...state.friends]
    new_friends.push(action.friend)
    return {...state, friends: new_friends, error: null}
}

const add_friend_error = (state, action) => {
    return {...state, error: action.error}
}

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ADD_FRIEND_SUCCESS: return add_friend_success(state, action);
        case ADD_FRIEND_ERROR: return add_friend_error(state, action);
        case SET_FRIENDS: return set_friends(state, action);
        default:
            return state;
    }
};

export default reducer;