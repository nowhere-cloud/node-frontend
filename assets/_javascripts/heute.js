'use strict';

// Admin/Users - Instances - VM
// For Retreving Metrics + IP

(($) => {
  let uuid = $('p#uuid').html().trim();
  const errortext = $('<span/>').addClass('text-danger');

  const getMetrics = () => {
    $.get(`../api/vm/${uuid}/metrics`).done((json) => {
      if (json.Status === 'Success') {
        if (json.Value.PV_drivers_detected === true) {
          $('#modal-metric-osname').html(json.Value.os_version.name);
          $('#modal-metric-kernel').html(json.Value.os_version.uname);
          $('#modal-metric-driver').html(`${json.Value.PV_drivers_version.major}.${json.Value.PV_drivers_version.minor}.${json.Value.PV_drivers_version.micro}.${json.Value.PV_drivers_version.build}`);
        } else {
          $('#modal-metric-osname').html('');
          $('#modal-metric-kernel').html('');
          $('#modal-metric-driver').html('Contact Administrator');
        }
        $('#modal-metric-loading-bar').hide();
        $('#modal-metric-main').show();
      }
    }).fail((error) => {
      errortext.html(`${error.status} ${error.statusText}`);
      $('dd#vmip').html(errortext);
    });
  };

  const getIP = () => {
    if ($('dd#pstate').html() === 'Running') {
      $.get(`../api/vm/${uuid}/ip`).done((json) => {
        let ul = '';
        if (json.Status === 'Success' && json.Value !== {}) {
          ul = $('<ul/>').addClass('list-unstyled pl-0');
          $('<li/>').html(`IPv4: ${json.Value['0/ip']}`).appendTo(ul);
          $('<li/>').html(`IPv6: ${json.Value['0/ipv6/0']}`).appendTo(ul);
        } else {
          ul = 'Contact Your Administrator for Assistance';
        }
        $('dd#vmip').html(ul);
      }).fail((error) => {
        errortext.html(`${error.status} ${error.statusText}`);
        $('dd#vmip').html(errortext);
      });
    } else {
      errortext.html('Sorry, IP is only available for running machines.');
      $('dd#vmip').html(errortext);
    }
  };

  $(document).ready(() => {
    $('#modal-metric-main').hide();
    getIP();
  });

  $('#vm-get-metrics').on('click', () => {
    $('#modal-metric').modal('show');
  });

  $('#modal-metric')
  .on('show.bs.modal', () => {
    getMetrics();
  })
  .on('hide.bs.modal', () => {
    $('#modal-metric-loading-bar').show();
    $('#modal-metric-main').hide();
  });
})(jQuery);
