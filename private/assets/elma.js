"use strict";!function(t){var n=t("<tr/>").addClass("table-danger"),e=t("<td/>").attr("colspan",7),i=function(){t("#dns-loadhere").load("/users/dns/partials/list",function(i,d,s){"error"===d?(e.html(s.status+" "+s.statusText),n.html(e),t(this).html(n)):t(this).DataTable()})},d=function(i){t("#edit-dns").load("/users/dns/partials/form/"+i,function(i,d,s){t("#edit-loading-bar").hide(),t(this).show(),"error"===d&&(e.html(s.status+" "+s.statusText),n.html(e),t(this).html(n))})};t(document).ready(function(){i()}),t("#new-reset").on("click",function(n){t("#new-dns")[0].reset()}),t("#NewDNS").on("show.bs.modal",function(){t("#ip4-feedback").hide(),t("#new-dns")[0].reset()}),t("#EditDNS").on("show.bs.modal",function(){t("#edit-loading-bar").show(),t("#edit-dns").hide()}).on("hide.bs.modal",function(){t("#edit-dns").hide(),t("#edit-loading-bar").show()}),t("#new-dns").on("submit",function(n){return n.preventDefault(),"A"===t("#dns-type-new").val()&&""===t("#ipv4-new").val()?(t("#ipv4-new").addClass("form-control-danger"),!1):("A"===t("#dns-type-new").val()&&""===t("#ipv6-new").val()&&t("#ipv6-new").val(GenerateIP6(t("#ipv4-new").val())),"CNAME"===t("#dns-type-new").val()&&""===t("#optval-new").val()?(t("#optval-new").addClass("form-control-danger"),!1):void t(this)[0].submit())}),t("#edit-dns").on("change","#ip4-edit",function(n){4===t(this).val().split(".").length&&t("#ipv6-edit").val(GenerateIP6(t("#ipv4-new").val()))}),t("#edit-dns").on("submit","form.dns-edit-form",function(n){n.preventDefault(),""===t("#ip6-edit").val()&&t("#ip6-edit").val(GenerateIP6(t("#ip4-edit").val())),t(this)[0].submit()}),t("#dns-loadhere").on("click",".dns-edit",function(){d(t(this).data("entryid")),t("#EditDNS").modal("show")})}(jQuery);