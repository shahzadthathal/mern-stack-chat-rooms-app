import React, {useState} from 'react';

import axios from 'axios';
import './Login.css';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants';
import { withRouter, Redirect } from "react-router-dom";

//import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
//import Row from "react-bootstrap/Row";
//import Col from "react-bootstrap/Col";
//import Breadcrumb from "react-bootstrap/Breadcrumb";
//import BreadcrumbItem from "react-bootstrap/BreadcrumbItem";




function Login(props) {

    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null,
    })
    
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload={
            "email":state.email,
            "password":state.password,
        }
        axios.post(API_BASE_URL+'/api/user/login', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                    localStorage.setItem("userId", response.data.userId)
                   // redirectToProfile();
                   redirectToHome();
                    props.showError(null)
                }
                else if(response.code === 204){
                     setState({errorMessage : 'Username and password do not match'})

                    //props.showError("Username and password do not match");
                }
                else{
                    setState({errorMessage : response.data.error})
                }
            })
            .catch(function (error) {
                console.log(error.message);
                setState({errorMessage :error.message})
                //props.showError(error.message);
            });
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/');
    }
    const redirectToProfile = () => {
        props.updateTitle('Profile')
        props.history.push('/profile');
    }
    const redirectToRegister = () => {
        props.history.push('/signup'); 
        props.updateTitle('Register');
    }

    function isLogedIn() {
        if(localStorage.getItem(ACCESS_TOKEN_NAME))
            //return <Redirect to='/profile' />
        return <Redirect to='/' />
    }

  return(

        <Container>

        {isLogedIn()}
                

            <h1>Login</h1>

            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="Enter email" 
                       value={state.email}
                       onChange={handleChange}
                />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" 
                       className="form-control" 
                       id="password" 
                       placeholder="Password"
                       value={state.password}
                       onChange={handleChange} 
                />
                </div>
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-secondary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>

            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Dont have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
            </div>

        </Container>
    )
}

export default withRouter(Login);
