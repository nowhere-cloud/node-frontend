'use strict';var _createClass=function(){function a(b,c){for(var e,d=0;d<c.length;d++)e=c[d],e.enumerable=e.enumerable||!1,e.configurable=!0,'value'in e&&(e.writable=!0),Object.defineProperty(b,e.key,e)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var PrettyDate=function(){function a(){_classCallCheck(this,a),this.now=new Date}return _createClass(a,[{key:'getTodayDate',value:function getTodayDate(){return(10>this.now.getDate()?'0':'')+this.now.getDate()+'/'+(10>this.now.getMonth()+1?'0':'')+(this.now.getMonth()+1)+'/'+this.now.getFullYear()}},{key:'getCurrentTime',value:function getCurrentTime(){return(10>this.now.getHours()?'0':'')+this.now.getHours()+':'+(10>this.now.getMinutes()?'0':'')+this.now.getMinutes()+':'+(10>this.now.getSeconds()?'0':'')+this.now.getSeconds()}},{key:'getJSDateObj',value:function getJSDateObj(){return this.now}}]),a}();(function(a){var b=a('<div/>').addClass('list-group-item').addClass('list-group-item-info').html('Not Available'),c=a('<div/>').addClass('list-group-item').addClass('list-group-item-danger').html('Error While Retreving System Statistics'),d=['umeda','ikeda','namba','yamada','nigawa'],e=new PrettyDate,f=function loadStatus(){a.each(d,function(h,j){a.get('/status/api/'+j).done(function(){a('#status-'+j).removeClass('label-default').addClass('label-success').html('OK')}).fail(function(){a('#status-'+j).removeClass('label-default').addClass('label-danger').html('Error')})})},g=function loadStats(){a.get('/status/api/yamato-saidaiji').done(function(h){0===h.length?a('#status-health-metrics').html(b):(a('#status-health-metrics').html(''),a.each(h,function(j,k){var l=a('<div/>').addClass('list-group-item');if(7===k._id)return!0;l.html(k._id),a('<span/>').addClass('badge').html(k.count).appendTo(l);l.appendTo('#status-health-metrics')}))}).fail(function(){a('#status-health-metrics').html(c)})};a(document).ready(function(){f(),g(),a('#now').html(e.getTodayDate()+' @ '+e.getCurrentTime())})})(jQuery);