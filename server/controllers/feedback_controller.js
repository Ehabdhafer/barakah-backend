const feedbackmodel = require("../models/feedback_model");

// --------------------------------------------------get all feedbacks --------------------------------------

exports.getfeedback = async (req, res) => {
  try {
    const result = await feedbackmodel.getFeedbacks();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------post feedback --------------------------------------

exports.postfeedback = async (req, res) => {
  const { message } = req.body;
  const time = new Date();
  try {
    await feedbackmodel.postFeedback(message);
    res.status(201).json({ message: `Your Message has been sent` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// // --------------------------------------------------get feedback by id --------------------------------------

exports.feedbackid = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await feedbackmodel.getFeedbackById(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// // --------------------------------------------------delete feedback --------------------------------------

exports.deletefeedback = async (req, res) => {
  const { id } = req.params;
  try {
    await feedbackmodel.deleteFeedback(id);
    res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};
