"use strict";!function(t){var e=t("<div/>").addClass("list-group-item list-group-item-info").html("Not Available"),a=t("<div/>").addClass("list-group-item list-group-item-danger"),i="Emergency Alert Critical Error Warning Notice".split(" "),n=["danger","danger","danger","danger","warning","info"],s=new PrettyDate,l=function(){t.get("/status/api/ikoma").done(function(a){0===a.length?t("#status-health-metrics").html(e):(t("#status-health-metrics").html(""),t.each(a,function(e,a){var s=t("<div/>").addClass("list-group-item justify-content-between");if(a._id>=6)return!0;s.addClass("list-group-item-"+n[a._id]).html(i[a._id]),t("<span/>").addClass("badge badge-default badge-pill").html(a.count).appendTo(s),s.appendTo("#status-health-metrics")}))}).fail(function(e){a.html(e.status+" "+e.statusText),t("#status-health-metrics").html(a)})};t(document).ready(function(){(new Mobile).check()||(t("#now").html(s.getTodayDate()+" @ "+s.getCurrentTime()),l())})}(jQuery);