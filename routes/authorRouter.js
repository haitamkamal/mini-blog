const { Router } = require('express')
const passport = require('passport')
const authorRouter = Router()
const { registerUser } =  require('../db/query')
const { updateProfileImage } = require('../Controllers/authorController');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


authorRouter.get("/",(req,res)=>{
  res.render("index")
})

authorRouter.get("/log-in",(req,res)=>{
  res.render("login")
})
authorRouter.post(
  "/log-in",
  passport.authenticate("local",{
    successRedirect:"/Home",
    failureRedirect:"/log-in",
  })
);
authorRouter.get("/log-out",(req,res,next)=>{
    req.logOut((err)=>{
      if(err){
        return next(err);
      }
      res.redirect("/");
    })
})
authorRouter.get("/sign-up",(req,res)=>{
  res.render("signUp")
})

authorRouter.post("/sign-up", async (req, res) => {
  const {name, email, password } = req.body;
  console.log(req.body);
 await registerUser(name,email, password);
 res.redirect("/")
});

authorRouter.get("/Home", async (req, res) => {
    if (!req.user) {
      return res.render("home", { user: null });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true }, 
    });
    res.render("home", { user });
});


authorRouter.get("/manage-account",(req,res)=>{
  res.render("manageAccout", { user: req.user });
})
authorRouter.post("/update-profile-image", updateProfileImage);

module.exports = authorRouter;