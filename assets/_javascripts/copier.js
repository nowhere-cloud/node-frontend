'use strict';

// Admin -> Instances -> Clone
// For Fetching User ID during clone process
// UID #1 is not looked up on both server side & client side script

(($) => {
  let SubmitOK = false;

  /**
   * Fetch User Informations over API
   * @param {Number} uid User UID
   */
  const DataFetcher = (uid) => {
    $.get(`/admin/users/api/search/byid/${uid}`).done((data) => {
      if (data !== null || data !== {}) {
        $('#uidHelp').html(`User: ${data.username} (UID: #${data.id})`).addClass('text-muted');
        SubmitOK = true;
      } else {
        $('#uidHelp').html('User not found.').addClass('text-danger');
        SubmitOK = false;
      }
    }).fail((e) => {
      $('#uidHelp').html(`${e.status} ${e.statusText}, Try Again`).addClass('text-danger');
      SubmitOK = false;
    });
  };

  $('#uid').on('blur', function () {
    SubmitOK = false;
    $(this).removeClass('text-muted text-danger');
    setTimeout(() => {
      DataFetcher($(this).val());
    }, 500);
  });

  $('form').on('submit', function (e) {
    e.preventDefault();
    // Check if Submit is Ready
    if (SubmitOK === true) {
      $(this)[0].submit();
    } else {
      // For invalid User ID, Type check is handoffed to HTML5
      $('#uid').addClass('form-control-danger').parent().addClass('has-danger');
      $('#uidHelp').html('Please double-check the User ID Value.').removeClass('text-muted').addClass('text-danger');
      return false;
    }
  });

})(jQuery);
