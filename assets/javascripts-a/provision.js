'use strict';

// Admin -> Instances -> Provisioning
// Custom Form Validation Rules

(($) => {
  let FormIsReady = false;
  // For Pulling Network List Control
  let NetReady = false;
  //=require ../_javascripts/provision.js
  //=require ../_javascripts/instance-userid.js
  //=require ../_javascripts/instance-network.js

  const FetchNetworkDetail = (uuid) => {
    FormIsReady = false;
    NetReady = false;
    $('#networkHelp').removeClass('text-mute');
    $.get(`../api/net/${uuid}`).done((data) => {
      if (data.Status === 'Success') {
        NetReady = true;
        FormIsReady = true;
        $('#networkHelp').html(data.Value.name_label).addClass('text-danger');
      } else {
        FormIsReady = false; // eslint-disable-line no-undef
        $('#networkHelp').html('Network not found.').addClass('text-danger');
      }
    }).fail((e) => {
      FormIsReady = false; // eslint-disable-line no-undef
      $('#networkHelp').html(`${e.status} ${e.statusText}, Try Again`).addClass('text-danger');
    });
  };

  $(document).ready(function() {
    FetchNetwork().each((index, el) => { // eslint-disable-line no-undef
      $('<options />').val(el).text(el).appendTo('#network');
    });
  });

  $('#network').on('change', function () {
    FetchNetworkDetail($(this).val());
  });

  $('form').on('submit', function (e) {
    e.preventDefault();
    // Check if Submit is Ready
    if (FormIsReady === true && NetReady === true) { // eslint-disable-line no-undef
      $(this)[0].submit();
    } else {
      return false;
    }
  });
})(jQuery);
