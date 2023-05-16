const mongoose = require("mongoose");

const schema = mongoose.Schema;

const TodoSchema = new schema({
  text: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
    default : false,
    required: false,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Todo", TodoSchema);
