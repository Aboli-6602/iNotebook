const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser").default;
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "this is a secret.";

// Router 1: GET all the notes of a particular user, Login required
router.get('/fetchnotes', (req, res, next) => {
    const token = req.header("auth-token");
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        res.send("Authenticate using a valid token");
    }


}, async (req, res) => {
    try {
        // console.log(req);
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.send("Internal Server Error")
    }

})

// Router 2: POST a note by a particular user, Login required
router.post('/addnote', [
    body('title', 'title should be atleast 5 characters long').isLength({ min: 5 }),
    body('content', 'content should be atleast 5 characters long').isLength({ min: 5 })
], (req, res, next) => {
    const token = req.header("auth-token");
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        // res.send(error.message);
        // res.send("Authenticate using a valid token");
        res.send(error.message);
    }
    }, async (req, res) => {
        try {

            const errors = validationResult(req);
            
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title, content, tag } = req.body;
            const note = new Note({
                title, content, tag, user:req.user.id
            })
            const addedNote = await note.save();
            res.send(addedNote);

        } catch (error) {
            console.log(error.message);
            res.send("Internal Server Error")
        }
    }
)

router.put('/updatenote/:noteID', (req, res, next) => {
    const token = req.header("auth-token");
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        res.send("Authenticate using a valid token");
    }


}, async (req, res) => {
    const note = await Note.findById(req.params.noteID);

    if (req.user.id != note.user) {
        return res.status(401).send("NOT ALLOWED");
    }

    if (!note) {
        return res.status(404).send("NOT FOUND");
    }

    if (req.body.title) { note.title = req.body.title; }
    if (req.body.content) { note.content = req.body.content; }
    if (req.body.tag) { note.tag = req.body.tag; }


    note.save();
    res.send(note);
})

router.delete('/deletenote/:noteID', (req, res, next) => {
    const token = req.header("auth-token");
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        res.send("Authenticate using a valid token");
    }


}, async (req, res) => {
    const note = await Note.findById(req.params.noteID);


    if (note) {
        if (req.user.id != note.user) {
            return res.status(401).send("NOT ALLOWED");
        }
    }
    else {
        return res.status(404).send("NOT FOUND");
    }


    // if(req.body.title){note.title = req.body.title;}
    // if(req.body.content){note.content = req.body.content;}
    // if(req.body.tag){note.tag = req.body.tag;}


    // note.save();
    await Note.findByIdAndDelete(req.params.noteID);
    res.send("Note Deleted");
})

module.exports = router;