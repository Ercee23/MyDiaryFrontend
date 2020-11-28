import axios from 'axios';
import {ADD_FRIEND_SUCCESS, ADD_FRIEND_ERROR, SET_FRIENDS} from "./index";


const addFriendFail = err => {
    return {
        type: ADD_FRIEND_ERROR,
        error: err
    }
}

const addFriendSuccess = data => {
    return {
        type: ADD_FRIEND_SUCCESS,
        friend: data.friend
    }
}

const setFriends = data => {
    return {
        type: SET_FRIENDS,
        friends: data.friends
    }
}

export const addFriend = (token, friendId) => {
    return dispatch => {
        const data = {
            token: token,
            friendId: friendId
        }
        const url = "http://127.0.0.1:8000/addFriend";
        axios.post(url, data).then(response => {
            if (response.data.error) {
                console.log(response.data.error)
                dispatch(addFriendFail(response.data.error));
            } else {
                console.log(response.data)
                dispatch(addFriendSuccess(response.data));
            }
        }).catch(err => {
            dispatch(addFriendFail(err));
        });
    }
}

export const getFriends = token => {
    return dispatch => {
        const data = {
            token: token
        }
        const url = "http://127.0.0.1:8000/getFriends";
        axios.post(url, data).then(response => {
            dispatch(setFriends(response.data))
        })
    }

}