"use strict";!function(t){t(document).ready(function(){var s=t("<div/>").addClass("alert alert-danger mb-0");t("#dns-loadhere").load("/users/dns/partials/list",function(a,e,r){"error"===e&&(s.html(r.status+" "+r.statusText),t("#dns-loadhere").html(s))})})}(jQuery);