"use strict";!function(t){var n=t("<tr/>").addClass("table-danger"),e=t("<td/>").attr("colspan",7),i=function(){t("#dns-loadhere").load("/admin/dns/partials/list",function(i,d,s){"error"===d&&(e.html(s.status+" "+s.statusText),n.html(e),t("#dns-loadhere").html(n))})},d=function(i){t("#edit-dns").load("/admin/dns/partials/form/"+i,function(i,d,s){t("#edit-loading-bar").hide(),t("#edit-dns").show(),"error"===d&&(e.html(s.status+" "+s.statusText),n.html(e),t("#edit-dns").html(n))})},s=function(t){return/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g.test(t)},o=function(t){return parseInt(t,10).toString(16)},a=function(t){var n=t.trim().split(".");return"::FFFF:"+o(n[0])+o(n[1])+":"+o(n[2])+o(n[3])};t(document).ready(function(){setTimeout(function(){i()},2e3)}),t("#new-reset").on("click",function(n){t("#new-dns")[0].reset()}),t("#NewDNS").on("show.bs.modal",function(){t("#new-dns")[0].reset()}),t("#EditDNS").on("show.bs.modal",function(){t("#edit-loading-bar").show(),t("#edit-dns").hide()}).on("hide.bs.modal",function(){t("#edit-dns").hide(),t("#edit-loading-bar").show()}),t("#new-dns").on("submit",function(n){if(n.preventDefault(),s(t("#ipv4-new").value()))return t("#ipv4-new").addClass("form-control-danger"),t("#ip4-feedback").show(),!1;""===t("#ipv6-new").value()&&t("#ipv6-new").value(a(t("#ipv4-new").value())),this.submit()}),t("#edit-dns").on("submit",".dns-edit-form",function(n){if(n.preventDefault(),s(t("#ipv4-edit").value()))return t("#ipv4-edit").addClass("form-control-danger"),t("#ip4-edit-feedback").show(),!1;""===t("#ipv6-edit").value()&&t("#ipv6-edit").value(a(t("#ipv4-new").value())),this.submit()}),t("#dns-loadhere").on("click",".dns-edit",function(){d(t(this).data("entryid")),t("#EditDNS").modal("show")})}(jQuery);