const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    first: { type: String, required: true },
    last: { type: String, required: true },
    email: { type: String, required: true },
    department: {
      type: String,
      required: true,
      enum: ["Tech", "Marketing", "Operations "],
      default: "Tech",
    },
    salary: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    versionKey: false,
  }
);

const EmployeeModel = mongoose.model("Employee", employeeSchema);
module.exports = EmployeeModel;
