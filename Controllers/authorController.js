const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const updateProfileImage = async (req, res) => {
  const userId = req.user.id;

  // Check if the user already has a profile, create it if not
  let profile = await prisma.profile.findUnique({ where: { userId: userId } });

  if (!profile) {
    // Create a default profile if it doesn't exist
    profile = await prisma.profile.create({
      data: {
        userId: userId,
        bio: "No bio yet", // Set a default bio
        image: "default-profile.jpg", // Default image
      },
    });
  }

  // Check if file is uploaded
  if (!req.files || !req.files.profileImage) {
    return res.status(400).send("No image uploaded");
  }

  const uploadedFile = req.files.profileImage;

  try {
    // Convert image to Base64
    const imageBase64 = uploadedFile.data.toString('base64');
    const imageMimeType = uploadedFile.mimetype;

    // Update the profile image in the database (as Base64 string)
    await prisma.profile.update({
      where: { userId: userId },
      data: { 
        image: `data:${imageMimeType};base64,${imageBase64}` // Store Base64 data in DB
      },
    });

    res.redirect("/manage-account");
  } catch (err) {
    console.error("Error updating profile image:", err.message);
    res.status(500).send("Error updating profile image");
  }
};

module.exports = { updateProfileImage };
