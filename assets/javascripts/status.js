'use strict';

// https://stackoverflow.com/questions/7671965/how-to-reset-dom-after-manipulation

const service_nicknames = ['umeda', 'ikeda', 'namba', 'yamada', 'nigawa'];

(($) => {

  /**
   * Generate two list-group-item for stats
   */
  const empty_stats = $('<div/>').addClass('list-group-item').addClass('list-group-item-info').html('Not Available');
  const error_stats = $('<div/>').addClass('list-group-item').addClass('list-group-item-danger').html('Error Retreving System Statistics');

  /**
   * Load Status from Endpoint
   */
  const loadStatus = () => {
    $.each(service_nicknames, (index, el) => {
      // $.get('/status/api/' + el).done(() => {
      $.get('http://10.1.123.11/status/api/yamato-saidaiji' + el).done(() => {
        $('#status-' + el).removeClass('label-default').addClass('label-success').html('OK');
      }).fail(() => {
        $('#status-' + el).removeClass('label-default').addClass('label-danger').html('Error');
      });
    });
  };

  /**
   * Load Syslog Stats (on severity)
   */
  const loadStats = () => {
    $.get('/status/api/yamato-saidaiji').done((data) => {
      if (data.length === 0) {
        $('#status-health-metrics').html(empty_stats);
      } else {
        $('#status-health-metrics').html('');
        let _w = $('<div/>').addClass('list-group-item');
        $.each(data, (index, el) => {
          if (el._id === 7) {
            return true;
          } else {
            _w.html(el._id);
            $('<span/>').addClass('badge').html(el.count).appendTo(_w);
          }
          _w.appendTo('#status-health-metrics');
        });
      }
    }).fail(() => {
      $('#status-health-metrics').html(error_stats);
    });
  };

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

  /**
   * Do these on load
   */
  $(document).ready(() => {
    $(document).data('initial-status-check', $('#status-mothership').clone(true));
    $(document).data('initial-status-stats', $('#status-health-metrics').clone(true));
    loadStatus();
    loadStats();
  });
})(jQuery);
