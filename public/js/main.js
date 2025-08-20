(function($) {
    "use strict";


    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function() {
        $(this).on('blur', function() {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        })
    })


    /*==================================================================
    [ Validate ]*/
    var name = $('.validate-input input[name="name"]');
    var email = $('.validate-input input[name="email"]');
    var message = $('.validate-input textarea[name="message"]');


    $('.validate-form').on('submit', function() {
        var check = true;

        if ($(name).val().trim() == '') {
            showValidate(name);
            check = false;
        }


        if ($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            showValidate(email);
            check = false;
        }

        if ($(message).val().trim() == '') {
            showValidate(message);
            check = false;
        }

        return check;
    });


    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
            hideValidate(this);
        });
    });

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);




  const nameInput = document.querySelector("input[name='name']");
  const emailInput = document.querySelector("input[name='email']");
  const phoneInput = document.querySelector("input[name='number']");
  const firmInput = document.querySelector("input[name='company_name']");

  // Validation functions
  function validateName(input) {
    const regex = /^[A-Za-z\s]+$/; // only letters & spaces
    return regex.test(input.value.trim());
  }

  function validateEmail(input) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email regex
    return regex.test(input.value.trim());
  }

 function validatePhone(input) {
  // remove everything except digits
  input.value = input.value.replace(/[^0-9]/g, "");

  // regex: only digits, exactly 10
  const regex = /^[0-9]{10}$/;
  return regex.test(input.value.trim());
}

  function setValidation(input, isValid) {
    if (isValid) {
      input.classList.add("valid");
      input.classList.remove("invalid");
    } else {
      input.classList.add("invalid");
      input.classList.remove("valid");
    }
  }

  // Real-time validation events
  nameInput.addEventListener("input", () => setValidation(nameInput, validateName(nameInput)));
  firmInput.addEventListener("input", () => setValidation(firmInput, validateName(firmInput)));
  emailInput.addEventListener("input", () => setValidation(emailInput, validateEmail(emailInput)));
  phoneInput.addEventListener("input", () => setValidation(phoneInput, validatePhone(phoneInput)));

