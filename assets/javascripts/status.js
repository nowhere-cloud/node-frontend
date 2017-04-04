
'use strict';

// https://stackoverflow.com/questions/7671965/how-to-reset-dom-after-manipulation

const service_nicknames = ['umeda', 'ikeda', 'namba', 'yamada', 'nigawa'];

(($) => {

  /**
   * Load System Status
   */
  const loadStatus = () => {
    service_nicknames.forEach(function (element) {
      $.get('/status/api/' + element).done(() => {
        $('#status-' + element).removeClass('label-default').addClass('label-success').html('OK');
      }).fail(() => {
        $('#status-' + element).removeClass('label-default').addClass('label-danger').html('Error');
      });
    }, this);
  };

  /**
   * Load Simple Syslog Stats (on severity)
   */
  const loadStats = () => {
    $.get('/status/api/yamato-saidaiji').done((data) => {
      let generated = $('<div/>')
        .addClass('list-group-item')
        .addClass('list-group-item-danger')
        .html('Error Retreving System Statistics');
      $('#status-health-metrics').html(generated);
    }).fail(() => {
      let generated = $('<div/>')
        .addClass('list-group-item')
        .addClass('list-group-item-danger')
        .html('Error Retreving System Statistics');
      $('#status-health-metrics').html(generated);
    });
  };

  /**
   * Do these on load
   */
  $(document).ready(() => {
    $(document).data('initial-status-check', $('#status-mothership').clone(true));
    $(document).data('initial-status-stats', $('#status-health-metrics').clone(true));
    loadStatus();
    loadStats();
  });

  /**
   * The Refresh Button
   */
  $('#status-loader').on('mouseover', () => {
    $('#status-loader').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Refresh');
  }).on('mouseleave', () => {
    $('#status-loader').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>');
  }).on('click', () => {
    $(document).data('initial-status-check').replaceAll('#status-mothership');
    $(document).data('initial-status-stats').replaceAll('#status-health-metrics');
    loadStatus();
    loadStats();
    return false;
  });
})(jQuery);
