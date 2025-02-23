const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const registerUser = async (name, email, password) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio: "No bio yet",
            image: "default-profile.jpg", 
          },
        },
      },
      include: {
        profile: true, 
      },
    });
      console.log("new user created:",newUser)
      
    return { message: "User registered", user: newUser };
  } catch (error) {
    console.error(error);
    return { error: "Error creating user", details: error.message };
  }
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};


const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};


module.exports = { registerUser, getUserByEmail, getUserById };
