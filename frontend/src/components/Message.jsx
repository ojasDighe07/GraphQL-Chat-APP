import React, { useState } from "react";
import { useAuthState } from "../context/auth";
import classNames from "classnames";

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;

  return (
    <div className="message">
      <div className="messageInfo">
        <img src="" alt="" />
        <span>Just now</span>
      </div>
      <div className="messageContent">
        <p>{message?.content}</p>
      </div>
    </div>
  );
};

export default Message;
