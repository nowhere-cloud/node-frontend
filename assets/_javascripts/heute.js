'use strict';

// Admin/Users - Instances - VM
// For Retreving Metrics + IP

(($) => {
  let uuid = $('p#uuid').html().trim();
  const errortext = $('<span/>').addClass('text-danger');

  const getMetrics = () => {
    $.get(`../api/vm/${uuid}/metrics`).done((json) => {
      if (json.Status === 'Success') {
        // Metrics
        if (json.Value.PV_drivers_detected === true) {
          $('#modal-metric-osname').html(json.Value.os_version.name);
          $('#modal-metric-kernel').html(json.Value.os_version.uname);
          $('#modal-metric-driver').html(`${json.Value.PV_drivers_version.major}.${json.Value.PV_drivers_version.minor}.${json.Value.PV_drivers_version.micro}.${json.Value.PV_drivers_version.build}`);
        } else {
          $('#modal-metric-osname').html('');
          $('#modal-metric-kernel').html('');
          $('#modal-metric-driver').html('Contact Administrator');
        }
        // IP
        $('#modal-ip-ipv4').html(`IPv4: ${json.Value.networks['0/ip']}`);
        $('#modal-ip-ipv6').html(`IPv6: ${json.Value.networks['0/ipv6/0']}`);
        if ($('dd#pstate').html() !== 'Running') {
          $('#modal-ip-alert').show();
        }
        $('.loading-bar').hide();
        $('#modal-metric-main').show();
        $('#modal-ip-main').show();
      } else {
        errortext.html(`Contact Administrator: ${json.ErrorDescription}`).addClass('col-sm-12');
        $('#modal-metric-main').html(errortext);
        $('#modal-ip-main').html(errortext);
        $('.loading-bar').hide();
        $('#modal-metric-main').show();
        $('#modal-ip-main').show();
      }
    }).fail((error) => {
      errortext.html(`${error.status} ${error.statusText}`);
      $('#modal-metric-main').html(errortext);
      $('#modal-ip-main').html(errortext);
      $('.loading-bar').hide();
      $('#modal-metric-main').show();
      $('#modal-ip-main').show();
    });
  };

  $(document).ready(() => {
    $('#modal-ip-alert').hide();
    $('#modal-metric-main').hide();
    $('#modal-ip-main').hide();
    getMetrics();
  });
})(jQuery);
