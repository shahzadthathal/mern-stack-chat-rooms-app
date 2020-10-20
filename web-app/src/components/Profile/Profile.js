import React, {useEffect, useState} from 'react';

import axios from 'axios';
import './Profile.css';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants';
import { withRouter , Redirect} from "react-router-dom";

import Container from "react-bootstrap/Container";

function Profile(props) {

    const [state , setState] = useState({
        full_name : "",
        successMessage: null,
        errorMessage: null,
        isInitialized:false
    })
    
    useEffect(() => {
        if(!state.isInitialized){
             axios.get(API_BASE_URL+'/api/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
            .then(function (response) {
                console.log(response)
                if(response.status !== 200){
                  redirectToLogin()
                }else{
                    setState({
                        'full_name' : response.data.full_name,
                        "isInitialized":true,
                    });
                }
            })
            .catch(function (error) {
                  localStorage.removeItem(ACCESS_TOKEN_NAME)
                  redirectToLogin()
            });
        }
    });
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.full_name) {
            sendDetailsToServer()    
        } else {
            setState({errorMessage : "Fullname requird"})
        }
    }

    const sendDetailsToServer = () => {
        setState({'successMessage':null});
        setState({'errorMessage':null});

        if(state.full_name && state.full_name.length ) {
           
            const payload={
                "full_name":state.full_name,
            }
            axios.post(API_BASE_URL+'/api/user/update', payload, { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
                .then(function (response) {
                    //console.log(response)
                    if(response.status === 200){
                        setState({successMessage : 'Profile updated successful. Redirecting to home page..'})
                        localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                        redirectToProfile();
                    } else{
                        setState({errorMessage : response.data.error})
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    setState({errorMessage : error.message})
                });    
        } else {
            setState({errorMessage : 'Please enter valid name'})   
        }
        
    }
    const redirectToProfile = () => {
        //props.updateTitle('Profile')
        //props.history.push('/profile');
        props.history.push('/');
    }
    const redirectToLogin = () => {
        //props.updateTitle('Login')
        props.history.push('/login'); 
    }

    function isLogedIn() {
        if(!localStorage.getItem(ACCESS_TOKEN_NAME))
            return <Redirect to='/login' />
    }

  return(

        <Container>

        {isLogedIn()}
                

            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
             <div className="alert alert-danger mt-2" style={{display: state.errorMessage ? 'block' : 'none' }} role="alert">
                {state.errorMessage}
            </div>

                <h1>Update profile</h1>
            
                <form>
                    <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail54">Full Name</label>
                    <input type="text" 
                        className="form-control" 
                        id="full_name" 
                        aria-describedby="emailHelp" 
                        placeholder="Enter Full Name" 
                        value={state.full_name}
                        onChange={handleChange}
                    />
                    </div>

                    
                    <button 
                        type="submit" 
                        className="btn btn-secondary"
                        onClick={handleSubmitClick}
                    >
                        Update profile
                    </button>
                </form>

               
            
        </Container>
    )
}

export default withRouter(Profile);
