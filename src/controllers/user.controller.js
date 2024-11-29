import jwt from "jsonwebtoken"
import { ErrorAPI } from '../utils/ErrorAPI.js';
import { User } from '../models/userSchema.js';
import { ResponseAPI } from '../utils/ResponseAPI.js';
import { AsyncWrap } from '../utils/AsyncWrap.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateRefreshAccess = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    const newUser = await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ErrorAPI(400, 'unable to generate Refresh and Access Token');
  }
};

//? userRegistration Api
const userRegistration = AsyncWrap(async (req, res) => {
  //get all  user info from frontend
  const { username, fullname, email, password, DOB } = req.body;
  //check if required user field are receive or not

  if (
    [username, fullname, email, password, DOB].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ErrorAPI(400, 'All Field required , Some Fields are Missing ,');
  }
  //check if user with the same email/username exist in the data base or not
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ErrorAPI(400, 'User with this Username or Email Already Exist');
  }

  // create user & save in the database

  const user = await User.create({
    username: username.toLowerCase(),
    password,
    email,
    fullname,
    DOB,
  });

  // send response in the frontend
  const userFromDb = await User.findOne(user._id).select(
    '-password -refreshToken'
  );

  res
    .status(200)
    .json(
      new ResponseAPI(200, { user: userFromDb }, 'User Registered Successfully')
    );
});
//! Login Api
const userLogin = AsyncWrap(async (req, res) => {
  //get user detail from body
  const { username, password } = req.body;
  if (!(username && password)) {
    throw ErrorAPI(400, 'Username Or Password is Missing');
  }
  // check if user exist in database or not
  const user = await User.findOne({ username });

  if (!user) {
    throw new ErrorAPI(400, 'User is Not Registered');
  }
  // check if password is correct or not
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  // console.log(`controller :${isPasswordCorrect}`);

  if (isPasswordCorrect === false) {
    throw new ErrorAPI(400, 'Password is Incorrect');
  }

  //generate access and refresh token
  const { accessToken, refreshToken } = await generateRefreshAccess(user._id);

  // send Response API with cookie

  const loggedUser = await User.findOne(user._id).select(
    '-password -refreshToken'
  );

  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ResponseAPI(
        200,
        { user: loggedUser, accessToken },
        'User Logged In'
      )
    );
});

//?get currentUser Api
const getCurrentUser = AsyncWrap(async (req, res) => {
  const userId = req.user._id
  const user = await User.findById(userId).select('-password -refreshToken')
  console.log(user)
  res.status(200).json(new ResponseAPI(200, user, "User Found"))
})

//*new AccessToken Api
const getAccessToken = AsyncWrap(async (req, res) => {
  const refreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new ErrorAPI(403, "Can not get refresh Token")
  }
  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  if (!payload._id) {
    throw new ErrorAPI(500, "JWT Verify Error")
  }

  const user = await User.findById(payload._id).select('-password -refreshToken')
  if (!user) {
    throw new ErrorAPI(500, "Cloud not Find User in DataBase")
  }

  const accessToken = await user.generateAccessToken()

  res.json(new ResponseAPI(200, { user, accessToken: accessToken }, "AccessToken Generated"))

})

//& get All Users 
const getUsers = AsyncWrap(async (req, res) => {
  const users = await User.find().select('-password -refreshToken')

  if (!users) {
    throw new ErrorAPI(401, "Can Not Send Users")
  }
  res.json(new ResponseAPI(200, users, "Successful"))
})
//~ Logout Api
const userLogOut = AsyncWrap(async (req, res) => {
  const id = req.user._id;
  const user = await User.findByIdAndUpdate(
    id,
    {
      $unset: {
        refreshToken: 1, //& this removes the field form document
      },
    },
    {
      new: true,
    }
  );
  console.log(user)
  const option = {
    httpOnly: true,
    secure: true,
  };
  res.status(200).clearCookie("refreshToken", option).json(new ResponseAPI(200, null, "User LogOut"))
})

//^ update User 
const updateUserInfo = AsyncWrap(async (req, res) => {
  const userId = req.user._id;
  const { username, fullname, email } = req.body;
  console.log(username)

  const newUser = {
    username: username,
    fullname: fullname,
    email: email,
  }

  console.log(userId)

  const updatedUser = await User.findByIdAndUpdate({ _id: userId }, { ...newUser }, { new: true }).select('-password -refreshToken')

  if (!updatedUser) {
    throw new ErrorAPI(500, "User not updated")
  }
  res.status(200).json(new ResponseAPI(200, updatedUser, "UserInfo Updated"))
})

//% Update Avatar
const updateAvatar = AsyncWrap(async (req, res) => {
  try {
    // get sended file
    const id = req.user._id;
    const avatarPath = req.file.path;

    if (!avatarPath) {
      throw new ErrorAPI(404, "Did'nt got Profile Picture")
    }
    const avatar = await uploadOnCloudinary(avatarPath)
    // upload on cloudinary
    if (!avatar) {
      throw new ErrorAPI(503, "Profile Picture Could'nt be Uploaded")
    }

    // find the user
    const user = await User.findByIdAndUpdate({ _id: id }, { "avatar": avatar.url }, { new: true }).select('-password -refreshToken')

    console.log(user.avatar)
    if (!user) {
      throw new ErrorAPI(503, "Profile Picture Could'nt be Uploaded In DB")
    }

    res.status(200).json(new ResponseAPI(200, user, "Profile Picture uploaded"))

  } catch (error) {
    throw new ErrorAPI(500, error.message)
  }
})

//?Update Cover
const updateCover = AsyncWrap(async (req, res) => {

  // get sended file
  const id = req.user._id;
  const coverPath = req.file.path;
  if (!coverPath) {
    throw new ErrorAPI(404, "Did'nt got Cover Image")
  }
  const cover = await uploadOnCloudinary(coverPath)
  // upload on cloudinary
  if (!cover) {
    throw new ErrorAPI(503, "Cover Image Could'nt be Uploaded")
  }
  // find the user
  const user = await User.findByIdAndUpdate({ _id: id }, { "coverImage": cover.url }, { new: true }).select('-password -refreshToken')
  if (!user) {
    throw new ErrorAPI(503, "Cover Image Could'nt be Uploaded In DB")
  }
  res.status(200).json(new ResponseAPI(200, user, "Cover Image uploaded"))

})


export { userRegistration, userLogin, getAccessToken, getUsers, userLogOut, updateUserInfo, updateAvatar, updateCover, getCurrentUser };
