const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const FollowUp = require("../models/followUp.js");
const Application = require("../models/application.js");
const router = express.Router({ mergeParams: true });

//POST /follow-ups
router.post('/', verifyToken, async (req, res) => {
  const appId = req.params.appId;
  try {
    const application = await Application.findById(appId);
    
    if (!application) {
      return res.status(404).json({ err: "Application not found." });
    }
    
    if (!application.userId.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const followUp = await FollowUp.create({
      applicationId: appId,
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
router.get("/", verifyToken, async (req, res) => {
  try {
    const appId = req.params.appId;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ err: "Application not found." });
    }

    if (!application.userId.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const followUps = await FollowUp.find({
      applicationId: appId,
      userId: req.user._id,
    }).sort({ createdAt: "desc" });

    res.status(200).json(followUps);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//PUT /follow-ups/:followUpId
router.put("/:followUpId", verifyToken, async (req, res) => {
  try {
    const { appId, followUpId } = req.params;

    const updatedFollowUp = await FollowUp.findOneAndUpdate(
      { _id: followUpId, applicationId: appId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFollowUp) {
      return res.status(404).json({ err: "Follow-up not found for this app/user." });
    }

    res.status(200).json(updatedFollowUp);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//DELETE /follow-ups/:followUpId
router.delete("/:followUpId", verifyToken, async (req, res) => {
  try {
    const { appId, followUpId } = req.params;

    const followUp = await FollowUp.findById(followUpId);

    if (!followUp) {
      return res.status(404).json({ err: "Follow-up not found." });
    }

    if (!followUp.userId.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    if (!followUp.applicationId.equals(appId)) {
      return res.status(400).json({ err: "Follow-up does not belong to this application." });
    }

    await FollowUp.findByIdAndDelete(followUpId);

    res.status(200).json({ message: "Follow-up deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
