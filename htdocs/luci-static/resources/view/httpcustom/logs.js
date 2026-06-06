'use strict';
'use ui';

var fs = require('fs');
var view = require('view');
var poll = require('poll');

return view.extend({
	render: function() {
		// สร้าง Elements สำหรับแสดงผล Log
		var logTextarea = E('textarea', {
			'class': 'cbi-input-textarea',
			'style': 'width: 100%; font-family: monospace; min-height: 400px; resize: vertical;',
			'readonly': 'readonly',
			'wrap': 'off'
		}, _('Loading logs...'));

		// Core Logic: ทำ Real-time Polling ทุกๆ 3 วินาที
		poll.add(function() {
			return L.resolveDefault(fs.read('/var/log/httpcustom.log'), _('No connection log found. Start the service first.'))
				.then(function(log_content) {
					// อัปเดตข้อความใน TextArea
					logTextarea.value = log_content;
					
					// Auto-scroll เลื่อนลงไปบรรทัดล่างสุดเสมอเมื่อมี Log ใหม่เข้ามา
					logTextarea.scrollTop = logTextarea.scrollHeight;
				});
		}, 3);

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', {}, _('HTTP Custom Connection Logs')),
			E('div', { 'class': 'cbi-map-descr' }, _('Real-time core engine outputs and injection status. Auto-refreshing.')),
			logTextarea
		]);
	},
	
	// ปิดปุ่ม Save/Apply ในหน้านี้ เนื่องจากเป็นหน้าแสดงผลอย่างเดียว
	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
