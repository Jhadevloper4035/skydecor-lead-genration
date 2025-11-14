const Contact = require("../model/lead.model.js");

module.exports.submitFormEvent = async (req, res) => {
  try {
    const {
      name,
      email,
      number,
      userType,
      productType,
      company_name,
      city,
      state,
      representative,
    } = req.body;

    // Validation
    if (
      !name ||
      !number ||
      !userType ||
      !productType ||
      !company_name ||
      !city ||
      !state ||
      !representative
    ) {
      return res
        .status(400)
        .json({ message: "Invalid details. Please fill all required fields." });
    }

    // ✅ Check if number already exists in DB
    const existingLead = await Contact.findOne({
      mobileNumber: number,
      leadType: "event",
    });
    if (existingLead) {
      return res.redirect("/form/already-submited"); // redirect if already exists
    }

    // Save to DB
    await Contact.create({
      fullName: name,
      email,
      mobileNumber: number,
      UserType: userType,
      ProductEnquire: productType,
      companyName: company_name,
      state: state,
      city: city,
      representative,
      leadType: "event",
      place: "FOAID 2025 Delhi",
    });

    res.redirect("/form/thankyou");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error in submitting form", error: error.message });
  }
};

module.exports.submitFormShowroom = async (req, res) => {
  try {
    const {
      name,
      email,
      number,
      userType,
      productType,
      company_name,
      city,
      state,
      representative,
    } = req.body;

    // Validation
    if (
      !name ||
      !number ||
      !userType ||
      !productType ||
      !company_name ||
      !city ||
      !state ||
      !representative
    ) {
      return res
        .status(400)
        .json({ message: "Invalid details. Please fill all required fields." });
    }

    // ✅ Check if number already exists in DB
    const existingLead = await Contact.findOne({
      mobileNumber: number,
      leadType: "showroom",
    });
    if (existingLead) {
      return res.redirect("/form/already-submited"); // redirect if already exists
    }

    // Save to DB
    await Contact.create({
      fullName: name,
      email,
      mobileNumber: number,
      UserType: userType,
      ProductEnquire: productType,
      companyName: company_name,
      state: state,
      city: city,
      representative,
      leadType: "showroom",
      place: "kirti nagar",
    });

    res.redirect("/form/thankyou");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error in submitting form", error: error.message });
  }
};

module.exports.getEventAllLead = async (req, res) => {
  try {
    const leadData = await Contact.find({ leadType: "event" });
    return res
      .status(200)
      .json({ message: "Data fetched Sucessfully", LeadData: leadData });
  } catch (error) {
    res.status(500).json({ message: "Inetrnal server error" });
  }
};

module.exports.getShowroomAllLead = async (req, res) => {
  try {
    const leadData = await Contact.find({ leadType: "showroom" });
    return res
      .status(200)
      .json({ message: "Data fetched Sucessfully", LeadData: leadData });
  } catch (error) {
    res.status(500).json({ message: "Inetrnal server error" });
  }
};
