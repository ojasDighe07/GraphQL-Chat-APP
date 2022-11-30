import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import "../style.scss";
import { useNavigate } from "react-router-dom";

const REGISTER_USER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      username
      email
      createdAt
    }
  }
`;

const Register = () => {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (data) => {
     
      window.alert("Registration Successful");
      navigate("./login");
    
  },
    onError: (err) => setErrors(err),
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();
    registerUser({ variables });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Register </span>
        <form>
          <input
            type="text"
            placeholder="display name"
            onChange={(e) =>
              setVariables({ ...variables, username: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="email"
            onChange={(e) =>
              setVariables({ ...variables, email: e.target.value })
            }
          ></input>
          <input
            type="password"
            placeholder="password"
            onChange={(e) =>
              setVariables({ ...variables, password: e.target.value })
            }
          ></input>
          <button>Sign Up</button>
        </form>
        <p>
          Do you have an account ? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
