'use strict';
'use ui';

var form = require('form');
var view = require('view');
var uci = require('uci');

return view.extend({
	load: function() {
		return Promise.all([ L.resolveDefault(uci.load('httpcustom'), {}) ]);
	},

	render: function(data) {
		var m, s, o;

		m = new form.Map('httpcustom', _('HTTP Custom Tunnel'), _('Multi-protocol tunneling and injection client.'));

		s = m.section(form.NamedSection, 'main', 'global', _('Global Settings'));
		s.anonymous = true;
		o = s.option(form.Flag, 'enabled', _('Enable Service'));
		o.rmempty = false;

		s = m.section(form.TypedSection, 'profile', _('Tunnel Configurations'));
		s.anonymous = true;
		s.addremove = true;

		o = s.option(form.ListValue, 'proto', _('Protocol'));
		o.value('ssh', 'SSH Tunnel');
		o.value('vless', 'VLESS (Xray)');
		o.value('ovpn', 'OpenVPN');
		o.default = 'ssh';

		// เพิ่ม Connection Mode สำหรับจัดกลุ่มวิธีเชื่อมต่อ
		o = s.option(form.ListValue, 'mode', _('Connection Mode'));
		o.value('direct', 'Direct (ต่อตรง)');
		o.value('payload', 'HTTP Payload Injector');
		o.value('ssl', 'SSL/TLS (SNI)');
		o.default = 'payload';

		o = s.option(form.Value, 'server', _('Server Host / IP'));
		o.rmempty = false; o.datatype = 'host';

		o = s.option(form.Value, 'port', _('Port'));
		o.rmempty = false; o.datatype = 'port';

		o = s.option(form.Value, 'username', _('Username'));
		o.depends('proto', 'ssh'); o.depends('proto', 'ovpn');

		o = s.option(form.Value, 'password', _('Password / UUID'));
		o.password = true;

		o = s.option(form.Value, 'payload', _('Payload'));
		o.depends('mode', 'payload');
		o.placeholder = 'GET http://bug.com/ HTTP/1.1\\r\\nHost: bug.com\\r\\n\\r\\n';

		o = s.option(form.Value, 'sni', _('SNI Bug Host'));
		o.depends('mode', 'ssl');
		o.depends('proto', 'vless');

		return m.render();
	}
});
