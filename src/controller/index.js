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

    const { place } = req.params;

    if (!place)
      return res.status(404).json({ message: "place is not defind " });

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
      console.log(place);
      return res.redirect(`/form/event/already-submited/${place}`); // redirect if already exists
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
      place: place,
    });
    res.redirect(`/form/event/thankyou/${place}`);
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
      return res.redirect("/form/showroom/already-submited"); // redirect if already exists
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

    res.redirect("/form/showroom/thankyou");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error in submitting form", error: error.message });
  }
};
