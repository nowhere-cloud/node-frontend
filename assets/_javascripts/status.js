'use strict';

(($) => {
  // Human Readable Syslog Severity, also copied from source code
  const severity_Human = 'Emergency Alert Critical Error Warning Notice Informational, Debug'.split(' ');
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
        let _w = $('a').addClass('btn');
        _w.addClass(`btn-${severity_DOM[el._id]}`).attr('href',`/admin/log/severity/${severity_Human[el._id].toLowerCase()}`).html(severity_Human[el._id]);
        _w.appendTo('#severity');
      });
    }).fail((error) => {
      $('#severity').html(`${error.status} ${error.statusText}`);
    });
  };

  const loadTag = () => {
    $.get('/admin/log/tag').done((data) => {
      $('#tags').html('');
      $.each(data, (index, el) => {
        let _w = $('a').addClass('btn');
        _w.addClass('btn-secondary').attr('href',`/admin/log/tag/${el._id}`).html(el._id);
        _w.appendTo('#tags');
      });
    }).fail((error) => {
      $('#tags').html(`${error.status} ${error.statusText}`);
    });
  };

  const loadHostname = () => {
    $.get('/admin/log/hostname').done((data) => {
      $('#hostname').html('');
      $.each(data, (index, el) => {
        let _w = $('a').addClass('btn');
        _w.addClass('btn-secondary').attr('href',`/admin/log/tag/${el._id}`).html(el._id);
        _w.appendTo('#tags');
      });
    }).fail((error) => {
      $('#hostname').html(`${error.status} ${error.statusText}`);
    });
  };

  /**
   * Do these on load
   */
  $(document).ready(() => {
    let CheckMobile = new Mobile(); // eslint-disable-line no-undef
    if (!CheckMobile.check()) {
      loadHostname();
      loadSeverity();
      loadTag();
    }
  });
})(jQuery);
