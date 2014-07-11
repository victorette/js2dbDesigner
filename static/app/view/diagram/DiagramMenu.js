Ext.define('JS2DBDesigner.view.diagram.DiagramMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.diagramMenu',

    requires: ['Ext.menu.Menu', 'Ext.menu.Item', 'Ext.button.Button'],

    itemId: 'menuPanel',
    width: 190,
    layout: 'accordion',
    collapseDirection: 'left',
    collapsible: true,
    title: 'Menu',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            collapseFirst: true,
            items: [{
                xtype: 'panel',
                collapsible: true,
                title: 'Toolbox',
                html: '<div data-shape="dbModel.shape.DBTable" class="palette_node_element draw2d_droppable table_div">Table</div>',
                items: [{
                    xtype: 'menu',
                    floating: false,
                    itemId: 'DatabaseMenu',
                    items: [{
                        xtype: 'menuitem',
                        itemId: 'getAllTables',
                        iconCls: 'find-table',
                        text: DBDesigner.__language.Menu_Search_Table,
                    }]
                }]
            }, {
                xtype: 'panel',
                title: DBDesigner.__language.Menu_Database_Title,
                items: [{
                    xtype: 'databasemenu'
                }]
            }]
        });

        me.callParent(arguments);
    }
}); 