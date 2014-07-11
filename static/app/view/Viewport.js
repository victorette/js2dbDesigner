Ext.define('JS2DBDesigner.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.Fit',
        'Ext.layout.container.Border',
        'JS2DBDesigner.view.diagram.DiagramMainView'
    ],

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'diagramMainView'
    }]
});
