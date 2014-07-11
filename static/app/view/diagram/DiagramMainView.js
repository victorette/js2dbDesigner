Ext.define('JS2DBDesigner.view.diagram.DiagramMainView', {
    // extend: 'Ext.window.Window',
    extend: 'Ext.container.Container',
    alias: 'widget.diagramMainView',
	xtype: 'diagramMainView',
	
    requires: ['JS2DBDesigner.view.diagram.DiagramMenu', 'JS2DBDesigner.view.diagram.DiagramCanvas', 'JS2DBDesigner.view.diagram.EntityEditor', 'Ext.panel.Panel'],

    itemId: 'diagramMainView',
    layout: 'border',
    maximizable: true,
    modal: true,
    height: 600,
    width: 1200,
	
	projectID: 1,
	diagramID: null,
	
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'diagramMenu',
                region: 'west',
                split: true,
                collapsible: true
            }, {
                xtype: 'canvas',
                flex: 1,
                region: 'center'
            }, {
                xtype: 'entityeditor',
                region: 'east',
                split: true,
                collapsed: true,
                collapsible: true
            }]
        });
    	me.addEvents(
            'opendiagram'
        );
    	me.on('afterrender', function(){
    		this.fireEvent('opendiagram');
		});
		
        me.callParent(arguments);
    },
		
    setProjectID: function(id) {
    	this.projectID = id;
    },
    
    getProjectID: function() {
    	return this.projectID;
    },
		
    setDiagramID: function(id) {
    	this.diagramID = id;
    },
    
    getDiagramID: function() {
    	return this.diagramID;
    }
});