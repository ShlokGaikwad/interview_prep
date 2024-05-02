const express = require("express");
const employeeRouter = express.Router();
const jwt = require("jsonwebtoken");
const EmployeeModel = require("../models/employee.model");
const auth = require("../middleware/auth.middleware");
require("dotenv").config();

employeeRouter.post("/", auth, async (req, res) => {
  try {
    const { first, last, email, department, salary } = req.body;
    const emp = new EmployeeModel({
      first,
      last,
      email,
      department,
      salary,
      addedBy: req.userId,
    });
    await emp.save();
    res.status(201).json({ msg: "employee added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

employeeRouter.patch("/:id", auth, async (req, res) => {
  try {
    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).send({ msg: "employee updated", employee });
  } catch (err) {
    console.log(err);
    res.status(400).send({ Error: "error occured while updating employee" });
  }
});

employeeRouter.delete("/:id", auth, async (req, res) => {
  try {
    const employee = await EmployeeModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "employee deleted", employee });
  } catch (err) {
    console.log(err);
    res.status(400).send({ Error: "error occured while deleting employee" });
  }
});

employeeRouter.get("/", auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortBy = req.query.sortBy || "salary";
  const sortOrder = req.query.sortOrder || "asc";
  const departmentFilter = req.query.department;
  const firstNameSearch = req.query.first;

  try {
    const count = await EmployeeModel.countDocuments({ addedBy: req.userId });
    const totalPages = Math.ceil(count / limit);

    let query = EmployeeModel.find({ addedBy: req.userId });
    if (departmentFilter) {
      query = query.where({ department: departmentFilter });
    }
    if (firstNameSearch) {
      query = query.where("first").regex(new RegExp(firstNameSearch, "i"));
    }

    if (sortBy && sortOrder) {
      const sortCriteria = {};
      sortCriteria[sortBy] = sortOrder === "asc" ? 1 : -1;
      query = query.sort(sortCriteria);
    }

    const employees = await query.skip((page - 1) * limit).limit(limit);

    res.status(200).send({
      employees,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ Error: "Error occurred while fetching employees" });
  }
});

module.exports = employeeRouter;
