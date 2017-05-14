'use strict';

// Admin -> Instances -> Clone

(($) => {
  let FormIsReady = false;

  //=require ../_javascripts/instance-userid.js

  $('form').on('submit', function (e) {
    e.preventDefault();
    // Check if Submit is Ready
    if (FormIsReady === true) { // eslint-disable-line no-undef
      $(this)[0].submit();
    } else {
      // For invalid User ID, Type check is handoffed to HTML5
      $('#uid')[0].setCustomValidity('Please double-check the User ID Value.');
      return false;
    }
  });
})(jQuery);
