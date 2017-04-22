'use strict';
(($) => {
  // Use Client Side Date instead of server side date
  const DateString = new PrettyDate(); // eslint-disable-line no-undef
  $(document).ready(() => {
    $('#now').html(`${DateString.getTodayDate()} @ ${DateString.getCurrentTime()}`);
  });
})(jQuery);
