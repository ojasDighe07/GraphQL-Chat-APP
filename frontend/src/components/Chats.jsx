import React from "react";
import { gql, useQuery } from "@apollo/client";
import "../style.scss";
import { trimString } from "../functions/functions";
import { useMessageDispatch, useMessageState } from "../context/message";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      latestMessage {
        content
        createdAt
      }
    }
  }
`;

const Chats = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      console.log(data);
      dispatch({ type: "SET_USERS", payload: data.getUsers });
    },
    onError: (err) => console.log(err, "here"),
  });

  return (
    <div className="chats">
      {users && users.length > 0 && users.map((user) => {
        const selected = selectedUser === user.username;
        return (
          <div
            key={user.username}
            className="userChat"
            onClick={() =>
              dispatch({ type: "SET_SELECTED_USER", payload: user.username })
            }
          >
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt=""
            />
            <div className="userChatInfo">
              <span>{user.username}</span>
              <p>
                {user?.latestMessage?.content &&
                  trimString(user?.latestMessage?.content)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
