import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";
import "../style.scss"
const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

const Login = () => {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const navigate = useNavigate();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted(data) {
      console.log("Login Successful");
      dispatch({ type: "LOGIN", payload: data.login });
      navigate("../");
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();
    loginUser({ variables });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Login </span>
        <form>
          <input
            type="text"
            placeholder="Enter Username"
            onChange={(e) =>
              setVariables({ ...variables, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) =>
              setVariables({ ...variables, password: e.target.value })
            }
          />
          <button onClick={submitLoginForm}>Login</button>
        </form>
        <p>
          Don't have an account ?<Link to="/register">Sign Up</Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
