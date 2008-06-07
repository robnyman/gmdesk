/*extern air, $, $$ */
var gmdesk = function () {
	return {
		init : function () {
			air.URLRequestDefaults.userAgent = air.URLRequestDefaults.userAgent + " Version\/3.0 Safari";
			
			var initOptions = new air.NativeWindowInitOptions();
			var bounds = new air.Rectangle(10, 10, 1000, 750);
			
			var loader = air.HTMLLoader.createRootWindow(true, initOptions, true, bounds);
			loader.load(new air.URLRequest("http://mail.google.com/"));
			loader.window.moveTo((screen.width / 2) - (loader.window.innerWidth / 2), 50);
			loader.stage.nativeWindow.activate();
			
			window.close();
		}
	};
}();