/**
 * userMapper.js
 * Handles mapping between Prisma models and API DTOs.
 */

const toUserResponse = (user) => {
  if (!user) return null;

  const profile = user.role === 'CLIENT' ? user.client : user.artisan;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: profile ? {
      ...profile,
      userId: undefined, 
    } : null,
    createdAt: user.createdAt,
  };
};

const toAuthResponse = (user, token) => {
  return {
    message: 'Success',
    token,
    user: toUserResponse(user),
  };
};

/**
 * Maps registration data to Prisma repository format.
 * Ensures only allowed fields are passed to the repository.
 */
const toCreateUserRepo = (registerData) => {
  const { username, email, password, role, firstName, lastName, phone, businessName, bio, expertise } = registerData;
  return {
    username,
    email,
    password,
    role: role || 'CLIENT',
    firstName,
    lastName,
    phone,
    businessName,
    bio,
    expertise,
  };
};

/**
 * Maps update data to Prisma repository format.
 */
const toUpdateUserRepo = (updateData) => {
  const { email, username, firstName, lastName, phone, businessName, bio, expertise, role } = updateData;
  return {
    email,
    username,
    firstName,
    lastName,
    phone,
    businessName,
    bio,
    expertise,
    role,
  };
};

module.exports = {
  toUserResponse,
  toAuthResponse,
  toCreateUserRepo,
  toUpdateUserRepo,
};
