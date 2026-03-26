const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../utils/token');
const userMapper = require('../mappers/userMapper');

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
    ...userMapper.toCreateUserRepo(userData),
    password: hashedPassword,
  });

  const token = generateToken(user.id, user.role);
  return userMapper.toAuthResponse(user, token);
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
  return userMapper.toAuthResponse(user, token);
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return userMapper.toUserResponse(user);
};

const updateProfile = async (userId, updateData) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await userRepository.update(userId, userMapper.toUpdateUserRepo(updateData));
  return userMapper.toUserResponse(updatedUser);
};

const upgradeToArtisan = async (userId, artisanData) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'ARTISAN' || user.artisan) {
    throw new Error('User is already an artisan or has an artisan profile');
  }

  const updatedUser = await userRepository.upgradeToArtisan(userId, artisanData);
  const token = generateToken(updatedUser.id, updatedUser.role);
  return userMapper.toAuthResponse(updatedUser, token);
};

module.exports = { register, login, getProfile, updateProfile, upgradeToArtisan };
