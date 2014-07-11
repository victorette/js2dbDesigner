/**
 * @author Giovanni Victorette
 */
Ext.define('JS2DBDesigner.store.DiagramModelStore', {
    extend: 'Ext.data.JsonStore',
    storeId: 'diagramModelStore',
    fields: [{
        name: 'id', mapping: 'id'
    }, {
        name: 'tableName'
    }]
}); 