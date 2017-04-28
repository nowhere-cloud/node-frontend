'use strict';

(($) => {
  const error_wrap = $('<tr/>').addClass('table-danger');
  const error = $('<td/>').attr('colspan', 3);

  const getVMList = () => {
    $('#VM-loadhere').load('/admin/instances/partials/vm-list', function (response, status, xhr) {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $(this).html(error_wrap);
      }
    });
  };

  $(document).ready(() => {
    getVMList();
  });

})(jQuery);
