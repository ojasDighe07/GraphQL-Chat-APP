import React from "react";
import Input from "./Input";
import Messages from "./Messages";
import func from "../functions/getimg";
import { useMessageDispatch, useMessageState } from "../context/message";
import { useAuthDispatch, useAuthState } from "../context/auth";

const Chat = () => {
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true);
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{selectedUser?.username}</span>
        <div className="chatIcons">
          <img src={func()} alt="" />
          <img src={func()} alt="" />
          <img src={func()} alt="" />
        </div>
      </div>
      <Messages />
      {/* <Input /> */}
    </div>
  );
};

export default Chat;
