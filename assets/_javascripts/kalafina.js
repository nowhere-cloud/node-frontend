'use strict';

(($) => {
  const error_wrap = $('<tr/>').addClass('table-danger');
  const error = $('<td/>').attr('colspan', 7);

  const loadTable = () => {
    $('#dns-loadhere').load('/users/dns/partials/list', (response, status, xhr) => {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $('#dns-loadhere').html(error_wrap);
      }
    });
  };

  const loadForm = (id) => {
    $('#edit-dns').load(`/users/dns/partials/form/${id}`, (response, status, xhr) => {
      $('#edit-loading-bar').hide();
      $('#edit-dns').show();
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $('#edit-dns').html(error_wrap);
      }
    });
  };


  /**
   * Denary to Hexadecimal Number
   * @param {[type]} DEC [description]
   */
  const DEC2HEX = (DEC) => {
    let result = parseInt(DEC, 10).toString(16);
    return result.length === 1 ? '0' + result : result;
  };

  /**
   * Generate Mapped IPv6 from IPv4
   * @param {String} IP4 IPv4
   */
  const GenerateIP6 = (IP4) => {
    let splitted = IP4.trim().split('.');
    return `::FFFF:${DEC2HEX(splitted[0])}${DEC2HEX(splitted[1])}:${DEC2HEX(splitted[2])}${DEC2HEX(splitted[3])}`;
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
    if ($('#ipv6-new').val() === '') {
      $('#ipv6-new').val(GenerateIP6($('#ipv4-new').val()));
    }
    $(this)[0].submit();
    $('#NewDNS').modal('hide');
    loadTable();
  });

  $('#edit-dns').on('submit', '.dns-edit-form', function (e) {
    e.preventDefault();
    if ($('#ipv6-edit').val() === '') {
      $('#ipv6-edit').val(GenerateIP6($('#ipv4-new').val()));
    }
    $(this)[0].submit();
    $('#EditDNS').modal('hide');
    loadTable();
  });

  // Lazy Load Form (Server Side Render for security)
  $('#dns-loadhere').on('click', '.dns-edit', function() {
    loadForm($(this).data('entryid'));
    $('#EditDNS').modal('show');
  });

})(jQuery);
