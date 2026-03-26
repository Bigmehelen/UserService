const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../utils/token');
const { formatAuthResponse, formatUser } = require('../dtos/authDto');

const register = async (userData) => {
  const { username, email, password } = userData;

  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  const existingUsername = await userRepository.findByUsername(username);
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await userRepository.create({
    ...userData,
    password: hashedPassword,
  });

  const token = generateToken(user.id, user.role);
  return formatAuthResponse(user, token);
};

const login = async (username, password) => {
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id, user.role);
  return formatAuthResponse(user, token);
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return formatUser(user);
};

const updateProfile = async (userId, updateData) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await userRepository.update(userId, updateData);
  return formatUser(updatedUser);
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
