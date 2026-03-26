const formatAuthResponse = (user, token) => {
  return {
    message: 'Success',
    token,
    user: formatUser(user),
  };
};

const formatUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.role === 'CLIENT' ? user.client : user.artisan,
  };
};

module.exports = {
  formatAuthResponse,
  formatUser,
};
