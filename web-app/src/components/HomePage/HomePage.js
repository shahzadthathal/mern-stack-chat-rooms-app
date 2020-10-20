import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Button from "react-bootstrap/Button";
import Loader from "react-loader-spinner";
import io from "socket.io-client";
import { Redirect } from "react-router";
import "./HomePage.css";
import "../ChatRoom/ChatRoom.css";
import addIcon from '../../images/add-icon.jpg';
import { joinChatRoom, getChatRooms } from "../../utils/requests";
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants';
const socket = io(API_BASE_URL);
const getChatRoomId = () => {
  return localStorage.getItem("chatRoomId");
  //return JSON.parse(localStorage.getItem("chatRoomId"));
};

function HomePage() {
  const [initialized, setInitialized] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [sppiner, setSpinner] = useState(false);
  const [redirectCreateRoom, setRedirectCreateRoom] = useState(false);
  
  const getRooms = async () => {
    setInitialized(true);
    setSpinner(true)
    const response = await getChatRooms();
    console.log("getRooms response home.j")
    console.log(response)
    setRooms(response.data);
    setSpinner(false)
  };


  useEffect(() => {
    if (!initialized) {
      getRooms();
    }
  },[isLoading]);
    // [] means like componentDidMount

  async function createRoomHandler(){
    if(!localStorage.getItem(ACCESS_TOKEN_NAME))
      setRedirectLogin(true)
    console.log("createRoomHandler clicked")
    setRedirectCreateRoom(true);
  }

  async function handleClick(id,name,i){
    if(!localStorage.getItem(ACCESS_TOKEN_NAME))
      setRedirectLogin(true)

    setLoading(true);
    localStorage.setItem("chatRoomId", id);
    localStorage.setItem("chatRoomName", name);
    let token = localStorage.getItem(ACCESS_TOKEN_NAME)
    try{
      await joinChatRoom(id, token);
      setRedirect(true);
    }catch(err){
      console.log("joinChatRoom error")
      console.log(err)
      localStorage.removeItem(ACCESS_TOKEN_NAME)
      setLoading(false);
      setRedirectLogin(true)
    }
  }

  if (redirect) {
    return <Redirect to="/chatroom" />;
  }
  if(redirectLogin){
    return <Redirect to='/login' />
  }
  if(redirectCreateRoom){
    return <Redirect to='/createroom' />
  }
  return (

    <div className="home-page">

        <div className="container-fluid h-100 mt-5">
          <div className="row justify-content-center h-100">
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
                    <div className="card-footer">

                        <div className="text-center">
                          <img onClick={() => createRoomHandler() } className="rounded-circle create-room" src={addIcon}  alt="Create Chat Room" width="60" height="60" />
                        </div>

                    </div>
                </div>
            </div>
          </div>
        </div>

    </div>
  );
}
export default HomePage;