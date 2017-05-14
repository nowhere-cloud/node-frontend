'use strict';

//=include ../_javascripts/Date.js
//=include ../_javascripts/MobileCheck.js 

(($) => {

  /**
   * Generate two list-group-item for stats
   */
  const empty_stats = $('<div/>').addClass('list-group-item list-group-item-info').html('Not Available');
  const error_stats = $('<div/>').addClass('list-group-item list-group-item-danger');

  // Static List of endpoint nicknames
  const service_nicknames = ['umeda', 'tonda', 'ikeda', 'suita', 'yamada', 'sonoda'];
  // Human Readable Syslog Severity, also copied from source code
  const severity_Human = 'Emergency Alert Critical Error Warning Notice'.split(' ');
  // Severity Coloring for DOM
  const severity_DOM = ['danger', 'danger', 'danger', 'danger', 'warning', 'info'];
  // Date String
  const DateString = new PrettyDate(); // eslint-disable-line no-undef

  /**
   * Load Status from Endpoint
   */
  const loadStatus = () => {
    $.each(service_nicknames, (index, el) => {
      $.get(`/status/api/${el}`).done(() => {
        $(`#status-${el}`).removeClass('badge-default').addClass('badge-success').html('OK');
      }).fail(() => {
        $(`#status-${el}`).removeClass('badge-default').addClass('badge-danger').html('Error');
      });
    });
  };

  /**
   * Load Syslog Stats (on severity)
   */
  const loadStats = () => {
    $.get('/status/api/ikoma').done((data) => {
      if (data.length === 0) {
        $('#status-health-metrics').html(empty_stats);
      } else {
        $('#status-health-metrics').html('');
        $.each(data, (index, el) => {
          let _w = $('<div/>').addClass('list-group-item justify-content-between');
          // Informational and Debug Messages are meant noting to System Health, so we filter them
          if (el._id >= 6) {
            return true;
          } else {
            _w.addClass(`list-group-item-${severity_DOM[el._id]}`).html(severity_Human[el._id]);
            $('<span/>').addClass('badge badge-default badge-pill').html(el.count).appendTo(_w);
          }
          _w.appendTo('#status-health-metrics');
        });
      }
    }).fail((error) => {
      error_stats.html(`${error.status} ${error.statusText}`);
      $('#status-health-metrics').html(error_stats);
    });
  };

  /**
   * Do these on load
   */
  $(document).ready(() => {
    let CheckMobile = new Mobile(); // eslint-disable-line no-undef
    if (!CheckMobile.check()) {
      $('#now').html(`${DateString.getTodayDate()} @ ${DateString.getCurrentTime()}`);
      loadStatus();
      loadStats();
    }
  });
})(jQuery);
