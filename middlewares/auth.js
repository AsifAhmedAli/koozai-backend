const jwt = require("jsonwebtoken");

// function authMiddleware(req, res, next) {
//   // Get the token from the header
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   // Verify the token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log(decoded)
//     req.user = decoded;
    
   
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Token is not valid" });
//   }
// }






function authForUser(req, res, next) {
  // // Get the access token from the cookie
  // const accessToken = req.cookies.user_token;

  // if (!accessToken) {
  //   return res.status(401).json({ message: "No token, authorization denied" });
  // }

  // // Get the token from the Authorization header
  // const authorizationHeader = req.header("Authorization");
  // const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

  // if (accessToken !== tokenFromHeader) {
  //   return res.status(401).json({ message: "Invalid token in Authorization header" });
  // }

  // // Verify the access token
  // try {
  //   const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  //   req.user = decoded;

  //   next();
  // } catch (error) {
  //   if (error.name === "TokenExpiredError") {
  //     return res.status(401).json({ message: "Access token has expired" });
  //   }
  //   res.status(400).json({ message: "Access token is not valid" });
  // }


 // Get the access token from the cookie

 const authorizationHeader = req.header("Authorization");
 const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

 const accessToken = authorizationHeader?.replace("Bearer ", "");

 if (!accessToken) {
   return res.status(401).json({ message: "No token, authorization denied" });
 }

 // Get the token from the Authorization header
//  const authorizationHeader = req.header("Authorization");
//  const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

  const token_from_cookies = req.cookies.user_token;

//  if (token_from_cookies !== tokenFromHeader) {
//    return res.status(401).json({ message: "Invalid token in Authorization header" });
//  }

 // Verify the access token
 try {
   const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
   req.user = decoded;

   next();
 } catch (error) {
   if (error.name === "TokenExpiredError") {
     return res.status(401).json({ message: "Access token has expired" });
   }
   res.status(400).json({ message: "Access token is not valid" });
 }

  
}





// @@@ Auth for Admin



function authForAdmin(req, res, next) {
  // // Get the access token from the cookie
  // const accessToken = req.cookies.admin_token;

  // if (!accessToken) {
  //   return res.status(401).json({ message: "No token, authorization denied" });
  // }

  // // Get the token from the Authorization header
  // const authorizationHeader = req.header("Authorization");
  // const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

  const authorizationHeader = req.header("Authorization");
 const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

 const accessToken = authorizationHeader?.replace("Bearer ", "");

 if (!accessToken) {
   return res.status(401).json({ message: "No token, authorization denied" });
 }


  // if (accessToken !== tokenFromHeader) {
  //   return res.status(401).json({ message: "Invalid token in Authorization header" });
  // }
  const token_from_cookies = req.cookies.user_token;

  // Verify the access token
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_ADMIN);
    req.user = decoded;
    // console.log(req.user)

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired" });
    }
    res.status(400).json({ message: "Access token is not valid" });
  }
}






//  auth middleware for the admin



// function authForAdmin(req, res, next) {
//     // Get the access token from the cookie
//     const accessToken = req.cookies.admin_access_token;
  
//     if (!accessToken) {
//       return res.status(401).json({ message: "No token, authorization denied" });
//     }
  
//     // Get the token from the Authorization header
//     const authorizationHeader = req.header("Authorization");
//     const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");
  
//     if (accessToken !== tokenFromHeader) {
//       return res.status(401).json({ message: "Invalid token in Authorization header" });
//     }
  
//     // Verify the access token
//     try {
//       const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_ADMIN);
//       req.user = decoded;
  
//       next();
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         return res.status(401).json({ message: "Access token has expired" });
//       }
//       res.status(400).json({ message: "Access token is not valid" });
//     }
//   }
  
  





module.exports = { authForUser,authForAdmin};
