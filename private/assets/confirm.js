"use strict";!function(e){var n=e("#password").get(0),o=e("#cfm_password").get(0),t=e("#generatedPassword").get(0),a=e("#passwordGenerate"),s="",r=function(){n.value!==o.value?o.setCustomValidity("Passwords Don't Match"):o.setCustomValidity("")};n.onchange=r,o.onkeyup=r;var u=function(){s=GeneratePasswordFunction(),t.innerHTML=s};e(document).ready(function(){e("#generatePasswordNow").on("click",function(){u()}),e("#ApplyGenerated").on("click",function(){n.value=o.value=s,a.modal("hide")}),a.on("show.bs.modal",function(){u()})})}(jQuery);