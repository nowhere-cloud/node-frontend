"use strict";!function(t){var n="Emergency Alert Critical Error Warning Notice Informational, Debug".split(" "),a=["danger","danger","danger","danger","warning","primary","info","secondary"],e=(new PrettyDate,function(){t.get("/admin/log/severity").done(function(e){t("#severity").html(""),t.each(e,function(e,i){t("a").addClass("btn").addClass("btn-"+a[i._id]).attr("href","/admin/log/severity/"+n[i._id].toString().toLowerCase()).html(n[i._id]).appendTo("#severity")})}).fail(function(n){t("#severity").html(n.status+" "+n.statusText)})}),i=function(){t.get("/admin/log/tag").done(function(n){t("#tags").html(""),t.each(n,function(n,a){t("a").addClass("btn").addClass("btn-secondary").attr("href","/admin/log/tag/"+a._id).html(a._id).appendTo("#tags")})}).fail(function(n){t("#tags").html(n.status+" "+n.statusText)})},o=function(){t.get("/admin/log/hostname").done(function(n){t("#hostname").html(""),t.each(n,function(n,a){t("a").addClass("btn").addClass("btn-secondary").attr("href","/admin/log/hostname/"+a._id).html(a._id).appendTo("#hostname")})}).fail(function(n){t("#hostname").html(n.status+" "+n.statusText)})};t(document).ready(function(){(new Mobile).check()||(o(),e(),i())})}(jQuery);