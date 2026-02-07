const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Application = require("../models/application.js");
const FollowUp = require("../models/followUp.js");
const CheckIn = require("../models/checkIn.js");
const router = express.Router();

//POST /applications
router.post('/', verifyToken, async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const application = await Application.create(req.body);
    application._doc.userId = req.user;

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//GET /applications
router.get('/', verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('userId', 'username')
      .sort({ createdAt: 'desc' });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//GET /applications/:appId
router.get('/:appId', verifyToken, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId)
      .populate('userId', 'username');

    if (!application) {
      return res.status(404).json({ err: 'Application not found.' });
    }

    if (!application.userId._id.equals(req.user._id)) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    let followUps = [];
    let checkIns = [];

    if (application.status === "working") {
      checkIns = await CheckIn.find({
        applicationId: application._id,
        userId: req.user._id,
      }).sort({ createdAt: "desc" });
    } else {
      followUps = await FollowUp.find({
        applicationId: application._id,
        userId: req.user._id,
      }).sort({ createdAt: "desc" });
    }

    res.status(200).json({ application, followUps, checkIns });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//PUT /applications/:appId
router.put('/:appId', verifyToken, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ err: 'Application not found.' });
    }

    if (!application.userId.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.appId,
      req.body,
      { new: true, runValidators: true }
    );
    updatedApplication._doc.userId = req.user;

    res.status(200).json(updatedApplication);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//DELETE /applications/:appId
router.delete('/:appId', verifyToken, async ( req, res) => {
    try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ err: "Application not found." });
    } 
     if (!application.userId.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
    }

     const deletedApplication = await Application.findByIdAndDelete(req.params.appId);
    res.status(200).json(deletedApplication);

    } catch (err) {
    res.status(500).json({ err: err.message });
    }
})

// //POST /applications/:appId/check-ins
// router.post('/:appId/check-ins', verifyToken, async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.appId);
    
//     if (!application) {
//       return res.status(404).json({ err: "Application not found." });
//     }
    
//     if (!application.userId.equals(req.user._id)) {
//       return res.status(403).json({ err: "Unauthorized" });
//     }

//     const CheckIn = require("../models/checkIn.js");
//     const checkIn = await CheckIn.create({
//       applicationId: req.params.appId,
//       userId: req.user._id,
//       ...req.body
//     });

//     res.status(201).json(checkIn);
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// });

// //GET /applications/:appId/check-ins
// router.get('/:appId/check-ins', verifyToken, async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.appId);
    
//     if (!application) {
//       return res.status(404).json({ err: "Application not found." });
//     }
    
//     if (!application.userId.equals(req.user._id)) {
//       return res.status(403).json({ err: "Unauthorized" });
//     }

//     const CheckIn = require("../models/checkIn.js");
//     const checkIns = await CheckIn.find({ applicationId: req.params.appId })
//       .sort({ createdAt: 'desc' });

//     res.status(200).json(checkIns);
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// });


module.exports = router;