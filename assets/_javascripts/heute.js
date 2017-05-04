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
        $('#modal-metric-loading-bar').hide();
        $('#modal-metric-main').show();
        // IP
        let ul = $('<ul/>').addClass('list-unstyled');
        $('<li/>').html(`IPv4: ${json.Value.networks['0/ip']}`).appendTo(ul);
        $('<li/>').html(`IPv6: ${json.Value.networks['0/ipv6/0']}`).appendTo(ul);
        if ($('dd#pstate').html() !== 'Running') {
          $('<li/>').addClass('text-danger').html('Data may not be accurate. Boot Your Instance and refresh this webpage to retreive the most accurate data.').appendTo(ul);
        }
        $('dd#vmip').html(ul);
      } else {
        errortext.html(`Contact Administrator: ${json.ErrorDescription}`).addClass('col-sm-12');
        $('#modal-metric-main').html(errortext);
        $('dd#vmip').html(errortext);
        $('#modal-metric-main').show();
      }
    }).fail((error) => {
      errortext.html(`${error.status} ${error.statusText}`);
      $('#modal-metric-main').html(errortext);
      $('dd#vmip').html(errortext);
      $('#modal-metric-main').show();
    });
  };

  $(document).ready(() => {
    $('#modal-metric-main').hide();
    getMetrics();
  });
})(jQuery);
