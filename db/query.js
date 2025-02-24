const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");


const prisma = new PrismaClient();

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const registerUser = async (name, email, password,uploadedFileName=null) => {
 
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
              image: uploadedFileName || "default-profile.jpg",
          },
        },
      },
      include: {
        profile: true, 
      },
    });
      console.log("new user created:",newUser)
      
    return { message: "User registered", user: newUser };
 
};

const registerPost = async (title, content, uploadedFileName = null, authorId) => {
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      image: uploadedFileName,
      author: {   
        connect: { 
          id: authorId, 
        },
      },
    },
  });
  console.log("New Post created:", newPost);
  return { message: "Post registered", post: newPost };
};


const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};


const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};


module.exports = { 
  registerUser, 
  getUserByEmail,
   getUserById ,
    registerPost
  };
