'use strict';

/**
 * Fetch Accepted Network Values
 */
const FetchNetwork = () => {
  $.get('../api/net/allowed_values').done((data) => {
    if (data.Status === 'Success' && data.Value !== []) {
      return data.Value;
    } else {
      FormIsReady = false; // eslint-disable-line no-undef
      return ['ENONET'];
    }
  }).fail((e) => {
    FormIsReady = false; // eslint-disable-line no-undef
    return [`E${e.status}`];
  });
};
