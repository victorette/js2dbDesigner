/*
 *  Global variables
 *
 */

// Grid row state
DBDesigner = {};

// Strings and messages moved to locale
DBDesigner.__language = {};

// Config Variables
DBDesigner._PConfig = {
    urlGetEntitiesJSONDiagram: 'protoDiagram/getEntitiesJSONDiagram/',
    synchDBFromDiagram: 'protoDiagram/synchDBFromDiagram/',
    synchDiagramFromDB: 'protoDiagram/synchDiagramFromDB/',
    getElementsDiagramFromSelectedTables: 'protoDiagram/getElementsDiagramFromSelectedTables/',
    getDefaultDiagram: 'protoDiagram/getDefaultDiagram/',
    saveDiagram: 'protoDiagram/saveDiagram/',
    openDiagram: 'protoDiagram/openDiagram/',
    createDiagram: 'protoDiagram/createDiagram/',
    listDiagrams: 'protoDiagram/listDiagrams/',
    updateDiagram: 'protoDiagram/updateDiagram/',
    deleteDiagram: 'protoDiagram/deleteDiagram/',
};

// DIAGRAM DESIGNER
var dbModel = {
    shape: {},
	locator: {}
};
var jsonDocument = [];


function loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback) {
    if (scriptsCollection[startIndex]) {
    	if (filesadded.indexOf("[" + scriptsCollection[startIndex] + "]") === -1){
	        var fileref = document.createElement('script');
	        fileref.setAttribute("type", "text/javascript");
	        fileref.setAttribute("src", scriptsCollection[startIndex]);
	        fileref.onload = function() {
	            startIndex = startIndex + 1;
	            loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback);
	        };
	
	        document.getElementsByTagName("head")[0].appendChild(fileref);
	        filesadded += "[" + scriptsCollection[startIndex] + "]";
    	} else {
    		startIndex = startIndex + 1;
	        loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback);
    	}
    } else {
        librariesLoadedCallback();
    }
}

// An array of scripts you want to load in order
var scriptLibrary = [];
//list of files already added
var filesadded = "";

function displayJSON(canvas) {
    var writer = new draw2d.io.json.Writer();
    writer.marshal(canvas, function(json) {
        $("#json").text(JSON.stringify(json, null, 2));
    });
}

function createJSFilesLibrary() {
    scriptLibrary.push("static/js2db/lib/jquery-1.10.2.min.js");
    scriptLibrary.push("static/js2db/lib/jquery.autoresize.js");
    scriptLibrary.push("static/js2db/lib/jquery-touch_punch.js");
    scriptLibrary.push("static/js2db/lib/jquery.contextmenu.js");

    scriptLibrary.push("static/js2db/lib/shifty.js");

    scriptLibrary.push("static/js2db/lib/raphael.js");
    scriptLibrary.push("static/js2db/lib/rgbcolor.js");
    scriptLibrary.push("static/js2db/lib/canvg.js");

    scriptLibrary.push("static/js2db/lib/Class.js");

    scriptLibrary.push("static/js2db/lib/json2.js");

    scriptLibrary.push("static/js2db/lib/pathfinding-browser.min.js");
	
    scriptLibrary.push("static/js2db/lib/jquery.browser.js");
    scriptLibrary.push("static/js2db/lib/jquery-ui-1.8.23.custom.min.js");
    scriptLibrary.push("static/js2db/lib/jquery.layout.js");

	// Used for debug
	scriptLibrary.push("static/js2db/draw2d/src/draw2d-all.js");
    scriptLibrary.push("static/js2db/dbModel/all-classes.js");
	
	// scriptLibrary.push("static/js2db/dbModel/dbModel-all.js");
}