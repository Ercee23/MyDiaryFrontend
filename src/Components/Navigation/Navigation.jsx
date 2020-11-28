import React , {Component} from 'react';
import {withRouter} from 'react-router-dom';
import css from './Navigation.module.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import logoBlack from './bookblack.svg';
import { connect } from 'react-redux';
import {Nav, Navbar, Form, Button } from "react-bootstrap";
import axios from "axios";
import {addFriend} from '../../store/actions/user';
import {autoSignIn} from "../../store/actions/authentication";



class NavigationBar extends Component {

    state = {
        suggestions: [],
        isLoading: false,
        selected: null
    }

    componentDidMount() {
        this.props.autoSignIn();
    }

    addFriend = (event) => {
        event.preventDefault();
        this.props.addFriend(this.props.token, this.state.selected)
    }

    searchFieldChange = (value) => {
        this.setState({...this.state, isLoading: true})
        const url = "http://127.0.0.1:8000/searchUser";
        axios.post(url, {value: value}).then(response => {
            let suggestions = response.data;
            suggestions = suggestions.filter(suggestion => {
                return suggestion.id !== this.props.id
            })
            this.setState({...this.state, suggestions: suggestions, isLoading: false});
        })
    }

    setSelected = (event) => {
        this.setState({...this.state, selected: event[0].id})
    }

    filterBy = () => true;

    render() {
        let rightSide =
            <Nav className="mr-sm-2">
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
            </Nav>;

        let searchBar = null;

        if (this.props.token) {
            rightSide =
                    <div className={css.loggedinBar}>
                        <h6 className={css.name}>{this.props.firstname + " " + this.props.lastname}</h6>
                        <Nav className={css.logout}>
                            <Nav.Link href="/logout" className={css.logoutButton}>Logout</Nav.Link>
                        </Nav>
                    </div>
            searchBar = <Form
                            inline
                            className={css.SearchBar}
                            onSubmit={(event) => this.addFriend(event)}
                            >
                            <AsyncTypeahead
                                className={css.SearchField}
                                id="searchField"
                                filterBy={this.filterBy}
                                onSearch={this.searchFieldChange}
                                isLoading={this.state.isLoading}
                                labelKey={option => `${option.firstname} ${option.lastname}`}
                                onChange={(event) => this.setSelected(event)}
                                options={this.state.suggestions}
                                placeholder="Search..."
                                renderMenuItemChildren={(user, _) => (
                                            <span>
                                                <h6 style={{display: "inline"}}>
                                                    {user.firstname + " " + user.lastname + " (" + user.id + ")"}
                                                </h6>
                                            </span>
                                          )}/>
                            <Button type="submit" className={css.SearchButton} disabled={this.state.selected===null}>Add Friend +</Button>
                        </Form>;
        }

        return (
            <Navbar bg="purple" expand="lg" className={css.navbar}>
                <Navbar.Brand href="/my-diary">
                    <img
                        src={logoBlack}
                        width="60"
                        height="60"
                        className="d-inline-block align-top"
                        alt="My Diary logo"
                    />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/my-diary">My Diary</Nav.Link>
                    </Nav>
                    {searchBar}
                    {rightSide}
                </Navbar.Collapse>
            </Navbar>

        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        id: state.auth.id,
        firstname: state.auth.firstname,
        lastname: state.auth.lastname
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addFriend: (id, friendId) => dispatch(addFriend(id, friendId)),
        autoSignIn: () => dispatch(autoSignIn())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavigationBar));