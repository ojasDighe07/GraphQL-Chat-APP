const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");
const pubsub = require("./pubsub");

module.exports = async (context) => {
  // ctx is the graphql-ws Context where connectionParams live
  let token = null;
  context.user = null
  
  if (context.connectionParams.authToken) {
    // console.log('here ws')
    token = context.connectionParams.authToken.split("Bearer ")[1];
  }
 
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      // console.log(decodedToken,'ws')
      context.user = decodedToken;
    });
  }
  // Otherwise let our resolvers know we don't have a current user
  context.pubsub = pubsub;
  return context;
};
