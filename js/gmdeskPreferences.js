/*global air, DOMAssistant, $, $$ */
var gmdeskPreferences = function () {
	var googleAppsField = null;
	var googleAppsCheckbox = null;
	return {
		init : function () {
			var isGoogleApps = location.search.replace(/.*googleApps=(\w+).*/i, "$1") === "true";
			var mailURL = location.search.replace(/.*mailURL=((http(s)?\:\/\/)?[\w\.\/]+).*/i, "$1");
			var googleAppsField = $$("google-apps-url");
			googleAppsCheckbox = $$("google-apps");
			if (isGoogleApps && googleAppsField) {
				googleAppsField.value = mailURL;
				googleAppsCheckbox.checked = true;
			}
			$("#preferences-form").addEvent("submit", this.savePreferences);
		},
		
		savePreferences : function () {
			var url = $$("regular-gmail").value;
			var googleApps = $$("google-apps").checked;
			if (googleApps) {
				url = $$("google-apps-url").value;
			}
			window.opener.gmdesk.setPreferences(url, ((googleApps)? "true" : "false"));
			window.close();
			return false;
		}
	};
}();
DOMAssistant.DOMReady("gmdeskPreferences.init()");