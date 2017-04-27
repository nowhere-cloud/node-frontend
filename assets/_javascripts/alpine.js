'use strict';

(($) => {
  const error_wrap = $('<tr/>').addClass('table-danger');
  const error = $('<td/>').attr('colspan', 5);

  const loadUserTable = () => {
    $('#user-loadhere').load('/admin/users/partials/user-list', (response, status, xhr) => {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $('#user-loadhere').html(error_wrap);
      }
    });
  };

  const loadForm = (id) => {
    $('#edit-user').load(`/admin/users/partials/user-form/${id}`, (response, status, xhr) => {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $('#edit-user').html(error_wrap);
      } else {
        $('#edit-loading-bar').hide();
        $('#edit-user').show();
      }
    });
  };

  const GeneratePasswordFunction = () => {
    let stra = Math.random().toString(36).slice(-10);
    let strb = Math.random().toString(36).slice(-10);
    let concat = String(stra + strb).replace(/\./g, 'a');
    return concat.split('').sort(function() {
      return 0.5 - Math.random();
    }).join('');
  };

  $(document).ready(function() {
    loadUserTable();
  });

  $('#generate-new').on('click', (e) => {
    e.preventDefault();
    let generated = GeneratePasswordFunction();
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
    let generated = GeneratePasswordFunction();
    $('#password-new').val(generated);
    $('#password-out-new').html(generated);
  });

  $('#generate-edit').on('click', (e) => {
    e.preventDefault();
    let generated = GeneratePasswordFunction();
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
