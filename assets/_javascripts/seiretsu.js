'use strict';

(($) => {
  $(document).ready(() => {
    $('#tasks-loadhere').DataTable({
      'ajax': {
        'url': '/admin/tasks/api',
        'dataSrc': '',
        'deferRender': true
      },
      'columns': [
        { 'data': 'uuid' },
        { 'data': 'createdAt' },
        { 'data': 'task' },
        { 'data': 'payload' },
        { 'data': 'sent' },
        { 'data': 'response'}
      ]
    });
  });
})(jQuery);
