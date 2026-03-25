const Usermodel = require("../modals/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req,res) => { 
    const{username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const userExists = await Usermodel.findOne({$or:[{email},{username}]});
    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await Usermodel.create({username,email,password:hashedPassword});
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    return res.status(201).json({message:"User created successfully",user,token});
}


const loginUser = async (req,res) => {
    const{email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    // email parameter from frontend will contain either the actual email or username
    const user = await Usermodel.findOne({$or:[{email: email},{username: email}]});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid password"});
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    
    return res.status(200).json({message:"User logged in successfully",user,token});
}

module.exports = {registerUser, loginUser};