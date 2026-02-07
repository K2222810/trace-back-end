const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const FollowUp = require("../models/followUp.js");
const Application = require("../models/application.js");
const router = express.Router();

//POST /follow-ups
router.post('/', verifyToken, async (req, res) => {
  try {
    const application = await Application.findById(req.body.applicationId);
    
    if (!application) {
      return res.status(404).json({ err: "Application not found." });
    }
    
    if (!application.userId.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const followUp = await FollowUp.create({
      applicationId: req.body.applicationId,
      userId: req.user._id,
      dueDate: req.body.dueDate,
      note: req.body.note,
      isDone: req.body.isDone
    });

    res.status(201).json(followUp);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//GET /follow-ups (get all follow-ups for logged in user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const followUps = await FollowUp.find({ userId: req.user._id })
      .populate('applicationId')
      .sort({ createdAt: 'desc' });

    res.status(200).json(followUps);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//PUT /follow-ups/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    
    if (!followUp) {
      return res.status(404).json({ err: "Follow-up not found." });
    }
    
    if (!followUp.userId.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const updatedFollowUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedFollowUp);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//DELETE /follow-ups/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    
    if (!followUp) {
      return res.status(404).json({ err: "Follow-up not found." });
    }
    
    if (!followUp.userId.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    await FollowUp.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Follow-up deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
