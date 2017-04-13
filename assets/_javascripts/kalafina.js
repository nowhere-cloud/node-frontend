'use strict';

(($) => {
  const error = $('<div/>').addClass('alert alert-danger mb-0');

  const load = () => {
    $('#dns-loadhere').load('/users/dns/partials/list', (response, status, xhr) => {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        $('#dns-loadhere').html(error);
      }
    });
  };

  $(document).ready(() => {
    load();
  });
})(jQuery);