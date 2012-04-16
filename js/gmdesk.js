/*extern air, $, $$, DOMParser, checkMenuItem, closeAllWindows, runtime */
var gmdesk = function () {
	var loader = null;
	var prefsFile = null;
	var prefsFilePath = "preferences.xml";
	var regular = {
		mail : "http://mail.google.com/",
		calendar : "http://www.google.com/calendar/render",
		docs : "http://docs.google.com/"
	};
	var appsBase = {
		mail : "http://mail.google.com/a/",
		calendar : "http://www.google.com/calendar/a/",
		docs : "http://docs.google.com/a/"
	};
	var apps = {
		mail : "http://mail.google.com/",
		calendar : "http://www.google.com/calendar/render",
		docs : "http://docs.google.com/",
		maps : "http://maps.google.com/",
		reader : "http://www.google.com/reader/",
		picasa : "http://picasaweb.google.com/"
		contacts : "http://www.google.com/contacts",
		tasks : "http://mail.google.com/tasks/canvas"
	};
	var startServiceURL = apps.mail;
	var gmailWindow = null;
	var menuItems = [];
	var createAppmenu = function () {
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
				window.open(("preferences.html"), "settings", "width=450, height=370, left=" + ((screen.width / 2) - 225) + ", top=150");
			});
			mainMenuItem.submenu.addItem(preferences);
		
			var quit = new air.NativeMenuItem("Quit GMDesk");
			quit.keyEquivalent = "q";
			quit.addEventListener(air.Event.SELECT, function () {
				closeAllWindows();
			});
			mainMenuItem.submenu.addItem(quit);
		
			// Applications menu
			var appsMenuItem = root.addItem(new air.NativeMenuItem("Google applications"));
			appsMenuItem.submenu = new air.NativeMenu();
			
			var mail = new air.NativeMenuItem("Google Mail");
			mail.keyEquivalent = "1";
			mail.addEventListener(air.Event.SELECT, function () {
				checkMenuItem(0);
				gmdesk.loadContent(apps.mail);
			});
			appsMenuItem.submenu.addItem(mail);

			var calendar = new air.NativeMenuItem("Google Calendar");
			calendar.keyEquivalent = "2";
			calendar.addEventListener(air.Event.SELECT, function () {
				checkMenuItem(1);
				gmdesk.loadContent(apps.calendar);
			});
			appsMenuItem.submenu.addItem(calendar);
			
			var docs = new air.NativeMenuItem("Google Docs");
			docs.keyEquivalent = "3";
			docs.addEventListener(air.Event.SELECT, function () {
				checkMenuItem(2);
				gmdesk.loadContent(apps.docs);
			});
			appsMenuItem.submenu.addItem(docs);
			
			var maps = new air.NativeMenuItem("Google Maps");
			maps.keyEquivalent = "4";
			maps.addEventListener(air.Event.SELECT, function () {
				checkMenuItem(3);
				gmdesk.loadContent(apps.maps);
			});
			appsMenuItem.submenu.addItem(maps);
			
			var reader = new air.NativeMenuItem("Google Reader");
			reader.keyEquivalent = "5";
			reader.addEventListener(air.Event.SELECT, function () {
				checkMenuItem(4);
				gmdesk.loadContent(apps.reader);
			});
			appsMenuItem.submenu.addItem(reader);
			
			var picasa = new air.NativeMenuItem("Picasa Web Albums");
			picasa.keyEquivalent = "6";
			picasa.addEventListener(air.Event.SELECT, function () {
				checkMenuItem(5);
				gmdesk.loadContent(apps.picasa);
			});
			appsMenuItem.submenu.addItem(picasa);
			
			var contacts = new air.NativeMenuItem("Google Contacts");
			contacts.keyEquivalent = "7";
			contacts.addEventListener(air.Event.SELECT, function () {
				checkMenuItem(6);
				gmdesk.loadContent(apps.contacts);
			});
			appsMenuItem.submenu.addItem(contacts);
			
			var tasks = new air.NativeMenuItem("Google Tasks");
			tasks.keyEquivalent = "8";
			tasks.addEventListener(air.Event.SELECT, function () {
				checkMenuItem(7);
				gmdesk.loadContent(apps.tasks);
			});
			appsMenuItem.submenu.addItem(tasks);
			
			menuItems.push(mail, calendar, docs, maps, reader, picasa, contacts, tasks);
			
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
			
			// Help menu
			var helpMenuItem = root.addItem(new air.NativeMenuItem("Help"));
			helpMenuItem.submenu = new air.NativeMenu();

			var webSite = new air.NativeMenuItem("Go to the GMDesk web site");
			webSite.addEventListener(air.Event.SELECT, function () {
				window.open("http://www.robertnyman.com/gmdesk/", "website", "width=900, height=700");
			});
			helpMenuItem.submenu.addItem(webSite);
			
			// Check Google Applications menu item
			var selectedAppMenuItemIndex = 0;
			switch (gmdesk.startService) {
				case "mail":
					selectedAppMenuItemIndex = 0;
					break;
				case "calendar":
					selectedAppMenuItemIndex = 1;
					break;
				case "docs":
					selectedAppMenuItemIndex = 2;
					break;
				case "maps":
					selectedAppMenuItemIndex = 3;
					break;
			}
			checkMenuItem(selectedAppMenuItemIndex);
		}
	};
	
	var checkMenuItem = function (index) {
		for (var i=0, il=menuItems.length; i<il; i++) {
			menuItems[i].checked = false;
		}
		menuItems[index].checked = true;
	};
	
	var closeAllWindows = function () {
		var openedWindows = air.NativeApplication.nativeApplication.openedWindows;
		gmdesk.setPreferences();
		for (var i=0, il=openedWindows.length; i<il; i++) {
			openedWindows[i].close();
		}
	};
	return {
		googleApps : false,
		domain : "None",
		startService : apps.mail,
		left : 0,
		top : 0,
		width : 0,
		height : 0,
		
		init : function () {
			air.URLRequestDefaults.userAgent = air.URLRequestDefaults.userAgent + " Version\/3.1 Safari\/525.20";
			this.getPreferences();
			var windowPrefs = (this.width > 0)? [this.left, this.top, this.width, this.height] : [10, 10, 1000, 750];
			
			var initOptions = new air.NativeWindowInitOptions();
			var bounds = new air.Rectangle(windowPrefs[0], windowPrefs[1], windowPrefs[2], windowPrefs[3]);
			loader = air.HTMLLoader.createRootWindow(true, initOptions, true, bounds);
			
			gmailWindow = air.NativeApplication.nativeApplication.openedWindows[1];
			this.loadContent(startServiceURL);
			createAppmenu();
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
				var leftNode = prefsXMLContent.getElementsByTagName("left");
				if (leftNode.length > 0) {
					this.left = leftNode[0].firstChild.nodeValue;
				}
				var topNode = prefsXMLContent.getElementsByTagName("top");
				if (topNode.length > 0) {
					this.top = topNode[0].firstChild.nodeValue;
				}
				var widthNode = prefsXMLContent.getElementsByTagName("width");
				if (widthNode.length > 0) {
					this.width = widthNode[0].firstChild.nodeValue;
				}
				var heightNode = prefsXMLContent.getElementsByTagName("height");
				if (heightNode.length > 0) {
					this.height = heightNode[0].firstChild.nodeValue;
				}
			}
		},
		
		setPreferences : function (service, domain, startService) {
			var le = air.File.lineEnding;
			var prefsXML = "<?xml version='1.0' encoding='utf-8'?>" + le
			            + "<preferences>" + le 
			            + "	<service>" + (service || ((this.googleApps)? "googleApps" : "regular")) + "</service>" + le
						+ "	<domain>" + (domain || this.domain) + "</domain>" + le
						+ "	<startService>" + (startService || this.startService) + "</startService>" + le
						+ "	<left>" + gmailWindow.x + "</left>" + le
						+ "	<top>" + gmailWindow.y + "</top>" + le
						+ "	<width>" + gmailWindow.width + "</width>" + le
						+ "	<height>" + gmailWindow.height + "</height>" + le
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
				if (this.width === 0) {
					loader.window.moveTo((screen.width / 2) - (loader.window.innerWidth / 2), 50);
				}	
			}
			catch (e) {
				// To prevent potential reference errors
			}
			loader.stage.nativeWindow.activate();
		}
	};
}();