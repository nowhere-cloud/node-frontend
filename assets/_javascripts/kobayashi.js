'use strict';

// Users - Instances

(($) => {
  const error_wrap = $('<tr/>').addClass('table-danger');
  const error = $('<td/>').attr('colspan', 3);

  const getPartials = (endpoint) => {
    $(`#${endpoint}-loadhere`).load(`/users/instances/partials/${endpoint}`, function (response, status, xhr) {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $(this).html(error_wrap);
      }
    });
  };

  $(document).ready(() => {
    getPartials('vm-list-hyp');
  });

  $('#vm-list-hyp-tab').on('click', () => {
    getPartials('vm-list-hyp');
  });

  $('#net-list-hyp-tab').on('click', () => {
    getPartials('net-list-hyp');
  });

})(jQuery);
