import React, { useEffect, useState }  from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import { Redirect } from "react-router";
import Loader from "react-loader-spinner";
import "./CreateRoom.css";
import {createRoomApi, joinChatRoom } from "../../utils/requests";
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants';

const schema = yup.object({
	name: yup.string().required("Room name is required"),
});

function CreateRoom(){

	const [redirect, setRedirect] = useState(false);
	const [redirectLogin, setRedirectLogin] = useState(false);
	const [sppiner, setSpinner] = useState(false);
	
	const [state , setState] = useState({
        successMessage: null,
        errorMessage: null,
    });

    const handleSubmit = async evt => {
    	setSpinner(true)
    	console.log("handleSubmit")
    	console.log(evt)
    	const isValid = await schema.validate(evt);
	    if (!isValid) {
	      console.log("not Valid data in handleSubmit function")
	      return;
	    }else{
	      console.log("valid data")
	    }

	    let token = localStorage.getItem(ACCESS_TOKEN_NAME)
    	try{
    		const response = await createRoomApi(evt.name, token);
    		console.log(response.data._id)
    		setState({successMessage : 'Room created, redirecting you to room chat..'})
    	 
    		localStorage.setItem("chatRoomId", response.data._id);
    		localStorage.setItem("chatRoomName", response.data.name);
    		setSpinner(false)
    		setRedirect(true);

    	 }catch(err){
    	 	setSpinner(false)
    	 	console.log("create room err")
    	 	console.log(err)
    	 	setState({errorMessage : 'Room not created, choose unique room name and try again.'})
    	 }

    }

    useEffect(() => {
	    if(! localStorage.getItem(ACCESS_TOKEN_NAME) ){
	      setRedirectLogin(true)
	    }
	});


	if(redirect) {
    	return (<Redirect to="/chatroom" />);
	}
	if(redirectLogin){
		return (<Redirect to='/login' />);
	}


	return (
		
    	<div className="container-fluid h-100  mt-5">
        	<div className="row justify-content-center h-100">

	        	<div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
	                {state.successMessage}
	            </div>

	            <div className="alert alert-danger mt-2" style={{display: state.errorMessage ? 'block' : 'none' }} role="alert">
	                {state.errorMessage}
	            </div>
	        </div>

	        <div className="row justify-content-center h-100">

        		<Formik validationSchema={schema} onSubmit={handleSubmit}
                          initialValues={{name:''}}
                          >
                          {({
                          handleSubmit,
                          handleChange,
                          handleBlur,
                          values,
                          touched,
                          isInvalid,
                          errors,
                          }) => (
                          <Form noValidate onSubmit={handleSubmit}>
                              <Form.Row>
                                  <Form.Group as={Col} md="12" controlId="handle">
                                      <Form.Label>Room Name?</Form.Label>
                                      <Form.Control
                                      type="text"
                                      name="name"
                                      placeholder="My Awesome Room"
                                      value={values.name || ""}
                                      onChange={handleChange}
                                      isInvalid={touched.message && errors.message}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                          {errors.message}
                                      </Form.Control.Feedback>
                                  </Form.Group>
                              </Form.Row>
                              <Button className="btn btn-secondary" type="submit" style={{ marginRight: "10px" }}>Create Room</Button>
                          </Form>
                          )}
                </Formik>

        	</div>
        </div>

	);

}

export default CreateRoom;