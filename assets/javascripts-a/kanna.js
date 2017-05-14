'use strict';

// Admin - DNS

//=require ../_javascripts/ipcalc.js

(($) => {
  const error_wrap = $('<tr/>').addClass('table-danger');
  const error = $('<td/>').attr('colspan', 7);

  const loadTable = () => {
    $('#dns-loadhere').load('/admin/dns/partials/list', function (response, status, xhr) {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $(this).html(error_wrap);
      } else {
        $(this).DataTable();
      }
    });
  };

  const loadForm = (id) => {
    $('#edit-dns').load(`/admin/dns/partials/form/${id}`, function (response, status, xhr) {
      $('#edit-loading-bar').hide();
      $(this).show();
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $(this).html(error_wrap);
      }
    });
  };

  $(document).ready(() => {
    // Lazy Load DNS Table
    loadTable();
  });

  // Reset Form
  $('#new-reset').on('click', (e) => {
    $('#new-dns')[0].reset();
  });

  $('#NewDNS').on('show.bs.modal', () => {
    $('#ip4-feedback').hide();
    $('#new-dns')[0].reset();
  });

  $('#EditDNS').on('show.bs.modal', () => {
    $('#edit-loading-bar').show();
    $('#edit-dns').hide();
  }).on('hide.bs.modal', () => {
    $('#edit-dns').hide();
    $('#edit-loading-bar').show();
  });

  $('#new-dns').on('submit', function (e) {
    e.preventDefault();
    if ($('#dns-type-new').val() === 'A' && $('#ipv4-new').val() === '') {
      $('#ipv4-new').addClass('form-control-danger').parent().addClass('has-danger');
      return false;
    }
    if ($('#dns-type-new').val() === 'A' && $('#ipv6-new').val() === '') {
      $('#ipv6-new').val(GenerateIP6($('#ipv4-new').val())); // eslint-disable-line no-undef
    }
    if ($('#dns-type-new').val() === 'CNAME' && $('#optval-new').val() === '') {
      $('#optval-new').addClass('form-control-danger').parent().addClass('has-danger');
      return false;
    }
    $(this)[0].submit();
  });

  $('#edit-dns').on('change', '#ip4-edit', function (e) {
    if ($(this).val().split('.').length === 4) {
      $('#ipv6-edit').val(GenerateIP6($('#ipv4-new').val())); // eslint-disable-line no-undef
    }
  });

  $('#edit-dns').on('submit', 'form.dns-edit-form', function (e) {
    e.preventDefault();
    if ($('#ip6-edit').val() === '') {
      $('#ip6-edit').val(GenerateIP6($('#ip4-edit').val())); // eslint-disable-line no-undef
    }
    $(this)[0].submit();
  });

  // Lazy Load Form (Server Side Render for security)
  $('#dns-loadhere').on('click', '.dns-edit', function () {
    loadForm($(this).data('entryid'));
    $('#EditDNS').modal('show');
  });

})(jQuery);
