"use strict";!function(t){var a=t("<tr/>").addClass("table-danger"),n=t("<td/>").attr("colspan",3),s=function(){t("#VM-loadhere").load("/admin/instances/partials/vm-list-hyp",function(s,r,e){"error"===r&&(n.html(e.status+" "+e.statusText),a.html(n),t(this).html(a))})};t(document).ready(function(){s()})}(jQuery);