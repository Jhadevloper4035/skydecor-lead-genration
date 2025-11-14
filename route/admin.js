const route = require("express").Router();
const Contact = require("../model/lead.model.js");
const { protect } = require("../middleware/jwt.js");

const express = require("express");
const XLSX = require("xlsx");

route.get("/dashboard", protect, async (req, res) => {
  try {
    const leadType = req.user.accessType;

    const leadData = await Contact.find({ leadType: leadType }) // filter
      .sort({ createdAt: -1 }); // sort latest first

    // Convert ProductEnquire array → string
    const formattedLeads = leadData.map((lead) => {
      const obj = lead.toObject();
      obj.ProductEnquire =
        Array.isArray(obj.ProductEnquire) && obj.ProductEnquire.length > 0
          ? obj.ProductEnquire.join(", ")
          : ""; // empty string if no product enquire
      return obj;
    });

    res.render("dashboard", {
      title: "Home page",
      leads: formattedLeads,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

route.get("/event/:place", protect, async (req, res) => {
  try {
    // Access check
    if (req.user.accessType !== "event") {
      return res.status(400).json({
        message: "Invalid access",
      });
    }

    const place = req.params.place;

    // Fetch leads
    const leadData = await Contact.find({ place })
      .sort({ createdAt: -1 })
      .lean(); // returns plain JS objects

    // Convert ProductEnquire array → comma-separated string
    const formattedLeads = leadData.map((lead) => {
      return {
        ...lead,
        ProductEnquire:
          Array.isArray(lead.ProductEnquire) && lead.ProductEnquire.length > 0
            ? lead.ProductEnquire.join(", ")
            : "",
      };
    });

    // Render page
    return res.render("adminDashboard/event", {
      title: "Home page",
      leads: formattedLeads,
      user: req.user,
      place,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

route.get("/download/:place", protect, async (req, res) => {
  try {
    // Fetch all contacts as plain JS objects
    const { place } = req.params;
    const leadType = req.user.accessType;
    const data = await Contact.find({ leadType: leadType, place })
      .sort({ createdAt: -1 })
      .lean();

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
