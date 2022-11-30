import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../context/auth";


const Navbar = () => {
  const authDispatch = useAuthDispatch();
  const { user } = useAuthState();
  const navigate = useNavigate();

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    navigate("./login");
  };

  return (
    <div className="navbar">
      <span className="logo">GraphQL-Chat</span>
      <div className="user">  
        <img src="" alt="" />
        <span>{user?.username}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar