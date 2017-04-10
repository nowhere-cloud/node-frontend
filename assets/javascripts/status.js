'use strict';

// No Worries, all comments are deleted when compilng

// Get Pretty Printed DateTime
// Adapted from http://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
// Optimized on ES6
class PrettyDate {
  /**
   * Creates an instance of PrettyDate.
   *
   * @memberOf PrettyDate
   */
  constructor() {
    this.now = new Date();
  }

  /**
   * Get Today's Date
   *
   * @returns {String} Today's Date
   *
   * @memberOf PrettyDate
   */
  getTodayDate() {
    return ((this.now.getDate() < 10) ? '0' : '') + this.now.getDate() + '/' + (((this.now.getMonth() + 1) < 10) ? '0' : '') + (this.now.getMonth() + 1) + '/' + this.now.getFullYear();
  }

  /**
   * Get Current Time
   *
   * @returns {String} Current Time
   *
   * @memberOf PrettyDate
   */
  getCurrentTime() {
    return ((this.now.getHours() < 10) ? '0' : '') + this.now.getHours() + ':' + ((this.now.getMinutes() < 10) ? '0' : '') + this.now.getMinutes() + ':' + ((this.now.getSeconds() < 10) ? '0' : '') + this.now.getSeconds();
  }

  /**
   * Get Created Raw JS Date Object
   *
   * @returns {Date} JavaScript Raw Date Object
   *
   * @memberOf PrettyDate
   */
  getJSDateObj() {
    return this.now;
  }
}

(($) => {

  /**
   * Generate two list-group-item for stats
   */
  const empty_stats = $('<div/>').addClass('list-group-item list-group-item-info').html('Not Available');
  const error_stats = $('<div/>').addClass('list-group-item list-group-item-danger').html('Error While Retreving System Statistics');

  // Static List of endpoint nicknames
  const service_nicknames = ['umeda', 'tonda', 'ikeda', 'suita', 'yamada', 'sonoda'];
  // Human Readable Syslog Severity, also copied from source code
  const severity_Human = 'Emergency Alert Critical Error Warning Notice'.split(' ');
  // Severity Coloring for DOM
  const severity_DOM = ['danger', 'danger', 'danger', 'danger', 'warning', 'info'];
  // Date String
  const DateString = new PrettyDate();

  /**
   * Load Status from Endpoint
   */
  const loadStatus = () => {
    $.each(service_nicknames, (index, el) => {
      $.get('/status/api/' + el).done(() => {
        $('#status-' + el).removeClass('badge-default').addClass('badge-success').html('OK');
      }).fail(() => {
        $('#status-' + el).removeClass('badge-default').addClass('badge-danger').html('Error');
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
            _w.addClass('list-group-item-' + severity_DOM[el._id]).html(severity_Human[el._id]);
            $('<span/>').addClass('badge badge-default badge-pill').html(el.count).appendTo(_w);
          }
          _w.appendTo('#status-health-metrics');
        });
      }
    }).fail((error) => {
      $('#status-health-metrics').html(error);
    });
  };

  /**
   * Do these on load
   */
  $(document).ready(() => {
    $('#now').html(DateString.getTodayDate() + ' @ ' + DateString.getCurrentTime());
    if ($('#load-status-please').length > 0) {
      loadStatus();
      loadStats();
    }
  });
})(jQuery);
