'use strict';

//=include ../_javascripts/MobileCheck.js

(($) => {
  const replaceLink = (src) => {
    $('img#lightboximage').attr('src', src);
    $('a#lightboxlink').attr('href', src);
  };
  $(document).ready(() => {
    let CheckMobile = new Mobile(); // eslint-disable-line no-undef
    // This is indeed to use traditional function instead of ES6 Arrow
    // To make sure babel transpiler work correctly.
    $('.img-link').on('click', function (e) {
      e.preventDefault();
      if (CheckMobile.check() === true) {
        window.open($(this).attr('href'));
      } else {
        replaceLink($(this).attr('href'));
        $('#lightbox').modal('show');
      }
    });
  });
})(jQuery);
