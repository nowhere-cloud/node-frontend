'use strict';

// Admin -> Instances -> Clonning + Provisioning
// For Selecting Users

/**
 * Fetch User Informations over API
 * @param {Number} uid User UID
 */
const UserDataFetcher = (uid) => {
  $.get(`/admin/users/api/search/byid/${uid}`).done((data) => {
    if (data !== null || data !== {}) {
      $('#uidHelp').html(`User: ${data.username} (UID: #${data.id})`).addClass('text-muted');
      FormIsReady = true; // eslint-disable-line no-undef
    } else {
      $('#uidHelp').html('User not found.').addClass('text-danger');
      FormIsReady = false; // eslint-disable-line no-undef
    }
  }).fail((e) => {
    $('#uidHelp').html(`${e.status} ${e.statusText}, Try Again`).addClass('text-danger');
    FormIsReady = false; // eslint-disable-line no-undef
  });
};

$('#uid').on('blur', function () {
  FormIsReady = false; // eslint-disable-line no-undef
  $(this).removeClass('text-muted text-danger');
  setTimeout(() => {
    UserDataFetcher($(this).val());
  }, 500);
});
