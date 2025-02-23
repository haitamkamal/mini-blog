const { Router } = require('express')
const passport = require('passport')
const authorRouter = Router()
const { registerUser } =  require('../db/query')






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
authorRouter.get("/sign-up",(req,res)=>{
  res.render("signUp")
})

authorRouter.post("/sign-up", async (req, res) => {
  const {name, email, password } = req.body;
  console.log(req.body);
 await registerUser(name,email, password);
 res.redirect("/")
});

authorRouter.get("/Home",(req,res)=>{
  res.render("Home")
})

module.exports = authorRouter;