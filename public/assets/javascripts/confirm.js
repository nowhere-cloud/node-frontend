"use strict";!function(n){var t=n("#password").get(0),e=n("#cfm_password").get(0),o=n("#generatedPassword").get(0),a=n("#passwordGenerate"),r="",i=function(){t.value!==e.value?e.setCustomValidity("Passwords Don't Match"):e.setCustomValidity("")};t.onchange=i,e.onkeyup=i;var s=function(){var n=Math.random().toString(36).slice(-10),t=Math.random().toString(36).slice(-10);return String(n+t).replace(/\./g,"a").split("").sort(function(){return.5-Math.random()}).join("")},c=function(){r=s(),o.innerHTML=r};n(document).ready(function(){n("#generatePasswordNow").on("click",function(){c()}),n("#ApplyGenerated").on("click",function(){t.value=e.value=r,a.modal("hide")}),a.on("show.bs.modal",function(){c()})})}(jQuery);