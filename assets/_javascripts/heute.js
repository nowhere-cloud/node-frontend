'use strict';

// Admin/Users - Instances - VM
// For Retreving Metrics + IP

//=include babelfillet.js

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
          $('#modal-ip-alert').removeClass('disabled');
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
    /* eslint-disable complexity */
    $.get(`../api/vm/${uuid}/pstate`).done((rsvp) => {
      if (rsvp.Status === 'Success') {
        $('#pstate').html(rsvp.Value.power_state);
        $.each(rsvp.Value.allowed_operations, (i, v) => {
          // Control the visibility of toolbar button
          switch(v) {
          case 'start':
            $('[data-action="set.vm.power_on"]').removeClass('disabled');
            break;
          case 'hard_shutdown':
            $('[data-action="set.vm.power_off"]').removeClass('disabled');
            break;
          case 'hard_reboot':
            $('[data-action="set.vm.power_reboot"]').removeClass('disabled');
            break;
          case 'suspend':
            $('[data-action="set.vm.power_suspend"]').removeClass('disabled');
            break;
          case 'resume':
            $('[data-action="set.vm.power_resume"]').removeClass('disabled');
            break;
          case 'clone':
            $('[data-action="do.vm.clone"]').removeClass('disabled');
            break;
          case 'destroy':
            $('[data-action="do.vm.destroy"]').removeClass('disabled');
            break;
          }
        });
      } else {
        errortext.html(`Contact Administrator: ${rsvp.ErrorDescription}`);
        $('#pstate').html(errortext);
      }
    }).fail((error) => {
      errortext.html(`${error.status} ${error.statusText}`);
      $('#pstate').html(errortext);
    });
  };
  /* eslint-enable */

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
        $('#confirmation-loading').addClass('disabled');
        $('#confirmation-field-rsvp-etktid').html(data.task);
        $('#confirmation-field-rsvp').removeClass('disabled');
        setTimeout(() => {
          $('#confirmation-modal').modal('hide');
          $('.vm-actions').addClass('disabled');
        }, 10000);
      },
      dataType: 'json'});
  };

  $(document).ready(() => {
    setTimeout(() => {
      getPState();
    }, 1000);
    setTimeout(() => {
      getMetrics();
    }, 1500);
  });

  $('#refresh').on('click', () => {
    $('#modal-ip-alert').addClass('disabled');
    setTimeout(() => {
      $('.vm-actions').addClass('disabled');
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
    if (verb === 'do.vm.clone') {
      // Clonging is handled on a special webpage
      window.location.href = `clone?t=${uuid}`;
    } else {
      $('#confirmation-modal').modal('show');
    }
  });

  $('#confirmation-confirm').on('click', function() {
    PostBoy(verb, {}, $(this).data('csrf'));
    $('#confirmation-loading').removeClass('disabled');
    $(this).addClass('disabled');
  });

})(jQuery);
