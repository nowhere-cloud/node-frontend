'use strict';

(($) => {
  const error_wrap = $('<tr/>').addClass('table-danger');
  const error = $('<td/>').attr('colspan', 7);

  const loadTable = () => {
    $('#dns-loadhere').load('/admin/dns/partials/list', (response, status, xhr) => {
      if (status === 'error') {
        error.html(`${xhr.status} ${xhr.statusText}`);
        error_wrap.html(error);
        $('#dns-loadhere').html(error_wrap);
      }
    });
  };

  const loadForm = (id) => {
    $('#edit-dns').load(`/admin/dns/partials/form/${id}`, (response, status, xhr) => {
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
   * Check if an IPv4 is valid using regex
   * @param {String} IP Raw IPv4
   */
  const CheckIP4 = (IP) => {
    // http://www.regextester.com/22
    return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g.test(IP);
  };

  /**
   * Denary to Hexadecimal Number
   * @param {[type]} DEC [description]
   */
  const DEC2HEX = (DEC) => {
    return parseInt(DEC, 10).toString(16);
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
    setTimeout(() => {
      loadTable();
    }, 2000);
  });

  // Reset Form
  $('#new-reset').on('click', (e) => {
    $('#new-dns')[0].reset();
  });

  $('#NewDNS').on('show.bs.modal', () => {
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
    if(CheckIP4($('#ipv4-new').value())) {
      $('#ipv4-new').addClass('form-control-danger');
      $('#ip4-feedback').show();
      return false;
    }
    if($('#ipv6-new').value() === '') {
      $('#ipv6-new').value(GenerateIP6($('#ipv4-new').value()));
    }
    this.submit();
  });

  $('#edit-dns').on('submit', '.dns-edit-form', function (e) {
    e.preventDefault();
    if(CheckIP4($('#ipv4-edit').value())) {
      $('#ipv4-edit').addClass('form-control-danger');
      $('#ip4-edit-feedback').show();
      return false;
    }
    if($('#ipv6-edit').value() === '') {
      $('#ipv6-edit').value(GenerateIP6($('#ipv4-new').value()));
    }
    this.submit();
  });

  // Lazy Load Form (Server Side Render for security)
  $('#dns-loadhere').on('click', '.dns-edit', function() {
    loadForm($(this).data('entryid'));
    $('#EditDNS').modal('show');
  });

})(jQuery);
