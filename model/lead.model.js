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
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\d{7,15}$/, "Mobile number must be between 7 and 15 digits"],
    },

    UserType: {
      type: String,
      required: [true, "Service selection is required"],
      enum: ["Architect", "Trade Partner"],
    },

    ProductEnquire: {
      type: String,
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
