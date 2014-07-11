/**
 * @author Giovanni Victorette
 */

Ext.define('JS2DBDesigner.view.diagram.TableContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.tablecontextmenu',

    figure: null,

    itemId: 'tablecontextmenu',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                text: DBDesigner.__language.Menu_Add_Recursive_Association,
                iconCls: 'table-relationship',
                itemId: 'btAddConnectorRecursive'
            }, {
                text: DBDesigner.__language.Menu_Add_Input_Port,
                iconCls: 'icon-nodeInput',
                itemId: 'btAddInputPort'
            }, {
            	text: DBDesigner.__language.Menu_Add_Output_Port,
            	iconCls: 'icon-nodeOutput',
                itemId: 'btAddOutputPort'
            }, {
                text: DBDesigner.__language.Menu_Remove_Unused_Ports,
                iconCls: 'icon-nodeDelete',
                itemId: 'btRemoveUnusedPorts'
            }]
        });
        me.callParent(arguments);
    },

    getFigure: function() {
        return this.figure;
    }
});
