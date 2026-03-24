const Usermodel = require("../modals/usermodel");
const bcrypt = require("bcrypt");

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
    return res.status(201).json({message:"User created successfully",user});
}


const loginUser = async (req,res) => {
    const{email,password,username} = req.body;
    if(!email || !password || !username){
        return res.status(400).json({message:"All fields are required"});
    }
    const user = await Usermodel.findOne({$or:[{email},{username}]});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid password"});
    }
    return res.status(200).json({message:"User logged in successfully",user});
}

module.exports = {registerUser, loginUser};