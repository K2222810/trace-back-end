const express = require('express');
const verifyToken = require("../middleware/verify-token.js");
const Application = require("../models/application.js");
const CheckIn = require("../models/checkIn.js");
const router = express.Router({ mergeParams: true });


//POST /applications/:appId/check-ins
router.post('/', verifyToken, async (req, res) => {
  try {
     const { appId } = req.params;

    const application = await Application.findById(appId);
    
    if (!application) {
      return res.status(404).json({ err: "Application not found." });
    }
    
    if (!application.userId.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const checkIn = await CheckIn.create({
      applicationId: appId,
      userId: req.user._id,
      ...req.body
    });

    res.status(201).json(checkIn);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//GET /applications/:appId/check-ins
router.get('/', verifyToken, async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId);
    
    if (!application) {
      return res.status(404).json({ err: "Application not found." });
    }
    
    if (!application.userId.equals(req.user._id)) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const checkIns = await CheckIn.find({
      applicationId: appId,
      userId: req.user._id, 
    }).sort({ createdAt: "desc" });

    res.status(200).json(checkIns);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//PUT/applications/:appId/check-ins/:checkInId
router.put("/:checkInId", verifyToken, async (req, res) => {
  try {
    const { appId, checkInId } = req.params;

    const application = await Application.findById(appId);
    if (!application) {
        return res.status(404).json({ err: "Application not found." });
    }

    if (!application.userId.equals(req.user._id)) {
        return res.status(403).json({ err: "Unauthorized" });
    }

    const updatedCheckIn = await CheckIn.findOneAndUpdate(
      { _id: checkInId, 
        applicationId: appId,
        userId: req.user._id },
        req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCheckIn) {
      return res.status(404).json({ err: "Check-in not found." });
    }

    res.status(200).json(updatedCheckIn);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//DELETE /applications/:appId/check-ins/:checkInId
router.delete("/:checkInId", verifyToken, async (req, res) => {
  try {
    const { appId, checkInId } = req.params;

    const application = await Application.findById(appId);
    if (!application) {
        return res.status(404).json({ err: "Application not found." });
    }

    if (!application.userId.equals(req.user._id)) {
        return res.status(403).json({ err: "Unauthorized" });
    }

    const deletedCheckIn = await CheckIn.findOneAndDelete({
      _id: checkInId,
      applicationId: appId,
      userId: req.user._id,
    });

    if (!deletedCheckIn) {
      return res.status(404).json({ err: "Check-in not found." });
    }

    res.status(200).json(deletedCheckIn);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;