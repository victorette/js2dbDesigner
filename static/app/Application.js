
Ext.define('JS2DBDesigner.Application', {
    name: 'JS2DBDesigner',

    extend: 'Ext.app.Application',
	paths: {
        'JS2DBDesigner': 'static/app'
    },
    
    requires: [
		'Ext.layout.container.Accordion',
		'Ext.toolbar.Spacer',
		'Ext.form.field.Picker',
		'Ext.picker.Color',
		'Ext.grid.property.Grid',
		'Ext.grid.plugin.RowEditing',
    	'Ext.Ajax' 
    ],
    
    stores: [
        'EntityAttributeStore',
        'DBTypesStore',
        'DiagramModelStore'
    ],
	views: [
        'diagram.DiagramMainView',
        'diagram.DiagramMenu',
        'diagram.DiagramCanvas',
        'diagram.DiagramToolbar',
        'diagram.EntityEditor',
        'diagram.EntityAttributes',
        'diagram.TableContextMenu',
        'diagram.DatabaseMenu',
        'searchmodel.LiveSearchGridPanel',
        'searchmodel.SearchBottomBar'
    ],
	controllers: [
		'DiagramController',
		'DiagramMenuController',
		'DiagramContextMenuController'
	],
});