'use strict';

// Admin - Syslog Viewer

//=require ../_javascripts/Date.js
//=require ../_javascripts/MobileCheck.js

(($) => {
  // Human Readable Syslog Severity, also copied from source code
  const severity_Human = 'Emergency Alert Critical Error Warning Notice Informational Debug'.split(' ');
  // Severity Coloring for DOM
  const severity_DOM = ['danger', 'danger', 'danger', 'danger', 'warning', 'primary', 'info', 'secondary'];
  // Date String
  const DateString = new PrettyDate(); // eslint-disable-line no-undef

  /**
   * Load Syslog Stats (on severity)
   */
  const loadSeverity = () => {
    $.get('/admin/log/severity').done((data) => {
      $('#severity').html('');
      $.each(data, (index, el) => {
        let _w = $('<a/>').addClass(`btn btn-${severity_DOM[el._id]} mr-1 mb-1`);
        _w.attr('href',`/admin/log/severity/${severity_Human[el._id].toLowerCase()}`).html(`${severity_Human[el._id]} (${el.count})`);
        _w.appendTo('#severity');
      });
    }).fail((error) => {
      $('#severity').html(`${error.status} ${error.statusText}`);
    });
  };

  const loadContent = (endpoint) => {
    $.get(`/admin/log/${endpoint}`).done((data) => {
      $(`#${endpoint}`).html('');
      $.each(data, (index, el) => {
        let _w = $('<a/>').addClass('btn btn-secondary mr-1 mb-1');
        _w.attr('href',`/admin/log/${endpoint}/${el._id}`).html(`${el._id} (${el.count})`);
        _w.appendTo(`#${endpoint}`);
      });
    }).fail((error) => {
      $(`#${endpoint}`).html(`${error.status} ${error.statusText}`);
    });
  };

  /**
   * Do these on load
   */
  $(document).ready(() => {
    let CheckMobile = new Mobile(); // eslint-disable-line no-undef
    if (!CheckMobile.check()) {
      loadSeverity();
      loadContent('hostname');
      loadContent('tag');
    }
  });
})(jQuery);
