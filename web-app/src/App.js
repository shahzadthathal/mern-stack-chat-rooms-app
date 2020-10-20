import React, {useState}from "react";
import { Router, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import TopBar from "./components/TopBar/TopBar";
import { createBrowserHistory as createHistory } from "history";
import "./App.css";
import ChatRoomPage from "./components/ChatRoomPage/ChatRoomPage";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import CreateRoom from "./components/CreateRoom/CreateRoom";
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';

import PrivateRoute from './utils/PrivateRoute';


const history = createHistory();
function App() {

  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);

  return (
    <div className="App">
      <Router history={history}>
        <TopBar />
        <Route path="/" exact component={HomePage} />
        <Route path="/chatroom" exact component={ChatRoom} />
        <Route path="/chatroompage" exact component={ChatRoomPage} />
        
        <PrivateRoute path="/createroom">
          <CreateRoom/>
        </PrivateRoute>

        <PrivateRoute path="/profile">
            <Profile/>
        </PrivateRoute>

        <Route path="/signup">
          <Register updateTitle={updateTitle}/>
        </Route>
        <Route path="/login">
          <Login updateTitle={updateTitle}/>
        </Route>

      </Router>
    </div>
  );
}
export default App;