const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
var cors = require('cors')
const LocalStrategy = require('passport-local').Strategy;
const connection = require("./db/index");
const auth = require("./middleware/authenticateToken");

connection();

let bucket;
(() => {
    mongoose.connection.on("connected", () => {
        console.log('Creating bucket');
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "filesBucket",
        });
    });
})();

// Set up app
const app = express();

// Start server
app.listen(5000, () => {
    console.log('Server started on port 5000');
});

// Data models
const User = require('./models/User');
const File = require("./models/File");
const {Permission} = require("./models/Permission");


// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up cors
var corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

app.options('*', cors(corsOptions))

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/file');

// Set up routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/file', fileRoutes);

// Set up Passport
passport.use(new LocalStrategy((email, password, done) => {
    User.findOne({ email })
        .then(user => {
            if (!user) return done(null, false, { message: 'Incorrect email.' });
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) throw err;
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        })
        .catch(err => done(err));
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

// Download a file by id
app.get("/download/file/:fileId", auth, async (req, res) => {
    try {
        const { fileId } = req.params;

        const fileData = await File.findById(fileId).populate("user", "email");

        if (!fileData) {
            return res.status(404).json({ message: "File not found" });
        }

        // check if the logged in user has permission to download the file
        let permission = await Permission.find({fileId:fileData._id, userId:req.user.id}).where("status").in(["own"]);

        if(permission.length == 0){
            permission = await Permission.find({fileId:fileData._id, sharedUserId:req.user.id}).where("status").in(["accepted"]);
        }


        if(!permission || permission.length === 0){
            return res
                .status(401)
                .json({ message: "You do not have permission to download this file" });
        }

        const fileBucketId = fileData.fileBucketId;

        // Check if file exists
        const file = await bucket
            .find({ _id: new mongoose.Types.ObjectId(fileBucketId) })
            .toArray();
        if (file.length === 0) {
            return res.status(404).json({ error: { text: "File not found" } });
        }

        // set the headers
        res.set("Content-Type", file[0].contentType);
        res.set("Content-Disposition", `attachment; filename=${file[0].filename}`);

        // create a stream to read from the bucket
        const downloadStream = bucket.openDownloadStream(
            new mongoose.Types.ObjectId(fileBucketId)
        );

        // pipe the stream to the response
        downloadStream.pipe(res);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: { text: `Unable to download file`, error } });
    }
});