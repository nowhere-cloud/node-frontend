"use strict";!function(t){var n=t("<tr/>").addClass("table-danger"),i=t("<td/>").attr("colspan",7),e=function(){t("#dns-loadhere").load("/admin/dns/partials/list",function(e,d,a){"error"===d&&(i.html(a.status+" "+a.statusText),n.html(i),t(this).html(n))})},d=function(e){t("#edit-dns").load("/admin/dns/partials/form/"+e,function(e,d,a){t("#edit-loading-bar").hide(),t(this).show(),"error"===d&&(i.html(a.status+" "+a.statusText),n.html(i),t(this).html(n))})},a=function(t){return parseInt(t,10).toString(16)},s=function(t){var n=parseInt(t,10).toString(16);return 1===n.length?"0"+n:n},o=function(t){var n=t.trim().split(".");return"::FFFF:"+a(n[0])+s(n[1])+":"+a(n[2])+s(n[3])};t(document).ready(function(){e()}),t("#new-reset").on("click",function(n){t("#new-dns")[0].reset()}),t("#NewDNS").on("show.bs.modal",function(){t("#ip4-feedback").hide(),t("#new-dns")[0].reset()}),t("#EditDNS").on("show.bs.modal",function(){t("#edit-loading-bar").show(),t("#edit-dns").hide()}).on("hide.bs.modal",function(){t("#edit-dns").hide(),t("#edit-loading-bar").show()}),t("#new-dns").on("submit",function(n){return n.preventDefault(),""===t("#ipv4-new").val()?(t("#ipv4-new").addClass("form-control-danger"),!1):("A"===t("#dns-type-new").val()&&""===t("#ipv6-new").val()&&t("#ipv6-new").val(o(t("#ipv4-new").val())),"CNAME"===t("#dns-type-new").val()&&""===t("#optval-new").val()?(t("#optval-new").addClass("form-control-danger"),!1):void t(this)[0].submit())}),t("#edit-dns").on("change","#ip4-edit",function(n){4===t(this).val().split(".").length&&t("#ipv6-edit").val(o(t("#ipv4-new").val()))}),t("#edit-dns").on("submit","form.dns-edit-form",function(n){n.preventDefault(),""===t("#ip6-edit").val()&&t("#ip6-edit").val(o(t("#ip4-edit").val())),t(this)[0].submit()}),t("#dns-loadhere").on("click",".dns-edit",function(){d(t(this).data("entryid")),t("#EditDNS").modal("show")})}(jQuery);