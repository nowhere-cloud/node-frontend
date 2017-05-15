'use strict';

// Users - Update Password

// https://codepen.io/diegoleme/pen/surIK
// Pure, no Frills, Absolutely Native HTML5 to Double Check Password.
// Supported by Most modern days browser. MSIE? Dog won't bite.

// https://developers.google.com/web/updates/2015/04/cut-and-copy-commands
// Generate Password

//=include passwdgen.js

(($) => {
  const password = $('#password')[0];
  const confirm = $('#cfm_password')[0];
  const gen_field = $('#generatedPassword')[0];
  const modal = $('#passwordGenerate');
  let generated = '';

  const validate = () => {
    if (password.value !== confirm.value) {
      confirm.setCustomValidity('Passwords Don\'t Match');
    } else {
      confirm.setCustomValidity('');
    }
  };

  password.onchange = validate;
  confirm.onkeyup = validate;

  // END Validator
  const GeneratePassword = () => {
    generated = GeneratePasswordFunction(); // eslint-disable-line no-undef
    gen_field.innerHTML = generated;
  };

  $(document).ready(() => {
    $('#generatePasswordNow').on('click', () => {
      GeneratePassword();
    });

    $('#ApplyGenerated').on('click', () => {
      password.value = confirm.value = generated;
      modal.modal('hide');
    });

    modal.on('show.bs.modal', () => {
      GeneratePassword();
    });
  });
})(jQuery);
