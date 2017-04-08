'use strict';

// https://codepen.io/diegoleme/pen/surIK
// Pure, no Frills, Absolutely Native HTML5 to Double Check Password.
// Supported by Most modern days browser. MSIE? Dog won't bite.

// https://developers.google.com/web/updates/2015/04/cut-and-copy-commands
// Generate Password

(($) => {
  const password = $('#password').get(0);
  const confirm = $('#cfm_password').get(0);
  const gen_field = $('#generatedPassword').get(0);
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

  const GeneratePasswordFunction = () => {
    let stra = Math.random().toString(36).slice(-11);
    let strb = Math.random().toString(36).slice(-11);
    let concat = String(stra + strb).replace(/\./g,'a');
    return concat.split('').sort(function () {
      return 0.5 - Math.random();
    }).join('');
  };

  const GeneratePassword = () => {
    generated = GeneratePasswordFunction();
    gen_field.innerHTML = generated;
  };

  $(document).ready(() => {
    $('#generatePasswordNow').on('click', () => {
      GeneratePassword();
    });

    $('#ApplyGenerated').on('click', () => {
      modal.modal('hide');
    });

    modal.on('hide.bs.modal', () => {
      password.value = confirm.value = generated;
    }).on('show.bs.modal', () => {
      GeneratePassword();
    });
  });
})(jQuery);
