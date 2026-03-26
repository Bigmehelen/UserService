const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { client: true, artisan: true },
  });
};

const findByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
    include: { client: true, artisan: true },
  });
};

const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { client: true, artisan: true },
  });
};

const create = async (userData) => {
  const { role, firstName, lastName, phone, businessName, bio, expertise, ...baseData } = userData;

  return await prisma.user.create({
    data: {
      ...baseData,
      role,
      ...(role === 'CLIENT'
        ? {
            client: {
              create: {
                firstName,
                lastName,
                phone,
              },
            },
          }
        : {
            artisan: {
              create: {
                businessName,
                bio,
                expertise,
              },
            },
          }),
    },
    include: {
      client: true,
      artisan: true,
    },
  });
};

const update = async (id, updateData) => {
  const { email, username, firstName, lastName, phone, businessName, bio, expertise, role } = updateData;

  return await prisma.user.update({
    where: { id },
    data: {
      email,
      username,
      ...(role === 'CLIENT'
        ? {
            client: {
              update: {
                firstName,
                lastName,
                phone,
              },
            },
          }
        : {
            artisan: {
              update: {
                businessName,
                bio,
                expertise,
              },
            },
          }),
    },
    include: { client: true, artisan: true },
  });
};

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  create,
  update,
};
