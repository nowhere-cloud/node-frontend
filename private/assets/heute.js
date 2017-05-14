"use strict";!function(i){var e=i("p#uuid").html().trim(),t="",a=i("<span/>").addClass("text-danger"),o=function(){i.get("../api/vm/"+e+"/metrics").done(function(e){"Success"===e.Status?(i("#modal-metric-osname").html(e.Value.os_version.name),i("#modal-metric-kernel").html(e.Value.os_version.uname),i("#modal-metric-driver").html(e.Value.PV_drivers_version.major+"."+e.Value.PV_drivers_version.minor+"."+e.Value.PV_drivers_version.micro+" build "+e.Value.PV_drivers_version.build),i("#modal-ip-ipv4").html(e.Value.networks["0/ip"]),i("#modal-ip-ipv6").html(e.Value.networks["0/ipv6/0"]),"Running"!==i("dd#pstate").html()&&i("#modal-ip-alert").removeClass("invisible")):(a.html("Contact Administrator: "+e.ErrorDescription).addClass("col-sm-12"),i("#modal-metric-main").html(a),i("#modal-ip-main").html(a))}).fail(function(e){a.html(e.status+" "+e.statusText),i("#modal-metric-main").html(a),i("#modal-ip-main").html(a)})},s=function(){i.get("../api/vm/"+e+"/pstate").done(function(e){"Success"===e.Status?(i("#pstate").html(e.Value.power_state),i.each(e.Value.allowed_operations,function(e,t){switch(t){case"start":i('[data-action="set.vm.power_on"]').removeClass("invisible");break;case"hard_shutdown":i('[data-action="set.vm.power_off"]').removeClass("invisible");break;case"hard_reboot":i('[data-action="set.vm.power_reboot"]').removeClass("invisible");break;case"suspend":i('[data-action="set.vm.power_suspend"]').removeClass("invisible");break;case"resume":i('[data-action="set.vm.power_resume"]').removeClass("invisible");break;case"clone":i('[data-action="do.vm.clone"]').removeClass("invisible");break;case"destroy":i('[data-action="do.vm.destroy"]').removeClass("invisible")}})):(a.html("Contact Administrator: "+e.ErrorDescription),i("#pstate").html(a))}).fail(function(e){a.html(e.status+" "+e.statusText),i("#pstate").html(a)})},n=function(t,a,o){i.ajax({type:"POST",url:"../api/vm/"+e+"/send",data:{_csrf:o,action:t,payload:a},success:function(e,t,a){i("#confirmation-loading").addClass("invisible"),i("#confirmation-field-rsvp-etktid").html(e.task),i("#confirmation-field-rsvp").removeClass("invisible"),setTimeout(function(){i("#confirmation-modal").modal("hide"),i(".vm-actions").addClass("invisible")},1e4)},dataType:"json"})};i(document).ready(function(){setTimeout(function(){s()},1e3),setTimeout(function(){o()},1500)}),i("#refresh").on("click",function(){i("#modal-ip-alert").addClass("invisible"),setTimeout(function(){i(".vm-actions").addClass("invisible"),s()},1e3),setTimeout(function(){o()},2e3)}),i("#managed-tool").on("click",".vm-actions",function(){t=i(this).data("action"),i("#confirmation-field-uuid").html(e),i("#confirmation-field-verb").html(babel("action",t)),"do.vm.clone"===t?window.location.href="clone?t="+e:i("#confirmation-modal").modal("show")}),i("#confirmation-confirm").on("click",function(){n(t,{},i(this).data("csrf")),i("#confirmation-loading").removeClass("invisible"),i(this).addClass("invisible")})}(jQuery);