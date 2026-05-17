import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { ApiError } from '../utils/ApiError';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'sales',
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      },
    });
  } else {
    throw new ApiError(400, 'Invalid user data');
  }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await (user as any).matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      },
    });
  } else {
    throw new ApiError(401, 'Invalid email or password');
  }
});

export const getMe = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    throw new ApiError(404, 'User not found');
  }
});
