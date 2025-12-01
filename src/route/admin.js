const route = require("express").Router();
const Lead = require("../model/lead.model.js");
const { protect } = require("../middleware/jwt.js");
const express = require("express");
const XLSX = require("xlsx");

route.get("/dashboard", protect, async (req, res) => {
  try {
    const leadType = req.user.accessType;

    const leadData = await Lead.find({ leadType: leadType }) // filter
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
    if (req.user.accessType === "showroom") {
      return res.status(400).json({
        message: "Invalid access",
      });
    }

    const place = req.params.place;

    // Fetch leads
    const leadData = await Lead.find({ leadType: "event", place })
      .sort({ createdAt: -1 })
      .lean();

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
      API_ENDPOINT: process.env.API_ENDPOINT,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

route.get("/event/download/:place", protect, async (req, res) => {
  try {
    // Fetch all Leads as plain JS objects
    const { place } = req.params;
    const leadType = req.user.accessType;
    const data = await Lead.find({ leadType: "event", place })
      .sort({ createdAt: -1 })
      .lean();

    data.forEach((item) => {
      if (item.ProductEnquire && Array.isArray(item.ProductEnquire)) {
        item.ProductEnquire = item.ProductEnquire.join(", ");
      }
    });

    // Optional: remove MongoDB internal fields
    const cleanData = data.map(({ _id, __v, ...rest }) => rest);

    // Create worksheet & workbook
    const ws = XLSX.utils.json_to_sheet(cleanData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    // Write to buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    res.setHeader("Content-Disposition", "attachment; filename=Leads.xlsx");
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

// showroom

route.get("/showroom", protect, async (req, res) => {
  try {
    // Access check
    if (req.user.accessType === "event") {
      return res.status(400).json({
        message: "Invalid access",
      });
    }

    // Fetch leads
    const leadData = await Lead.find({ leadType: "showroom" })
      .sort({ createdAt: -1 })
      .lean();

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
    return res.render("adminDashboard/showroom", {
      title: "Home page",
      leads: formattedLeads,
      user: req.user,
      place: "showroom",
      API_ENDPOINT: process.env.API_ENDPOINT,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

route.get("/showroom/download", protect, async (req, res) => {
  try {
    const { place } = req.params;
    const leadType = req.user.accessType;
    const data = await Lead.find({ leadType: "showroom" })
      .sort({ createdAt: -1 })
      .lean();

    data.forEach((item) => {
      if (item.ProductEnquire && Array.isArray(item.ProductEnquire)) {
        item.ProductEnquire = item.ProductEnquire.join(", ");
      }
    });

    // Optional: remove MongoDB internal fields
    const cleanData = data.map(({ _id, __v, ...rest }) => rest);

    // Create worksheet & workbook
    const ws = XLSX.utils.json_to_sheet(cleanData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    // Write to buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    res.setHeader("Content-Disposition", "attachment; filename=Leads.xlsx");
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

// Webiste Product Enquiry

route.get("/website/product/enquiry", protect, async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Build query string for API
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit,
    });

    // Fetch leads from external API
    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/lead/productEnquiry?${queryParams}`,
      {
        method: "GET",
        headers: {
          "x-admin-secret": process.env.ADMIN_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const leads = await response.json();

    // Render page
    return res.render("adminDashboard/productEnquiry", {
      title: "Home page",
      leads: leads.data,
      user: req.user,
      place: "showroom",
      API_ENDPOINT: process.env.API_ENDPOINT,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

route.get("/website/product/enquiry/download", protect, async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100000000;

    // Build query string for API
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit,
    });

    // Fetch leads from external API
    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/lead/productEnquiry?${queryParams}`,
      {
        method: "GET",
        headers: {
          "x-admin-secret": process.env.ADMIN_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const leadData = await response.json();

    leadData.data.forEach((item) => {
      if (item.note && Array.isArray(item.note)) {
        item.note = item.note.join(", ");
      }
    });

    // Optional: remove MongoDB internal fields
    const cleanData = leadData.data.map(({ _id, __v, ...rest }) => rest);

    // Create worksheet & workbook
    const ws = XLSX.utils.json_to_sheet(cleanData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    // Write to buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    res.setHeader("Content-Disposition", "attachment; filename=Leads.xlsx");
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

// Webiste Contact Enquiry

route.get("/website/contact/enquiry", protect, async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Build query string for API
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit,
    });

    // Fetch leads from external API
    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/lead/contactleads?${queryParams}`,
      {
        method: "GET",
        headers: {
          "x-admin-secret": process.env.ADMIN_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const leads = await response.json();

    // Render page
    return res.render("adminDashboard/contactEnquiry.ejs", {
      title: "Home page",
      leads: leads.data,
      user: req.user,
      place: "showroom",
      API_ENDPOINT: process.env.API_ENDPOINT,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

route.get("/website/contact/enquiry/download", protect, async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100000000;

    // Build query string for API
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit,
    });

    // Fetch leads from external API
    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/lead/contactleads?${queryParams}`,
      {
        method: "GET",
        headers: {
          "x-admin-secret": process.env.ADMIN_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const leadData = await response.json();

    leadData.data.forEach((item) => {
      if (item.note && Array.isArray(item.note)) {
        item.note = item.note.join(", ");
      }
    });

    // Optional: remove MongoDB internal fields
    const cleanData = leadData.data.map(({ _id, __v, ...rest }) => rest);

    // Create worksheet & workbook
    const ws = XLSX.utils.json_to_sheet(cleanData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    // Write to buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    res.setHeader("Content-Disposition", "attachment; filename=Leads.xlsx");
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

route.get("/website/jobapplication/enquiry", protect, async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Build query string for API
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit,
    });

    // Fetch leads from external API
    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/lead/jobapplications?${queryParams}`,
      {
        method: "GET",
        headers: {
          "x-admin-secret": process.env.ADMIN_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const leads = await response.json();

    // Render page
    return res.render("adminDashboard/jobEnquiry", {
      title: "Home page",
      leads: leads.data,
      user: req.user,
      place: "showroom",
      API_ENDPOINT: process.env.API_ENDPOINT,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

route.get(
  "/website/jobapplication/enquiry/download",
  protect,
  async (req, res) => {
    try {
      // Extract query parameters with defaults
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100000000;

      // Build query string for API
      const queryParams = new URLSearchParams({
        page: page,
        limit: limit,
      });

      // Fetch leads from external API
      const response = await fetch(
        `${process.env.API_ENDPOINT}/api/lead/jobapplications?${queryParams}`,
        {
          method: "GET",
          headers: {
            "x-admin-secret": process.env.ADMIN_SECRET,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Parse the response
      const leadData = await response.json();

      // Optional: remove MongoDB internal fields
      const nestedData = leadData.data.map(({ _id, __v, ...rest }) => rest);

      const cleanData = nestedData.map((item) => ({
        id: item._id,
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        city: item.city,
        position: item.position,
        experience: item.experience,
        qualification: item.qualification,
        currentCompany: item.currentCompany,
        coverLetter: item.coverLetter,
        consent: item.consent,
        status: item.status,
        resumeFileName:
          `${process.env.API_ENDPOINT}/uploads/resumes/${item.resume?.filename}` ||
          null, // flattened from nested resume object
        jobTitle: item.jobId?.title || null, // flattened from nested jobId object
        jobLocation: item.jobId?.location || null,
        jobDepartment: item.jobId?.department || null,
        submittedAt: item.submittedAt,
      }));

      // Create worksheet & workbook
      const ws = XLSX.utils.json_to_sheet(cleanData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leads");

      // Write to buffer
      const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      // Set headers for download
      res.setHeader("Content-Disposition", "attachment; filename=Leads.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.send(buf);
    } catch (error) {
      console.error("Excel export error:", error);
      res.status(500).send("Error generating Excel file");
    }
  }
);

// GET => Find Lead by Phone
route.get("/event/phone/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;

    const lead = await Lead.findOne({ mobileNumber: phone });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json({
      message: "Lead found successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error finding lead:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// PUT => Update leadType by Phone
route.put("/event/phone/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const { leadType, place } = req.body;

    // Step 1: Find by mobile number only
    const lead = await Lead.findOne({ mobileNumber: phone });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Step 2: Update leadType and place
    if (leadType) lead.leadType = leadType;
    if (place) lead.place = place;

    await lead.save();

    return res.status(200).json({
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = route;
