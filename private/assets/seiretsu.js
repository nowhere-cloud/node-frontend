"use strict";!function(a){a(document).ready(function(){a("#tasks-loadhere").DataTable({ajax:{url:"/admin/tasks/api",dataSrc:"",deferRender:!0},columns:[{data:"uuid"},{data:"createdAt"},{data:"task"},{data:"payload"},{data:"sent"},{data:"response"}]})})}(jQuery);