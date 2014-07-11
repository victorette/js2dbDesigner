
Ext.define('JS2DBDesigner.store.EntityAttributeStore', {
    extend: 'Ext.data.Store',

    requires: [
        'JS2DBDesigner.model.EntityAttributesModel',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'JS2DBDesigner.model.EntityAttributesModel',
            storeId: 'EntityAttributeStore',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});