'use strict';

// Admin - User Management

(($) => {
  const error_wrap = $('<tr/>').addClass('table-danger');
  const error = $('<td/>').attr('colspan', 5);

  const loadUserTable = () => {
    $('#user-loadhere').load('/admin/users/partials/user-list', function (response, status, xhr) {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $(this).html(error_wrap);
      }
    });
  };

  const loadForm = (id) => {
    $('#edit-user').load(`/admin/users/partials/user-form/${id}`, function (response, status, xhr) {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $(this).html(error_wrap);
      } else {
        $('#edit-loading-bar').hide();
        $(this).show();
      }
    });
  };

  $(document).ready(function() {
    loadUserTable();
  });

  $('#generate-new').on('click', (e) => {
    e.preventDefault();
    let generated = GeneratePasswordFunction(); // eslint-disable-line no-undef
    $('#password-new').val(generated);
    $('#password-out-new').html(generated);
    return false();
  });

  $('#NewUser').on('hide.bs.modal', () => {
    $('#new-user')[0].reset();
  });

  $('#EditUser').on('show.bs.modal', () => {
    $('#edit-loading-bar').show();
    $('#edit-user').hide();
  }).on('hide.bs.modal', () => {
    $('#edit-user').hide();
    $('#edit-loading-bar').show();
  });

  $('#generate-new').on('click', (e) => {
    e.preventDefault();
    let generated = GeneratePasswordFunction(); // eslint-disable-line no-undef
    $('#password-new').val(generated);
    $('#password-out-new').html(generated);
  });

  $('#edit-user').on('click', '#generate-edit', (e) => {
    e.preventDefault();
    let generated = GeneratePasswordFunction(); // eslint-disable-line no-undef
    $('#password-edit').val(generated);
    $('#password-out-edit').html(generated);
  });

  // Lazy Load Form (Server Side Render for security)
  $('#user-loadhere').on('click', '.user-edit', function() {
    loadForm($(this).data('entryid'));
    $('#EditUser').modal('show');
  });

  $('#edit-user').on('submit', '.user-edit-form', function(e) {
    e.preventDefault();
    if ($('#password-edit').val() === '') {
      return false;
    }
    $(this)[0].submit();
  });

})(jQuery);
