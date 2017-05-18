'use strict';

// Admin- Templates
// For Controlling tagger

//=include ../_javascripts/babelfillet.js

(($) => {
  let uuid = $('p#uuid').html().trim();
  let verb = '';
  let tagged = false;
  const errortext = $('<span/>').addClass('text-danger');

  /* eslint-disable complexity */
  const determieTagsControl = () => {
    let tagList = $('ul#tags li');
    tagList.each((index, el) => {
      if ($(el).text() === 'templates-publicise') {
        tagged = true;
      }
    });
    if (tagged === true) {
      $('.vm-actions[data-action="untag"]').removeClass('disabled');
    } else {
      $('.vm-actions[data-action="tag"]').removeClass('disabled');
    }
  };
  /* eslint-enable */

  // Unified Client for sending command
  const PostBoy = (action, payload, token) => {
    $.ajax({
      type: 'POST',
      url: `../api/vm/${uuid}/${action}`,
      data: {
        '_csrf': token,
        'payload': payload
      },
      success: (data, status, xhr) => {
        $('#confirmation-loading').hide();
        $('#confirmation-field-rsvp-etktid').html(data.task);
        $('#confirmation-field-rsvp').show();
        setTimeout(() => {
          $('#confirmation-modal').modal('hide');
          $('.vm-actions').hide();
        }, 10000);
      },
      dataType: 'json'});
  };

  $(document).ready(() => {
    determieTagsControl();
  });

  $('#managed-tool').on('click', '.vm-actions', function() {
    verb = $(this).data('action');
    $('#confirmation-field-uuid').html(uuid);
    $('#confirmation-field-verb').html(babel('action', verb)); // eslint-disable-line no-undef
    $('#confirmation-modal').modal('show');
  });

  $('#confirmation-confirm').on('click', function() {
    PostBoy(verb, { tag: 'templates-publicise' }, $(this).data('csrf'));
    $('#confirmation-loading').show();
    $(this).hide();
  });

})(jQuery);
