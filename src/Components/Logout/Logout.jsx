import React, {Component} from 'react';
import {Redirect} from "react-router";
import {connect} from "react-redux";
import {logout} from '../../store/actions/authentication'

class Logout extends Component {

    componentDidMount() {
        this.props.onLogout();

    }


    render() {
        return <Redirect to="/"/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(logout())
    }

}


export default connect(null, mapDispatchToProps)(Logout);