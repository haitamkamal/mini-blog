const express = require('express');
const path = require("path");
const fileUpload = require('express-fileupload')
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const passport = require('./config/passportConfig'); 
const authorRouter = require('./routes/authorRouter');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }  
}));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.initialize());
app.use(passport.session());



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/",authorRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
