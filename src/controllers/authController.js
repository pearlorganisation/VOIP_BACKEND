import { COOKIE_OPTIONS } from "../../constants.js";
import User from "../models/user.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//SIGNUP Controller
export const signup = asyncHandler(async (req, res, next) => {
  const { email, ...other } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError("User already exits", 400));
  }
  const newUser = await User.create({ email, ...other });
  if (!newUser) {
    return next(new ApiError("User is not created", 400));
  }
  const responseData = {
    id: newUser._id,
    email: newUser.email,
    name: newUser.fullName,
  };
  return res
    .status(201)
    .json(new ApiResponse("User register successfully", responseData, 201));
});

//LOGIN Controller
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    return next(new ApiError("All fields are required", 400));
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new ApiError("No user found", 400));

  const isValidPassword = await existingUser.isPasswordCorrect(password);

  if (!isValidPassword) {
    return next(new ApiError("Wrong password", 400));
  }

  const access_token = existingUser.generateAccessToken();
  const refresh_token = existingUser.generateRefreshToken();

  existingUser.refreshToken = refresh_token;
  await existingUser.save({ validateBeforeSave: false });
  res
    .cookie("access_token", access_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), //1day set 15min later on
    })
    .cookie("refresh_token", refresh_token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15day
    })
    .status(200)
    .json({ success: true, message: "Logged in successfully" });
});
