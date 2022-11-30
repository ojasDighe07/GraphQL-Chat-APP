import React, { Fragment, useEffect, useState } from "react";
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

const Input = () => {
  const { user } = useAuthState();
  const { users } = useMessageState();

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });
  const dispatch = useMessageDispatch();
  const [content, setContent] = useState("");
  const selectedUser = users?.find((u) => u.selected === true);

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      console.log('message sent')
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);
  // useEffect(() => {
  //   if (selectedUser && !selectedUser.messages) {
  //     getMessages({ variables: { from: selectedUser.username } });
  //   }
  //   if (messagesData) {
  //     console.log('here')
  //     dispatch({
  //       type: "SET_USER_MESSAGES",
  //       payload: {
  //         username: selectedUser.username,
  //         messages: messagesData.getMessages,
  //       },
  //     });
  //   }
  // }, [selectedUser,messagesData]);

  const submitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;
    setContent("");
    sendMessage({ variables: { to: selectedUser.username, content } });
    getMessages({ variables: { from: selectedUser.username } });
    // getMessages({ variables: { from: user.username } });
    window.alert('Message Sent')
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="type something"
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="send">
        <button onClick={submitMessage}>Send</button>
      </div>
    </div>
  );
};

export default Input;
