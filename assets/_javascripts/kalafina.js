'use strict';

(($) => {
  const error_wrap = $('<tr/>').addClass('table-danger');
  const error      = $('<td/>').attr('colspan', 7);

  const load = () => {
    $('#dns-loadhere').load('/users/dns/partials/list', (response, status, xhr) => {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $('#dns-loadhere').html(error_wrap);
      }
    });
  };

  $(document).ready(() => {
    load();
  });
})(jQuery);
