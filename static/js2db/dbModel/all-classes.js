/*
Copyright(c) 2014 CeRTAE
*/

dbModel.View = draw2d.Canvas.extend({
	
	init:function(id){
		this._super(id);
		
		this.setScrollArea("#"+id);
		
		this.currentDropConnection = null;
	},

    /**
     * @method
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     * 
     * @template
     **/
    onDrag:function(droppedDomNode, x, y )
    {
    },
    
    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @private
     **/
    onDrop : function(droppedDomNode, x, y)
    {
        var type = $(droppedDomNode).data("shape");
        var figure = eval("new "+type+"();");
        // create a command for the undo/redo support
        var command = new draw2d.command.CommandAdd(this, figure, x, y);
        this.getCommandStack().execute(command);
    }
});
/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2014 Giovanni Victorette
 ****************************************/
/**
 * @class dbModel.locator.PortRightLocator
 *
 * @author Giovanni Victorette
 * @extend draw2d.layout.locator.PortLocator
 */
dbModel.locator.PortRightLocator = draw2d.layout.locator.PortLocator.extend({
    NAME: "dbModel.locator.PortRightLocator",

    /**
     * @constructor
     * Constructs a locator with associated parent.
     *
     * @param {draw2d.Figure} parent the parent associated with the locator
     */
    init: function(parent) {
        this._super(parent);
    },

    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate: function(index, figure) {
    	var node = figure.getParent();
        var dividerFactor = 1;
        var thisNAME = this.NAME;
        var portIndex =1;
        node.getPorts().each(function(i,p){
            portIndex = (p===figure)?dividerFactor:portIndex;
            dividerFactor += p.getLocator().NAME === thisNAME?1:0;
        });
        this.applyConsiderRotation( figure, node.getWidth(), (node.getHeight()/dividerFactor)*portIndex);
    }
});

/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2014 Giovanni Victorette
 ****************************************/
/**
 * @class dbModel.locator.PortLeftLocator
 *
 *
 * @author Giovanni Victorette
 * @extend draw2d.layout.locator.PortLocator
 */
dbModel.locator.PortLeftLocator = draw2d.layout.locator.PortLocator.extend({
    NAME: "dbModel.locator.PortLeftLocator",

    /**
     * @constructor
     * Constructs a locator with associated parent.
     *
     * @param {draw2d.Figure} parent the parent associated with the locator
     */
    init: function(parent) {
        this._super(parent);
    },

    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate: function(index, figure) {
    	var node = figure.getParent();
        var dividerFactor = 1;
        var thisNAME = this.NAME;
        var portIndex =1;
        node.getPorts().each(function(i,p){
            portIndex = (p===figure)?dividerFactor:portIndex;
            dividerFactor += p.getLocator().NAME === thisNAME?1:0;
        });
        this.applyConsiderRotation( figure, 0, (node.getHeight()/dividerFactor)*portIndex);
    }
}); 
/**
 * @method
 * Factory method to provide a default connection for all drag&drop connections. You
 * can override this method and customize this for your personal purpose.
 *
 * @param {draw2d.Port} sourcePort port of the source of the connection
 * @param {draw2d.Port} targetPort port of the target of the connection
 * @template
 * @returns {dbModel.shape.TableConnection}
 */
draw2d.Connection.createConnection = function(sourcePort, targetPort, callback) {
    var conn = new dbModel.shape.TableConnection();
    var labelSource = sourcePort.getParent().header.getChildren().data[0];
    var labelTarget = targetPort.getParent().header.getChildren().data[0];
    conn.label.setText(labelSource.getText() + "_" + labelTarget.getText());
    conn.isNew = true;

    return conn;
};

dbModel.shape.DBTable = draw2d.shape.layout.VerticalLayout.extend({

    NAME: "dbModel.shape.DBTable",

    init: function() {
        this._super();

        // just some color attributes for the rendering/gradient
        this.setBackgroundColor("#dbddde");
        this.setColor("#d7d7d7");
        this.setStroke(1);
        this.setRadius(3);

        this.attributes = new draw2d.util.ArrayList();
        this.header = new draw2d.shape.layout.VerticalLayout();

        this.classLabel = this.createLabel("TableName").setPadding(10).setFontColor("#5856d6");
        this.header.addFigure(this.classLabel);

        this.header.setStroke(0).setRadius(this.getRadius());
        this.header.setBackgroundColor("#f7f7f7");

        this.addFigure(this.header);

        this.contextMenuListeners = new draw2d.util.ArrayList();
        this.onDropConnectionListeners = new draw2d.util.ArrayList();
        this.newConnector = null;
    },

    addAttribute: function(index, entity) {
        var label = new dbModel.shape.CustomLabel(entity.text);
        label.setStroke(0);
        label.setBold(entity.pk);
        if (entity.pk) {
            label.setCssClass('primary_key');
        }
        label.setRadius(0);
        label.setBackgroundColor(null);
        label.setPadding(5);
        label.setFontColor("#4a4a4a");
        label.addContextMenuListener(this);

        this.addFigure(label);

        this.attributes.add(label);
        return label;
    },

    removeFigure: function(figure) {
        this._super(figure);
        this.attributes.remove(figure);

        return this;
    },

    /**
     * @method
     * help method to create some labels
     *
     * @param {String} txt the label to display
     * @returns {draw2d.shape.basic.Label}
     */
    createLabel: function(txt) {
        var label = new dbModel.shape.CustomLabel(txt);
        label.setStroke(0);
        label.setRadius(0);
        label.setBackgroundColor(null);
        label.setPadding(5);
        label.addContextMenuListener(this);

        return label;
    },

    setName: function(name) {
        this.classLabel.setText(name);
    },

	getNewConnector: function() {
        return this.newConnector;
    },
    
    setNewConnector: function(connector) {
        this.newConnector = connector;
    },

    createCustomizedPort: function(type, name, position) {
        var newPort = null;
        switch(type) {
            case "draw2d_InputPort":
                newPort = new draw2d.InputPort();
                newPort.onConnect = function(connection) {
                    if (connection.isNew) {
                        var table = this.getParent();
                        table.setNewConnector(connection);
						connection.isNew = false;
                    }
                };
                newPort.onDragLeave = function(figure) {
                    this._super = function(figure) {
                        if (!( figure instanceof draw2d.Port)) {
                            return;
                        }
                    };
                    if ( figure instanceof draw2d.OutputPort) {
                        this._super(figure);
                    } else if ( figure instanceof draw2d.HybridPort) {
                        this._super(figure);
                    }
                    var table = this.getParent();
                    table.onDropConnection(table.getNewConnector());
                    table.setNewConnector(null);
                };
                break;
            case "draw2d_OutputPort":
                newPort = new draw2d.OutputPort();
                break;
            case "draw2d_HybridPort":
                newPort = new draw2d.HybridPort();
                break;
            default:
                throw "Unknown type [" + type + "] of port requested";
        }

        var locator;
        switch(position) {
            case "default":
                break;
            case "right":
                locator = new dbModel.locator.PortRightLocator(this);
                break;
            case "left":
                locator = new dbModel.locator.PortLeftLocator(this);
                break;
            case "top":
                locator = new draw2d.layout.locator.TopLocator(this);
                break;
            case "bottom":
                locator = new draw2d.layout.locator.BottomLocator(this);
                break;
            default:
                throw "Unknown position [" + position + "] of port requested";
        }

        var userData = [];
        userData.push({
            position: position
        });
        newPort.setUserData(userData);
        newPort.setName(name);

        this.addPort(newPort, locator);
        // relayout the ports
        this.setDimension(this.width, this.height);

        this.layoutPorts();
        return newPort;
    },

    /**
     * @method
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes: function() {
        var memento = this._super();

        if (this.header.getChildren().size > 0) {
            memento.tableName = this.header.getChildren().data[0].getText();
        }

        memento.tablePorts = [];
        this.getPorts().each(function(index, port) {
            var pos;
            var userData = port.getUserData();
            if (userData !== null) {
                pos = userData[userData.length - 1];
            }
            if ( typeof pos === "undefined") {
                pos = "default";
            } else {
                pos = pos.position;
            }
            memento.tablePorts.push({
                type: port.getCssClass(),
                name: port.getName(),
                position: pos
            });
        });

        memento.attributes = [];
        this.attributes.each(function(i, e) {
            memento.attributes.push({
                text: e.getText(),
                id: e.id,
                datatype: e.datatype,
                pk: e.pk,
                fk: e.fk,
                isRequired: e.isRequired,
                isNullable: e.isNullable
            });
        });

        return memento;
    },

	updateHeader: function(memento){
		this.header.resetChildren();

        if ( typeof memento.tableName !== "undefined") {
            var label = this.createLabel(memento.tableName).setPadding(10).setFontColor("#5856d6");
            this.header.addFigure(label);
        }	
	},
	
	updateAttributes: function(memento) {
        if ( typeof memento.attributes !== "undefined") {
            $.each(memento.attributes, $.proxy(function(i, e) {
                var entity = this.addAttribute(i, e);
                entity.id = e.id;
                entity.datatype = e.datatype;
                entity.pk = e.pk;
                entity.fk = e.fk;
                entity.isRequired = e.isRequired;
                entity.isNullable = e.isNullable;
            }, this));
        }
    },
    /**
     * @method
     * Read all attributes from the serialized properties and transfer them into the shape.
     *
     * @param {Object} memento
     * @return
     */
    setPersistentAttributes: function(memento) {
        this._super(memento);

        this.updateHeader(memento);

        if ( typeof memento.tablePorts !== "undefined") {
            $.each(memento.tablePorts, $.proxy(function(index, item) {
                this.createCustomizedPort(item.type, item.name, item.position);
            }, this));
        }

        this.updateAttributes(memento);

        return this;
    },

    onContextMenu: function(figure, x, y) {
        var me = this;
        me.contextMenuListeners.each(function(i, w) {
            w.onContextMenu(figure, x, y);
        });
    },

    addContextMenuListener: function(w) {
        if (w !== null) {
            if ( typeof w === "function") {
                this.contextMenuListeners.add({
                    onContextMenu: w
                });
            } else if ( typeof w.onContextMenu === "function") {
                this.contextMenuListeners.add(w);
            } else {
                throw "Object doesn't implement required callback method [onContextMenu]";
            }
        }
    },

    addOnDropConnectionListener: function(w) {
        if (w !== null) {
            if ( typeof w === "function") {
                this.onDropConnectionListeners.add({
                    onDropConnection: w
                });
            } else if ( typeof w.onDropConnection === "function") {
                this.onDropConnectionListeners.add(w);
            } else {
                throw "Object doesn't implement required callback method [onDropConnection]";
            }
        }
    },

    onDropConnection: function(connection) {
        var me = this;
        me.onDropConnectionListeners.each(function(i, w) {
            w.onDropConnection(connection, me);
        });
    },
    /**
     * @method
     * unregister the listener from the connection.
     *
     * @param {Object/Function} w The object which will be removed from the selection eventing
     **/
    removeContextMenuListener: function(/*:Object*/w) {
        this.contextMenuListeners = this.contextMenuListeners.grep(function(listener) {
            return listener !== w && listener.onContextMenu !== w;
        });
    }
});

/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2014 Giovanni Victorette
 ****************************************/
/**
 * @class dbModel.shape.ManhattanRightConnectionLocator
 *
 * A ManhattanRightConnectionLocator that is used to place figures at the right position of a Manhattan routed
 * connection.
 *
 * @author Giovanni Victorette
 * @extend draw2d.layout.locator.ConnectionLocator
 */
dbModel.shape.ManhattanRightConnectionLocator = draw2d.layout.locator.ConnectionLocator.extend({
    NAME: "dbModel.shape.ManhattanRightConnectionLocator",

    /**
     * @constructor
     * Constructs a ManhattanRightConnectionLocator with associated Connection c.
     *
     * @param {draw2d.Connection} c the connection associated with the locator
     */
    init: function(c) {
        this._super(c);
    },

    /**
     * @method
     * Relocates the given Figure always in the center of an edge.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate: function(index, target) {
        var conn = this.getParent();
		var locator = conn.getTarget().getLocator();
		var points = conn.getVertices();

		var coordR = points.get(points.getSize()-1);
		
		if (locator.__proto__.NAME === "dbModel.locator.PortRightLocator") {
			target.setPosition(coordR.x + 8, coordR.y - 20);
		} else if (locator.__proto__.NAME === "draw2d.layout.locator.BottomLocator"){
			target.setPosition(coordR.x + 8, coordR.y + 3);
		} else {
			target.setPosition(coordR.x - 35, coordR.y - 20);
		}
    }
}); 
/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2014 Giovanni Victorette
 ****************************************/
/**
 * @class dbModel.shape.ManhattanLeftConnectionLocator
 *
 * A ManhattanRightConnectionLocator that is used to place figures at the left position of a Manhattan routed
 * connection.
 *
 * @author Giovanni Victorette
 * @extend draw2d.layout.locator.ConnectionLocator
 */
dbModel.shape.ManhattanLeftConnectionLocator = draw2d.layout.locator.ConnectionLocator.extend({
    NAME: "dbModel.shape.ManhattanLeftConnectionLocator",

    /**
     * @constructor
     * Constructs a ManhattanLeftConnectionLocator with associated Connection c.
     *
     * @param {draw2d.Connection} c the connection associated with the locator
     */
    init: function(c) {
        this._super(c);
    },

    /**
     * @method
     * Relocates the given Figure always in the center of an edge.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate: function(index, target) {
        var conn = this.getParent();
		var locator = conn.getSource().getLocator();
        var points = conn.getVertices();

		var coordR = points.get(0);
		if (locator.__proto__.NAME === "dbModel.locator.PortLeftLocator") {
			target.setPosition(coordR.x - 35, coordR.y);
		} else if (locator.__proto__.NAME === "draw2d.layout.locator.TopLocator"){
			target.setPosition(coordR.x + 10, coordR.y - 25);
		} else if (locator.__proto__.NAME === "draw2d.layout.locator.BottomLocator"){
			target.setPosition(coordR.x - 25, coordR.y);
		}  else {
			target.setPosition(coordR.x + 10, coordR.y);
		}
    }
}); 
/**
 * @class TableConnection
 *
 * A simple Connection with a context menu.
 *
 * @author Giovanni Victorette
 * @extend draw2d.Connection
 */
dbModel.shape.TableConnection = draw2d.Connection.extend({
    NAME: "dbModel.shape.TableConnection",

    init: function() {
        this._super();
        this.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());

        this.setColor("#5bcaff");
        this.setStroke(2);

        this.label = this.createLabel("New connection");
        // add the new decoration to the connection with a position locator.
        this.addFigure(this.label, new draw2d.layout.locator.ManhattanMidpointLocator(this));

        this.inputCardinality = this.createLabel("1,1");
        this.addFigure(this.inputCardinality, new dbModel.shape.ManhattanRightConnectionLocator(this));
        this.outputCardinality = this.createLabel("0,N");
        this.addFigure(this.outputCardinality, new dbModel.shape.ManhattanLeftConnectionLocator(this));

        this.setUserData({
            "isPrimary": false
        });

        this.contextMenuListeners = new draw2d.util.ArrayList();
    },

    /**
     * @method
     * help method to create some labels
     *
     * @param {String} txt the label to display
     * @returns {draw2d.shape.basic.Label}
     */
    createLabel: function(txt) {
        var label = new dbModel.shape.CustomLabel(txt);
        label.setStroke(0);
        label.setFontColor("#0d0d0d");

        return label;
    },

    getConnectionName: function() {
        return this.label.getText();
    },

    /**
     * @method
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes: function() {
        var memento = this._super();
        memento.name = this.label.getText();
        return memento;
    },

    /**
     * @method
     * Read all attributes from the serialized properties and transfer them into the shape.
     *
     * @param {Object} memento
     * @return
     */
    setPersistentAttributes: function(memento) {
        this._super(memento);

        if ( typeof memento.name !== "undefined") {
            this.resetChildren();
            // Create any Draw2D figure as decoration for the connection
            //
            this.label = new draw2d.shape.basic.Label(memento.name);
            this.label.setStroke(0);
            this.label.setFontColor("#0d0d0d");

            this.inputCardinality = this.createLabel("1,1");
            if (memento.userData.isPrimary) {
                this.inputCardinality.setCssClass('primary_key');
            }
            this.addFigure(this.inputCardinality, new dbModel.shape.ManhattanRightConnectionLocator(this));
            this.outputCardinality = this.createLabel("0,N");
            this.addFigure(this.outputCardinality, new dbModel.shape.ManhattanLeftConnectionLocator(this));

            // add the new decoration to the connection with a position locator.
            //
            this.addFigure(this.label, new draw2d.layout.locator.ManhattanMidpointLocator(this));

            // Set the endpoint decorations for the connection
            if (memento.userData.useDecorators) {
                this.setSourceDecorator(new draw2d.decoration.connection.BarDecorator());
                this.setTargetDecorator(new draw2d.decoration.connection.DiamondDecorator());
            }
        }

        return this;
    },
    /**
     * @method
     * called by the framework if the figure should show the contextmenu.</br>
     * The strategy to show the context menu depends on the plattform. Either loooong press or
     * right click with the mouse.
     *
     * @param {Number} x the x-coordinate to show the menu
     * @param {Number} y the y-coordinate to show the menu
     * @since 1.1.0
     */
    onContextMenu: function(x, y) {
        var me = this;
        me.contextMenuListeners.each(function(i, w) {
            w.onContextMenu(me, x, y);
        });
    },

    addContextMenuListener: function(w) {
        if (w !== null) {
            if ( typeof w === "function") {
                this.contextMenuListeners.add({
                    onContextMenu: w
                });
            } else if ( typeof w.onContextMenu === "function") {
                this.contextMenuListeners.add(w);
            } else {
                throw "Object doesn't implement required callback method [onContextMenu]";
            }
        }
    },
    /**
     * @method
     * unregister the listener from the connection.
     *
     * @param {Object/Function} w The object which will be removed from the selection eventing
     **/
    removeContextMenuListener: function(/*:Object*/w) {
        this.contextMenuListeners = this.contextMenuListeners.grep(function(listener) {
            return listener !== w && listener.onContextMenu !== w;
        });
    }
});
dbModel.shape.CustomLabel = draw2d.shape.basic.Label.extend({
    
    init: function(text) {
        this._super(text);
        this.contextMenuListeners = new draw2d.util.ArrayList();
    },
    
    onContextMenu: function(x, y) {
        var me = this;
        me.contextMenuListeners.each(function(i, w) {
            w.onContextMenu(me, x, y);
        });
    },

    addContextMenuListener: function(w) {
        if (w !== null) {
            if ( typeof w === "function") {
                this.contextMenuListeners.add({
                    onContextMenu: w
                });
            } else if ( typeof w.onContextMenu === "function") {
                this.contextMenuListeners.add(w);
            } else {
                throw "Object doesn't implement required callback method [onContextMenu]";
            }
        }
    },
    /**
     * @method
     * unregister the listener from the connection.
     *
     * @param {Object/Function} w The object which will be removed from the selection eventing
     **/
    removeContextMenuListener: function(/*:Object*/w) {
        this.contextMenuListeners = this.contextMenuListeners.grep(function(listener) {
            return listener !== w && listener.onContextMenu !== w;
        });
    }
}); 
