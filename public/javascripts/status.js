'use strict';var service_nicknames=['umeda','ikeda','namba','yamada','nigawa'];(function(a){var b=function loadStatus(){service_nicknames.forEach(function(d){a.get('/status/api/'+d).done(function(){a('#status-'+d).removeClass('label-default').addClass('label-success').html('OK')}).fail(function(){a('#status-'+d).removeClass('label-default').addClass('label-danger').html('Error')})},void 0)},c=function loadStats(){a.get('/status/api/yamato-saidaiji').done(function(){var e=a('<div/>').addClass('list-group-item').addClass('list-group-item-danger').html('Error Retreving System Statistics');a('#status-health-metrics').html(e)}).fail(function(){var d=a('<div/>').addClass('list-group-item').addClass('list-group-item-danger').html('Error Retreving System Statistics');a('#status-health-metrics').html(d)})};a(document).ready(function(){a(document).data('initial-status-check',a('#status-mothership').clone(!0)),a(document).data('initial-status-stats',a('#status-health-metrics').clone(!0)),b(),c()}),a('#status-loader').on('mouseover',function(){a('#status-loader').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Refresh')}).on('mouseleave',function(){a('#status-loader').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>')}).on('click',function(){return a(document).data('initial-status-check').replaceAll('#status-mothership'),a(document).data('initial-status-stats').replaceAll('#status-health-metrics'),b(),c(),!1})})(jQuery);