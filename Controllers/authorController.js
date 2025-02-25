const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const { upgradeToAdmin } = require("../db/query");

const uploadDir = path.join(__dirname, "../public/uploads");

const updateProfileImage = async (req, res) => {

    const userId = req.user.id;
    console.log("User ID:", userId);

    const uploadedFile = req.files?.profileImage;
    if (!uploadedFile) {
      return res.status(400).send("No image uploaded");
    }

    console.log("Uploaded file details:", uploadedFile);

    const imagePath = `${Date.now()}_${uploadedFile.name}`; 
    const savePath = path.join(uploadDir, imagePath);

    console.log("Saving image to:", savePath);

    await new Promise((resolve, reject) => {
      uploadedFile.mv(savePath, (err) => {
        if (err) {
          console.error("Error moving file", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const existingProfile = await prisma.profile.findFirst({
      where: { userId: userId },
    });

    console.log("Existing profile:", existingProfile);

    let updatedProfile;
    if (!existingProfile) {
    
      updatedProfile = await prisma.profile.create({
        data: {
          userId: userId,
          image: imagePath, 
        },
      });
    } else {
      
      updatedProfile = await prisma.profile.update({
        where: { userId: userId },
        data: { image: imagePath }, 
      });
    }

    console.log("Updated profile record:", updatedProfile);
    res.redirect("/manage-account");
  
};
const registerPost = async (title, content, uploadedFileName = null) => {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        image: uploadedFileName || null, 
      },
    });
    console.log("New Post created:", newPost);
    return { message: "Post registered", post: newPost };
  
};

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const uploadedFile = req.files?.image;


  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const authorId = req.user.id; 

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  let uploadedFileName = null;

  if (uploadedFile) {
    uploadedFileName = Date.now() + "_" + uploadedFile.name;  
    const savePath = path.join(__dirname, "../public/uploads", uploadedFileName);
      await new Promise((resolve, reject) => {
        uploadedFile.mv(savePath, (err) => {
          if (err) {
            console.error("Error moving file:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
      console.log("File uploaded to:", savePath);
   
  }

  
    
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        image: uploadedFileName || null,
        author: {
          connect: { id: authorId },  
        },
      },
    });

    console.log("New post created:", newPost);
    res.status(201), { message: 'Post created successfully', post: newPost };
      res.redirect("/Home")
};

async function renderIndex(req, res) {

  const  posts = await prisma.post.findMany();
  console.log("fetched Posts :",{posts});
  res.render("viewPost",{posts});

}
async function deleteMsgs(req, res) {
    const postId =  parseInt (req.params.id);
    await prisma.post .delete({
      where:{id:postId},
    });
     console.log(`Post with ID ${postId} deleted.`);    
     res.redirect("/view-Post");
}


module.exports = { 
  createPost, 
  registerPost,
  updateProfileImage ,
  renderIndex,
  deleteMsgs,
};

