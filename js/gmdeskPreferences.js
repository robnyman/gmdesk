/*global air, DOMAssistant, $, $$ */
var gmdeskPreferences = function () {
	var gmdesk = window.opener.gmdesk;
	var googleAppsDomain = null;
	return {
		init : function () {
			var isGoogleApps = gmdesk.googleApps;
			var domain = gmdesk.domain;
			var startService = gmdesk.startService;
			$("input[name=startup-service][value=" +  startService + "]").each(function () {
				this.checked = true;
			});
			googleAppsDomain = $$("google-apps-domain");
			var googleAppsCheckbox = $$("google-apps");
			googleAppsDomain.addEvent("click", function (evt) {
				if (/Your\sGoogle\sApps\sdomain/i.test(this.value)) {
					this.select();
				}
			});
			if (isGoogleApps && googleAppsDomain && googleAppsCheckbox) {
				googleAppsDomain.value = domain;
				googleAppsCheckbox.checked = true;
			}
			$("#preferences-form").addEvent("submit", this.savePreferences);
		},
		
		savePreferences : function () {
			var regular = $$("regular-services").checked,
				service = (regular)? "regular" : "googleApps",
				domain = "None";
			if (!regular) {
				domain = googleAppsDomain.value;
			}
			var startupService = "mail";
			$("input[name=startup-service]").each(function () {
				if (this.checked) {
					startupService = this.value;
				}
			});
			window.opener.gmdesk.setPreferences(service, domain, startupService);
			window.close();
			return false;
		}
	};
}();
DOMAssistant.DOMReady("gmdeskPreferences.init()");