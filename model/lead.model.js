// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      validate: {
        validator: function (v) {
          return /^[A-Za-z\s]+$/.test(v);
        },
        message: "Name can only contain alphabets and spaces",
      },
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // only 10 digits allowed
        },
        message:
          "Mobile number must be exactly 10 digits and contain only numbers",
      },
    },

    UserType: {
      type: String,
      required: [true, "Service selection is required"],
      enum: ["Architect/Interior designer", "Dealer", "Distributor", "OEM"],
    },

    ProductEnquire: {
      type: [String],
      required: [true, "Service selection is required"],
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must be at least 2 characters long"],
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    city: {
      type: String,
      required: [true, "Company address is required"],
      trim: true,
      minlength: [2, "Address must be at least 10 characters long"],
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    state: {
      type: String,
      required: [true, "Company address is required"],
      trim: true,
      minlength: [2, "Address must be at least 10 characters long"],
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    representative: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    leadType: {
      type: String,
    },
    place: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
