import { handleMakeError } from "../middleware/handleError.js";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) return next(handleMakeError(400, "User already exist"));

  if (password !== confirmPassword)
    return next(handleMakeError(400, "both passwords should be equal"));

  try {
    const newUser = new User({
      email,
      username,
      password,
    });

    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    });
  } catch (error) {
    console.log(error);
  }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const validUser = await User.findOne({ email });
      if (!validUser) return next(handleMakeError(404, "No user found!"));
  
      if (validUser && (await validUser.comparePassword(password))) {
        // const { accessToken, refreshToken } = generateTokens(validUser._id);
        // await storeRefreshToken(validUser._id, refreshToken);
        // setCookies(res, accessToken, refreshToken);
  
        // EXCLUDING THE PASSWORD WITH THIS METHOD INSTEAD OF .select("-password") is wild
        // JOKES ON YOU I CANT USE .select("-password") in this messy code because if i put that after User.FindOne - 
        // now i cant compare my password because it wouldnt work because there is no password to compare
        const { password: pass, ...rest } = validUser._doc;
        res.json(rest);
      } else {
        next(handleMakeError(400, "Invalid Credentials"));
      }
    } catch (error) {
      next(error);
      console.log("Error in sign-in controller");
    }
};
