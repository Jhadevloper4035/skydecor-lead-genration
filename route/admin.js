const route = require("express").Router();
const Contact = require("../model/lead.model.js");
const { protect } = require("../middleware/jwt.js");

const express = require("express");
const XLSX = require("xlsx");


route.get("/dashboard", protect, async (req, res) => {
  try {
    const leadData = await Contact.find();

    // Convert ProductEnquire array → string
    const formattedLeads = leadData.map(lead => {
      const obj = lead.toObject();
      obj.ProductEnquire = Array.isArray(obj.ProductEnquire) && obj.ProductEnquire.length > 0
        ? obj.ProductEnquire.join(", ")
        : ""; // empty string if no product enquire
      return obj;
    });

    res.render("dashboard", { title: "Home page", leads: formattedLeads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





route.get("/download", protect, async (req, res) => {
  try {
    // Fetch all contacts as plain JS objects
    const data = await Contact.find().lean();

    // Optional: remove MongoDB internal fields
    const cleanData = data.map(({ _id, __v, ...rest }) => rest);

    // Create worksheet & workbook
    const ws = XLSX.utils.json_to_sheet(cleanData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");

    // Write to buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    res.setHeader("Content-Disposition", "attachment; filename=contacts.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buf);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).send("Error generating Excel file");
  }
});

module.exports = route;
