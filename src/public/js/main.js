(function ($) {
  "use strict";

  /*==================================================================
    [ Focus Contact2 ]*/
  $(".input100").each(function () {
    $(this).on("blur", function () {
      if ($(this).val().trim() != "") {
        $(this).addClass("has-val");
      } else {
        $(this).removeClass("has-val");
      }
    });
  });

  /*==================================================================
    [ Validate ]*/
  var name = $('.validate-input input[name="name"]');
  var email = $('.validate-input input[name="email"]');
  var message = $('.validate-input textarea[name="message"]');

  $(".validate-form").on("submit", function () {
    var check = true;

    if ($(name).val().trim() == "") {
      showValidate(name);
      check = false;
    }

    if (
      $(email)
        .val()
        .trim()
        .match(
          /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
        ) == null
    ) {
      showValidate(email);
      check = false;
    }

    if ($(message).val().trim() == "") {
      showValidate(message);
      check = false;
    }

    return check;
  });

  $(".validate-form .input100").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function showValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }
})(jQuery);

const nameInput = document.querySelector("input[name='name']");
const emailInput = document.querySelector("input[name='email']");
const phoneInput = document.querySelector("input[name='number']");
const firmInput = document.querySelector("input[name='company_name']");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const firmError = document.getElementById("firm-error");

function validateName(input) {
  const regex = /^[A-Za-z\s]+$/;
  if (!regex.test(input.value.trim())) {
    nameError.textContent = "Please enter a valid name (letters only).";
    nameError.style.display = "block";
    return false;
  }
  nameError.style.display = "none";
  return true;
}

function validateEmail(input) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(input.value.trim())) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.style.display = "block";
    return false;
  }
  emailError.style.display = "none";
  return true;
}

function validatePhone(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
  const regex = /^[0-9]{10}$/;
  if (!regex.test(input.value.trim())) {
    phoneError.textContent = "Please enter a valid 10-digit phone number.";
    phoneError.style.display = "block";
    return false;
  }
  phoneError.style.display = "none";
  return true;
}

// function validateFirm(input) {
//   const regex = /^.*$/;
//   if (!regex.test(input.value.trim())) {
//     firmError.textContent = "Please enter a valid company name.";
//     firmError.style.display = "block";
//     return false;
//   }
//   firmError.style.display = "none";
//   return true;
// }

// Real-time validation
nameInput.addEventListener("input", () => validateName(nameInput));
emailInput.addEventListener("input", () => validateEmail(emailInput));
phoneInput.addEventListener("input", () => validatePhone(phoneInput));
firmInput.addEventListener("input", () => validateFirm(firmInput));


