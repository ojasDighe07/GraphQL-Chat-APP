import React ,{useEffect} from "react";
import Chat from "../components/Chat";
import { useAuthDispatch, useAuthState } from '../context/auth'
import { useMessageDispatch } from '../context/message'
import Sidebar from "../components/Sidebar";
import { gql, useSubscription } from '@apollo/client'


const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`

const Home = () => {
  const authDispatch = useAuthDispatch()
  const messageDispatch = useMessageDispatch()
  const { user } = useAuthState()
  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  )

  useEffect(() => {
    if (messageError) console.log(messageError)

    if (messageData) {
      const message = messageData.newMessage
      const otherUser = user.username === message.to ? message.from : message.to

      messageDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          username: otherUser,
          message,
        },
      })
    }
  }, [messageError, messageData])

  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
