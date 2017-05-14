'use strict';

// Admin / User -> Instances -> Provisioning
// Common Form Validation Rules

/**
 * Check if the given URL is HTTP
 * @param {String} url URL to be checked.
 */
const CheckURLProro = (url) => {
  return url.startsWith('http://');
};

/**
 * Calculate the "correct" memory size
 * @param {Number} number Source Size.
 * @param {String} unit Source Unit.
 * @return {Number} Siez in Byte
 */
const ToByte = (number, unit) => {
  if (unit === 'G') {
    return Number(number) * 1024 * 1024 * 1024;
  } else if (unit === 'M') {
    return Number(number) * 1024 * 1024;
  }
};

$('#kickstart').on('blur', function () {
  if (CheckURLProro($(this).val()) === true) {
    FormIsReady = true; // eslint-disable-line no-undef
  } else {
    FormIsReady = false; // eslint-disable-line no-undef
    $(this).setCustomValidity('Only Kickstart file hosted on Plain HTTP is accepted');
  }
});

$('#repo').on('blur', function () {
  if (CheckURLProro($(this).val()) === true) {
    FormIsReady = true; // eslint-disable-line no-undef
  } else {
    FormIsReady = false; // eslint-disable-line no-undef
    $(this).setCustomValidity('Only Plain HTTP Repository is accepted');
  }
});

$('#disk_size').on('blur', function () {
  if (ToByte($(this).val(), $('#disk_unit').val()) <= ToByte(8, 'G')) {
    FormIsReady = false; // eslint-disable-line no-undef
    $(this).setCustomValidity('Please enter a disk size that is larger than or equal to 8GB');
  } else {
    FormIsReady = true; // eslint-disable-line no-undef
  }
});

$('#ram_size').on('blur', function () {
  if (ToByte($(this).val(), $('#ram_unit').val()) <= ToByte(512, 'M')) {
    FormIsReady = false; // eslint-disable-line no-undef
    $(this).setCustomValidity('Please enter a memory size that is larger than or equal to 512MB');
  } else if (ToByte($(this).val(), $('#ram_unit').val()) >= ToByte(4, 'G')) {
    FormIsReady = false; // eslint-disable-line no-undef
    $(this).setCustomValidity('Please enter a memory size that is smaller than 4GB');
  } else {
    FormIsReady = true; // eslint-disable-line no-undef
  }
});
