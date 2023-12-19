import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"
import { Jwt } from "jsonwebtoken"

// const verifyJWT = asyncHandler(async(req, res, next) => {

// try {
//         // Extract token from cookie or Authorization header
//         const token = req.cookie?.accessToken || req.header
//         ("Authorization")?.replace("Bearer", "") 
    
//         if(!token){
//             throw new ApiError(401, "Unauthorized request")
//         }
    
//         // Verify the access token using the secret key
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
//         // Find user based on the decoded user ID from the token
//         const user = await User.findById(decodedToken?._id)
//         .select("-password -refreshToken")
    
//         if(!user){
//             throw new ApiError(401, "Access Token Invalid")
//         }
    
//         // Attach the user to the request for further use in subsequent middleware/routes
//         req.user = user
//         next()

// } catch (error) {
//     throw new ApiError(402, error?.message || "Access Token Invalid")
// }

// })

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
      let token;
  
      // Extract token from cookie or Authorization header
      if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
      } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        throw new ApiError(401, 'Unauthorized request');
      }
  
      // Verify the access token using the secret key
      const decodedToken = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);
  
      // Find user based on the decoded user ID from the token
      const user = await User.findById(decodedToken._id).select('-password -refreshToken');
  
      if (!user) {
        throw new ApiError(401, 'Access Token Invalid');
      }
  
      // Attach the user to the request for further use in subsequent middleware/routes
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access Token Expired');
      }
      throw new ApiError(401, error.message || 'Access Token Invalid');
    }
  });


export {verifyJWT}