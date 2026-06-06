include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-httpcustom
PKG_VERSION:=1.1.0
PKG_RELEASE:=1

PKG_MAINTAINER:=System Architect
PKG_LICENSE:=MIT

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-httpcustom
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=HTTP Custom Multi-Protocol Tunnel
  PKGARCH:=all
  # Core Logic: ดึงเครื่องมือทั้งหมดที่ต้องใช้ร้อยท่อแบบ Android App
  DEPENDS:=+luci-base +python3-light +stunnel +openvpn-openssl +xray-core +kmod-tcp-bbr +iptables-mod-conntrack-extra
endef

define Build/Compile
endef

define Package/luci-app-httpcustom/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./root/etc/config/httpcustom $(1)/etc/config/
	
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./root/etc/init.d/httpcustom $(1)/etc/init.d/

	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./root/usr/bin/httpcustom_core $(1)/usr/bin/
	$(INSTALL_BIN) ./root/usr/bin/httpcustom_payload.py $(1)/usr/bin/
	
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./root/usr/share/luci/menu.d/httpcustom.json $(1)/usr/share/luci/menu.d/
	
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/httpcustom
	$(INSTALL_DATA) ./htdocs/luci-static/resources/view/httpcustom/logs.js $(1)/www/luci-static/resources/view/httpcustom/
	$(INSTALL_DATA) ./htdocs/luci-static/resources/view/httpcustom/main.js $(1)/www/luci-static/resources/view/httpcustom/
endef

$(eval $(call BuildPackage,luci-app-httpcustom))
