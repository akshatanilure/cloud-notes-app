const router = require("express").Router();
const Note = require("../models/note");
const auth = require("../middleware/auth");

// GET all notes
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD NOTE
router.post("/", auth, async (req, res) => {
  try {
    const newNote = new Note({ userId: req.user.id, title: req.body.title, content: req.body.content });
    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// DELETE NOTE
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.userId.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });
    await note.deleteOne();
    res.json({ message: "Note deleted" });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;