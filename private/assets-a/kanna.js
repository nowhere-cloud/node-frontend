"use strict";var DEC2HEX=function(t){return parseInt(t,10).toString(16)},DEC2HEXp=function(t){var n=parseInt(t,10).toString(16);return 1===n.length?"0"+n:n},GenerateIP6=function(t){var n=t.trim().split(".");return"::FFFF:"+DEC2HEX(n[0])+DEC2HEXp(n[1])+":"+DEC2HEX(n[2])+DEC2HEXp(n[3])};!function(t){var n=t("<tr/>").addClass("table-danger"),e=t("<td/>").attr("colspan",7),a=function(){t("#dns-loadhere").load("/admin/dns/partials/list",function(a,i,d){"error"===i?(e.html(d.status+" "+d.statusText),n.html(e),t(this).html(n)):t(this).DataTable()})},i=function(a){t("#edit-dns").load("/admin/dns/partials/form/"+a,function(a,i,d){t("#edit-loading-bar").hide(),t(this).show(),"error"===i&&(e.html(d.status+" "+d.statusText),n.html(e),t(this).html(n))})};t(document).ready(function(){a()}),t("#new-reset").on("click",function(n){t("#new-dns")[0].reset()}),t("#NewDNS").on("show.bs.modal",function(){t("#ip4-feedback").hide(),t("#new-dns")[0].reset()}),t("#EditDNS").on("show.bs.modal",function(){t("#edit-loading-bar").show(),t("#edit-dns").hide()}).on("hide.bs.modal",function(){t("#edit-dns").hide(),t("#edit-loading-bar").show()}),t("#new-dns").on("submit",function(n){return n.preventDefault(),"A"===t("#dns-type-new").val()&&""===t("#ipv4-new").val()?(t("#ipv4-new").addClass("form-control-danger").parent().addClass("has-danger"),!1):("A"===t("#dns-type-new").val()&&""===t("#ipv6-new").val()&&t("#ipv6-new").val(GenerateIP6(t("#ipv4-new").val())),"CNAME"===t("#dns-type-new").val()&&""===t("#optval-new").val()?(t("#optval-new").addClass("form-control-danger").parent().addClass("has-danger"),!1):void t(this)[0].submit())}),t("#edit-dns").on("change","#ip4-edit",function(n){4===t(this).val().split(".").length&&t("#ipv6-edit").val(GenerateIP6(t("#ipv4-new").val()))}),t("#edit-dns").on("submit","form.dns-edit-form",function(n){n.preventDefault(),""===t("#ip6-edit").val()&&t("#ip6-edit").val(GenerateIP6(t("#ip4-edit").val())),t(this)[0].submit()}),t("#dns-loadhere").on("click",".dns-edit",function(){i(t(this).data("entryid")),t("#EditDNS").modal("show")})}(jQuery);