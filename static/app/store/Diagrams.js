Ext.define('JS2DBDesigner.store.Diagrams', {
    extend: 'Ext.data.Store',
    model: 'JS2DBDesigner.model.Diagram',
    autoLoad: false,
 
    proxy: {
        type: 'ajax',
        api: {
            create: DBDesigner._PConfig.createDiagram,
            read: DBDesigner._PConfig.listDiagrams,
            update: DBDesigner._PConfig.updateDiagram,
            destroy: DBDesigner._PConfig.deleteDiagram,
        },
        reader: {
            type: 'json',
            root: 'diagrams',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: true,
            root: 'diagrams'
        },
        pageParam:  false,
        startParam: false,
      	limitParam: false
    }
});