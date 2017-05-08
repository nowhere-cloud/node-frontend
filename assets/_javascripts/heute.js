'use strict';

// Admin/Users - Instances - VM
// For Retreving Metrics + IP

(($) => {
  let uuid = $('p#uuid').html().trim();
  let verb = '';
  const errortext = $('<span/>').addClass('text-danger');

  const getMetrics = () => {
    $.get(`../api/vm/${uuid}/metrics`).done((json) => {
      if (json.Status === 'Success') {
        // Metrics
        $('#modal-metric-osname').html(json.Value.os_version.name);
        $('#modal-metric-kernel').html(json.Value.os_version.uname);
        $('#modal-metric-driver').html(`${json.Value.PV_drivers_version.major}.${json.Value.PV_drivers_version.minor}.${json.Value.PV_drivers_version.micro} build ${json.Value.PV_drivers_version.build}`);
        // IP
        $('#modal-ip-ipv4').html(json.Value.networks['0/ip']);
        $('#modal-ip-ipv6').html(json.Value.networks['0/ipv6/0']);
        if ($('dd#pstate').html() !== 'Running') {
          $('#modal-ip-alert').show();
        }
      } else {
        errortext.html(`Contact Administrator: ${json.ErrorDescription}`).addClass('col-sm-12');
        $('#modal-metric-main').html(errortext);
        $('#modal-ip-main').html(errortext);
      }
    }).fail((error) => {
      errortext.html(`${error.status} ${error.statusText}`);
      $('#modal-metric-main').html(errortext);
      $('#modal-ip-main').html(errortext);
    });
  };

  const getPState = () => {
    $.get(`../api/vm/${uuid}/pstate`).done((rsvp) => {
      if (rsvp.Status === 'Success') {
        console.log(rsvp);
        $('#pstate').html(rsvp.power_state);
      } else {
        errortext.html(`Contact Administrator: ${rsvp.ErrorDescription}`);
        $('#pstate').html(errortext);
      }
    }).fail((error) => {
      errortext.html(`${error.status} ${error.statusText}`);
      $('#pstate').html(errortext);
    });
  };

  // Unified Client for sending command
  const PostBoy = (action, payload, token) => {
    $.ajax({
      type: 'POST',
      url: `../api/vm/${uuid}/send`,
      data: {
        '_csrf': token,
        'action': action,
        'payload': payload
      },
      success: (data, status, xhr) => {
        $('#confirmation-loading').hide();
        $('#confirmation-field-rsvp-etktid').html(data.task);
        $('#confirmation-field-rsvp').show();
      },
      dataType: 'json'});
  };

  $(document).ready(() => {
    $('#modal-ip-alert').hide();
    $('#confirmation-loading').hide();
    $('#confirmation-field-rsvp').hide();
    setTimeout(() => {
      getPState();
    }, 1000);
    setTimeout(() => {
      getMetrics();
    }, 1500);
  });

  $('#refresh').on('click', () => {
    $('#modal-ip-alert').hide();
    setTimeout(() => {
      getPState();
    }, 1000);
    setTimeout(() => {
      getMetrics();
    }, 2000);
  });

  $('#managed-tool').on('click', '.vm-actions', function() {
    verb = $(this).data('action');
    $('#confirmation-field-uuid').html(uuid);
    $('#confirmation-field-verb').html(babel('action', verb)); // eslint-disable-line no-undef
    $('#confirmation-modal').modal('show');
  });

  $('#confirmation-confirm').on('click', function() {
    PostBoy(verb, {}, $(this).data('csrf'));
    $('#confirmation-loading').show();
    $(this).hide();
  });

})(jQuery);
