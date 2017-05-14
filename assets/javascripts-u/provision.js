'use strict';

// User -> Instances -> Provisioning
// Common Form Validation Rules

(($) => {
  let FormIsReady = false;
  let NetReady = false;
  //=require ../_javascripts/provision.js
  //=require ../_javascripts/instance-network.js

  $(document).ready(function() {
    $('#network').val(FetchNetwork()[0]); // eslint-disable-line no-undef
    NetReady = true;
  });

  $('form').on('submit', function(e) {
    e.preventDefault();
    // Check if Submit is Ready
    if (FormIsReady === true) {
      $(this)[0].submit();
    } else {
      return false;
    }
  });
})(jQuery);
