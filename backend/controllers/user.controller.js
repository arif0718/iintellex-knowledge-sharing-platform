import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import getDataUri from "../utils/datauri.js";
import isRealEmail from "../utils/isRealEmail.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, pleases check!",
        success: false,
      });
    }

    // Check if email is real
    const emailValid = await isRealEmail(email);
    if (!emailValid) {
      return res.status(400).json({
        message: "Please use a real and active email address",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: "Email already exists, try a different one",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account Created Successsfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Account is not registered!",
        success: true,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrrect Password!",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // populate each post if in the posts arrays
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post?.author?.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Loged out succesfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Send Reset Email Function
const sendResetEmail = async (toEmail, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.MY_EMAIL}`,
      pass: `${process.env.EMAIL_APP_PASS}`,
    },
  });

  const mailOptions = {
    from: `iintellex <${process.env.MY_EMAIL}>`,
    to: toEmail,
    subject: "Reset your iintellex password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 300000; // 5 min
  await user.save();

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  await sendResetEmail(email, resetLink);

  return res.status(200).json({ message: "Password reset email sent" });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return res.status(200).json({ message: "Password reset successful" });
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have users",
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const whoIsFollowing = req.id;
    const whomUFollowing = req.params.id;
    if (whoIsFollowing == whomUFollowing) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(whoIsFollowing);
    const targetUser = await User.findById(whomUFollowing);

    //check we have to follow or unfollow
    const isFollowing = user.following.includes(whomUFollowing); //includes use buz of arr instead of getbyid
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        //when we have to update more than one then we use promise
        User.updateOne(
          { _id: whoIsFollowing },
          { $pull: { following: whomUFollowing } }
        ),
        User.updateOne(
          { _id: whomUFollowing },
          { $pull: { followers: whoIsFollowing } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      //follow logic
      await Promise.all([
        //when we have to update more than one then we use promise
        User.updateOne(
          { _id: whoIsFollowing },
          { $push: { following: whomUFollowing } }
        ),
        User.updateOne(
          { _id: whomUFollowing },
          { $push: { followers: whoIsFollowing } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(10);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

