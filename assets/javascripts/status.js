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
    return ((this.now.getDate() < 10)?'0':'') + this.now.getDate() +'/'+(((this.now.getMonth()+1) < 10)?'0':'') + (this.now.getMonth()+1) +'/'+ this.now.getFullYear();
  }

  /**
   * Get Current Time
   * 
   * @returns {String} Current Time
   * 
   * @memberOf PrettyDate
   */
  getCurrentTime() {
    return ((this.now.getHours() < 10)?'0':'') + this.now.getHours() +':'+ ((this.now.getMinutes() < 10)?'0':'') + this.now.getMinutes() +':'+ ((this.now.getSeconds() < 10)?'0':'') + this.now.getSeconds();
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
  const empty_stats = $('<div/>').addClass('list-group-item').addClass('list-group-item-info').html('Not Available');
  const error_stats = $('<div/>').addClass('list-group-item').addClass('list-group-item-danger').html('Error While Retreving System Statistics');
  
  /**
   * Static List of endpoint nicknames
   */
  const service_nicknames = ['umeda', 'ikeda', 'namba', 'yamada', 'nigawa'];
  const DateString = new PrettyDate();

  /**
   * Load Status from Endpoint
   */
  const loadStatus = () => {
    $.each(service_nicknames, (index, el) => {
      $.get('/status/api/' + el).done(() => {
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
    $.get('http://10.1.123.11/status/api/yamato-saidaiji').done((data) => {
      if (data.length === 0) {
        $('#status-health-metrics').html(empty_stats);
      } else {
        $('#status-health-metrics').html('');
        $.each(data, (index, el) => {
          let _w = $('<div/>').addClass('list-group-item');
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
   * Code Removed due to no-reason to include refresh button
   */
  /*
  $('#status-loader').on('mouseover', () => {
    $('#status-loader').html('<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span> Refresh');
  }).on('mouseleave', () => {
    $('#status-loader').html('<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span>');
  }).on('click', () => {
    $(document).data('initial-status-check').replaceAll('#status-mothership');
    $(document).data('initial-status-stats').replaceAll('#status-health-metrics');
    loadStatus();
    loadStats();
    return false;
  });
  */

  /**
   * Do these on load
   */
  $(document).ready(() => {
    /*
    // https://stackoverflow.com/questions/7671965/how-to-reset-dom-after-manipulation
    $(document).data('initial-status-check', $('#status-mothership').clone(true));
    $(document).data('initial-status-stats', $('#status-health-metrics').clone(true));
    */
    loadStatus();
    loadStats();
    $('#now').html(DateString.getTodayDate() + ' @ ' + DateString.getCurrentTime());
  });
})(jQuery);
