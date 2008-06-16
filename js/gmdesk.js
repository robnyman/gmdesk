/*extern air, $, $$ */
var gmdesk = function () {
	var loader = null;
	var prefsFile = null;
	var prefsFilePath = "preferences.xml";
	var mailURL = "http://mail.google.com/";
	var googleAppsSetting = false;
	var gmailWindow = null;
	var closeAllWindows = function () {
		var openedWindows = air.NativeApplication.nativeApplication.openedWindows;
		for (var i=0, il=openedWindows.length; i<il; i++) {
			openedWindows[i].close();
		}
	};
	return {
		
		init : function () {
			air.URLRequestDefaults.userAgent = air.URLRequestDefaults.userAgent + " Version\/3.0 Safari";
			var initOptions = new air.NativeWindowInitOptions();
			var bounds = new air.Rectangle(10, 10, 1000, 750);
			loader = air.HTMLLoader.createRootWindow(true, initOptions, true, bounds);
			this.getPreferences();
			this.loadContent();
			this.createAppmenu();
			window.visible = false;
		},
		
		getPreferences : function () {
			prefsFile = air.File.applicationStorageDirectory.resolvePath(prefsFilePath);
			var stream = new air.FileStream();
			if (prefsFile.exists) {
			    stream.open(prefsFile, air.FileMode.READ);
			    var prefsXML = stream.readUTFBytes(stream.bytesAvailable);
				stream.close();
				var domParser = new DOMParser();
				var prefsXMLContent = domParser.parseFromString(prefsXML, "text/xml");
				mailURL = prefsXMLContent.getElementsByTagName("mailURL")[0].firstChild.nodeValue;
				googleAppsSetting = prefsXMLContent.getElementsByTagName("googleApps")[0].firstChild.nodeValue === "true";
			}
		},
		
		setPreferences : function (url, googleApps) {
			var le = air.File.lineEnding;
			var prefsXML = "<?xml version='1.0' encoding='utf-8'?>" + le
			            + "<preferences>" + le 
			            + "	<mailURL>" + url + "</mailURL>" + le
						+ "	<googleApps>" + googleApps + "</googleApps>" + le
			            + "	<saveDate>" + new Date().toString() + "</saveDate>" + le
			            + "</preferences>";
			
			var stream = new air.FileStream();
			stream.open(prefsFile, air.FileMode.WRITE);
			stream.writeUTFBytes(prefsXML);
			stream.close();
			this.getPreferences();
			this.loadContent();
		},
		
		loadContent : function (url) {
			loader.load(new air.URLRequest(mailURL));
			try	{
				loader.window.moveTo((screen.width / 2) - (loader.window.innerWidth / 2), 50);
			}
			catch (e) {
				// To prevent potential reference errors
			}	
			loader.stage.nativeWindow.activate();
		},
		
		createAppmenu : function () {
			gmailWindow = air.NativeApplication.nativeApplication.openedWindows[1];
			if (gmailWindow) {
				gmailWindow.addEventListener(air.Event.CLOSING, function () {
					closeAllWindows();
				});
			
				var root = new air.NativeMenu();
				if (air.NativeApplication.supportsMenu) {
					air.NativeApplication.nativeApplication.menu = root;
				}
				else {
					air.NativeApplication.nativeApplication.openedWindows[1].menu = root;
				}
			
				// Main menu
				var mainMenuItem = root.addItem(new air.NativeMenuItem("GMDesk"));
				mainMenuItem.submenu = new air.NativeMenu();

				var preferences = new air.NativeMenuItem("Preferences");
				preferences.keyEquivalent = ",";
				preferences.addEventListener(air.Event.SELECT, function () {
					window.open(("preferences.html?googleApps=" + googleAppsSetting + "&mailURL=" + mailURL), "settings", "width=450, height=220");
				});
				mainMenuItem.submenu.addItem(preferences);
			
				var quit = new air.NativeMenuItem("Quit GMDesk");
				quit.keyEquivalent = "q";
				quit.addEventListener(air.Event.SELECT, function () {
					closeAllWindows();
				});
				mainMenuItem.submenu.addItem(quit);
			
				// Window menu
				var windowMenuItem = root.addItem(new air.NativeMenuItem("Window"));
				windowMenuItem.submenu = new air.NativeMenu();

				var minimize = new air.NativeMenuItem("Minimize");
				minimize.keyEquivalent = "m";
				minimize.addEventListener(air.Event.SELECT, function () {
					air.NativeApplication.nativeApplication.openedWindows[1].minimize();
				});
				windowMenuItem.submenu.addItem(minimize);
			
				var maximize = new air.NativeMenuItem("Maximize");
				maximize.addEventListener(air.Event.SELECT, function () {
					air.NativeApplication.nativeApplication.openedWindows[1].maximize();
				});
				windowMenuItem.submenu.addItem(maximize);
			
				var fullscreen = new air.NativeMenuItem("Fullscreen (Esc to return)");
				fullscreen.addEventListener(air.Event.SELECT, function () {
					air.NativeApplication.nativeApplication.openedWindows[1].stage.displayState = runtime.flash.display.StageDisplayState.FULL_SCREEN_INTERACTIVE;
				});
				windowMenuItem.submenu.addItem(fullscreen);
			
				var restore = new air.NativeMenuItem("Restore");
				restore.addEventListener(air.Event.SELECT, function () {
					air.NativeApplication.nativeApplication.openedWindows[1].restore();
				});
				windowMenuItem.submenu.addItem(restore);
			}
		}
	};
}();