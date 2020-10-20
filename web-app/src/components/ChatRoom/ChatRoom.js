import React from "react";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import * as yup from "yup";
import io from "socket.io-client";
import { Redirect } from "react-router";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import moment from "moment";
import "./ChatRoom.css";
import {joinChatRoom, getRoomMessages, getChatRooms, getRoomDetail } from "../../utils/requests";
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants';
let token = localStorage.getItem(ACCESS_TOKEN_NAME)
const socket = io(API_BASE_URL+'?authToken='+token);
const getChatRoomId = () => {
  return localStorage.getItem("chatRoomId");
  //return JSON.parse(localStorage.getItem("chatRoomId"));
};
const getChatRoomName = () => {
  return localStorage.getItem('chatRoomName');
};
const getCurrentUserId = () => {
  return localStorage.getItem('userId');
}
const schema = yup.object({
message: yup.string().required("Message is required"),
});
function ChatRoomPage() {
  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [sppiner, setSpinner] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState('hide');
  
  function showActionDropdownHandler(){
    if(showActionDropdown=='hide')
    setShowActionDropdown('show')
    else
    setShowActionDropdown('hide')
  }

  async function handleClick(id,name,i){
    console.log("handleClick")
    if(!localStorage.getItem(ACCESS_TOKEN_NAME))
      setRedirectLogin(true)

    localStorage.setItem("chatRoomId", id);
    localStorage.setItem("chatRoomName", name);
    let token = localStorage.getItem(ACCESS_TOKEN_NAME)

    try{
      console.log("joinChatRoom")
      await joinChatRoom(id, token);
      setRedirect(true);

    }catch(err){
      localStorage.removeItem(ACCESS_TOKEN_NAME)
      setRedirectLogin(true)
      console.log("joinChatRoom error")
      console.log(err)
    }
  }
  
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
    console.log("handleSubmit evt")
    console.log(evt)
    const data = Object.assign({}, evt);
    data.roomId = getChatRoomId();
    data.message = evt.message;
    socket.emit("message", data);
    evt.message = '';
  };

  const connectToRoom = () => {

    socket.on("connect", data => {
      console.log("socke on connect")
      console.log(data)
      socket.emit("join", getChatRoomId());
    });

    socket.on("newMessage", data => {
      getMessages();
    });

    setInitialized(true);

  };
  const getMessages = async () => {
    setSpinner(true)
    const response = await getRoomMessages(getChatRoomId());
    console.log("getMessages() response")
    console.log(response.data)
    setSpinner(false)
    setMessages(response.data);
    setInitialized(true);
  };

  const getRooms = async () => {
    const response = await getChatRooms();
    setRooms(response.data);
    setInitialized(true);
  };

  const getChatRoomDetail = async () => {
    let token = localStorage.getItem(ACCESS_TOKEN_NAME)
    const response = await getRoomDetail(getChatRoomId(), token);
    setInitialized(true);
  };

  useEffect(() => {
    if(! localStorage.getItem(ACCESS_TOKEN_NAME) ){
      setRedirectLogin(true)
    }
    if (!initialized) {
      getChatRoomDetail()
      connectToRoom();
      getMessages();
      getRooms();
    }
  });

  if (redirect) {
    return (<Redirect to="/chatroom" />);
  }
  if(redirectLogin){
    return (<Redirect to='/login' />);
  }
return (
  <div>
    <div className="container-fluid h-100  mt-5">
        <div className="row justify-content-center h-100">
            {/*
            <div className="col-md-4 col-xl-3 chat">
                <div className="card mb-sm-3 mb-md-0 contacts_card">
                    <div className="card-header">
                        <div className="input-group">
                            <input type="text" placeholder="Search..." name="" className="form-control search"/>
                            <div className="input-group-prepend">
                                <span className="input-group-text search_btn"><i className="fas fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body contacts_body">
                        <ul className="contacts">
                            {rooms.map((room, i)=>{
                            return(
                            <li className={getChatRoomId() == room._id ? ' active-chat' : ' not-active-chat' } key={i}> 
                            <div className="d-flex bd-highlight">
                                <div className="img_cont">
                                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img"/>
                                </div>
                                <div className="user_info">
                                    <span>{room.name}</span>
                                    <p>
                                        <Button
                                            className=" ml-2"
                                            variant="dark"
                                            size="sm"
                                            disabled={isLoading}
                                            onClick={() => handleClick(room._id, room.name,  i)}
                                        >
                                        {isLoading ? 'Joining…' : 'Join Room'}
                                        </Button>
                                    </p>
                                </div>
                            </div>
                            </li>
                            )
                            })}
                        </ul>
                    </div>
                    <div className="card-footer"></div>
                </div>
            </div>
            */}

            <div className="col-md-8 col-xl-6 chat">
                <div className="card">
                    <div className="card-header msg_head">
                        <div className="d-flex bd-highlight">
                            {/*<div className="img_cont">
                                <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img"/>
                                <span className="online_icon"></span>
                            </div>*/}
                            <div className="user_info">
                                <span>Chat Room: {getChatRoomName()}</span>
                                <p>1767 Messages</p>
                            </div>
                            <div className="video_cam">
                                <span><i className="fas fa-video"></i></span>
                                <span><i className="fas fa-phone"></i></span>
                            </div>
                        </div>
                        <span id="action_menu_btn">
                        <button onClick={ () => showActionDropdownHandler() } className="btn btn-sm btn-light" type="button">
                        Actions
                        </button>
                        <i className="fas fa-ellipsis-v"></i>
                        </span>
                        <div className={`action_menu ${showActionDropdown}`}>
                        <ul>
                            <li><i className="fas fa-user-circle"></i> View profile</li>
                            <li><i className="fas fa-users"></i> Add to close friends</li>
                            <li><i className="fas fa-plus"></i> Add to group</li>
                            <li><i className="fas fa-ban"></i> Block</li>
                        </ul>
                    </div>
                </div>

                <div className="card-body msg_card_body">
                    <div className="text-center">
                        {sppiner ?  
                        <Loader
                            type="ThreeDots"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            />
                        : ''}
                    </div>
                    {messages.map((m, i) => {
                      return(
                          <div className="d-flex justify-content-start mb-4" key={i}>
                              <div className="img_cont_msg">
                                  <span className={m.author.is_online==true ? 'green-dot' : 'offline-dot'}></span>
                                  <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img_msg"/>
                                  {/*<span className={m.author.is_online ? 'online_icon' : 'online_icon offline' }></span> */}
                              </div>
                              <div className={getCurrentUserId() == m.author_id ? ' msg_cotainer_send' : ' msg_cotainer' }>
                                {m.author.username}: {m.message}
                                <span className="msg_time">{moment(m.created_at).format('YYYY-MM-DD HH:mm')}</span>
                              </div>
                          </div>
                      )
                    })}
                  <div className="card-footer">
                      <Formik validationSchema={schema} onSubmit={handleSubmit}
                          initialValues={{author:'xyz',message:''}}
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
                                      <Form.Label>Message</Form.Label>
                                      <Form.Control
                                      type="text"
                                      name="message"
                                      placeholder="Message"
                                      value={values.message || ""}
                                      onChange={handleChange}
                                      isInvalid={touched.message && errors.message}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                          {errors.message}
                                      </Form.Control.Feedback>
                                  </Form.Group>
                              </Form.Row>
                          </Form>
                          )}
                      </Formik>
                  </div>
              </div>

         </div>
       
       </div>
     
     </div>
   
   </div>
  </div>
);
}
export default ChatRoomPage;