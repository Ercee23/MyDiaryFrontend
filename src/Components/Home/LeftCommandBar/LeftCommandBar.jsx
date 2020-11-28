import React, {Component} from 'react';
import css from "./LeftCommandBar.module.css";
import {Nav, Button} from "react-bootstrap";
import home from './home.svg';
import add from './open-book.svg'
import profile from './profile.svg';

class LeftCommandBar extends Component {
    render() {
        return (
            <div className={css.LeftCommandBar}>
                <Nav className="d-md-block sidebar LeftCommandBar">
                    <Button className={css.Button} onClick={() => this.props.changeMidLayout("Home")}><img src={home} alt="Home" className={css.icon}/>Home</Button>
                    <Button className={css.Button} onClick={() => this.props.changeMidLayout("Add")}><img src={add} alt="Add" className={css.icon}/>Add Diary</Button>
                    <Button className={css.Button} onClick={() => this.props.changeMidLayout("Profile")}><img src={profile} alt="Profile" className={css.icon}/>Profile</Button>
                </Nav>
            </div>
        );
    }
}

export default LeftCommandBar;