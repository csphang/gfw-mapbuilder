//>>built
define("dojox/grid/DataGrid","../main dojo/_base/array dojo/_base/lang dojo/_base/json dojo/_base/sniff dojo/_base/declare ./_Grid ./DataSelection dojo/_base/html dojo/has dojo/has!dojo-bidi?./bidi/_BidiMixin".split(" "),function(s,h,g,m,p,q,n,r,l){var k=q("dojox.grid.DataGrid",n,{store:null,query:null,queryOptions:null,fetchText:"...",sortFields:null,updateDelay:1,items:null,_store_connects:null,_by_idty:null,_by_idx:null,_cache:null,_pages:null,_pending_requests:null,_bop:-1,_eop:-1,_requests:0,
rowCount:0,_isLoaded:!1,_isLoading:!1,keepSelection:!1,postCreate:function(){this._pages=[];this._store_connects=[];this._by_idty={};this._by_idx=[];this._cache=[];this._pending_requests={};this._setStore(this.store);this.inherited(arguments)},destroy:function(){this.selection.destroy();this.inherited(arguments)},createSelection:function(){this.selection=new r(this)},get:function(a,b){if(b&&"_item"==this.field&&!this.fields)return b;if(b&&this.fields){var c=[],d=this.grid.store;h.forEach(this.fields,
function(a){c=c.concat(d.getValues(b,a))});return c}return!b&&"string"===typeof a?this.inherited(arguments):!b?this.defaultValue:!this.field?this.value:"_item"==this.field?b:this.grid.store.getValue(b,this.field)},_checkUpdateStatus:function(){if(0<this.updateDelay){var a=!1;this._endUpdateDelay&&(clearTimeout(this._endUpdateDelay),delete this._endUpdateDelay,a=!0);this.updating||(this.beginUpdate(),a=!0);if(a){var b=this;this._endUpdateDelay=setTimeout(function(){delete b._endUpdateDelay;b.endUpdate()},
this.updateDelay)}}},_onSet:function(a,b,c,d){this._checkUpdateStatus();a=this.getItemIndex(a);-1<a&&this.updateRow(a)},_createItem:function(a,b){var c=this._hasIdentity?this.store.getIdentity(a):m.toJson(this.query)+":idx:"+b+":sort:"+m.toJson(this.getSortProps());return this._by_idty[c]={idty:c,item:a}},_addItem:function(a,b,c){this._by_idx[b]=this._createItem(a,b);c||this.updateRow(b)},_onNew:function(a,b){this._checkUpdateStatus();var c=this.get("rowCount");this._addingItem=!0;this.updateRowCount(c+
1);this._addingItem=!1;this._addItem(a,c);this.showMessage()},_onDelete:function(a){this._checkUpdateStatus();a=this._getItemIndex(a,!0);if(0<=a){this._pages=[];this._eop=this._bop=-1;var b=this._by_idx[a];this._by_idx.splice(a,1);delete this._by_idty[b.idty];this.updateRowCount(this.get("rowCount")-1);0===this.get("rowCount")&&this.showMessage(this.noDataMessage)}this.selection.isSelected(a)&&(this.selection.deselect(a),this.selection.selected.splice(a,1))},_onRevert:function(){this._refresh()},
setStore:function(a,b,c){this._requestsPending(0)||(this._setQuery(b,c),this._setStore(a),this._refresh(!0))},setQuery:function(a,b){this._requestsPending(0)||(this._setQuery(a,b),this._refresh(!0))},setItems:function(a){this.items=a;this._setStore(this.store);this._refresh(!0)},_setQuery:function(a,b){this.query=a;this.queryOptions=b||this.queryOptions},_setStore:function(a){this.store&&this._store_connects&&h.forEach(this._store_connects,this.disconnect,this);if(this.store=a){a=this.store.getFeatures();
var b=[];this._canEdit=!!a["dojo.data.api.Write"]&&!!a["dojo.data.api.Identity"];this._hasIdentity=!!a["dojo.data.api.Identity"];a["dojo.data.api.Notification"]&&!this.items&&(b.push(this.connect(this.store,"onSet","_onSet")),b.push(this.connect(this.store,"onNew","_onNew")),b.push(this.connect(this.store,"onDelete","_onDelete")));this._canEdit&&b.push(this.connect(this.store,"revert","_onRevert"));this._store_connects=b}},_onFetchBegin:function(a,b){this.scroller&&(this.rowCount!=a&&(b.isRender?
(this.scroller.init(a,this.keepRows,this.rowsPerPage),this.rowCount=a,this._setAutoHeightAttr(this.autoHeight,!0),this._skipRowRenormalize=!0,this.prerender(),this._skipRowRenormalize=!1):this.updateRowCount(a)),a?this.showMessage():(this.views.render(),this._resize(),this.showMessage(this.noDataMessage),this.focus.initFocusView()))},_onFetchComplete:function(a,b){this.scroller&&(a&&0<a.length&&(h.forEach(a,function(a,d){this._addItem(a,b.start+d,!0)},this),this.updateRows(b.start,a.length),b.isRender?
(this.setScrollTop(0),this.postrender()):this._lastScrollTop&&this.setScrollTop(this._lastScrollTop),p("ie")&&l.setSelectable(this.domNode,this.selectable)),delete this._lastScrollTop,this._isLoaded||(this._isLoading=!1,this._isLoaded=!0),this._pending_requests[b.start]=!1)},_onFetchError:function(a,b){delete this._lastScrollTop;this._isLoaded||(this._isLoading=!1,this._isLoaded=!0,this.showMessage(this.errorMessage));this._pending_requests[b.start]=!1;this.onFetchError(a,b)},onFetchError:function(a,
b){},_fetch:function(a,b){a=a||0;if(this.store&&!this._pending_requests[a]){!this._isLoaded&&!this._isLoading&&(this._isLoading=!0,this.showMessage(this.loadingMessage));this._pending_requests[a]=!0;try{if(this.items){var c=this.items,d=this.store;this.rowsPerPage=c.length;var e={start:a,count:this.rowsPerPage,isRender:b};this._onFetchBegin(c.length,e);var f=0;h.forEach(c,function(a){d.isItemLoaded(a)||f++});if(0===f)this._onFetchComplete(c,e);else{var k=function(a){f--;0===f&&this._onFetchComplete(c,
e)};h.forEach(c,function(a){d.isItemLoaded(a)||d.loadItem({item:a,onItem:k,scope:this})},this)}}else this.store.fetch({start:a,count:this.rowsPerPage,query:this.query,sort:this.getSortProps(),queryOptions:this.queryOptions,isRender:b,onBegin:g.hitch(this,"_onFetchBegin"),onComplete:g.hitch(this,"_onFetchComplete"),onError:g.hitch(this,"_onFetchError")})}catch(l){this._onFetchError(l,{start:a,count:this.rowsPerPage})}}},_clearData:function(){this.updateRowCount(0);this._by_idty={};this._by_idx=[];
this._pages=[];this._bop=this._eop=-1;this._isLoading=this._isLoaded=!1},getItem:function(a){var b=this._by_idx[a];return!b||b&&!b.item?(this._preparePage(a),null):b.item},getItemIndex:function(a){return this._getItemIndex(a,!1)},_getItemIndex:function(a,b){if(!b&&!this.store.isItem(a))return-1;for(var c=this._hasIdentity?this.store.getIdentity(a):null,d=0,e=this._by_idx.length;d<e;d++){var f=this._by_idx[d];if(f&&(c&&f.idty==c||f.item===a))return d}return-1},filter:function(a,b){this.query=a;b&&
this._clearData();this._fetch()},_getItemAttr:function(a,b){var c=this.getItem(a);return!c?this.fetchText:this.store.getValue(c,b)},_render:function(){this.domNode.parentNode&&(this.scroller.init(this.get("rowCount"),this.keepRows,this.rowsPerPage),this.prerender(),this._fetch(0,!0))},_requestsPending:function(a){return this._pending_requests[a]},_rowToPage:function(a){return this.rowsPerPage?Math.floor(a/this.rowsPerPage):a},_pageToRow:function(a){return this.rowsPerPage?this.rowsPerPage*a:a},_preparePage:function(a){if((a<
this._bop||a>=this._eop)&&!this._addingItem)a=this._rowToPage(a),this._needPage(a),this._bop=a*this.rowsPerPage,this._eop=this._bop+(this.rowsPerPage||this.get("rowCount"))},_needPage:function(a){this._pages[a]||(this._pages[a]=!0,this._requestPage(a))},_requestPage:function(a){a=this._pageToRow(a);0<Math.min(this.rowsPerPage,this.get("rowCount")-a)&&(this._requests++,this._requestsPending(a)||setTimeout(g.hitch(this,"_fetch",a,!1),1))},getCellName:function(a){return a.field},_refresh:function(a){this._clearData();
this._fetch(0,a)},sort:function(){this.edit.apply();this._lastScrollTop=this.scrollTop;this._refresh()},canSort:function(){return!this._isLoading},getSortProps:function(){var a=this.getCell(this.getSortIndex());if(a){var b=a.sortDesc,c=!(0<this.sortInfo);return[{attribute:a.field,descending:"undefined"==typeof b?c:c?!b:b}]}return this.sortFields?this.sortFields:null},styleRowState:function(a){if(this.store&&this.store.getState){for(var b=this.store.getState(a.index),c="",d=0,e=["inflight","error",
"inserting"],f;f=e[d];d++)if(b[f]){c=" dojoxGridRow-"+f;break}a.customClasses+=c}},onStyleRow:function(a){this.styleRowState(a);this.inherited(arguments)},canEdit:function(a,b){return this._canEdit},_copyAttr:function(a,b){var c=this.getItem(a);return this.store.getValue(c,b)},doStartEdit:function(a,b){this._cache[b]||(this._cache[b]=this._copyAttr(b,a.field));this.onStartEdit(a,b)},doApplyCellEdit:function(a,b,c){this.store.fetchItemByIdentity({identity:this._by_idx[b].idty,onItem:g.hitch(this,function(d){var e=
this.store.getValue(d,c);"number"==typeof e?a=isNaN(a)?a:parseFloat(a):"boolean"==typeof e?a="true"==a?!0:"false"==a?!1:a:e instanceof Date&&(e=new Date(a),a=isNaN(e.getTime())?a:e);this.store.setValue(d,c,a);this.onApplyCellEdit(a,b,c)})})},doCancelEdit:function(a){this._cache[a]&&(this.updateRow(a),delete this._cache[a]);this.onCancelEdit.apply(this,arguments)},doApplyEdit:function(a,b){this.onApplyEdit(a)},removeSelectedRows:function(){if(this._canEdit){this.edit.apply();var a=g.hitch(this,function(a){a.length&&
(h.forEach(a,this.store.deleteItem,this.store),this.selection.clear())});this.allItemsSelected?this.store.fetch({query:this.query,queryOptions:this.queryOptions,onComplete:a}):a(this.selection.getSelected())}}});k.cell_markupFactory=function(a,b,c){var d=g.trim(l.attr(b,"field")||"");d&&(c.field=d);c.field=c.field||c.name;if(d=g.trim(l.attr(b,"fields")||""))c.fields=d.split(",");a&&a(b,c)};k.markupFactory=function(a,b,c,d){return n.markupFactory(a,b,c,g.partial(k.cell_markupFactory,d))};return k});