import React, { Fragment, useEffect, useState } from "react";
import Message from "./Message";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useAuthDispatch, useAuthState } from "../context/auth";
import { useMessageDispatch, useMessageState } from "../context/message";

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

const Messages = () => {
  const { user } = useAuthState();
  const { users } = useMessageState();

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES, {
      fetchPolicy: "no-cache",
      nextFetchPolicy : "cache-and-network"
    });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });
  const dispatch = useMessageDispatch();
  const [content, setContent] = useState("");
  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      console.log("message sent");
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  const submitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;
    setContent("");
    sendMessage({ variables: { to: selectedUser.username, content } });
    getMessages({ variables: { from: selectedUser.username } });
  };
  return (
    <>
      <div className="messages">
        {messages &&
          messages.length > 0 &&
          messages.map((message, index) => (
            <div key={message.uuid}>
              <Message message={message} />
            </div>
          ))}
      </div>
      <div className="input">
        <input
          type="text"
          placeholder="type something"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <div className="send">
          <button onClick={submitMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Messages;
