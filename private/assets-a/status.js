"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,n,a){return n&&t(e.prototype,n),a&&t(e,a),e}}(),PrettyDate=function(){function t(){_classCallCheck(this,t),this.now=new Date}return _createClass(t,[{key:"getTodayDate",value:function(){return(this.now.getDate()<10?"0":"")+this.now.getDate()+"/"+(this.now.getMonth()+1<10?"0":"")+(this.now.getMonth()+1)+"/"+this.now.getFullYear()}},{key:"getCurrentTime",value:function(){return(this.now.getHours()<10?"0":"")+this.now.getHours()+":"+(this.now.getMinutes()<10?"0":"")+this.now.getMinutes()+":"+(this.now.getSeconds()<10?"0":"")+this.now.getSeconds()}},{key:"getJSDateObj",value:function(){return this.now}}]),t}(),Mobile=function(){function t(){_classCallCheck(this,t),this.ua=navigator.userAgent||navigator.vendor||window.opera}return _createClass(t,[{key:"check",value:function(){var t=!1;return function(e){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(t=!0)}(this.ua),t}},{key:"MyUA",value:function(){return this.ua}}]),t}();!function(t){var e="Emergency Alert Critical Error Warning Notice Informational Debug".split(" "),n=["danger","danger","danger","danger","warning","primary","info","secondary"],a=(new PrettyDate,function(){t.get("/admin/log/severity").done(function(a){t("#severity").html(""),t.each(a,function(a,i){var o=t("<a/>").addClass("btn btn-"+n[i._id]+" mr-1 mb-1");o.attr("href","/admin/log/severity/"+e[i._id].toLowerCase()).html(e[i._id]+" ("+i.count+")"),o.appendTo("#severity")})}).fail(function(e){t("#severity").html(e.status+" "+e.statusText)})}),i=function(e){t.get("/admin/log/"+e).done(function(n){t("#"+e).html(""),t.each(n,function(n,a){var i=t("<a/>").addClass("btn btn-secondary mr-1 mb-1");i.attr("href","/admin/log/"+e+"/"+a._id).html(a._id+" ("+a.count+")"),i.appendTo("#"+e)})}).fail(function(n){t("#"+e).html(n.status+" "+n.statusText)})};t(document).ready(function(){(new Mobile).check()||(a(),i("hostname"),i("tag"))})}(jQuery);