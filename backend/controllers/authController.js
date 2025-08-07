import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-email-password'
  }
});


const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};


const getVerificationUrl = (token) => {
 
  const baseUrl = process.env.PUBLIC_URL || process.env.CLIENT_URL || 'http://localhost:5173';
  
  
  return `${baseUrl}/verify-email?token=${token}`;
};


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    

    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    

    const user = new User({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });
    
    await user.save();
    
   
    try {
     
      const verificationUrl = getVerificationUrl(verificationToken);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Vision Quest - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #6a11cb; text-align: center;">Welcome to Vision Quest!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: linear-gradient(to right, #6a11cb, #2575fc); color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">Verify Email</a>
            </div>
            <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #6a11cb;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not sign up for Vision Quest, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888;">
              <p>Vision Quest - Student Management System</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
    
    }
    
    
    const userWithoutSensitiveInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    };
    
    res.status(201).json({ 
      message: 'User created successfully. Please check your email to verify your account.', 
      user: userWithoutSensitiveInfo 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error during signup', error: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
    

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    
    await user.save();
    
    res.status(200).json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        databaseError: true
      });
    }
    

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        needsVerification: true
      });
    }
    

    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    

    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    };
    
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    

    if (error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({
        message: 'Database connection issue. Please try again later.',
        error: 'Connection error',
        retryable: true
      });
    }
    
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};


export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }
    
 
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    
    await user.save();
    

    try {

      const verificationUrl = getVerificationUrl(verificationToken);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Vision Quest - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #6a11cb; text-align: center;">Email Verification</h2>
            <p>Hello ${user.name},</p>
            <p>You requested a new verification email. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: linear-gradient(to right, #6a11cb, #2575fc); color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">Verify Email</a>
            </div>
            <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #6a11cb;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888;">
              <p>Vision Quest - Student Management System</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (emailError) {
      console.error('Error resending verification email:', emailError);
      res.status(500).json({ message: 'Error resending verification email', error: emailError.message });
    }
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Error resending verification email', error: error.message });
  }
};


export const verifyToken = async (req, res) => {
  try {
   
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    };
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
};
  
