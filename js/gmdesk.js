/*extern air, $, $$ */
var gmdesk = function () {
	var loader = null;
	var prefsFile = null;
	var prefsFilePath = "preferences.xml";
	var regular = {
		mail : "http://mail.google.com/",
		calendar : "http://www.google.com/calendar/render",
		docs : "http://docs.google.com/"
	},
	var appsBase = {
		mail : "http://mail.google.com/a/",
		calendar : "http://www.google.com/calendar/a/",
		docs : "http://docs.google.com/a/"
	},
	var apps = {
		mail : "http://mail.google.com/",
		calendar : "http://www.google.com/calendar/render",
		docs : "http://docs.google.com/",
		maps : "http://maps.google.com/",
	};
	var startServiceURL = apps.mail;
	var gmailWindow = null;
	var closeAllWindows = function () {
		var openedWindows = air.NativeApplication.nativeApplication.openedWindows;
		for (var i=0, il=openedWindows.length; i<il; i++) {
			openedWindows[i].close();
		}
	};
	return {
		googleApps : false,
		domain : "None",
		startService : apps.mail,
		
		init : function () {
			air.URLRequestDefaults.userAgent = air.URLRequestDefaults.userAgent + " Version\/3.1 Safari\/525.20";
			var initOptions = new air.NativeWindowInitOptions();
			var bounds = new air.Rectangle(10, 10, 1000, 750);
			loader = air.HTMLLoader.createRootWindow(true, initOptions, true, bounds);
			
			gmailWindow = air.NativeApplication.nativeApplication.openedWindows[1];
			this.getPreferences();
			this.loadContent(startServiceURL);
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
				var googleAppsNode = prefsXMLContent.getElementsByTagName("service");
				if (googleAppsNode.length > 0) {
					this.googleApps = googleAppsNode[0].firstChild.nodeValue === "googleApps";
				}
				var domainNode = prefsXMLContent.getElementsByTagName("domain");
				if (domainNode.length > 0) {
					this.domain = domainNode[0].firstChild.nodeValue;
				}
				if (this.googleApps) {
					apps.mail = appsBase.mail + this.domain;
					apps.calendar = appsBase.calendar + this.domain;
					apps.docs = appsBase.docs + this.domain;
				}
				else {
					apps.mail = regular.mail;
					apps.calendar = regular.calendar;
					apps.docs = regular.docs;
				}
				var startServiceNode = prefsXMLContent.getElementsByTagName("startService");
				if (startServiceNode.length > 0) {
					this.startService = startServiceNode[0].firstChild.nodeValue;
					startServiceURL = apps[this.startService];
				}
			}
		},
		
		setPreferences : function (service, domain, startService) {
			var le = air.File.lineEnding;
			var prefsXML = "<?xml version='1.0' encoding='utf-8'?>" + le
			            + "<preferences>" + le 
			            + "	<service>" + service + "</service>" + le
						+ "	<domain>" + domain + "</domain>" + le
						+ "	<startService>" + startService + "</startService>" + le
			            + "	<saveDate>" + new Date().toString() + "</saveDate>" + le
			            + "</preferences>";
			
			var stream = new air.FileStream();
			stream.open(prefsFile, air.FileMode.WRITE);
			stream.writeUTFBytes(prefsXML);
			stream.close();
			this.getPreferences();
			this.loadContent(startServiceURL);
		},
		
		loadContent : function (url) {
			loader.load(new air.URLRequest(url || apps.mail));
			try	{
				loader.window.moveTo((screen.width / 2) - (loader.window.innerWidth / 2), 50);
			}
			catch (e) {
				// To prevent potential reference errors
			}
			
			
			
			loader.stage.nativeWindow.activate();
		},
		
		createAppmenu : function () {
			if (gmailWindow) {
				gmailWindow.addEventListener(air.Event.CLOSING, function () {
					closeAllWindows();
				});
			
				var root = new air.NativeMenu();
				if (air.NativeApplication.supportsMenu) {
					air.NativeApplication.nativeApplication.menu = root;
				}
				else {
					gmailWindow.menu = root;
				}
			
				// Main menu
				var mainMenuItem = root.addItem(new air.NativeMenuItem("GMDesk"));
				mainMenuItem.submenu = new air.NativeMenu();

				var preferences = new air.NativeMenuItem("Preferences");
				preferences.keyEquivalent = ",";
				preferences.addEventListener(air.Event.SELECT, function () {
					window.open(("preferences.html"), "settings", "width=450, height=320");
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
					gmailWindow.minimize();
				});
				windowMenuItem.submenu.addItem(minimize);
			
				var maximize = new air.NativeMenuItem("Maximize");
				maximize.addEventListener(air.Event.SELECT, function () {
					gmailWindow.maximize();
				});
				windowMenuItem.submenu.addItem(maximize);
			
				var fullscreen = new air.NativeMenuItem("Fullscreen (Esc to return)");
				fullscreen.addEventListener(air.Event.SELECT, function () {
					gmailWindow.stage.displayState = runtime.flash.display.StageDisplayState.FULL_SCREEN_INTERACTIVE;
				});
				windowMenuItem.submenu.addItem(fullscreen);
			
				var restore = new air.NativeMenuItem("Restore");
				restore.addEventListener(air.Event.SELECT, function () {
					gmailWindow.restore();
				});
				windowMenuItem.submenu.addItem(restore);
				
				// Applications menu
				var appsMenuItem = root.addItem(new air.NativeMenuItem("Google applications"));
				appsMenuItem.submenu = new air.NativeMenu();
				
				var mail = new air.NativeMenuItem("Google Mail");
				mail.addEventListener(air.Event.SELECT, function () {
					gmdesk.loadContent(apps.mail);
				});
				appsMenuItem.submenu.addItem(mail);

				var calendar = new air.NativeMenuItem("Google Calendar");
				calendar.addEventListener(air.Event.SELECT, function () {
					gmdesk.loadContent(apps.calendar);
				});
				appsMenuItem.submenu.addItem(calendar);
				
				var docs = new air.NativeMenuItem("Google Docs");
				docs.addEventListener(air.Event.SELECT, function () {
					gmdesk.loadContent(apps.docs);
				});
				appsMenuItem.submenu.addItem(docs);
				
				var maps = new air.NativeMenuItem("Google Maps");
				maps.addEventListener(air.Event.SELECT, function () {
					gmdesk.loadContent(apps.maps);
				});
				appsMenuItem.submenu.addItem(maps);
				
				// Help menu
				var helpMenuItem = root.addItem(new air.NativeMenuItem("Help"));
				helpMenuItem.submenu = new air.NativeMenu();

				var webSite = new air.NativeMenuItem("Go to the GMDesk web site");
				webSite.addEventListener(air.Event.SELECT, function () {
					window.open("http://www.robertnyman.com/gmdesk/", "website", "width=900, height=700");
				});
				helpMenuItem.submenu.addItem(webSite);
			}
		}
	};
}();