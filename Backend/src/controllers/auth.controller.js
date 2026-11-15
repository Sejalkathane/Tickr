const express = require("express");
const jwt = require("jsonwebtoken"); // Import JWT library to generate authentication tokens
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");


async function registerUser(req,res){
   try{
    const {name , email , password} =req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    const isUserAlreadyExist = await userModel.findOne({email});
    if(isUserAlreadyExist){
        return res.status(400).json({message:"User Already Exists"})
    }

        // 3. Hash the password
    const hash = await bcrypt.hash(password, 10);

    // 4. Save the new user
    const user = await userModel.create({
      name,
      email,
      password: hash
    });

    const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });

      res.cookie("token", token);
res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
   }catch(error){
    res.status(500).json({message:error.message});
   }
}


// Login an existing user
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Check that both fields are sent
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare the typed password with the hashed one
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Create the token (valid for 7 days)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // 5. Store the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 6. Send the response (never send the password back)
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Logout the user
async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser
};
