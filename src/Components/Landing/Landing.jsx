import React , {Component} from 'react';
import css from './LandingPage.module.css';
import {Button} from "react-bootstrap";
import image1 from "./image1.jpeg";
import image2 from "./image2.jpeg";
import image3 from "./image3.jpeg";

class LandingPage extends Component {

    state = {
        image1: [css.Image],
        image2: [css.Image, css.NonVisible],
        image3: [css.Image, css.NonVisible],
    }

    componentDidMount() {
        setInterval(() => {
            const image1 = [css.Image]
            const image2 = [css.Image]
            const image3 = [css.Image]
            if (this.state.image1.length === 1) {
                image1.push(css.NonVisible)
                image3.push(css.NonVisible)
            } if (this.state.image2.length === 1) {
                image1.push(css.NonVisible)
                image2.push(css.NonVisible)
            } if (this.state.image3.length === 1) {
                image2.push(css.NonVisible)
                image3.push(css.NonVisible)
            }
            this.setState({image1: image1, image2: image2, image3: image3});
        }, 5000)
    }

    render() {
        return (
            <div className={css.Container}>
                <img src={image1} className={this.state.image1.join(" ")}/>
                <img src={image2} className={this.state.image2.join(" ")}/>
                <img src={image3} className={this.state.image3.join(" ")}/>
                <p className={css.Content}>Start Adding Your Friends, Catch What They are doing, Share Your DAY !</p>
                <p className={css.Account}>Dont Have an Account?</p>
                <Button className={css.StartButton} variant="outline-dark">Getting Started</Button>
            </div>
        );
    }
}

export default LandingPage;