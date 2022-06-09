define("10b09157-48a2-4d97-b504-881783b6651a_0.0.1", ["@microsoft/sp-property-pane","@microsoft/sp-loader","CrudPnpjsWebPartStrings","bootstrap","@microsoft/sp-core-library","@microsoft/sp-webpart-base"], function(__WEBPACK_EXTERNAL_MODULE__26ea__, __WEBPACK_EXTERNAL_MODULE_I6O9__, __WEBPACK_EXTERNAL_MODULE_RVWl__, __WEBPACK_EXTERNAL_MODULE_StVt__, __WEBPACK_EXTERNAL_MODULE_UWqr__, __WEBPACK_EXTERNAL_MODULE_br4S__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "VfU/");
/******/ })
/************************************************************************/
/******/ ({

/***/ "+/lA":
/*!*******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/net/digestcache.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var collections_1 = __webpack_require__(/*! ../collections/collections */ "hd/X");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var parsers_1 = __webpack_require__(/*! ../odata/parsers */ "eGqj");
var pnplibconfig_1 = __webpack_require__(/*! ../configuration/pnplibconfig */ "Mvka");
var CachedDigest = /** @class */ (function () {
    function CachedDigest() {
    }
    return CachedDigest;
}());
exports.CachedDigest = CachedDigest;
// allows for the caching of digests across all HttpClient's which each have their own DigestCache wrapper.
var digests = new collections_1.Dictionary();
var DigestCache = /** @class */ (function () {
    function DigestCache(_httpClient, _digests) {
        if (_digests === void 0) { _digests = digests; }
        this._httpClient = _httpClient;
        this._digests = _digests;
    }
    DigestCache.prototype.getDigest = function (webUrl) {
        var _this = this;
        var cachedDigest = this._digests.get(webUrl);
        if (cachedDigest !== null) {
            var now = new Date();
            if (now < cachedDigest.expiration) {
                return Promise.resolve(cachedDigest.value);
            }
        }
        var url = util_1.Util.combinePaths(webUrl, "/_api/contextinfo");
        var headers = {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose;charset=utf-8",
        };
        return this._httpClient.fetchRaw(url, {
            cache: "no-cache",
            credentials: "same-origin",
            headers: util_1.Util.extend(headers, pnplibconfig_1.RuntimeConfig.spHeaders, true),
            method: "POST",
        }).then(function (response) {
            var parser = new parsers_1.ODataDefaultParser();
            return parser.parse(response).then(function (d) { return d.GetContextWebInformation; });
        }).then(function (data) {
            var newCachedDigest = new CachedDigest();
            newCachedDigest.value = data.FormDigestValue;
            var seconds = data.FormDigestTimeoutSeconds;
            var expiration = new Date();
            expiration.setTime(expiration.getTime() + 1000 * seconds);
            newCachedDigest.expiration = expiration;
            _this._digests.add(webUrl, newCachedDigest);
            return newCachedDigest.value;
        });
    };
    DigestCache.prototype.clear = function () {
        this._digests.clear();
    };
    return DigestCache;
}());
exports.DigestCache = DigestCache;


/***/ }),

/***/ "/1ZT":
/*!*************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/navigation.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
/**
 * Represents a collection of navigation nodes
 *
 */
var NavigationNodes = /** @class */ (function (_super) {
    __extends(NavigationNodes, _super);
    function NavigationNodes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a navigation node by id
     *
     * @param id The id of the node
     */
    NavigationNodes.prototype.getById = function (id) {
        var node = new NavigationNode(this);
        node.concat("(" + id + ")");
        return node;
    };
    /**
     * Adds a new node to the collection
     *
     * @param title Display name of the node
     * @param url The url of the node
     * @param visible If true the node is visible, otherwise it is hidden (default: true)
     */
    NavigationNodes.prototype.add = function (title, url, visible) {
        var _this = this;
        if (visible === void 0) { visible = true; }
        var postBody = JSON.stringify({
            IsVisible: visible,
            Title: title,
            Url: url,
            "__metadata": { "type": "SP.NavigationNode" },
        });
        return this.clone(NavigationNodes, null).postCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                node: _this.getById(data.Id),
            };
        });
    };
    /**
     * Moves a node to be after another node in the navigation
     *
     * @param nodeId Id of the node to move
     * @param previousNodeId Id of the node after which we move the node specified by nodeId
     */
    NavigationNodes.prototype.moveAfter = function (nodeId, previousNodeId) {
        var postBody = JSON.stringify({
            nodeId: nodeId,
            previousNodeId: previousNodeId,
        });
        return this.clone(NavigationNodes, "MoveAfter").postCore({ body: postBody });
    };
    return NavigationNodes;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.NavigationNodes = NavigationNodes;
/**
 * Represents an instance of a navigation node
 *
 */
var NavigationNode = /** @class */ (function (_super) {
    __extends(NavigationNode, _super);
    function NavigationNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NavigationNode.prototype, "children", {
        /**
         * Represents the child nodes of this node
         */
        get: function () {
            return new NavigationNodes(this, "Children");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Deletes this node and any child nodes
     */
    NavigationNode.prototype.delete = function () {
        return _super.prototype.deleteCore.call(this);
    };
    return NavigationNode;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.NavigationNode = NavigationNode;
/**
 * Exposes the navigation components
 *
 */
var Navigation = /** @class */ (function (_super) {
    __extends(Navigation, _super);
    /**
     * Creates a new instance of the Navigation class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of these navigation components
     */
    function Navigation(baseUrl, path) {
        if (path === void 0) { path = "navigation"; }
        return _super.call(this, baseUrl, path) || this;
    }
    Object.defineProperty(Navigation.prototype, "quicklaunch", {
        /**
         * Gets the quicklaunch navigation nodes for the current context
         *
         */
        get: function () {
            return new NavigationNodes(this, "quicklaunch");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "topNavigationBar", {
        /**
         * Gets the top bar navigation nodes for the current context
         *
         */
        get: function () {
            return new NavigationNodes(this, "topnavigationbar");
        },
        enumerable: true,
        configurable: true
    });
    return Navigation;
}(sharepointqueryable_1.SharePointQueryable));
exports.Navigation = Navigation;
/**
 * Represents the top level navigation service
 */
var NavigationService = /** @class */ (function (_super) {
    __extends(NavigationService, _super);
    function NavigationService(path) {
        if (path === void 0) { path = null; }
        return _super.call(this, "_api/navigation", path) || this;
    }
    /**
     * The MenuState service operation returns a Menu-State (dump) of a SiteMapProvider on a site.
     *
     * @param menuNodeKey MenuNode.Key of the start node within the SiteMapProvider If no key is provided the SiteMapProvider.RootNode will be the root of the menu state.
     * @param depth Depth of the dump. If no value is provided a dump with the depth of 10 is returned
     * @param mapProviderName The name identifying the SiteMapProvider to be used
     * @param customProperties comma seperated list of custom properties to be returned.
     */
    NavigationService.prototype.getMenuState = function (menuNodeKey, depth, mapProviderName, customProperties) {
        if (menuNodeKey === void 0) { menuNodeKey = null; }
        if (depth === void 0) { depth = 10; }
        if (mapProviderName === void 0) { mapProviderName = null; }
        if (customProperties === void 0) { customProperties = null; }
        return (new NavigationService("MenuState")).postCore({
            body: JSON.stringify({
                customProperties: customProperties,
                depth: depth,
                mapProviderName: mapProviderName,
                menuNodeKey: menuNodeKey,
            }),
        });
    };
    /**
     * Tries to get a SiteMapNode.Key for a given URL within a site collection.
     *
     * @param currentUrl A url representing the SiteMapNode
     * @param mapProviderName The name identifying the SiteMapProvider to be used
     */
    NavigationService.prototype.getMenuNodeKey = function (currentUrl, mapProviderName) {
        if (mapProviderName === void 0) { mapProviderName = null; }
        return (new NavigationService("MenuNodeKey")).postCore({
            body: JSON.stringify({
                currentUrl: currentUrl,
                mapProviderName: mapProviderName,
            }),
        });
    };
    return NavigationService;
}(sharepointqueryable_1.SharePointQueryable));
exports.NavigationService = NavigationService;


/***/ }),

/***/ "/pGJ":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/items.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var sharepointqueryableshareable_1 = __webpack_require__(/*! ./sharepointqueryableshareable */ "gZxA");
var folders_1 = __webpack_require__(/*! ./folders */ "q1dm");
var files_1 = __webpack_require__(/*! ./files */ "MMX7");
var contenttypes_1 = __webpack_require__(/*! ./contenttypes */ "5e5a");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var core_1 = __webpack_require__(/*! ../odata/core */ "ntgF");
var attachmentfiles_1 = __webpack_require__(/*! ./attachmentfiles */ "RIUW");
var lists_1 = __webpack_require__(/*! ./lists */ "FFhP");
var pnp_1 = __webpack_require__(/*! ../pnp */ "7kAN");
/**
 * Describes a collection of Item objects
 *
 */
var Items = /** @class */ (function (_super) {
    __extends(Items, _super);
    /**
     * Creates a new instance of the Items class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Items(baseUrl, path) {
        if (path === void 0) { path = "items"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets an Item by id
     *
     * @param id The integer id of the item to retrieve
     */
    Items.prototype.getById = function (id) {
        var i = new Item(this);
        i.concat("(" + id + ")");
        return i;
    };
    /**
     * Gets BCS Item by string id
     *
     * @param stringId The string id of the BCS item to retrieve
     */
    Items.prototype.getItemByStringId = function (stringId) {
        var i = new Item(this);
        i.concat("/../getItemByStringId('" + stringId + "')");
        return i;
    };
    /**
     * Skips the specified number of items (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection6)
     *
     * @param skip The starting id where the page should start, use with top to specify pages
     * @param reverse It true the PagedPrev=true parameter is added allowing backwards navigation in the collection
     */
    Items.prototype.skip = function (skip, reverse) {
        if (reverse === void 0) { reverse = false; }
        if (reverse) {
            this._query.add("$skiptoken", encodeURIComponent("Paged=TRUE&PagedPrev=TRUE&p_ID=" + skip));
        }
        else {
            this._query.add("$skiptoken", encodeURIComponent("Paged=TRUE&p_ID=" + skip));
        }
        return this;
    };
    /**
     * Gets a collection designed to aid in paging through data
     *
     */
    Items.prototype.getPaged = function () {
        return this.getAs(new PagedItemCollectionParser());
    };
    /**
     * Gets all the items in a list, regardless of count. Does not support batching or caching
     *
     *  @param requestSize Number of items to return in each request (Default: 2000)
     */
    Items.prototype.getAll = function (requestSize) {
        var _this = this;
        if (requestSize === void 0) { requestSize = 2000; }
        pnp_1.Logger.write("Calling items.getAll should be done sparingly. Ensure this is the correct choice. If you are unsure, it is not.", pnp_1.LogLevel.Warning);
        // this will be used for the actual query
        // and we set no metadata here to try and reduce traffic
        var items = new Items(this, "").top(requestSize).configure({
            headers: {
                "Accept": "application/json;odata=nometadata",
            },
        });
        // let's copy over the odata query params that can be applied
        // $top - allow setting the page size this way (override what we did above)
        // $select - allow picking the return fields (good behavior)
        // $filter - allow setting a filter, though this may fail for large lists
        this.query.getKeys()
            .filter(function (k) { return /^\$select$|^\$filter$|^\$top$|^\$expand$/.test(k.toLowerCase()); })
            .reduce(function (i, k) {
            i.query.add(k, _this.query.get(k));
            return i;
        }, items);
        // give back the promise
        return new Promise(function (resolve, reject) {
            // this will eventually hold the items we return
            var itemsCollector = [];
            // action that will gather up our results recursively
            var gatherer = function (last) {
                // collect that set of results
                [].push.apply(itemsCollector, last.results);
                // if we have more, repeat - otherwise resolve with the collected items
                if (last.hasNext) {
                    last.getNext().then(gatherer).catch(reject);
                }
                else {
                    resolve(itemsCollector);
                }
            };
            // start the cycle
            items.getPaged().then(gatherer).catch(reject);
        });
    };
    /**
     * Adds a new item to the collection
     *
     * @param properties The new items's properties
     */
    Items.prototype.add = function (properties, listItemEntityTypeFullName) {
        var _this = this;
        if (properties === void 0) { properties = {}; }
        if (listItemEntityTypeFullName === void 0) { listItemEntityTypeFullName = null; }
        var removeDependency = this.addBatchDependency();
        return this.ensureListItemEntityTypeName(listItemEntityTypeFullName).then(function (listItemEntityType) {
            var postBody = JSON.stringify(util_1.Util.extend({
                "__metadata": { "type": listItemEntityType },
            }, properties));
            var promise = _this.clone(Items, null).postAsCore({ body: postBody }).then(function (data) {
                return {
                    data: data,
                    item: _this.getById(data.Id),
                };
            });
            removeDependency();
            return promise;
        });
    };
    /**
     * Ensures we have the proper list item entity type name, either from the value provided or from the list
     *
     * @param candidatelistItemEntityTypeFullName The potential type name
     */
    Items.prototype.ensureListItemEntityTypeName = function (candidatelistItemEntityTypeFullName) {
        return candidatelistItemEntityTypeFullName ?
            Promise.resolve(candidatelistItemEntityTypeFullName) :
            this.getParent(lists_1.List).getListItemEntityTypeFullName();
    };
    return Items;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Items = Items;
/**
 * Descrines a single Item instance
 *
 */
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Item.prototype, "attachmentFiles", {
        /**
         * Gets the set of attachments for this item
         *
         */
        get: function () {
            return new attachmentfiles_1.AttachmentFiles(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "contentType", {
        /**
         * Gets the content type for this item
         *
         */
        get: function () {
            return new contenttypes_1.ContentType(this, "ContentType");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "effectiveBasePermissions", {
        /**
         * Gets the effective base permissions for the item
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryable(this, "EffectiveBasePermissions");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "effectiveBasePermissionsForUI", {
        /**
         * Gets the effective base permissions for the item in a UI context
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryable(this, "EffectiveBasePermissionsForUI");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "fieldValuesAsHTML", {
        /**
         * Gets the field values for this list item in their HTML representation
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableInstance(this, "FieldValuesAsHTML");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "fieldValuesAsText", {
        /**
         * Gets the field values for this list item in their text representation
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableInstance(this, "FieldValuesAsText");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "fieldValuesForEdit", {
        /**
         * Gets the field values for this list item for use in editing controls
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableInstance(this, "FieldValuesForEdit");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "folder", {
        /**
         * Gets the folder associated with this list item (if this item represents a folder)
         *
         */
        get: function () {
            return new folders_1.Folder(this, "folder");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "file", {
        /**
         * Gets the folder associated with this list item (if this item represents a folder)
         *
         */
        get: function () {
            return new files_1.File(this, "file");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "versions", {
        /**
         * Gets the collection of versions associated with this item
         */
        get: function () {
            return new ItemVersions(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    Item.prototype.update = function (properties, eTag, listItemEntityTypeFullName) {
        var _this = this;
        if (eTag === void 0) { eTag = "*"; }
        if (listItemEntityTypeFullName === void 0) { listItemEntityTypeFullName = null; }
        return new Promise(function (resolve, reject) {
            var removeDependency = _this.addBatchDependency();
            return _this.ensureListItemEntityTypeName(listItemEntityTypeFullName).then(function (listItemEntityType) {
                var postBody = JSON.stringify(util_1.Util.extend({
                    "__metadata": { "type": listItemEntityType },
                }, properties));
                removeDependency();
                return _this.postCore({
                    body: postBody,
                    headers: {
                        "IF-Match": eTag,
                        "X-HTTP-Method": "MERGE",
                    },
                }, new ItemUpdatedParser()).then(function (data) {
                    resolve({
                        data: data,
                        item: _this,
                    });
                });
            }).catch(function (e) { return reject(e); });
        });
    };
    /**
     * Delete this item
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    Item.prototype.delete = function (eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return this.postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    /**
     * Moves the list item to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    Item.prototype.recycle = function () {
        return this.clone(Item, "recycle").postCore();
    };
    /**
     * Gets a string representation of the full URL to the WOPI frame.
     * If there is no associated WOPI application, or no associated action, an empty string is returned.
     *
     * @param action Display mode: 0: view, 1: edit, 2: mobileView, 3: interactivePreview
     */
    Item.prototype.getWopiFrameUrl = function (action) {
        if (action === void 0) { action = 0; }
        var i = this.clone(Item, "getWOPIFrameUrl(@action)");
        i._query.add("@action", action);
        return i.postCore().then(function (data) {
            // handle verbose mode
            if (data.hasOwnProperty("GetWOPIFrameUrl")) {
                return data.GetWOPIFrameUrl;
            }
            return data;
        });
    };
    /**
     * Validates and sets the values of the specified collection of fields for the list item.
     *
     * @param formValues The fields to change and their new values.
     * @param newDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     */
    Item.prototype.validateUpdateListItem = function (formValues, newDocumentUpdate) {
        if (newDocumentUpdate === void 0) { newDocumentUpdate = false; }
        return this.clone(Item, "validateupdatelistitem").postCore({
            body: JSON.stringify({ "formValues": formValues, bNewDocumentUpdate: newDocumentUpdate }),
        });
    };
    /**
     * Ensures we have the proper list item entity type name, either from the value provided or from the list
     *
     * @param candidatelistItemEntityTypeFullName The potential type name
     */
    Item.prototype.ensureListItemEntityTypeName = function (candidatelistItemEntityTypeFullName) {
        return candidatelistItemEntityTypeFullName ?
            Promise.resolve(candidatelistItemEntityTypeFullName) :
            this.getParent(lists_1.List, this.parentUrl.substr(0, this.parentUrl.lastIndexOf("/"))).getListItemEntityTypeFullName();
    };
    return Item;
}(sharepointqueryableshareable_1.SharePointQueryableShareableItem));
exports.Item = Item;
/**
 * Provides paging functionality for list items
 */
var PagedItemCollection = /** @class */ (function () {
    function PagedItemCollection(nextUrl, results) {
        this.nextUrl = nextUrl;
        this.results = results;
    }
    Object.defineProperty(PagedItemCollection.prototype, "hasNext", {
        /**
         * If true there are more results available in the set, otherwise there are not
         */
        get: function () {
            return typeof this.nextUrl === "string" && this.nextUrl.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the next set of results, or resolves to null if no results are available
     */
    PagedItemCollection.prototype.getNext = function () {
        if (this.hasNext) {
            var items = new Items(this.nextUrl, null);
            return items.getPaged();
        }
        return new Promise(function (r) { return r(null); });
    };
    return PagedItemCollection;
}());
exports.PagedItemCollection = PagedItemCollection;
/**
 * Describes a collection of Version objects
 *
 */
var ItemVersions = /** @class */ (function (_super) {
    __extends(ItemVersions, _super);
    /**
     * Creates a new instance of the File class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function ItemVersions(baseUrl, path) {
        if (path === void 0) { path = "versions"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a version by id
     *
     * @param versionId The id of the version to retrieve
     */
    ItemVersions.prototype.getById = function (versionId) {
        var v = new ItemVersion(this);
        v.concat("(" + versionId + ")");
        return v;
    };
    return ItemVersions;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.ItemVersions = ItemVersions;
/**
 * Describes a single Version instance
 *
 */
var ItemVersion = /** @class */ (function (_super) {
    __extends(ItemVersion, _super);
    function ItemVersion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
    * Delete a specific version of a file.
    *
    * @param eTag Value used in the IF-Match header, by default "*"
    */
    ItemVersion.prototype.delete = function () {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    return ItemVersion;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.ItemVersion = ItemVersion;
var PagedItemCollectionParser = /** @class */ (function (_super) {
    __extends(PagedItemCollectionParser, _super);
    function PagedItemCollectionParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PagedItemCollectionParser.prototype.parse = function (r) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.handleError(r, reject)) {
                r.json().then(function (json) {
                    var nextUrl = json.hasOwnProperty("d") && json.d.hasOwnProperty("__next") ? json.d.__next : json["odata.nextLink"];
                    resolve(new PagedItemCollection(nextUrl, _this.parseODataJSON(json)));
                });
            }
        });
    };
    return PagedItemCollectionParser;
}(core_1.ODataParserBase));
var ItemUpdatedParser = /** @class */ (function (_super) {
    __extends(ItemUpdatedParser, _super);
    function ItemUpdatedParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemUpdatedParser.prototype.parse = function (r) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.handleError(r, reject)) {
                resolve({
                    "odata.etag": r.headers.get("etag"),
                });
            }
        });
    };
    return ItemUpdatedParser;
}(core_1.ODataParserBase));


/***/ }),

/***/ "01TU":
/*!*********************************************************!*\
  !*** ./node_modules/@pnp/odata/invokable-extensions.js ***!
  \*********************************************************/
/*! exports provided: extendGlobal, extendObj, extendFactory, clearGlobalExtensions, disableExtensions, enableExtensions, applyFactoryExtensions, extensionOrDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extendGlobal", function() { return extendGlobal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extendObj", function() { return extendObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extendFactory", function() { return extendFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearGlobalExtensions", function() { return clearGlobalExtensions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disableExtensions", function() { return disableExtensions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableExtensions", function() { return enableExtensions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyFactoryExtensions", function() { return applyFactoryExtensions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extensionOrDefault", function() { return extensionOrDefault; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "t3D1");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");


var _enableExtensions = false;
var globalExtensions = [];
var factoryExtensions = new Map();
var ObjExtensionsSym = Symbol.for("43f7a601");
/**
 * Creates global extensions across all invokable objects
 *
 * @param e The global extensions to apply
 */
var extendGlobal = function (e) {
    _enableExtensions = true;
    extendCol(globalExtensions, e);
};
/**
 * Applies the supplied extensions to a single instance
 *
 * @param target Object to which extensions are applied
 * @param extensions Extensions to apply
 */
// eslint-disable-next-line @typescript-eslint/ban-types
var extendObj = function (target, extensions) {
    _enableExtensions = true;
    if (!Reflect.has(target, ObjExtensionsSym)) {
        Reflect.set(target, ObjExtensionsSym, []);
    }
    extendCol(Reflect.get(target, ObjExtensionsSym), extensions);
    return target;
};
/**
 * Allows applying extensions to all instances created from the supplied factory
 *
 * @param factory The Invokable Factory method to extend
 * @param extensions Extensions to apply
 */
var extendFactory = function (factory, extensions) {
    _enableExtensions = true;
    // factoryExtensions
    var proto = Reflect.getPrototypeOf(factory);
    if (!Reflect.has(proto, ObjExtensionsSym)) {
        Reflect.defineProperty(proto, ObjExtensionsSym, {
            value: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["getGUID"])(),
        });
    }
    var key = proto[ObjExtensionsSym];
    if (!factoryExtensions.has(key)) {
        factoryExtensions.set(key, []);
    }
    extendCol(factoryExtensions.get(key), extensions);
};
function extendCol(a, e) {
    if (Array.isArray(e)) {
        a.push.apply(a, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(e), false));
    }
    else {
        a.push(e);
    }
}
/**
 * Clears all global extensions
 */
var clearGlobalExtensions = function () {
    globalExtensions.length = 0;
};
/**
 * Disables all extensions
 */
var disableExtensions = function () {
    _enableExtensions = false;
};
/**
 * Enables all extensions
 */
var enableExtensions = function () {
    _enableExtensions = true;
};
/**
 * Applies a set of extension previously applied to a factory using extendFactory to an object created from that factory
 *
 * @param factory
 * @param args
 */
// eslint-disable-next-line @typescript-eslint/ban-types
var applyFactoryExtensions = function (factory, args) {
    var o = factory(args);
    var proto = Reflect.getPrototypeOf(factory);
    if (Reflect.has(proto, ObjExtensionsSym)) {
        var extensions = factoryExtensions.get(Reflect.get(proto, ObjExtensionsSym));
        o = extendObj(o, extensions);
    }
    return o;
};
function extensionOrDefault(op, or, target) {
    var rest = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        rest[_i - 3] = arguments[_i];
    }
    if (_enableExtensions) {
        var extensions = [];
        // we need to first invoke extensions tied to only this object
        if (Reflect.has(target, ObjExtensionsSym)) {
            extensions.push.apply(extensions, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(Reflect.get(target, ObjExtensionsSym)), false));
        }
        // second we need to process any global extensions
        extensions.push.apply(extensions, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(globalExtensions), false));
        for (var i = 0; i < extensions.length; i++) {
            var extension = extensions[i];
            var result = undefined;
            if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["isFunc"])(extension)) {
                // this extension is a function which we call
                result = extension.apply(void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([op, target], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(rest), false));
            }
            else if (op === "get" && Reflect.has(extension, rest[0])) {
                // this extension is a named extension meaning we are overriding a specific method/property
                result = Reflect.get(extension, rest[0], target);
            }
            else if (Reflect.has(extension, op)) {
                // this extension is a ProxyHandler that has a handler defined for {op} so we pass control and see if we get a result
                result = Reflect.get(extension, op).apply(void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([target], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(rest), false));
            }
            if (typeof result !== "undefined") {
                // if a extension returned a result, we return that
                // this means that this extension overrides any other extensions and no more are executed
                // first extension in the list to return "wins"
                return result;
            }
        }
    }
    return or.apply(void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([target], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(rest), false));
}
//# sourceMappingURL=invokable-extensions.js.map

/***/ }),

/***/ "08ZC":
/*!*************************************************!*\
  !*** ./node_modules/@pnp/common/safe-global.js ***!
  \*************************************************/
/*! exports provided: safeGlobal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "safeGlobal", function() { return safeGlobal; });
// export either window or global
var safeGlobal = typeof global === "undefined" ? window : global;
//# sourceMappingURL=safe-global.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "yLpj")))

/***/ }),

/***/ "0p/9":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/splibconfig.js ***!
  \*********************************************/
/*! exports provided: emptyGuid, setup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emptyGuid", function() { return emptyGuid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setup", function() { return setup; });
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/common */ "zqEK");

var emptyGuid = "00000000-0000-0000-0000-000000000000";
Object(_pnp_common__WEBPACK_IMPORTED_MODULE_0__["onRuntimeCreate"])(function (runtime) {
    var existing = runtime.get("sp");
    var spPart = Object.assign({}, {
        fetchClientFactory: function () { return new _pnp_common__WEBPACK_IMPORTED_MODULE_0__["FetchClient"](); },
    }, existing);
    runtime.assign({ sp: spPart });
});
function setup(config, runtime) {
    if (runtime === void 0) { runtime = _pnp_common__WEBPACK_IMPORTED_MODULE_0__["DefaultRuntime"]; }
    runtime.assign(config);
}
//# sourceMappingURL=splibconfig.js.map

/***/ }),

/***/ "1Cz4":
/*!***********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/features.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
/**
 * Describes a collection of List objects
 *
 */
var Features = /** @class */ (function (_super) {
    __extends(Features, _super);
    /**
     * Creates a new instance of the Lists class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Features(baseUrl, path) {
        if (path === void 0) { path = "features"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the feature (GUID)
     */
    Features.prototype.getById = function (id) {
        var feature = new Feature(this);
        feature.concat("('" + id + "')");
        return feature;
    };
    /**
     * Adds a new list to the collection
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature activation will be forced
     */
    Features.prototype.add = function (id, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        return this.clone(Features, "add").postCore({
            body: JSON.stringify({
                featdefScope: 0,
                featureId: id,
                force: force,
            }),
        }).then(function (data) {
            return {
                data: data,
                feature: _this.getById(id),
            };
        });
    };
    /**
     * Removes (deactivates) a feature from the collection
     *
     * @param id The Id of the feature (GUID)
     * @param force If true the feature deactivation will be forced
     */
    Features.prototype.remove = function (id, force) {
        if (force === void 0) { force = false; }
        return this.clone(Features, "remove").postCore({
            body: JSON.stringify({
                featureId: id,
                force: force,
            }),
        });
    };
    return Features;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Features = Features;
var Feature = /** @class */ (function (_super) {
    __extends(Feature, _super);
    function Feature() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Removes (deactivates) a feature from the collection
     *
     * @param force If true the feature deactivation will be forced
     */
    Feature.prototype.deactivate = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        var removeDependency = this.addBatchDependency();
        var idGet = new Feature(this).select("DefinitionId");
        return idGet.getAs().then(function (feature) {
            var promise = _this.getParent(Features, _this.parentUrl, "", _this.batch).remove(feature.DefinitionId, force);
            removeDependency();
            return promise;
        });
    };
    return Feature;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.Feature = Feature;


/***/ }),

/***/ "1OJs":
/*!******************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/net/nodefetchclientbrowser.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
/**
 * This module is substituted for the NodeFetchClient.ts during the packaging process. This helps to reduce the pnp.js file size by
 * not including all of the node dependencies
 */
var NodeFetchClient = /** @class */ (function () {
    function NodeFetchClient() {
    }
    /**
     * Always throws an error that NodeFetchClient is not supported for use in the browser
     */
    NodeFetchClient.prototype.fetch = function () {
        throw new exceptions_1.NodeFetchClientUnsupportedException();
    };
    return NodeFetchClient;
}());
exports.NodeFetchClient = NodeFetchClient;


/***/ }),

/***/ "1jZ6":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/sites/index.js ***!
  \*********************************************/
/*! exports provided: Site */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../rest.js */ "9l4K");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "ilAS");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Site", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["Site"]; });




Reflect.defineProperty(_rest_js__WEBPACK_IMPORTED_MODULE_0__["SPRest"].prototype, "site", {
    configurable: true,
    enumerable: true,
    get: function () {
        return this.childConfigHook(function (_a) {
            var options = _a.options, baseUrl = _a.baseUrl, runtime = _a.runtime;
            return Object(_types_js__WEBPACK_IMPORTED_MODULE_1__["Site"])(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "23Rm":
/*!**************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/exports/sp.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ../sharepoint/index */ "zvTx"));


/***/ }),

/***/ "26ea":
/*!**********************************************!*\
  !*** external "@microsoft/sp-property-pane" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__26ea__;

/***/ }),

/***/ "2C3z":
/*!*****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/utils/logging.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A set of logging levels
 *
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Warning"] = 2] = "Warning";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Off"] = 99] = "Off";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * Class used to subscribe ILogListener and log messages throughout an application
 *
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Object.defineProperty(Logger, "activeLogLevel", {
        get: function () {
            return Logger.instance.activeLogLevel;
        },
        set: function (value) {
            Logger.instance.activeLogLevel = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Logger, "instance", {
        get: function () {
            if (typeof Logger._instance === "undefined" || Logger._instance === null) {
                Logger._instance = new LoggerImpl();
            }
            return Logger._instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds ILogListener instances to the set of subscribed listeners
     *
     * @param listeners One or more listeners to subscribe to this log
     */
    Logger.subscribe = function () {
        var listeners = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            listeners[_i] = arguments[_i];
        }
        listeners.map(function (listener) { return Logger.instance.subscribe(listener); });
    };
    /**
     * Clears the subscribers collection, returning the collection before modifiction
     */
    Logger.clearSubscribers = function () {
        return Logger.instance.clearSubscribers();
    };
    Object.defineProperty(Logger, "count", {
        /**
         * Gets the current subscriber count
         */
        get: function () {
            return Logger.instance.count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Writes the supplied string to the subscribed listeners
     *
     * @param message The message to write
     * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Verbose)
     */
    Logger.write = function (message, level) {
        if (level === void 0) { level = LogLevel.Verbose; }
        Logger.instance.log({ level: level, message: message });
    };
    /**
     * Writes the supplied string to the subscribed listeners
     *
     * @param json The json object to stringify and write
     * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Verbose)
     */
    Logger.writeJSON = function (json, level) {
        if (level === void 0) { level = LogLevel.Verbose; }
        Logger.instance.log({ level: level, message: JSON.stringify(json) });
    };
    /**
     * Logs the supplied entry to the subscribed listeners
     *
     * @param entry The message to log
     */
    Logger.log = function (entry) {
        Logger.instance.log(entry);
    };
    /**
     * Logs performance tracking data for the the execution duration of the supplied function using console.profile
     *
     * @param name The name of this profile boundary
     * @param f The function to execute and track within this performance boundary
     */
    Logger.measure = function (name, f) {
        return Logger.instance.measure(name, f);
    };
    return Logger;
}());
exports.Logger = Logger;
var LoggerImpl = /** @class */ (function () {
    function LoggerImpl(activeLogLevel, subscribers) {
        if (activeLogLevel === void 0) { activeLogLevel = LogLevel.Warning; }
        if (subscribers === void 0) { subscribers = []; }
        this.activeLogLevel = activeLogLevel;
        this.subscribers = subscribers;
    }
    LoggerImpl.prototype.subscribe = function (listener) {
        this.subscribers.push(listener);
    };
    LoggerImpl.prototype.clearSubscribers = function () {
        var s = this.subscribers.slice(0);
        this.subscribers.length = 0;
        return s;
    };
    Object.defineProperty(LoggerImpl.prototype, "count", {
        get: function () {
            return this.subscribers.length;
        },
        enumerable: true,
        configurable: true
    });
    LoggerImpl.prototype.write = function (message, level) {
        if (level === void 0) { level = LogLevel.Verbose; }
        this.log({ level: level, message: message });
    };
    LoggerImpl.prototype.log = function (entry) {
        if (typeof entry === "undefined" || entry.level < this.activeLogLevel) {
            return;
        }
        this.subscribers.map(function (subscriber) { return subscriber.log(entry); });
    };
    LoggerImpl.prototype.measure = function (name, f) {
        console.profile(name);
        try {
            return f();
        }
        finally {
            console.profileEnd();
        }
    };
    return LoggerImpl;
}());
/**
 * Implementation of ILogListener which logs to the browser console
 *
 */
var ConsoleListener = /** @class */ (function () {
    function ConsoleListener() {
    }
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    ConsoleListener.prototype.log = function (entry) {
        var msg = this.format(entry);
        switch (entry.level) {
            case LogLevel.Verbose:
            case LogLevel.Info:
                console.log(msg);
                break;
            case LogLevel.Warning:
                console.warn(msg);
                break;
            case LogLevel.Error:
                console.error(msg);
                break;
        }
    };
    /**
     * Formats the message
     *
     * @param entry The information to format into a string
     */
    ConsoleListener.prototype.format = function (entry) {
        var msg = [];
        msg.push("Message: " + entry.message);
        if (typeof entry.data !== "undefined") {
            msg.push(" Data: " + JSON.stringify(entry.data));
        }
        return msg.join("");
    };
    return ConsoleListener;
}());
exports.ConsoleListener = ConsoleListener;
/**
 * Implementation of ILogListener which logs to the supplied function
 *
 */
var FunctionListener = /** @class */ (function () {
    /**
     * Creates a new instance of the FunctionListener class
     *
     * @constructor
     * @param  method The method to which any logging data will be passed
     */
    function FunctionListener(method) {
        this.method = method;
    }
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    FunctionListener.prototype.log = function (entry) {
        this.method(entry);
    };
    return FunctionListener;
}());
exports.FunctionListener = FunctionListener;


/***/ }),

/***/ "3DT9":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/items/types.js ***!
  \*********************************************/
/*! exports provided: _Items, Items, _Item, Item, _ItemVersions, ItemVersions, _ItemVersion, ItemVersion, PagedItemCollection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_Items", function() { return _Items; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Items", function() { return Items; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_Item", function() { return _Item; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Item", function() { return Item; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_ItemVersions", function() { return _ItemVersions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ItemVersions", function() { return ItemVersions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_ItemVersion", function() { return _ItemVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ItemVersion", function() { return ItemVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PagedItemCollection", function() { return PagedItemCollection; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sharepointqueryable.js */ "E6kk");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _lists_types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lists/types.js */ "hy0S");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _pnp_logging__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @pnp/logging */ "B3L+");
/* harmony import */ var _utils_metadata_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/metadata.js */ "z067");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../decorators.js */ "hMpi");
/* harmony import */ var _operations_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../operations.js */ "UK2s");
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../telemetry.js */ "h3gW");
/* harmony import */ var _utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/extractweburl.js */ "tSEd");
/* harmony import */ var _utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/escapeQueryStrValue.js */ "q1Lp");












/**
 * Describes a collection of Item objects
 *
 */
var _Items = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_Items, _super);
    function _Items() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
    * Gets an Item by id
    *
    * @param id The integer id of the item to retrieve
    */
    _Items.prototype.getById = function (id) {
        return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Item(this).concat("(" + id + ")"), "is.getById");
    };
    /**
     * Gets BCS Item by string id
     *
     * @param stringId The string id of the BCS item to retrieve
     */
    _Items.prototype.getItemByStringId = function (stringId) {
        // creates an item with the parent list path and append out method call
        return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Item(this.parentUrl, "getItemByStringId('" + stringId + "')"), "is.getItemByStringId");
    };
    /**
     * Skips the specified number of items (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection6)
     *
     * @param skip The starting id where the page should start, use with top to specify pages
     * @param reverse It true the PagedPrev=true parameter is added allowing backwards navigation in the collection
     */
    _Items.prototype.skip = function (skip, reverse) {
        if (reverse === void 0) { reverse = false; }
        if (reverse) {
            this.query.set("$skiptoken", encodeURIComponent("Paged=TRUE&PagedPrev=TRUE&p_ID=" + skip));
        }
        else {
            this.query.set("$skiptoken", encodeURIComponent("Paged=TRUE&p_ID=" + skip));
        }
        return this;
    };
    /**
     * Gets a collection designed to aid in paging through data
     *
     */
    _Items.prototype.getPaged = function () {
        return this.usingParser(new PagedItemCollectionParser(this))();
    };
    /**
     * Gets all the items in a list, regardless of count. Does not support batching or caching
     *
     *  @param requestSize Number of items to return in each request (Default: 2000)
     *  @param acceptHeader Allows for setting the value of the Accept header for SP 2013 support
     */
    _Items.prototype.getAll = function (requestSize, acceptHeader) {
        if (requestSize === void 0) { requestSize = 2000; }
        if (acceptHeader === void 0) { acceptHeader = "application/json;odata=nometadata"; }
        _pnp_logging__WEBPACK_IMPORTED_MODULE_5__["Logger"].write("Calling items.getAll should be done sparingly. Ensure this is the correct choice. If you are unsure, it is not.", 2 /* Warning */);
        // this will be used for the actual query
        // and we set no metadata here to try and reduce traffic
        var items = Items(this, "").top(requestSize).configure({
            headers: {
                "Accept": acceptHeader,
            },
        });
        // let's copy over the odata query params that can be applied
        // $top - allow setting the page size this way (override what we did above)
        // $select - allow picking the return fields (good behavior)
        // $filter - allow setting a filter, though this may fail due for large lists
        this.query.forEach(function (v, k) {
            if (/^\$select|filter|top|expand$/i.test(k)) {
                items.query.set(k, v);
            }
        });
        // give back the promise
        return new Promise(function (resolve, reject) {
            // this will eventually hold the items we return
            var itemsCollector = [];
            // action that will gather up our results recursively
            var gatherer = function (last) {
                // collect that set of results
                [].push.apply(itemsCollector, last.results);
                // if we have more, repeat - otherwise resolve with the collected items
                if (last.hasNext) {
                    last.getNext().then(gatherer).catch(reject);
                }
                else {
                    resolve(itemsCollector);
                }
            };
            // start the cycle
            items.getPaged().then(gatherer).catch(reject);
        });
    };
    /**
     * Adds a new item to the collection
     *
     * @param properties The new items's properties
     * @param listItemEntityTypeFullName The type name of the list's entities
     */
    _Items.prototype.add = function (properties, listItemEntityTypeFullName) {
        if (properties === void 0) { properties = {}; }
        if (listItemEntityTypeFullName === void 0) { listItemEntityTypeFullName = null; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var removeDependency, listItemEntityType, postBody, promise;
            var _this = this;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        removeDependency = this.addBatchDependency();
                        return [4 /*yield*/, this.ensureListItemEntityTypeName(listItemEntityTypeFullName)];
                    case 1:
                        listItemEntityType = _a.sent();
                        postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_4__["body"])(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_6__["metadata"])(listItemEntityType), properties));
                        promise = Object(_operations_js__WEBPACK_IMPORTED_MODULE_8__["spPost"])(this.clone(Items, ""), postBody).then(function (data) {
                            return {
                                data: data,
                                item: _this.getById(data.Id),
                            };
                        });
                        removeDependency();
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    /**
     * Ensures we have the proper list item entity type name, either from the value provided or from the list
     *
     * @param candidatelistItemEntityTypeFullName The potential type name
     */
    _Items.prototype.ensureListItemEntityTypeName = function (candidatelistItemEntityTypeFullName) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                return [2 /*return*/, candidatelistItemEntityTypeFullName ?
                        candidatelistItemEntityTypeFullName :
                        this.getParent(_lists_types_js__WEBPACK_IMPORTED_MODULE_3__["List"]).getListItemEntityTypeFullName()];
            });
        });
    };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("is.getPaged")
    ], _Items.prototype, "getPaged", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("is.getAll")
    ], _Items.prototype, "getAll", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("is.add")
    ], _Items.prototype, "add", null);
    _Items = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_decorators_js__WEBPACK_IMPORTED_MODULE_7__["defaultPath"])("items")
    ], _Items);
    return _Items;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["_SharePointQueryableCollection"]));

var Items = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["spInvokableFactory"])(_Items);
/**
 * Descrines a single Item instance
 *
 */
var _Item = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_Item, _super);
    function _Item() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delete = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["deleteableWithETag"])("i");
        return _this;
    }
    Object.defineProperty(_Item.prototype, "effectiveBasePermissions", {
        /**
         * Gets the effective base permissions for the item
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["SharePointQueryable"])(this, "EffectiveBasePermissions"), "i.effectiveBasePermissions");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Item.prototype, "effectiveBasePermissionsForUI", {
        /**
         * Gets the effective base permissions for the item in a UI context
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["SharePointQueryable"])(this, "EffectiveBasePermissionsForUI"), "i.effectiveBasePermissionsForUI");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Item.prototype, "fieldValuesAsHTML", {
        /**
         * Gets the field values for this list item in their HTML representation
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["SharePointQueryableInstance"])(this, "FieldValuesAsHTML"), "i.fvHTML");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Item.prototype, "fieldValuesAsText", {
        /**
         * Gets the field values for this list item in their text representation
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["SharePointQueryableInstance"])(this, "FieldValuesAsText"), "i.fvText");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Item.prototype, "fieldValuesForEdit", {
        /**
         * Gets the field values for this list item for use in editing controls
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["SharePointQueryableInstance"])(this, "FieldValuesForEdit"), "i.fvEdit");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Item.prototype, "versions", {
        /**
         * Gets the collection of versions associated with this item
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(ItemVersions(this), "i.versions");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Item.prototype, "list", {
        get: function () {
            return this.getParent(_lists_types_js__WEBPACK_IMPORTED_MODULE_3__["List"], this.parentUrl.substr(0, this.parentUrl.lastIndexOf("/")));
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Updates this list instance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     * @param listItemEntityTypeFullName The type name of the list's entities
     */
    _Item.prototype.update = function (properties, eTag, listItemEntityTypeFullName) {
        if (eTag === void 0) { eTag = "*"; }
        if (listItemEntityTypeFullName === void 0) { listItemEntityTypeFullName = null; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var removeDependency, listItemEntityType, postBody, poster, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        removeDependency = this.addBatchDependency();
                        return [4 /*yield*/, this.ensureListItemEntityTypeName(listItemEntityTypeFullName)];
                    case 1:
                        listItemEntityType = _a.sent();
                        postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_4__["body"])(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_6__["metadata"])(listItemEntityType), properties), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_4__["headers"])({
                            "IF-Match": eTag,
                            "X-HTTP-Method": "MERGE",
                        }));
                        removeDependency();
                        poster = _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(this.clone(Item).usingParser(new ItemUpdatedParser()), "i.update");
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_8__["spPost"])(poster, postBody)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data,
                                item: this,
                            }];
                }
            });
        });
    };
    /**
     * Moves the list item to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    _Item.prototype.recycle = function () {
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_8__["spPost"])(this.clone(Item, "recycle"));
    };
    /**
     * Deletes the item object with options.
     *
     * @param parameters Specifies the options to use when deleting a item.
     */
    _Item.prototype.deleteWithParams = function (parameters) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                return [2 /*return*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_8__["spPost"])(this.clone(Item, "DeleteWithParameters"), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_4__["body"])({ parameters: parameters }))];
            });
        });
    };
    /**
     * Gets a string representation of the full URL to the WOPI frame.
     * If there is no associated WOPI application, or no associated action, an empty string is returned.
     *
     * @param action Display mode: 0: view, 1: edit, 2: mobileView, 3: interactivePreview
     */
    _Item.prototype.getWopiFrameUrl = function (action) {
        if (action === void 0) { action = 0; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var i, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = this.clone(Item, "getWOPIFrameUrl(@action)");
                        i.query.set("@action", action);
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_8__["spPost"])(i)];
                    case 1:
                        data = _a.sent();
                        // handle verbose mode
                        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["hOP"])(data, "GetWOPIFrameUrl")) {
                            return [2 /*return*/, data.GetWOPIFrameUrl];
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Validates and sets the values of the specified collection of fields for the list item.
     *
     * @param formValues The fields to change and their new values.
     * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     */
    _Item.prototype.validateUpdateListItem = function (formValues, bNewDocumentUpdate) {
        if (bNewDocumentUpdate === void 0) { bNewDocumentUpdate = false; }
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_8__["spPost"])(this.clone(Item, "validateupdatelistitem"), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_4__["body"])({ formValues: formValues, bNewDocumentUpdate: bNewDocumentUpdate }));
    };
    /**
     * Gets the parent information for this item's list and web
     */
    _Item.prototype.getParentInfos = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var urlInfo;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.select("Id", "ParentList/Id", "ParentList/Title", "ParentList/RootFolder/UniqueId", "ParentList/RootFolder/ServerRelativeUrl", "ParentList/RootFolder/ServerRelativePath", "ParentList/ParentWeb/Id", "ParentList/ParentWeb/Url", "ParentList/ParentWeb/ServerRelativeUrl", "ParentList/ParentWeb/ServerRelativePath").expand("ParentList", "ParentList/RootFolder", "ParentList/ParentWeb")()];
                    case 1:
                        urlInfo = _a.sent();
                        return [2 /*return*/, {
                                Item: {
                                    Id: urlInfo.Id,
                                },
                                ParentList: {
                                    Id: urlInfo.ParentList.Id,
                                    Title: urlInfo.ParentList.Title,
                                    RootFolderServerRelativePath: urlInfo.ParentList.RootFolder.ServerRelativePath,
                                    RootFolderServerRelativeUrl: urlInfo.ParentList.RootFolder.ServerRelativeUrl,
                                    RootFolderUniqueId: urlInfo.ParentList.RootFolder.UniqueId,
                                },
                                ParentWeb: {
                                    Id: urlInfo.ParentList.ParentWeb.Id,
                                    ServerRelativePath: urlInfo.ParentList.ParentWeb.ServerRelativePath,
                                    ServerRelativeUrl: urlInfo.ParentList.ParentWeb.ServerRelativeUrl,
                                    Url: urlInfo.ParentList.ParentWeb.Url,
                                },
                            }];
                }
            });
        });
    };
    _Item.prototype.setImageField = function (fieldName, imageName, imageContent) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var contextInfo, webUrl, q, result, itemInfo;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getParentInfos()];
                    case 1:
                        contextInfo = _a.sent();
                        webUrl = Object(_utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_10__["extractWebUrl"])(this.toUrl());
                        q = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["SharePointQueryable"])(webUrl, "/_api/web/UploadImage");
                        q.concat("(listTitle=@a1,imageName=@a2,listId=@a3,itemId=@a4)");
                        q.query.set("@a1", "'" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_11__["escapeQueryStrValue"])(contextInfo.ParentList.Title) + "'");
                        q.query.set("@a2", "'" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_11__["escapeQueryStrValue"])(imageName) + "'");
                        q.query.set("@a3", "'" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_11__["escapeQueryStrValue"])(contextInfo.ParentList.Id) + "'");
                        q.query.set("@a4", contextInfo.Item.Id);
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_8__["spPost"])(q, { body: imageContent })];
                    case 2:
                        result = _a.sent();
                        itemInfo = {
                            "type": "thumbnail",
                            "fileName": result.Name,
                            "nativeFile": {},
                            "fieldName": fieldName,
                            "serverUrl": contextInfo.ParentWeb.Url.replace(contextInfo.ParentWeb.ServerRelativeUrl, ""),
                            "serverRelativeUrl": result.ServerRelativeUrl,
                            "id": result.UniqueId,
                        };
                        return [2 /*return*/, this.validateUpdateListItem([{
                                    FieldName: fieldName,
                                    FieldValue: JSON.stringify(itemInfo),
                                }])];
                }
            });
        });
    };
    /**
     * Ensures we have the proper list item entity type name, either from the value provided or from the list
     *
     * @param candidatelistItemEntityTypeFullName The potential type name
     */
    _Item.prototype.ensureListItemEntityTypeName = function (candidatelistItemEntityTypeFullName) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                return [2 /*return*/, candidatelistItemEntityTypeFullName ?
                        candidatelistItemEntityTypeFullName :
                        this.list.getListItemEntityTypeFullName()];
            });
        });
    };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("i.recycle")
    ], _Item.prototype, "recycle", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("i.del-params")
    ], _Item.prototype, "deleteWithParams", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("i.getWopiFrameUrl")
    ], _Item.prototype, "getWopiFrameUrl", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("i.validateUpdateListItem")
    ], _Item.prototype, "validateUpdateListItem", null);
    return _Item;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["_SharePointQueryableInstance"]));

var Item = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["spInvokableFactory"])(_Item);
/**
 * Describes a collection of Version objects
 *
 */
var _ItemVersions = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_ItemVersions, _super);
    function _ItemVersions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a version by id
     *
     * @param versionId The id of the version to retrieve
     */
    _ItemVersions.prototype.getById = function (versionId) {
        return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(ItemVersion(this).concat("(" + versionId + ")"), "iv.getById");
    };
    _ItemVersions = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_decorators_js__WEBPACK_IMPORTED_MODULE_7__["defaultPath"])("versions")
    ], _ItemVersions);
    return _ItemVersions;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["_SharePointQueryableCollection"]));

var ItemVersions = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["spInvokableFactory"])(_ItemVersions);
/**
 * Describes a single Version instance
 *
 */
var _ItemVersion = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_ItemVersion, _super);
    function _ItemVersion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delete = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["deleteableWithETag"])("iv");
        return _this;
    }
    return _ItemVersion;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["_SharePointQueryableInstance"]));

var ItemVersion = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["spInvokableFactory"])(_ItemVersion);
/**
 * Provides paging functionality for list items
 */
var PagedItemCollection = /** @class */ (function () {
    function PagedItemCollection(parent, nextUrl, results) {
        this.parent = parent;
        this.nextUrl = nextUrl;
        this.results = results;
    }
    Object.defineProperty(PagedItemCollection.prototype, "hasNext", {
        /**
         * If true there are more results available in the set, otherwise there are not
         */
        get: function () {
            return typeof this.nextUrl === "string" && this.nextUrl.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the next set of results, or resolves to null if no results are available
     */
    PagedItemCollection.prototype.getNext = function () {
        if (this.hasNext) {
            var items = _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Items(this.nextUrl, null).configureFrom(this.parent), "ip.getNext");
            return items.getPaged();
        }
        return new Promise(function (r) { return r(null); });
    };
    return PagedItemCollection;
}());

var PagedItemCollectionParser = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(PagedItemCollectionParser, _super);
    function PagedItemCollectionParser(_parent) {
        var _this = _super.call(this) || this;
        _this._parent = _parent;
        return _this;
    }
    PagedItemCollectionParser.prototype.parse = function (r) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.handleError(r, reject)) {
                r.json().then(function (json) {
                    var nextUrl = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["hOP"])(json, "d") && Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["hOP"])(json.d, "__next") ? json.d.__next : json["odata.nextLink"];
                    resolve(new PagedItemCollection(_this._parent, nextUrl, _this.parseODataJSON(json)));
                });
            }
        });
    };
    return PagedItemCollectionParser;
}(_pnp_odata__WEBPACK_IMPORTED_MODULE_4__["ODataParser"]));
var ItemUpdatedParser = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(ItemUpdatedParser, _super);
    function ItemUpdatedParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemUpdatedParser.prototype.parse = function (r) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.handleError(r, reject)) {
                resolve({
                    "odata.etag": r.headers.get("etag"),
                });
            }
        });
    };
    return ItemUpdatedParser;
}(_pnp_odata__WEBPACK_IMPORTED_MODULE_4__["ODataParser"]));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "3Yu8":
/*!*********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/attachments.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
var Attachments = /** @class */ (function (_super) {
    __extends(Attachments, _super);
    function Attachments(baseUrl, path) {
        if (path === void 0) { path = "attachments"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a member of the group by id
     *
     * @param id Attachment id
     */
    Attachments.prototype.getById = function (id) {
        return new Attachment(this, id);
    };
    /**
     * Add attachment to this collection
     *
     * @param name Name given to the attachment file
     * @param bytes File content
     */
    Attachments.prototype.addFile = function (name, bytes) {
        return this.postCore({
            body: JSON.stringify({
                "@odata.type": "#microsoft.graph.fileAttachment",
                contentBytes: bytes,
                name: name,
            }),
        });
    };
    return Attachments;
}(graphqueryable_1.GraphQueryableCollection));
exports.Attachments = Attachments;
var Attachment = /** @class */ (function (_super) {
    __extends(Attachment, _super);
    function Attachment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Attachment;
}(graphqueryable_1.GraphQueryableInstance));
exports.Attachment = Attachment;


/***/ }),

/***/ "4bZL":
/*!**********************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/sharepointqueryable.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var collections_1 = __webpack_require__(/*! ../collections/collections */ "hd/X");
var utils_1 = __webpack_require__(/*! ../net/utils */ "KJz+");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
var logging_1 = __webpack_require__(/*! ../utils/logging */ "2C3z");
var queryable_1 = __webpack_require__(/*! ../odata/queryable */ "fuNo");
var pipeline_1 = __webpack_require__(/*! ../request/pipeline */ "a1BX");
var httpclient_1 = __webpack_require__(/*! ../net/httpclient */ "KjMO");
/**
 * SharePointQueryable Base Class
 *
 */
var SharePointQueryable = /** @class */ (function (_super) {
    __extends(SharePointQueryable, _super);
    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param baseUrl A string or SharePointQueryable that should form the base part of the url
     *
     */
    function SharePointQueryable(baseUrl, path) {
        var _this = _super.call(this) || this;
        _this._options = {};
        _this._query = new collections_1.Dictionary();
        _this._batch = null;
        if (typeof baseUrl === "string") {
            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.
            var urlStr = baseUrl;
            if (util_1.Util.isUrlAbsolute(urlStr) || urlStr.lastIndexOf("/") < 0) {
                _this._parentUrl = urlStr;
                _this._url = util_1.Util.combinePaths(urlStr, path);
            }
            else if (urlStr.lastIndexOf("/") > urlStr.lastIndexOf("(")) {
                // .../items(19)/fields
                var index = urlStr.lastIndexOf("/");
                _this._parentUrl = urlStr.slice(0, index);
                path = util_1.Util.combinePaths(urlStr.slice(index), path);
                _this._url = util_1.Util.combinePaths(_this._parentUrl, path);
            }
            else {
                // .../items(19)
                var index = urlStr.lastIndexOf("(");
                _this._parentUrl = urlStr.slice(0, index);
                _this._url = util_1.Util.combinePaths(urlStr, path);
            }
        }
        else {
            var q = baseUrl;
            _this._parentUrl = q._url;
            _this._options = q._options;
            var target = q._query.get("@target");
            if (target !== null) {
                _this._query.add("@target", target);
            }
            _this._url = util_1.Util.combinePaths(_this._parentUrl, path);
        }
        return _this;
    }
    /**
     * Blocks a batch call from occuring, MUST be cleared by calling the returned function
     */
    SharePointQueryable.prototype.addBatchDependency = function () {
        if (this.hasBatch) {
            return this._batch.addDependency();
        }
        return function () { return null; };
    };
    Object.defineProperty(SharePointQueryable.prototype, "hasBatch", {
        /**
         * Indicates if the current query has a batch associated
         *
         */
        get: function () {
            return this._batch !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SharePointQueryable.prototype, "batch", {
        /**
         * The batch currently associated with this query or null
         *
         */
        get: function () {
            return this.hasBatch ? this._batch : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new instance of the supplied factory and extends this into that new instance
     *
     * @param factory constructor for the new SharePointQueryable
     */
    SharePointQueryable.prototype.as = function (factory) {
        var o = new factory(this._url, null);
        return util_1.Util.extend(o, this, true);
    };
    /**
     * Adds this query to the supplied batch
     *
     * @example
     * ```
     *
     * let b = pnp.sp.createBatch();
     * pnp.sp.web.inBatch(b).get().then(...);
     * b.execute().then(...)
     * ```
     */
    SharePointQueryable.prototype.inBatch = function (batch) {
        if (this._batch !== null) {
            throw new exceptions_1.AlreadyInBatchException();
        }
        this._batch = batch;
        return this;
    };
    /**
     * Gets the full url with query information
     *
     */
    SharePointQueryable.prototype.toUrlAndQuery = function () {
        var aliasedParams = new collections_1.Dictionary();
        var url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, function (match, labelName, value) {
            logging_1.Logger.write("Rewriting aliased parameter from match " + match + " to label: " + labelName + " value: " + value, logging_1.LogLevel.Verbose);
            aliasedParams.add(labelName, "'" + value + "'");
            return labelName;
        });
        // inlude our explicitly set query string params
        aliasedParams.merge(this._query);
        if (aliasedParams.count() > 0) {
            url += "?" + aliasedParams.getKeys().map(function (key) { return key + "=" + aliasedParams.get(key); }).join("&");
        }
        return url;
    };
    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    SharePointQueryable.prototype.getParent = function (factory, baseUrl, path, batch) {
        if (baseUrl === void 0) { baseUrl = this.parentUrl; }
        var parent = new factory(baseUrl, path);
        parent.configure(this._options);
        var target = this.query.get("@target");
        if (target !== null) {
            parent.query.add("@target", target);
        }
        if (typeof batch !== "undefined") {
            parent = parent.inBatch(batch);
        }
        return parent;
    };
    /**
     * Clones this SharePointQueryable into a new SharePointQueryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     */
    SharePointQueryable.prototype.clone = function (factory, additionalPath, includeBatch) {
        if (includeBatch === void 0) { includeBatch = true; }
        var clone = new factory(this, additionalPath);
        clone.configure(this._options);
        var target = this.query.get("@target");
        if (target !== null) {
            clone.query.add("@target", target);
        }
        if (includeBatch && this.hasBatch) {
            clone = clone.inBatch(this.batch);
        }
        return clone;
    };
    /**
     * Converts the current instance to a request context
     *
     * @param verb The request verb
     * @param options The set of supplied request options
     * @param parser The supplied ODataParser instance
     * @param pipeline Optional request processing pipeline
     */
    SharePointQueryable.prototype.toRequestContext = function (verb, options, parser, pipeline) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (pipeline === void 0) { pipeline = pipeline_1.PipelineMethods.default; }
        var dependencyDispose = this.hasBatch ? this.addBatchDependency() : function () { return; };
        return util_1.Util.toAbsoluteUrl(this.toUrlAndQuery()).then(function (url) {
            utils_1.mergeOptions(options, _this._options);
            // build our request context
            var context = {
                batch: _this._batch,
                batchDependency: dependencyDispose,
                cachingOptions: _this._cachingOptions,
                clientFactory: function () { return new httpclient_1.HttpClient(); },
                isBatched: _this.hasBatch,
                isCached: _this._useCaching,
                options: options,
                parser: parser,
                pipeline: pipeline,
                requestAbsoluteUrl: url,
                requestId: util_1.Util.getGUID(),
                verb: verb,
            };
            return context;
        });
    };
    return SharePointQueryable;
}(queryable_1.ODataQueryable));
exports.SharePointQueryable = SharePointQueryable;
/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
var SharePointQueryableCollection = /** @class */ (function (_super) {
    __extends(SharePointQueryableCollection, _super);
    function SharePointQueryableCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The string representing the filter query
     */
    SharePointQueryableCollection.prototype.filter = function (filter) {
        this._query.add("$filter", filter);
        return this;
    };
    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    SharePointQueryableCollection.prototype.select = function () {
        var selects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selects[_i] = arguments[_i];
        }
        if (selects.length > 0) {
            this._query.add("$select", selects.join(","));
        }
        return this;
    };
    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    SharePointQueryableCollection.prototype.expand = function () {
        var expands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expands[_i] = arguments[_i];
        }
        if (expands.length > 0) {
            this._query.add("$expand", expands.join(","));
        }
        return this;
    };
    /**
     * Orders based on the supplied fields ascending
     *
     * @param orderby The name of the field to sort on
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    SharePointQueryableCollection.prototype.orderBy = function (orderBy, ascending) {
        if (ascending === void 0) { ascending = true; }
        var keys = this._query.getKeys();
        var query = [];
        var asc = ascending ? " asc" : " desc";
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === "$orderby") {
                query.push(this._query.get("$orderby"));
                break;
            }
        }
        query.push("" + orderBy + asc);
        this._query.add("$orderby", query.join(","));
        return this;
    };
    /**
     * Skips the specified number of items
     *
     * @param skip The number of items to skip
     */
    SharePointQueryableCollection.prototype.skip = function (skip) {
        this._query.add("$skip", skip.toString());
        return this;
    };
    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    SharePointQueryableCollection.prototype.top = function (top) {
        this._query.add("$top", top.toString());
        return this;
    };
    return SharePointQueryableCollection;
}(SharePointQueryable));
exports.SharePointQueryableCollection = SharePointQueryableCollection;
/**
 * Represents an instance that can be selected
 *
 */
var SharePointQueryableInstance = /** @class */ (function (_super) {
    __extends(SharePointQueryableInstance, _super);
    function SharePointQueryableInstance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    SharePointQueryableInstance.prototype.select = function () {
        var selects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selects[_i] = arguments[_i];
        }
        if (selects.length > 0) {
            this._query.add("$select", selects.join(","));
        }
        return this;
    };
    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    SharePointQueryableInstance.prototype.expand = function () {
        var expands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expands[_i] = arguments[_i];
        }
        if (expands.length > 0) {
            this._query.add("$expand", expands.join(","));
        }
        return this;
    };
    return SharePointQueryableInstance;
}(SharePointQueryable));
exports.SharePointQueryableInstance = SharePointQueryableInstance;


/***/ }),

/***/ "5dQz":
/*!***************************************!*\
  !*** ./node_modules/@pnp/sp/odata.js ***!
  \***************************************/
/*! exports provided: odataUrlFrom, spODataEntity, spODataEntityArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "odataUrlFrom", function() { return odataUrlFrom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spODataEntity", function() { return spODataEntity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spODataEntityArray", function() { return spODataEntityArray; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/logging */ "B3L+");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/extractweburl.js */ "tSEd");





function odataUrlFrom(candidate) {
    var parts = [];
    var s = ["odata.type", "odata.editLink", "__metadata", "odata.metadata", "odata.id"];
    if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(candidate, s[0]) && candidate[s[0]] === "SP.Web") {
        // webs return an absolute url in the id
        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(candidate, s[4])) {
            parts.push(candidate[s[4]]);
        }
        else if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(candidate, s[2])) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }
    }
    else {
        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(candidate, s[3]) && Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(candidate, s[1])) {
            // we are dealign with minimal metadata (default)
            // some entities return an abosolute url in the editlink while for others it is relative
            // without the _api. This code is meant to handle both situations
            var editLink = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["isUrlAbsolute"])(candidate[s[1]]) ? candidate[s[1]].split("_api")[1] : candidate[s[1]];
            parts.push(Object(_utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_4__["extractWebUrl"])(candidate[s[3]]), "_api", editLink);
        }
        else if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(candidate, s[1])) {
            parts.push("_api", candidate[s[1]]);
        }
        else if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(candidate, s[2])) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }
    }
    if (parts.length < 1) {
        _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].write("No uri information found in ODataEntity parsing, chaining will fail for this object.", 2 /* Warning */);
        return "";
    }
    return _pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"].apply(void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(parts), false));
}
var SPODataEntityParserImpl = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(SPODataEntityParserImpl, _super);
    function SPODataEntityParserImpl(factory) {
        var _this = _super.call(this) || this;
        _this.factory = factory;
        _this.hydrate = function (d) {
            var o = _this.factory(odataUrlFrom(d), null);
            return Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(o, d);
        };
        return _this;
    }
    SPODataEntityParserImpl.prototype.parse = function (r) {
        var _this = this;
        return _super.prototype.parse.call(this, r).then(function (d) {
            var o = _this.factory(odataUrlFrom(d), null);
            return Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(o, d);
        });
    };
    return SPODataEntityParserImpl;
}(_pnp_odata__WEBPACK_IMPORTED_MODULE_3__["ODataParser"]));
var SPODataEntityArrayParserImpl = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(SPODataEntityArrayParserImpl, _super);
    function SPODataEntityArrayParserImpl(factory) {
        var _this = _super.call(this) || this;
        _this.factory = factory;
        _this.hydrate = function (d) {
            return d.map(function (v) {
                var o = _this.factory(odataUrlFrom(v), null);
                return Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(o, v);
            });
        };
        return _this;
    }
    SPODataEntityArrayParserImpl.prototype.parse = function (r) {
        var _this = this;
        return _super.prototype.parse.call(this, r).then(function (d) {
            return d.map(function (v) {
                var o = _this.factory(odataUrlFrom(v), null);
                return Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(o, v);
            });
        });
    };
    return SPODataEntityArrayParserImpl;
}(_pnp_odata__WEBPACK_IMPORTED_MODULE_3__["ODataParser"]));
function spODataEntity(factory) {
    return new SPODataEntityParserImpl(factory);
}
function spODataEntityArray(factory) {
    return new SPODataEntityArrayParserImpl(factory);
}
//# sourceMappingURL=odata.js.map

/***/ }),

/***/ "5e5a":
/*!***************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/contenttypes.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
/**
 * Describes a collection of content types
 *
 */
var ContentTypes = /** @class */ (function (_super) {
    __extends(ContentTypes, _super);
    /**
     * Creates a new instance of the ContentTypes class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this content types collection
     */
    function ContentTypes(baseUrl, path) {
        if (path === void 0) { path = "contenttypes"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a ContentType by content type id
     */
    ContentTypes.prototype.getById = function (id) {
        var ct = new ContentType(this);
        ct.concat("('" + id + "')");
        return ct;
    };
    /**
     * Adds an existing contenttype to a content type collection
     *
     * @param contentTypeId in the following format, for example: 0x010102
     */
    ContentTypes.prototype.addAvailableContentType = function (contentTypeId) {
        var _this = this;
        var postBody = JSON.stringify({
            "contentTypeId": contentTypeId,
        });
        return this.clone(ContentTypes, "addAvailableContentType").postAsCore({ body: postBody }).then(function (data) {
            return {
                contentType: _this.getById(data.id),
                data: data,
            };
        });
    };
    /**
     * Adds a new content type to the collection
     *
     * @param id The desired content type id for the new content type (also determines the parent content type)
     * @param name The name of the content type
     * @param description The description of the content type
     * @param group The group in which to add the content type
     * @param additionalSettings Any additional settings to provide when creating the content type
     *
     */
    ContentTypes.prototype.add = function (id, name, description, group, additionalSettings) {
        var _this = this;
        if (description === void 0) { description = ""; }
        if (group === void 0) { group = "Custom Content Types"; }
        if (additionalSettings === void 0) { additionalSettings = {}; }
        var postBody = JSON.stringify(util_1.Util.extend({
            "Description": description,
            "Group": group,
            "Id": { "StringValue": id },
            "Name": name,
            "__metadata": { "type": "SP.ContentType" },
        }, additionalSettings));
        return this.postCore({ body: postBody }).then(function (data) {
            return { contentType: _this.getById(data.id), data: data };
        });
    };
    return ContentTypes;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.ContentTypes = ContentTypes;
/**
 * Describes a single ContentType instance
 *
 */
var ContentType = /** @class */ (function (_super) {
    __extends(ContentType, _super);
    function ContentType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ContentType.prototype, "fieldLinks", {
        /**
         * Gets the column (also known as field) references in the content type.
        */
        get: function () {
            return new FieldLinks(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentType.prototype, "fields", {
        /**
         * Gets a value that specifies the collection of fields for the content type.
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "fields");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentType.prototype, "parent", {
        /**
         * Gets the parent content type of the content type.
         */
        get: function () {
            return new ContentType(this, "parent");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentType.prototype, "workflowAssociations", {
        /**
         * Gets a value that specifies the collection of workflow associations for the content type.
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "workflowAssociations");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Delete this content type
     */
    ContentType.prototype.delete = function () {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    return ContentType;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.ContentType = ContentType;
/**
 * Represents a collection of field link instances
 */
var FieldLinks = /** @class */ (function (_super) {
    __extends(FieldLinks, _super);
    /**
     * Creates a new instance of the ContentType class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this content type instance
     */
    function FieldLinks(baseUrl, path) {
        if (path === void 0) { path = "fieldlinks"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a FieldLink by GUID id
     *
     * @param id The GUID id of the field link
     */
    FieldLinks.prototype.getById = function (id) {
        var fl = new FieldLink(this);
        fl.concat("(guid'" + id + "')");
        return fl;
    };
    return FieldLinks;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.FieldLinks = FieldLinks;
/**
 * Represents a field link instance
 */
var FieldLink = /** @class */ (function (_super) {
    __extends(FieldLink, _super);
    function FieldLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FieldLink;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.FieldLink = FieldLink;


/***/ }),

/***/ "5e8D":
/*!****************************************************!*\
  !*** ./node_modules/@pnp/odata/pipeline-binder.js ***!
  \****************************************************/
/*! exports provided: pipelineBinder, defaultPipelineBinder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pipelineBinder", function() { return pipelineBinder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultPipelineBinder", function() { return defaultPipelineBinder; });
/* harmony import */ var _parsers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsers.js */ "xbXq");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _queryable_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./queryable.js */ "dKLh");
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pipeline.js */ "TZA7");




// first we bind the pipeline we will use for all requests within this closure
function pipelineBinder(pipes) {
    // then we bind the client factory we'll use (typically done in an implementing library such as sp)
    return function (clientFactory) {
        // then we create a binder we can apply for each type of method (GET, POST, etc.)
        return function (method) {
            // finally we get a function back to which we can pass an IQueryableData instance and execute the request it defines
            return function (o) {
                // send the IQueryableData down the pipeline
                return Object(_pipeline_js__WEBPACK_IMPORTED_MODULE_3__["pipe"])(Object.assign({}, {
                    batch: null,
                    batchDependency: null,
                    batchIndex: -1,
                    cachingOptions: null,
                    clientFactory: clientFactory,
                    cloneParentCacheOptions: null,
                    cloneParentWasCaching: false,
                    hasResult: false,
                    isBatched: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(o.batch),
                    method: method,
                    options: null,
                    parentUrl: "",
                    parser: new _parsers_js__WEBPACK_IMPORTED_MODULE_0__["ODataParser"](),
                    pipes: pipes.slice(0),
                    query: new Map(),
                    requestId: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["getGUID"])(),
                    url: "",
                    useCaching: /^get$/i.test(o.method) && o.useCaching,
                }, Object(_queryable_js__WEBPACK_IMPORTED_MODULE_2__["cloneQueryableData"])(o)));
            };
        };
    };
}
var defaultPipelineBinder = pipelineBinder(Object(_pipeline_js__WEBPACK_IMPORTED_MODULE_3__["getDefaultPipeline"])());
//# sourceMappingURL=pipeline-binder.js.map

/***/ }),

/***/ "6k7F":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/webs/index.js ***!
  \********************************************/
/*! exports provided: Web, Webs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "dVsc");
/* harmony import */ var _rest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../rest.js */ "9l4K");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Web", function() { return _types_js__WEBPACK_IMPORTED_MODULE_0__["Web"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Webs", function() { return _types_js__WEBPACK_IMPORTED_MODULE_0__["Webs"]; });




Reflect.defineProperty(_rest_js__WEBPACK_IMPORTED_MODULE_1__["SPRest"].prototype, "web", {
    configurable: true,
    enumerable: true,
    get: function () {
        return this.childConfigHook(function (_a) {
            var options = _a.options, baseUrl = _a.baseUrl, runtime = _a.runtime;
            return Object(_types_js__WEBPACK_IMPORTED_MODULE_0__["Web"])(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
_rest_js__WEBPACK_IMPORTED_MODULE_1__["SPRest"].prototype.createBatch = function () {
    return this.web.createBatch();
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "7+BY":
/*!*****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/odata/caching.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = __webpack_require__(/*! ../utils/storage */ "q1wT");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var pnplibconfig_1 = __webpack_require__(/*! ../configuration/pnplibconfig */ "Mvka");
var CachingOptions = /** @class */ (function () {
    function CachingOptions(key) {
        this.key = key;
        this.expiration = util_1.Util.dateAdd(new Date(), "second", pnplibconfig_1.RuntimeConfig.defaultCachingTimeoutSeconds);
        this.storeName = pnplibconfig_1.RuntimeConfig.defaultCachingStore;
    }
    Object.defineProperty(CachingOptions.prototype, "store", {
        get: function () {
            if (this.storeName === "local") {
                return CachingOptions.storage.local;
            }
            else {
                return CachingOptions.storage.session;
            }
        },
        enumerable: true,
        configurable: true
    });
    CachingOptions.storage = new storage_1.PnPClientStorage();
    return CachingOptions;
}());
exports.CachingOptions = CachingOptions;
var CachingParserWrapper = /** @class */ (function () {
    function CachingParserWrapper(_parser, _cacheOptions) {
        this._parser = _parser;
        this._cacheOptions = _cacheOptions;
    }
    CachingParserWrapper.prototype.parse = function (response) {
        var _this = this;
        // add this to the cache based on the options
        return this._parser.parse(response).then(function (data) {
            if (_this._cacheOptions.store !== null) {
                _this._cacheOptions.store.put(_this._cacheOptions.key, data, _this._cacheOptions.expiration);
            }
            return data;
        });
    };
    return CachingParserWrapper;
}());
exports.CachingParserWrapper = CachingParserWrapper;


/***/ }),

/***/ "7kAN":
/*!*******************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/pnp.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ./utils/util */ "bk0Y");
var storage_1 = __webpack_require__(/*! ./utils/storage */ "q1wT");
var configuration_1 = __webpack_require__(/*! ./configuration/configuration */ "uJEh");
var logging_1 = __webpack_require__(/*! ./utils/logging */ "2C3z");
var rest_1 = __webpack_require__(/*! ./sharepoint/rest */ "Hjjg");
var pnplibconfig_1 = __webpack_require__(/*! ./configuration/pnplibconfig */ "Mvka");
var rest_2 = __webpack_require__(/*! ./graph/rest */ "LK7q");
/**
 * Root class of the Patterns and Practices namespace, provides an entry point to the library
 */
/**
 * Utility methods
 */
exports.util = util_1.Util;
/**
 * Provides access to the SharePoint REST interface
 */
exports.sp = new rest_1.SPRest();
/**
 * Provides access to the Microsoft Graph REST interface
 */
exports.graph = new rest_2.GraphRest();
/**
 * Provides access to local and session storage
 */
exports.storage = new storage_1.PnPClientStorage();
/**
 * Global configuration instance to which providers can be added
 */
exports.config = new configuration_1.Settings();
/**
 * Global logging instance to which subscribers can be registered and messages written
 */
exports.log = logging_1.Logger;
/**
 * Allows for the configuration of the library
 */
exports.setup = pnplibconfig_1.setRuntimeConfig;
/**
 * Export everything back to the top level so it can be properly bundled
 */
__export(__webpack_require__(/*! ./exports/core */ "I4Bp"));
__export(__webpack_require__(/*! ./exports/graph */ "WRHq"));
__export(__webpack_require__(/*! ./exports/net */ "Ft4X"));
__export(__webpack_require__(/*! ./exports/odata */ "l3Du"));
__export(__webpack_require__(/*! ./exports/sp */ "23Rm"));
// /**
//  * Expose a subset of classes from the library for public consumption
//  */
// creating this class instead of directly assigning to default fixes issue #116
var Def = {
    /**
     * Global configuration instance to which providers can be added
     */
    config: exports.config,
    /**
     * Provides access to the Microsoft Graph REST interface
     */
    graph: exports.graph,
    /**
     * Global logging instance to which subscribers can be registered and messages written
     */
    log: exports.log,
    /**
     * Provides access to local and session storage
     */
    setup: exports.setup,
    /**
     * Provides access to the REST interface
     */
    sp: exports.sp,
    /**
     * Provides access to local and session storage
     */
    storage: exports.storage,
    /**
     * Utility methods
     */
    util: exports.util,
};
/**
 * Enables use of the import pnp from syntax
 */
exports.default = Def;


/***/ }),

/***/ "8xxP":
/*!***************************************!*\
  !*** ./node_modules/@pnp/sp/batch.js ***!
  \***************************************/
/*! exports provided: SPBatch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPBatch", function() { return SPBatch; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_logging__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/logging */ "B3L+");
/* harmony import */ var _sphttpclient_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sphttpclient.js */ "DqvY");
/* harmony import */ var _utils_toabsoluteurl_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/toabsoluteurl.js */ "G2Ar");






/**
 * Manages a batch of OData operations
 */
var SPBatch = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(SPBatch, _super);
    function SPBatch(url, runtime) {
        if (runtime === void 0) { runtime = _pnp_common__WEBPACK_IMPORTED_MODULE_2__["DefaultRuntime"]; }
        var _this = _super.call(this) || this;
        _this.url = url;
        _this.runtime = runtime;
        return _this;
    }
    /**
     * Parses the response from a batch request into an array of Response instances
     *
     * @param body Text body of the response from the batch request
     */
    SPBatch.ParseResponse = function (body) {
        var responses = [];
        var header = "--batchresponse_";
        // Ex. "HTTP/1.1 500 Internal Server Error"
        var statusRegExp = new RegExp("^HTTP/[0-9.]+ +([0-9]+) +(.*)", "i");
        var lines = body.split("\n");
        var state = "batch";
        var status;
        var statusText;
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            switch (state) {
                case "batch":
                    if (line.substr(0, header.length) === header) {
                        state = "batchHeaders";
                    }
                    else {
                        if (line.trim() !== "") {
                            throw Error("Invalid response, line " + i);
                        }
                    }
                    break;
                case "batchHeaders":
                    if (line.trim() === "") {
                        state = "status";
                    }
                    break;
                case "status": {
                    var parts = statusRegExp.exec(line);
                    if (parts.length !== 3) {
                        throw Error("Invalid status, line " + i);
                    }
                    status = parseInt(parts[1], 10);
                    statusText = parts[2];
                    state = "statusHeaders";
                    break;
                }
                case "statusHeaders":
                    if (line.trim() === "") {
                        state = "body";
                    }
                    break;
                case "body":
                    responses.push((status === 204) ? new Response() : new Response(line, { status: status, statusText: statusText }));
                    state = "batch";
                    break;
            }
        }
        if (state !== "status") {
            throw Error("Unexpected end of input");
        }
        return responses;
    };
    SPBatch.prototype.executeImpl = function () {
        var _a;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var client, absoluteRequestUrl, batchBody, currentChangeSetId, i, reqInfo, headers, url, method, castHeaders, batchOptions, fetchResponse, text, responses;
            var _this = this;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _pnp_logging__WEBPACK_IMPORTED_MODULE_3__["Logger"].write("[" + this.batchId + "] (" + (new Date()).getTime() + ") Executing batch with " + this.requests.length + " requests.", 1 /* Info */);
                        // if we don't have any requests, don't bother sending anything
                        // this could be due to caching further upstream, or just an empty batch
                        if (this.requests.length < 1) {
                            _pnp_logging__WEBPACK_IMPORTED_MODULE_3__["Logger"].write("Resolving empty batch.", 1 /* Info */);
                            return [2 /*return*/];
                        }
                        client = new _sphttpclient_js__WEBPACK_IMPORTED_MODULE_4__["SPHttpClient"](this.runtime);
                        return [4 /*yield*/, Object(_utils_toabsoluteurl_js__WEBPACK_IMPORTED_MODULE_5__["toAbsoluteUrl"])(this.url, this.runtime)];
                    case 1:
                        absoluteRequestUrl = _b.sent();
                        batchBody = [];
                        currentChangeSetId = "";
                        for (i = 0; i < this.requests.length; i++) {
                            reqInfo = this.requests[i];
                            if (reqInfo.method === "GET") {
                                if (currentChangeSetId.length > 0) {
                                    // end an existing change set
                                    batchBody.push("--changeset_" + currentChangeSetId + "--\n\n");
                                    currentChangeSetId = "";
                                }
                                batchBody.push("--batch_" + this.batchId + "\n");
                            }
                            else {
                                if (currentChangeSetId.length < 1) {
                                    // start new change set
                                    currentChangeSetId = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["getGUID"])();
                                    batchBody.push("--batch_" + this.batchId + "\n");
                                    batchBody.push("Content-Type: multipart/mixed; boundary=\"changeset_" + currentChangeSetId + "\"\n\n");
                                }
                                batchBody.push("--changeset_" + currentChangeSetId + "\n");
                            }
                            // common batch part prefix
                            batchBody.push("Content-Type: application/http\n");
                            batchBody.push("Content-Transfer-Encoding: binary\n\n");
                            headers = new Headers();
                            url = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["isUrlAbsolute"])(reqInfo.url) ? reqInfo.url : Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["combine"])(absoluteRequestUrl, reqInfo.url);
                            _pnp_logging__WEBPACK_IMPORTED_MODULE_3__["Logger"].write("[" + this.batchId + "] (" + (new Date()).getTime() + ") Adding request " + reqInfo.method + " " + url + " to batch.", 0 /* Verbose */);
                            if (reqInfo.method !== "GET") {
                                method = reqInfo.method;
                                castHeaders = reqInfo.options.headers;
                                if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["hOP"])(reqInfo, "options") && Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["hOP"])(reqInfo.options, "headers") && castHeaders["X-HTTP-Method"] !== undefined) {
                                    method = castHeaders["X-HTTP-Method"];
                                    delete castHeaders["X-HTTP-Method"];
                                }
                                batchBody.push(method + " " + url + " HTTP/1.1\n");
                                headers.set("Content-Type", "application/json;odata=verbose;charset=utf-8");
                            }
                            else {
                                batchBody.push(reqInfo.method + " " + url + " HTTP/1.1\n");
                            }
                            // merge global config headers
                            Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["mergeHeaders"])(headers, (_a = this.runtime.get("sp")) === null || _a === void 0 ? void 0 : _a.headers);
                            // merge per-request headers
                            if (reqInfo.options) {
                                Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["mergeHeaders"])(headers, reqInfo.options.headers);
                            }
                            // lastly we apply any default headers we need that may not exist
                            if (!headers.has("Accept")) {
                                headers.append("Accept", "application/json");
                            }
                            if (!headers.has("Content-Type")) {
                                headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
                            }
                            if (!headers.has("X-ClientService-ClientTag")) {
                                headers.append("X-ClientService-ClientTag", "PnPCoreJS:@pnp-2.10.0:batch");
                            }
                            // write headers into batch body
                            headers.forEach(function (value, name) {
                                batchBody.push(name + ": " + value + "\n");
                            });
                            batchBody.push("\n");
                            if (reqInfo.options.body) {
                                batchBody.push(reqInfo.options.body + "\n\n");
                            }
                        }
                        if (currentChangeSetId.length > 0) {
                            // Close the changeset
                            batchBody.push("--changeset_" + currentChangeSetId + "--\n\n");
                            currentChangeSetId = "";
                        }
                        batchBody.push("--batch_" + this.batchId + "--\n");
                        batchOptions = {
                            "body": batchBody.join(""),
                            "headers": {
                                "Content-Type": "multipart/mixed; boundary=batch_" + this.batchId,
                            },
                            "method": "POST",
                        };
                        _pnp_logging__WEBPACK_IMPORTED_MODULE_3__["Logger"].write("[" + this.batchId + "] (" + (new Date()).getTime() + ") Sending batch request.", 1 /* Info */);
                        return [4 /*yield*/, client.fetch(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_2__["combine"])(absoluteRequestUrl, "/_api/$batch"), batchOptions)];
                    case 2:
                        fetchResponse = _b.sent();
                        if (!!fetchResponse.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, _pnp_odata__WEBPACK_IMPORTED_MODULE_1__["HttpRequestError"].init(fetchResponse)];
                    case 3: 
                    // the entire batch resulted in an error and we need to handle that better #1356
                    // things consistently with the rest of the http errors
                    throw (_b.sent());
                    case 4: return [4 /*yield*/, fetchResponse.text()];
                    case 5:
                        text = _b.sent();
                        responses = SPBatch.ParseResponse(text);
                        if (responses.length !== this.requests.length) {
                            throw Error("Could not properly parse responses to match requests in batch.");
                        }
                        _pnp_logging__WEBPACK_IMPORTED_MODULE_3__["Logger"].write("[" + this.batchId + "] (" + (new Date()).getTime() + ") Resolving batched requests.", 1 /* Info */);
                        // this structure ensures that we resolve the batched requests in the order we expect
                        // using async this is not guaranteed depending on the requests
                        return [2 /*return*/, responses.reduce(function (p, response, index) { return p.then(function () { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this, void 0, void 0, function () {
                                var request, _a, _b, e_1;
                                return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            request = this.requests[index];
                                            _pnp_logging__WEBPACK_IMPORTED_MODULE_3__["Logger"].write("[" + request.id + "] (" + (new Date()).getTime() + ") Resolving request in batch " + this.batchId + ".", 1 /* Info */);
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 3, , 4]);
                                            _b = (_a = request).resolve;
                                            return [4 /*yield*/, request.parser.parse(response)];
                                        case 2:
                                            _b.apply(_a, [_c.sent()]);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            e_1 = _c.sent();
                                            request.reject(e_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }); }, Promise.resolve(void (0)))];
                }
            });
        });
    };
    return SPBatch;
}(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["Batch"]));

//# sourceMappingURL=batch.js.map

/***/ }),

/***/ "97IE":
/*!******************************************!*\
  !*** ./node_modules/@pnp/common/util.js ***!
  \******************************************/
/*! exports provided: getCtxCallback, dateAdd, combine, getRandomString, getGUID, isFunc, objectDefinedNotNull, isArray, assign, isUrlAbsolute, stringIsNullOrEmpty, sanitizeGuid, jsS, hOP, getHashCode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCtxCallback", function() { return getCtxCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateAdd", function() { return dateAdd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "combine", function() { return combine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomString", function() { return getRandomString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGUID", function() { return getGUID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFunc", function() { return isFunc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "objectDefinedNotNull", function() { return objectDefinedNotNull; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isUrlAbsolute", function() { return isUrlAbsolute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringIsNullOrEmpty", function() { return stringIsNullOrEmpty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sanitizeGuid", function() { return sanitizeGuid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jsS", function() { return jsS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hOP", function() { return hOP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHashCode", function() { return getHashCode; });
/**
 * Gets a callback function which will maintain context across async calls.
 * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
 *
 * @param context The object that will be the 'this' value in the callback
 * @param method The method to which we will apply the context and parameters
 * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function getCtxCallback(context, method) {
    var params = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        params[_i - 2] = arguments[_i];
    }
    return function () {
        method.apply(context, params);
    };
}
/**
 * Adds a value to a date
 *
 * @param date The date to which we will add units, done in local time
 * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
 * @param units The amount to add to date of the given interval
 *
 * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
 */
function dateAdd(date, interval, units) {
    var ret = new Date(date.toString()); // don't change original date
    switch (interval.toLowerCase()) {
        case "year":
            ret.setFullYear(ret.getFullYear() + units);
            break;
        case "quarter":
            ret.setMonth(ret.getMonth() + 3 * units);
            break;
        case "month":
            ret.setMonth(ret.getMonth() + units);
            break;
        case "week":
            ret.setDate(ret.getDate() + 7 * units);
            break;
        case "day":
            ret.setDate(ret.getDate() + units);
            break;
        case "hour":
            ret.setTime(ret.getTime() + units * 3600000);
            break;
        case "minute":
            ret.setTime(ret.getTime() + units * 60000);
            break;
        case "second":
            ret.setTime(ret.getTime() + units * 1000);
            break;
        default:
            ret = undefined;
            break;
    }
    return ret;
}
/**
 * Combines an arbitrary set of paths ensuring and normalizes the slashes
 *
 * @param paths 0 to n path parts to combine
 */
function combine() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return paths
        .filter(function (path) { return !stringIsNullOrEmpty(path); })
        .map(function (path) { return path.replace(/^[\\|/]/, "").replace(/[\\|/]$/, ""); })
        .join("/")
        .replace(/\\/g, "/");
}
/**
 * Gets a random string of chars length
 *
 * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 *
 * @param chars The length of the random string to generate
 */
function getRandomString(chars) {
    var text = new Array(chars);
    for (var i = 0; i < chars; i++) {
        text[i] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62));
    }
    return text.join("");
}
/**
 * Gets a random GUID value
 *
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
/* eslint-disable no-bitwise */
function getGUID() {
    var d = Date.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
/* eslint-enable no-bitwise */
/**
 * Determines if a given value is a function
 *
 * @param cf The thing to test for functionness
 */
function isFunc(f) {
    return typeof f === "function";
}
/**
 * Determines if an object is both defined and not null
 * @param obj Object to test
 */
function objectDefinedNotNull(obj) {
    return typeof obj !== "undefined" && obj !== null;
}
/**
 * @returns whether the provided parameter is a JavaScript Array or not.
*/
function isArray(array) {
    return Array.isArray ? Array.isArray(array) : array && typeof array.length === "number" && array.constructor === Array;
}
/**
 * Provides functionality to extend the given object by doing a shallow copy
 *
 * @param target The object to which properties will be copied
 * @param source The source object from which properties will be copied
 * @param noOverwrite If true existing properties on the target are not overwritten from the source
 * @param filter If provided allows additional filtering on what properties are copied (propName: string) => boolean
 *
 */
function assign(target, source, noOverwrite, filter) {
    if (noOverwrite === void 0) { noOverwrite = false; }
    if (filter === void 0) { filter = function () { return true; }; }
    if (!objectDefinedNotNull(source)) {
        return target;
    }
    // ensure we don't overwrite things we don't want overwritten
    var check = noOverwrite ? function (o, i) { return !(i in o); } : function () { return true; };
    // final filter we will use
    var f = function (v) { return check(target, v) && filter(v); };
    return Object.getOwnPropertyNames(source)
        .filter(f)
        .reduce(function (t, v) {
        t[v] = source[v];
        return t;
    }, target);
}
/**
 * Determines if a given url is absolute
 *
 * @param url The url to check to see if it is absolute
 */
function isUrlAbsolute(url) {
    return /^https?:\/\/|^\/\//i.test(url);
}
/**
 * Determines if a string is null or empty or undefined
 *
 * @param s The string to test
 */
function stringIsNullOrEmpty(s) {
    return s === undefined || s === null || s.length < 1;
}
/**
 * Ensures guid values are represented consistently as "ea123463-137d-4ae3-89b8-cf3fc578ca05"
 *
 * @param guid The candidate guid
 */
function sanitizeGuid(guid) {
    if (stringIsNullOrEmpty(guid)) {
        return guid;
    }
    var matches = /([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i.exec(guid);
    return matches === null ? guid : matches[1];
}
/**
 * Shorthand for JSON.stringify
 *
 * @param o Any type of object
 */
function jsS(o) {
    return JSON.stringify(o);
}
/**
 * Shorthand for Object.hasOwnProperty
 *
 * @param o Object to check for
 * @param p Name of the property
 */
function hOP(o, p) {
    return Object.hasOwnProperty.call(o, p);
}
/**
 * Generates a ~unique hash code
 *
 * From: https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
/* eslint-disable no-bitwise */
function getHashCode(s) {
    var hash = 0;
    if (s.length === 0) {
        return hash;
    }
    for (var i = 0; i < s.length; i++) {
        var chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
/* eslint-enable no-bitwise */
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "9TEK":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/common/storage.js ***!
  \*********************************************/
/*! exports provided: PnPClientStorageWrapper, PnPClientStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PnPClientStorageWrapper", function() { return PnPClientStorageWrapper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PnPClientStorage", function() { return PnPClientStorage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "lzYu");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "97IE");
/* harmony import */ var _libconfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./libconfig.js */ "hyGn");



/**
 * A wrapper class to provide a consistent interface to browser based storage
 *
 */
var PnPClientStorageWrapper = /** @class */ (function () {
    /**
     * Creates a new instance of the PnPClientStorageWrapper class
     *
     * @constructor
     */
    function PnPClientStorageWrapper(store, defaultTimeoutMinutes) {
        if (defaultTimeoutMinutes === void 0) { defaultTimeoutMinutes = -1; }
        this.store = store;
        this.defaultTimeoutMinutes = defaultTimeoutMinutes;
        this.enabled = this.test();
        // if the cache timeout is enabled call the handler
        // this will clear any expired items and set the timeout function
        if (_libconfig_js__WEBPACK_IMPORTED_MODULE_2__["DefaultRuntime"].get("enableCacheExpiration")) {
            this.cacheExpirationHandler();
        }
    }
    PnPClientStorageWrapper.bind = function (store) {
        return new PnPClientStorageWrapper(typeof (store) === "undefined" ? new MemoryStorage() : store);
    };
    /**
     * Get a value from storage, or null if that value does not exist
     *
     * @param key The key whose value we want to retrieve
     */
    PnPClientStorageWrapper.prototype.get = function (key) {
        if (!this.enabled) {
            return null;
        }
        var o = this.store.getItem(key);
        if (!Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(o)) {
            return null;
        }
        var persistable = JSON.parse(o);
        if (new Date(persistable.expiration) <= new Date()) {
            this.delete(key);
            return null;
        }
        else {
            return persistable.value;
        }
    };
    /**
     * Adds a value to the underlying storage
     *
     * @param key The key to use when storing the provided value
     * @param o The value to store
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    PnPClientStorageWrapper.prototype.put = function (key, o, expire) {
        if (this.enabled) {
            this.store.setItem(key, this.createPersistable(o, expire));
        }
    };
    /**
     * Deletes a value from the underlying storage
     *
     * @param key The key of the pair we want to remove from storage
     */
    PnPClientStorageWrapper.prototype.delete = function (key) {
        if (this.enabled) {
            this.store.removeItem(key);
        }
    };
    /**
     * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
     *
     * @param key The key to use when storing the provided value
     * @param getter A function which will upon execution provide the desired value
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    PnPClientStorageWrapper.prototype.getOrPut = function (key, getter, expire) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var o;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.enabled) {
                            return [2 /*return*/, getter()];
                        }
                        o = this.get(key);
                        if (!(o === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, getter()];
                    case 1:
                        o = _a.sent();
                        this.put(key, o, expire);
                        _a.label = 2;
                    case 2: return [2 /*return*/, o];
                }
            });
        });
    };
    /**
     * Deletes any expired items placed in the store by the pnp library, leaves other items untouched
     */
    PnPClientStorageWrapper.prototype.deleteExpired = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var i, key;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.enabled) {
                            return [2 /*return*/];
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.store.length)) return [3 /*break*/, 4];
                        key = this.store.key(i);
                        if (!(key !== null)) return [3 /*break*/, 3];
                        if (!/["|']?pnp["|']? ?: ?1/i.test(this.store.getItem(key))) return [3 /*break*/, 3];
                        // get those items as get will delete from cache if they are expired
                        return [4 /*yield*/, this.get(key)];
                    case 2:
                        // get those items as get will delete from cache if they are expired
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Used to determine if the wrapped storage is available currently
     */
    PnPClientStorageWrapper.prototype.test = function () {
        var str = "t";
        try {
            this.store.setItem(str, str);
            this.store.removeItem(str);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * Creates the persistable to store
     */
    PnPClientStorageWrapper.prototype.createPersistable = function (o, expire) {
        if (expire === undefined) {
            // ensure we are by default inline with the global library setting
            var defaultTimeout = _libconfig_js__WEBPACK_IMPORTED_MODULE_2__["DefaultRuntime"].get("defaultCachingTimeoutSeconds");
            if (this.defaultTimeoutMinutes > 0) {
                defaultTimeout = this.defaultTimeoutMinutes * 60;
            }
            expire = Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["dateAdd"])(new Date(), "second", defaultTimeout);
        }
        return Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["jsS"])({ pnp: 1, expiration: expire, value: o });
    };
    /**
     * Deletes expired items added by this library in this.store and sets a timeout to call itself
     */
    PnPClientStorageWrapper.prototype.cacheExpirationHandler = function () {
        var _this = this;
        if (!this.enabled) {
            return;
        }
        this.deleteExpired().then(function () {
            // call ourself in the future
            setTimeout(Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["getCtxCallback"])(_this, _this.cacheExpirationHandler), _libconfig_js__WEBPACK_IMPORTED_MODULE_2__["DefaultRuntime"].get("cacheExpirationIntervalMilliseconds"));
        }).catch(console.error);
    };
    return PnPClientStorageWrapper;
}());

/**
 * A thin implementation of in-memory storage for use in nodejs
 */
var MemoryStorage = /** @class */ (function () {
    function MemoryStorage(_store) {
        if (_store === void 0) { _store = new Map(); }
        this._store = _store;
    }
    Object.defineProperty(MemoryStorage.prototype, "length", {
        get: function () {
            return this._store.size;
        },
        enumerable: false,
        configurable: true
    });
    MemoryStorage.prototype.clear = function () {
        this._store.clear();
    };
    MemoryStorage.prototype.getItem = function (key) {
        return this._store.get(key);
    };
    MemoryStorage.prototype.key = function (index) {
        return Array.from(this._store)[index][0];
    };
    MemoryStorage.prototype.removeItem = function (key) {
        this._store.delete(key);
    };
    MemoryStorage.prototype.setItem = function (key, data) {
        this._store.set(key, data);
    };
    return MemoryStorage;
}());
/**
 * A class that will establish wrappers for both local and session storage
 */
var PnPClientStorage = /** @class */ (function () {
    /**
     * Creates a new instance of the PnPClientStorage class
     *
     * @constructor
     */
    function PnPClientStorage(_local, _session) {
        if (_local === void 0) { _local = null; }
        if (_session === void 0) { _session = null; }
        this._local = _local;
        this._session = _session;
    }
    Object.defineProperty(PnPClientStorage.prototype, "local", {
        /**
         * Provides access to the local storage of the browser
         */
        get: function () {
            if (this._local === null) {
                this._local = new PnPClientStorageWrapper(typeof (localStorage) === "undefined" ? new MemoryStorage() : localStorage);
            }
            return this._local;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PnPClientStorage.prototype, "session", {
        /**
         * Provides access to the session storage of the browser
         */
        get: function () {
            if (this._session === null) {
                this._session = new PnPClientStorageWrapper(typeof (sessionStorage) === "undefined" ? new MemoryStorage() : sessionStorage);
            }
            return this._session;
        },
        enumerable: false,
        configurable: true
    });
    return PnPClientStorage;
}());

//# sourceMappingURL=storage.js.map

/***/ }),

/***/ "9l4K":
/*!**************************************!*\
  !*** ./node_modules/@pnp/sp/rest.js ***!
  \**************************************/
/*! exports provided: SPRest, sp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPRest", function() { return SPRest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sp", function() { return sp; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _splibconfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./splibconfig.js */ "0p/9");



/**
 * Root of the SharePoint REST module
 */
var SPRest = /** @class */ (function () {
    /**
     * Creates a new instance of the SPRest class
     *
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    function SPRest(_options, _baseUrl, _runtime) {
        if (_options === void 0) { _options = {}; }
        if (_baseUrl === void 0) { _baseUrl = ""; }
        if (_runtime === void 0) { _runtime = _pnp_common__WEBPACK_IMPORTED_MODULE_1__["DefaultRuntime"]; }
        this._options = _options;
        this._baseUrl = _baseUrl;
        this._runtime = _runtime;
    }
    /**
     * Configures instance with additional options and baseUrl.
     * Provided configuration used by other objects in a chain
     *
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    SPRest.prototype.configure = function (options, baseUrl) {
        if (baseUrl === void 0) { baseUrl = ""; }
        return new SPRest(options, baseUrl);
    };
    /**
     * Global SharePoint configuration options
     *
     * @param config The SharePoint configuration to apply
     */
    SPRest.prototype.setup = function (config) {
        if (config.pageContext) {
            Object(_splibconfig_js__WEBPACK_IMPORTED_MODULE_2__["setup"])({
                spfxContext: config,
            }, this._runtime);
        }
        else {
            Object(_splibconfig_js__WEBPACK_IMPORTED_MODULE_2__["setup"])(config, this._runtime);
        }
    };
    SPRest.prototype.createIsolated = function (init) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var baseUrl, cloneGlobal, options, config, runtime;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                // merge our defaults
                init = Object.assign({
                    baseUrl: "",
                    cloneGlobal: true,
                    config: {},
                    options: {},
                }, init || {});
                baseUrl = init.baseUrl, cloneGlobal = init.cloneGlobal, options = init.options, config = init.config;
                runtime = cloneGlobal ? new _pnp_common__WEBPACK_IMPORTED_MODULE_1__["Runtime"](_pnp_common__WEBPACK_IMPORTED_MODULE_1__["DefaultRuntime"].export()) : new _pnp_common__WEBPACK_IMPORTED_MODULE_1__["Runtime"]();
                runtime.assign(config);
                return [2 /*return*/, new SPRest(options, baseUrl, runtime)];
            });
        });
    };
    SPRest.prototype.childConfigHook = function (callback) {
        return callback({ options: this._options, baseUrl: this._baseUrl, runtime: this._runtime });
    };
    return SPRest;
}());

var sp = new SPRest();
//# sourceMappingURL=rest.js.map

/***/ }),

/***/ "B3L+":
/*!********************************************!*\
  !*** ./node_modules/@pnp/logging/index.js ***!
  \********************************************/
/*! exports provided: Logger, LogLevel, ConsoleListener, FunctionListener */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "Vpmm");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return _logger_js__WEBPACK_IMPORTED_MODULE_0__["Logger"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LogLevel", function() { return _logger_js__WEBPACK_IMPORTED_MODULE_0__["LogLevel"]; });

/* harmony import */ var _listeners_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./listeners.js */ "aH1g");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConsoleListener", function() { return _listeners_js__WEBPACK_IMPORTED_MODULE_1__["ConsoleListener"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FunctionListener", function() { return _listeners_js__WEBPACK_IMPORTED_MODULE_1__["FunctionListener"]; });



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "BqJy":
/*!*******************************************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/configuration/providers/spListConfigurationProvider.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cachingConfigurationProvider_1 = __webpack_require__(/*! ./cachingConfigurationProvider */ "Z4xO");
/**
 * A configuration provider which loads configuration values from a SharePoint list
 *
 */
var SPListConfigurationProvider = /** @class */ (function () {
    /**
     * Creates a new SharePoint list based configuration provider
     * @constructor
     * @param {string} webUrl Url of the SharePoint site, where the configuration list is located
     * @param {string} listTitle Title of the SharePoint list, which contains the configuration settings (optional, default = "config")
     */
    function SPListConfigurationProvider(sourceWeb, sourceListTitle) {
        if (sourceListTitle === void 0) { sourceListTitle = "config"; }
        this.sourceWeb = sourceWeb;
        this.sourceListTitle = sourceListTitle;
    }
    Object.defineProperty(SPListConfigurationProvider.prototype, "web", {
        /**
         * Gets the url of the SharePoint site, where the configuration list is located
         *
         * @return {string} Url address of the site
         */
        get: function () {
            return this.sourceWeb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SPListConfigurationProvider.prototype, "listTitle", {
        /**
         * Gets the title of the SharePoint list, which contains the configuration settings
         *
         * @return {string} List title
         */
        get: function () {
            return this.sourceListTitle;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Loads the configuration values from the SharePoint list
     *
     * @return {Promise<TypedHash<string>>} Promise of loaded configuration values
     */
    SPListConfigurationProvider.prototype.getConfiguration = function () {
        return this.web.lists.getByTitle(this.listTitle).items.select("Title", "Value")
            .getAs().then(function (data) {
            return data.reduce(function (configuration, item) {
                return Object.defineProperty(configuration, item.Title, {
                    configurable: false,
                    enumerable: false,
                    value: item.Value,
                    writable: false,
                });
            }, {});
        });
    };
    /**
     * Wraps the current provider in a cache enabled provider
     *
     * @return {CachingConfigurationProvider} Caching providers which wraps the current provider
     */
    SPListConfigurationProvider.prototype.asCaching = function () {
        var cacheKey = "splist_" + this.web.toUrl() + "+" + this.listTitle;
        return new cachingConfigurationProvider_1.default(this, cacheKey);
    };
    return SPListConfigurationProvider;
}());
exports.default = SPListConfigurationProvider;


/***/ }),

/***/ "Bqol":
/*!************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/utilities.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var files_1 = __webpack_require__(/*! ./files */ "MMX7");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
/**
 * Allows for calling of the static SP.Utilities.Utility methods by supplying the method name
 */
var UtilityMethod = /** @class */ (function (_super) {
    __extends(UtilityMethod, _super);
    /**
     * Creates a new instance of the Utility method class
     *
     * @param baseUrl The parent url provider
     * @param methodName The static method name to call on the utility class
     */
    function UtilityMethod(baseUrl, methodName) {
        return _super.call(this, UtilityMethod.getBaseUrl(baseUrl), "_api/SP.Utilities.Utility." + methodName) || this;
    }
    UtilityMethod.getBaseUrl = function (candidate) {
        if (typeof candidate === "string") {
            return candidate;
        }
        var c = candidate;
        var url = c.toUrl();
        var index = url.indexOf("_api/");
        if (index < 0) {
            return url;
        }
        return url.substr(0, index);
    };
    UtilityMethod.prototype.excute = function (props) {
        return this.postAsCore({
            body: JSON.stringify(props),
        });
    };
    /**
     * Sends an email based on the supplied properties
     *
     * @param props The properties of the email to send
     */
    UtilityMethod.prototype.sendEmail = function (props) {
        var params = {
            properties: {
                Body: props.Body,
                From: props.From,
                Subject: props.Subject,
                "__metadata": { "type": "SP.Utilities.EmailProperties" },
            },
        };
        if (props.To && props.To.length > 0) {
            params.properties = util_1.Util.extend(params.properties, {
                To: { results: props.To },
            });
        }
        if (props.CC && props.CC.length > 0) {
            params.properties = util_1.Util.extend(params.properties, {
                CC: { results: props.CC },
            });
        }
        if (props.BCC && props.BCC.length > 0) {
            params.properties = util_1.Util.extend(params.properties, {
                BCC: { results: props.BCC },
            });
        }
        if (props.AdditionalHeaders) {
            params.properties = util_1.Util.extend(params.properties, {
                AdditionalHeaders: props.AdditionalHeaders,
            });
        }
        return this.clone(UtilityMethod, "SendEmail", true).excute(params);
    };
    UtilityMethod.prototype.getCurrentUserEmailAddresses = function () {
        return this.clone(UtilityMethod, "GetCurrentUserEmailAddresses", true).excute({});
    };
    UtilityMethod.prototype.resolvePrincipal = function (input, scopes, sources, inputIsEmailOnly, addToUserInfoList, matchUserInfoList) {
        if (matchUserInfoList === void 0) { matchUserInfoList = false; }
        var params = {
            addToUserInfoList: addToUserInfoList,
            input: input,
            inputIsEmailOnly: inputIsEmailOnly,
            matchUserInfoList: matchUserInfoList,
            scopes: scopes,
            sources: sources,
        };
        return this.clone(UtilityMethod, "ResolvePrincipalInCurrentContext", true).excute(params);
    };
    UtilityMethod.prototype.searchPrincipals = function (input, scopes, sources, groupName, maxCount) {
        var params = {
            groupName: groupName,
            input: input,
            maxCount: maxCount,
            scopes: scopes,
            sources: sources,
        };
        return this.clone(UtilityMethod, "SearchPrincipalsUsingContextWeb", true).excute(params);
    };
    UtilityMethod.prototype.createEmailBodyForInvitation = function (pageAddress) {
        var params = {
            pageAddress: pageAddress,
        };
        return this.clone(UtilityMethod, "CreateEmailBodyForInvitation", true).excute(params);
    };
    UtilityMethod.prototype.expandGroupsToPrincipals = function (inputs, maxCount) {
        if (maxCount === void 0) { maxCount = 30; }
        var params = {
            inputs: inputs,
            maxCount: maxCount,
        };
        return this.clone(UtilityMethod, "ExpandGroupsToPrincipals", true).excute(params);
    };
    UtilityMethod.prototype.createWikiPage = function (info) {
        return this.clone(UtilityMethod, "CreateWikiPageInContextWeb", true).excute({
            parameters: info,
        }).then(function (r) {
            return {
                data: r,
                file: new files_1.File(odata_1.spExtractODataId(r)),
            };
        });
    };
    return UtilityMethod;
}(sharepointqueryable_1.SharePointQueryable));
exports.UtilityMethod = UtilityMethod;


/***/ }),

/***/ "Bwa7":
/*!*******************************************!*\
  !*** ./node_modules/@pnp/sp/lists/web.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _webs_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../webs/types.js */ "dVsc");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types.js */ "hy0S");
/* harmony import */ var _odata_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../odata.js */ "5dQz");
/* harmony import */ var _sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../sharepointqueryable.js */ "E6kk");
/* harmony import */ var _utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/escapeQueryStrValue.js */ "q1Lp");







Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["addProp"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_2__["_Web"], "lists", _types_js__WEBPACK_IMPORTED_MODULE_3__["Lists"]);
Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["addProp"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_2__["_Web"], "siteUserInfoList", _types_js__WEBPACK_IMPORTED_MODULE_3__["List"], "siteuserinfolist");
Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["addProp"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_2__["_Web"], "defaultDocumentLibrary", _types_js__WEBPACK_IMPORTED_MODULE_3__["List"], "DefaultDocumentLibrary");
Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["addProp"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_2__["_Web"], "customListTemplates", _sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_5__["SharePointQueryableCollection"], "getcustomlisttemplates");
_webs_types_js__WEBPACK_IMPORTED_MODULE_2__["_Web"].prototype.getList = function (listRelativeUrl) {
    return Object(_types_js__WEBPACK_IMPORTED_MODULE_3__["List"])(this, "getList('" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_6__["escapeQueryStrValue"])(listRelativeUrl) + "')");
};
_webs_types_js__WEBPACK_IMPORTED_MODULE_2__["_Web"].prototype.getCatalog = function (type) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
        var data;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.clone(_webs_types_js__WEBPACK_IMPORTED_MODULE_2__["Web"], "getcatalog(" + type + ")").select("Id").get()];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, Object(_types_js__WEBPACK_IMPORTED_MODULE_3__["List"])(Object(_odata_js__WEBPACK_IMPORTED_MODULE_4__["odataUrlFrom"])(data))];
            }
        });
    });
};
//# sourceMappingURL=web.js.map

/***/ }),

/***/ "C3fl":
/*!***********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/webparts.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var LimitedWebPartManager = /** @class */ (function (_super) {
    __extends(LimitedWebPartManager, _super);
    function LimitedWebPartManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LimitedWebPartManager.prototype, "webparts", {
        /**
         * Gets the set of web part definitions contained by this web part manager
         *
         */
        get: function () {
            return new WebPartDefinitions(this, "webparts");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Exports a webpart definition
     *
     * @param id the GUID id of the definition to export
     */
    LimitedWebPartManager.prototype.export = function (id) {
        return this.clone(LimitedWebPartManager, "ExportWebPart").postCore({
            body: JSON.stringify({ webPartId: id }),
        });
    };
    /**
     * Imports a webpart
     *
     * @param xml webpart definition which must be valid XML in the .dwp or .webpart format
     */
    LimitedWebPartManager.prototype.import = function (xml) {
        return this.clone(LimitedWebPartManager, "ImportWebPart").postCore({
            body: JSON.stringify({ webPartXml: xml }),
        });
    };
    return LimitedWebPartManager;
}(sharepointqueryable_1.SharePointQueryable));
exports.LimitedWebPartManager = LimitedWebPartManager;
var WebPartDefinitions = /** @class */ (function (_super) {
    __extends(WebPartDefinitions, _super);
    function WebPartDefinitions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a web part definition from the collection by id
     *
     * @param id The storage ID of the SPWebPartDefinition to retrieve
     */
    WebPartDefinitions.prototype.getById = function (id) {
        return new WebPartDefinition(this, "getbyid('" + id + "')");
    };
    /**
     * Gets a web part definition from the collection by storage id
     *
     * @param id The WebPart.ID of the SPWebPartDefinition to retrieve
     */
    WebPartDefinitions.prototype.getByControlId = function (id) {
        return new WebPartDefinition(this, "getByControlId('" + id + "')");
    };
    return WebPartDefinitions;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.WebPartDefinitions = WebPartDefinitions;
var WebPartDefinition = /** @class */ (function (_super) {
    __extends(WebPartDefinition, _super);
    function WebPartDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(WebPartDefinition.prototype, "webpart", {
        /**
         * Gets the webpart information associated with this definition
         */
        get: function () {
            return new WebPart(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Saves changes to the Web Part made using other properties and methods on the SPWebPartDefinition object
     */
    WebPartDefinition.prototype.saveChanges = function () {
        return this.clone(WebPartDefinition, "SaveWebPartChanges").postCore();
    };
    /**
     * Moves the Web Part to a different location on a Web Part Page
     *
     * @param zoneId The ID of the Web Part Zone to which to move the Web Part
     * @param zoneIndex A Web Part zone index that specifies the position at which the Web Part is to be moved within the destination Web Part zone
     */
    WebPartDefinition.prototype.moveTo = function (zoneId, zoneIndex) {
        return this.clone(WebPartDefinition, "MoveWebPartTo(zoneID='" + zoneId + "', zoneIndex=" + zoneIndex + ")").postCore();
    };
    /**
     * Closes the Web Part. If the Web Part is already closed, this method does nothing
     */
    WebPartDefinition.prototype.close = function () {
        return this.clone(WebPartDefinition, "CloseWebPart").postCore();
    };
    /**
     * Opens the Web Part. If the Web Part is already closed, this method does nothing
     */
    WebPartDefinition.prototype.open = function () {
        return this.clone(WebPartDefinition, "OpenWebPart").postCore();
    };
    /**
     * Removes a webpart from a page, all settings will be lost
     */
    WebPartDefinition.prototype.delete = function () {
        return this.clone(WebPartDefinition, "DeleteWebPart").postCore();
    };
    return WebPartDefinition;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.WebPartDefinition = WebPartDefinition;
var WebPart = /** @class */ (function (_super) {
    __extends(WebPart, _super);
    /**
     * Creates a new instance of the WebPart class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    function WebPart(baseUrl, path) {
        if (path === void 0) { path = "webpart"; }
        return _super.call(this, baseUrl, path) || this;
    }
    return WebPart;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.WebPart = WebPart;


/***/ }),

/***/ "Dems":
/*!*******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/site.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var webs_1 = __webpack_require__(/*! ./webs */ "U0SV");
var usercustomactions_1 = __webpack_require__(/*! ./usercustomactions */ "I1iA");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
var batch_1 = __webpack_require__(/*! ./batch */ "PbI0");
var features_1 = __webpack_require__(/*! ./features */ "1Cz4");
/**
 * Describes a site collection
 *
 */
var Site = /** @class */ (function (_super) {
    __extends(Site, _super);
    /**
     * Creates a new instance of the Site class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this site collection
     */
    function Site(baseUrl, path) {
        if (path === void 0) { path = "_api/site"; }
        return _super.call(this, baseUrl, path) || this;
    }
    Object.defineProperty(Site.prototype, "rootWeb", {
        /**
         * Gets the root web of the site collection
         *
         */
        get: function () {
            return new webs_1.Web(this, "rootweb");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Site.prototype, "features", {
        /**
         * Gets the active features for this site collection
         *
         */
        get: function () {
            return new features_1.Features(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Site.prototype, "userCustomActions", {
        /**
         * Gets all custom actions for this site collection
         *
         */
        get: function () {
            return new usercustomactions_1.UserCustomActions(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets a Web instance representing the root web of the site collection
     * correctly setup for chaining within the library
     */
    Site.prototype.getRootWeb = function () {
        return this.rootWeb.select("Url").get().then(function (web) { return new webs_1.Web(web.Url); });
    };
    /**
     * Gets the context information for this site collection
     */
    Site.prototype.getContextInfo = function () {
        var q = new Site(this.parentUrl, "_api/contextinfo");
        return q.postCore().then(function (data) {
            if (data.hasOwnProperty("GetContextWebInformation")) {
                var info = data.GetContextWebInformation;
                info.SupportedSchemaVersions = info.SupportedSchemaVersions.results;
                return info;
            }
            else {
                return data;
            }
        });
    };
    /**
     * Gets the document libraries on a site. Static method. (SharePoint Online only)
     *
     * @param absoluteWebUrl The absolute url of the web whose document libraries should be returned
     */
    Site.prototype.getDocumentLibraries = function (absoluteWebUrl) {
        var q = new sharepointqueryable_1.SharePointQueryable("", "_api/sp.web.getdocumentlibraries(@v)");
        q.query.add("@v", "'" + absoluteWebUrl + "'");
        return q.get().then(function (data) {
            if (data.hasOwnProperty("GetDocumentLibraries")) {
                return data.GetDocumentLibraries;
            }
            else {
                return data;
            }
        });
    };
    /**
     * Gets the site url from a page url
     *
     * @param absolutePageUrl The absolute url of the page
     */
    Site.prototype.getWebUrlFromPageUrl = function (absolutePageUrl) {
        var q = new sharepointqueryable_1.SharePointQueryable("", "_api/sp.web.getweburlfrompageurl(@v)");
        q.query.add("@v", "'" + absolutePageUrl + "'");
        return q.get().then(function (data) {
            if (data.hasOwnProperty("GetWebUrlFromPageUrl")) {
                return data.GetWebUrlFromPageUrl;
            }
            else {
                return data;
            }
        });
    };
    /**
     * Creates a new batch for requests within the context of this site collection
     *
     */
    Site.prototype.createBatch = function () {
        return new batch_1.ODataBatch(this.parentUrl);
    };
    /**
     * Opens a web by id (using POST)
     *
     * @param webId The GUID id of the web to open
     */
    Site.prototype.openWebById = function (webId) {
        return this.clone(Site, "openWebById('" + webId + "')").postCore().then(function (d) {
            return {
                data: d,
                web: webs_1.Web.fromUrl(odata_1.spExtractODataId(d)),
            };
        });
    };
    return Site;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.Site = Site;


/***/ }),

/***/ "Dm2q":
/*!***************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/plans.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
var Plans = /** @class */ (function (_super) {
    __extends(Plans, _super);
    function Plans(baseUrl, path) {
        if (path === void 0) { path = "planner/plans"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a plan from this collection by id
     *
     * @param id Plan's id
     */
    Plans.prototype.getById = function (id) {
        return new Plan(this, id);
    };
    return Plans;
}(graphqueryable_1.GraphQueryableCollection));
exports.Plans = Plans;
var Plan = /** @class */ (function (_super) {
    __extends(Plan, _super);
    function Plan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Plan;
}(graphqueryable_1.GraphQueryableInstance));
exports.Plan = Plan;


/***/ }),

/***/ "DqvY":
/*!**********************************************!*\
  !*** ./node_modules/@pnp/sp/sphttpclient.js ***!
  \**********************************************/
/*! exports provided: SPHttpClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPHttpClient", function() { return SPHttpClient; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/extractweburl.js */ "tSEd");
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./telemetry.js */ "h3gW");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @pnp/odata */ "xT8B");





var SPHttpClient = /** @class */ (function () {
    function SPHttpClient() {
        // constructor(...args: [runtime: Runtime] | [impl: IHttpClientImpl, runtime?: Runtime]) {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        this._runtime = args.length > 0 && args[0] instanceof _pnp_common__WEBPACK_IMPORTED_MODULE_1__["Runtime"] ? args[0] : _pnp_common__WEBPACK_IMPORTED_MODULE_1__["DefaultRuntime"];
        this._impl = args.length > 1 && Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(args[1]) ?
            args[1] : ((_a = this._runtime.get("sp")) === null || _a === void 0 ? void 0 : _a.fetchClientFactory()) || null;
        if (this._impl === null) {
            throw Error("Could not generate fetchClientFactory in SPHttpClient.");
        }
        this._digestCache = getDigestFactory(this);
    }
    SPHttpClient.prototype.fetch = function (url, options) {
        var _a;
        if (options === void 0) { options = {}; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var opts, headers, methodName, clientTag, digest;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        opts = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(options, { cache: "no-cache", credentials: "same-origin" }, true);
                        headers = new Headers();
                        // first we add the global headers so they can be overwritten by any passed in locally to this call
                        Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["mergeHeaders"])(headers, (_a = this._runtime.get("sp")) === null || _a === void 0 ? void 0 : _a.headers);
                        // second we add the local options so we can overwrite the globals
                        Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["mergeHeaders"])(headers, options.headers);
                        // lastly we apply any default headers we need that may not exist
                        if (!headers.has("Accept")) {
                            headers.append("Accept", "application/json");
                        }
                        if (!headers.has("Content-Type")) {
                            headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
                        }
                        if (!headers.has("X-ClientService-ClientTag")) {
                            methodName = _telemetry_js__WEBPACK_IMPORTED_MODULE_3__["tag"].getClientTag(headers);
                            clientTag = "PnPCoreJS:2.10.0:" + methodName;
                            if (clientTag.length > 32) {
                                clientTag = clientTag.substr(0, 32);
                            }
                            headers.append("X-ClientService-ClientTag", clientTag);
                        }
                        opts = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(opts, { headers: headers });
                        if (!(opts.method && opts.method.toUpperCase() !== "GET" && !headers.has("X-RequestDigest") && !headers.has("Authorization"))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._digestCache(Object(_utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_2__["extractWebUrl"])(url))];
                    case 1:
                        digest = _b.sent();
                        headers.append("X-RequestDigest", digest);
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.fetchRaw(url, opts)];
                }
            });
        });
    };
    SPHttpClient.prototype.fetchRaw = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        // here we need to normalize the headers
        var rawHeaders = new Headers();
        Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["mergeHeaders"])(rawHeaders, options.headers);
        options = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(options, { headers: rawHeaders });
        var retry = function (ctx) {
            // handles setting the proper timeout for a retry
            var setRetry = function (response) {
                var delay;
                if (response.headers.has("Retry-After")) {
                    // if we have gotten a header, use that value as the delay value in seconds
                    delay = parseInt(response.headers.get("Retry-After"), 10) * 1000;
                }
                else {
                    // grab our current delay
                    delay = ctx.delay;
                    // Increment our counters.
                    ctx.delay *= 2;
                }
                ctx.attempts++;
                // If we have exceeded the retry count, reject.
                if (ctx.retryCount <= ctx.attempts) {
                    // eslint-disable-next-line max-len
                    ctx.reject(new _pnp_odata__WEBPACK_IMPORTED_MODULE_4__["HttpRequestError"]("Retry count exceeded (" + ctx.retryCount + ") for request. Response status: [" + response.status + "] " + response.statusText, response));
                }
                else {
                    // Set our retry timeout for {delay} milliseconds.
                    setTimeout(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["getCtxCallback"])(_this, retry, ctx), delay);
                }
            };
            // send the actual request
            _this._impl.fetch(url, options).then(function (response) {
                if (response.status === 429) {
                    // we have been throttled
                    setRetry(response);
                }
                else {
                    ctx.resolve(response);
                }
            }).catch(function (response) {
                if (response.status === 503 || response.status === 504) {
                    // http status code 503 or 504, we can retry this
                    setRetry(response);
                }
                else {
                    ctx.reject(response);
                }
            });
        };
        return new Promise(function (resolve, reject) {
            retry.call(_this, {
                attempts: 0,
                delay: 100,
                reject: reject,
                resolve: resolve,
                retryCount: 7,
            });
        });
    };
    SPHttpClient.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(options, { method: "GET" });
        return this.fetch(url, opts);
    };
    SPHttpClient.prototype.post = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(options, { method: "POST" });
        return this.fetch(url, opts);
    };
    SPHttpClient.prototype.patch = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(options, { method: "PATCH" });
        return this.fetch(url, opts);
    };
    SPHttpClient.prototype.delete = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(options, { method: "DELETE" });
        return this.fetch(url, opts);
    };
    return SPHttpClient;
}());

// allows for the caching of digests across all HttpClient's which each have their own DigestCache wrapper.
var digests = new Map();
function getDigestFactory(client) {
    var _this = this;
    return function (webUrl) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this, void 0, void 0, function () {
        var cachedDigest, now, url, headers, resp, parsed, newCachedDigest;
        var _a, _b;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cachedDigest = digests.get(webUrl);
                    if (cachedDigest !== undefined) {
                        now = new Date();
                        if (now < cachedDigest.expiration) {
                            return [2 /*return*/, cachedDigest.value];
                        }
                    }
                    url = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(webUrl, "/_api/contextinfo");
                    headers = {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose;charset=utf-8",
                    };
                    return [4 /*yield*/, client.fetchRaw(url, {
                            cache: "no-cache",
                            credentials: "same-origin",
                            headers: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(headers, (_b = (_a = client._runtime.get("sp")) === null || _a === void 0 ? void 0 : _a.sp) === null || _b === void 0 ? void 0 : _b.headers, true),
                            method: "POST",
                        })];
                case 1:
                    resp = _c.sent();
                    return [4 /*yield*/, (new _pnp_odata__WEBPACK_IMPORTED_MODULE_4__["ODataParser"]()).parse(resp).then(function (r) { return r.GetContextWebInformation; })];
                case 2:
                    parsed = _c.sent();
                    newCachedDigest = {
                        expiration: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["dateAdd"])(new Date(), "second", parsed.FormDigestTimeoutSeconds),
                        value: parsed.FormDigestValue,
                    };
                    digests.set(webUrl, newCachedDigest);
                    return [2 /*return*/, newCachedDigest.value];
            }
        });
    }); };
}
//# sourceMappingURL=sphttpclient.js.map

/***/ }),

/***/ "E6kk":
/*!*****************************************************!*\
  !*** ./node_modules/@pnp/sp/sharepointqueryable.js ***!
  \*****************************************************/
/*! exports provided: spInvokableFactory, _SharePointQueryable, SharePointQueryable, _SharePointQueryableCollection, SharePointQueryableCollection, _SharePointQueryableInstance, SharePointQueryableInstance, deleteable, deleteableWithETag */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spInvokableFactory", function() { return spInvokableFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_SharePointQueryable", function() { return _SharePointQueryable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharePointQueryable", function() { return SharePointQueryable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_SharePointQueryableCollection", function() { return _SharePointQueryableCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharePointQueryableCollection", function() { return SharePointQueryableCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_SharePointQueryableInstance", function() { return _SharePointQueryableInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharePointQueryableInstance", function() { return SharePointQueryableInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteable", function() { return deleteable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteableWithETag", function() { return deleteableWithETag; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _pnp_logging__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/logging */ "B3L+");
/* harmony import */ var _utils_metadata_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/metadata.js */ "z067");
/* harmony import */ var _operations_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./operations.js */ "UK2s");
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./telemetry.js */ "h3gW");







var spInvokableFactory = function (f) {
    return Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["invokableFactory"])(f);
};
/**
 * SharePointQueryable Base Class
 *
 */
var _SharePointQueryable = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_SharePointQueryable, _super);
    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param baseUrl A string or SharePointQueryable that should form the base part of the url
     *
     */
    function _SharePointQueryable(baseUrl, path) {
        var _this = this;
        var url = "";
        var parentUrl = "";
        var query = new Map();
        if (typeof baseUrl === "string") {
            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.
            if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["isUrlAbsolute"])(baseUrl) || baseUrl.lastIndexOf("/") < 0) {
                parentUrl = baseUrl;
                url = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(baseUrl, path);
            }
            else if (baseUrl.lastIndexOf("/") > baseUrl.lastIndexOf("(")) {
                // .../items(19)/fields
                var index = baseUrl.lastIndexOf("/");
                parentUrl = baseUrl.slice(0, index);
                path = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(baseUrl.slice(index), path);
                url = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(parentUrl, path);
            }
            else {
                // .../items(19)
                var index = baseUrl.lastIndexOf("(");
                parentUrl = baseUrl.slice(0, index);
                url = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(baseUrl, path);
            }
        }
        else {
            parentUrl = baseUrl.toUrl();
            url = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(parentUrl, path || "");
            var target = baseUrl.query.get("@target");
            if (target !== undefined) {
                query.set("@target", target);
            }
        }
        // init base with correct values for data seed
        _this = _super.call(this, {
            parentUrl: parentUrl,
            query: query,
            url: url,
        }) || this;
        // post init actions
        if (typeof baseUrl !== "string") {
            _this.configureFrom(baseUrl);
        }
        _this._forceCaching = false;
        return _this;
    }
    /**
     * Gets the full url with query information
     */
    _SharePointQueryable.prototype.toUrlAndQuery = function () {
        var aliasedParams = new Map(this.query);
        var url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, function (match, labelName, value) {
            _pnp_logging__WEBPACK_IMPORTED_MODULE_3__["Logger"].write("Rewriting aliased parameter from match " + match + " to label: " + labelName + " value: " + value, 0 /* Verbose */);
            aliasedParams.set(labelName, "'" + value + "'");
            return labelName;
        });
        if (aliasedParams.size > 0) {
            var char = url.indexOf("?") > -1 ? "&" : "?";
            url += "" + char + Array.from(aliasedParams).map(function (v) { return v[0] + "=" + v[1]; }).join("&");
        }
        return url;
    };
    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    _SharePointQueryable.prototype.select = function () {
        var selects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selects[_i] = arguments[_i];
        }
        if (selects.length > 0) {
            this.query.set("$select", selects.map(encodeURIComponent).join(","));
        }
        return this;
    };
    _SharePointQueryable.prototype.get = function (options) {
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_5__["spGet"])(this, options);
    };
    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    _SharePointQueryable.prototype.expand = function () {
        var expands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expands[_i] = arguments[_i];
        }
        if (expands.length > 0) {
            this.query.set("$expand", expands.map(encodeURIComponent).join(","));
        }
        return this;
    };
    /**
     * Clones this SharePointQueryable into a new SharePointQueryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     * @param includeQuery If true all of the query values will be copied to the cloned instance
     */
    _SharePointQueryable.prototype.clone = function (factory, additionalPath, includeBatch, includeQuery) {
        if (includeBatch === void 0) { includeBatch = true; }
        if (includeQuery === void 0) { includeQuery = false; }
        var clone = _super.prototype.cloneTo.call(this, factory(this, additionalPath), { includeBatch: includeBatch, includeQuery: includeQuery });
        // handle sp specific clone actions
        if (!includeQuery) {
            // we would have already copied this over if we got the entire query
            var t = "@target";
            if (this.query.has(t)) {
                clone.query.set(t, this.query.get(t));
            }
        }
        return clone;
    };
    /**
     * The default action for this object (unless overridden spGet)
     *
     * @param options optional request options
     */
    _SharePointQueryable.prototype.defaultAction = function (options) {
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_5__["spGet"])(this, options);
    };
    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    _SharePointQueryable.prototype.getParent = function (factory, baseUrl, path, batch) {
        if (baseUrl === void 0) { baseUrl = this.parentUrl; }
        var parent = factory(baseUrl, path).configureFrom(this);
        var t = "@target";
        if (this.query.has(t)) {
            parent.query.set(t, this.query.get(t));
        }
        if (batch !== undefined) {
            parent = parent.inBatch(batch);
        }
        return parent;
    };
    return _SharePointQueryable;
}(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["Queryable"]));

var SharePointQueryable = spInvokableFactory(_SharePointQueryable);
/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
var _SharePointQueryableCollection = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_SharePointQueryableCollection, _super);
    function _SharePointQueryableCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The string representing the filter query
     */
    _SharePointQueryableCollection.prototype.filter = function (filter) {
        this.query.set("$filter", encodeURIComponent(filter));
        return this;
    };
    /**
     * Orders based on the supplied fields
     *
     * @param orderby The name of the field on which to sort
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    _SharePointQueryableCollection.prototype.orderBy = function (orderBy, ascending) {
        if (ascending === void 0) { ascending = true; }
        var o = "$orderby";
        var query = this.query.has(o) ? this.query.get(o).split(",") : [];
        query.push(encodeURIComponent(orderBy) + " " + (ascending ? "asc" : "desc"));
        this.query.set(o, query.join(","));
        return this;
    };
    /**
     * Skips the specified number of items
     *
     * @param skip The number of items to skip
     */
    _SharePointQueryableCollection.prototype.skip = function (skip) {
        this.query.set("$skip", skip.toString());
        return this;
    };
    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    _SharePointQueryableCollection.prototype.top = function (top) {
        this.query.set("$top", top.toString());
        return this;
    };
    return _SharePointQueryableCollection;
}(_SharePointQueryable));

var SharePointQueryableCollection = spInvokableFactory(_SharePointQueryableCollection);
/**
 * Represents an instance that can be selected
 *
 */
var _SharePointQueryableInstance = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_SharePointQueryableInstance, _super);
    function _SharePointQueryableInstance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Curries the update function into the common pieces
     *
     * @param type
     * @param mapper
     */
    _SharePointQueryableInstance.prototype._update = function (type, mapper) {
        var _this = this;
        return function (props) { return Object(_operations_js__WEBPACK_IMPORTED_MODULE_5__["spPost"])(_telemetry_js__WEBPACK_IMPORTED_MODULE_6__["tag"].configure(_this, type + ".Update"), {
            body: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["jsS"])(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_4__["metadata"])(type), props)),
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (d) { return mapper(d, props); }); };
    };
    return _SharePointQueryableInstance;
}(_SharePointQueryable));

var SharePointQueryableInstance = spInvokableFactory(_SharePointQueryableInstance);
/**
 * Adds the a delete method to the tagged class taking no parameters and calling spPostDelete
 */
function deleteable(t) {
    return function () {
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_5__["spPostDelete"])(_telemetry_js__WEBPACK_IMPORTED_MODULE_6__["tag"].configure(this, t + ".delete"));
    };
}
function deleteableWithETag(t) {
    return function (eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_5__["spPostDeleteETag"])(_telemetry_js__WEBPACK_IMPORTED_MODULE_6__["tag"].configure(this, t + ".delete"), {}, eTag);
    };
}
//# sourceMappingURL=sharepointqueryable.js.map

/***/ }),

/***/ "F90Z":
/*!****************************************************************!*\
  !*** ./lib/webparts/crudPnpjs/CrudPnpjsWebPart.module.scss.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* tslint:disable */
__webpack_require__(/*! ./CrudPnpjsWebPart.module.css */ "L8jG");
var styles = {
    crudPnpjs: 'crudPnpjs_ba7a6a9c',
    container: 'container_ba7a6a9c',
    row: 'row_ba7a6a9c',
    column: 'column_ba7a6a9c',
    'ms-Grid': 'ms-Grid_ba7a6a9c',
    title: 'title_ba7a6a9c',
    subTitle: 'subTitle_ba7a6a9c',
    description: 'description_ba7a6a9c',
    button: 'button_ba7a6a9c',
    label: 'label_ba7a6a9c'
};
/* harmony default export */ __webpack_exports__["default"] = (styles);
/* tslint:enable */ 


/***/ }),

/***/ "FFhP":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/lists.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var items_1 = __webpack_require__(/*! ./items */ "/pGJ");
var views_1 = __webpack_require__(/*! ./views */ "GGL5");
var contenttypes_1 = __webpack_require__(/*! ./contenttypes */ "5e5a");
var fields_1 = __webpack_require__(/*! ./fields */ "TT1A");
var forms_1 = __webpack_require__(/*! ./forms */ "ewhV");
var subscriptions_1 = __webpack_require__(/*! ./subscriptions */ "p6a+");
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var sharepointqueryablesecurable_1 = __webpack_require__(/*! ./sharepointqueryablesecurable */ "wSGh");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var usercustomactions_1 = __webpack_require__(/*! ./usercustomactions */ "I1iA");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
var folders_1 = __webpack_require__(/*! ./folders */ "q1dm");
/**
 * Describes a collection of List objects
 *
 */
var Lists = /** @class */ (function (_super) {
    __extends(Lists, _super);
    /**
     * Creates a new instance of the Lists class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Lists(baseUrl, path) {
        if (path === void 0) { path = "lists"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a list from the collection by title
     *
     * @param title The title of the list
     */
    Lists.prototype.getByTitle = function (title) {
        return new List(this, "getByTitle('" + title + "')");
    };
    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the list (GUID)
     */
    Lists.prototype.getById = function (id) {
        var list = new List(this);
        list.concat("('" + id + "')");
        return list;
    };
    /**
     * Adds a new list to the collection
     *
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body
     */
    Lists.prototype.add = function (title, description, template, enableContentTypes, additionalSettings) {
        var _this = this;
        if (description === void 0) { description = ""; }
        if (template === void 0) { template = 100; }
        if (enableContentTypes === void 0) { enableContentTypes = false; }
        if (additionalSettings === void 0) { additionalSettings = {}; }
        var addSettings = util_1.Util.extend({
            "AllowContentTypes": enableContentTypes,
            "BaseTemplate": template,
            "ContentTypesEnabled": enableContentTypes,
            "Description": description,
            "Title": title,
            "__metadata": { "type": "SP.List" },
        }, additionalSettings);
        return this.postCore({ body: JSON.stringify(addSettings) }).then(function (data) {
            return { data: data, list: _this.getByTitle(addSettings.Title) };
        });
    };
    /**
     * Ensures that the specified list exists in the collection (note: this method not supported for batching)
     *
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body or used to update an existing list
     */
    Lists.prototype.ensure = function (title, description, template, enableContentTypes, additionalSettings) {
        var _this = this;
        if (description === void 0) { description = ""; }
        if (template === void 0) { template = 100; }
        if (enableContentTypes === void 0) { enableContentTypes = false; }
        if (additionalSettings === void 0) { additionalSettings = {}; }
        if (this.hasBatch) {
            throw new exceptions_1.NotSupportedInBatchException("The ensure list method");
        }
        return new Promise(function (resolve, reject) {
            var addOrUpdateSettings = util_1.Util.extend(additionalSettings, { Title: title, Description: description, ContentTypesEnabled: enableContentTypes }, true);
            var list = _this.getByTitle(addOrUpdateSettings.Title);
            list.get().then(function (_) {
                list.update(addOrUpdateSettings).then(function (d) {
                    resolve({ created: false, data: d, list: _this.getByTitle(addOrUpdateSettings.Title) });
                }).catch(function (e) { return reject(e); });
            }).catch(function (_) {
                _this.add(title, description, template, enableContentTypes, addOrUpdateSettings).then(function (r) {
                    resolve({ created: true, data: r.data, list: _this.getByTitle(addOrUpdateSettings.Title) });
                }).catch(function (e) { return reject(e); });
            });
        });
    };
    /**
     * Gets a list that is the default asset location for images or other files, which the users upload to their wiki pages.
     */
    Lists.prototype.ensureSiteAssetsLibrary = function () {
        return this.clone(Lists, "ensuresiteassetslibrary").postCore().then(function (json) {
            return new List(odata_1.spExtractODataId(json));
        });
    };
    /**
     * Gets a list that is the default location for wiki pages.
     */
    Lists.prototype.ensureSitePagesLibrary = function () {
        return this.clone(Lists, "ensuresitepageslibrary").postCore().then(function (json) {
            return new List(odata_1.spExtractODataId(json));
        });
    };
    return Lists;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Lists = Lists;
/**
 * Describes a single List instance
 *
 */
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(List.prototype, "contentTypes", {
        /**
         * Gets the content types in this list
         *
         */
        get: function () {
            return new contenttypes_1.ContentTypes(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "items", {
        /**
         * Gets the items in this list
         *
         */
        get: function () {
            return new items_1.Items(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "views", {
        /**
         * Gets the views in this list
         *
         */
        get: function () {
            return new views_1.Views(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "fields", {
        /**
         * Gets the fields in this list
         *
         */
        get: function () {
            return new fields_1.Fields(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "forms", {
        /**
         * Gets the forms in this list
         *
         */
        get: function () {
            return new forms_1.Forms(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "defaultView", {
        /**
         * Gets the default view of this list
         *
         */
        get: function () {
            return new views_1.View(this, "DefaultView");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "userCustomActions", {
        /**
         * Get all custom actions on a site collection
         *
         */
        get: function () {
            return new usercustomactions_1.UserCustomActions(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "effectiveBasePermissions", {
        /**
         * Gets the effective base permissions of this list
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryable(this, "EffectiveBasePermissions");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "eventReceivers", {
        /**
         * Gets the event receivers attached to this list
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "EventReceivers");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "relatedFields", {
        /**
         * Gets the related fields of this list
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryable(this, "getRelatedFields");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "informationRightsManagementSettings", {
        /**
         * Gets the IRM settings for this list
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryable(this, "InformationRightsManagementSettings");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "subscriptions", {
        /**
         * Gets the webhook subscriptions of this list
         *
         */
        get: function () {
            return new subscriptions_1.Subscriptions(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "rootFolder", {
        /**
         * The root folder of the list
         */
        get: function () {
            return new folders_1.Folder(this, "rootFolder");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets a view by view guid id
     *
     */
    List.prototype.getView = function (viewId) {
        return new views_1.View(this, "getView('" + viewId + "')");
    };
    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    /* tslint:disable no-string-literal */
    List.prototype.update = function (properties, eTag) {
        var _this = this;
        if (eTag === void 0) { eTag = "*"; }
        var postBody = JSON.stringify(util_1.Util.extend({
            "__metadata": { "type": "SP.List" },
        }, properties));
        return this.postCore({
            body: postBody,
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            var retList = _this;
            if (properties.hasOwnProperty("Title")) {
                retList = _this.getParent(List, _this.parentUrl, "getByTitle('" + properties["Title"] + "')");
            }
            return {
                data: data,
                list: retList,
            };
        });
    };
    /* tslint:enable */
    /**
     * Delete this list
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    List.prototype.delete = function (eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return this.postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     */
    List.prototype.getChanges = function (query) {
        return this.clone(List, "getchanges").postCore({
            body: JSON.stringify({ "query": util_1.Util.extend({ "__metadata": { "type": "SP.ChangeQuery" } }, query) }),
        });
    };
    /**
     * Returns a collection of items from the list based on the specified query.
     *
     * @param CamlQuery The Query schema of Collaborative Application Markup
     * Language (CAML) is used in various ways within the context of Microsoft SharePoint Foundation
     * to define queries against list data.
     * see:
     *
     * https://msdn.microsoft.com/en-us/library/office/ms467521.aspx
     *
     * @param expands A URI with a $expand System Query Option indicates that Entries associated with
     * the Entry or Collection of Entries identified by the Resource Path
     * section of the URI must be represented inline (i.e. eagerly loaded).
     * see:
     *
     * https://msdn.microsoft.com/en-us/library/office/fp142385.aspx
     *
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/#ExpandSystemQueryOption
     */
    List.prototype.getItemsByCAMLQuery = function (query) {
        var expands = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            expands[_i - 1] = arguments[_i];
        }
        var q = this.clone(List, "getitems");
        return q.expand.apply(q, expands).postCore({
            body: JSON.stringify({ "query": util_1.Util.extend({ "__metadata": { "type": "SP.CamlQuery" } }, query) }),
        });
    };
    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     */
    List.prototype.getListItemChangesSinceToken = function (query) {
        return this.clone(List, "getlistitemchangessincetoken").postCore({
            body: JSON.stringify({ "query": util_1.Util.extend({ "__metadata": { "type": "SP.ChangeLogItemQuery" } }, query) }),
        }, { parse: function (r) { return r.text(); } });
    };
    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    List.prototype.recycle = function () {
        return this.clone(List, "recycle").postCore().then(function (data) {
            if (data.hasOwnProperty("Recycle")) {
                return data.Recycle;
            }
            else {
                return data;
            }
        });
    };
    /**
     * Renders list data based on the view xml provided
     */
    List.prototype.renderListData = function (viewXml) {
        var q = this.clone(List, "renderlistdata(@viewXml)");
        q.query.add("@viewXml", "'" + viewXml + "'");
        return q.postCore().then(function (data) {
            if (data.hasOwnProperty("RenderListData")) {
                return JSON.parse(data.RenderListData);
            }
            return JSON.parse(data);
        });
    };
    /**
     * Returns the data for the specified query view
     *
     * @param parameters The parameters to be used to render list data as JSON string.
     * @param overrideParameters The parameters that are used to override and extend the regular SPRenderListDataParameters.
     */
    List.prototype.renderListDataAsStream = function (parameters, overrideParameters) {
        if (overrideParameters === void 0) { overrideParameters = null; }
        var postBody = {
            overrideParameters: util_1.Util.extend({
                "__metadata": { "type": "SP.RenderListDataOverrideParameters" },
            }, overrideParameters),
            parameters: util_1.Util.extend({
                "__metadata": { "type": "SP.RenderListDataParameters" },
            }, parameters),
        };
        return this.clone(List, "RenderListDataAsStream", true).postCore({
            body: JSON.stringify(postBody),
        });
    };
    /**
     * Gets the field values and field schema attributes for a list item.
     */
    List.prototype.renderListFormData = function (itemId, formId, mode) {
        return this.clone(List, "renderlistformdata(itemid=" + itemId + ", formid='" + formId + "', mode='" + mode + "')").postCore().then(function (data) {
            // data will be a string, so we parse it again
            data = JSON.parse(data);
            if (data.hasOwnProperty("ListData")) {
                return data.ListData;
            }
            else {
                return data;
            }
        });
    };
    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    List.prototype.reserveListItemId = function () {
        return this.clone(List, "reservelistitemid").postCore().then(function (data) {
            if (data.hasOwnProperty("ReserveListItemId")) {
                return data.ReserveListItemId;
            }
            else {
                return data;
            }
        });
    };
    /**
     * Returns the ListItemEntityTypeFullName for this list, used when adding/updating list items. Does not support batching.
     *
     */
    List.prototype.getListItemEntityTypeFullName = function () {
        return this.clone(List, null, false).select("ListItemEntityTypeFullName").getAs().then(function (o) { return o.ListItemEntityTypeFullName; });
    };
    return List;
}(sharepointqueryablesecurable_1.SharePointQueryableSecurable));
exports.List = List;


/***/ }),

/***/ "Ft4X":
/*!***************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/exports/net.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var httpclient_1 = __webpack_require__(/*! ../net/httpclient */ "KjMO");
exports.HttpClient = httpclient_1.HttpClient;
var sprequestexecutorclient_1 = __webpack_require__(/*! ../net/sprequestexecutorclient */ "U9ZE");
exports.SPRequestExecutorClient = sprequestexecutorclient_1.SPRequestExecutorClient;
var nodefetchclient_1 = __webpack_require__(/*! ../net/nodefetchclient */ "1OJs");
exports.NodeFetchClient = nodefetchclient_1.NodeFetchClient;
var fetchclient_1 = __webpack_require__(/*! ../net/fetchclient */ "UTMP");
exports.FetchClient = fetchclient_1.FetchClient;
var graphclient_1 = __webpack_require__(/*! ../net/graphclient */ "WqsK");
exports.GraphHttpClient = graphclient_1.GraphHttpClient;


/***/ }),

/***/ "G+pd":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??postcss!./lib/webparts/crudPnpjs/CrudPnpjsWebPart.module.css ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(false);
// Module
exports.push([module.i, ".crudPnpjs_ba7a6a9c .container_ba7a6a9c{max-width:700px;margin:0 auto;box-shadow:0 2px 4px 0 rgba(0,0,0,.2),0 25px 50px 0 rgba(0,0,0,.1)}.crudPnpjs_ba7a6a9c .row_ba7a6a9c{margin:0 -8px;box-sizing:border-box;color:\"[theme:white, default: #ffffff]\";background-color:\"[theme:themeDark, default: #005a9e]\";padding:20px}.crudPnpjs_ba7a6a9c .row_ba7a6a9c:after,.crudPnpjs_ba7a6a9c .row_ba7a6a9c:before{display:table;content:\"\";line-height:0}.crudPnpjs_ba7a6a9c .row_ba7a6a9c:after{clear:both}.crudPnpjs_ba7a6a9c .column_ba7a6a9c{position:relative;min-height:1px;padding-left:8px;padding-right:8px;box-sizing:border-box}[dir=ltr] .crudPnpjs_ba7a6a9c .column_ba7a6a9c{float:left}[dir=rtl] .crudPnpjs_ba7a6a9c .column_ba7a6a9c{float:right}.crudPnpjs_ba7a6a9c .column_ba7a6a9c .ms-Grid_ba7a6a9c{padding:0}@media (min-width:640px){.crudPnpjs_ba7a6a9c .column_ba7a6a9c{width:83.33333333333334%}}@media (min-width:1024px){.crudPnpjs_ba7a6a9c .column_ba7a6a9c{width:66.66666666666666%}}@media (min-width:1024px){[dir=ltr] .crudPnpjs_ba7a6a9c .column_ba7a6a9c{left:16.66667%}[dir=rtl] .crudPnpjs_ba7a6a9c .column_ba7a6a9c{right:16.66667%}}@media (min-width:640px){[dir=ltr] .crudPnpjs_ba7a6a9c .column_ba7a6a9c{left:8.33333%}[dir=rtl] .crudPnpjs_ba7a6a9c .column_ba7a6a9c{right:8.33333%}}.crudPnpjs_ba7a6a9c .title_ba7a6a9c{font-size:21px;font-weight:100;color:\"[theme:white, default: #ffffff]\"}.crudPnpjs_ba7a6a9c .description_ba7a6a9c,.crudPnpjs_ba7a6a9c .subTitle_ba7a6a9c{font-size:17px;font-weight:300;color:\"[theme:white, default: #ffffff]\"}.crudPnpjs_ba7a6a9c .button_ba7a6a9c{text-decoration:none;height:32px;min-width:80px;background-color:\"[theme:themePrimary, default: #0078d4]\";border-color:\"[theme:themePrimary, default: #0078d4]\";color:\"[theme:white, default: #ffffff]\";outline:transparent;position:relative;font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;font-weight:400;border-width:0;text-align:center;cursor:pointer;display:inline-block;padding:0 16px}.crudPnpjs_ba7a6a9c .button_ba7a6a9c .label_ba7a6a9c{font-weight:600;font-size:14px;height:32px;line-height:32px;margin:0 4px;vertical-align:top;display:inline-block}", ""]);


/***/ }),

/***/ "G2Ar":
/*!*****************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/toabsoluteurl.js ***!
  \*****************************************************/
/*! exports provided: toAbsoluteUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toAbsoluteUrl", function() { return toAbsoluteUrl; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");


/**
 * Ensures that a given url is absolute for the current web based on context
 *
 * @param candidateUrl The url to make absolute
 *
 */
function toAbsoluteUrl(candidateUrl, runtime) {
    var _a, _b;
    if (runtime === void 0) { runtime = _pnp_common__WEBPACK_IMPORTED_MODULE_1__["DefaultRuntime"]; }
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
        var baseUrl, fetchClientFactory, context, tempClient, location_1;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_c) {
            if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["isUrlAbsolute"])(candidateUrl)) {
                // if we are already absolute, then just return the url
                return [2 /*return*/, candidateUrl];
            }
            baseUrl = (_a = runtime.get("sp")) === null || _a === void 0 ? void 0 : _a.baseUrl;
            fetchClientFactory = (_b = runtime.get("sp")) === null || _b === void 0 ? void 0 : _b.fetchClientFactory;
            if (!Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["stringIsNullOrEmpty"])(baseUrl)) {
                // base url specified either with baseUrl of spfxContext config property
                return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(baseUrl, candidateUrl)];
            }
            context = runtime.get("spfxContext");
            if (context) {
                return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(context.pageContext.web.absoluteUrl, candidateUrl)];
            }
            // to make the existing node client work in a backwards compatible way we do the following (hacky thing)
            // get the client
            // see if it has a siteUrl property
            // use that to absolute the url
            if (fetchClientFactory) {
                tempClient = fetchClientFactory();
                if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(tempClient, "siteUrl")) {
                    return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(tempClient.siteUrl, candidateUrl)];
                }
            }
            if (_pnp_common__WEBPACK_IMPORTED_MODULE_1__["safeGlobal"]._spPageContextInfo !== undefined) {
                // operating in classic pages
                if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["safeGlobal"]._spPageContextInfo, "webAbsoluteUrl")) {
                    return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["safeGlobal"]._spPageContextInfo.webAbsoluteUrl, candidateUrl)];
                }
                else if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["safeGlobal"]._spPageContextInfo, "webServerRelativeUrl")) {
                    return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["safeGlobal"]._spPageContextInfo.webServerRelativeUrl, candidateUrl)];
                }
            }
            // does window.location exist and have a certain path part in it?
            if (_pnp_common__WEBPACK_IMPORTED_MODULE_1__["safeGlobal"].location !== undefined) {
                location_1 = _pnp_common__WEBPACK_IMPORTED_MODULE_1__["safeGlobal"].location.toString().toLowerCase();
                ["/_layouts/", "/siteassets/", "/sitepages/"].forEach(function (s) {
                    var index = location_1.indexOf(s);
                    if (index > 0) {
                        return Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(location_1.substr(0, index), candidateUrl);
                    }
                });
            }
            return [2 /*return*/, candidateUrl];
        });
    });
}
//# sourceMappingURL=toabsoluteurl.js.map

/***/ }),

/***/ "GGL5":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/views.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Describes the views available in the current context
 *
 */
var Views = /** @class */ (function (_super) {
    __extends(Views, _super);
    /**
     * Creates a new instance of the Views class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Views(baseUrl, path) {
        if (path === void 0) { path = "views"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a view by guid id
     *
     * @param id The GUID id of the view
     */
    Views.prototype.getById = function (id) {
        var v = new View(this);
        v.concat("('" + id + "')");
        return v;
    };
    /**
     * Gets a view by title (case-sensitive)
     *
     * @param title The case-sensitive title of the view
     */
    Views.prototype.getByTitle = function (title) {
        return new View(this, "getByTitle('" + title + "')");
    };
    /**
     * Adds a new view to the collection
     *
     * @param title The new views's title
     * @param personalView True if this is a personal view, otherwise false, default = false
     * @param additionalSettings Will be passed as part of the view creation body
     */
    Views.prototype.add = function (title, personalView, additionalSettings) {
        var _this = this;
        if (personalView === void 0) { personalView = false; }
        if (additionalSettings === void 0) { additionalSettings = {}; }
        var postBody = JSON.stringify(util_1.Util.extend({
            "PersonalView": personalView,
            "Title": title,
            "__metadata": { "type": "SP.View" },
        }, additionalSettings));
        return this.clone(Views, null).postAsCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                view: _this.getById(data.Id),
            };
        });
    };
    return Views;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Views = Views;
/**
 * Describes a single View instance
 *
 */
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(View.prototype, "fields", {
        get: function () {
            return new ViewFields(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates this view intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the view
     */
    View.prototype.update = function (properties) {
        var _this = this;
        var postBody = JSON.stringify(util_1.Util.extend({
            "__metadata": { "type": "SP.View" },
        }, properties));
        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            return {
                data: data,
                view: _this,
            };
        });
    };
    /**
     * Delete this view
     *
     */
    View.prototype.delete = function () {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    /**
     * Returns the list view as HTML.
     *
     */
    View.prototype.renderAsHtml = function () {
        return this.clone(sharepointqueryable_1.SharePointQueryable, "renderashtml").get();
    };
    return View;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.View = View;
var ViewFields = /** @class */ (function (_super) {
    __extends(ViewFields, _super);
    function ViewFields(baseUrl, path) {
        if (path === void 0) { path = "viewfields"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a value that specifies the XML schema that represents the collection.
     */
    ViewFields.prototype.getSchemaXml = function () {
        return this.clone(sharepointqueryable_1.SharePointQueryable, "schemaxml").get();
    };
    /**
     * Adds the field with the specified field internal name or display name to the collection.
     *
     * @param fieldTitleOrInternalName The case-sensitive internal name or display name of the field to add.
     */
    ViewFields.prototype.add = function (fieldTitleOrInternalName) {
        return this.clone(ViewFields, "addviewfield('" + fieldTitleOrInternalName + "')").postCore();
    };
    /**
     * Moves the field with the specified field internal name to the specified position in the collection.
     *
     * @param fieldInternalName The case-sensitive internal name of the field to move.
     * @param index The zero-based index of the new position for the field.
     */
    ViewFields.prototype.move = function (fieldInternalName, index) {
        return this.clone(ViewFields, "moveviewfieldto").postCore({
            body: JSON.stringify({ "field": fieldInternalName, "index": index }),
        });
    };
    /**
     * Removes all the fields from the collection.
     */
    ViewFields.prototype.removeAll = function () {
        return this.clone(ViewFields, "removeallviewfields").postCore();
    };
    /**
     * Removes the field with the specified field internal name from the collection.
     *
     * @param fieldInternalName The case-sensitive internal name of the field to remove from the view.
     */
    ViewFields.prototype.remove = function (fieldInternalName) {
        return this.clone(ViewFields, "removeviewfield('" + fieldInternalName + "')").postCore();
    };
    return ViewFields;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.ViewFields = ViewFields;


/***/ }),

/***/ "Hjjg":
/*!*******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/rest.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var search_1 = __webpack_require__(/*! ./search */ "vy67");
var searchsuggest_1 = __webpack_require__(/*! ./searchsuggest */ "i8K7");
var site_1 = __webpack_require__(/*! ./site */ "Dems");
var webs_1 = __webpack_require__(/*! ./webs */ "U0SV");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var userprofiles_1 = __webpack_require__(/*! ./userprofiles */ "vfgx");
var social_1 = __webpack_require__(/*! ./social */ "rUwr");
var navigation_1 = __webpack_require__(/*! ./navigation */ "/1ZT");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
var utilities_1 = __webpack_require__(/*! ./utilities */ "Bqol");
/**
 * Root of the SharePoint REST module
 */
var SPRest = /** @class */ (function () {
    /**
     * Creates a new instance of the SPRest class
     *
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    function SPRest(options, baseUrl) {
        if (options === void 0) { options = {}; }
        if (baseUrl === void 0) { baseUrl = ""; }
        this._options = options;
        this._baseUrl = baseUrl;
    }
    /**
     * Configures instance with additional options and baseUrl.
     * Provided configuration used by other objects in a chain
     *
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    SPRest.prototype.configure = function (options, baseUrl) {
        if (baseUrl === void 0) { baseUrl = ""; }
        return new SPRest(options, baseUrl);
    };
    /**
     * Executes a search against this web context
     *
     * @param query The SearchQuery definition
     */
    SPRest.prototype.searchSuggest = function (query) {
        var finalQuery;
        if (typeof query === "string") {
            finalQuery = { querytext: query };
        }
        else {
            finalQuery = query;
        }
        return new searchsuggest_1.SearchSuggest(this._baseUrl).configure(this._options).execute(finalQuery);
    };
    /**
     * Executes a search against this web context
     *
     * @param query The SearchQuery definition
     */
    SPRest.prototype.search = function (query) {
        var finalQuery;
        if (typeof query === "string") {
            finalQuery = { Querytext: query };
        }
        else if (query instanceof search_1.SearchQueryBuilder) {
            finalQuery = query.toSearchQuery();
        }
        else {
            finalQuery = query;
        }
        return new search_1.Search(this._baseUrl).configure(this._options).execute(finalQuery);
    };
    Object.defineProperty(SPRest.prototype, "site", {
        /**
         * Begins a site collection scoped REST request
         *
         */
        get: function () {
            return new site_1.Site(this._baseUrl).configure(this._options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SPRest.prototype, "web", {
        /**
         * Begins a web scoped REST request
         *
         */
        get: function () {
            return new webs_1.Web(this._baseUrl).configure(this._options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SPRest.prototype, "profiles", {
        /**
         * Access to user profile methods
         */
        get: function () {
            return new userprofiles_1.UserProfileQuery(this._baseUrl).configure(this._options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SPRest.prototype, "social", {
        /**
         * Access to social methods
         */
        get: function () {
            return new social_1.SocialQuery(this._baseUrl).configure(this._options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SPRest.prototype, "navigation", {
        /**
         * Access to the site collection level navigation service
         */
        get: function () {
            return new navigation_1.NavigationService();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new batch object for use with the SharePointQueryable.addToBatch method
     *
     */
    SPRest.prototype.createBatch = function () {
        return this.web.createBatch();
    };
    Object.defineProperty(SPRest.prototype, "utility", {
        /**
         * Static utilities methods from SP.Utilities.Utility
         */
        get: function () {
            return new utilities_1.UtilityMethod(this._baseUrl, "").configure(this._options);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Begins a cross-domain, host site scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    SPRest.prototype.crossDomainSite = function (addInWebUrl, hostWebUrl) {
        return this._cdImpl(site_1.Site, addInWebUrl, hostWebUrl, "site");
    };
    /**
     * Begins a cross-domain, host web scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    SPRest.prototype.crossDomainWeb = function (addInWebUrl, hostWebUrl) {
        return this._cdImpl(webs_1.Web, addInWebUrl, hostWebUrl, "web");
    };
    /**
     * Implements the creation of cross domain REST urls
     *
     * @param factory The constructor of the object to create Site | Web
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     * @param urlPart String part to append to the url "site" | "web"
     */
    SPRest.prototype._cdImpl = function (factory, addInWebUrl, hostWebUrl, urlPart) {
        if (!util_1.Util.isUrlAbsolute(addInWebUrl)) {
            throw new exceptions_1.UrlException("The addInWebUrl parameter must be an absolute url.");
        }
        if (!util_1.Util.isUrlAbsolute(hostWebUrl)) {
            throw new exceptions_1.UrlException("The hostWebUrl parameter must be an absolute url.");
        }
        var url = util_1.Util.combinePaths(addInWebUrl, "_api/SP.AppContextSite(@target)");
        var instance = new factory(url, urlPart);
        instance.query.add("@target", "'" + encodeURIComponent(hostWebUrl) + "'");
        return instance.configure(this._options);
    };
    return SPRest;
}());
exports.SPRest = SPRest;


/***/ }),

/***/ "I1iA":
/*!********************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/usercustomactions.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Describes a collection of user custom actions
 *
 */
var UserCustomActions = /** @class */ (function (_super) {
    __extends(UserCustomActions, _super);
    /**
     * Creates a new instance of the UserCustomActions class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this user custom actions collection
     */
    function UserCustomActions(baseUrl, path) {
        if (path === void 0) { path = "usercustomactions"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Returns the user custom action with the specified id
     *
     * @param id The GUID id of the user custom action to retrieve
     */
    UserCustomActions.prototype.getById = function (id) {
        var uca = new UserCustomAction(this);
        uca.concat("('" + id + "')");
        return uca;
    };
    /**
     * Creates a user custom action
     *
     * @param properties The information object of property names and values which define the new user custom action
     *
     */
    UserCustomActions.prototype.add = function (properties) {
        var _this = this;
        var postBody = JSON.stringify(util_1.Util.extend({ __metadata: { "type": "SP.UserCustomAction" } }, properties));
        return this.postCore({ body: postBody }).then(function (data) {
            return {
                action: _this.getById(data.Id),
                data: data,
            };
        });
    };
    /**
     * Deletes all user custom actions in the collection
     *
     */
    UserCustomActions.prototype.clear = function () {
        return this.clone(UserCustomActions, "clear").postCore();
    };
    return UserCustomActions;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.UserCustomActions = UserCustomActions;
/**
 * Describes a single user custom action
 *
 */
var UserCustomAction = /** @class */ (function (_super) {
    __extends(UserCustomAction, _super);
    function UserCustomAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
    * Updates this user custom action with the supplied properties
    *
    * @param properties An information object of property names and values to update for this user custom action
    */
    UserCustomAction.prototype.update = function (properties) {
        var _this = this;
        var postBody = JSON.stringify(util_1.Util.extend({
            "__metadata": { "type": "SP.UserCustomAction" },
        }, properties));
        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            return {
                action: _this,
                data: data,
            };
        });
    };
    /**
    * Removes this user custom action
    *
    */
    UserCustomAction.prototype.delete = function () {
        return _super.prototype.deleteCore.call(this);
    };
    return UserCustomAction;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.UserCustomAction = UserCustomAction;


/***/ }),

/***/ "I4Bp":
/*!****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/exports/core.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ../configuration/providers/index */ "IzCL"));
var collections_1 = __webpack_require__(/*! ../collections/collections */ "hd/X");
exports.Dictionary = collections_1.Dictionary;
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
exports.Util = util_1.Util;
__export(__webpack_require__(/*! ../utils/logging */ "2C3z"));
__export(__webpack_require__(/*! ../utils/exceptions */ "tv1o"));
__export(__webpack_require__(/*! ../utils/storage */ "q1wT"));


/***/ }),

/***/ "I6O9":
/*!***************************************!*\
  !*** external "@microsoft/sp-loader" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_I6O9__;

/***/ }),

/***/ "IzCL":
/*!*********************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/configuration/providers/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cachingConfigurationProvider_1 = __webpack_require__(/*! ./cachingConfigurationProvider */ "Z4xO");
exports.CachingConfigurationProvider = cachingConfigurationProvider_1.default;
var spListConfigurationProvider_1 = __webpack_require__(/*! ./spListConfigurationProvider */ "BqJy");
exports.SPListConfigurationProvider = spListConfigurationProvider_1.default;


/***/ }),

/***/ "J7sA":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/lists/index.js ***!
  \*********************************************/
/*! exports provided: List, Lists, ControlMode, RenderListDataOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _web_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./web.js */ "Bwa7");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "hy0S");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "List", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["List"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Lists", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["Lists"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ControlMode", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["ControlMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RenderListDataOptions", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["RenderListDataOptions"]; });



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "JPst":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], "{").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      // eslint-disable-next-line prefer-destructuring
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = modules[_i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = "(".concat(item[2], ") and (").concat(mediaQuery, ")");
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot).concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "KJz+":
/*!*************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/net/utils.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
function mergeOptions(target, source) {
    target.headers = target.headers || {};
    var headers = util_1.Util.extend(target.headers, source.headers);
    target = util_1.Util.extend(target, source);
    target.headers = headers;
}
exports.mergeOptions = mergeOptions;
function mergeHeaders(target, source) {
    if (typeof source !== "undefined" && source !== null) {
        var temp = new Request("", { headers: source });
        temp.headers.forEach(function (value, name) {
            target.append(name, value);
        });
    }
}
exports.mergeHeaders = mergeHeaders;


/***/ }),

/***/ "KjMO":
/*!******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/net/httpclient.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var digestcache_1 = __webpack_require__(/*! ./digestcache */ "+/lA");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var pnplibconfig_1 = __webpack_require__(/*! ../configuration/pnplibconfig */ "Mvka");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
var utils_1 = __webpack_require__(/*! ./utils */ "KJz+");
var HttpClient = /** @class */ (function () {
    function HttpClient() {
        this._impl = pnplibconfig_1.RuntimeConfig.spFetchClientFactory();
        this._digestCache = new digestcache_1.DigestCache(this);
    }
    HttpClient.prototype.fetch = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { cache: "no-cache", credentials: "same-origin" }, true);
        var headers = new Headers();
        // first we add the global headers so they can be overwritten by any passed in locally to this call
        utils_1.mergeHeaders(headers, pnplibconfig_1.RuntimeConfig.spHeaders);
        // second we add the local options so we can overwrite the globals
        utils_1.mergeHeaders(headers, options.headers);
        // lastly we apply any default headers we need that may not exist
        if (!headers.has("Accept")) {
            headers.append("Accept", "application/json");
        }
        if (!headers.has("Content-Type")) {
            headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
        }
        if (!headers.has("X-ClientService-ClientTag")) {
            headers.append("X-ClientService-ClientTag", "PnPCoreJS:3.0.10");
        }
        if (!headers.has("User-Agent")) {
            // this marks the requests for understanding by the service
            headers.append("User-Agent", "NONISV|SharePointPnP|PnPCoreJS/3.0.10");
        }
        opts = util_1.Util.extend(opts, { headers: headers });
        if (opts.method && opts.method.toUpperCase() !== "GET") {
            // if we have either a request digest or an authorization header we don't need a digest
            if (!headers.has("X-RequestDigest") && !headers.has("Authorization")) {
                var index = url.indexOf("_api/");
                if (index < 0) {
                    throw new exceptions_1.APIUrlException();
                }
                var webUrl = url.substr(0, index);
                return this._digestCache.getDigest(webUrl)
                    .then(function (digest) {
                    headers.append("X-RequestDigest", digest);
                    return _this.fetchRaw(url, opts);
                });
            }
        }
        return this.fetchRaw(url, opts);
    };
    HttpClient.prototype.fetchRaw = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        // here we need to normalize the headers
        var rawHeaders = new Headers();
        utils_1.mergeHeaders(rawHeaders, options.headers);
        options = util_1.Util.extend(options, { headers: rawHeaders });
        var retry = function (ctx) {
            _this._impl.fetch(url, options).then(function (response) { return ctx.resolve(response); }).catch(function (response) {
                // Check if request was throttled - http status code 429
                // Check if request failed due to server unavailable - http status code 503
                if (response.status !== 429 && response.status !== 503) {
                    ctx.reject(response);
                }
                // grab our current delay
                var delay = ctx.delay;
                // Increment our counters.
                ctx.delay *= 2;
                ctx.attempts++;
                // If we have exceeded the retry count, reject.
                if (ctx.retryCount <= ctx.attempts) {
                    ctx.reject(response);
                }
                // Set our retry timeout for {delay} milliseconds.
                setTimeout(util_1.Util.getCtxCallback(_this, retry, ctx), delay);
            });
        };
        return new Promise(function (resolve, reject) {
            var retryContext = {
                attempts: 0,
                delay: 100,
                reject: reject,
                resolve: resolve,
                retryCount: 7,
            };
            retry.call(_this, retryContext);
        });
    };
    HttpClient.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { method: "GET" });
        return this.fetch(url, opts);
    };
    HttpClient.prototype.post = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { method: "POST" });
        return this.fetch(url, opts);
    };
    HttpClient.prototype.patch = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { method: "PATCH" });
        return this.fetch(url, opts);
    };
    HttpClient.prototype.delete = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { method: "DELETE" });
        return this.fetch(url, opts);
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;


/***/ }),

/***/ "L8jG":
/*!************************************************************!*\
  !*** ./lib/webparts/crudPnpjs/CrudPnpjsWebPart.module.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/postcss-loader/src??postcss!./CrudPnpjsWebPart.module.css */ "G+pd");
var loader = __webpack_require__(/*! ./node_modules/@microsoft/loader-load-themed-styles/node_modules/@microsoft/load-themed-styles/lib/index.js */ "ruv1");

if(typeof content === "string") content = [[module.i, content]];

// add the styles to the DOM
for (var i = 0; i < content.length; i++) loader.loadStyles(content[i][1], true);

if(content.locals) module.exports = content.locals;

/***/ }),

/***/ "LGj0":
/*!************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/graphqueryable.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var collections_1 = __webpack_require__(/*! ../collections/collections */ "hd/X");
var graphclient_1 = __webpack_require__(/*! ../net/graphclient */ "WqsK");
var queryable_1 = __webpack_require__(/*! ../odata/queryable */ "fuNo");
var pipeline_1 = __webpack_require__(/*! ../request/pipeline */ "a1BX");
/**
 * Queryable Base Class
 *
 */
var GraphQueryable = /** @class */ (function (_super) {
    __extends(GraphQueryable, _super);
    /**
     * Creates a new instance of the Queryable class
     *
     * @constructor
     * @param baseUrl A string or Queryable that should form the base part of the url
     *
     */
    function GraphQueryable(baseUrl, path) {
        var _this = _super.call(this) || this;
        _this._query = new collections_1.Dictionary();
        if (typeof baseUrl === "string") {
            var urlStr = baseUrl;
            _this._parentUrl = urlStr;
            _this._url = util_1.Util.combinePaths(urlStr, path);
        }
        else {
            var q = baseUrl;
            _this._parentUrl = q._url;
            _this._url = util_1.Util.combinePaths(_this._parentUrl, path);
        }
        return _this;
    }
    /**
     * Creates a new instance of the supplied factory and extends this into that new instance
     *
     * @param factory constructor for the new queryable
     */
    GraphQueryable.prototype.as = function (factory) {
        var o = new factory(this._url, null);
        return util_1.Util.extend(o, this, true);
    };
    /**
     * Gets the full url with query information
     *
     */
    GraphQueryable.prototype.toUrlAndQuery = function () {
        var _this = this;
        return this.toUrl() + ("?" + this._query.getKeys().map(function (key) { return key + "=" + _this._query.get(key); }).join("&"));
    };
    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    GraphQueryable.prototype.getParent = function (factory, baseUrl, path) {
        if (baseUrl === void 0) { baseUrl = this.parentUrl; }
        return new factory(baseUrl, path);
    };
    /**
     * Clones this queryable into a new queryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     */
    GraphQueryable.prototype.clone = function (factory, additionalPath, includeBatch) {
        if (includeBatch === void 0) { includeBatch = true; }
        // TODO:: include batching info in clone
        if (includeBatch) {
            return new factory(this, additionalPath);
        }
        return new factory(this, additionalPath);
    };
    /**
     * Converts the current instance to a request context
     *
     * @param verb The request verb
     * @param options The set of supplied request options
     * @param parser The supplied ODataParser instance
     * @param pipeline Optional request processing pipeline
     */
    GraphQueryable.prototype.toRequestContext = function (verb, options, parser, pipeline) {
        if (options === void 0) { options = {}; }
        if (pipeline === void 0) { pipeline = pipeline_1.PipelineMethods.default; }
        // TODO:: add batch support
        return Promise.resolve({
            batch: null,
            batchDependency: function () { return void (0); },
            cachingOptions: this._cachingOptions,
            clientFactory: function () { return new graphclient_1.GraphHttpClient(); },
            isBatched: false,
            isCached: this._useCaching,
            options: options,
            parser: parser,
            pipeline: pipeline,
            requestAbsoluteUrl: this.toUrlAndQuery(),
            requestId: util_1.Util.getGUID(),
            verb: verb,
        });
    };
    return GraphQueryable;
}(queryable_1.ODataQueryable));
exports.GraphQueryable = GraphQueryable;
/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
var GraphQueryableCollection = /** @class */ (function (_super) {
    __extends(GraphQueryableCollection, _super);
    function GraphQueryableCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     *
     * @param filter The string representing the filter query
     */
    GraphQueryableCollection.prototype.filter = function (filter) {
        this._query.add("$filter", filter);
        return this;
    };
    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    GraphQueryableCollection.prototype.select = function () {
        var selects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selects[_i] = arguments[_i];
        }
        if (selects.length > 0) {
            this._query.add("$select", selects.join(","));
        }
        return this;
    };
    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    GraphQueryableCollection.prototype.expand = function () {
        var expands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expands[_i] = arguments[_i];
        }
        if (expands.length > 0) {
            this._query.add("$expand", expands.join(","));
        }
        return this;
    };
    /**
     * Orders based on the supplied fields ascending
     *
     * @param orderby The name of the field to sort on
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    GraphQueryableCollection.prototype.orderBy = function (orderBy, ascending) {
        if (ascending === void 0) { ascending = true; }
        var keys = this._query.getKeys();
        var query = [];
        var asc = ascending ? " asc" : " desc";
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === "$orderby") {
                query.push(this._query.get("$orderby"));
                break;
            }
        }
        query.push("" + orderBy + asc);
        this._query.add("$orderby", query.join(","));
        return this;
    };
    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    GraphQueryableCollection.prototype.top = function (top) {
        this._query.add("$top", top.toString());
        return this;
    };
    /**
     * Skips a set number of items in the return set
     *
     * @param num Number of items to skip
     */
    GraphQueryableCollection.prototype.skip = function (num) {
        this._query.add("$top", num.toString());
        return this;
    };
    /**
     * 	To request second and subsequent pages of Graph data
     */
    GraphQueryableCollection.prototype.skipToken = function (token) {
        this._query.add("$skiptoken", token);
        return this;
    };
    Object.defineProperty(GraphQueryableCollection.prototype, "count", {
        /**
         * 	Retrieves the total count of matching resources
         */
        get: function () {
            this._query.add("$count", "true");
            return this;
        },
        enumerable: true,
        configurable: true
    });
    return GraphQueryableCollection;
}(GraphQueryable));
exports.GraphQueryableCollection = GraphQueryableCollection;
var GraphQueryableSearchableCollection = /** @class */ (function (_super) {
    __extends(GraphQueryableSearchableCollection, _super);
    function GraphQueryableSearchableCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 	To request second and subsequent pages of Graph data
     */
    GraphQueryableSearchableCollection.prototype.search = function (query) {
        this._query.add("$search", query);
        return this;
    };
    return GraphQueryableSearchableCollection;
}(GraphQueryableCollection));
exports.GraphQueryableSearchableCollection = GraphQueryableSearchableCollection;
/**
 * Represents an instance that can be selected
 *
 */
var GraphQueryableInstance = /** @class */ (function (_super) {
    __extends(GraphQueryableInstance, _super);
    function GraphQueryableInstance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    GraphQueryableInstance.prototype.select = function () {
        var selects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selects[_i] = arguments[_i];
        }
        if (selects.length > 0) {
            this._query.add("$select", selects.join(","));
        }
        return this;
    };
    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    GraphQueryableInstance.prototype.expand = function () {
        var expands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expands[_i] = arguments[_i];
        }
        if (expands.length > 0) {
            this._query.add("$expand", expands.join(","));
        }
        return this;
    };
    return GraphQueryableInstance;
}(GraphQueryable));
exports.GraphQueryableInstance = GraphQueryableInstance;


/***/ }),

/***/ "LK7q":
/*!**************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/rest.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var v1_1 = __webpack_require__(/*! ./v1 */ "fICk");
var GraphRest = /** @class */ (function () {
    function GraphRest() {
    }
    Object.defineProperty(GraphRest.prototype, "v1", {
        get: function () {
            return new v1_1.V1("");
        },
        enumerable: true,
        configurable: true
    });
    return GraphRest;
}());
exports.GraphRest = GraphRest;


/***/ }),

/***/ "LVfT":
/*!**************************************************************!*\
  !*** ./node_modules/@pnp/sp/node_modules/tslib/tslib.es6.js ***!
  \**************************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArray", function() { return __spreadArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || from);
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}


/***/ }),

/***/ "MMX7":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/files.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var parsers_1 = __webpack_require__(/*! ../odata/parsers */ "eGqj");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
var webparts_1 = __webpack_require__(/*! ./webparts */ "C3fl");
var items_1 = __webpack_require__(/*! ./items */ "/pGJ");
var sharepointqueryableshareable_1 = __webpack_require__(/*! ./sharepointqueryableshareable */ "gZxA");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
/**
 * Describes a collection of File objects
 *
 */
var Files = /** @class */ (function (_super) {
    __extends(Files, _super);
    /**
     * Creates a new instance of the Files class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Files(baseUrl, path) {
        if (path === void 0) { path = "files"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a File by filename
     *
     * @param name The name of the file, including extension.
     */
    Files.prototype.getByName = function (name) {
        var f = new File(this);
        f.concat("('" + name + "')");
        return f;
    };
    /**
     * Uploads a file. Not supported for batching
     *
     * @param url The folder-relative url of the file.
     * @param content The file contents blob.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
     * @returns The new File and the raw response.
     */
    Files.prototype.add = function (url, content, shouldOverWrite) {
        var _this = this;
        if (shouldOverWrite === void 0) { shouldOverWrite = true; }
        return new Files(this, "add(overwrite=" + shouldOverWrite + ",url='" + url + "')")
            .postCore({
            body: content,
        }).then(function (response) {
            return {
                data: response,
                file: _this.getByName(url),
            };
        });
    };
    /**
     * Uploads a file. Not supported for batching
     *
     * @param url The folder-relative url of the file.
     * @param content The Blob file content to add
     * @param progress A callback function which can be used to track the progress of the upload
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
     * @param chunkSize The size of each file slice, in bytes (default: 10485760)
     * @returns The new File and the raw response.
     */
    Files.prototype.addChunked = function (url, content, progress, shouldOverWrite, chunkSize) {
        var _this = this;
        if (shouldOverWrite === void 0) { shouldOverWrite = true; }
        if (chunkSize === void 0) { chunkSize = 10485760; }
        var adder = this.clone(Files, "add(overwrite=" + shouldOverWrite + ",url='" + url + "')", false);
        return adder.postCore()
            .then(function () { return _this.getByName(url); })
            .then(function (file) { return file.setContentChunked(content, progress, chunkSize); });
    };
    /**
     * Adds a ghosted file to an existing list or document library. Not supported for batching.
     *
     * @param fileUrl The server-relative url where you want to save the file.
     * @param templateFileType The type of use to create the file.
     * @returns The template file that was added and the raw response.
     */
    Files.prototype.addTemplateFile = function (fileUrl, templateFileType) {
        var _this = this;
        return this.clone(Files, "addTemplateFile(urloffile='" + fileUrl + "',templatefiletype=" + templateFileType + ")", false)
            .postCore().then(function (response) {
            return {
                data: response,
                file: _this.getByName(fileUrl),
            };
        });
    };
    return Files;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Files = Files;
/**
 * Describes a single File instance
 *
 */
var File = /** @class */ (function (_super) {
    __extends(File, _super);
    function File() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(File.prototype, "listItemAllFields", {
        /**
         * Gets a value that specifies the list item field values for the list item corresponding to the file.
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "listItemAllFields");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "versions", {
        /**
         * Gets a collection of versions
         *
         */
        get: function () {
            return new Versions(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Approves the file submitted for content approval with the specified comment.
     * Only documents in lists that are enabled for content approval can be approved.
     *
     * @param comment The comment for the approval.
     */
    File.prototype.approve = function (comment) {
        if (comment === void 0) { comment = ""; }
        return this.clone(File, "approve(comment='" + comment + "')").postCore();
    };
    /**
     * Stops the chunk upload session without saving the uploaded data. Does not support batching.
     * If the file doesn’t already exist in the library, the partially uploaded file will be deleted.
     * Use this in response to user action (as in a request to cancel an upload) or an error or exception.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     *
     * @param uploadId The unique identifier of the upload session.
     */
    File.prototype.cancelUpload = function (uploadId) {
        return this.clone(File, "cancelUpload(uploadId=guid'" + uploadId + "')", false).postCore();
    };
    /**
     * Checks the file in to a document library based on the check-in type.
     *
     * @param comment A comment for the check-in. Its length must be <= 1023.
     * @param checkinType The check-in type for the file.
     */
    File.prototype.checkin = function (comment, checkinType) {
        if (comment === void 0) { comment = ""; }
        if (checkinType === void 0) { checkinType = CheckinType.Major; }
        if (comment.length > 1023) {
            throw new exceptions_1.MaxCommentLengthException();
        }
        return this.clone(File, "checkin(comment='" + comment + "',checkintype=" + checkinType + ")").postCore();
    };
    /**
     * Checks out the file from a document library.
     */
    File.prototype.checkout = function () {
        return this.clone(File, "checkout").postCore();
    };
    /**
     * Copies the file to the destination url.
     *
     * @param url The absolute url or server relative url of the destination file path to copy to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     */
    File.prototype.copyTo = function (url, shouldOverWrite) {
        if (shouldOverWrite === void 0) { shouldOverWrite = true; }
        return this.clone(File, "copyTo(strnewurl='" + url + "',boverwrite=" + shouldOverWrite + ")").postCore();
    };
    /**
     * Delete this file.
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    File.prototype.delete = function (eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return this.clone(File, null).postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    /**
     * Denies approval for a file that was submitted for content approval.
     * Only documents in lists that are enabled for content approval can be denied.
     *
     * @param comment The comment for the denial.
     */
    File.prototype.deny = function (comment) {
        if (comment === void 0) { comment = ""; }
        if (comment.length > 1023) {
            throw new exceptions_1.MaxCommentLengthException();
        }
        return this.clone(File, "deny(comment='" + comment + "')").postCore();
    };
    /**
     * Specifies the control set used to access, modify, or add Web Parts associated with this Web Part Page and view.
     * An exception is thrown if the file is not an ASPX page.
     *
     * @param scope The WebPartsPersonalizationScope view on the Web Parts page.
     */
    File.prototype.getLimitedWebPartManager = function (scope) {
        if (scope === void 0) { scope = WebPartsPersonalizationScope.Shared; }
        return new webparts_1.LimitedWebPartManager(this, "getLimitedWebPartManager(scope=" + scope + ")");
    };
    /**
     * Moves the file to the specified destination url.
     *
     * @param url The absolute url or server relative url of the destination file path to move to.
     * @param moveOperations The bitwise MoveOperations value for how to move the file.
     */
    File.prototype.moveTo = function (url, moveOperations) {
        if (moveOperations === void 0) { moveOperations = MoveOperations.Overwrite; }
        return this.clone(File, "moveTo(newurl='" + url + "',flags=" + moveOperations + ")").postCore();
    };
    /**
     * Submits the file for content approval with the specified comment.
     *
     * @param comment The comment for the published file. Its length must be <= 1023.
     */
    File.prototype.publish = function (comment) {
        if (comment === void 0) { comment = ""; }
        if (comment.length > 1023) {
            throw new exceptions_1.MaxCommentLengthException();
        }
        return this.clone(File, "publish(comment='" + comment + "')").postCore();
    };
    /**
     * Moves the file to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     *
     * @returns The GUID of the recycled file.
     */
    File.prototype.recycle = function () {
        return this.clone(File, "recycle").postCore();
    };
    /**
     * Reverts an existing checkout for the file.
     *
     */
    File.prototype.undoCheckout = function () {
        return this.clone(File, "undoCheckout").postCore();
    };
    /**
     * Removes the file from content approval or unpublish a major version.
     *
     * @param comment The comment for the unpublish operation. Its length must be <= 1023.
     */
    File.prototype.unpublish = function (comment) {
        if (comment === void 0) { comment = ""; }
        if (comment.length > 1023) {
            throw new exceptions_1.MaxCommentLengthException();
        }
        return this.clone(File, "unpublish(comment='" + comment + "')").postCore();
    };
    /**
     * Gets the contents of the file as text. Not supported in batching.
     *
     */
    File.prototype.getText = function () {
        return this.clone(File, "$value", false).get(new parsers_1.TextFileParser(), { headers: { "binaryStringResponseBody": "true" } });
    };
    /**
     * Gets the contents of the file as a blob, does not work in Node.js. Not supported in batching.
     *
     */
    File.prototype.getBlob = function () {
        return this.clone(File, "$value", false).get(new parsers_1.BlobFileParser(), { headers: { "binaryStringResponseBody": "true" } });
    };
    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
     */
    File.prototype.getBuffer = function () {
        return this.clone(File, "$value", false).get(new parsers_1.BufferFileParser(), { headers: { "binaryStringResponseBody": "true" } });
    };
    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js. Not supported in batching.
     */
    File.prototype.getJSON = function () {
        return this.clone(File, "$value", false).get(new parsers_1.JSONFileParser(), { headers: { "binaryStringResponseBody": "true" } });
    };
    /**
     * Sets the content of a file, for large files use setContentChunked. Not supported in batching.
     *
     * @param content The file content
     *
     */
    File.prototype.setContent = function (content) {
        var _this = this;
        return this.clone(File, "$value", false).postCore({
            body: content,
            headers: {
                "X-HTTP-Method": "PUT",
            },
        }).then(function (_) { return new File(_this); });
    };
    /**
     * Gets the associated list item for this folder, loading the default properties
     */
    File.prototype.getItem = function () {
        var selects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selects[_i] = arguments[_i];
        }
        var q = this.listItemAllFields;
        return q.select.apply(q, selects).get().then(function (d) {
            return util_1.Util.extend(new items_1.Item(odata_1.spGetEntityUrl(d)), d);
        });
    };
    /**
     * Sets the contents of a file using a chunked upload approach. Not supported in batching.
     *
     * @param file The file to upload
     * @param progress A callback function which can be used to track the progress of the upload
     * @param chunkSize The size of each file slice, in bytes (default: 10485760)
     */
    File.prototype.setContentChunked = function (file, progress, chunkSize) {
        var _this = this;
        if (chunkSize === void 0) { chunkSize = 10485760; }
        if (typeof progress === "undefined") {
            progress = function () { return null; };
        }
        var fileSize = file.size;
        var blockCount = parseInt((file.size / chunkSize).toString(), 10) + ((file.size % chunkSize === 0) ? 1 : 0);
        var uploadId = util_1.Util.getGUID();
        // start the chain with the first fragment
        progress({ uploadId: uploadId, blockNumber: 1, chunkSize: chunkSize, currentPointer: 0, fileSize: fileSize, stage: "starting", totalBlocks: blockCount });
        var chain = this.startUpload(uploadId, file.slice(0, chunkSize));
        var _loop_1 = function (i) {
            chain = chain.then(function (pointer) {
                progress({ uploadId: uploadId, blockNumber: i, chunkSize: chunkSize, currentPointer: pointer, fileSize: fileSize, stage: "continue", totalBlocks: blockCount });
                return _this.continueUpload(uploadId, pointer, file.slice(pointer, pointer + chunkSize));
            });
        };
        // skip the first and last blocks
        for (var i = 2; i < blockCount; i++) {
            _loop_1(i);
        }
        return chain.then(function (pointer) {
            progress({ uploadId: uploadId, blockNumber: blockCount, chunkSize: chunkSize, currentPointer: pointer, fileSize: fileSize, stage: "finishing", totalBlocks: blockCount });
            return _this.finishUpload(uploadId, pointer, file.slice(pointer));
        });
    };
    /**
     * Starts a new chunk upload session and uploads the first fragment.
     * The current file content is not changed when this method completes.
     * The method is idempotent (and therefore does not change the result) as long as you use the same values for uploadId and stream.
     * The upload session ends either when you use the CancelUpload method or when you successfully
     * complete the upload session by passing the rest of the file contents through the ContinueUpload and FinishUpload methods.
     * The StartUpload and ContinueUpload methods return the size of the running total of uploaded data in bytes,
     * so you can pass those return values to subsequent uses of ContinueUpload and FinishUpload.
     * This method is currently available only on Office 365.
     *
     * @param uploadId The unique identifier of the upload session.
     * @param fragment The file contents.
     * @returns The size of the total uploaded data in bytes.
     */
    File.prototype.startUpload = function (uploadId, fragment) {
        return this.clone(File, "startUpload(uploadId=guid'" + uploadId + "')", false)
            .postAsCore({ body: fragment })
            .then(function (n) {
            // When OData=verbose the payload has the following shape:
            // { StartUpload: "10485760" }
            if (typeof n === "object") {
                n = n.StartUpload;
            }
            return parseFloat(n);
        });
    };
    /**
     * Continues the chunk upload session with an additional fragment.
     * The current file content is not changed.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     *
     * @param uploadId The unique identifier of the upload session.
     * @param fileOffset The size of the offset into the file where the fragment starts.
     * @param fragment The file contents.
     * @returns The size of the total uploaded data in bytes.
     */
    File.prototype.continueUpload = function (uploadId, fileOffset, fragment) {
        return this.clone(File, "continueUpload(uploadId=guid'" + uploadId + "',fileOffset=" + fileOffset + ")", false)
            .postAsCore({ body: fragment })
            .then(function (n) {
            // When OData=verbose the payload has the following shape:
            // { ContinueUpload: "20971520" }
            if (typeof n === "object") {
                n = n.ContinueUpload;
            }
            return parseFloat(n);
        });
    };
    /**
     * Uploads the last file fragment and commits the file. The current file content is changed when this method completes.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     *
     * @param uploadId The unique identifier of the upload session.
     * @param fileOffset The size of the offset into the file where the fragment starts.
     * @param fragment The file contents.
     * @returns The newly uploaded file.
     */
    File.prototype.finishUpload = function (uploadId, fileOffset, fragment) {
        return this.clone(File, "finishUpload(uploadId=guid'" + uploadId + "',fileOffset=" + fileOffset + ")", false)
            .postAsCore({ body: fragment })
            .then(function (response) {
            return {
                data: response,
                file: new File(response.ServerRelativeUrl),
            };
        });
    };
    return File;
}(sharepointqueryableshareable_1.SharePointQueryableShareableFile));
exports.File = File;
/**
 * Describes a collection of Version objects
 *
 */
var Versions = /** @class */ (function (_super) {
    __extends(Versions, _super);
    /**
     * Creates a new instance of the File class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Versions(baseUrl, path) {
        if (path === void 0) { path = "versions"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a version by id
     *
     * @param versionId The id of the version to retrieve
     */
    Versions.prototype.getById = function (versionId) {
        var v = new Version(this);
        v.concat("(" + versionId + ")");
        return v;
    };
    /**
     * Deletes all the file version objects in the collection.
     *
     */
    Versions.prototype.deleteAll = function () {
        return new Versions(this, "deleteAll").postCore();
    };
    /**
     * Deletes the specified version of the file.
     *
     * @param versionId The ID of the file version to delete.
     */
    Versions.prototype.deleteById = function (versionId) {
        return this.clone(Versions, "deleteById(vid=" + versionId + ")").postCore();
    };
    /**
     * Recycles the specified version of the file.
     *
     * @param versionId The ID of the file version to delete.
     */
    Versions.prototype.recycleByID = function (versionId) {
        return this.clone(Versions, "recycleByID(vid=" + versionId + ")").postCore();
    };
    /**
     * Deletes the file version object with the specified version label.
     *
     * @param label The version label of the file version to delete, for example: 1.2
     */
    Versions.prototype.deleteByLabel = function (label) {
        return this.clone(Versions, "deleteByLabel(versionlabel='" + label + "')").postCore();
    };
    /**
     * REcycles the file version object with the specified version label.
     *
     * @param label The version label of the file version to delete, for example: 1.2
     */
    Versions.prototype.recycleByLabel = function (label) {
        return this.clone(Versions, "recycleByLabel(versionlabel='" + label + "')").postCore();
    };
    /**
     * Creates a new file version from the file specified by the version label.
     *
     * @param label The version label of the file version to restore, for example: 1.2
     */
    Versions.prototype.restoreByLabel = function (label) {
        return this.clone(Versions, "restoreByLabel(versionlabel='" + label + "')").postCore();
    };
    return Versions;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Versions = Versions;
/**
 * Describes a single Version instance
 *
 */
var Version = /** @class */ (function (_super) {
    __extends(Version, _super);
    function Version() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
    * Delete a specific version of a file.
    *
    * @param eTag Value used in the IF-Match header, by default "*"
    */
    Version.prototype.delete = function (eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return this.postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    /**
     * Opens the file as a stream.
     */
    Version.prototype.openBinaryStream = function () {
        return this.clone(Version, "openBinaryStream").postCore();
    };
    return Version;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.Version = Version;
var CheckinType;
(function (CheckinType) {
    CheckinType[CheckinType["Minor"] = 0] = "Minor";
    CheckinType[CheckinType["Major"] = 1] = "Major";
    CheckinType[CheckinType["Overwrite"] = 2] = "Overwrite";
})(CheckinType = exports.CheckinType || (exports.CheckinType = {}));
var WebPartsPersonalizationScope;
(function (WebPartsPersonalizationScope) {
    WebPartsPersonalizationScope[WebPartsPersonalizationScope["User"] = 0] = "User";
    WebPartsPersonalizationScope[WebPartsPersonalizationScope["Shared"] = 1] = "Shared";
})(WebPartsPersonalizationScope = exports.WebPartsPersonalizationScope || (exports.WebPartsPersonalizationScope = {}));
var MoveOperations;
(function (MoveOperations) {
    MoveOperations[MoveOperations["Overwrite"] = 1] = "Overwrite";
    MoveOperations[MoveOperations["AllowBrokenThickets"] = 8] = "AllowBrokenThickets";
})(MoveOperations = exports.MoveOperations || (exports.MoveOperations = {}));
var TemplateFileType;
(function (TemplateFileType) {
    TemplateFileType[TemplateFileType["StandardPage"] = 0] = "StandardPage";
    TemplateFileType[TemplateFileType["WikiPage"] = 1] = "WikiPage";
    TemplateFileType[TemplateFileType["FormPage"] = 2] = "FormPage";
    TemplateFileType[TemplateFileType["ClientSidePage"] = 3] = "ClientSidePage";
})(TemplateFileType = exports.TemplateFileType || (exports.TemplateFileType = {}));


/***/ }),

/***/ "Mvka":
/*!******************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/configuration/pnplibconfig.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetchclient_1 = __webpack_require__(/*! ../net/fetchclient */ "UTMP");
var RuntimeConfigImpl = /** @class */ (function () {
    function RuntimeConfigImpl() {
        // these are our default values for the library
        this._defaultCachingStore = "session";
        this._defaultCachingTimeoutSeconds = 60;
        this._globalCacheDisable = false;
        this._enableCacheExpiration = false;
        this._cacheExpirationIntervalMilliseconds = 750;
        this._spfxContext = null;
        // sharepoint settings
        this._spFetchClientFactory = function () { return new fetchclient_1.FetchClient(); };
        this._spBaseUrl = null;
        this._spHeaders = null;
        // ms graph settings
        this._graphHeaders = null;
        this._graphFetchClientFactory = function () { return null; };
    }
    RuntimeConfigImpl.prototype.set = function (config) {
        var _this = this;
        if (config.hasOwnProperty("globalCacheDisable")) {
            this._globalCacheDisable = config.globalCacheDisable;
        }
        if (config.hasOwnProperty("defaultCachingStore")) {
            this._defaultCachingStore = config.defaultCachingStore;
        }
        if (config.hasOwnProperty("defaultCachingTimeoutSeconds")) {
            this._defaultCachingTimeoutSeconds = config.defaultCachingTimeoutSeconds;
        }
        if (config.hasOwnProperty("sp")) {
            if (config.sp.hasOwnProperty("fetchClientFactory")) {
                this._spFetchClientFactory = config.sp.fetchClientFactory;
            }
            if (config.sp.hasOwnProperty("baseUrl")) {
                this._spBaseUrl = config.sp.baseUrl;
            }
            if (config.sp.hasOwnProperty("headers")) {
                this._spHeaders = config.sp.headers;
            }
        }
        if (config.hasOwnProperty("spfxContext")) {
            this._spfxContext = config.spfxContext;
            if (typeof this._spfxContext.graphHttpClient !== "undefined") {
                this._graphFetchClientFactory = function () { return _this._spfxContext.graphHttpClient; };
            }
        }
        if (config.hasOwnProperty("graph")) {
            if (config.graph.hasOwnProperty("headers")) {
                this._graphHeaders = config.graph.headers;
            }
            // this comes after the default setting of the _graphFetchClientFactory client so it can be overwritten
            if (config.graph.hasOwnProperty("fetchClientFactory")) {
                this._graphFetchClientFactory = config.graph.fetchClientFactory;
            }
        }
        if (config.hasOwnProperty("enableCacheExpiration")) {
            this._enableCacheExpiration = config.enableCacheExpiration;
        }
        if (config.hasOwnProperty("cacheExpirationIntervalMilliseconds")) {
            // we don't let the interval be less than 300 milliseconds
            var interval = config.cacheExpirationIntervalMilliseconds < 300 ? 300 : config.cacheExpirationIntervalMilliseconds;
            this._cacheExpirationIntervalMilliseconds = interval;
        }
    };
    Object.defineProperty(RuntimeConfigImpl.prototype, "defaultCachingStore", {
        get: function () {
            return this._defaultCachingStore;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "defaultCachingTimeoutSeconds", {
        get: function () {
            return this._defaultCachingTimeoutSeconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "globalCacheDisable", {
        get: function () {
            return this._globalCacheDisable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "spFetchClientFactory", {
        get: function () {
            return this._spFetchClientFactory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "spBaseUrl", {
        get: function () {
            if (this._spBaseUrl !== null) {
                return this._spBaseUrl;
            }
            else if (this._spfxContext !== null) {
                return this._spfxContext.pageContext.web.absoluteUrl;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "spHeaders", {
        get: function () {
            return this._spHeaders;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "enableCacheExpiration", {
        get: function () {
            return this._enableCacheExpiration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "cacheExpirationIntervalMilliseconds", {
        get: function () {
            return this._cacheExpirationIntervalMilliseconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "spfxContext", {
        get: function () {
            return this._spfxContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "graphFetchClientFactory", {
        get: function () {
            return this._graphFetchClientFactory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeConfigImpl.prototype, "graphHeaders", {
        get: function () {
            return this._graphHeaders;
        },
        enumerable: true,
        configurable: true
    });
    return RuntimeConfigImpl;
}());
exports.RuntimeConfigImpl = RuntimeConfigImpl;
var _runtimeConfig = new RuntimeConfigImpl();
exports.RuntimeConfig = _runtimeConfig;
function setRuntimeConfig(config) {
    _runtimeConfig.set(config);
}
exports.setRuntimeConfig = setRuntimeConfig;


/***/ }),

/***/ "NTTg":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/items/list.js ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _lists_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lists/types.js */ "hy0S");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ "3DT9");



Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_0__["addProp"])(_lists_types_js__WEBPACK_IMPORTED_MODULE_1__["_List"], "items", _types_js__WEBPACK_IMPORTED_MODULE_2__["Items"]);
//# sourceMappingURL=list.js.map

/***/ }),

/***/ "O+G+":
/*!***********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/conversations.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
var attachments_1 = __webpack_require__(/*! ./attachments */ "3Yu8");
var Conversations = /** @class */ (function (_super) {
    __extends(Conversations, _super);
    function Conversations(baseUrl, path) {
        if (path === void 0) { path = "conversations"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Create a new conversation by including a thread and a post.
     *
     * @param properties Properties used to create the new conversation
     */
    Conversations.prototype.add = function (properties) {
        return this.postCore({
            body: JSON.stringify(properties),
        });
    };
    /**
     * Gets a conversation from this collection by id
     *
     * @param id Group member's id
     */
    Conversations.prototype.getById = function (id) {
        return new Conversation(this, id);
    };
    return Conversations;
}(graphqueryable_1.GraphQueryableCollection));
exports.Conversations = Conversations;
var Threads = /** @class */ (function (_super) {
    __extends(Threads, _super);
    function Threads(baseUrl, path) {
        if (path === void 0) { path = "threads"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a thread from this collection by id
     *
     * @param id Group member's id
     */
    Threads.prototype.getById = function (id) {
        return new Thread(this, id);
    };
    /**
     * Adds a new thread to this collection
     *
     * @param properties properties used to create the new thread
     * @returns Id of the new thread
     */
    Threads.prototype.add = function (properties) {
        return this.postCore({
            body: JSON.stringify(properties),
        });
    };
    return Threads;
}(graphqueryable_1.GraphQueryableCollection));
exports.Threads = Threads;
var Posts = /** @class */ (function (_super) {
    __extends(Posts, _super);
    function Posts(baseUrl, path) {
        if (path === void 0) { path = "posts"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a thread from this collection by id
     *
     * @param id Group member's id
     */
    Posts.prototype.getById = function (id) {
        return new Post(this, id);
    };
    /**
     * Adds a new thread to this collection
     *
     * @param properties properties used to create the new thread
     * @returns Id of the new thread
     */
    Posts.prototype.add = function (properties) {
        return this.postCore({
            body: JSON.stringify(properties),
        });
    };
    return Posts;
}(graphqueryable_1.GraphQueryableCollection));
exports.Posts = Posts;
var Conversation = /** @class */ (function (_super) {
    __extends(Conversation, _super);
    function Conversation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Conversation.prototype, "threads", {
        /**
         * Get all the threads in a group conversation.
         */
        get: function () {
            return new Threads(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates this conversation
     */
    Conversation.prototype.update = function (properties) {
        return this.patchCore({
            body: JSON.stringify(properties),
        });
    };
    /**
     * Deletes this member from the group
     */
    Conversation.prototype.delete = function () {
        return this.deleteCore();
    };
    return Conversation;
}(graphqueryable_1.GraphQueryableInstance));
exports.Conversation = Conversation;
var Thread = /** @class */ (function (_super) {
    __extends(Thread, _super);
    function Thread() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Thread.prototype, "posts", {
        /**
         * Get all the threads in a group conversation.
         */
        get: function () {
            return new Posts(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Reply to a thread in a group conversation and add a new post to it
     *
     * @param post Contents of the post
     */
    Thread.prototype.reply = function (post) {
        return this.clone(Thread, "reply").postCore({
            body: JSON.stringify({
                post: post,
            }),
        });
    };
    /**
     * Deletes this member from the group
     */
    Thread.prototype.delete = function () {
        return this.deleteCore();
    };
    return Thread;
}(graphqueryable_1.GraphQueryableInstance));
exports.Thread = Thread;
var Post = /** @class */ (function (_super) {
    __extends(Post, _super);
    function Post() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Post.prototype, "attachments", {
        get: function () {
            return new attachments_1.Attachments(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Deletes this post
     */
    Post.prototype.delete = function () {
        return this.deleteCore();
    };
    /**
     * Forward a post to a recipient
     */
    Post.prototype.forward = function (info) {
        return this.clone(Post, "forward").postCore({
            body: JSON.stringify(info),
        });
    };
    /**
     * Reply to a thread in a group conversation and add a new post to it
     *
     * @param post Contents of the post
     */
    Post.prototype.reply = function (post) {
        return this.clone(Post, "reply").postCore({
            body: JSON.stringify({
                post: post,
            }),
        });
    };
    return Post;
}(graphqueryable_1.GraphQueryableInstance));
exports.Post = Post;
var Senders = /** @class */ (function (_super) {
    __extends(Senders, _super);
    function Senders(baseUrl, path) {
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Add a new user or group to this senders collection
     * @param id The full @odata.id value to add (ex: https://graph.microsoft.com/v1.0/users/user@contoso.com)
     */
    Senders.prototype.add = function (id) {
        return this.clone(Senders, "$ref").postCore({
            body: JSON.stringify({
                "@odata.id": id,
            }),
        });
    };
    /**
     * Removes the entity from the collection
     *
     * @param id The full @odata.id value to remove (ex: https://graph.microsoft.com/v1.0/users/user@contoso.com)
     */
    Senders.prototype.remove = function (id) {
        var remover = this.clone(Senders, "$ref");
        remover.query.add("$id", id);
        return remover.deleteCore();
    };
    return Senders;
}(graphqueryable_1.GraphQueryableCollection));
exports.Senders = Senders;


/***/ }),

/***/ "P6J3":
/*!*************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/appcatalog.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var files_1 = __webpack_require__(/*! ./files */ "MMX7");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Represents an app catalog
 */
var AppCatalog = /** @class */ (function (_super) {
    __extends(AppCatalog, _super);
    function AppCatalog(baseUrl, path) {
        if (path === void 0) { path = "_api/web/tenantappcatalog/AvailableApps"; }
        var _this = this;
        // we need to handle the case of getting created from something that already has "_api/..." or does not
        var candidateUrl = "";
        if (typeof baseUrl === "string") {
            candidateUrl = baseUrl;
        }
        else if (typeof baseUrl !== "undefined") {
            candidateUrl = baseUrl.toUrl();
        }
        _this = _super.call(this, util_1.extractWebUrl(candidateUrl), path) || this;
        return _this;
    }
    /**
     * Get details of specific app from the app catalog
     * @param id - Specify the guid of the app
     */
    AppCatalog.prototype.getAppById = function (id) {
        return new App(this, "getById('" + id + "')");
    };
    /**
     * Uploads an app package. Not supported for batching
     *
     * @param filename Filename to create.
     * @param content app package data (eg: the .app or .sppkg file).
     * @param shouldOverWrite Should an app with the same name in the same location be overwritten? (default: true)
     * @returns Promise<AppAddResult>
     */
    AppCatalog.prototype.add = function (filename, content, shouldOverWrite) {
        if (shouldOverWrite === void 0) { shouldOverWrite = true; }
        // you don't add to the availableapps collection
        var adder = new AppCatalog(util_1.extractWebUrl(this.toUrl()), "_api/web/tenantappcatalog/add(overwrite=" + shouldOverWrite + ",url='" + filename + "')");
        return adder.postCore({
            body: content,
        }).then(function (r) {
            return {
                data: r,
                file: new files_1.File(odata_1.spExtractODataId(r)),
            };
        });
    };
    return AppCatalog;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.AppCatalog = AppCatalog;
/**
 * Represents the actions you can preform on a given app within the catalog
 */
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * This method deploys an app on the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    App.prototype.deploy = function () {
        return this.clone(App, "Deploy").postCore();
    };
    /**
     * This method retracts a deployed app on the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    App.prototype.retract = function () {
        return this.clone(App, "Retract").postCore();
    };
    /**
     * This method allows an app which is already deployed to be installed on a web
     */
    App.prototype.install = function () {
        return this.clone(App, "Install").postCore();
    };
    /**
     * This method allows an app which is already insatlled to be uninstalled on a web
     */
    App.prototype.uninstall = function () {
        return this.clone(App, "Uninstall").postCore();
    };
    /**
     * This method allows an app which is already insatlled to be upgraded on a web
     */
    App.prototype.upgrade = function () {
        return this.clone(App, "Upgrade").postCore();
    };
    /**
     * This method removes an app from the app catalog.  It must be called in the context
     * of the tenant app catalog web or it will fail.
     */
    App.prototype.remove = function () {
        return this.clone(App, "Remove").postCore();
    };
    return App;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.App = App;


/***/ }),

/***/ "PbI0":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/batch.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var logging_1 = __webpack_require__(/*! ../utils/logging */ "2C3z");
var httpclient_1 = __webpack_require__(/*! ../net/httpclient */ "KjMO");
var utils_1 = __webpack_require__(/*! ../net/utils */ "KJz+");
var pnplibconfig_1 = __webpack_require__(/*! ../configuration/pnplibconfig */ "Mvka");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
/**
 * Manages a batch of OData operations
 */
var ODataBatch = /** @class */ (function () {
    function ODataBatch(baseUrl, _batchId) {
        if (_batchId === void 0) { _batchId = util_1.Util.getGUID(); }
        this.baseUrl = baseUrl;
        this._batchId = _batchId;
        this._requests = [];
        this._dependencies = [];
    }
    /**
     * Parses the response from a batch request into an array of Response instances
     *
     * @param body Text body of the response from the batch request
     */
    ODataBatch.ParseResponse = function (body) {
        return new Promise(function (resolve, reject) {
            var responses = [];
            var header = "--batchresponse_";
            // Ex. "HTTP/1.1 500 Internal Server Error"
            var statusRegExp = new RegExp("^HTTP/[0-9.]+ +([0-9]+) +(.*)", "i");
            var lines = body.split("\n");
            var state = "batch";
            var status;
            var statusText;
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i];
                switch (state) {
                    case "batch":
                        if (line.substr(0, header.length) === header) {
                            state = "batchHeaders";
                        }
                        else {
                            if (line.trim() !== "") {
                                throw new exceptions_1.BatchParseException("Invalid response, line " + i);
                            }
                        }
                        break;
                    case "batchHeaders":
                        if (line.trim() === "") {
                            state = "status";
                        }
                        break;
                    case "status":
                        var parts = statusRegExp.exec(line);
                        if (parts.length !== 3) {
                            throw new exceptions_1.BatchParseException("Invalid status, line " + i);
                        }
                        status = parseInt(parts[1], 10);
                        statusText = parts[2];
                        state = "statusHeaders";
                        break;
                    case "statusHeaders":
                        if (line.trim() === "") {
                            state = "body";
                        }
                        break;
                    case "body":
                        responses.push((status === 204) ? new Response() : new Response(line, { status: status, statusText: statusText }));
                        state = "batch";
                        break;
                }
            }
            if (state !== "status") {
                reject(new exceptions_1.BatchParseException("Unexpected end of input"));
            }
            resolve(responses);
        });
    };
    Object.defineProperty(ODataBatch.prototype, "batchId", {
        get: function () {
            return this._batchId;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a request to a batch (not designed for public use)
     *
     * @param url The full url of the request
     * @param method The http method GET, POST, etc
     * @param options Any options to include in the request
     * @param parser The parser that will hadle the results of the request
     */
    ODataBatch.prototype.add = function (url, method, options, parser) {
        var info = {
            method: method.toUpperCase(),
            options: options,
            parser: parser,
            reject: null,
            resolve: null,
            url: url,
        };
        var p = new Promise(function (resolve, reject) {
            info.resolve = resolve;
            info.reject = reject;
        });
        this._requests.push(info);
        return p;
    };
    /**
     * Adds a dependency insuring that some set of actions will occur before a batch is processed.
     * MUST be cleared using the returned resolve delegate to allow batches to run
     */
    ODataBatch.prototype.addDependency = function () {
        var resolver;
        var promise = new Promise(function (resolve) {
            resolver = resolve;
        });
        this._dependencies.push(promise);
        return resolver;
    };
    /**
     * Execute the current batch and resolve the associated promises
     *
     * @returns A promise which will be resolved once all of the batch's child promises have resolved
     */
    ODataBatch.prototype.execute = function () {
        var _this = this;
        // we need to check the dependencies twice due to how different engines handle things.
        // We can get a second set of promises added after the first set resolve
        return Promise.all(this._dependencies).then(function () { return Promise.all(_this._dependencies); }).then(function () { return _this.executeImpl(); });
    };
    ODataBatch.prototype.executeImpl = function () {
        var _this = this;
        logging_1.Logger.write("[" + this.batchId + "] (" + (new Date()).getTime() + ") Executing batch with " + this._requests.length + " requests.", logging_1.LogLevel.Info);
        // if we don't have any requests, don't bother sending anything
        // this could be due to caching further upstream, or just an empty batch
        if (this._requests.length < 1) {
            logging_1.Logger.write("Resolving empty batch.", logging_1.LogLevel.Info);
            return Promise.resolve();
        }
        // creating the client here allows the url to be populated for nodejs client as well as potentially
        // any other hacks needed for other types of clients. Essentially allows the absoluteRequestUrl
        // below to be correct
        var client = new httpclient_1.HttpClient();
        // due to timing we need to get the absolute url here so we can use it for all the individual requests
        // and for sending the entire batch
        return util_1.Util.toAbsoluteUrl(this.baseUrl).then(function (absoluteRequestUrl) {
            // build all the requests, send them, pipe results in order to parsers
            var batchBody = [];
            var currentChangeSetId = "";
            for (var i = 0; i < _this._requests.length; i++) {
                var reqInfo = _this._requests[i];
                if (reqInfo.method === "GET") {
                    if (currentChangeSetId.length > 0) {
                        // end an existing change set
                        batchBody.push("--changeset_" + currentChangeSetId + "--\n\n");
                        currentChangeSetId = "";
                    }
                    batchBody.push("--batch_" + _this._batchId + "\n");
                }
                else {
                    if (currentChangeSetId.length < 1) {
                        // start new change set
                        currentChangeSetId = util_1.Util.getGUID();
                        batchBody.push("--batch_" + _this._batchId + "\n");
                        batchBody.push("Content-Type: multipart/mixed; boundary=\"changeset_" + currentChangeSetId + "\"\n\n");
                    }
                    batchBody.push("--changeset_" + currentChangeSetId + "\n");
                }
                // common batch part prefix
                batchBody.push("Content-Type: application/http\n");
                batchBody.push("Content-Transfer-Encoding: binary\n\n");
                var headers = new Headers();
                // this is the url of the individual request within the batch
                var url = util_1.Util.isUrlAbsolute(reqInfo.url) ? reqInfo.url : util_1.Util.combinePaths(absoluteRequestUrl, reqInfo.url);
                logging_1.Logger.write("[" + _this.batchId + "] (" + (new Date()).getTime() + ") Adding request " + reqInfo.method + " " + url + " to batch.", logging_1.LogLevel.Verbose);
                if (reqInfo.method !== "GET") {
                    var method = reqInfo.method;
                    if (reqInfo.hasOwnProperty("options") && reqInfo.options.hasOwnProperty("headers") && typeof reqInfo.options.headers["X-HTTP-Method"] !== "undefined") {
                        method = reqInfo.options.headers["X-HTTP-Method"];
                        delete reqInfo.options.headers["X-HTTP-Method"];
                    }
                    batchBody.push(method + " " + url + " HTTP/1.1\n");
                    headers.set("Content-Type", "application/json;odata=verbose;charset=utf-8");
                }
                else {
                    batchBody.push(reqInfo.method + " " + url + " HTTP/1.1\n");
                }
                // merge global config headers
                utils_1.mergeHeaders(headers, pnplibconfig_1.RuntimeConfig.spHeaders);
                // merge per-request headers
                if (reqInfo.options) {
                    utils_1.mergeHeaders(headers, reqInfo.options.headers);
                }
                // lastly we apply any default headers we need that may not exist
                if (!headers.has("Accept")) {
                    headers.append("Accept", "application/json");
                }
                if (!headers.has("Content-Type")) {
                    headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
                }
                if (!headers.has("X-ClientService-ClientTag")) {
                    headers.append("X-ClientService-ClientTag", "PnPCoreJS:3.0.10");
                }
                // write headers into batch body
                headers.forEach(function (value, name) {
                    batchBody.push(name + ": " + value + "\n");
                });
                batchBody.push("\n");
                if (reqInfo.options.body) {
                    batchBody.push(reqInfo.options.body + "\n\n");
                }
            }
            if (currentChangeSetId.length > 0) {
                // Close the changeset
                batchBody.push("--changeset_" + currentChangeSetId + "--\n\n");
                currentChangeSetId = "";
            }
            batchBody.push("--batch_" + _this._batchId + "--\n");
            var batchHeaders = {
                "Content-Type": "multipart/mixed; boundary=batch_" + _this._batchId,
            };
            var batchOptions = {
                "body": batchBody.join(""),
                "headers": batchHeaders,
                "method": "POST",
            };
            logging_1.Logger.write("[" + _this.batchId + "] (" + (new Date()).getTime() + ") Sending batch request.", logging_1.LogLevel.Info);
            return client.fetch(util_1.Util.combinePaths(absoluteRequestUrl, "/_api/$batch"), batchOptions)
                .then(function (r) { return r.text(); })
                .then(ODataBatch.ParseResponse)
                .then(function (responses) {
                if (responses.length !== _this._requests.length) {
                    throw new exceptions_1.BatchParseException("Could not properly parse responses to match requests in batch.");
                }
                logging_1.Logger.write("[" + _this.batchId + "] (" + (new Date()).getTime() + ") Resolving batched requests.", logging_1.LogLevel.Info);
                return responses.reduce(function (chain, response, index) {
                    var request = _this._requests[index];
                    logging_1.Logger.write("[" + _this.batchId + "] (" + (new Date()).getTime() + ") Resolving batched request " + request.method + " " + request.url + ".", logging_1.LogLevel.Verbose);
                    return chain.then(function (_) { return request.parser.parse(response).then(request.resolve).catch(request.reject); });
                }, Promise.resolve());
            });
        });
    };
    return ODataBatch;
}());
exports.ODataBatch = ODataBatch;


/***/ }),

/***/ "RIUW":
/*!******************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/attachmentfiles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var parsers_1 = __webpack_require__(/*! ../odata/parsers */ "eGqj");
/**
 * Describes a collection of Item objects
 *
 */
var AttachmentFiles = /** @class */ (function (_super) {
    __extends(AttachmentFiles, _super);
    /**
     * Creates a new instance of the AttachmentFiles class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this attachments collection
     */
    function AttachmentFiles(baseUrl, path) {
        if (path === void 0) { path = "AttachmentFiles"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a Attachment File by filename
     *
     * @param name The name of the file, including extension.
     */
    AttachmentFiles.prototype.getByName = function (name) {
        var f = new AttachmentFile(this);
        f.concat("('" + name + "')");
        return f;
    };
    /**
     * Adds a new attachment to the collection. Not supported for batching.
     *
     * @param name The name of the file, including extension.
     * @param content The Base64 file content.
     */
    AttachmentFiles.prototype.add = function (name, content) {
        var _this = this;
        return this.clone(AttachmentFiles, "add(FileName='" + name + "')", false).postCore({
            body: content,
        }).then(function (response) {
            return {
                data: response,
                file: _this.getByName(name),
            };
        });
    };
    /**
     * Adds multiple new attachment to the collection. Not supported for batching.
     *
     * @files name The collection of files to add
     */
    AttachmentFiles.prototype.addMultiple = function (files) {
        var _this = this;
        // add the files in series so we don't get update conflicts
        return files.reduce(function (chain, file) { return chain.then(function () { return _this.clone(AttachmentFiles, "add(FileName='" + file.name + "')", false).postCore({
            body: file.content,
        }); }); }, Promise.resolve());
    };
    /**
     * Delete multiple attachments from the collection. Not supported for batching.
     *
     * @files name The collection of files to delete
     */
    AttachmentFiles.prototype.deleteMultiple = function () {
        var _this = this;
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        return files.reduce(function (chain, file) { return chain.then(function () { return _this.getByName(file).delete(); }); }, Promise.resolve());
    };
    /**
     * Delete multiple attachments from the collection and sends it to recycle bin. Not supported for batching.
     *
     * @files name The collection of files to delete
     */
    AttachmentFiles.prototype.recycleMultiple = function () {
        var _this = this;
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        return files.reduce(function (chain, file) { return chain.then(function () { return _this.getByName(file).recycle(); }); }, Promise.resolve());
    };
    return AttachmentFiles;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.AttachmentFiles = AttachmentFiles;
/**
 * Describes a single attachment file instance
 *
 */
var AttachmentFile = /** @class */ (function (_super) {
    __extends(AttachmentFile, _super);
    function AttachmentFile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets the contents of the file as text
     *
     */
    AttachmentFile.prototype.getText = function () {
        return this.clone(AttachmentFile, "$value", false).get(new parsers_1.TextFileParser());
    };
    /**
     * Gets the contents of the file as a blob, does not work in Node.js
     *
     */
    AttachmentFile.prototype.getBlob = function () {
        return this.clone(AttachmentFile, "$value", false).get(new parsers_1.BlobFileParser());
    };
    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    AttachmentFile.prototype.getBuffer = function () {
        return this.clone(AttachmentFile, "$value", false).get(new parsers_1.BufferFileParser());
    };
    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    AttachmentFile.prototype.getJSON = function () {
        return this.clone(AttachmentFile, "$value", false).get(new parsers_1.JSONFileParser());
    };
    /**
     * Sets the content of a file. Not supported for batching
     *
     * @param content The value to set for the file contents
     */
    AttachmentFile.prototype.setContent = function (content) {
        var _this = this;
        return this.clone(AttachmentFile, "$value", false).postCore({
            body: content,
            headers: {
                "X-HTTP-Method": "PUT",
            },
        }).then(function (_) { return new AttachmentFile(_this); });
    };
    /**
     * Delete this attachment file
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    AttachmentFile.prototype.delete = function (eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return this.postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    /**
     * Delete this attachment file and send it to Recycle Bin
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    AttachmentFile.prototype.recycle = function (eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return this.clone(AttachmentFile, "recycleObject").postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    return AttachmentFile;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.AttachmentFile = AttachmentFile;


/***/ }),

/***/ "RVWl":
/*!******************************************!*\
  !*** external "CrudPnpjsWebPartStrings" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_RVWl__;

/***/ }),

/***/ "SQg3":
/*!******************************************!*\
  !*** ./node_modules/@pnp/odata/batch.js ***!
  \******************************************/
/*! exports provided: Batch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Batch", function() { return Batch; });
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/common */ "zqEK");

var Batch = /** @class */ (function () {
    function Batch(_batchId) {
        if (_batchId === void 0) { _batchId = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_0__["getGUID"])(); }
        this._batchId = _batchId;
        this._reqs = [];
        this._deps = [];
        this._rDeps = [];
        this._index = -1;
    }
    Object.defineProperty(Batch.prototype, "batchId", {
        get: function () {
            return this._batchId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Batch.prototype, "requests", {
        /**
         * The requests contained in this batch
         */
        get: function () {
            // we sort these each time this is accessed
            return this._reqs.sort(function (info1, info2) { return info1.index - info2.index; });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Not meant for use directly
     *
     * @param batchee The IQueryable for this batch to track in order
     */
    Batch.prototype.track = function (batchee) {
        batchee.data.batch = this;
        // we need to track the order requests are added to the batch to ensure we always
        // operate on them in order
        if (typeof batchee.data.batchIndex === "undefined" || batchee.data.batchIndex < 0) {
            batchee.data.batchIndex = ++this._index;
        }
    };
    /**
     * Adds the given request context to the batch for execution
     *
     * @param context Details of the request to batch
     */
    Batch.prototype.add = function (context) {
        var info = {
            id: context.requestId,
            index: context.batchIndex,
            method: context.method.toUpperCase(),
            options: context.options,
            parser: context.parser,
            reject: null,
            resolve: null,
            url: context.url,
        };
        // we create a new promise that will be resolved within the batch
        var p = new Promise(function (resolve, reject) {
            info.resolve = resolve;
            info.reject = reject;
        });
        this._reqs.push(info);
        return p;
    };
    /**
     * Adds a dependency insuring that some set of actions will occur before a batch is processed.
     * MUST be cleared using the returned resolve delegate to allow batches to run
     */
    Batch.prototype.addDependency = function () {
        var resolver = function () { return void (0); };
        this._deps.push(new Promise(function (resolve) {
            resolver = resolve;
        }));
        return resolver;
    };
    /**
     * The batch's execute method will not resolve util any promises added here resolve
     *
     * @param p The dependent promise
     */
    Batch.prototype.addResolveBatchDependency = function (p) {
        this._rDeps.push(p);
    };
    /**
     * Execute the current batch and resolve the associated promises
     *
     * @returns A promise which will be resolved once all of the batch's child promises have resolved
     */
    Batch.prototype.execute = function () {
        var _this = this;
        // we need to check the dependencies twice due to how different engines handle things.
        // We can get a second set of promises added during the first set resolving
        return Promise.all(this._deps)
            .then(function () { return Promise.all(_this._deps); })
            .then(function () { return _this.executeImpl(); })
            .then(function () { return Promise.all(_this._rDeps); })
            .then(function () { return void (0); });
    };
    return Batch;
}());

//# sourceMappingURL=batch.js.map

/***/ }),

/***/ "StVt":
/*!****************************!*\
  !*** external "bootstrap" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_StVt__;

/***/ }),

/***/ "TT1A":
/*!*********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/fields.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var types_1 = __webpack_require__(/*! ./types */ "z9XP");
/**
 * Describes a collection of Field objects
 *
 */
var Fields = /** @class */ (function (_super) {
    __extends(Fields, _super);
    /**
     * Creates a new instance of the Fields class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Fields(baseUrl, path) {
        if (path === void 0) { path = "fields"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a field from the collection by title
     *
     * @param title The case-sensitive title of the field
     */
    Fields.prototype.getByTitle = function (title) {
        return new Field(this, "getByTitle('" + title + "')");
    };
    /**
     * Gets a field from the collection by using internal name or title
     *
     * @param name The case-sensitive internal name or title of the field
     */
    Fields.prototype.getByInternalNameOrTitle = function (name) {
        return new Field(this, "getByInternalNameOrTitle('" + name + "')");
    };
    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the list
     */
    Fields.prototype.getById = function (id) {
        var f = new Field(this);
        f.concat("('" + id + "')");
        return f;
    };
    /**
     * Creates a field based on the specified schema
     */
    Fields.prototype.createFieldAsXml = function (xml) {
        var _this = this;
        var info;
        if (typeof xml === "string") {
            info = { SchemaXml: xml };
        }
        else {
            info = xml;
        }
        var postBody = JSON.stringify({
            "parameters": util_1.Util.extend({
                "__metadata": {
                    "type": "SP.XmlSchemaFieldCreationInformation",
                },
            }, info),
        });
        return this.clone(Fields, "createfieldasxml").postAsCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                field: _this.getById(data.Id),
            };
        });
    };
    /**
     * Adds a new field to the collection
     *
     * @param title The new field's title
     * @param fieldType The new field's type (ex: SP.FieldText)
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.add = function (title, fieldType, properties) {
        var _this = this;
        var postBody = JSON.stringify(util_1.Util.extend({
            "Title": title,
            "__metadata": { "type": fieldType },
        }, properties));
        return this.clone(Fields, null).postAsCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                field: _this.getById(data.Id),
            };
        });
    };
    /**
     * Adds a new SP.FieldText to the collection
     *
     * @param title The field title
     * @param maxLength The maximum number of characters allowed in the value of the field.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.addText = function (title, maxLength, properties) {
        if (maxLength === void 0) { maxLength = 255; }
        var props = {
            FieldTypeKind: 2,
            MaxLength: maxLength,
        };
        return this.add(title, "SP.FieldText", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a new SP.FieldCalculated to the collection
     *
     * @param title The field title.
     * @param formula The formula for the field.
     * @param dateFormat The date and time format that is displayed in the field.
     * @param outputType Specifies the output format for the field. Represents a FieldType value.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.addCalculated = function (title, formula, dateFormat, outputType, properties) {
        if (outputType === void 0) { outputType = types_1.FieldTypes.Text; }
        var props = {
            DateFormat: dateFormat,
            FieldTypeKind: 17,
            Formula: formula,
            OutputType: outputType,
        };
        return this.add(title, "SP.FieldCalculated", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a new SP.FieldDateTime to the collection
     *
     * @param title The field title
     * @param displayFormat The format of the date and time that is displayed in the field.
     * @param calendarType Specifies the calendar type of the field.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.addDateTime = function (title, displayFormat, calendarType, friendlyDisplayFormat, properties) {
        if (displayFormat === void 0) { displayFormat = types_1.DateTimeFieldFormatType.DateOnly; }
        if (calendarType === void 0) { calendarType = types_1.CalendarType.Gregorian; }
        if (friendlyDisplayFormat === void 0) { friendlyDisplayFormat = 0; }
        var props = {
            DateTimeCalendarType: calendarType,
            DisplayFormat: displayFormat,
            FieldTypeKind: 4,
            FriendlyDisplayFormat: friendlyDisplayFormat,
        };
        return this.add(title, "SP.FieldDateTime", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a new SP.FieldNumber to the collection
     *
     * @param title The field title
     * @param minValue The field's minimum value
     * @param maxValue The field's maximum value
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.addNumber = function (title, minValue, maxValue, properties) {
        var props = { FieldTypeKind: 9 };
        if (typeof minValue !== "undefined") {
            props = util_1.Util.extend({ MinimumValue: minValue }, props);
        }
        if (typeof maxValue !== "undefined") {
            props = util_1.Util.extend({ MaximumValue: maxValue }, props);
        }
        return this.add(title, "SP.FieldNumber", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a new SP.FieldCurrency to the collection
     *
     * @param title The field title
     * @param minValue The field's minimum value
     * @param maxValue The field's maximum value
     * @param currencyLocalId Specifies the language code identifier (LCID) used to format the value of the field
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.addCurrency = function (title, minValue, maxValue, currencyLocalId, properties) {
        if (currencyLocalId === void 0) { currencyLocalId = 1033; }
        var props = {
            CurrencyLocaleId: currencyLocalId,
            FieldTypeKind: 10,
        };
        if (typeof minValue !== "undefined") {
            props = util_1.Util.extend({ MinimumValue: minValue }, props);
        }
        if (typeof maxValue !== "undefined") {
            props = util_1.Util.extend({ MaximumValue: maxValue }, props);
        }
        return this.add(title, "SP.FieldCurrency", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a new SP.FieldMultiLineText to the collection
     *
     * @param title The field title
     * @param numberOfLines Specifies the number of lines of text to display for the field.
     * @param richText Specifies whether the field supports rich formatting.
     * @param restrictedMode Specifies whether the field supports a subset of rich formatting.
     * @param appendOnly Specifies whether all changes to the value of the field are displayed in list forms.
     * @param allowHyperlink Specifies whether a hyperlink is allowed as a value of the field.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     *
     */
    Fields.prototype.addMultilineText = function (title, numberOfLines, richText, restrictedMode, appendOnly, allowHyperlink, properties) {
        if (numberOfLines === void 0) { numberOfLines = 6; }
        if (richText === void 0) { richText = true; }
        if (restrictedMode === void 0) { restrictedMode = false; }
        if (appendOnly === void 0) { appendOnly = false; }
        if (allowHyperlink === void 0) { allowHyperlink = true; }
        var props = {
            AllowHyperlink: allowHyperlink,
            AppendOnly: appendOnly,
            FieldTypeKind: 3,
            NumberOfLines: numberOfLines,
            RestrictedMode: restrictedMode,
            RichText: richText,
        };
        return this.add(title, "SP.FieldMultiLineText", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a new SP.FieldUrl to the collection
     *
     * @param title The field title
     */
    Fields.prototype.addUrl = function (title, displayFormat, properties) {
        if (displayFormat === void 0) { displayFormat = types_1.UrlFieldFormatType.Hyperlink; }
        var props = {
            DisplayFormat: displayFormat,
            FieldTypeKind: 11,
        };
        return this.add(title, "SP.FieldUrl", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a user field to the colleciton
     *
     * @param title The new field's title
     * @param selectionMode The selection mode of the field
     * @param selectionGroup Value that specifies the identifier of the SharePoint group whose members can be selected as values of the field
     * @param properties
     */
    Fields.prototype.addUser = function (title, selectionMode, properties) {
        var props = {
            FieldTypeKind: 20,
            SelectionMode: selectionMode,
        };
        return this.add(title, "SP.FieldUser", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a SP.FieldLookup to the collection
     *
     * @param title The new field's title
     * @param lookupListId The guid id of the list where the source of the lookup is found
     * @param lookupFieldName The internal name of the field in the source list
     * @param properties Set of additional properties to set on the new field
     */
    Fields.prototype.addLookup = function (title, lookupListId, lookupFieldName, properties) {
        var _this = this;
        var postBody = JSON.stringify({
            parameters: util_1.Util.extend({
                FieldTypeKind: 7,
                LookupFieldName: lookupFieldName,
                LookupListId: lookupListId,
                Title: title,
                "__metadata": { "type": "SP.FieldCreationInformation" },
            }, properties),
        });
        return this.clone(Fields, "addfield").postAsCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                field: _this.getById(data.Id),
            };
        });
    };
    /**
     * Adds a new SP.FieldChoice to the collection
     *
     * @param title The field title.
     * @param choices The choices for the field.
     * @param format The display format of the available options for the field.
     * @param fillIn Specifies whether the field allows fill-in values.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.addChoice = function (title, choices, format, fillIn, properties) {
        if (format === void 0) { format = types_1.ChoiceFieldFormatType.Dropdown; }
        var props = {
            Choices: {
                results: choices,
            },
            EditFormat: format,
            FieldTypeKind: 6,
            FillInChoice: fillIn,
        };
        return this.add(title, "SP.FieldChoice", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a new SP.FieldMultiChoice to the collection
     *
     * @param title The field title.
     * @param choices The choices for the field.
     * @param fillIn Specifies whether the field allows fill-in values.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.addMultiChoice = function (title, choices, fillIn, properties) {
        var props = {
            Choices: {
                results: choices,
            },
            FieldTypeKind: 15,
            FillInChoice: fillIn,
        };
        return this.add(title, "SP.FieldMultiChoice", util_1.Util.extend(props, properties));
    };
    /**
     * Adds a new SP.FieldBoolean to the collection
     *
     * @param title The field title.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    Fields.prototype.addBoolean = function (title, properties) {
        var props = {
            FieldTypeKind: 8,
        };
        return this.add(title, "SP.Field", util_1.Util.extend(props, properties));
    };
    return Fields;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Fields = Fields;
/**
 * Describes a single of Field instance
 *
 */
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    function Field() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Updates this field intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param fieldType The type value, required to update child field type properties
     */
    Field.prototype.update = function (properties, fieldType) {
        var _this = this;
        if (fieldType === void 0) { fieldType = "SP.Field"; }
        var postBody = JSON.stringify(util_1.Util.extend({
            "__metadata": { "type": fieldType },
        }, properties));
        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            return {
                data: data,
                field: _this,
            };
        });
    };
    /**
     * Delete this fields
     *
     */
    Field.prototype.delete = function () {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    /**
     * Sets the value of the ShowInDisplayForm property for this field.
     */
    Field.prototype.setShowInDisplayForm = function (show) {
        return this.clone(Field, "setshowindisplayform(" + show + ")").postCore();
    };
    /**
     * Sets the value of the ShowInEditForm property for this field.
     */
    Field.prototype.setShowInEditForm = function (show) {
        return this.clone(Field, "setshowineditform(" + show + ")").postCore();
    };
    /**
     * Sets the value of the ShowInNewForm property for this field.
     */
    Field.prototype.setShowInNewForm = function (show) {
        return this.clone(Field, "setshowinnewform(" + show + ")").postCore();
    };
    return Field;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.Field = Field;


/***/ }),

/***/ "TZA7":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/odata/pipeline.js ***!
  \*********************************************/
/*! exports provided: setResult, pipe, requestPipelineMethod, PipelineMethods, getDefaultPipeline */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setResult", function() { return setResult; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pipe", function() { return pipe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "requestPipelineMethod", function() { return requestPipelineMethod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PipelineMethods", function() { return PipelineMethods; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDefaultPipeline", function() { return getDefaultPipeline; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "t3D1");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/logging */ "B3L+");
/* harmony import */ var _caching_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./caching.js */ "Zl34");




/**
 * Resolves the context's result value
 *
 * @param context The current context
 */
function returnResult(context) {
    _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].log({
        data: _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].activeLogLevel === 0 /* Verbose */ ? context.result : {},
        level: 1 /* Info */,
        message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") Returning result from pipeline. Set logging to verbose to see data.",
    });
    return Promise.resolve(context.result);
}
/**
 * Sets the result on the context
 */
function setResult(context, value) {
    return new Promise(function (resolve) {
        context.result = value;
        context.hasResult = true;
        resolve(context);
    });
}
/**
 * Invokes the next method in the provided context's pipeline
 *
 * @param c The current request context
 */
function next(c) {
    return c.pipes.length > 0 ? c.pipes.shift()(c) : Promise.resolve(c);
}
/**
 * Executes the current request context's pipeline
 *
 * @param context Current context
 */
function pipe(context) {
    if (context.pipes.length < 1) {
        _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Request pipeline contains no methods!", 3 /* Error */);
        throw Error("Request pipeline contains no methods!");
    }
    var promise = next(context).then(function (ctx) { return returnResult(ctx); }).catch(function (e) {
        _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].error(e);
        throw e;
    });
    if (context.isBatched) {
        // this will block the batch's execute method from returning until the child requests have been resolved
        context.batch.addResolveBatchDependency(promise);
    }
    return promise;
}
/**
 * decorator factory applied to methods in the pipeline to control behavior
 */
function requestPipelineMethod(alwaysRun) {
    if (alwaysRun === void 0) { alwaysRun = false; }
    return function (target, propertyKey, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // if we have a result already in the pipeline, pass it along and don't call the tagged method
            if (!alwaysRun && args.length > 0 && Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(args[0], "hasResult") && args[0].hasResult) {
                _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].write("[" + args[0].requestId + "] (" + (new Date()).getTime() + ") Skipping request pipeline method " + propertyKey + ", existing result in pipeline.", 0 /* Verbose */);
                return Promise.resolve(args[0]);
            }
            // apply the tagged method
            _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].write("[" + args[0].requestId + "] (" + (new Date()).getTime() + ") Calling request pipeline method " + propertyKey + ".", 0 /* Verbose */);
            // then chain the next method in the context's pipeline - allows for dynamic pipeline
            return method.apply(target, args).then(function (ctx) { return next(ctx); });
        };
    };
}
/**
 * Contains the methods used within the request pipeline
 */
var PipelineMethods = /** @class */ (function () {
    function PipelineMethods() {
    }
    /**
     * Logs the start of the request
     */
    PipelineMethods.logStart = function (context) {
        return new Promise(function (resolve) {
            _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].log({
                data: _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].activeLogLevel === 1 /* Info */ ? {} : context,
                level: 1 /* Info */,
                message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") Beginning " + context.method + " request (" + context.url + ")",
            });
            resolve(context);
        });
    };
    /**
     * Handles caching of the request
     */
    PipelineMethods.caching = function (context) {
        return new Promise(function (resolve) {
            // handle caching, if applicable
            if (context.useCaching) {
                _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Caching is enabled for request, checking cache...", 1 /* Info */);
                var cacheOptions = new _caching_js__WEBPACK_IMPORTED_MODULE_3__["CachingOptions"](context.url.toLowerCase());
                if (context.cachingOptions !== undefined) {
                    cacheOptions = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(cacheOptions, context.cachingOptions);
                }
                // we may not have a valid store
                if (cacheOptions.store !== null) {
                    // check if we have the data in cache and if so resolve the promise and return
                    var data = cacheOptions.store.get(cacheOptions.key);
                    if (data !== null) {
                        _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].log({
                            data: _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].activeLogLevel === 1 /* Info */ ? {} : data,
                            level: 1 /* Info */,
                            message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") Value returned from cache.",
                        });
                        // ensure we clear any held batch dependency we are resolving from the cache
                        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["isFunc"])(context.batchDependency)) {
                            context.batchDependency();
                        }
                        // handle the case where a parser needs to take special actions with a cached result
                        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(context.parser, "hydrate")) {
                            data = context.parser.hydrate(data);
                        }
                        return setResult(context, data).then(function (ctx) { return resolve(ctx); });
                    }
                }
                _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Value not found in cache.", 1 /* Info */);
                // if we don't then wrap the supplied parser in the caching parser wrapper
                // and send things on their way
                context.parser = new _caching_js__WEBPACK_IMPORTED_MODULE_3__["CachingParserWrapper"](context.parser, cacheOptions);
            }
            return resolve(context);
        });
    };
    /**
     * Sends the request
     */
    PipelineMethods.send = function (context) {
        return new Promise(function (resolve, reject) {
            // send or batch the request
            if (context.isBatched) {
                var p = context.batch.add(context);
                // we release the dependency here to ensure the batch does not execute until the request is added to the batch
                if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["isFunc"])(context.batchDependency)) {
                    context.batchDependency();
                }
                _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Batching request in batch " + context.batch.batchId + ".", 1 /* Info */);
                // we set the result as the promise which will be resolved by the batch's execution
                resolve(setResult(context, p));
            }
            else {
                _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Sending request.", 1 /* Info */);
                // we are not part of a batch, so proceed as normal
                var client = context.clientFactory();
                var opts = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(context.options || {}, { method: context.method });
                client.fetch(context.url, opts)
                    .then(function (response) { return context.parser.parse(response); })
                    .then(function (result) { return setResult(context, result); })
                    .then(function (ctx) { return resolve(ctx); })
                    .catch(function (e) { return reject(e); });
            }
        });
    };
    /**
     * Logs the end of the request
     */
    PipelineMethods.logEnd = function (context) {
        return new Promise(function (resolve) {
            if (context.isBatched) {
                _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].log({
                    data: _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].activeLogLevel === 1 /* Info */ ? {} : context,
                    level: 1 /* Info */,
                    message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") " + context.method + " request will complete in batch " + context.batch.batchId + ".",
                });
            }
            else {
                _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].log({
                    data: _pnp_logging__WEBPACK_IMPORTED_MODULE_2__["Logger"].activeLogLevel === 1 /* Info */ ? {} : context,
                    level: 1 /* Info */,
                    message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") Completing " + context.method + " request.",
                });
            }
            resolve(context);
        });
    };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        requestPipelineMethod(true)
    ], PipelineMethods, "logStart", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        requestPipelineMethod()
    ], PipelineMethods, "caching", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        requestPipelineMethod()
    ], PipelineMethods, "send", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        requestPipelineMethod(true)
    ], PipelineMethods, "logEnd", null);
    return PipelineMethods;
}());

function getDefaultPipeline() {
    return [
        PipelineMethods.logStart,
        PipelineMethods.caching,
        PipelineMethods.send,
        PipelineMethods.logEnd,
    ].slice(0);
}
//# sourceMappingURL=pipeline.js.map

/***/ }),

/***/ "U0SV":
/*!*******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/webs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var lists_1 = __webpack_require__(/*! ./lists */ "FFhP");
var fields_1 = __webpack_require__(/*! ./fields */ "TT1A");
var navigation_1 = __webpack_require__(/*! ./navigation */ "/1ZT");
var sitegroups_1 = __webpack_require__(/*! ./sitegroups */ "pwpL");
var contenttypes_1 = __webpack_require__(/*! ./contenttypes */ "5e5a");
var regionalsettings_1 = __webpack_require__(/*! ./regionalsettings */ "rLF8");
var folders_1 = __webpack_require__(/*! ./folders */ "q1dm");
var roles_1 = __webpack_require__(/*! ./roles */ "t5HP");
var files_1 = __webpack_require__(/*! ./files */ "MMX7");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var lists_2 = __webpack_require__(/*! ./lists */ "FFhP");
var siteusers_1 = __webpack_require__(/*! ./siteusers */ "l0hS");
var usercustomactions_1 = __webpack_require__(/*! ./usercustomactions */ "I1iA");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
var batch_1 = __webpack_require__(/*! ./batch */ "PbI0");
var features_1 = __webpack_require__(/*! ./features */ "1Cz4");
var sharepointqueryableshareable_1 = __webpack_require__(/*! ./sharepointqueryableshareable */ "gZxA");
var relateditems_1 = __webpack_require__(/*! ./relateditems */ "gzIf");
var appcatalog_1 = __webpack_require__(/*! ./appcatalog */ "P6J3");
var clientsidepages_1 = __webpack_require__(/*! ./clientsidepages */ "YJnM");
/**
 * Describes a collection of webs
 *
 */
var Webs = /** @class */ (function (_super) {
    __extends(Webs, _super);
    /**
     * Creates a new instance of the Webs class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web collection
     */
    function Webs(baseUrl, webPath) {
        if (webPath === void 0) { webPath = "webs"; }
        return _super.call(this, baseUrl, webPath) || this;
    }
    /**
     * Adds a new web to the collection
     *
     * @param title The new web's title
     * @param url The new web's relative url
     * @param description The new web's description
     * @param template The new web's template internal name (default = STS)
     * @param language The locale id that specifies the new web's language (default = 1033 [English, US])
     * @param inheritPermissions When true, permissions will be inherited from the new web's parent (default = true)
     */
    Webs.prototype.add = function (title, url, description, template, language, inheritPermissions) {
        if (description === void 0) { description = ""; }
        if (template === void 0) { template = "STS"; }
        if (language === void 0) { language = 1033; }
        if (inheritPermissions === void 0) { inheritPermissions = true; }
        var props = {
            Description: description,
            Language: language,
            Title: title,
            Url: url,
            UseSamePermissionsAsParentSite: inheritPermissions,
            WebTemplate: template,
        };
        var postBody = JSON.stringify({
            "parameters": util_1.Util.extend({
                "__metadata": { "type": "SP.WebCreationInformation" },
            }, props),
        });
        return this.clone(Webs, "add").postCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                web: new Web(odata_1.spExtractODataId(data).replace(/_api\/web\/?/i, "")),
            };
        });
    };
    return Webs;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Webs = Webs;
/**
 * Describes a collection of web infos
 *
 */
var WebInfos = /** @class */ (function (_super) {
    __extends(WebInfos, _super);
    /**
     * Creates a new instance of the WebInfos class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web infos collection
     */
    function WebInfos(baseUrl, webPath) {
        if (webPath === void 0) { webPath = "webinfos"; }
        return _super.call(this, baseUrl, webPath) || this;
    }
    return WebInfos;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.WebInfos = WebInfos;
/**
 * Describes a web
 *
 */
var Web = /** @class */ (function (_super) {
    __extends(Web, _super);
    /**
     * Creates a new instance of the Web class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web
     */
    function Web(baseUrl, path) {
        if (path === void 0) { path = "_api/web"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Creates a new web instance from the given url by indexing the location of the /_api/
     * segment. If this is not found the method creates a new web with the entire string as
     * supplied.
     *
     * @param url
     */
    Web.fromUrl = function (url, path) {
        return new Web(util_1.extractWebUrl(url), path);
    };
    Object.defineProperty(Web.prototype, "webs", {
        /**
         * Gets this web's subwebs
         *
         */
        get: function () {
            return new Webs(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
    * Returns a collection of objects that contain metadata about subsites of the current site in which the current user is a member.
    *
    * @param nWebTemplateFilter Specifies the site definition (default = -1)
    * @param nConfigurationFilter A 16-bit integer that specifies the identifier of a configuration (default = -1)
    */
    Web.prototype.getSubwebsFilteredForCurrentUser = function (nWebTemplateFilter, nConfigurationFilter) {
        if (nWebTemplateFilter === void 0) { nWebTemplateFilter = -1; }
        if (nConfigurationFilter === void 0) { nConfigurationFilter = -1; }
        return this.clone(Webs, "getSubwebsFilteredForCurrentUser(nWebTemplateFilter=" + nWebTemplateFilter + ",nConfigurationFilter=" + nConfigurationFilter + ")");
    };
    Object.defineProperty(Web.prototype, "allProperties", {
        /**
         * Gets the set of all web properties from the read-only collection.
         */
        get: function () {
            return this.clone(sharepointqueryable_1.SharePointQueryableCollection, "allproperties");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "webinfos", {
        /**
         * Gets a collection of WebInfos for this web's subwebs
         *
         */
        get: function () {
            return new WebInfos(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "contentTypes", {
        /**
         * Gets the content types available in this web
         *
         */
        get: function () {
            return new contenttypes_1.ContentTypes(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "lists", {
        /**
         * Gets the lists in this web
         *
         */
        get: function () {
            return new lists_1.Lists(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "fields", {
        /**
         * Gets the fields in this web
         *
         */
        get: function () {
            return new fields_1.Fields(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "features", {
        /**
         * Gets the active features for this web
         *
         */
        get: function () {
            return new features_1.Features(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "availablefields", {
        /**
         * Gets the available fields in this web
         *
         */
        get: function () {
            return new fields_1.Fields(this, "availablefields");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "navigation", {
        /**
         * Gets the navigation options in this web
         *
         */
        get: function () {
            return new navigation_1.Navigation(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "siteUsers", {
        /**
         * Gets the site users
         *
         */
        get: function () {
            return new siteusers_1.SiteUsers(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "siteGroups", {
        /**
         * Gets the site groups
         *
         */
        get: function () {
            return new sitegroups_1.SiteGroups(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "siteUserInfoList", {
        /**
         * Gets site user info list
         *
         */
        get: function () {
            return new lists_2.List(this, "siteuserinfolist");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "regionalSettings", {
        /**
         * Gets regional settings
         *
         */
        get: function () {
            return new regionalsettings_1.RegionalSettings(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "currentUser", {
        /**
         * Gets the current user
         */
        get: function () {
            return new siteusers_1.CurrentUser(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "folders", {
        /**
         * Gets the top-level folders in this web
         *
         */
        get: function () {
            return new folders_1.Folders(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "userCustomActions", {
        /**
         * Gets all user custom actions for this web
         *
         */
        get: function () {
            return new usercustomactions_1.UserCustomActions(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "effectiveBasePermissions", {
        /**
         * Gets the effective base permissions of this web
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryable(this, "effectivebasepermissions");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "roleDefinitions", {
        /**
         * Gets the collection of RoleDefinition resources
         *
         */
        get: function () {
            return new roles_1.RoleDefinitions(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "relatedItems", {
        /**
         * Provides an interface to manage related items
         *
         */
        get: function () {
            return relateditems_1.RelatedItemManagerImpl.FromUrl(this.toUrl());
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new batch for requests within the context of this web
     *
     */
    Web.prototype.createBatch = function () {
        return new batch_1.ODataBatch(this.parentUrl);
    };
    Object.defineProperty(Web.prototype, "rootFolder", {
        /**
         * Gets the root folder of this web
         *
         */
        get: function () {
            return new folders_1.Folder(this, "rootFolder");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "associatedOwnerGroup", {
        /**
         * Gets the associated owner group for this web
         *
         */
        get: function () {
            return new sitegroups_1.SiteGroup(this, "associatedownergroup");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "associatedMemberGroup", {
        /**
         * Gets the associated member group for this web
         *
         */
        get: function () {
            return new sitegroups_1.SiteGroup(this, "associatedmembergroup");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Web.prototype, "associatedVisitorGroup", {
        /**
         * Gets the associated visitor group for this web
         *
         */
        get: function () {
            return new sitegroups_1.SiteGroup(this, "associatedvisitorgroup");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets a folder by server relative url
     *
     * @param folderRelativeUrl The server relative path to the folder (including /sites/ if applicable)
     */
    Web.prototype.getFolderByServerRelativeUrl = function (folderRelativeUrl) {
        return new folders_1.Folder(this, "getFolderByServerRelativeUrl('" + folderRelativeUrl + "')");
    };
    /**
     * Gets a folder by server relative relative path if your folder name contains # and % characters
     * you need to first encode the file name using encodeURIComponent() and then pass the url
     * let url = "/sites/test/Shared Documents/" + encodeURIComponent("%123");
     * This works only in SharePoint online.
     *
     * @param folderRelativeUrl The server relative path to the folder (including /sites/ if applicable)
     */
    Web.prototype.getFolderByServerRelativePath = function (folderRelativeUrl) {
        return new folders_1.Folder(this, "getFolderByServerRelativePath(decodedUrl='" + folderRelativeUrl + "')");
    };
    /**
     * Gets a file by server relative url
     *
     * @param fileRelativeUrl The server relative path to the file (including /sites/ if applicable)
     */
    Web.prototype.getFileByServerRelativeUrl = function (fileRelativeUrl) {
        return new files_1.File(this, "getFileByServerRelativeUrl('" + fileRelativeUrl + "')");
    };
    /**
     * Gets a file by server relative url if your file name contains # and % characters
     * you need to first encode the file name using encodeURIComponent() and then pass the url
     * let url = "/sites/test/Shared Documents/" + encodeURIComponent("%123.docx");
     *
     * @param fileRelativeUrl The server relative path to the file (including /sites/ if applicable)
     */
    Web.prototype.getFileByServerRelativePath = function (fileRelativeUrl) {
        return new files_1.File(this, "getFileByServerRelativePath(decodedUrl='" + fileRelativeUrl + "')");
    };
    /**
     * Gets a list by server relative url (list's root folder)
     *
     * @param listRelativeUrl The server relative path to the list's root folder (including /sites/ if applicable)
     */
    Web.prototype.getList = function (listRelativeUrl) {
        return new lists_2.List(this, "getList('" + listRelativeUrl + "')");
    };
    /**
     * Updates this web instance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the web
     */
    Web.prototype.update = function (properties) {
        var _this = this;
        var postBody = JSON.stringify(util_1.Util.extend({
            "__metadata": { "type": "SP.Web" },
        }, properties));
        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            return {
                data: data,
                web: _this,
            };
        });
    };
    /**
     * Deletes this web
     *
     */
    Web.prototype.delete = function () {
        return _super.prototype.deleteCore.call(this);
    };
    /**
     * Applies the theme specified by the contents of each of the files specified in the arguments to the site
     *
     * @param colorPaletteUrl The server-relative URL of the color palette file
     * @param fontSchemeUrl The server-relative URL of the font scheme
     * @param backgroundImageUrl The server-relative URL of the background image
     * @param shareGenerated When true, the generated theme files are stored in the root site. When false, they are stored in this web
     */
    Web.prototype.applyTheme = function (colorPaletteUrl, fontSchemeUrl, backgroundImageUrl, shareGenerated) {
        var postBody = JSON.stringify({
            backgroundImageUrl: backgroundImageUrl,
            colorPaletteUrl: colorPaletteUrl,
            fontSchemeUrl: fontSchemeUrl,
            shareGenerated: shareGenerated,
        });
        return this.clone(Web, "applytheme").postCore({ body: postBody });
    };
    /**
     * Applies the specified site definition or site template to the Web site that has no template applied to it
     *
     * @param template Name of the site definition or the name of the site template
     */
    Web.prototype.applyWebTemplate = function (template) {
        var q = this.clone(Web, "applywebtemplate");
        q.concat("(@t)");
        q.query.add("@t", template);
        return q.postCore();
    };
    /**
     * Checks whether the specified login name belongs to a valid user in the web. If the user doesn't exist, adds the user to the web.
     *
     * @param loginName The login name of the user (ex: i:0#.f|membership|user@domain.onmicrosoft.com)
     */
    Web.prototype.ensureUser = function (loginName) {
        var postBody = JSON.stringify({
            logonName: loginName,
        });
        return this.clone(Web, "ensureuser").postCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                user: new siteusers_1.SiteUser(odata_1.spExtractODataId(data)),
            };
        });
    };
    /**
     * Returns a collection of site templates available for the site
     *
     * @param language The locale id of the site templates to retrieve (default = 1033 [English, US])
     * @param includeCrossLanguage When true, includes language-neutral site templates; otherwise false (default = true)
     */
    Web.prototype.availableWebTemplates = function (language, includeCrossLanugage) {
        if (language === void 0) { language = 1033; }
        if (includeCrossLanugage === void 0) { includeCrossLanugage = true; }
        return new sharepointqueryable_1.SharePointQueryableCollection(this, "getavailablewebtemplates(lcid=" + language + ", doincludecrosslanguage=" + includeCrossLanugage + ")");
    };
    /**
     * Returns the list gallery on the site
     *
     * @param type The gallery type - WebTemplateCatalog = 111, WebPartCatalog = 113 ListTemplateCatalog = 114,
     * MasterPageCatalog = 116, SolutionCatalog = 121, ThemeCatalog = 123, DesignCatalog = 124, AppDataCatalog = 125
     */
    Web.prototype.getCatalog = function (type) {
        return this.clone(Web, "getcatalog(" + type + ")").select("Id").get().then(function (data) {
            return new lists_2.List(odata_1.spExtractODataId(data));
        });
    };
    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query
     *
     * @param query The change query
     */
    Web.prototype.getChanges = function (query) {
        var postBody = JSON.stringify({ "query": util_1.Util.extend({ "__metadata": { "type": "SP.ChangeQuery" } }, query) });
        return this.clone(Web, "getchanges").postCore({ body: postBody });
    };
    Object.defineProperty(Web.prototype, "customListTemplate", {
        /**
         * Gets the custom list templates for the site
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "getcustomlisttemplates");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the user corresponding to the specified member identifier for the current site
     *
     * @param id The id of the user
     */
    Web.prototype.getUserById = function (id) {
        return new siteusers_1.SiteUser(this, "getUserById(" + id + ")");
    };
    /**
     * Returns the name of the image file for the icon that is used to represent the specified file
     *
     * @param filename The file name. If this parameter is empty, the server returns an empty string
     * @param size The size of the icon: 16x16 pixels = 0, 32x32 pixels = 1 (default = 0)
     * @param progId The ProgID of the application that was used to create the file, in the form OLEServerName.ObjectName
     */
    Web.prototype.mapToIcon = function (filename, size, progId) {
        if (size === void 0) { size = 0; }
        if (progId === void 0) { progId = ""; }
        return this.clone(Web, "maptoicon(filename='" + filename + "', progid='" + progId + "', size=" + size + ")").get();
    };
    /**
     * Returns the tenant property corresponding to the specified key in the app catalog site
     *
     * @param key
     */
    Web.prototype.getStorageEntity = function (key) {
        return this.clone(Web, "getStorageEntity('" + key + "')").get();
    };
    /**
     * Gets the app catalog for this web
     *
     * @param url Optional url or web containing the app catalog (default: current web)
     */
    Web.prototype.getAppCatalog = function (url) {
        return new appcatalog_1.AppCatalog(url || this);
    };
    /**
     * Gets the collection of available client side web parts for this web instance
     */
    Web.prototype.getClientSideWebParts = function () {
        return this.clone(sharepointqueryable_1.SharePointQueryableCollection, "GetClientSideWebParts").get();
    };
    /**
     * Creates a new client side page
     *
     * @param pageName Name of the new page
     * @param title Display title of the new page
     * @param libraryTitle Title of the library in which to create the new page. Default: "Site Pages"
     */
    Web.prototype.addClientSidePage = function (pageName, title, libraryTitle) {
        if (title === void 0) { title = pageName.replace(/\.[^/.]+$/, ""); }
        if (libraryTitle === void 0) { libraryTitle = "Site Pages"; }
        return clientsidepages_1.ClientSidePage.create(this.lists.getByTitle(libraryTitle), pageName, title);
    };
    /**
     * Creates a new client side page using the library path
     *
     * @param pageName Name of the new page
     * @param listRelativePath The server relative path to the list's root folder (including /sites/ if applicable)
     * @param title Display title of the new page
     */
    Web.prototype.addClientSidePageByPath = function (pageName, listRelativePath, title) {
        if (title === void 0) { title = pageName.replace(/\.[^/.]+$/, ""); }
        return clientsidepages_1.ClientSidePage.create(this.getList(listRelativePath), pageName, title);
    };
    return Web;
}(sharepointqueryableshareable_1.SharePointQueryableShareableWeb));
exports.Web = Web;


/***/ }),

/***/ "U9ZE":
/*!*******************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/net/sprequestexecutorclient.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
/**
 * Makes requests using the SP.RequestExecutor library.
 */
var SPRequestExecutorClient = /** @class */ (function () {
    function SPRequestExecutorClient() {
        /**
         * Converts a SharePoint REST API response to a fetch API response.
         */
        this.convertToResponse = function (spResponse) {
            var responseHeaders = new Headers();
            for (var h in spResponse.headers) {
                if (spResponse.headers[h]) {
                    responseHeaders.append(h, spResponse.headers[h]);
                }
            }
            // issue #256, Cannot have an empty string body when creating a Response with status 204
            var body = spResponse.statusCode === 204 ? null : spResponse.body;
            return new Response(body, {
                headers: responseHeaders,
                status: spResponse.statusCode,
                statusText: spResponse.statusText,
            });
        };
    }
    /**
     * Fetches a URL using the SP.RequestExecutor library.
     */
    SPRequestExecutorClient.prototype.fetch = function (url, options) {
        var _this = this;
        if (typeof SP === "undefined" || typeof SP.RequestExecutor === "undefined") {
            throw new exceptions_1.SPRequestExecutorUndefinedException();
        }
        var addinWebUrl = url.substring(0, url.indexOf("/_api")), executor = new SP.RequestExecutor(addinWebUrl);
        var headers = {}, iterator, temp;
        if (options.headers && options.headers instanceof Headers) {
            iterator = options.headers.entries();
            temp = iterator.next();
            while (!temp.done) {
                headers[temp.value[0]] = temp.value[1];
                temp = iterator.next();
            }
        }
        else {
            headers = options.headers;
        }
        // this is a way to determine if we need to set the binaryStringRequestBody by testing what method we are calling
        // and if they would normally have a binary body. This addresses issue #565.
        var paths = [
            "files\/add",
            "files\/addTemplateFile",
            "file\/startUpload",
            "file\/continueUpload",
            "file\/finishUpload",
            "attachmentfiles\/add",
        ];
        var isBinaryRequest = (new RegExp(paths.join("|"), "i")).test(url);
        return new Promise(function (resolve, reject) {
            var requestOptions = {
                error: function (error) {
                    reject(_this.convertToResponse(error));
                },
                headers: headers,
                method: options.method,
                success: function (response) {
                    resolve(_this.convertToResponse(response));
                },
                url: url,
            };
            if (options.body) {
                requestOptions = util_1.Util.extend(requestOptions, { body: options.body });
                if (isBinaryRequest) {
                    requestOptions = util_1.Util.extend(requestOptions, { binaryStringRequestBody: true });
                }
            }
            executor.executeAsync(requestOptions);
        });
    };
    return SPRequestExecutorClient;
}());
exports.SPRequestExecutorClient = SPRequestExecutorClient;


/***/ }),

/***/ "UK2s":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/operations.js ***!
  \********************************************/
/*! exports provided: registerCustomRequestClientFactory, spGet, spPost, spDelete, spPatch, spPostDelete, spPostDeleteETag */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerCustomRequestClientFactory", function() { return registerCustomRequestClientFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spGet", function() { return spGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spPost", function() { return spPost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spDelete", function() { return spDelete; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spPatch", function() { return spPatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spPostDelete", function() { return spPostDelete; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spPostDeleteETag", function() { return spPostDeleteETag; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _sphttpclient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sphttpclient.js */ "DqvY");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _utils_toabsoluteurl_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/toabsoluteurl.js */ "G2Ar");





function registerCustomRequestClientFactory(requestClientFactory) {
    httpClientFactory = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_3__["isFunc"])(requestClientFactory) ? function () { return requestClientFactory; } : defaultFactory;
}
var defaultFactory = function (runtime) { return function () { return new _sphttpclient_js__WEBPACK_IMPORTED_MODULE_2__["SPHttpClient"](runtime); }; };
var httpClientFactory = defaultFactory;
var send = function (method) {
    return function (o, options) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var runtime, operation, data, batchDependency, url;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runtime = o.getRuntime();
                        operation = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["defaultPipelineBinder"])(httpClientFactory(runtime))(method);
                        data = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["cloneQueryableData"])(o.data);
                        batchDependency = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_3__["objectDefinedNotNull"])(data.batch) ? data.batch.addDependency() : function () {
                            return;
                        };
                        return [4 /*yield*/, Object(_utils_toabsoluteurl_js__WEBPACK_IMPORTED_MODULE_4__["toAbsoluteUrl"])(o.toUrlAndQuery(), runtime)];
                    case 1:
                        url = _a.sent();
                        Object(_pnp_common__WEBPACK_IMPORTED_MODULE_3__["mergeOptions"])(data.options, options);
                        return [2 /*return*/, operation(Object.assign({}, data, {
                                batchDependency: batchDependency,
                                url: url,
                            }))];
                }
            });
        });
    };
};
var spGet = function (o, options) {
    // Fix for #304 - when we clone objects we in some cases then execute a get request
    // in these cases the caching settings were getting dropped from the request
    // this tracks if the object from which this was cloned was caching and applies that to an immediate get request
    // does not affect objects cloned from this as we are using different fields to track the settings so it won't
    // be triggered
    if (o.data.cloneParentWasCaching) {
        o.usingCaching(o.data.cloneParentCacheOptions);
    }
    // if we are forcing caching set that in the data here
    if (o._forceCaching) {
        o.data.useCaching = true;
    }
    return send("GET")(o, options);
};
var spPost = function (o, options) { return send("POST")(o, options); };
var spDelete = function (o, options) { return send("DELETE")(o, options); };
var spPatch = function (o, options) { return send("PATCH")(o, options); };
var spPostDelete = function (o, options) {
    var opts = Object.assign(Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["headers"])({ "X-HTTP-Method": "DELETE" }), options);
    return spPost(o, opts);
};
var spPostDeleteETag = function (o, options, eTag) {
    if (eTag === void 0) { eTag = "*"; }
    var opts = Object.assign(Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_1__["headers"])({ "X-HTTP-Method": "DELETE", "IF-Match": eTag }), options);
    return spPost(o, opts);
};
//# sourceMappingURL=operations.js.map

/***/ }),

/***/ "UTMP":
/*!*******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/net/fetchclient.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Makes requests using the fetch API
 */
var FetchClient = /** @class */ (function () {
    function FetchClient() {
    }
    FetchClient.prototype.fetch = function (url, options) {
        return global.fetch(url, options);
    };
    return FetchClient;
}());
exports.FetchClient = FetchClient;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "yLpj")))

/***/ }),

/***/ "UWqr":
/*!*********************************************!*\
  !*** external "@microsoft/sp-core-library" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_UWqr__;

/***/ }),

/***/ "UxNQ":
/*!*****************************************!*\
  !*** ./node_modules/@pnp/common/net.js ***!
  \*****************************************/
/*! exports provided: mergeHeaders, mergeOptions, getADALResource, FetchClient, BearerTokenFetchClient, LambdaFetchClient, SPFxAdalClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeHeaders", function() { return mergeHeaders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeOptions", function() { return mergeOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getADALResource", function() { return getADALResource; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FetchClient", function() { return FetchClient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BearerTokenFetchClient", function() { return BearerTokenFetchClient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LambdaFetchClient", function() { return LambdaFetchClient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPFxAdalClient", function() { return SPFxAdalClient; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "lzYu");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "97IE");
/* harmony import */ var _safe_global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./safe-global.js */ "08ZC");



function mergeHeaders(target, source) {
    if (Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(source)) {
        var temp = new Request("", { headers: source });
        temp.headers.forEach(function (value, name) {
            target.append(name, value);
        });
    }
}
function mergeOptions(target, source) {
    if (Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(source)) {
        var headers = Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["assign"])(target.headers || {}, source.headers);
        target = Object(_util_js__WEBPACK_IMPORTED_MODULE_1__["assign"])(target, source);
        target.headers = headers;
    }
}
/**
 * Parses out the root of the request url to use as the resource when getting the token
 *
  * @param url The url to parse
 */
function getADALResource(url) {
    var u = new URL(url);
    return u.protocol + "//" + u.hostname;
}
/**
 * Makes requests using the global/window fetch API
 */
var FetchClient = /** @class */ (function () {
    function FetchClient() {
    }
    FetchClient.prototype.fetch = function (url, options) {
        return _safe_global_js__WEBPACK_IMPORTED_MODULE_2__["safeGlobal"].fetch(url, options);
    };
    return FetchClient;
}());

/**
 * Makes requests using the fetch API adding the supplied token to the Authorization header
 */
var BearerTokenFetchClient = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(BearerTokenFetchClient, _super);
    function BearerTokenFetchClient(token) {
        var _this = _super.call(this) || this;
        _this.token = token;
        return _this;
    }
    BearerTokenFetchClient.prototype.fetch = function (url, options) {
        if (options === void 0) { options = {}; }
        var headers = new Headers();
        mergeHeaders(headers, options.headers);
        headers.set("Authorization", "Bearer " + this.token);
        options.headers = headers;
        return _super.prototype.fetch.call(this, url, options);
    };
    return BearerTokenFetchClient;
}(FetchClient));

var LambdaFetchClient = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(LambdaFetchClient, _super);
    function LambdaFetchClient(tokenFactory) {
        var _this = _super.call(this, null) || this;
        _this.tokenFactory = tokenFactory;
        return _this;
    }
    /**
     * Executes a fetch request using the supplied url and options
     *
     * @param url Absolute url of the request
     * @param options Any options
     */
    LambdaFetchClient.prototype.fetch = function (url, options) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var _a;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.tokenFactory({ url: url, options: options })];
                    case 1:
                        _a.token = _b.sent();
                        return [2 /*return*/, _super.prototype.fetch.call(this, url, options)];
                }
            });
        });
    };
    return LambdaFetchClient;
}(BearerTokenFetchClient));

/**
 * Client wrapping the aadTokenProvider available from SPFx >= 1.6
 */
var SPFxAdalClient = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(SPFxAdalClient, _super);
    /**
     *
     * @param context provide the appropriate SPFx Context object
     */
    function SPFxAdalClient(context) {
        var _this = _super.call(this, function (params) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this, void 0, void 0, function () {
            var provider;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.aadTokenProviderFactory.getTokenProvider()];
                    case 1:
                        provider = _a.sent();
                        return [2 /*return*/, provider.getToken(getADALResource(params.url))];
                }
            });
        }); }) || this;
        _this.context = context;
        return _this;
    }
    /**
     * Gets an AAD token for the provided resource using the SPFx AADTokenProvider
     *
     * @param resource Resource for which a token is to be requested (ex: https://graph.microsoft.com)
     */
    SPFxAdalClient.prototype.getToken = function (resource) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var provider;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.context.aadTokenProviderFactory.getTokenProvider()];
                    case 1:
                        provider = _a.sent();
                        return [2 /*return*/, provider.getToken(resource)];
                }
            });
        });
    };
    return SPFxAdalClient;
}(LambdaFetchClient));

//# sourceMappingURL=net.js.map

/***/ }),

/***/ "VfU/":
/*!****************************************************!*\
  !*** ./lib/webparts/crudPnpjs/CrudPnpjsWebPart.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-core-library */ "UWqr");
/* harmony import */ var _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/sp-webpart-base */ "br4S");
/* harmony import */ var _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _CrudPnpjsWebPart_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CrudPnpjsWebPart.module.scss */ "F90Z");
/* harmony import */ var CrudPnpjsWebPartStrings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! CrudPnpjsWebPartStrings */ "RVWl");
/* harmony import */ var CrudPnpjsWebPartStrings__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(CrudPnpjsWebPartStrings__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _microsoft_sp_loader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @microsoft/sp-loader */ "I6O9");
/* harmony import */ var _microsoft_sp_loader__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_loader__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var sp_pnp_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! sp-pnp-js */ "7kAN");
/* harmony import */ var sp_pnp_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(sp_pnp_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _pnp_sp_webs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @pnp/sp/webs */ "6k7F");
/* harmony import */ var _pnp_sp_lists__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @pnp/sp/lists */ "J7sA");
/* harmony import */ var _pnp_sp_items__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @pnp/sp/items */ "lYrR");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();










__webpack_require__(/*! bootstrap */ "StVt");
var CrudPnpjsWebPart = /** @class */ (function (_super) {
    __extends(CrudPnpjsWebPart, _super);
    function CrudPnpjsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CrudPnpjsWebPart.prototype.AddEventListeners = function () {
        var _this = this;
        document.getElementById('AddItemToSPList').addEventListener('click', function () { return _this.AddSPListItem(); });
        document.getElementById('UpdateItemInSPList').addEventListener('click', function () { return _this.UpdateSPListItem(); });
        document.getElementById('DeleteItemFromSPList').addEventListener('click', function () { return _this.DeleteSPListItem(); });
    };
    CrudPnpjsWebPart.prototype._getAuditData = function () {
        return sp_pnp_js__WEBPACK_IMPORTED_MODULE_6___default.a.sp.web.lists.getByTitle("Audit Tool Data").items.get().then(function (response) {
            return response;
        });
    };
    CrudPnpjsWebPart.prototype.getAuditData = function () {
        var _this = this;
        this._getAuditData()
            .then(function (response) {
            _this._renderAuditData(response);
        });
    };
    CrudPnpjsWebPart.prototype._renderAuditData = function (items) {
        var html = '<table class="TFtable" border=1 width=style="bordercollapse: collapse;">';
        html += "<th></th><th>ID</th><th>Assessment</th><th>Medical</th>";
        if (items.length > 0) {
            items.forEach(function (item) {
                html += "    \n          <tr>   \n          <td><input type=\"radio\" id=\"AuditID\" name=\"AuditID\" value=\"" + item.ID + "\"><br></td>   \n          <td>" + item.ID + "</td>    \n          <td>" + item.Assessment + "</td>    \n          <td>" + item.Medicals + "</td>    \n          </tr>";
            });
        }
        else {
            html += "No records...";
        }
        html += "</table>";
        var listContainer = this.domElement.querySelector('#AuditDataItems');
        listContainer.innerHTML = html;
    };
    CrudPnpjsWebPart.prototype._getAuditQuestions = function () {
        return sp_pnp_js__WEBPACK_IMPORTED_MODULE_6___default.a.sp.web.lists.getByTitle("Audit Tool Questions").items.get().then(function (response) {
            return response;
        });
    };
    CrudPnpjsWebPart.prototype.getAuditQuestions = function () {
        var _this = this;
        this._getAuditQuestions()
            .then(function (response) {
            _this._renderQuestions(response);
        });
    };
    CrudPnpjsWebPart.prototype._renderQuestions = function (items) {
        var html = "";
        if (items.length > 0) {
            items.forEach(function (item) {
                html += "    \n        <div class=\"row\">\n            <div class=\"col-1\">" + item.Question_Number + "</div>\n            <div class=\"col-6\">" + item.Question_Text + "</div>\n            <div class=\"col-3 text-center\">\n                <div class=\"form-check-inline\">\n                    <label class=\"form-check-label\">\n                    Yes <input type=\"radio\" class=\"form-check-input\" name=\"CCRQ1yes\">\n                    </label>\n                </div>\n                <div class=\"form-check-inline\">\n                    <label class=\"form-check-label\">\n                    No <input type=\"radio\" class=\"form-check-input\" name=\"CCRQ1no\">\n                    </label>\n                </div>\n                <div class=\"form-check-inline\">\n                    <label class=\"form-check-label\">\n                    N/A <input type=\"radio\" class=\"form-check-input\" name=\"CCRQ1na\">\n                    </label>\n                </div> \n            </div>\n            <div class=\"col bg-success text-white border border-success text-center\">100%</div>\n            <div class=\"col text-right\">" + item.Min_Outcome + "</div>\n        </div>\n        <hr>\n        ";
            });
        }
        else {
            html += "No records...";
        }
        html += "</table>";
        var listContainer = this.domElement.querySelector('#AuditQuestionItems');
        listContainer.innerHTML = html;
    };
    CrudPnpjsWebPart.prototype.render = function () {
        var bootstrapCssURL = "https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
        var fontawesomeCssURL = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/regular.min.css";
        _microsoft_sp_loader__WEBPACK_IMPORTED_MODULE_5__["SPComponentLoader"].loadCss(bootstrapCssURL);
        _microsoft_sp_loader__WEBPACK_IMPORTED_MODULE_5__["SPComponentLoader"].loadCss(fontawesomeCssURL);
        this.domElement.innerHTML = "    \n      <div class=\"parentContainer\" style=\"background-color: white\">    \n      <div class=\"ms-Grid-row ms-bgColor-themeDark ms-fontColor-white " + _CrudPnpjsWebPart_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].row + "\">    \n         <div class=\"ms-Grid-col ms-u-lg ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1\">   \n         </div>    \n      </div>    \n      <div class=\"ms-Grid-row ms-bgColor-themeDark ms-fontColor-white " + _CrudPnpjsWebPart_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].row + "\">    \n         <div style=\"background-color:Black;color:white;text-align: center;font-weight: bold;font-size:x;\">CRUD Test</div>    \n      </div>    \n      <div style=\"background-color: white\" >    \n         <form>    \n            <br>    \n            <div data-role=\"header\">    \n               <h3>Add item to SharePoint List</h3>    \n            </div>    \n             <div data-role=\"main\" class=\"ui-content\">    \n               <div>    \n                 <input id=\"Assessment\" placeholder=\"Assessment\"/>    \n                 <input id=\"Medical\"  placeholder=\"Medical\"/>    \n                 <button id=\"AddItemToSPList\"  type=\"submit\" >Add</button>    \n                 <button id=\"UpdateItemInSPList\" type=\"submit\" >Update</button>    \n                 <button id=\"DeleteItemFromSPList\"  type=\"submit\" >Delete</button>  \n               </div>    \n             </div>    \n         </form>    \n      </div>    \n      <br/>    \n      <div style=\"background-color: white\" id=\"AuditDataItems\" />    \n      </div>\n      <div class=\"row text-white\" style=\"background-color: #545487;\">\n          <h3 class=\"ml-2\">Clinical Consultation Records</h3>\n      </div>\n      <div class=\"row\">\n          <div class=\"col-10\"></div>\n          <div class=\"col\">Average<br/>Yearly<br/>Score</div>\n          <div class=\"col\">Minimum<br/>Outcome</div>\n      </div>\n      <hr>\n      <div class=\"container\" style=\"overflow-y:scroll; overflow-x:hidden; height: 25vh !important;\" id=\"AuditQuestionItems\"></div>            \n      ";
        this.getAuditData();
        this.getAuditQuestions();
        this.AddEventListeners();
    };
    CrudPnpjsWebPart.prototype.AddSPListItem = function () {
        sp_pnp_js__WEBPACK_IMPORTED_MODULE_6___default.a.sp.web.lists.getByTitle('Audit Tool Data').items.add({
            Assessment: document.getElementById('Assessment')["value"],
            Medicals: document.getElementById('Medical')["value"]
        });
        alert("Record with Assessment type : " + document.getElementById('Assessment')["value"] + " Added !");
    };
    CrudPnpjsWebPart.prototype.UpdateSPListItem = function () {
        var itemID = this.domElement.querySelector('input[name = "AuditID"]:checked')["value"];
        sp_pnp_js__WEBPACK_IMPORTED_MODULE_6___default.a.sp.web.lists.getByTitle("Audit Tool Data").items.getById(itemID).update({
            Assessment: document.getElementById('Assessment')["value"],
            Medicals: document.getElementById('Medical')["value"]
        });
        alert("Record with Audit ID : " + itemID + " Updated !");
    };
    CrudPnpjsWebPart.prototype.DeleteSPListItem = function () {
        var itemID = this.domElement.querySelector('input[name = "AuditID"]:checked')["value"];
        sp_pnp_js__WEBPACK_IMPORTED_MODULE_6___default.a.sp.web.lists.getByTitle("Audit Tool Data").items.getById(itemID).delete();
        alert("Record with Audit ID : " + itemID + " Deleted !");
    };
    Object.defineProperty(CrudPnpjsWebPart.prototype, "dataVersion", {
        get: function () {
            return _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_0__["Version"].parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    CrudPnpjsWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: CrudPnpjsWebPartStrings__WEBPACK_IMPORTED_MODULE_4__["PropertyPaneDescription"]
                    },
                    groups: [
                        {
                            groupName: CrudPnpjsWebPartStrings__WEBPACK_IMPORTED_MODULE_4__["BasicGroupName"],
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_1__["PropertyPaneTextField"])('description', {
                                    label: CrudPnpjsWebPartStrings__WEBPACK_IMPORTED_MODULE_4__["DescriptionFieldLabel"]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return CrudPnpjsWebPart;
}(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2__["BaseClientSideWebPart"]));
/* harmony default export */ __webpack_exports__["default"] = (CrudPnpjsWebPart);


/***/ }),

/***/ "Vpmm":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/logging/logger.js ***!
  \*********************************************/
/*! exports provided: Logger, LogLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return Logger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogLevel", function() { return LogLevel; });
/**
 * Class used to subscribe ILogListener and log messages throughout an application
 *
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Object.defineProperty(Logger, "activeLogLevel", {
        /**
       * Gets or sets the active log level to apply for log filtering
       */
        get: function () {
            return Logger.instance.activeLogLevel;
        },
        set: function (value) {
            Logger.instance.activeLogLevel = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Logger, "instance", {
        get: function () {
            if (Logger._instance === undefined || Logger._instance === null) {
                Logger._instance = new LoggerImpl();
            }
            return Logger._instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
   * Adds ILogListener instances to the set of subscribed listeners
   *
   * @param listeners One or more listeners to subscribe to this log
   */
    Logger.subscribe = function () {
        var listeners = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            listeners[_i] = arguments[_i];
        }
        listeners.forEach(function (listener) { return Logger.instance.subscribe(listener); });
    };
    /**
   * Clears the subscribers collection, returning the collection before modification
   */
    Logger.clearSubscribers = function () {
        return Logger.instance.clearSubscribers();
    };
    Object.defineProperty(Logger, "count", {
        /**
       * Gets the current subscriber count
       */
        get: function () {
            return Logger.instance.count;
        },
        enumerable: false,
        configurable: true
    });
    /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param message The message to write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */
    Logger.write = function (message, level) {
        if (level === void 0) { level = 1 /* Info */; }
        Logger.instance.log({ level: level, message: message });
    };
    /**
   * Writes the supplied string to the subscribed listeners
   *
   * @param json The json object to stringify and write
   * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Info)
   */
    Logger.writeJSON = function (json, level) {
        if (level === void 0) { level = 1 /* Info */; }
        this.write(JSON.stringify(json), level);
    };
    /**
   * Logs the supplied entry to the subscribed listeners
   *
   * @param entry The message to log
   */
    Logger.log = function (entry) {
        Logger.instance.log(entry);
    };
    /**
   * Logs an error object to the subscribed listeners
   *
   * @param err The error object
   */
    Logger.error = function (err) {
        Logger.instance.log({ data: err, level: 3 /* Error */, message: err.message });
    };
    return Logger;
}());

var LoggerImpl = /** @class */ (function () {
    function LoggerImpl(activeLogLevel, subscribers) {
        if (activeLogLevel === void 0) { activeLogLevel = 2 /* Warning */; }
        if (subscribers === void 0) { subscribers = []; }
        this.activeLogLevel = activeLogLevel;
        this.subscribers = subscribers;
    }
    LoggerImpl.prototype.subscribe = function (listener) {
        this.subscribers.push(listener);
    };
    LoggerImpl.prototype.clearSubscribers = function () {
        var s = this.subscribers.slice(0);
        this.subscribers.length = 0;
        return s;
    };
    Object.defineProperty(LoggerImpl.prototype, "count", {
        get: function () {
            return this.subscribers.length;
        },
        enumerable: false,
        configurable: true
    });
    LoggerImpl.prototype.write = function (message, level) {
        if (level === void 0) { level = 1 /* Info */; }
        this.log({ level: level, message: message });
    };
    LoggerImpl.prototype.log = function (entry) {
        if (entry !== undefined && this.activeLogLevel <= entry.level) {
            this.subscribers.map(function (subscriber) { return subscriber.log(entry); });
        }
    };
    return LoggerImpl;
}());
/**
 * A set of logging levels
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Warning"] = 2] = "Warning";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Off"] = 99] = "Off";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=logger.js.map

/***/ }),

/***/ "W7+7":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/odata/add-prop.js ***!
  \*********************************************/
/*! exports provided: addProp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addProp", function() { return addProp; });
/**
 * Adds a property to a target instance
 *
 * @param target The object to whose prototype we will add a property
 * @param name Property name
 * @param factory Factory method used to produce the property value
 * @param path Any additional path required to produce the value
 */
function addProp(target, name, factory, path) {
    Reflect.defineProperty(target.prototype, name, {
        configurable: true,
        enumerable: true,
        get: function () {
            return factory(this, path);
        },
    });
}
//# sourceMappingURL=add-prop.js.map

/***/ }),

/***/ "WRHq":
/*!*****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/exports/graph.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ../graph/index */ "y3hc"));


/***/ }),

/***/ "WZbb":
/*!*****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/members.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
var Members = /** @class */ (function (_super) {
    __extends(Members, _super);
    function Members(baseUrl, path) {
        if (path === void 0) { path = "members"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Use this API to add a member to an Office 365 group, a security group or a mail-enabled security group through
     * the members navigation property. You can add users or other groups.
     * Important: You can add only users to Office 365 groups.
     *
     * @param id Full @odata.id of the directoryObject, user, or group object you want to add (ex: https://graph.microsoft.com/v1.0/directoryObjects/${id})
     */
    Members.prototype.add = function (id) {
        return this.clone(Members, "$ref").postCore({
            body: JSON.stringify({
                "@odata.id": id,
            }),
        });
    };
    /**
     * Gets a member of the group by id
     *
     * @param id Group member's id
     */
    Members.prototype.getById = function (id) {
        return new Member(this, id);
    };
    return Members;
}(graphqueryable_1.GraphQueryableCollection));
exports.Members = Members;
var Member = /** @class */ (function (_super) {
    __extends(Member, _super);
    function Member() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Member;
}(graphqueryable_1.GraphQueryableInstance));
exports.Member = Member;
var Owners = /** @class */ (function (_super) {
    __extends(Owners, _super);
    function Owners(baseUrl, path) {
        if (path === void 0) { path = "owners"; }
        return _super.call(this, baseUrl, path) || this;
    }
    return Owners;
}(Members));
exports.Owners = Owners;


/***/ }),

/***/ "WqsK":
/*!*******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/net/graphclient.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var pnplibconfig_1 = __webpack_require__(/*! ../configuration/pnplibconfig */ "Mvka");
var utils_1 = __webpack_require__(/*! ./utils */ "KJz+");
// import { APIUrlException } from "../utils/exceptions";
var GraphHttpClient = /** @class */ (function () {
    function GraphHttpClient() {
        this._impl = pnplibconfig_1.RuntimeConfig.graphFetchClientFactory();
    }
    GraphHttpClient.prototype.fetch = function (url, options) {
        if (options === void 0) { options = {}; }
        var headers = new Headers();
        // first we add the global headers so they can be overwritten by any passed in locally to this call
        utils_1.mergeHeaders(headers, pnplibconfig_1.RuntimeConfig.graphHeaders);
        // second we add the local options so we can overwrite the globals
        utils_1.mergeHeaders(headers, options.headers);
        var opts = util_1.Util.extend(options, { headers: headers });
        // TODO: we could process auth here
        return this.fetchRaw(url, opts);
    };
    GraphHttpClient.prototype.fetchRaw = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        // here we need to normalize the headers
        var rawHeaders = new Headers();
        utils_1.mergeHeaders(rawHeaders, options.headers);
        options = util_1.Util.extend(options, { headers: rawHeaders });
        var retry = function (ctx) {
            _this._impl.fetch(url, {}, options).then(function (response) { return ctx.resolve(response); }).catch(function (response) {
                // Check if request was throttled - http status code 429
                // Check if request failed due to server unavailable - http status code 503
                if (response.status !== 429 && response.status !== 503) {
                    ctx.reject(response);
                }
                // grab our current delay
                var delay = ctx.delay;
                // Increment our counters.
                ctx.delay *= 2;
                ctx.attempts++;
                // If we have exceeded the retry count, reject.
                if (ctx.retryCount <= ctx.attempts) {
                    ctx.reject(response);
                }
                // Set our retry timeout for {delay} milliseconds.
                setTimeout(util_1.Util.getCtxCallback(_this, retry, ctx), delay);
            });
        };
        return new Promise(function (resolve, reject) {
            var retryContext = {
                attempts: 0,
                delay: 100,
                reject: reject,
                resolve: resolve,
                retryCount: 7,
            };
            retry.call(_this, retryContext);
        });
    };
    GraphHttpClient.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { method: "GET" });
        return this.fetch(url, opts);
    };
    GraphHttpClient.prototype.post = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { method: "POST" });
        return this.fetch(url, opts);
    };
    GraphHttpClient.prototype.patch = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { method: "PATCH" });
        return this.fetch(url, opts);
    };
    GraphHttpClient.prototype.delete = function (url, options) {
        if (options === void 0) { options = {}; }
        var opts = util_1.Util.extend(options, { method: "DELETE" });
        return this.fetch(url, opts);
    };
    return GraphHttpClient;
}());
exports.GraphHttpClient = GraphHttpClient;


/***/ }),

/***/ "Xs/H":
/*!****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/photos.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
var parsers_1 = __webpack_require__(/*! ../odata/parsers */ "eGqj");
var Photo = /** @class */ (function (_super) {
    __extends(Photo, _super);
    function Photo(baseUrl, path) {
        if (path === void 0) { path = "photo"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets the image bytes as a blob (browser)
     */
    Photo.prototype.getBlob = function () {
        return this.clone(Photo, "$value", false).get(new parsers_1.BlobFileParser());
    };
    /**
     * Gets the image file byets as a Buffer (node.js)
     */
    Photo.prototype.getBuffer = function () {
        return this.clone(Photo, "$value", false).get(new parsers_1.BufferFileParser());
    };
    /**
     * Sets the file bytes
     *
     * @param content Image file contents, max 4 MB
     */
    Photo.prototype.setContent = function (content) {
        return this.clone(Photo, "$value", false).patchCore({
            body: content,
        });
    };
    return Photo;
}(graphqueryable_1.GraphQueryableInstance));
exports.Photo = Photo;


/***/ }),

/***/ "YJnM":
/*!******************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/clientsidepages.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var files_1 = __webpack_require__(/*! ./files */ "MMX7");
var items_1 = __webpack_require__(/*! ./items */ "/pGJ");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Gets the next order value 1 based for the provided collection
 *
 * @param collection Collection of orderable things
 */
function getNextOrder(collection) {
    if (collection.length < 1) {
        return 1;
    }
    return Math.max.apply(null, collection.map(function (i) { return i.order; })) + 1;
}
/**
 * After https://stackoverflow.com/questions/273789/is-there-a-version-of-javascripts-string-indexof-that-allows-for-regular-expr/274094#274094
 *
 * @param this Types the called context this to a string in which the search will be conducted
 * @param regex A regex or string to match
 * @param startpos A starting position from which the search will begin
 */
function regexIndexOf(regex, startpos) {
    if (startpos === void 0) { startpos = 0; }
    var indexOf = this.substring(startpos).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos)) : indexOf;
}
/**
 * Gets an attribute value from an html string block
 *
 * @param html HTML to search
 * @param attrName The name of the attribute to find
 */
function getAttrValueFromString(html, attrName) {
    var reg = new RegExp(attrName + "=\"([^\"]*?)\"", "i");
    var match = reg.exec(html);
    return match.length > 0 ? match[1] : null;
}
/**
 * Finds bounded blocks of markup bounded by divs, ensuring to match the ending div even with nested divs in the interstitial markup
 *
 * @param html HTML to search
 * @param boundaryStartPattern The starting pattern to find, typically a div with attribute
 * @param collector A func to take the found block and provide a way to form it into a useful return that is added into the return array
 */
function getBoundedDivMarkup(html, boundaryStartPattern, collector) {
    var blocks = [];
    if (typeof html === "undefined" || html === null) {
        return blocks;
    }
    // remove some extra whitespace if present
    var cleanedHtml = html.replace(/[\t\r\n]/g, "");
    // find the first div
    var startIndex = regexIndexOf.call(cleanedHtml, boundaryStartPattern);
    if (startIndex < 0) {
        // we found no blocks in the supplied html
        return blocks;
    }
    // this loop finds each of the blocks
    while (startIndex > -1) {
        // we have one open div counting from the one found above using boundaryStartPattern so we need to ensure we find it's close
        var openCounter = 1;
        var searchIndex = startIndex + 1;
        var nextDivOpen = -1;
        var nextCloseDiv = -1;
        // this loop finds the </div> tag that matches the opening of the control
        while (true) {
            // find both the next opening and closing div tags from our current searching index
            nextDivOpen = regexIndexOf.call(cleanedHtml, /<div[^>]*>/i, searchIndex);
            nextCloseDiv = regexIndexOf.call(cleanedHtml, /<\/div>/i, searchIndex);
            if (nextDivOpen < 0) {
                // we have no more opening divs, just set this to simplify checks below
                nextDivOpen = cleanedHtml.length + 1;
            }
            // determine which we found first, then increment or decrement our counter
            // and set the location to begin searching again
            if (nextDivOpen < nextCloseDiv) {
                openCounter++;
                searchIndex = nextDivOpen + 1;
            }
            else if (nextCloseDiv < nextDivOpen) {
                openCounter--;
                searchIndex = nextCloseDiv + 1;
            }
            // once we have no open divs back to the level of the opening control div
            // meaning we have all of the markup we intended to find
            if (openCounter === 0) {
                // get the bounded markup, +6 is the size of the ending </div> tag
                var markup = cleanedHtml.substring(startIndex, nextCloseDiv + 6).trim();
                // save the control data we found to the array
                blocks.push(collector(markup));
                // get out of our while loop
                break;
            }
            if (openCounter > 1000 || openCounter < 0) {
                // this is an arbitrary cut-off but likely we will not have 1000 nested divs
                // something has gone wrong above and we are probably stuck in our while loop
                // let's get out of our while loop and not hang everything
                throw new Error("getBoundedDivMarkup exceeded depth parameters.");
            }
        }
        // get the start of the next control
        startIndex = regexIndexOf.call(cleanedHtml, boundaryStartPattern, nextCloseDiv);
    }
    return blocks;
}
/**
 * Normalizes the order value for all the sections, columns, and controls to be 1 based and stepped (1, 2, 3...)
 *
 * @param collection The collection to normalize
 */
function reindex(collection) {
    for (var i = 0; i < collection.length; i++) {
        collection[i].order = i + 1;
        if (collection[i].hasOwnProperty("columns")) {
            reindex(collection[i].columns);
        }
        else if (collection[i].hasOwnProperty("controls")) {
            reindex(collection[i].controls);
        }
    }
}
/**
 * Represents the data and methods associated with client side "modern" pages
 */
var ClientSidePage = /** @class */ (function (_super) {
    __extends(ClientSidePage, _super);
    /**
     * Creates a new instance of the ClientSidePage class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web collection
     * @param commentsDisabled Indicates if comments are disabled, not valid until load is called
     */
    function ClientSidePage(file, sections, commentsDisabled) {
        if (sections === void 0) { sections = []; }
        if (commentsDisabled === void 0) { commentsDisabled = false; }
        var _this = _super.call(this, file) || this;
        _this.sections = sections;
        _this.commentsDisabled = commentsDisabled;
        return _this;
    }
    /**
     * Creates a new blank page within the supplied library
     *
     * @param library The library in which to create the page
     * @param pageName Filename of the page, such as "page.aspx"
     * @param title The display title of the page
     * @param pageLayoutType Layout type of the page to use
     */
    ClientSidePage.create = function (library, pageName, title, pageLayoutType) {
        if (pageLayoutType === void 0) { pageLayoutType = "Article"; }
        // see if file exists, if not create it
        return library.rootFolder.files.select("Name").filter("Name eq '" + pageName + "'").get().then(function (fs) {
            if (fs.length > 0) {
                throw new Error("A file with the name '" + pageName + "' already exists in the library '" + library.toUrl() + "'.");
            }
            // get our server relative path
            return library.rootFolder.select("ServerRelativePath").get().then(function (path) {
                var pageServerRelPath = util_1.Util.combinePaths("/", path.ServerRelativePath.DecodedUrl, pageName);
                // add the template file
                return library.rootFolder.files.addTemplateFile(pageServerRelPath, files_1.TemplateFileType.ClientSidePage).then(function (far) {
                    // get the item associated with the file
                    return far.file.getItem().then(function (i) {
                        // update the item to have the correct values to create the client side page
                        return i.update({
                            BannerImageUrl: {
                                Url: "/_layouts/15/images/sitepagethumbnail.png",
                            },
                            CanvasContent1: "",
                            ClientSideApplicationId: "b6917cb1-93a0-4b97-a84d-7cf49975d4ec",
                            ContentTypeId: "0x0101009D1CB255DA76424F860D91F20E6C4118",
                            PageLayoutType: pageLayoutType,
                            PromotedState: 0 /* NotPromoted */,
                            Title: title,
                        }).then(function (iar) { return new ClientSidePage(iar.item.file, iar.item.CommentsDisabled); });
                    });
                });
            });
        });
    };
    /**
     * Creates a new ClientSidePage instance from the provided html content string
     *
     * @param html HTML markup representing the page
     */
    ClientSidePage.fromFile = function (file) {
        var page = new ClientSidePage(file);
        return page.load().then(function (_) { return page; });
    };
    /**
     * Converts a json object to an escaped string appropriate for use in attributes when storing client-side controls
     *
     * @param json The json object to encode into a string
     */
    ClientSidePage.jsonToEscapedString = function (json) {
        return JSON.stringify(json)
            .replace(/"/g, "&quot;")
            .replace(/:/g, "&#58;")
            .replace(/{/g, "&#123;")
            .replace(/}/g, "&#125;");
    };
    /**
     * Converts an escaped string from a client-side control attribute to a json object
     *
     * @param escapedString
     */
    ClientSidePage.escapedStringToJson = function (escapedString) {
        return JSON.parse(escapedString
            .replace(/&quot;/g, "\"")
            .replace(/&#58;/g, ":")
            .replace(/&#123;/g, "{")
            .replace(/&#125;/g, "}"));
    };
    /**
     * Add a section to this page
     */
    ClientSidePage.prototype.addSection = function () {
        var section = new CanvasSection(this, getNextOrder(this.sections));
        this.sections.push(section);
        return section;
    };
    /**
     * Converts this page's content to html markup
     */
    ClientSidePage.prototype.toHtml = function () {
        // trigger reindex of the entire tree
        reindex(this.sections);
        var html = [];
        html.push("<div>");
        for (var i = 0; i < this.sections.length; i++) {
            html.push(this.sections[i].toHtml());
        }
        html.push("</div>");
        return html.join("");
    };
    /**
     * Loads this page instance's content from the supplied html
     *
     * @param html html string representing the page's content
     */
    ClientSidePage.prototype.fromHtml = function (html) {
        var _this = this;
        // reset sections
        this.sections = [];
        // gather our controls from the supplied html
        getBoundedDivMarkup(html, /<div\b[^>]*data-sp-canvascontrol[^>]*?>/i, function (markup) {
            // get the control type
            var ct = /controlType&quot;&#58;(\d*?),/i.exec(markup);
            // if no control type is present this is a column which we give type 0 to let us process it
            var controlType = ct == null || ct.length < 2 ? 0 : parseInt(ct[1], 10);
            var control = null;
            switch (controlType) {
                case 0:
                    // empty canvas column
                    control = new CanvasColumn(null, 0);
                    control.fromHtml(markup);
                    _this.mergeColumnToTree(control);
                    break;
                case 3:
                    // client side webpart
                    control = new ClientSideWebpart("");
                    control.fromHtml(markup);
                    _this.mergeControlToTree(control);
                    break;
                case 4:
                    // client side text
                    control = new ClientSideText();
                    control.fromHtml(markup);
                    _this.mergeControlToTree(control);
                    break;
            }
        });
        reindex(this.sections);
        return this;
    };
    /**
     * Loads this page's content from the server
     */
    ClientSidePage.prototype.load = function () {
        var _this = this;
        return this.getItem("CanvasContent1", "CommentsDisabled").then(function (item) {
            _this.fromHtml(item.CanvasContent1);
            _this.commentsDisabled = item.CommentsDisabled;
        });
    };
    /**
     * Persists the content changes (sections, columns, and controls)
     */
    ClientSidePage.prototype.save = function () {
        return this.updateProperties({ CanvasContent1: this.toHtml() });
    };
    /**
     * Enables comments on this page
     */
    ClientSidePage.prototype.enableComments = function () {
        var _this = this;
        return this.setCommentsOn(true).then(function (r) {
            _this.commentsDisabled = false;
            return r;
        });
    };
    /**
     * Disables comments on this page
     */
    ClientSidePage.prototype.disableComments = function () {
        var _this = this;
        return this.setCommentsOn(false).then(function (r) {
            _this.commentsDisabled = true;
            return r;
        });
    };
    /**
     * Finds a control by the specified instance id
     *
     * @param id Instance id of the control to find
     */
    ClientSidePage.prototype.findControlById = function (id) {
        return this.findControl(function (c) { return c.id === id; });
    };
    /**
     * Finds a control within this page's control tree using the supplied predicate
     *
     * @param predicate Takes a control and returns true or false, if true that control is returned by findControl
     */
    ClientSidePage.prototype.findControl = function (predicate) {
        // check all sections
        for (var i = 0; i < this.sections.length; i++) {
            // check all columns
            for (var j = 0; j < this.sections[i].columns.length; j++) {
                // check all controls
                for (var k = 0; k < this.sections[i].columns[j].controls.length; k++) {
                    // check to see if the predicate likes this control
                    if (predicate(this.sections[i].columns[j].controls[k])) {
                        return this.sections[i].columns[j].controls[k];
                    }
                }
            }
        }
        // we found nothing so give nothing back
        return null;
    };
    /**
     * Sets the comments flag for a page
     *
     * @param on If true comments are enabled, false they are disabled
     */
    ClientSidePage.prototype.setCommentsOn = function (on) {
        return this.getItem().then(function (i) {
            var updater = new items_1.Item(i, "SetCommentsDisabled(" + !on + ")");
            return updater.update({});
        });
    };
    /**
     * Merges the control into the tree of sections and columns for this page
     *
     * @param control The control to merge
     */
    ClientSidePage.prototype.mergeControlToTree = function (control) {
        var section = null;
        var column = null;
        var sections = this.sections.filter(function (s) { return s.order === control.controlData.position.zoneIndex; });
        if (sections.length < 1) {
            section = new CanvasSection(this, control.controlData.position.zoneIndex);
            this.sections.push(section);
        }
        else {
            section = sections[0];
        }
        var columns = section.columns.filter(function (c) { return c.order === control.controlData.position.sectionIndex; });
        if (columns.length < 1) {
            column = new CanvasColumn(section, control.controlData.position.sectionIndex, control.controlData.position.sectionFactor);
            section.columns.push(column);
        }
        else {
            column = columns[0];
        }
        control.column = column;
        column.addControl(control);
    };
    /**
     * Merges the supplied column into the tree
     *
     * @param column Column to merge
     * @param position The position data for the column
     */
    ClientSidePage.prototype.mergeColumnToTree = function (column) {
        var section = null;
        var sections = this.sections.filter(function (s) { return s.order === column.controlData.position.zoneIndex; });
        if (sections.length < 1) {
            section = new CanvasSection(this, column.controlData.position.zoneIndex);
            this.sections.push(section);
        }
        else {
            section = sections[0];
        }
        column.section = section;
        section.columns.push(column);
    };
    /**
     * Updates the properties of the underlying ListItem associated with this ClientSidePage
     *
     * @param properties Set of properties to update
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    ClientSidePage.prototype.updateProperties = function (properties, eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return this.getItem().then(function (i) { return i.update(properties, eTag); });
    };
    return ClientSidePage;
}(files_1.File));
exports.ClientSidePage = ClientSidePage;
var CanvasSection = /** @class */ (function () {
    function CanvasSection(page, order, columns) {
        if (columns === void 0) { columns = []; }
        this.page = page;
        this.order = order;
        this.columns = columns;
    }
    Object.defineProperty(CanvasSection.prototype, "defaultColumn", {
        /**
         * Default column (this.columns[0]) for this section
         */
        get: function () {
            if (this.columns.length < 1) {
                this.addColumn(12);
            }
            return this.columns[0];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a new column to this section
     */
    CanvasSection.prototype.addColumn = function (factor) {
        var column = new CanvasColumn(this, getNextOrder(this.columns), factor);
        this.columns.push(column);
        return column;
    };
    /**
     * Adds a control to the default column for this section
     *
     * @param control Control to add to the default column
     */
    CanvasSection.prototype.addControl = function (control) {
        this.defaultColumn.addControl(control);
        return this;
    };
    CanvasSection.prototype.toHtml = function () {
        var html = [];
        for (var i = 0; i < this.columns.length; i++) {
            html.push(this.columns[i].toHtml());
        }
        return html.join("");
    };
    return CanvasSection;
}());
exports.CanvasSection = CanvasSection;
var CanvasControl = /** @class */ (function () {
    function CanvasControl(controlType, dataVersion, column, order, id, controlData) {
        if (column === void 0) { column = null; }
        if (order === void 0) { order = 1; }
        if (id === void 0) { id = util_1.Util.getGUID(); }
        if (controlData === void 0) { controlData = null; }
        this.controlType = controlType;
        this.dataVersion = dataVersion;
        this.column = column;
        this.order = order;
        this.id = id;
        this.controlData = controlData;
    }
    Object.defineProperty(CanvasControl.prototype, "jsonData", {
        /**
         * Value of the control's "data-sp-controldata" attribute
         */
        get: function () {
            return ClientSidePage.jsonToEscapedString(this.getControlData());
        },
        enumerable: true,
        configurable: true
    });
    CanvasControl.prototype.fromHtml = function (html) {
        this.controlData = ClientSidePage.escapedStringToJson(getAttrValueFromString(html, "data-sp-controldata"));
        this.dataVersion = getAttrValueFromString(html, "data-sp-canvasdataversion");
        this.controlType = this.controlData.controlType;
        this.id = this.controlData.id;
    };
    return CanvasControl;
}());
exports.CanvasControl = CanvasControl;
var CanvasColumn = /** @class */ (function (_super) {
    __extends(CanvasColumn, _super);
    function CanvasColumn(section, order, factor, controls, dataVersion) {
        if (factor === void 0) { factor = 12; }
        if (controls === void 0) { controls = []; }
        if (dataVersion === void 0) { dataVersion = "1.0"; }
        var _this = _super.call(this, 0, dataVersion) || this;
        _this.section = section;
        _this.order = order;
        _this.factor = factor;
        _this.controls = controls;
        return _this;
    }
    CanvasColumn.prototype.addControl = function (control) {
        control.column = this;
        this.controls.push(control);
        return this;
    };
    CanvasColumn.prototype.getControl = function (index) {
        return this.controls[index];
    };
    CanvasColumn.prototype.toHtml = function () {
        var html = [];
        if (this.controls.length < 1) {
            html.push("<div data-sp-canvascontrol=\"\" data-sp-canvasdataversion=\"" + this.dataVersion + "\" data-sp-controldata=\"" + this.jsonData + "\"></div>");
        }
        else {
            for (var i = 0; i < this.controls.length; i++) {
                html.push(this.controls[i].toHtml(i + 1));
            }
        }
        return html.join("");
    };
    CanvasColumn.prototype.fromHtml = function (html) {
        _super.prototype.fromHtml.call(this, html);
        this.controlData = ClientSidePage.escapedStringToJson(getAttrValueFromString(html, "data-sp-controldata"));
        this.factor = this.controlData.position.sectionFactor;
        this.order = this.controlData.position.sectionIndex;
    };
    CanvasColumn.prototype.getControlData = function () {
        return {
            displayMode: 2,
            position: {
                sectionFactor: this.factor,
                sectionIndex: this.order,
                zoneIndex: this.section.order,
            },
        };
    };
    return CanvasColumn;
}(CanvasControl));
exports.CanvasColumn = CanvasColumn;
var ClientSideText = /** @class */ (function (_super) {
    __extends(ClientSideText, _super);
    function ClientSideText(text) {
        if (text === void 0) { text = ""; }
        var _this = _super.call(this, 4, "1.0") || this;
        _this.text = text;
        return _this;
    }
    Object.defineProperty(ClientSideText.prototype, "text", {
        /**
         * The text markup of this control
         */
        get: function () {
            return this._text;
        },
        set: function (text) {
            if (!text.startsWith("<p>")) {
                text = "<p>" + text + "</p>";
            }
            this._text = text;
        },
        enumerable: true,
        configurable: true
    });
    ClientSideText.prototype.getControlData = function () {
        return {
            controlType: this.controlType,
            editorType: "CKEditor",
            id: this.id,
            position: {
                controlIndex: this.order,
                sectionFactor: this.column.factor,
                sectionIndex: this.column.order,
                zoneIndex: this.column.section.order,
            },
        };
    };
    ClientSideText.prototype.toHtml = function (index) {
        // set our order to the value passed in
        this.order = index;
        var html = [];
        html.push("<div data-sp-canvascontrol=\"\" data-sp-canvasdataversion=\"" + this.dataVersion + "\" data-sp-controldata=\"" + this.jsonData + "\">");
        html.push("<div data-sp-rte=\"\">");
        html.push("" + this.text);
        html.push("</div>");
        html.push("</div>");
        return html.join("");
    };
    ClientSideText.prototype.fromHtml = function (html) {
        _super.prototype.fromHtml.call(this, html);
        var match = /<div[^>]*data-sp-rte[^>]*>(.*?)<\/div>$/i.exec(html);
        this.text = match.length > 1 ? match[1] : "";
    };
    return ClientSideText;
}(CanvasControl));
exports.ClientSideText = ClientSideText;
var ClientSideWebpart = /** @class */ (function (_super) {
    __extends(ClientSideWebpart, _super);
    function ClientSideWebpart(title, description, propertieJson, webPartId, htmlProperties, serverProcessedContent) {
        if (description === void 0) { description = ""; }
        if (propertieJson === void 0) { propertieJson = {}; }
        if (webPartId === void 0) { webPartId = ""; }
        if (htmlProperties === void 0) { htmlProperties = ""; }
        if (serverProcessedContent === void 0) { serverProcessedContent = null; }
        var _this = _super.call(this, 3, "1.0") || this;
        _this.title = title;
        _this.description = description;
        _this.propertieJson = propertieJson;
        _this.webPartId = webPartId;
        _this.htmlProperties = htmlProperties;
        _this.serverProcessedContent = serverProcessedContent;
        return _this;
    }
    ClientSideWebpart.fromComponentDef = function (definition) {
        var part = new ClientSideWebpart("");
        part.import(definition);
        return part;
    };
    ClientSideWebpart.prototype.import = function (component) {
        this.webPartId = component.Id.replace(/^\{|\}$/g, "");
        var manifest = JSON.parse(component.Manifest);
        this.title = manifest.preconfiguredEntries[0].title.default;
        this.description = manifest.preconfiguredEntries[0].description.default;
        this.propertieJson = this.parseJsonProperties(manifest.preconfiguredEntries[0].properties);
    };
    ClientSideWebpart.prototype.setProperties = function (properties) {
        this.propertieJson = properties;
        return this;
    };
    ClientSideWebpart.prototype.getProperties = function () {
        return this.propertieJson;
    };
    ClientSideWebpart.prototype.toHtml = function (index) {
        // set our order to the value passed in
        this.order = index;
        // will form the value of the data-sp-webpartdata attribute
        var data = {
            dataVersion: this.dataVersion,
            description: this.description,
            id: this.webPartId,
            instanceId: this.id,
            properties: this.propertieJson,
            title: this.title,
        };
        var html = [];
        html.push("<div data-sp-canvascontrol=\"\" data-sp-canvasdataversion=\"" + this.dataVersion + "\" data-sp-controldata=\"" + this.jsonData + "\">");
        html.push("<div data-sp-webpart=\"\" data-sp-canvasdataversion=\"" + this.dataVersion + "\" data-sp-webpartdata=\"" + ClientSidePage.jsonToEscapedString(data) + "\">");
        html.push("<div data-sp-componentid>");
        html.push(this.webPartId);
        html.push("</div>");
        html.push("<div data-sp-htmlproperties=\"\">");
        html.push(this.renderHtmlProperties());
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        return html.join("");
    };
    ClientSideWebpart.prototype.fromHtml = function (html) {
        _super.prototype.fromHtml.call(this, html);
        var webPartData = ClientSidePage.escapedStringToJson(getAttrValueFromString(html, "data-sp-webpartdata"));
        this.title = webPartData.title;
        this.description = webPartData.description;
        this.webPartId = webPartData.id;
        this.setProperties(webPartData.properties);
        if (typeof webPartData.serverProcessedContent !== "undefined") {
            this.serverProcessedContent = webPartData.serverProcessedContent;
        }
        // get our html properties
        var htmlProps = getBoundedDivMarkup(html, /<div\b[^>]*data-sp-htmlproperties[^>]*?>/i, function (markup) {
            return markup.replace(/^<div\b[^>]*data-sp-htmlproperties[^>]*?>/i, "").replace(/<\/div>$/i, "");
        });
        this.htmlProperties = htmlProps.length > 0 ? htmlProps[0] : "";
    };
    ClientSideWebpart.prototype.getControlData = function () {
        return {
            controlType: this.controlType,
            id: this.id,
            position: {
                controlIndex: this.order,
                sectionFactor: this.column.factor,
                sectionIndex: this.column.order,
                zoneIndex: this.column.section.order,
            },
            webPartId: this.webPartId,
        };
    };
    ClientSideWebpart.prototype.renderHtmlProperties = function () {
        var html = [];
        if (typeof this.serverProcessedContent === "undefined" || this.serverProcessedContent === null) {
            html.push(this.htmlProperties);
        }
        else if (typeof this.serverProcessedContent !== "undefined") {
            if (typeof this.serverProcessedContent.searchablePlainTexts !== "undefined") {
                for (var i = 0; i < this.serverProcessedContent.searchablePlainTexts.length; i++) {
                    var prop = this.serverProcessedContent.searchablePlainTexts[i];
                    html.push("<div data-sp-prop-name=\"" + prop.Name + "\" data-sp-searchableplaintext=\"true\">");
                    html.push(prop.Value);
                    html.push("</div>");
                }
            }
            if (typeof this.serverProcessedContent.imageSources !== "undefined") {
                for (var i = 0; i < this.serverProcessedContent.imageSources.length; i++) {
                    var prop = this.serverProcessedContent.imageSources[i];
                    html.push("<img data-sp-prop-name=\"" + prop.Name + "\" src=\"" + prop.Value + "\" />");
                }
            }
            if (typeof this.serverProcessedContent.links !== "undefined") {
                for (var i = 0; i < this.serverProcessedContent.links.length; i++) {
                    var prop = this.serverProcessedContent.links[i];
                    html.push("<a data-sp-prop-name=\"" + prop.Name + "\" href=\"" + prop.Value + "\"></a>");
                }
            }
        }
        return html.join("");
    };
    ClientSideWebpart.prototype.parseJsonProperties = function (props) {
        // If the web part has the serverProcessedContent property then keep this one as it might be needed as input to render the web part HTML later on
        if (typeof props.webPartData !== "undefined" && typeof props.webPartData.serverProcessedContent !== "undefined") {
            this.serverProcessedContent = props.webPartData.serverProcessedContent;
        }
        else if (typeof props.serverProcessedContent !== "undefined") {
            this.serverProcessedContent = props.serverProcessedContent;
        }
        else {
            this.serverProcessedContent = null;
        }
        if (typeof props.webPartData !== "undefined" && typeof props.webPartData.properties !== "undefined") {
            return props.webPartData.properties;
        }
        else if (typeof props.properties !== "undefined") {
            return props.properties;
        }
        else {
            return props;
        }
    };
    return ClientSideWebpart;
}(CanvasControl));
exports.ClientSideWebpart = ClientSideWebpart;


/***/ }),

/***/ "Z4xO":
/*!********************************************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/configuration/providers/cachingConfigurationProvider.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var storage = __webpack_require__(/*! ../../utils/storage */ "q1wT");
var exceptions_1 = __webpack_require__(/*! ../../utils/exceptions */ "tv1o");
/**
 * A caching provider which can wrap other non-caching providers
 *
 */
var CachingConfigurationProvider = /** @class */ (function () {
    /**
     * Creates a new caching configuration provider
     * @constructor
     * @param {IConfigurationProvider} wrappedProvider Provider which will be used to fetch the configuration
     * @param {string} cacheKey Key that will be used to store cached items to the cache
     * @param {IPnPClientStore} cacheStore OPTIONAL storage, which will be used to store cached settings.
     */
    function CachingConfigurationProvider(wrappedProvider, cacheKey, cacheStore) {
        this.wrappedProvider = wrappedProvider;
        this.store = (cacheStore) ? cacheStore : this.selectPnPCache();
        this.cacheKey = "_configcache_" + cacheKey;
    }
    /**
     * Gets the wrapped configuration providers
     *
     * @return {IConfigurationProvider} Wrapped configuration provider
     */
    CachingConfigurationProvider.prototype.getWrappedProvider = function () {
        return this.wrappedProvider;
    };
    /**
     * Loads the configuration values either from the cache or from the wrapped provider
     *
     * @return {Promise<TypedHash<string>>} Promise of loaded configuration values
     */
    CachingConfigurationProvider.prototype.getConfiguration = function () {
        var _this = this;
        // Cache not available, pass control to  the wrapped provider
        if ((!this.store) || (!this.store.enabled)) {
            return this.wrappedProvider.getConfiguration();
        }
        // Value is found in cache, return it directly
        var cachedConfig = this.store.get(this.cacheKey);
        if (cachedConfig) {
            return new Promise(function (resolve) {
                resolve(cachedConfig);
            });
        }
        // Get and cache value from the wrapped provider
        var providerPromise = this.wrappedProvider.getConfiguration();
        providerPromise.then(function (providedConfig) {
            _this.store.put(_this.cacheKey, providedConfig);
        });
        return providerPromise;
    };
    CachingConfigurationProvider.prototype.selectPnPCache = function () {
        var pnpCache = new storage.PnPClientStorage();
        if ((pnpCache.local) && (pnpCache.local.enabled)) {
            return pnpCache.local;
        }
        if ((pnpCache.session) && (pnpCache.session.enabled)) {
            return pnpCache.session;
        }
        throw new exceptions_1.NoCacheAvailableException();
    };
    return CachingConfigurationProvider;
}());
exports.default = CachingConfigurationProvider;


/***/ }),

/***/ "Zl34":
/*!********************************************!*\
  !*** ./node_modules/@pnp/odata/caching.js ***!
  \********************************************/
/*! exports provided: CachingOptions, CachingParserWrapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CachingOptions", function() { return CachingOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CachingParserWrapper", function() { return CachingParserWrapper; });
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/common */ "zqEK");

var storage = new _pnp_common__WEBPACK_IMPORTED_MODULE_0__["PnPClientStorage"]();
var CachingOptions = /** @class */ (function () {
    function CachingOptions(key, storeName, expiration) {
        this.key = key;
        this.storeName = storeName;
        this.expiration = expiration;
    }
    Object.defineProperty(CachingOptions.prototype, "store", {
        get: function () {
            if (this.storeName === "local") {
                return storage.local;
            }
            else {
                return storage.session;
            }
        },
        enumerable: false,
        configurable: true
    });
    return CachingOptions;
}());

var CachingParserWrapper = /** @class */ (function () {
    function CachingParserWrapper(parser, cacheOptions) {
        this.parser = parser;
        this.cacheOptions = cacheOptions;
    }
    CachingParserWrapper.prototype.parse = function (response) {
        var _this = this;
        return this.parser.parse(response).then(function (r) { return _this.cacheData(r); });
    };
    CachingParserWrapper.prototype.cacheData = function (data) {
        if (this.cacheOptions.store !== null) {
            this.cacheOptions.store.put(this.cacheOptions.key, data, this.cacheOptions.expiration);
        }
        return data;
    };
    return CachingParserWrapper;
}());

//# sourceMappingURL=caching.js.map

/***/ }),

/***/ "a1BX":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/request/pipeline.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var caching_1 = __webpack_require__(/*! ../odata/caching */ "7+BY");
var logging_1 = __webpack_require__(/*! ../utils/logging */ "2C3z");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Resolves the context's result value
 *
 * @param context The current context
 */
function returnResult(context) {
    logging_1.Logger.log({
        data: context.result,
        level: logging_1.LogLevel.Verbose,
        message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") Returning result, see data property for value.",
    });
    return Promise.resolve(context.result);
}
/**
 * Sets the result on the context
 */
function setResult(context, value) {
    return new Promise(function (resolve) {
        context.result = value;
        context.hasResult = true;
        resolve(context);
    });
}
exports.setResult = setResult;
/**
 * Invokes the next method in the provided context's pipeline
 *
 * @param c The current request context
 */
function next(c) {
    if (c.pipeline.length < 1) {
        return Promise.resolve(c);
    }
    return c.pipeline.shift()(c);
}
/**
 * Executes the current request context's pipeline
 *
 * @param context Current context
 */
function pipe(context) {
    return next(context)
        .then(function (ctx) { return returnResult(ctx); })
        .catch(function (e) {
        logging_1.Logger.log({
            data: e,
            level: logging_1.LogLevel.Error,
            message: "Error in request pipeline: " + e.message,
        });
        throw e;
    });
}
exports.pipe = pipe;
/**
 * decorator factory applied to methods in the pipeline to control behavior
 */
function requestPipelineMethod(alwaysRun) {
    if (alwaysRun === void 0) { alwaysRun = false; }
    return function (target, propertyKey, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // if we have a result already in the pipeline, pass it along and don't call the tagged method
            if (!alwaysRun && args.length > 0 && args[0].hasOwnProperty("hasResult") && args[0].hasResult) {
                logging_1.Logger.write("[" + args[0].requestId + "] (" + (new Date()).getTime() + ") Skipping request pipeline method " + propertyKey + ", existing result in pipeline.", logging_1.LogLevel.Verbose);
                return Promise.resolve(args[0]);
            }
            // apply the tagged method
            logging_1.Logger.write("[" + args[0].requestId + "] (" + (new Date()).getTime() + ") Calling request pipeline method " + propertyKey + ".", logging_1.LogLevel.Verbose);
            // then chain the next method in the context's pipeline - allows for dynamic pipeline
            return method.apply(target, args).then(function (ctx) { return next(ctx); });
        };
    };
}
exports.requestPipelineMethod = requestPipelineMethod;
/**
 * Contains the methods used within the request pipeline
 */
var PipelineMethods = /** @class */ (function () {
    function PipelineMethods() {
    }
    /**
     * Logs the start of the request
     */
    PipelineMethods.logStart = function (context) {
        return new Promise(function (resolve) {
            logging_1.Logger.log({
                data: logging_1.Logger.activeLogLevel === logging_1.LogLevel.Info ? {} : context,
                level: logging_1.LogLevel.Info,
                message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") Beginning " + context.verb + " request (" + context.requestAbsoluteUrl + ")",
            });
            resolve(context);
        });
    };
    /**
     * Handles caching of the request
     */
    PipelineMethods.caching = function (context) {
        return new Promise(function (resolve) {
            // handle caching, if applicable
            if (context.verb === "GET" && context.isCached) {
                logging_1.Logger.write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Caching is enabled for request, checking cache...", logging_1.LogLevel.Info);
                var cacheOptions = new caching_1.CachingOptions(context.requestAbsoluteUrl.toLowerCase());
                if (typeof context.cachingOptions !== "undefined") {
                    cacheOptions = util_1.Util.extend(cacheOptions, context.cachingOptions);
                }
                // we may not have a valid store
                if (cacheOptions.store !== null) {
                    // check if we have the data in cache and if so resolve the promise and return
                    var data = cacheOptions.store.get(cacheOptions.key);
                    if (data !== null) {
                        // ensure we clear any help batch dependency we are resolving from the cache
                        logging_1.Logger.log({
                            data: logging_1.Logger.activeLogLevel === logging_1.LogLevel.Info ? {} : data,
                            level: logging_1.LogLevel.Info,
                            message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") Value returned from cache.",
                        });
                        context.batchDependency();
                        // handle the case where a parser needs to take special actions with a cached result (such as getAs)
                        if (context.parser.hasOwnProperty("hydrate")) {
                            data = context.parser.hydrate(data);
                        }
                        return setResult(context, data).then(function (ctx) { return resolve(ctx); });
                    }
                }
                logging_1.Logger.write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Value not found in cache.", logging_1.LogLevel.Info);
                // if we don't then wrap the supplied parser in the caching parser wrapper
                // and send things on their way
                context.parser = new caching_1.CachingParserWrapper(context.parser, cacheOptions);
            }
            return resolve(context);
        });
    };
    /**
     * Sends the request
     */
    PipelineMethods.send = function (context) {
        return new Promise(function (resolve, reject) {
            // send or batch the request
            if (context.isBatched) {
                // we are in a batch, so add to batch, remove dependency, and resolve with the batch's promise
                var p = context.batch.add(context.requestAbsoluteUrl, context.verb, context.options, context.parser);
                // we release the dependency here to ensure the batch does not execute until the request is added to the batch
                context.batchDependency();
                logging_1.Logger.write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Batching request in batch " + context.batch.batchId + ".", logging_1.LogLevel.Info);
                // we set the result as the promise which will be resolved by the batch's execution
                resolve(setResult(context, p));
            }
            else {
                logging_1.Logger.write("[" + context.requestId + "] (" + (new Date()).getTime() + ") Sending request.", logging_1.LogLevel.Info);
                // we are not part of a batch, so proceed as normal
                var client = context.clientFactory();
                var opts = util_1.Util.extend(context.options || {}, { method: context.verb });
                client.fetch(context.requestAbsoluteUrl, opts)
                    .then(function (response) { return context.parser.parse(response); })
                    .then(function (result) { return setResult(context, result); })
                    .then(function (ctx) { return resolve(ctx); })
                    .catch(function (e) { return reject(e); });
            }
        });
    };
    /**
     * Logs the end of the request
     */
    PipelineMethods.logEnd = function (context) {
        return new Promise(function (resolve) {
            if (context.isBatched) {
                logging_1.Logger.log({
                    data: logging_1.Logger.activeLogLevel === logging_1.LogLevel.Info ? {} : context,
                    level: logging_1.LogLevel.Info,
                    message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") " + context.verb + " request will complete in batch " + context.batch.batchId + ".",
                });
            }
            else {
                logging_1.Logger.log({
                    data: logging_1.Logger.activeLogLevel === logging_1.LogLevel.Info ? {} : context,
                    level: logging_1.LogLevel.Info,
                    message: "[" + context.requestId + "] (" + (new Date()).getTime() + ") Completing " + context.verb + " request.",
                });
            }
            resolve(context);
        });
    };
    Object.defineProperty(PipelineMethods, "default", {
        get: function () {
            return [
                PipelineMethods.logStart,
                PipelineMethods.caching,
                PipelineMethods.send,
                PipelineMethods.logEnd,
            ];
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        requestPipelineMethod(true)
    ], PipelineMethods, "logStart", null);
    __decorate([
        requestPipelineMethod()
    ], PipelineMethods, "caching", null);
    __decorate([
        requestPipelineMethod()
    ], PipelineMethods, "send", null);
    __decorate([
        requestPipelineMethod(true)
    ], PipelineMethods, "logEnd", null);
    return PipelineMethods;
}());
exports.PipelineMethods = PipelineMethods;


/***/ }),

/***/ "aH1g":
/*!************************************************!*\
  !*** ./node_modules/@pnp/logging/listeners.js ***!
  \************************************************/
/*! exports provided: ConsoleListener, FunctionListener */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConsoleListener", function() { return ConsoleListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionListener", function() { return FunctionListener; });
/**
 * Implementation of LogListener which logs to the console
 *
 */
var ConsoleListener = /** @class */ (function () {
    function ConsoleListener() {
    }
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    ConsoleListener.prototype.log = function (entry) {
        var msg = this.format(entry);
        switch (entry.level) {
            case 0 /* Verbose */:
            case 1 /* Info */:
                console.log(msg);
                break;
            case 2 /* Warning */:
                console.warn(msg);
                break;
            case 3 /* Error */:
                console.error(msg);
                break;
        }
    };
    /**
     * Formats the message
     *
     * @param entry The information to format into a string
     */
    ConsoleListener.prototype.format = function (entry) {
        var msg = [];
        msg.push("Message: " + entry.message);
        if (entry.data !== undefined) {
            try {
                msg.push(" Data: " + JSON.stringify(entry.data));
            }
            catch (e) {
                msg.push(" Data: Error in stringify of supplied data " + e);
            }
        }
        return msg.join("");
    };
    return ConsoleListener;
}());

/**
 * Implementation of LogListener which logs to the supplied function
 *
 */
var FunctionListener = /** @class */ (function () {
    /**
     * Creates a new instance of the FunctionListener class
     *
     * @constructor
     * @param  method The method to which any logging data will be passed
     */
    function FunctionListener(method) {
        this.method = method;
    }
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     *
     * @param entry The information to be logged
     */
    FunctionListener.prototype.log = function (entry) {
        this.method(entry);
    };
    return FunctionListener;
}());

//# sourceMappingURL=listeners.js.map

/***/ }),

/***/ "bk0Y":
/*!**************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/utils/util.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var pnplibconfig_1 = __webpack_require__(/*! ../configuration/pnplibconfig */ "Mvka");
function extractWebUrl(candidateUrl) {
    if (candidateUrl === null) {
        return "";
    }
    var index = candidateUrl.indexOf("_api/");
    if (index > -1) {
        return candidateUrl.substr(0, index);
    }
    // if all else fails just give them what they gave us back
    return candidateUrl;
}
exports.extractWebUrl = extractWebUrl;
var Util = /** @class */ (function () {
    function Util() {
    }
    /**
     * Gets a callback function which will maintain context across async calls.
     * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
     *
     * @param context The object that will be the 'this' value in the callback
     * @param method The method to which we will apply the context and parameters
     * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
     */
    Util.getCtxCallback = function (context, method) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        return function () {
            method.apply(context, params);
        };
    };
    /**
     * Tests if a url param exists
     *
     * @param name The name of the url paramter to check
     */
    Util.urlParamExists = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        return regex.test(location.search);
    };
    /**
     * Gets a url param value by name
     *
     * @param name The name of the paramter for which we want the value
     */
    Util.getUrlParamByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    /**
     * Gets a url param by name and attempts to parse a bool value
     *
     * @param name The name of the paramter for which we want the boolean value
     */
    Util.getUrlParamBoolByName = function (name) {
        var p = this.getUrlParamByName(name);
        var isFalse = (p === "" || /false|0/i.test(p));
        return !isFalse;
    };
    /**
     * Inserts the string s into the string target as the index specified by index
     *
     * @param target The string into which we will insert s
     * @param index The location in target to insert s (zero based)
     * @param s The string to insert into target at position index
     */
    Util.stringInsert = function (target, index, s) {
        if (index > 0) {
            return target.substring(0, index) + s + target.substring(index, target.length);
        }
        return s + target;
    };
    /**
     * Adds a value to a date
     *
     * @param date The date to which we will add units, done in local time
     * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
     * @param units The amount to add to date of the given interval
     *
     * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
     */
    Util.dateAdd = function (date, interval, units) {
        var ret = new Date(date); // don't change original date
        switch (interval.toLowerCase()) {
            case "year":
                ret.setFullYear(ret.getFullYear() + units);
                break;
            case "quarter":
                ret.setMonth(ret.getMonth() + 3 * units);
                break;
            case "month":
                ret.setMonth(ret.getMonth() + units);
                break;
            case "week":
                ret.setDate(ret.getDate() + 7 * units);
                break;
            case "day":
                ret.setDate(ret.getDate() + units);
                break;
            case "hour":
                ret.setTime(ret.getTime() + units * 3600000);
                break;
            case "minute":
                ret.setTime(ret.getTime() + units * 60000);
                break;
            case "second":
                ret.setTime(ret.getTime() + units * 1000);
                break;
            default:
                ret = undefined;
                break;
        }
        return ret;
    };
    /**
     * Loads a stylesheet into the current page
     *
     * @param path The url to the stylesheet
     * @param avoidCache If true a value will be appended as a query string to avoid browser caching issues
     */
    Util.loadStylesheet = function (path, avoidCache) {
        if (avoidCache) {
            path += "?" + encodeURIComponent((new Date()).getTime().toString());
        }
        var head = document.getElementsByTagName("head");
        if (head.length > 0) {
            var e = document.createElement("link");
            head[0].appendChild(e);
            e.setAttribute("type", "text/css");
            e.setAttribute("rel", "stylesheet");
            e.setAttribute("href", path);
        }
    };
    /**
     * Combines an arbitrary set of paths ensuring that the slashes are normalized
     *
     * @param paths 0 to n path parts to combine
     */
    Util.combinePaths = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return paths
            .filter(function (path) { return !Util.stringIsNullOrEmpty(path); })
            .map(function (path) { return path.replace(/^[\\|\/]/, "").replace(/[\\|\/]$/, ""); })
            .join("/")
            .replace(/\\/g, "/");
    };
    /**
     * Gets a random string of chars length
     *
     * @param chars The length of the random string to generate
     */
    Util.getRandomString = function (chars) {
        var text = new Array(chars);
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < chars; i++) {
            text[i] = possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text.join("");
    };
    /**
     * Gets a random GUID value
     *
     * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     */
    /* tslint:disable no-bitwise */
    Util.getGUID = function () {
        var d = new Date().getTime();
        var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return guid;
    };
    /* tslint:enable */
    /**
     * Determines if a given value is a function
     *
     * @param candidateFunction The thing to test for being a function
     */
    Util.isFunction = function (candidateFunction) {
        return typeof candidateFunction === "function";
    };
    /**
     * @returns whether the provided parameter is a JavaScript Array or not.
    */
    Util.isArray = function (array) {
        if (Array.isArray) {
            return Array.isArray(array);
        }
        return array && typeof array.length === "number" && array.constructor === Array;
    };
    /**
     * Determines if a string is null or empty or undefined
     *
     * @param s The string to test
     */
    Util.stringIsNullOrEmpty = function (s) {
        return typeof s === "undefined" || s === null || s.length < 1;
    };
    /**
     * Provides functionality to extend the given object by doing a shallow copy
     *
     * @param target The object to which properties will be copied
     * @param source The source object from which properties will be copied
     * @param noOverwrite If true existing properties on the target are not overwritten from the source
     *
     */
    Util.extend = function (target, source, noOverwrite) {
        if (noOverwrite === void 0) { noOverwrite = false; }
        if (source === null || typeof source === "undefined") {
            return target;
        }
        // ensure we don't overwrite things we don't want overwritten
        var check = noOverwrite ? function (o, i) { return !(i in o); } : function () { return true; };
        return Object.getOwnPropertyNames(source)
            .filter(function (v) { return check(target, v); })
            .reduce(function (t, v) {
            t[v] = source[v];
            return t;
        }, target);
    };
    /**
     * Determines if a given url is absolute
     *
     * @param url The url to check to see if it is absolute
     */
    Util.isUrlAbsolute = function (url) {
        return /^https?:\/\/|^\/\//i.test(url);
    };
    /**
     * Ensures that a given url is absolute for the current web based on context
     *
     * @param candidateUrl The url to make absolute
     *
     */
    Util.toAbsoluteUrl = function (candidateUrl) {
        return new Promise(function (resolve) {
            if (Util.isUrlAbsolute(candidateUrl)) {
                // if we are already absolute, then just return the url
                return resolve(candidateUrl);
            }
            if (pnplibconfig_1.RuntimeConfig.spBaseUrl !== null) {
                // base url specified either with baseUrl of spfxContext config property
                return resolve(Util.combinePaths(pnplibconfig_1.RuntimeConfig.spBaseUrl, candidateUrl));
            }
            if (typeof global._spPageContextInfo !== "undefined") {
                // operating in classic pages
                if (global._spPageContextInfo.hasOwnProperty("webAbsoluteUrl")) {
                    return resolve(Util.combinePaths(global._spPageContextInfo.webAbsoluteUrl, candidateUrl));
                }
                else if (global._spPageContextInfo.hasOwnProperty("webServerRelativeUrl")) {
                    return resolve(Util.combinePaths(global._spPageContextInfo.webServerRelativeUrl, candidateUrl));
                }
            }
            // does window.location exist and have a certain path part in it?
            if (typeof global.location !== "undefined") {
                var baseUrl_1 = global.location.toString().toLowerCase();
                ["/_layouts/", "/siteassets/"].forEach(function (s) {
                    var index = baseUrl_1.indexOf(s);
                    if (index > 0) {
                        return resolve(Util.combinePaths(baseUrl_1.substr(0, index), candidateUrl));
                    }
                });
            }
            return resolve(candidateUrl);
        });
    };
    return Util;
}());
exports.Util = Util;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "yLpj")))

/***/ }),

/***/ "br4S":
/*!*********************************************!*\
  !*** external "@microsoft/sp-webpart-base" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_br4S__;

/***/ }),

/***/ "cww6":
/*!****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/groups.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
var members_1 = __webpack_require__(/*! ./members */ "WZbb");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var calendars_1 = __webpack_require__(/*! ./calendars */ "kQcT");
var conversations_1 = __webpack_require__(/*! ./conversations */ "O+G+");
var plans_1 = __webpack_require__(/*! ./plans */ "Dm2q");
var photos_1 = __webpack_require__(/*! ./photos */ "Xs/H");
var GroupType;
(function (GroupType) {
    /**
     * Office 365 (aka unified group)
     */
    GroupType[GroupType["Office365"] = 0] = "Office365";
    /**
     * Dynamic membership
     */
    GroupType[GroupType["Dynamic"] = 1] = "Dynamic";
    /**
     * Security
     */
    GroupType[GroupType["Security"] = 2] = "Security";
})(GroupType = exports.GroupType || (exports.GroupType = {}));
/**
 * Describes a collection of Field objects
 *
 */
var Groups = /** @class */ (function (_super) {
    __extends(Groups, _super);
    function Groups(baseUrl, path) {
        if (path === void 0) { path = "groups"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a group from the collection using the specified id
     *
     * @param id Id of the group to get from this collection
     */
    Groups.prototype.getById = function (id) {
        return new Group(this, id);
    };
    /**
     * Create a new group as specified in the request body.
     *
     * @param name Name to display in the address book for the group
     * @param mailNickname Mail alias for the group
     * @param groupType Type of group being created
     * @param additionalProperties A plain object collection of additional properties you want to set on the new group
     */
    Groups.prototype.add = function (name, mailNickname, groupType, additionalProperties) {
        var _this = this;
        if (additionalProperties === void 0) { additionalProperties = {}; }
        var postBody = util_1.Util.extend({
            displayName: name,
            mailEnabled: groupType === GroupType.Office365,
            mailNickname: mailNickname,
            securityEnabled: groupType !== GroupType.Office365,
        }, additionalProperties);
        // include a group type if required
        if (groupType !== GroupType.Security) {
            postBody = util_1.Util.extend(postBody, {
                groupTypes: [groupType === GroupType.Office365 ? "Unified" : "DynamicMembership"],
            });
        }
        return this.postCore({
            body: JSON.stringify(postBody),
        }).then(function (r) {
            return {
                data: r,
                group: _this.getById(r.id),
            };
        });
    };
    return Groups;
}(graphqueryable_1.GraphQueryableCollection));
exports.Groups = Groups;
/**
 * Represents a group entity
 */
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Group.prototype, "caldendar", {
        /**
         * The calendar associated with this group
         */
        get: function () {
            return new calendars_1.Calendar(this, "calendar");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "events", {
        /**
         * Retrieve a list of event objects
         */
        get: function () {
            return new calendars_1.Events(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "owners", {
        /**
         * Gets the collection of owners for this group
         */
        get: function () {
            return new members_1.Owners(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "plans", {
        /**
         * The collection of plans for this group
         */
        get: function () {
            return new plans_1.Plans(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "members", {
        /**
         * Gets the collection of members for this group
         */
        get: function () {
            return new members_1.Members(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "conversations", {
        /**
         * Gets the conversations collection for this group
         */
        get: function () {
            return new conversations_1.Conversations(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "acceptedSenders", {
        /**
         * Gets the collection of accepted senders for this group
         */
        get: function () {
            return new conversations_1.Senders(this, "acceptedsenders");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "rejectedSenders", {
        /**
         * Gets the collection of rejected senders for this group
         */
        get: function () {
            return new conversations_1.Senders(this, "rejectedsenders");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "photo", {
        /**
         * The photo associated with the group
         */
        get: function () {
            return new photos_1.Photo(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add the group to the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    Group.prototype.addFavorite = function () {
        return this.clone(Group, "addFavorite").postCore();
    };
    /**
     * Return all the groups that the specified group is a member of. The check is transitive
     *
     * @param securityEnabledOnly
     */
    Group.prototype.getMemberGroups = function (securityEnabledOnly) {
        if (securityEnabledOnly === void 0) { securityEnabledOnly = false; }
        return this.clone(Group, "getMemberGroups").postCore({
            body: JSON.stringify({
                securityEnabledOnly: securityEnabledOnly,
            }),
        });
    };
    /**
     * Deletes this group
     */
    Group.prototype.delete = function () {
        return this.deleteCore();
    };
    /**
     * Update the properties of a group object
     *
     * @param properties Set of properties of this group to update
     */
    Group.prototype.update = function (properties) {
        return this.patchCore({
            body: JSON.stringify(properties),
        });
    };
    /**
     * Remove the group from the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    Group.prototype.removeFavorite = function () {
        return this.clone(Group, "removeFavorite").postCore();
    };
    /**
     * Reset the unseenCount of all the posts that the current user has not seen since their last visit
     */
    Group.prototype.resetUnseenCount = function () {
        return this.clone(Group, "resetUnseenCount").postCore();
    };
    /**
     * Calling this method will enable the current user to receive email notifications for this group,
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    Group.prototype.subscribeByMail = function () {
        return this.clone(Group, "subscribeByMail").postCore();
    };
    /**
     * Calling this method will prevent the current user from receiving email notifications for this group
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    Group.prototype.unsubscribeByMail = function () {
        return this.clone(Group, "unsubscribeByMail").postCore();
    };
    /**
     * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range, from the default calendar of a group
     *
     * @param start Start date and time of the time range
     * @param end End date and time of the time range
     */
    Group.prototype.getCalendarView = function (start, end) {
        var view = this.clone(Group, "calendarView");
        view.query.add("startDateTime", start.toISOString());
        view.query.add("endDateTime", end.toISOString());
        return view.get();
    };
    return Group;
}(graphqueryable_1.GraphQueryableInstance));
exports.Group = Group;


/***/ }),

/***/ "dKLh":
/*!**********************************************!*\
  !*** ./node_modules/@pnp/odata/queryable.js ***!
  \**********************************************/
/*! exports provided: cloneQueryableData, Queryable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneQueryableData", function() { return cloneQueryableData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Queryable", function() { return Queryable; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "t3D1");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _parsers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parsers.js */ "xbXq");



function cloneQueryableData(source) {
    var body;
    // this handles bodies that cannot be JSON encoded (Blob, etc)
    // Note however, even bodies that can be serialized will not be cloned.
    if (source.options && source.options.body) {
        body = source.options.body;
        source.options.body = "-";
    }
    var s = JSON.stringify(source, function (key, value) {
        switch (key) {
            case "query":
                return JSON.stringify(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(value), false));
            case "batch":
            case "batchDependency":
            case "cachingOptions":
            case "clientFactory":
            case "parser":
                return "-";
            default:
                return value;
        }
    }, 0);
    var parsed = JSON.parse(s, function (key, value) {
        switch (key) {
            case "query":
                return new Map(JSON.parse(value));
            case "batch":
            case "batchDependency":
            case "cachingOptions":
            case "clientFactory":
            case "parser":
                return source[key];
            default:
                return value;
        }
    });
    if (body) {
        parsed.options.body = body;
        source.options.body = body;
    }
    return parsed;
}
var Queryable = /** @class */ (function () {
    function Queryable(dataSeed) {
        if (dataSeed === void 0) { dataSeed = {}; }
        this._data = Object.assign({}, {
            cloneParentWasCaching: false,
            options: {},
            parentUrl: "",
            parser: new _parsers_js__WEBPACK_IMPORTED_MODULE_2__["ODataParser"](),
            query: new Map(),
            url: "",
            useCaching: false,
        }, cloneQueryableData(dataSeed));
        this._runtime = null;
    }
    Object.defineProperty(Queryable.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = Object.assign({}, this.data, cloneQueryableData(value));
        },
        enumerable: false,
        configurable: true
    });
    Queryable.prototype.getRuntime = function () {
        if (this._runtime === null) {
            return _pnp_common__WEBPACK_IMPORTED_MODULE_1__["DefaultRuntime"];
        }
        return this._runtime;
    };
    Queryable.prototype.setRuntime = function () {
        // need to wait for ts update in spfx: [runtime: Runtime] | [cloneGlobal: boolean, additionalConfig?: ITypedHash<any>]
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof _pnp_common__WEBPACK_IMPORTED_MODULE_1__["Runtime"]) {
            this._runtime = args[0];
        }
        else {
            this._runtime = args[0] ? new _pnp_common__WEBPACK_IMPORTED_MODULE_1__["Runtime"](_pnp_common__WEBPACK_IMPORTED_MODULE_1__["DefaultRuntime"].export()) : new _pnp_common__WEBPACK_IMPORTED_MODULE_1__["Runtime"]();
            if (args.length > 1 && Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(args[1])) {
                this._runtime.assign(args[1]);
            }
        }
        return this;
    };
    /**
  * Gets the current url
  *
  */
    Queryable.prototype.toUrl = function () {
        return this.data.url;
    };
    /**
   * Directly concatenates the supplied string to the current url, not normalizing "/" chars
   *
   * @param pathPart The string to concatenate to the url
   */
    Queryable.prototype.concat = function (pathPart) {
        this.data.url += pathPart;
        return this;
    };
    Object.defineProperty(Queryable.prototype, "query", {
        /**
       * Provides access to the query builder for this url
       *
       */
        get: function () {
            return this.data.query;
        },
        enumerable: false,
        configurable: true
    });
    /**
   * Sets custom options for current object and all derived objects accessible via chaining
   *
   * @param options custom options
   */
    Queryable.prototype.configure = function (options) {
        Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["mergeOptions"])(this.data.options, options);
        return this;
    };
    /**
   * Configures this instance from the configure options of the supplied instance
   *
   * @param o Instance from which options should be taken
   */
    Queryable.prototype.configureFrom = function (o) {
        Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["mergeOptions"])(this.data.options, o.data.options);
        var sourceRuntime = o.getRuntime();
        if (!sourceRuntime.get("__isDefault__")) {
            this.setRuntime(sourceRuntime);
        }
        return this;
    };
    /**
   * Enables caching for this request
   *
   * @param options Defines the options used when caching this request
   */
    Queryable.prototype.usingCaching = function (options) {
        var runtime = this.getRuntime();
        if (!runtime.get("globalCacheDisable")) {
            this.data.useCaching = true;
            // handle getting just the key
            if (typeof options === "string") {
                if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["stringIsNullOrEmpty"])(options)) {
                    throw Error("Cache key cannot be empty.");
                }
                options = { key: options };
            }
            // this uses our local options if they are defined as defaults
            var defaultOpts = {
                expiration: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["dateAdd"])(new Date(), "second", runtime.get("defaultCachingTimeoutSeconds")),
                storeName: runtime.get("defaultCachingStore"),
            };
            this.data.cachingOptions = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(defaultOpts, options);
        }
        return this;
    };
    Queryable.prototype.usingParser = function (parser) {
        this.data.parser = parser;
        return this;
    };
    /**
   * Allows you to set a request specific processing pipeline
   *
   * @param pipeline The set of methods, in order, to execute a given request
   */
    Queryable.prototype.withPipeline = function (pipeline) {
        this.data.pipes = pipeline.slice(0);
        return this;
    };
    /**
   * Appends the given string and normalizes "/" chars
   *
   * @param pathPart The string to append
   */
    Queryable.prototype.append = function (pathPart) {
        this.data.url = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["combine"])(this.data.url, pathPart);
    };
    /**
   * Adds this query to the supplied batch
   *
   * @example
   * ```
   *
   * let b = pnp.sp.createBatch();
   * pnp.sp.web.inBatch(b).get().then(...);
   * b.execute().then(...)
   * ```
   */
    Queryable.prototype.inBatch = function (batch) {
        if (this.hasBatch) {
            throw Error("This query is already part of a batch.");
        }
        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(batch)) {
            batch.track(this);
        }
        return this;
    };
    /**
   * Blocks a batch call from occuring, MUST be cleared by calling the returned function
  */
    Queryable.prototype.addBatchDependency = function () {
        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(this.data.batch)) {
            return this.data.batch.addDependency();
        }
        return function () { return null; };
    };
    Object.defineProperty(Queryable.prototype, "hasBatch", {
        /**
       * Indicates if the current query has a batch associated
       *
       */
        get: function () {
            return Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(this.data.batch);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queryable.prototype, "batch", {
        /**
       * The batch currently associated with this query or null
       *
       */
        get: function () {
            return this.hasBatch ? this.data.batch : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queryable.prototype, "parentUrl", {
        /**
       * Gets the parent url used when creating this instance
       *
       */
        get: function () {
            return this.data.parentUrl;
        },
        enumerable: false,
        configurable: true
    });
    /**
   * Clones this instance's data to target
   *
   * @param target Instance to which data is written
   * @param settings [Optional] Settings controlling how clone is applied
   */
    Queryable.prototype.cloneTo = function (target, settings) {
        if (settings === void 0) { settings = {}; }
        // default values for settings
        settings = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])({
            includeBatch: true,
            includeQuery: false,
        }, settings);
        target.data = Object.assign({}, cloneQueryableData(this.data), {
            batch: null,
            cloneParentCacheOptions: null,
            cloneParentWasCaching: false,
        }, cloneQueryableData(target.data));
        target.configureFrom(this);
        if (settings.includeBatch) {
            target.inBatch(this.batch);
        }
        if (settings.includeQuery && this.query.size > 0) {
            this.query.forEach(function (v, k) { return target.query.set(k, v); });
        }
        if (this.data.useCaching) {
            target.data.cloneParentWasCaching = true;
            target.data.cloneParentCacheOptions = this.data.cachingOptions;
        }
        return target;
    };
    return Queryable;
}());

//# sourceMappingURL=queryable.js.map

/***/ }),

/***/ "dVsc":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/webs/types.js ***!
  \********************************************/
/*! exports provided: _Webs, Webs, _Web, Web */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_Webs", function() { return _Webs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Webs", function() { return Webs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_Web", function() { return _Web; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Web", function() { return Web; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../sharepointqueryable.js */ "E6kk");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators.js */ "hMpi");
/* harmony import */ var _odata_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../odata.js */ "5dQz");
/* harmony import */ var _batch_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../batch.js */ "8xxP");
/* harmony import */ var _utils_metadata_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/metadata.js */ "z067");
/* harmony import */ var _sites_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../sites/index.js */ "1jZ6");
/* harmony import */ var _operations_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../operations.js */ "UK2s");
/* harmony import */ var _utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/escapeQueryStrValue.js */ "q1Lp");
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../telemetry.js */ "h3gW");












var _Webs = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_Webs, _super);
    function _Webs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Adds a new web to the collection
     *
     * @param title The new web's title
     * @param url The new web's relative url
     * @param description The new web's description
     * @param template The new web's template internal name (default = STS)
     * @param language The locale id that specifies the new web's language (default = 1033 [English, US])
     * @param inheritPermissions When true, permissions will be inherited from the new web's parent (default = true)
     */
    _Webs.prototype.add = function (title, url, description, template, language, inheritPermissions) {
        if (description === void 0) { description = ""; }
        if (template === void 0) { template = "STS"; }
        if (language === void 0) { language = 1033; }
        if (inheritPermissions === void 0) { inheritPermissions = true; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var postBody, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])({
                            "parameters": Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_7__["metadata"])("SP.WebCreationInformation"), {
                                Description: description,
                                Language: language,
                                Title: title,
                                Url: url,
                                UseSamePermissionsAsParentSite: inheritPermissions,
                                WebTemplate: template,
                            }),
                        });
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spPost"])(this.clone(Webs, "add"), postBody)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data,
                                web: Web(Object(_odata_js__WEBPACK_IMPORTED_MODULE_5__["odataUrlFrom"])(data).replace(/_api\/web\/?/i, "")).configureFrom(this),
                            }];
                }
            });
        });
    };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("ws.add")
    ], _Webs.prototype, "add", null);
    _Webs = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_decorators_js__WEBPACK_IMPORTED_MODULE_4__["defaultPath"])("webs")
    ], _Webs);
    return _Webs;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["_SharePointQueryableCollection"]));

var Webs = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["spInvokableFactory"])(_Webs);
/**
 * Describes a web
 *
 */
var _Web = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_Web, _super);
    function _Web() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delete = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["deleteable"])("w");
        return _this;
    }
    Object.defineProperty(_Web.prototype, "webs", {
        /**
         * Gets this web's subwebs
         *
         */
        get: function () {
            return Webs(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Web.prototype, "allProperties", {
        /**
         * Allows access to the web's all properties collection
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"].configure(this.clone(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["SharePointQueryableInstance"], "allproperties"), "w.allprops");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_Web.prototype, "webinfos", {
        /**
         * Gets a collection of WebInfos for this web's subwebs
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["SharePointQueryableCollection"])(this, "webinfos"), "w.webinfos");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets this web's parent web and data
     *
     */
    _Web.prototype.getParentWeb = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var ParentWeb;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spGet"])(this.select("ParentWeb/Id").expand("ParentWeb"))];
                    case 1:
                        ParentWeb = (_a.sent()).ParentWeb;
                        return [2 /*return*/, (ParentWeb === null || ParentWeb === void 0 ? void 0 : ParentWeb.Id) ? Object(_sites_index_js__WEBPACK_IMPORTED_MODULE_8__["Site"])(this.parentUrl).openWebById(ParentWeb.Id) : null];
                }
            });
        });
    };
    /**
     * Updates this web instance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the web
     */
    _Web.prototype.update = function (properties) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var postBody, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_7__["metadata"])("SP.Web"), properties), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["headers"])({ "X-HTTP-Method": "MERGE" }));
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spPost"])(this, postBody)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, { data: data, web: this }];
                }
            });
        });
    };
    /**
     * Applies the theme specified by the contents of each of the files specified in the arguments to the site
     *
     * @param colorPaletteUrl The server-relative URL of the color palette file
     * @param fontSchemeUrl The server-relative URL of the font scheme
     * @param backgroundImageUrl The server-relative URL of the background image
     * @param shareGenerated When true, the generated theme files are stored in the root site. When false, they are stored in this web
     */
    _Web.prototype.applyTheme = function (colorPaletteUrl, fontSchemeUrl, backgroundImageUrl, shareGenerated) {
        var postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])({
            backgroundImageUrl: backgroundImageUrl,
            colorPaletteUrl: colorPaletteUrl,
            fontSchemeUrl: fontSchemeUrl,
            shareGenerated: shareGenerated,
        });
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spPost"])(this.clone(Web, "applytheme"), postBody);
    };
    /**
     * Applies the specified site definition or site template to the Web site that has no template applied to it
     *
     * @param template Name of the site definition or the name of the site template
     */
    _Web.prototype.applyWebTemplate = function (template) {
        var q = this.clone(Web, "applywebtemplate");
        q.concat("(webTemplate='" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_10__["escapeQueryStrValue"])(template) + "')");
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spPost"])(q);
    };
    /**
         * Returns the collection of changes from the change log that have occurred within the list, based on the specified query
         *
         * @param query The change query
         */
    _Web.prototype.getChanges = function (query) {
        var postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])({ "query": Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_7__["metadata"])("SP.ChangeQuery"), query) });
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spPost"])(this.clone(Web, "getchanges"), postBody);
    };
    /**
     * Returns the name of the image file for the icon that is used to represent the specified file
     *
     * @param filename The file name. If this parameter is empty, the server returns an empty string
     * @param size The size of the icon: 16x16 pixels = 0, 32x32 pixels = 1 (default = 0)
     * @param progId The ProgID of the application that was used to create the file, in the form OLEServerName.ObjectName
     */
    _Web.prototype.mapToIcon = function (filename, size, progId) {
        if (size === void 0) { size = 0; }
        if (progId === void 0) { progId = ""; }
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spGet"])(this.clone(Web, "maptoicon(filename='" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_10__["escapeQueryStrValue"])(filename) + "', progid='" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_10__["escapeQueryStrValue"])(progId) + "', size=" + size + ")"));
    };
    /**
     * Returns the tenant property corresponding to the specified key in the app catalog site
     *
     * @param key Id of storage entity to be set
     */
    _Web.prototype.getStorageEntity = function (key) {
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spGet"])(this.clone(Web, "getStorageEntity('" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_10__["escapeQueryStrValue"])(key) + "')"));
    };
    /**
     * This will set the storage entity identified by the given key (MUST be called in the context of the app catalog)
     *
     * @param key Id of storage entity to be set
     * @param value Value of storage entity to be set
     * @param description Description of storage entity to be set
     * @param comments Comments of storage entity to be set
     */
    _Web.prototype.setStorageEntity = function (key, value, description, comments) {
        if (description === void 0) { description = ""; }
        if (comments === void 0) { comments = ""; }
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spPost"])(this.clone(Web, "setStorageEntity"), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])({
            comments: comments,
            description: description,
            key: key,
            value: value,
        }));
    };
    /**
     * This will remove the storage entity identified by the given key
     *
     * @param key Id of storage entity to be removed
     */
    _Web.prototype.removeStorageEntity = function (key) {
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_9__["spPost"])(this.clone(Web, "removeStorageEntity('" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_10__["escapeQueryStrValue"])(key) + "')"));
    };
    /**
    * Returns a collection of objects that contain metadata about subsites of the current site in which the current user is a member.
    *
    * @param nWebTemplateFilter Specifies the site definition (default = -1)
    * @param nConfigurationFilter A 16-bit integer that specifies the identifier of a configuration (default = -1)
    */
    _Web.prototype.getSubwebsFilteredForCurrentUser = function (nWebTemplateFilter, nConfigurationFilter) {
        if (nWebTemplateFilter === void 0) { nWebTemplateFilter = -1; }
        if (nConfigurationFilter === void 0) { nConfigurationFilter = -1; }
        var o = this.clone(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["SharePointQueryableCollection"], "getSubwebsFilteredForCurrentUser(nWebTemplateFilter=" + nWebTemplateFilter + ",nConfigurationFilter=" + nConfigurationFilter + ")");
        return _telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"].configure(o, "w.getSubwebsFilteredForCurrentUser");
    };
    /**
     * Creates a new batch for requests within the context of this web
     *
     */
    _Web.prototype.createBatch = function () {
        return new _batch_js__WEBPACK_IMPORTED_MODULE_6__["SPBatch"](this.parentUrl, this.getRuntime());
    };
    /**
     * Returns a collection of site templates available for the site
     *
     * @param language The locale id of the site templates to retrieve (default = 1033 [English, US])
     * @param includeCrossLanguage When true, includes language-neutral site templates; otherwise false (default = true)
     */
    _Web.prototype.availableWebTemplates = function (language, includeCrossLanugage) {
        if (language === void 0) { language = 1033; }
        if (includeCrossLanugage === void 0) { includeCrossLanugage = true; }
        var path = "getavailablewebtemplates(lcid=" + language + ", doincludecrosslanguage=" + includeCrossLanugage + ")";
        return _telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["SharePointQueryableCollection"])(this, path), "w.availableWebTemplates");
    };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.getParentWeb")
    ], _Web.prototype, "getParentWeb", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.update")
    ], _Web.prototype, "update", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.applyTheme")
    ], _Web.prototype, "applyTheme", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.applyWebTemplate")
    ], _Web.prototype, "applyWebTemplate", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.getChanges")
    ], _Web.prototype, "getChanges", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.mapToIcon")
    ], _Web.prototype, "mapToIcon", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.getStorageEntity")
    ], _Web.prototype, "getStorageEntity", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.setStorageEntity")
    ], _Web.prototype, "setStorageEntity", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_11__["tag"])("w.removeStorageEntity")
    ], _Web.prototype, "removeStorageEntity", null);
    _Web = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_decorators_js__WEBPACK_IMPORTED_MODULE_4__["defaultPath"])("_api/web")
    ], _Web);
    return _Web;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["_SharePointQueryableInstance"]));

var Web = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["spInvokableFactory"])(_Web);
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "eGqj":
/*!*****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/odata/parsers.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! ./core */ "ntgF");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var ODataDefaultParser = /** @class */ (function (_super) {
    __extends(ODataDefaultParser, _super);
    function ODataDefaultParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ODataDefaultParser;
}(core_1.ODataParserBase));
exports.ODataDefaultParser = ODataDefaultParser;
var ODataValueParserImpl = /** @class */ (function (_super) {
    __extends(ODataValueParserImpl, _super);
    function ODataValueParserImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ODataValueParserImpl.prototype.parse = function (r) {
        return _super.prototype.parse.call(this, r).then(function (d) { return d; });
    };
    return ODataValueParserImpl;
}(core_1.ODataParserBase));
function ODataValue() {
    return new ODataValueParserImpl();
}
exports.ODataValue = ODataValue;
var ODataRawParserImpl = /** @class */ (function (_super) {
    __extends(ODataRawParserImpl, _super);
    function ODataRawParserImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ODataRawParserImpl.prototype.parseImpl = function (r, resolve) {
        r.json().then(resolve);
    };
    return ODataRawParserImpl;
}(core_1.ODataParserBase));
exports.ODataRawParserImpl = ODataRawParserImpl;
exports.ODataRaw = new ODataRawParserImpl();
var TextFileParser = /** @class */ (function (_super) {
    __extends(TextFileParser, _super);
    function TextFileParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextFileParser.prototype.parseImpl = function (r, resolve) {
        r.text().then(resolve);
    };
    return TextFileParser;
}(core_1.ODataParserBase));
exports.TextFileParser = TextFileParser;
var BlobFileParser = /** @class */ (function (_super) {
    __extends(BlobFileParser, _super);
    function BlobFileParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlobFileParser.prototype.parseImpl = function (r, resolve) {
        r.blob().then(resolve);
    };
    return BlobFileParser;
}(core_1.ODataParserBase));
exports.BlobFileParser = BlobFileParser;
var JSONFileParser = /** @class */ (function (_super) {
    __extends(JSONFileParser, _super);
    function JSONFileParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONFileParser.prototype.parseImpl = function (r, resolve) {
        r.json().then(resolve);
    };
    return JSONFileParser;
}(core_1.ODataParserBase));
exports.JSONFileParser = JSONFileParser;
var BufferFileParser = /** @class */ (function (_super) {
    __extends(BufferFileParser, _super);
    function BufferFileParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BufferFileParser.prototype.parseImpl = function (r, resolve) {
        if (util_1.Util.isFunction(r.arrayBuffer)) {
            r.arrayBuffer().then(resolve);
        }
        r.buffer().then(resolve);
    };
    return BufferFileParser;
}(core_1.ODataParserBase));
exports.BufferFileParser = BufferFileParser;


/***/ }),

/***/ "eVhm":
/*!*************************************************!*\
  !*** ./node_modules/@pnp/common/collections.js ***!
  \*************************************************/
/*! exports provided: objectToMap, mergeMaps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "objectToMap", function() { return objectToMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeMaps", function() { return mergeMaps; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "97IE");

/**
 * Used to calculate the object properties, with polyfill if needed
 */
var objectEntries = Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["isFunc"])(Object.entries) ? Object.entries : function (o) { return Object.keys(o).map(function (k) { return [k, o[k]]; }); };
/**
 * Converts the supplied object to a map
 *
 * @param o The object to map
 */
function objectToMap(o) {
    if (Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["objectDefinedNotNull"])(o)) {
        return new Map(objectEntries(o));
    }
    return new Map();
}
/**
 * Merges to Map instances together, overwriting values in target with matching keys, last in wins
 *
 * @param target map into which the other maps are merged
 * @param maps One or more maps to merge into the target
 */
function mergeMaps(target) {
    var maps = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        maps[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < maps.length; i++) {
        maps[i].forEach(function (v, k) {
            // let's not run the spfx context through Object.assign :)
            if ((typeof k === "string" && k !== "spfxContext") && Object.prototype.toString.call(v) === "[object Object]") {
                // we only handle one level of deep object merging
                target.set(k, Object.assign({}, target.get(k) || {}, v));
            }
            else {
                target.set(k, v);
            }
        });
    }
    return target;
}
//# sourceMappingURL=collections.js.map

/***/ }),

/***/ "ewhV":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/forms.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
/**
 * Describes a collection of Field objects
 *
 */
var Forms = /** @class */ (function (_super) {
    __extends(Forms, _super);
    /**
     * Creates a new instance of the Fields class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Forms(baseUrl, path) {
        if (path === void 0) { path = "forms"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a form by id
     *
     * @param id The guid id of the item to retrieve
     */
    Forms.prototype.getById = function (id) {
        var i = new Form(this);
        i.concat("('" + id + "')");
        return i;
    };
    return Forms;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Forms = Forms;
/**
 * Describes a single of Form instance
 *
 */
var Form = /** @class */ (function (_super) {
    __extends(Form, _super);
    function Form() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Form;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.Form = Form;


/***/ }),

/***/ "fICk":
/*!************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/v1.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
var groups_1 = __webpack_require__(/*! ./groups */ "cww6");
// import { Me } from "./me";
/**
 * Root object wrapping v1 functionality for MS Graph
 *
 */
var V1 = /** @class */ (function (_super) {
    __extends(V1, _super);
    /**
     * Creates a new instance of the V1 class
     *
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional additional path
     */
    function V1(baseUrl, path) {
        if (path === void 0) { path = "v1.0"; }
        return _super.call(this, baseUrl, path) || this;
    }
    Object.defineProperty(V1.prototype, "groups", {
        get: function () {
            return new groups_1.Groups(this);
        },
        enumerable: true,
        configurable: true
    });
    return V1;
}(graphqueryable_1.GraphQueryable));
exports.V1 = V1;


/***/ }),

/***/ "fgBf":
/*!**********************************************************!*\
  !*** ./node_modules/@pnp/common/spfxcontextinterface.js ***!
  \**********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=spfxcontextinterface.js.map

/***/ }),

/***/ "fuNo":
/*!*******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/odata/queryable.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var utils_1 = __webpack_require__(/*! ../net/utils */ "KJz+");
var parsers_1 = __webpack_require__(/*! ../odata/parsers */ "eGqj");
var pnplibconfig_1 = __webpack_require__(/*! ../configuration/pnplibconfig */ "Mvka");
var pipeline_1 = __webpack_require__(/*! ../request/pipeline */ "a1BX");
var ODataQueryable = /** @class */ (function () {
    function ODataQueryable() {
    }
    /**
     * Directly concatonates the supplied string to the current url, not normalizing "/" chars
     *
     * @param pathPart The string to concatonate to the url
     */
    ODataQueryable.prototype.concat = function (pathPart) {
        this._url += pathPart;
        return this;
    };
    /**
     * Appends the given string and normalizes "/" chars
     *
     * @param pathPart The string to append
     */
    ODataQueryable.prototype.append = function (pathPart) {
        this._url = util_1.Util.combinePaths(this._url, pathPart);
    };
    Object.defineProperty(ODataQueryable.prototype, "parentUrl", {
        /**
         * Gets the parent url used when creating this instance
         *
         */
        get: function () {
            return this._parentUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODataQueryable.prototype, "query", {
        /**
         * Provides access to the query builder for this url
         *
         */
        get: function () {
            return this._query;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets custom options for current object and all derived objects accessible via chaining
     *
     * @param options custom options
     */
    ODataQueryable.prototype.configure = function (options) {
        utils_1.mergeOptions(this._options, options);
        return this;
    };
    /**
     * Enables caching for this request
     *
     * @param options Defines the options used when caching this request
     */
    ODataQueryable.prototype.usingCaching = function (options) {
        if (!pnplibconfig_1.RuntimeConfig.globalCacheDisable) {
            this._useCaching = true;
            this._cachingOptions = options;
        }
        return this;
    };
    /**
     * Gets the currentl url, made absolute based on the availability of the _spPageContextInfo object
     *
     */
    ODataQueryable.prototype.toUrl = function () {
        return this._url;
    };
    /**
     * Executes the currently built request
     *
     * @param parser Allows you to specify a parser to handle the result
     * @param getOptions The options used for this request
     */
    ODataQueryable.prototype.get = function (parser, options) {
        if (parser === void 0) { parser = new parsers_1.ODataDefaultParser(); }
        if (options === void 0) { options = {}; }
        return this.toRequestContext("GET", options, parser, pipeline_1.PipelineMethods.default).then(function (context) { return pipeline_1.pipe(context); });
    };
    ODataQueryable.prototype.getAs = function (parser, options) {
        if (parser === void 0) { parser = new parsers_1.ODataDefaultParser(); }
        if (options === void 0) { options = {}; }
        return this.toRequestContext("GET", options, parser, pipeline_1.PipelineMethods.default).then(function (context) { return pipeline_1.pipe(context); });
    };
    ODataQueryable.prototype.postCore = function (options, parser) {
        if (options === void 0) { options = {}; }
        if (parser === void 0) { parser = new parsers_1.ODataDefaultParser(); }
        return this.toRequestContext("POST", options, parser, pipeline_1.PipelineMethods.default).then(function (context) { return pipeline_1.pipe(context); });
    };
    ODataQueryable.prototype.postAsCore = function (options, parser) {
        if (options === void 0) { options = {}; }
        if (parser === void 0) { parser = new parsers_1.ODataDefaultParser(); }
        return this.toRequestContext("POST", options, parser, pipeline_1.PipelineMethods.default).then(function (context) { return pipeline_1.pipe(context); });
    };
    ODataQueryable.prototype.patchCore = function (options, parser) {
        if (options === void 0) { options = {}; }
        if (parser === void 0) { parser = new parsers_1.ODataDefaultParser(); }
        return this.toRequestContext("PATCH", options, parser, pipeline_1.PipelineMethods.default).then(function (context) { return pipeline_1.pipe(context); });
    };
    ODataQueryable.prototype.deleteCore = function (options, parser) {
        if (options === void 0) { options = {}; }
        if (parser === void 0) { parser = new parsers_1.ODataDefaultParser(); }
        return this.toRequestContext("DELETE", options, parser, pipeline_1.PipelineMethods.default).then(function (context) { return pipeline_1.pipe(context); });
    };
    return ODataQueryable;
}());
exports.ODataQueryable = ODataQueryable;


/***/ }),

/***/ "gZxA":
/*!*******************************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/sharepointqueryableshareable.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var webs_1 = __webpack_require__(/*! ./webs */ "U0SV");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var sharepointqueryablesecurable_1 = __webpack_require__(/*! ./sharepointqueryablesecurable */ "wSGh");
var types_1 = __webpack_require__(/*! ./types */ "z9XP");
/**
 * Internal helper class used to augment classes to include sharing functionality
 */
var SharePointQueryableShareable = /** @class */ (function (_super) {
    __extends(SharePointQueryableShareable, _super);
    function SharePointQueryableShareable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a sharing link for the supplied
     *
     * @param kind The kind of link to share
     * @param expiration The optional expiration for this link
     */
    SharePointQueryableShareable.prototype.getShareLink = function (kind, expiration) {
        if (expiration === void 0) { expiration = null; }
        // date needs to be an ISO string or null
        var expString = expiration !== null ? expiration.toISOString() : null;
        // clone using the factory and send the request
        return this.clone(SharePointQueryableShareable, "shareLink").postAsCore({
            body: JSON.stringify({
                request: {
                    createLink: true,
                    emailData: null,
                    settings: {
                        expiration: expString,
                        linkKind: kind,
                    },
                },
            }),
        });
    };
    /**
     * Shares this instance with the supplied users
     *
     * @param loginNames Resolved login names to share
     * @param role The role
     * @param requireSignin True to require the user is authenticated, otherwise false
     * @param propagateAcl True to apply this share to all children
     * @param emailData If supplied an email will be sent with the indicated properties
     */
    SharePointQueryableShareable.prototype.shareWith = function (loginNames, role, requireSignin, propagateAcl, emailData) {
        var _this = this;
        if (requireSignin === void 0) { requireSignin = false; }
        if (propagateAcl === void 0) { propagateAcl = false; }
        // handle the multiple input types
        if (!Array.isArray(loginNames)) {
            loginNames = [loginNames];
        }
        var userStr = JSON.stringify(loginNames.map(function (login) { return { Key: login }; }));
        var roleFilter = role === types_1.SharingRole.Edit ? types_1.RoleType.Contributor : types_1.RoleType.Reader;
        // start by looking up the role definition id we need to set the roleValue
        return webs_1.Web.fromUrl(this.toUrl()).roleDefinitions.select("Id").filter("RoleTypeKind eq " + roleFilter).get().then(function (def) {
            if (!Array.isArray(def) || def.length < 1) {
                throw new Error("Could not locate a role defintion with RoleTypeKind " + roleFilter);
            }
            var postBody = {
                includeAnonymousLinkInEmail: requireSignin,
                peoplePickerInput: userStr,
                propagateAcl: propagateAcl,
                roleValue: "role:" + def[0].Id,
                useSimplifiedRoles: true,
            };
            if (typeof emailData !== "undefined") {
                postBody = util_1.Util.extend(postBody, {
                    emailBody: emailData.body,
                    emailSubject: typeof emailData.subject !== "undefined" ? emailData.subject : "",
                    sendEmail: true,
                });
            }
            return _this.clone(SharePointQueryableShareable, "shareObject").postAsCore({
                body: JSON.stringify(postBody),
            });
        });
    };
    /**
     * Shares an object based on the supplied options
     *
     * @param options The set of options to send to the ShareObject method
     * @param bypass If true any processing is skipped and the options are sent directly to the ShareObject method
     */
    SharePointQueryableShareable.prototype.shareObject = function (options, bypass) {
        var _this = this;
        if (bypass === void 0) { bypass = false; }
        if (bypass) {
            // if the bypass flag is set send the supplied parameters directly to the service
            return this.sendShareObjectRequest(options);
        }
        // extend our options with some defaults
        options = util_1.Util.extend(options, {
            group: null,
            includeAnonymousLinkInEmail: false,
            propagateAcl: false,
            useSimplifiedRoles: true,
        }, true);
        return this.getRoleValue(options.role, options.group).then(function (roleValue) {
            // handle the multiple input types
            if (!Array.isArray(options.loginNames)) {
                options.loginNames = [options.loginNames];
            }
            var userStr = JSON.stringify(options.loginNames.map(function (login) { return { Key: login }; }));
            var postBody = {
                peoplePickerInput: userStr,
                roleValue: roleValue,
                url: options.url,
            };
            if (typeof options.emailData !== "undefined" && options.emailData !== null) {
                postBody = util_1.Util.extend(postBody, {
                    emailBody: options.emailData.body,
                    emailSubject: typeof options.emailData.subject !== "undefined" ? options.emailData.subject : "Shared with you.",
                    sendEmail: true,
                });
            }
            return _this.sendShareObjectRequest(postBody);
        });
    };
    /**
     * Calls the web's UnshareObject method
     *
     * @param url The url of the object to unshare
     */
    SharePointQueryableShareable.prototype.unshareObjectWeb = function (url) {
        return this.clone(SharePointQueryableShareable, "unshareObject").postAsCore({
            body: JSON.stringify({
                url: url,
            }),
        });
    };
    /**
     * Checks Permissions on the list of Users and returns back role the users have on the Item.
     *
     * @param recipients The array of Entities for which Permissions need to be checked.
     */
    SharePointQueryableShareable.prototype.checkPermissions = function (recipients) {
        return this.clone(SharePointQueryableShareable, "checkPermissions").postAsCore({
            body: JSON.stringify({
                recipients: recipients,
            }),
        });
    };
    /**
     * Get Sharing Information.
     *
     * @param request The SharingInformationRequest Object.
     */
    SharePointQueryableShareable.prototype.getSharingInformation = function (request) {
        if (request === void 0) { request = null; }
        return this.clone(SharePointQueryableShareable, "getSharingInformation").postAsCore({
            body: JSON.stringify({
                request: request,
            }),
        });
    };
    /**
     * Gets the sharing settings of an item.
     *
     * @param useSimplifiedRoles Determines whether to use simplified roles.
     */
    SharePointQueryableShareable.prototype.getObjectSharingSettings = function (useSimplifiedRoles) {
        if (useSimplifiedRoles === void 0) { useSimplifiedRoles = true; }
        return this.clone(SharePointQueryableShareable, "getObjectSharingSettings").postAsCore({
            body: JSON.stringify({
                useSimplifiedRoles: useSimplifiedRoles,
            }),
        });
    };
    /**
     * Unshares this object
     */
    SharePointQueryableShareable.prototype.unshareObject = function () {
        return this.clone(SharePointQueryableShareable, "unshareObject").postAsCore();
    };
    /**
     * Deletes a link by type
     *
     * @param kind Deletes a sharing link by the kind of link
     */
    SharePointQueryableShareable.prototype.deleteLinkByKind = function (kind) {
        return this.clone(SharePointQueryableShareable, "deleteLinkByKind").postCore({
            body: JSON.stringify({ linkKind: kind }),
        });
    };
    /**
     * Removes the specified link to the item.
     *
     * @param kind The kind of link to be deleted.
     * @param shareId
     */
    SharePointQueryableShareable.prototype.unshareLink = function (kind, shareId) {
        if (shareId === void 0) { shareId = "00000000-0000-0000-0000-000000000000"; }
        return this.clone(SharePointQueryableShareable, "unshareLink").postCore({
            body: JSON.stringify({ linkKind: kind, shareId: shareId }),
        });
    };
    /**
     * Calculates the roleValue string used in the sharing query
     *
     * @param role The Sharing Role
     * @param group The Group type
     */
    SharePointQueryableShareable.prototype.getRoleValue = function (role, group) {
        // we will give group precedence, because we had to make a choice
        if (typeof group !== "undefined" && group !== null) {
            switch (group) {
                case types_1.RoleType.Contributor:
                    return webs_1.Web.fromUrl(this.toUrl()).associatedMemberGroup.select("Id").getAs().then(function (g) { return "group: " + g.Id; });
                case types_1.RoleType.Reader:
                case types_1.RoleType.Guest:
                    return webs_1.Web.fromUrl(this.toUrl()).associatedVisitorGroup.select("Id").getAs().then(function (g) { return "group: " + g.Id; });
                default:
                    throw new Error("Could not determine role value for supplied value. Contributor, Reader, and Guest are supported");
            }
        }
        else {
            var roleFilter = role === types_1.SharingRole.Edit ? types_1.RoleType.Contributor : types_1.RoleType.Reader;
            return webs_1.Web.fromUrl(this.toUrl()).roleDefinitions.select("Id").top(1).filter("RoleTypeKind eq " + roleFilter).getAs().then(function (def) {
                if (def.length < 1) {
                    throw new Error("Could not locate associated role definition for supplied role. Edit and View are supported");
                }
                return "role: " + def[0].Id;
            });
        }
    };
    SharePointQueryableShareable.prototype.getShareObjectWeb = function (candidate) {
        return Promise.resolve(webs_1.Web.fromUrl(candidate, "/_api/SP.Web.ShareObject"));
    };
    SharePointQueryableShareable.prototype.sendShareObjectRequest = function (options) {
        return this.getShareObjectWeb(this.toUrl()).then(function (web) {
            return web.expand("UsersWithAccessRequests", "GroupsSharedWith").as(SharePointQueryableShareable).postCore({
                body: JSON.stringify(options),
            });
        });
    };
    return SharePointQueryableShareable;
}(sharepointqueryable_1.SharePointQueryable));
exports.SharePointQueryableShareable = SharePointQueryableShareable;
var SharePointQueryableShareableWeb = /** @class */ (function (_super) {
    __extends(SharePointQueryableShareableWeb, _super);
    function SharePointQueryableShareableWeb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Shares this web with the supplied users
     * @param loginNames The resolved login names to share
     * @param role The role to share this web
     * @param emailData Optional email data
     */
    SharePointQueryableShareableWeb.prototype.shareWith = function (loginNames, role, emailData) {
        var _this = this;
        if (role === void 0) { role = types_1.SharingRole.View; }
        var dependency = this.addBatchDependency();
        return webs_1.Web.fromUrl(this.toUrl(), "/_api/web/url").get().then(function (url) {
            dependency();
            return _this.shareObject(util_1.Util.combinePaths(url, "/_layouts/15/aclinv.aspx?forSharing=1&mbypass=1"), loginNames, role, emailData);
        });
    };
    /**
     * Provides direct access to the static web.ShareObject method
     *
     * @param url The url to share
     * @param loginNames Resolved loginnames string[] of a single login name string
     * @param roleValue Role value
     * @param emailData Optional email data
     * @param groupId Optional group id
     * @param propagateAcl
     * @param includeAnonymousLinkInEmail
     * @param useSimplifiedRoles
     */
    SharePointQueryableShareableWeb.prototype.shareObject = function (url, loginNames, role, emailData, group, propagateAcl, includeAnonymousLinkInEmail, useSimplifiedRoles) {
        if (propagateAcl === void 0) { propagateAcl = false; }
        if (includeAnonymousLinkInEmail === void 0) { includeAnonymousLinkInEmail = false; }
        if (useSimplifiedRoles === void 0) { useSimplifiedRoles = true; }
        return this.clone(SharePointQueryableShareable, null).shareObject({
            emailData: emailData,
            group: group,
            includeAnonymousLinkInEmail: includeAnonymousLinkInEmail,
            loginNames: loginNames,
            propagateAcl: propagateAcl,
            role: role,
            url: url,
            useSimplifiedRoles: useSimplifiedRoles,
        });
    };
    /**
     * Supplies a method to pass any set of arguments to ShareObject
     *
     * @param options The set of options to send to ShareObject
     */
    SharePointQueryableShareableWeb.prototype.shareObjectRaw = function (options) {
        return this.clone(SharePointQueryableShareable, null).shareObject(options, true);
    };
    /**
     * Unshares the object
     *
     * @param url The url of the object to stop sharing
     */
    SharePointQueryableShareableWeb.prototype.unshareObject = function (url) {
        return this.clone(SharePointQueryableShareable, null).unshareObjectWeb(url);
    };
    return SharePointQueryableShareableWeb;
}(sharepointqueryablesecurable_1.SharePointQueryableSecurable));
exports.SharePointQueryableShareableWeb = SharePointQueryableShareableWeb;
var SharePointQueryableShareableItem = /** @class */ (function (_super) {
    __extends(SharePointQueryableShareableItem, _super);
    function SharePointQueryableShareableItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a link suitable for sharing for this item
     *
     * @param kind The type of link to share
     * @param expiration The optional expiration date
     */
    SharePointQueryableShareableItem.prototype.getShareLink = function (kind, expiration) {
        if (kind === void 0) { kind = types_1.SharingLinkKind.OrganizationView; }
        if (expiration === void 0) { expiration = null; }
        return this.clone(SharePointQueryableShareable, null).getShareLink(kind, expiration);
    };
    /**
     * Shares this item with one or more users
     *
     * @param loginNames string or string[] of resolved login names to which this item will be shared
     * @param role The role (View | Edit) applied to the share
     * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
     */
    SharePointQueryableShareableItem.prototype.shareWith = function (loginNames, role, requireSignin, emailData) {
        if (role === void 0) { role = types_1.SharingRole.View; }
        if (requireSignin === void 0) { requireSignin = false; }
        return this.clone(SharePointQueryableShareable, null).shareWith(loginNames, role, requireSignin, false, emailData);
    };
    /**
     * Checks Permissions on the list of Users and returns back role the users have on the Item.
     *
     * @param recipients The array of Entities for which Permissions need to be checked.
     */
    SharePointQueryableShareableItem.prototype.checkSharingPermissions = function (recipients) {
        return this.clone(SharePointQueryableShareable, null).checkPermissions(recipients);
    };
    /**
     * Get Sharing Information.
     *
     * @param request The SharingInformationRequest Object.
     */
    SharePointQueryableShareableItem.prototype.getSharingInformation = function (request) {
        if (request === void 0) { request = null; }
        return this.clone(SharePointQueryableShareable, null).getSharingInformation(request);
    };
    /**
     * Gets the sharing settings of an item.
     *
     * @param useSimplifiedRoles Determines whether to use simplified roles.
     */
    SharePointQueryableShareableItem.prototype.getObjectSharingSettings = function (useSimplifiedRoles) {
        if (useSimplifiedRoles === void 0) { useSimplifiedRoles = true; }
        return this.clone(SharePointQueryableShareable, null).getObjectSharingSettings(useSimplifiedRoles);
    };
    /**
     * Unshare this item
     */
    SharePointQueryableShareableItem.prototype.unshare = function () {
        return this.clone(SharePointQueryableShareable, null).unshareObject();
    };
    /**
     * Deletes a sharing link by kind
     *
     * @param kind Deletes a sharing link by the kind of link
     */
    SharePointQueryableShareableItem.prototype.deleteSharingLinkByKind = function (kind) {
        return this.clone(SharePointQueryableShareable, null).deleteLinkByKind(kind);
    };
    /**
     * Removes the specified link to the item.
     *
     * @param kind The kind of link to be deleted.
     * @param shareId
     */
    SharePointQueryableShareableItem.prototype.unshareLink = function (kind, shareId) {
        return this.clone(SharePointQueryableShareable, null).unshareLink(kind, shareId);
    };
    return SharePointQueryableShareableItem;
}(sharepointqueryablesecurable_1.SharePointQueryableSecurable));
exports.SharePointQueryableShareableItem = SharePointQueryableShareableItem;
var FileFolderShared = /** @class */ (function (_super) {
    __extends(FileFolderShared, _super);
    function FileFolderShared() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a link suitable for sharing
     *
     * @param kind The kind of link to get
     * @param expiration Optional, an expiration for this link
     */
    FileFolderShared.prototype.getShareLink = function (kind, expiration) {
        if (kind === void 0) { kind = types_1.SharingLinkKind.OrganizationView; }
        if (expiration === void 0) { expiration = null; }
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.getShareLink(kind, expiration);
        });
    };
    /**
         * Checks Permissions on the list of Users and returns back role the users have on the Item.
         *
         * @param recipients The array of Entities for which Permissions need to be checked.
         */
    FileFolderShared.prototype.checkSharingPermissions = function (recipients) {
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.checkPermissions(recipients);
        });
    };
    /**
     * Get Sharing Information.
     *
     * @param request The SharingInformationRequest Object.
     */
    FileFolderShared.prototype.getSharingInformation = function (request) {
        if (request === void 0) { request = null; }
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.getSharingInformation(request);
        });
    };
    /**
     * Gets the sharing settings of an item.
     *
     * @param useSimplifiedRoles Determines whether to use simplified roles.
     */
    FileFolderShared.prototype.getObjectSharingSettings = function (useSimplifiedRoles) {
        if (useSimplifiedRoles === void 0) { useSimplifiedRoles = true; }
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.getObjectSharingSettings(useSimplifiedRoles);
        });
    };
    /**
     * Unshare this item
     */
    FileFolderShared.prototype.unshare = function () {
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.unshareObject();
        });
    };
    /**
     * Deletes a sharing link by the kind of link
     *
     * @param kind The kind of link to be deleted.
     */
    FileFolderShared.prototype.deleteSharingLinkByKind = function (kind) {
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.deleteLinkByKind(kind);
        });
    };
    /**
     * Removes the specified link to the item.
     *
     * @param kind The kind of link to be deleted.
     * @param shareId The share id to delete
     */
    FileFolderShared.prototype.unshareLink = function (kind, shareId) {
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.unshareLink(kind, shareId);
        });
    };
    /**
     * For files and folders we need to use the associated item end point
     */
    FileFolderShared.prototype.getShareable = function () {
        var _this = this;
        // sharing only works on the item end point, not the file one - so we create a folder instance with the item url internally
        return this.clone(SharePointQueryableShareableFile, "listItemAllFields", false).select("odata.editlink").get().then(function (d) {
            var shareable = new SharePointQueryableShareable(odata_1.spGetEntityUrl(d));
            // we need to handle batching
            if (_this.hasBatch) {
                shareable = shareable.inBatch(_this.batch);
            }
            return shareable;
        });
    };
    return FileFolderShared;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.FileFolderShared = FileFolderShared;
var SharePointQueryableShareableFile = /** @class */ (function (_super) {
    __extends(SharePointQueryableShareableFile, _super);
    function SharePointQueryableShareableFile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Shares this item with one or more users
     *
     * @param loginNames string or string[] of resolved login names to which this item will be shared
     * @param role The role (View | Edit) applied to the share
     * @param shareEverything Share everything in this folder, even items with unique permissions.
     * @param requireSignin If true the user must signin to view link, otherwise anyone with the link can access the resource
     * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
     */
    SharePointQueryableShareableFile.prototype.shareWith = function (loginNames, role, requireSignin, emailData) {
        if (role === void 0) { role = types_1.SharingRole.View; }
        if (requireSignin === void 0) { requireSignin = false; }
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.shareWith(loginNames, role, requireSignin, false, emailData);
        });
    };
    return SharePointQueryableShareableFile;
}(FileFolderShared));
exports.SharePointQueryableShareableFile = SharePointQueryableShareableFile;
var SharePointQueryableShareableFolder = /** @class */ (function (_super) {
    __extends(SharePointQueryableShareableFolder, _super);
    function SharePointQueryableShareableFolder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Shares this item with one or more users
     *
     * @param loginNames string or string[] of resolved login names to which this item will be shared
     * @param role The role (View | Edit) applied to the share
     * @param shareEverything Share everything in this folder, even items with unique permissions.
     * @param requireSignin If true the user must signin to view link, otherwise anyone with the link can access the resource
     * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
     */
    SharePointQueryableShareableFolder.prototype.shareWith = function (loginNames, role, requireSignin, shareEverything, emailData) {
        if (role === void 0) { role = types_1.SharingRole.View; }
        if (requireSignin === void 0) { requireSignin = false; }
        if (shareEverything === void 0) { shareEverything = false; }
        var dependency = this.addBatchDependency();
        return this.getShareable().then(function (shareable) {
            dependency();
            return shareable.shareWith(loginNames, role, requireSignin, shareEverything, emailData);
        });
    };
    return SharePointQueryableShareableFolder;
}(FileFolderShared));
exports.SharePointQueryableShareableFolder = SharePointQueryableShareableFolder;


/***/ }),

/***/ "gzIf":
/*!***************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/relateditems.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var RelatedItemManagerImpl = /** @class */ (function (_super) {
    __extends(RelatedItemManagerImpl, _super);
    function RelatedItemManagerImpl(baseUrl, path) {
        if (path === void 0) { path = "_api/SP.RelatedItemManager"; }
        return _super.call(this, baseUrl, path) || this;
    }
    RelatedItemManagerImpl.FromUrl = function (url) {
        if (url === null) {
            return new RelatedItemManagerImpl("");
        }
        var index = url.indexOf("_api/");
        if (index > -1) {
            return new RelatedItemManagerImpl(url.substr(0, index));
        }
        return new RelatedItemManagerImpl(url);
    };
    RelatedItemManagerImpl.prototype.getRelatedItems = function (sourceListName, sourceItemId) {
        var query = this.clone(RelatedItemManagerImpl, null);
        query.concat(".GetRelatedItems");
        return query.postCore({
            body: JSON.stringify({
                SourceItemID: sourceItemId,
                SourceListName: sourceListName,
            }),
        });
    };
    RelatedItemManagerImpl.prototype.getPageOneRelatedItems = function (sourceListName, sourceItemId) {
        var query = this.clone(RelatedItemManagerImpl, null);
        query.concat(".GetPageOneRelatedItems");
        return query.postCore({
            body: JSON.stringify({
                SourceItemID: sourceItemId,
                SourceListName: sourceListName,
            }),
        });
    };
    RelatedItemManagerImpl.prototype.addSingleLink = function (sourceListName, sourceItemId, sourceWebUrl, targetListName, targetItemID, targetWebUrl, tryAddReverseLink) {
        if (tryAddReverseLink === void 0) { tryAddReverseLink = false; }
        var query = this.clone(RelatedItemManagerImpl, null);
        query.concat(".AddSingleLink");
        return query.postCore({
            body: JSON.stringify({
                SourceItemID: sourceItemId,
                SourceListName: sourceListName,
                SourceWebUrl: sourceWebUrl,
                TargetItemID: targetItemID,
                TargetListName: targetListName,
                TargetWebUrl: targetWebUrl,
                TryAddReverseLink: tryAddReverseLink,
            }),
        });
    };
    /**
     * Adds a related item link from an item specified by list name and item id, to an item specified by url
     *
     * @param sourceListName The source list name or list id
     * @param sourceItemId The source item id
     * @param targetItemUrl The target item url
     * @param tryAddReverseLink If set to true try to add the reverse link (will not return error if it fails)
     */
    RelatedItemManagerImpl.prototype.addSingleLinkToUrl = function (sourceListName, sourceItemId, targetItemUrl, tryAddReverseLink) {
        if (tryAddReverseLink === void 0) { tryAddReverseLink = false; }
        var query = this.clone(RelatedItemManagerImpl, null);
        query.concat(".AddSingleLinkToUrl");
        return query.postCore({
            body: JSON.stringify({
                SourceItemID: sourceItemId,
                SourceListName: sourceListName,
                TargetItemUrl: targetItemUrl,
                TryAddReverseLink: tryAddReverseLink,
            }),
        });
    };
    /**
     * Adds a related item link from an item specified by url, to an item specified by list name and item id
     *
     * @param sourceItemUrl The source item url
     * @param targetListName The target list name or list id
     * @param targetItemId The target item id
     * @param tryAddReverseLink If set to true try to add the reverse link (will not return error if it fails)
     */
    RelatedItemManagerImpl.prototype.addSingleLinkFromUrl = function (sourceItemUrl, targetListName, targetItemId, tryAddReverseLink) {
        if (tryAddReverseLink === void 0) { tryAddReverseLink = false; }
        var query = this.clone(RelatedItemManagerImpl, null);
        query.concat(".AddSingleLinkFromUrl");
        return query.postCore({
            body: JSON.stringify({
                SourceItemUrl: sourceItemUrl,
                TargetItemID: targetItemId,
                TargetListName: targetListName,
                TryAddReverseLink: tryAddReverseLink,
            }),
        });
    };
    RelatedItemManagerImpl.prototype.deleteSingleLink = function (sourceListName, sourceItemId, sourceWebUrl, targetListName, targetItemId, targetWebUrl, tryDeleteReverseLink) {
        if (tryDeleteReverseLink === void 0) { tryDeleteReverseLink = false; }
        var query = this.clone(RelatedItemManagerImpl, null);
        query.concat(".DeleteSingleLink");
        return query.postCore({
            body: JSON.stringify({
                SourceItemID: sourceItemId,
                SourceListName: sourceListName,
                SourceWebUrl: sourceWebUrl,
                TargetItemID: targetItemId,
                TargetListName: targetListName,
                TargetWebUrl: targetWebUrl,
                TryDeleteReverseLink: tryDeleteReverseLink,
            }),
        });
    };
    return RelatedItemManagerImpl;
}(sharepointqueryable_1.SharePointQueryable));
exports.RelatedItemManagerImpl = RelatedItemManagerImpl;


/***/ }),

/***/ "h3gW":
/*!*******************************************!*\
  !*** ./node_modules/@pnp/sp/telemetry.js ***!
  \*******************************************/
/*! exports provided: tag */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tag", function() { return tag; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/odata */ "xT8B");



/**
 * Includes this method name in the X-ClientService-ClientTag used to record pnpjs usage
 *
 * @param name Method name, displayed in the
 */
function tag(name) {
    return function (target, key, descriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
                return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                    this.configure(Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["headers"])({ "X-PnPjs-Tracking": name }));
                    return [2 /*return*/, originalMethod.apply(this, args)];
                });
            });
        };
        return descriptor;
    };
}
tag.getClientTag = function (h, deleteFromCollection) {
    if (deleteFromCollection === void 0) { deleteFromCollection = true; }
    if (h.has("X-PnPjs-Tracking")) {
        var methodName = h.get("X-PnPjs-Tracking");
        if (deleteFromCollection) {
            h.delete("X-PnPjs-Tracking");
        }
        if (!Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["stringIsNullOrEmpty"])(methodName)) {
            return methodName;
        }
    }
    return "";
};
tag.configure = function (o, name) {
    return o.configure(Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["headers"])({ "X-PnPjs-Tracking": name }));
};
tag.isTagged = function (o) {
    return o.data.options.headers && o.data.options.headers["X-PnPjs-Tracking"];
};
//# sourceMappingURL=telemetry.js.map

/***/ }),

/***/ "hMpi":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/decorators.js ***!
  \********************************************/
/*! exports provided: defaultPath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultPath", function() { return defaultPath; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/**
 * Class Decorators
 */

/**
 * Decorator used to specify the default path for SharePointQueryable objects
 *
 * @param path
 */
function defaultPath(path) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target) {
        return /** @class */ (function (_super) {
            Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _super.call(this, args[0], args.length > 1 && args[1] !== undefined ? args[1] : path) || this;
            }
            return class_1;
        }(target));
    };
}
// TODO::?
// performance tracking method decorator
// redirect to graph api
//# sourceMappingURL=decorators.js.map

/***/ }),

/***/ "hd/X":
/*!***************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/collections/collections.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic dictionary
 */
var Dictionary = /** @class */ (function () {
    /**
     * Creates a new instance of the Dictionary<T> class
     *
     * @constructor
     */
    function Dictionary(keys, values) {
        if (keys === void 0) { keys = []; }
        if (values === void 0) { values = []; }
        this.keys = keys;
        this.values = values;
    }
    /**
     * Gets a value from the collection using the specified key
     *
     * @param key The key whose value we want to return, returns null if the key does not exist
     */
    Dictionary.prototype.get = function (key) {
        var index = this.keys.indexOf(key);
        if (index < 0) {
            return null;
        }
        return this.values[index];
    };
    /**
     * Adds the supplied key and value to the dictionary
     *
     * @param key The key to add
     * @param o The value to add
     */
    Dictionary.prototype.add = function (key, o) {
        var index = this.keys.indexOf(key);
        if (index > -1) {
            this.values[index] = o;
        }
        else {
            this.keys.push(key);
            this.values.push(o);
        }
    };
    /**
     * Merges the supplied typed hash into this dictionary instance. Existing values are updated and new ones are created as appropriate.
     */
    Dictionary.prototype.merge = function (source) {
        var _this = this;
        if ("getKeys" in source) {
            var sourceAsDictionary_1 = source;
            sourceAsDictionary_1.getKeys().map(function (key) {
                _this.add(key, sourceAsDictionary_1.get(key));
            });
        }
        else {
            var sourceAsHash = source;
            for (var key in sourceAsHash) {
                if (sourceAsHash.hasOwnProperty(key)) {
                    this.add(key, sourceAsHash[key]);
                }
            }
        }
    };
    /**
     * Removes a value from the dictionary
     *
     * @param key The key of the key/value pair to remove. Returns null if the key was not found.
     */
    Dictionary.prototype.remove = function (key) {
        var index = this.keys.indexOf(key);
        if (index < 0) {
            return null;
        }
        var val = this.values[index];
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        return val;
    };
    /**
     * Returns all the keys currently in the dictionary as an array
     */
    Dictionary.prototype.getKeys = function () {
        return this.keys;
    };
    /**
     * Returns all the values currently in the dictionary as an array
     */
    Dictionary.prototype.getValues = function () {
        return this.values;
    };
    /**
     * Clears the current dictionary
     */
    Dictionary.prototype.clear = function () {
        this.keys = [];
        this.values = [];
    };
    /**
     * Gets a count of the items currently in the dictionary
     */
    Dictionary.prototype.count = function () {
        return this.keys.length;
    };
    return Dictionary;
}());
exports.Dictionary = Dictionary;


/***/ }),

/***/ "hy0S":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/lists/types.js ***!
  \*********************************************/
/*! exports provided: _Lists, Lists, _List, List, RenderListDataOptions, ControlMode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_Lists", function() { return _Lists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Lists", function() { return Lists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_List", function() { return _List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "List", function() { return List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderListDataOptions", function() { return RenderListDataOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ControlMode", function() { return ControlMode; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../sharepointqueryable.js */ "E6kk");
/* harmony import */ var _odata_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../odata.js */ "5dQz");
/* harmony import */ var _utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/metadata.js */ "z067");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../decorators.js */ "hMpi");
/* harmony import */ var _operations_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../operations.js */ "UK2s");
/* harmony import */ var _utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/escapeQueryStrValue.js */ "q1Lp");
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../telemetry.js */ "h3gW");
/* harmony import */ var _utils_toResourcePath_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/toResourcePath.js */ "t8hP");











var _Lists = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_Lists, _super);
    function _Lists() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the list (GUID)
     */
    _Lists.prototype.getById = function (id) {
        return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(List(this).concat("('" + id + "')"), "ls.getById");
    };
    /**
     * Gets a list from the collection by title
     *
     * @param title The title of the list
     */
    _Lists.prototype.getByTitle = function (title) {
        return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(List(this, "getByTitle('" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_8__["escapeQueryStrValue"])(title) + "')"), "ls.getByTitle");
    };
    /**
     * Adds a new list to the collection
     *
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body
     */
    _Lists.prototype.add = function (title, desc, template, enableContentTypes, additionalSettings) {
        if (desc === void 0) { desc = ""; }
        if (template === void 0) { template = 100; }
        if (enableContentTypes === void 0) { enableContentTypes = false; }
        if (additionalSettings === void 0) { additionalSettings = {}; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var addSettings, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addSettings = Object.assign({
                            "AllowContentTypes": enableContentTypes,
                            "BaseTemplate": template,
                            "ContentTypesEnabled": enableContentTypes,
                            "Description": desc,
                            "Title": title,
                        }, Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__["metadata"])("SP.List"), additionalSettings);
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this, Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])(addSettings))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, { data: data, list: this.getByTitle(addSettings.Title) }];
                }
            });
        });
    };
    /**
     * Ensures that the specified list exists in the collection (note: this method not supported for batching)
     *
     * @param title The new list's title
     * @param desc The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body or used to update an existing list
     */
    _Lists.prototype.ensure = function (title, desc, template, enableContentTypes, additionalSettings) {
        if (desc === void 0) { desc = ""; }
        if (template === void 0) { template = 100; }
        if (enableContentTypes === void 0) { enableContentTypes = false; }
        if (additionalSettings === void 0) { additionalSettings = {}; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var addOrUpdateSettings, list, data, e_1, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.hasBatch) {
                            throw Error("The ensure list method is not supported for use in a batch.");
                        }
                        addOrUpdateSettings = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(additionalSettings, { Title: title, Description: desc, ContentTypesEnabled: enableContentTypes }, true);
                        list = this.getByTitle(addOrUpdateSettings.Title);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 6]);
                        // this will throw if the list doesn't exist
                        return [4 /*yield*/, list.select("Title")()];
                    case 2:
                        // this will throw if the list doesn't exist
                        _a.sent();
                        return [4 /*yield*/, list.update(addOrUpdateSettings).then(function (r) { return r.data; })];
                    case 3:
                        data = _a.sent();
                        return [2 /*return*/, { created: false, data: data, list: this.getByTitle(addOrUpdateSettings.Title) }];
                    case 4:
                        e_1 = _a.sent();
                        return [4 /*yield*/, this.add(title, desc, template, enableContentTypes, addOrUpdateSettings).then(function (r) { return r.data; })];
                    case 5:
                        data = _a.sent();
                        return [2 /*return*/, { created: true, data: data, list: this.getByTitle(addOrUpdateSettings.Title) }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets a list that is the default asset location for images or other files, which the users upload to their wiki pages.
     */
    _Lists.prototype.ensureSiteAssetsLibrary = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var json;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(Lists, "ensuresiteassetslibrary"))];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, List(Object(_odata_js__WEBPACK_IMPORTED_MODULE_4__["odataUrlFrom"])(json))];
                }
            });
        });
    };
    /**
     * Gets a list that is the default location for wiki pages.
     */
    _Lists.prototype.ensureSitePagesLibrary = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var json;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(Lists, "ensuresitepageslibrary"))];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, List(Object(_odata_js__WEBPACK_IMPORTED_MODULE_4__["odataUrlFrom"])(json))];
                }
            });
        });
    };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("ls.add")
    ], _Lists.prototype, "add", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("ls.ensure")
    ], _Lists.prototype, "ensure", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("ls.ensureSiteAssetsLibrary")
    ], _Lists.prototype, "ensureSiteAssetsLibrary", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("ls.ensureSitePagesLibrary")
    ], _Lists.prototype, "ensureSitePagesLibrary", null);
    _Lists = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_decorators_js__WEBPACK_IMPORTED_MODULE_6__["defaultPath"])("lists")
    ], _Lists);
    return _Lists;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["_SharePointQueryableCollection"]));

var Lists = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["spInvokableFactory"])(_Lists);
var _List = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_List, _super);
    function _List() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delete = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["deleteableWithETag"])("l");
        return _this;
    }
    Object.defineProperty(_List.prototype, "effectiveBasePermissions", {
        /**
         * Gets the effective base permissions of this list
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["SharePointQueryable"])(this, "EffectiveBasePermissions"), "l.effectiveBasePermissions");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_List.prototype, "eventReceivers", {
        /**
         * Gets the event receivers attached to this list
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["SharePointQueryableCollection"])(this, "EventReceivers"), "l.eventReceivers");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_List.prototype, "relatedFields", {
        /**
         * Gets the related fields of this list
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["SharePointQueryable"])(this, "getRelatedFields"), "l.relatedFields");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_List.prototype, "informationRightsManagementSettings", {
        /**
         * Gets the IRM settings for this list
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["SharePointQueryable"])(this, "InformationRightsManagementSettings"), "l.informationRightsManagementSettings");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    _List.prototype.update = function (properties, eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var postBody, data, list;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__["metadata"])("SP.List"), properties), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["headers"])({
                            "IF-Match": eTag,
                            "X-HTTP-Method": "MERGE",
                        }));
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this, postBody)];
                    case 1:
                        data = _a.sent();
                        list = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(properties, "Title") ? this.getParent(List, this.parentUrl, "getByTitle('" + properties.Title + "')") : List(this);
                        return [2 /*return*/, {
                                data: data,
                                list: list,
                            }];
                }
            });
        });
    };
    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     * @param query A query that is performed against the change log.
     */
    _List.prototype.getChanges = function (query) {
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(List, "getchanges"), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])({ query: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__["metadata"])("SP.ChangeQuery"), query) }));
    };
    /**
     * Returns the collection of items in the list based on the provided CamlQuery
     * @param query A query that is performed against the list
     * @param expands An expanded array of n items that contains fields to expand in the CamlQuery
     */
    _List.prototype.getItemsByCAMLQuery = function (query) {
        var expands = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            expands[_i - 1] = arguments[_i];
        }
        var q = this.clone(List, "getitems");
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(q.expand.apply(q, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(expands), false)), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])({ query: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__["metadata"])("SP.CamlQuery"), query) }));
    };
    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     * @param query An object that defines the change log item query
     */
    _List.prototype.getListItemChangesSinceToken = function (query) {
        var o = this.clone(List, "getlistitemchangessincetoken").usingParser({
            parse: function (r) {
                return r.text();
            },
        });
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(o, Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])({ "query": Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__["metadata"])("SP.ChangeLogItemQuery"), query) }));
    };
    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    _List.prototype.recycle = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(List, "recycle"))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(data, "Recycle") ? data.Recycle : data];
                }
            });
        });
    };
    /**
     * Renders list data based on the view xml provided
     * @param viewXml A string object representing a view xml
     */
    _List.prototype.renderListData = function (viewXml) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var q, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = this.clone(List, "renderlistdata(@viewXml)");
                        q.query.set("@viewXml", "'" + viewXml + "'");
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(q)];
                    case 1:
                        data = _a.sent();
                        // data will be a string, so we parse it again
                        return [2 /*return*/, JSON.parse(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(data, "RenderListData") ? data.RenderListData : data)];
                }
            });
        });
    };
    /**
     * Returns the data for the specified query view
     *
     * @param parameters The parameters to be used to render list data as JSON string.
     * @param overrideParams The parameters that are used to override and extend the regular SPRenderListDataParameters.
     * @param query Allows setting of query parameters
     */
    _List.prototype.renderListDataAsStream = function (parameters, overrideParams, query) {
        if (overrideParams === void 0) { overrideParams = null; }
        if (query === void 0) { query = new Map(); }
        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(parameters, "RenderOptions") && Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["isArray"])(parameters.RenderOptions)) {
            parameters.RenderOptions = parameters.RenderOptions.reduce(function (v, c) { return v + c; });
        }
        var bodyOptions = { parameters: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__["metadata"])("SP.RenderListDataParameters"), parameters) };
        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(overrideParams)) {
            bodyOptions = Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(bodyOptions, { overrideParameters: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__["metadata"])("SP.RenderListDataOverrideParameters"), overrideParams) });
        }
        var clone = this.clone(List, "RenderListDataAsStream", true, true);
        if (query && query.size > 0) {
            query.forEach(function (v, k) { return clone.query.set(k, v); });
        }
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(clone, Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])(bodyOptions));
    };
    /**
     * Gets the field values and field schema attributes for a list item.
     * @param itemId Item id of the item to render form data for
     * @param formId The id of the form
     * @param mode Enum representing the control mode of the form (Display, Edit, New)
     */
    _List.prototype.renderListFormData = function (itemId, formId, mode) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(List, "renderlistformdata(itemid=" + itemId + ", formid='" + formId + "', mode='" + mode + "')"))];
                    case 1:
                        data = _a.sent();
                        // data will be a string, so we parse it again
                        return [2 /*return*/, JSON.parse(Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(data, "RenderListFormData") ? data.RenderListFormData : data)];
                }
            });
        });
    };
    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    _List.prototype.reserveListItemId = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(List, "reservelistitemid"))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(data, "ReserveListItemId") ? data.ReserveListItemId : data];
                }
            });
        });
    };
    /**
     * Returns the ListItemEntityTypeFullName for this list, used when adding/updating list items. Does not support batching.
     */
    _List.prototype.getListItemEntityTypeFullName = function () {
        // we cache these requests as the entity name doesn't change and we can save traffic
        // this is justified as this method generates our second highest number of monthly executions ahead of item add and update
        return this.clone(List, null, false).select("ListItemEntityTypeFullName").usingCaching({
            expiration: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["dateAdd"])(new Date(), "day", 5),
            key: "PnPjs-ListEntityName:" + this.toUrl(),
            storeName: "local",
        })().then(function (o) { return o.ListItemEntityTypeFullName; });
    };
    /**
     * Creates an item using path (in a folder), validates and sets its field values.
     *
     * @param formValues The fields to change and their new values.
     * @param decodedUrl Path decoded url; folder's server relative path.
     * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     * @param checkInComment Optional check in comment.
     * @param additionalProps Optional set of additional properties LeafName new document file name,
     */
    _List.prototype.addValidateUpdateItemUsingPath = function (formValues, decodedUrl, bNewDocumentUpdate, checkInComment, additionalProps) {
        if (bNewDocumentUpdate === void 0) { bNewDocumentUpdate = false; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var addProps, res;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addProps = {
                            FolderPath: Object(_utils_toResourcePath_js__WEBPACK_IMPORTED_MODULE_10__["toResourcePath"])(decodedUrl),
                        };
                        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["objectDefinedNotNull"])(additionalProps)) {
                            if (additionalProps.leafName) {
                                addProps.LeafName = Object(_utils_toResourcePath_js__WEBPACK_IMPORTED_MODULE_10__["toResourcePath"])(additionalProps.leafName);
                            }
                            if (additionalProps.objectType) {
                                addProps.UnderlyingObjectType = additionalProps.objectType;
                            }
                        }
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(List, "AddValidateUpdateItemUsingPath()"), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_2__["body"])({
                                bNewDocumentUpdate: bNewDocumentUpdate,
                                checkInComment: checkInComment,
                                formValues: formValues,
                                listItemCreateInfo: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_5__["metadata"])("SP.ListItemCreationInformationUsingPath"), addProps),
                            }))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(res, "AddValidateUpdateItemUsingPath") ? res.AddValidateUpdateItemUsingPath : res];
                }
            });
        });
    };
    /**
     * Gets the parent information for this item's list and web
     */
    _List.prototype.getParentInfos = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var urlInfo;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.select("Id", "RootFolder/UniqueId", "RootFolder/ServerRelativeUrl", "RootFolder/ServerRelativePath", "ParentWeb/Id", "ParentWeb/Url", "ParentWeb/ServerRelativeUrl", "ParentWeb/ServerRelativePath").expand("RootFolder", "ParentWeb")()];
                    case 1:
                        urlInfo = _a.sent();
                        return [2 /*return*/, {
                                List: {
                                    Id: urlInfo.Id,
                                    RootFolderServerRelativePath: urlInfo.RootFolder.ServerRelativePath,
                                    RootFolderServerRelativeUrl: urlInfo.RootFolder.ServerRelativeUrl,
                                    RootFolderUniqueId: urlInfo.RootFolder.UniqueId,
                                },
                                ParentWeb: {
                                    Id: urlInfo.ParentWeb.Id,
                                    ServerRelativePath: urlInfo.ParentWeb.ServerRelativePath,
                                    ServerRelativeUrl: urlInfo.ParentWeb.ServerRelativeUrl,
                                    Url: urlInfo.ParentWeb.Url,
                                },
                            }];
                }
            });
        });
    };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.update")
    ], _List.prototype, "update", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.getChanges")
    ], _List.prototype, "getChanges", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.CAMLQuery")
    ], _List.prototype, "getItemsByCAMLQuery", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.ChangesSinceToken")
    ], _List.prototype, "getListItemChangesSinceToken", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.recycle")
    ], _List.prototype, "recycle", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.renderListData")
    ], _List.prototype, "renderListData", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.AsStream")
    ], _List.prototype, "renderListDataAsStream", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.renderListFormData")
    ], _List.prototype, "renderListFormData", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.reserveListItemId")
    ], _List.prototype, "reserveListItemId", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.getListItemEntityTypeFullName")
    ], _List.prototype, "getListItemEntityTypeFullName", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_9__["tag"])("l.addValidateUpdateItemUsingPath")
    ], _List.prototype, "addValidateUpdateItemUsingPath", null);
    return _List;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["_SharePointQueryableInstance"]));

var List = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_3__["spInvokableFactory"])(_List);
/**
 * Enum representing the options of the RenderOptions property on IRenderListDataParameters interface
 */
var RenderListDataOptions;
(function (RenderListDataOptions) {
    RenderListDataOptions[RenderListDataOptions["None"] = 0] = "None";
    RenderListDataOptions[RenderListDataOptions["ContextInfo"] = 1] = "ContextInfo";
    RenderListDataOptions[RenderListDataOptions["ListData"] = 2] = "ListData";
    RenderListDataOptions[RenderListDataOptions["ListSchema"] = 4] = "ListSchema";
    RenderListDataOptions[RenderListDataOptions["MenuView"] = 8] = "MenuView";
    RenderListDataOptions[RenderListDataOptions["ListContentType"] = 16] = "ListContentType";
    RenderListDataOptions[RenderListDataOptions["FileSystemItemId"] = 32] = "FileSystemItemId";
    RenderListDataOptions[RenderListDataOptions["ClientFormSchema"] = 64] = "ClientFormSchema";
    RenderListDataOptions[RenderListDataOptions["QuickLaunch"] = 128] = "QuickLaunch";
    RenderListDataOptions[RenderListDataOptions["Spotlight"] = 256] = "Spotlight";
    RenderListDataOptions[RenderListDataOptions["Visualization"] = 512] = "Visualization";
    RenderListDataOptions[RenderListDataOptions["ViewMetadata"] = 1024] = "ViewMetadata";
    RenderListDataOptions[RenderListDataOptions["DisableAutoHyperlink"] = 2048] = "DisableAutoHyperlink";
    RenderListDataOptions[RenderListDataOptions["EnableMediaTAUrls"] = 4096] = "EnableMediaTAUrls";
    RenderListDataOptions[RenderListDataOptions["ParentInfo"] = 8192] = "ParentInfo";
    RenderListDataOptions[RenderListDataOptions["PageContextInfo"] = 16384] = "PageContextInfo";
    RenderListDataOptions[RenderListDataOptions["ClientSideComponentManifest"] = 32768] = "ClientSideComponentManifest";
})(RenderListDataOptions || (RenderListDataOptions = {}));
/**
 * Determines the display mode of the given control or view
 */
var ControlMode;
(function (ControlMode) {
    ControlMode[ControlMode["Display"] = 1] = "Display";
    ControlMode[ControlMode["Edit"] = 2] = "Edit";
    ControlMode[ControlMode["New"] = 3] = "New";
})(ControlMode || (ControlMode = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "hyGn":
/*!***********************************************!*\
  !*** ./node_modules/@pnp/common/libconfig.js ***!
  \***********************************************/
/*! exports provided: setup, onRuntimeCreate, Runtime, DefaultRuntime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setup", function() { return setup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onRuntimeCreate", function() { return onRuntimeCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Runtime", function() { return Runtime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultRuntime", function() { return DefaultRuntime; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "lzYu");
/* harmony import */ var _collections_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./collections.js */ "eVhm");


function setup(config, runtime) {
    if (runtime === void 0) { runtime = DefaultRuntime; }
    runtime.assign(config);
}
// lable mapping for known config values
var s = [
    "defaultCachingStore",
    "defaultCachingTimeoutSeconds",
    "globalCacheDisable",
    "enableCacheExpiration",
    "cacheExpirationIntervalMilliseconds",
    "spfxContext",
    "ie11",
];
var runtimeCreateHooks = [];
function onRuntimeCreate(hook) {
    if (runtimeCreateHooks.indexOf(hook) < 0) {
        // apply hook logic to default runtime
        hook(DefaultRuntime);
        runtimeCreateHooks.push(hook);
    }
}
var Runtime = /** @class */ (function () {
    function Runtime(_v) {
        var _this = this;
        if (_v === void 0) { _v = new Map(); }
        this._v = _v;
        var defaulter = function (key, def) {
            if (!_this._v.has(key)) {
                _this._v.set(key, def);
            }
        };
        // setup defaults
        defaulter(s[0], "session");
        defaulter(s[1], 60);
        defaulter(s[2], false);
        defaulter(s[3], false);
        defaulter(s[4], 750);
        defaulter(s[5], null);
        defaulter(s[6], false);
        runtimeCreateHooks.forEach(function (hook) { return hook(_this); });
    }
    /**
     *
     * @param config The set of properties to add to this runtime instance
     */
    Runtime.prototype.assign = function (config) {
        this._v = Object(_collections_js__WEBPACK_IMPORTED_MODULE_1__["mergeMaps"])(this._v, Object(_collections_js__WEBPACK_IMPORTED_MODULE_1__["objectToMap"])(config));
    };
    /**
     * Gets a runtime value using T to define the available keys, and R to define the type returned by that key
     *
     * @param key
     */
    Runtime.prototype.get = function (key) {
        return this._v.get(key);
    };
    /**
     * Exports the internal Map representing this runtime
     */
    Runtime.prototype.export = function () {
        var e_1, _a;
        var expt = new Map();
        try {
            for (var _b = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(this._v), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_c.value, 2), key = _d[0], value = _d[1];
                if (key !== "__isDefault__") {
                    expt.set(key, value);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return expt;
    };
    return Runtime;
}());

// default runtime used globally
var _runtime = new Runtime(new Map([["__isDefault__", true]]));
var DefaultRuntime = _runtime;
//# sourceMappingURL=libconfig.js.map

/***/ }),

/***/ "i8K7":
/*!****************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/searchsuggest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var SearchSuggest = /** @class */ (function (_super) {
    __extends(SearchSuggest, _super);
    function SearchSuggest(baseUrl, path) {
        if (path === void 0) { path = "_api/search/suggest"; }
        return _super.call(this, baseUrl, path) || this;
    }
    SearchSuggest.prototype.execute = function (query) {
        this.mapQueryToQueryString(query);
        return this.get().then(function (response) { return new SearchSuggestResult(response); });
    };
    SearchSuggest.prototype.mapQueryToQueryString = function (query) {
        this.query.add("querytext", "'" + query.querytext + "'");
        if (query.hasOwnProperty("count")) {
            this.query.add("inumberofquerysuggestions", query.count.toString());
        }
        if (query.hasOwnProperty("personalCount")) {
            this.query.add("inumberofresultsuggestions", query.personalCount.toString());
        }
        if (query.hasOwnProperty("preQuery")) {
            this.query.add("fprequerysuggestions", query.preQuery.toString());
        }
        if (query.hasOwnProperty("hitHighlighting")) {
            this.query.add("fhithighlighting", query.hitHighlighting.toString());
        }
        if (query.hasOwnProperty("capitalize")) {
            this.query.add("fcapitalizefirstletters", query.capitalize.toString());
        }
        if (query.hasOwnProperty("culture")) {
            this.query.add("culture", query.culture.toString());
        }
        if (query.hasOwnProperty("stemming")) {
            this.query.add("enablestemming", query.stemming.toString());
        }
        if (query.hasOwnProperty("includePeople")) {
            this.query.add("showpeoplenamesuggestions", query.includePeople.toString());
        }
        if (query.hasOwnProperty("queryRules")) {
            this.query.add("enablequeryrules", query.queryRules.toString());
        }
        if (query.hasOwnProperty("prefixMatch")) {
            this.query.add("fprefixmatchallterms", query.prefixMatch.toString());
        }
    };
    return SearchSuggest;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.SearchSuggest = SearchSuggest;
var SearchSuggestResult = /** @class */ (function () {
    function SearchSuggestResult(json) {
        if (json.hasOwnProperty("suggest")) {
            // verbose
            this.PeopleNames = json.suggest.PeopleNames.results;
            this.PersonalResults = json.suggest.PersonalResults.results;
            this.Queries = json.suggest.Queries.results;
        }
        else {
            this.PeopleNames = json.PeopleNames;
            this.PersonalResults = json.PersonalResults;
            this.Queries = json.Queries;
        }
    }
    return SearchSuggestResult;
}());
exports.SearchSuggestResult = SearchSuggestResult;


/***/ }),

/***/ "ilAS":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/sites/types.js ***!
  \*********************************************/
/*! exports provided: _Site, Site */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_Site", function() { return _Site; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Site", function() { return Site; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sharepointqueryable.js */ "E6kk");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../decorators.js */ "hMpi");
/* harmony import */ var _webs_types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webs/types.js */ "dVsc");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_odata__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @pnp/odata */ "xT8B");
/* harmony import */ var _odata_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../odata.js */ "5dQz");
/* harmony import */ var _operations_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../operations.js */ "UK2s");
/* harmony import */ var _batch_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../batch.js */ "8xxP");
/* harmony import */ var _utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/escapeQueryStrValue.js */ "q1Lp");
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../telemetry.js */ "h3gW");
/* harmony import */ var _utils_metadata_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/metadata.js */ "z067");
/* harmony import */ var _utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../utils/extractweburl.js */ "tSEd");
/* harmony import */ var _splibconfig_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../splibconfig.js */ "0p/9");














var _Site = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(_Site, _super);
    function _Site() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(_Site.prototype, "rootWeb", {
        /**
         * Gets the root web of the site collection
         *
         */
        get: function () {
            return _telemetry_js__WEBPACK_IMPORTED_MODULE_10__["tag"].configure(Object(_webs_types_js__WEBPACK_IMPORTED_MODULE_3__["Web"])(this, "rootweb").configureFrom(this), "si.rootWeb");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query
     *
     * @param query The change query
     */
    _Site.prototype.getChanges = function (query) {
        var postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_5__["body"])({ "query": Object(_pnp_common__WEBPACK_IMPORTED_MODULE_4__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_11__["metadata"])("SP.ChangeQuery"), query) });
        return Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(_webs_types_js__WEBPACK_IMPORTED_MODULE_3__["Web"], "getchanges"), postBody);
    };
    /**
     * Opens a web by id (using POST)
     *
     * @param webId The GUID id of the web to open
     */
    _Site.prototype.openWebById = function (webId) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(this.clone(Site, "openWebById('" + webId + "')"))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data,
                                web: Object(_webs_types_js__WEBPACK_IMPORTED_MODULE_3__["Web"])(Object(_utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_12__["extractWebUrl"])(Object(_odata_js__WEBPACK_IMPORTED_MODULE_6__["odataUrlFrom"])(data))).configureFrom(this),
                            }];
                }
            });
        });
    };
    /**
     * Gets a Web instance representing the root web of the site collection
     * correctly setup for chaining within the library
     */
    _Site.prototype.getRootWeb = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var web;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rootWeb.select("Url")()];
                    case 1:
                        web = _a.sent();
                        return [2 /*return*/, _telemetry_js__WEBPACK_IMPORTED_MODULE_10__["tag"].configure(Object(_webs_types_js__WEBPACK_IMPORTED_MODULE_3__["Web"])(web.Url).configureFrom(this), "si.getRootWeb")];
                }
            });
        });
    };
    /**
     * Gets the context information for this site collection
     */
    _Site.prototype.getContextInfo = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var site, q, data, info;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        site = Site(this.parentUrl, "_api/contextinfo").configureFrom(this);
                        q = _telemetry_js__WEBPACK_IMPORTED_MODULE_10__["tag"].configure(site, "si.getContextInfo");
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(q)];
                    case 1:
                        data = _a.sent();
                        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_4__["hOP"])(data, "GetContextWebInformation")) {
                            info = data.GetContextWebInformation;
                            info.SupportedSchemaVersions = info.SupportedSchemaVersions.results;
                            return [2 /*return*/, info];
                        }
                        else {
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    _Site.prototype.createBatch = function () {
        return new _batch_js__WEBPACK_IMPORTED_MODULE_8__["SPBatch"](this.parentUrl, this.getRuntime());
    };
    /**
     * Deletes the current site
     *
     */
    _Site.prototype.delete = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var site, q;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clone(Site, "").select("Id")()];
                    case 1:
                        site = _a.sent();
                        q = _telemetry_js__WEBPACK_IMPORTED_MODULE_10__["tag"].configure(Site(this.parentUrl, "_api/SPSiteManager/Delete"), "si.delete");
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(q, Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_5__["body"])({ siteId: site.Id }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the document libraries on a site. Static method. (SharePoint Online only)
     *
     * @param absoluteWebUrl The absolute url of the web whose document libraries should be returned
     */
    _Site.prototype.getDocumentLibraries = function (absoluteWebUrl) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var q, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = _telemetry_js__WEBPACK_IMPORTED_MODULE_10__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["SharePointQueryable"])("", "_api/sp.web.getdocumentlibraries(@v)"), "si.getDocumentLibraries");
                        q.query.set("@v", "'" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_9__["escapeQueryStrValue"])(absoluteWebUrl) + "'");
                        return [4 /*yield*/, q()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_4__["hOP"])(data, "GetDocumentLibraries") ? data.GetDocumentLibraries : data];
                }
            });
        });
    };
    /**
     * Gets the site url from a page url
     *
     * @param absolutePageUrl The absolute url of the page
     */
    _Site.prototype.getWebUrlFromPageUrl = function (absolutePageUrl) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var q, data;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = _telemetry_js__WEBPACK_IMPORTED_MODULE_10__["tag"].configure(Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["SharePointQueryable"])("", "_api/sp.web.getweburlfrompageurl(@v)"), "si.getWebUrlFromPageUrl");
                        q.query.set("@v", "'" + Object(_utils_escapeQueryStrValue_js__WEBPACK_IMPORTED_MODULE_9__["escapeQueryStrValue"])(absolutePageUrl) + "'");
                        return [4 /*yield*/, q()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, Object(_pnp_common__WEBPACK_IMPORTED_MODULE_4__["hOP"])(data, "GetWebUrlFromPageUrl") ? data.GetWebUrlFromPageUrl : data];
                }
            });
        });
    };
    /**
     * Creates a Modern communication site.
     *
     * @param title The title of the site to create
     * @param lcid The language to use for the site. If not specified will default to 1033 (English).
     * @param shareByEmailEnabled If set to true, it will enable sharing files via Email. By default it is set to false
     * @param url The fully qualified URL (e.g. https://yourtenant.sharepoint.com/sites/mysitecollection) of the site.
     * @param description The description of the communication site.
     * @param classification The Site classification to use. For instance 'Contoso Classified'. See https://www.youtube.com/watch?v=E-8Z2ggHcS0 for more information
     * @param siteDesignId The Guid of the site design to be used.
     *                     You can use the below default OOTB GUIDs:
     *                     Topic: 00000000-0000-0000-0000-000000000000
     *                     Showcase: 6142d2a0-63a5-4ba0-aede-d9fefca2c767
     *                     Blank: f6cc5403-0d63-442e-96c0-285923709ffc
     * @param hubSiteId The id of the hub site to which the new site should be associated
     * @param owner Optional owner value, required if executing the method in app only mode
     */
    _Site.prototype.createCommunicationSite = function (title, lcid, shareByEmailEnabled, url, description, classification, siteDesignId, hubSiteId, owner) {
        if (lcid === void 0) { lcid = 1033; }
        if (shareByEmailEnabled === void 0) { shareByEmailEnabled = false; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                return [2 /*return*/, this.createCommunicationSiteFromProps({
                        Classification: classification,
                        Description: description,
                        HubSiteId: hubSiteId,
                        Lcid: lcid,
                        Owner: owner,
                        ShareByEmailEnabled: shareByEmailEnabled,
                        SiteDesignId: siteDesignId,
                        Title: title,
                        Url: url,
                    })];
            });
        });
    };
    _Site.prototype.createCommunicationSiteFromProps = function (props) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var p, postBody;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                p = Object.assign({}, {
                    Classification: "",
                    Description: "",
                    HubSiteId: _splibconfig_js__WEBPACK_IMPORTED_MODULE_13__["emptyGuid"],
                    Lcid: 1033,
                    ShareByEmailEnabled: false,
                    SiteDesignId: _splibconfig_js__WEBPACK_IMPORTED_MODULE_13__["emptyGuid"],
                    WebTemplate: "SITEPAGEPUBLISHING#0",
                    WebTemplateExtensionId: _splibconfig_js__WEBPACK_IMPORTED_MODULE_13__["emptyGuid"],
                }, props);
                postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_5__["body"])({
                    "request": Object(_pnp_common__WEBPACK_IMPORTED_MODULE_4__["assign"])(Object(_utils_metadata_js__WEBPACK_IMPORTED_MODULE_11__["metadata"])("Microsoft.SharePoint.Portal.SPSiteCreationRequest"), p),
                });
                return [2 /*return*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(Site(Object(_utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_12__["extractWebUrl"])(this.toUrl()), "/_api/SPSiteManager/Create"), postBody)];
            });
        });
    };
    /**
     *
     * @param url Site Url that you want to check if exists
     */
    _Site.prototype.exists = function (url) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var postBody, value;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postBody = Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_5__["body"])({ url: url });
                        return [4 /*yield*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(Site(Object(_utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_12__["extractWebUrl"])(this.toUrl()), "/_api/SP.Site.Exists"), postBody)];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, value];
                }
            });
        });
    };
    /**
     * Creates a Modern team site backed by Office 365 group. For use in SP Online only. This will not work with App-only tokens
     *
     * @param displayName The title or display name of the Modern team site to be created
     * @param alias Alias of the underlying Office 365 Group
     * @param isPublic Defines whether the Office 365 Group will be public (default), or private.
     * @param lcid The language to use for the site. If not specified will default to English (1033).
     * @param description The description of the site to be created.
     * @param classification The Site classification to use. For instance 'Contoso Classified'. See https://www.youtube.com/watch?v=E-8Z2ggHcS0 for more information
     * @param owners The Owners of the site to be created
     */
    _Site.prototype.createModernTeamSite = function (displayName, alias, isPublic, lcid, description, classification, owners, hubSiteId, siteDesignId) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                return [2 /*return*/, this.createModernTeamSiteFromProps({
                        alias: alias,
                        classification: classification,
                        description: description,
                        displayName: displayName,
                        hubSiteId: hubSiteId,
                        isPublic: isPublic,
                        lcid: lcid,
                        owners: owners,
                        siteDesignId: siteDesignId,
                    })];
            });
        });
    };
    _Site.prototype.createModernTeamSiteFromProps = function (props) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var p, postBody;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                p = Object.assign({}, {
                    classification: "",
                    description: "",
                    hubSiteId: _splibconfig_js__WEBPACK_IMPORTED_MODULE_13__["emptyGuid"],
                    isPublic: true,
                    lcid: 1033,
                    owners: [],
                }, props);
                postBody = {
                    alias: p.alias,
                    displayName: p.displayName,
                    isPublic: p.isPublic,
                    optionalParams: {
                        Classification: p.classification,
                        CreationOptions: {
                            "results": ["SPSiteLanguage:" + p.lcid, "HubSiteId:" + p.hubSiteId],
                        },
                        Description: p.description,
                        Owners: {
                            "results": p.owners,
                        },
                    },
                };
                if (p.siteDesignId) {
                    postBody.optionalParams.CreationOptions.results.push("implicit_formula_292aa8a00786498a87a5ca52d9f4214a_" + p.siteDesignId);
                }
                return [2 /*return*/, Object(_operations_js__WEBPACK_IMPORTED_MODULE_7__["spPost"])(Site(Object(_utils_extractweburl_js__WEBPACK_IMPORTED_MODULE_12__["extractWebUrl"])(this.toUrl()), "/_api/GroupSiteManager/CreateGroupEx"), Object(_pnp_odata__WEBPACK_IMPORTED_MODULE_5__["body"])(postBody))];
            });
        });
    };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_10__["tag"])("si.getChanges")
    ], _Site.prototype, "getChanges", null);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_10__["tag"])("si.openWebById")
    ], _Site.prototype, "openWebById", null);
    _Site = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_decorators_js__WEBPACK_IMPORTED_MODULE_2__["defaultPath"])("_api/site")
    ], _Site);
    return _Site;
}(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["_SharePointQueryableInstance"]));

var Site = Object(_sharepointqueryable_js__WEBPACK_IMPORTED_MODULE_1__["spInvokableFactory"])(_Site);
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "kQcT":
/*!*******************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/calendars.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
// import { Attachments } from "./attachments";
var Calendars = /** @class */ (function (_super) {
    __extends(Calendars, _super);
    function Calendars(baseUrl, path) {
        if (path === void 0) { path = "calendars"; }
        return _super.call(this, baseUrl, path) || this;
    }
    return Calendars;
}(graphqueryable_1.GraphQueryableCollection));
exports.Calendars = Calendars;
var Calendar = /** @class */ (function (_super) {
    __extends(Calendar, _super);
    function Calendar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Calendar.prototype, "events", {
        get: function () {
            return new Events(this);
        },
        enumerable: true,
        configurable: true
    });
    return Calendar;
}(graphqueryable_1.GraphQueryableInstance));
exports.Calendar = Calendar;
var Events = /** @class */ (function (_super) {
    __extends(Events, _super);
    function Events(baseUrl, path) {
        if (path === void 0) { path = "events"; }
        return _super.call(this, baseUrl, path) || this;
    }
    Events.prototype.getById = function (id) {
        return new Event(this, id);
    };
    /**
     * Adds a new event to the collection
     *
     * @param properties The set of properties used to create the event
     */
    Events.prototype.add = function (properties) {
        var _this = this;
        return this.postCore({
            body: JSON.stringify(properties),
        }).then(function (r) {
            return {
                data: r,
                event: _this.getById(r.id),
            };
        });
    };
    return Events;
}(graphqueryable_1.GraphQueryableCollection));
exports.Events = Events;
var Event = /** @class */ (function (_super) {
    __extends(Event, _super);
    function Event() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO:: when supported
    // /**
    //  * Gets the collection of attachments for this event
    //  */
    // public get attachments(): Attachments {
    //     return new Attachments(this);
    // }
    /**
     * Update the properties of an event object
     *
     * @param properties Set of properties of this event to update
     */
    Event.prototype.update = function (properties) {
        return this.patchCore({
            body: JSON.stringify(properties),
        });
    };
    /**
     * Deletes this event
     */
    Event.prototype.delete = function () {
        return this.deleteCore();
    };
    return Event;
}(graphqueryable_1.GraphQueryableInstance));
exports.Event = Event;


/***/ }),

/***/ "l0hS":
/*!************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/siteusers.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var sitegroups_1 = __webpack_require__(/*! ./sitegroups */ "pwpL");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Describes a collection of all site collection users
 *
 */
var SiteUsers = /** @class */ (function (_super) {
    __extends(SiteUsers, _super);
    /**
     * Creates a new instance of the SiteUsers class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this user collection
     */
    function SiteUsers(baseUrl, path) {
        if (path === void 0) { path = "siteusers"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a user from the collection by email
     *
     * @param email The email address of the user to retrieve
     */
    SiteUsers.prototype.getByEmail = function (email) {
        return new SiteUser(this, "getByEmail('" + email + "')");
    };
    /**
     * Gets a user from the collection by id
     *
     * @param id The id of the user to retrieve
     */
    SiteUsers.prototype.getById = function (id) {
        return new SiteUser(this, "getById(" + id + ")");
    };
    /**
     * Gets a user from the collection by login name
     *
     * @param loginName The login name of the user to retrieve
     */
    SiteUsers.prototype.getByLoginName = function (loginName) {
        var su = new SiteUser(this);
        su.concat("('!@v::" + encodeURIComponent(loginName) + "')");
        return su;
    };
    /**
     * Removes a user from the collection by id
     *
     * @param id The id of the user to remove
     */
    SiteUsers.prototype.removeById = function (id) {
        return this.clone(SiteUsers, "removeById(" + id + ")").postCore();
    };
    /**
     * Removes a user from the collection by login name
     *
     * @param loginName The login name of the user to remove
     */
    SiteUsers.prototype.removeByLoginName = function (loginName) {
        var o = this.clone(SiteUsers, "removeByLoginName(@v)");
        o.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return o.postCore();
    };
    /**
     * Adds a user to a group
     *
     * @param loginName The login name of the user to add to the group
     *
     */
    SiteUsers.prototype.add = function (loginName) {
        var _this = this;
        return this.clone(SiteUsers, null).postCore({
            body: JSON.stringify({ "__metadata": { "type": "SP.User" }, LoginName: loginName }),
        }).then(function () { return _this.getByLoginName(loginName); });
    };
    return SiteUsers;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.SiteUsers = SiteUsers;
/**
 * Describes a single user
 *
 */
var SiteUser = /** @class */ (function (_super) {
    __extends(SiteUser, _super);
    function SiteUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SiteUser.prototype, "groups", {
        /**
         * Gets the groups for this user
         *
         */
        get: function () {
            return new sitegroups_1.SiteGroups(this, "groups");
        },
        enumerable: true,
        configurable: true
    });
    /**
    * Updates this user instance with the supplied properties
    *
    * @param properties A plain object of property names and values to update for the user
    */
    SiteUser.prototype.update = function (properties) {
        var _this = this;
        var postBody = util_1.Util.extend({ "__metadata": { "type": "SP.User" } }, properties);
        return this.postCore({
            body: JSON.stringify(postBody),
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            return {
                data: data,
                user: _this,
            };
        });
    };
    /**
     * Delete this user
     *
     */
    SiteUser.prototype.delete = function () {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    return SiteUser;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.SiteUser = SiteUser;
/**
 * Represents the current user
 */
var CurrentUser = /** @class */ (function (_super) {
    __extends(CurrentUser, _super);
    function CurrentUser(baseUrl, path) {
        if (path === void 0) { path = "currentuser"; }
        return _super.call(this, baseUrl, path) || this;
    }
    return CurrentUser;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.CurrentUser = CurrentUser;


/***/ }),

/***/ "l3Du":
/*!*****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/exports/odata.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ../odata/core */ "ntgF"));
__export(__webpack_require__(/*! ../odata/parsers */ "eGqj"));
__export(__webpack_require__(/*! ../odata/caching */ "7+BY"));
__export(__webpack_require__(/*! ../odata/queryable */ "fuNo"));


/***/ }),

/***/ "lYrR":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/items/index.js ***!
  \*********************************************/
/*! exports provided: Item, Items, ItemVersion, ItemVersions, PagedItemCollection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.js */ "NTTg");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "3DT9");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Item", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["Item"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Items", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["Items"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ItemVersion", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["ItemVersion"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ItemVersions", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["ItemVersions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PagedItemCollection", function() { return _types_js__WEBPACK_IMPORTED_MODULE_1__["PagedItemCollection"]; });



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "lzYu":
/*!******************************************************************!*\
  !*** ./node_modules/@pnp/common/node_modules/tslib/tslib.es6.js ***!
  \******************************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArray", function() { return __spreadArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || from);
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}


/***/ }),

/***/ "ntgF":
/*!**************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/odata/core.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
var logging_1 = __webpack_require__(/*! ../utils/logging */ "2C3z");
var ODataParserBase = /** @class */ (function () {
    function ODataParserBase() {
    }
    ODataParserBase.prototype.parse = function (r) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.handleError(r, reject)) {
                _this.parseImpl(r, resolve, reject);
            }
        });
    };
    ODataParserBase.prototype.parseImpl = function (r, resolve, reject) {
        var _this = this;
        if ((r.headers.has("Content-Length") && parseFloat(r.headers.get("Content-Length")) === 0) || r.status === 204) {
            resolve({});
        }
        else {
            // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
            r.text()
                .then(function (txt) { return txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {}; })
                .then(function (json) { return resolve(_this.parseODataJSON(json)); })
                .catch(function (e) { return reject(e); });
        }
    };
    ODataParserBase.prototype.handleError = function (r, reject) {
        if (!r.ok) {
            r.json().then(function (json) {
                // include the headers as they contain diagnostic information
                var data = {
                    responseBody: json,
                    responseHeaders: r.headers,
                };
                reject(new exceptions_1.ProcessHttpClientResponseException(r.status, r.statusText, data));
            }).catch(function (e) {
                // we failed to read the body - possibly it is empty. Let's report the original status that caused
                // the request to fail and log the error with parsing the body if anyone needs it for debugging
                logging_1.Logger.log({
                    data: e,
                    level: logging_1.LogLevel.Warning,
                    message: "There was an error parsing the error response body. See data for details.",
                });
                // include the headers as they contain diagnostic information
                var data = {
                    responseBody: "[[body not available]]",
                    responseHeaders: r.headers,
                };
                reject(new exceptions_1.ProcessHttpClientResponseException(r.status, r.statusText, data));
            });
        }
        return r.ok;
    };
    ODataParserBase.prototype.parseODataJSON = function (json) {
        var result = json;
        if (json.hasOwnProperty("d")) {
            if (json.d.hasOwnProperty("results")) {
                result = json.d.results;
            }
            else {
                result = json.d;
            }
        }
        else if (json.hasOwnProperty("value")) {
            result = json.value;
        }
        return result;
    };
    return ODataParserBase;
}());
exports.ODataParserBase = ODataParserBase;


/***/ }),

/***/ "p6a+":
/*!****************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/subscriptions.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
/**
 * Describes a collection of webhook subscriptions
 *
 */
var Subscriptions = /** @class */ (function (_super) {
    __extends(Subscriptions, _super);
    /**
     * Creates a new instance of the Subscriptions class
     *
     * @param baseUrl - The url or SharePointQueryable which forms the parent of this webhook subscriptions collection
     */
    function Subscriptions(baseUrl, path) {
        if (path === void 0) { path = "subscriptions"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Returns all the webhook subscriptions or the specified webhook subscription
     *
     * @param subscriptionId The id of a specific webhook subscription to retrieve, omit to retrieve all the webhook subscriptions
     */
    Subscriptions.prototype.getById = function (subscriptionId) {
        var subscription = new Subscription(this);
        subscription.concat("('" + subscriptionId + "')");
        return subscription;
    };
    /**
     * Creates a new webhook subscription
     *
     * @param notificationUrl The url to receive the notifications
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months)
     * @param clientState A client specific string (defaults to pnp-js-core-subscription when omitted)
     */
    Subscriptions.prototype.add = function (notificationUrl, expirationDate, clientState) {
        var _this = this;
        var postBody = JSON.stringify({
            "clientState": clientState || "pnp-js-core-subscription",
            "expirationDateTime": expirationDate,
            "notificationUrl": notificationUrl,
            "resource": this.toUrl(),
        });
        return this.postCore({ body: postBody, headers: { "Content-Type": "application/json" } }).then(function (result) {
            return { data: result, subscription: _this.getById(result.id) };
        });
    };
    return Subscriptions;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Subscriptions = Subscriptions;
/**
 * Describes a single webhook subscription instance
 *
 */
var Subscription = /** @class */ (function (_super) {
    __extends(Subscription, _super);
    function Subscription() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Renews this webhook subscription
     *
     * @param expirationDate The date and time to expire the subscription in the form YYYY-MM-ddTHH:mm:ss+00:00 (maximum of 6 months)
     */
    Subscription.prototype.update = function (expirationDate) {
        var _this = this;
        var postBody = JSON.stringify({
            "expirationDateTime": expirationDate,
        });
        return this.patchCore({ body: postBody, headers: { "Content-Type": "application/json" } }).then(function (data) {
            return { data: data, subscription: _this };
        });
    };
    /**
     * Removes this webhook subscription
     *
     */
    Subscription.prototype.delete = function () {
        return _super.prototype.deleteCore.call(this);
    };
    return Subscription;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.Subscription = Subscription;


/***/ }),

/***/ "pG6f":
/*!*****************************************************!*\
  !*** ./node_modules/@pnp/odata/invokable-binder.js ***!
  \*****************************************************/
/*! exports provided: invokableFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invokableFactory", function() { return invokableFactory; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "t3D1");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _invokable_extensions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./invokable-extensions.js */ "01TU");



var invokableBinder = function (invoker) { return function (constructor) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var factory = function (as) {
            var r = Object.assign(function () {
                var ags = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    ags[_i] = arguments[_i];
                }
                return invoker.call.apply(invoker, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([r], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(ags), false));
            }, new (constructor.bind.apply(constructor, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spreadArray"])([void 0], Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(as), false)))());
            Reflect.setPrototypeOf(r, constructor.prototype);
            return r;
        };
        // ie11 setting is always global
        if (_pnp_common__WEBPACK_IMPORTED_MODULE_1__["DefaultRuntime"].get("ie11") || false) {
            return factory(args);
        }
        else {
            return new Proxy(Object(_invokable_extensions_js__WEBPACK_IMPORTED_MODULE_2__["applyFactoryExtensions"])(factory, args), {
                apply: function (target, _thisArg, argArray) {
                    return Object(_invokable_extensions_js__WEBPACK_IMPORTED_MODULE_2__["extensionOrDefault"])("apply", function () {
                        var a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            a[_i] = arguments[_i];
                        }
                        return Reflect.apply(a[0], a[1], a[2]);
                    }, target, _thisArg, argArray);
                },
                get: function (target, p, receiver) {
                    return Object(_invokable_extensions_js__WEBPACK_IMPORTED_MODULE_2__["extensionOrDefault"])("get", function () {
                        var a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            a[_i] = arguments[_i];
                        }
                        return Reflect.get(a[0], a[1], a[2]);
                    }, target, p, receiver);
                },
                has: function (target, p) {
                    return Object(_invokable_extensions_js__WEBPACK_IMPORTED_MODULE_2__["extensionOrDefault"])("has", function () {
                        var a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            a[_i] = arguments[_i];
                        }
                        return Reflect.has(a[0], a[1]);
                    }, target, p);
                },
                set: function (target, p, value, receiver) {
                    return Object(_invokable_extensions_js__WEBPACK_IMPORTED_MODULE_2__["extensionOrDefault"])("set", function () {
                        var a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            a[_i] = arguments[_i];
                        }
                        return Reflect.set(a[0], a[1], a[2], a[3]);
                    }, target, p, value, receiver);
                },
            });
        }
    };
}; };
var invokableFactory = invokableBinder(function (options) {
    return this.defaultAction(options);
});
//# sourceMappingURL=invokable-binder.js.map

/***/ }),

/***/ "ppNx":
/*!***************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/utils/files.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Reads a blob as text
 *
 * @param blob The data to read
 */
function readBlobAsText(blob) {
    return readBlobAs(blob, "string");
}
exports.readBlobAsText = readBlobAsText;
/**
 * Reads a blob into an array buffer
 *
 * @param blob The data to read
 */
function readBlobAsArrayBuffer(blob) {
    return readBlobAs(blob, "buffer");
}
exports.readBlobAsArrayBuffer = readBlobAsArrayBuffer;
/**
 * Generic method to read blob's content
 *
 * @param blob The data to read
 * @param mode The read mode
 */
function readBlobAs(blob, mode) {
    return new Promise(function (resolve, reject) {
        try {
            var reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target.result);
            };
            switch (mode) {
                case "string":
                    reader.readAsText(blob);
                    break;
                case "buffer":
                    reader.readAsArrayBuffer(blob);
                    break;
            }
        }
        catch (e) {
            reject(e);
        }
    });
}


/***/ }),

/***/ "pwpL":
/*!*************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/sitegroups.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var siteusers_1 = __webpack_require__(/*! ./siteusers */ "l0hS");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Principal Type enum
 *
 */
var PrincipalType;
(function (PrincipalType) {
    PrincipalType[PrincipalType["None"] = 0] = "None";
    PrincipalType[PrincipalType["User"] = 1] = "User";
    PrincipalType[PrincipalType["DistributionList"] = 2] = "DistributionList";
    PrincipalType[PrincipalType["SecurityGroup"] = 4] = "SecurityGroup";
    PrincipalType[PrincipalType["SharePointGroup"] = 8] = "SharePointGroup";
    PrincipalType[PrincipalType["All"] = 15] = "All";
})(PrincipalType = exports.PrincipalType || (exports.PrincipalType = {}));
/**
 * Describes a collection of site groups
 *
 */
var SiteGroups = /** @class */ (function (_super) {
    __extends(SiteGroups, _super);
    /**
     * Creates a new instance of the SiteGroups class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this group collection
     */
    function SiteGroups(baseUrl, path) {
        if (path === void 0) { path = "sitegroups"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Adds a new group to the site collection
     *
     * @param props The group properties object of property names and values to be set for the group
     */
    SiteGroups.prototype.add = function (properties) {
        var _this = this;
        var postBody = JSON.stringify(util_1.Util.extend({ "__metadata": { "type": "SP.Group" } }, properties));
        return this.postCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                group: _this.getById(data.Id),
            };
        });
    };
    /**
     * Gets a group from the collection by name
     *
     * @param groupName The name of the group to retrieve
     */
    SiteGroups.prototype.getByName = function (groupName) {
        return new SiteGroup(this, "getByName('" + groupName + "')");
    };
    /**
     * Gets a group from the collection by id
     *
     * @param id The id of the group to retrieve
     */
    SiteGroups.prototype.getById = function (id) {
        var sg = new SiteGroup(this);
        sg.concat("(" + id + ")");
        return sg;
    };
    /**
     * Removes the group with the specified member id from the collection
     *
     * @param id The id of the group to remove
     */
    SiteGroups.prototype.removeById = function (id) {
        return this.clone(SiteGroups, "removeById('" + id + "')").postCore();
    };
    /**
     * Removes the cross-site group with the specified name from the collection
     *
     * @param loginName The name of the group to remove
     */
    SiteGroups.prototype.removeByLoginName = function (loginName) {
        return this.clone(SiteGroups, "removeByLoginName('" + loginName + "')").postCore();
    };
    return SiteGroups;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.SiteGroups = SiteGroups;
/**
 * Describes a single group
 *
 */
var SiteGroup = /** @class */ (function (_super) {
    __extends(SiteGroup, _super);
    function SiteGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SiteGroup.prototype, "users", {
        /**
         * Gets the users for this group
         *
         */
        get: function () {
            return new siteusers_1.SiteUsers(this, "users");
        },
        enumerable: true,
        configurable: true
    });
    /**
    * Updates this group instance with the supplied properties
    *
    * @param properties A GroupWriteableProperties object of property names and values to update for the group
    */
    /* tslint:disable no-string-literal */
    SiteGroup.prototype.update = function (properties) {
        var _this = this;
        var postBody = util_1.Util.extend({ "__metadata": { "type": "SP.Group" } }, properties);
        return this.postCore({
            body: JSON.stringify(postBody),
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            var retGroup = _this;
            if (properties.hasOwnProperty("Title")) {
                retGroup = _this.getParent(SiteGroup, _this.parentUrl, "getByName('" + properties["Title"] + "')");
            }
            return {
                data: data,
                group: retGroup,
            };
        });
    };
    return SiteGroup;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.SiteGroup = SiteGroup;


/***/ }),

/***/ "q1Lp":
/*!***********************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/escapeQueryStrValue.js ***!
  \***********************************************************/
/*! exports provided: escapeQueryStrValue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escapeQueryStrValue", function() { return escapeQueryStrValue; });
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/common */ "zqEK");
/* harmony import */ var _pnp_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/logging */ "B3L+");


function escapeQueryStrValue(value) {
    if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_0__["stringIsNullOrEmpty"])(value)) {
        return "";
    }
    // replace all instance of ' with ''
    if (/!(@.*?)::(.*?)/ig.test(value)) {
        // to ensure our param aliasing still works we need to treat these special or we'll hear about it
        // so we encode JUST the part that will end up in the url
        return value.replace(/!(@.*?)::(.*)$/ig, function (match, labelName, v) {
            _pnp_logging__WEBPACK_IMPORTED_MODULE_1__["Logger"].write("Rewriting aliased parameter from match " + match + " to label: " + labelName + " value: " + v, 0 /* Verbose */);
            return "!" + labelName + "::" + encodeURIComponent(v.replace(/'/ig, "''"));
        });
    }
    else {
        return encodeURIComponent(value.replace(/'/ig, "''"));
    }
}
//# sourceMappingURL=escapeQueryStrValue.js.map

/***/ }),

/***/ "q1dm":
/*!**********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/folders.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var sharepointqueryableshareable_1 = __webpack_require__(/*! ./sharepointqueryableshareable */ "gZxA");
var files_1 = __webpack_require__(/*! ./files */ "MMX7");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
var items_1 = __webpack_require__(/*! ./items */ "/pGJ");
/**
 * Describes a collection of Folder objects
 *
 */
var Folders = /** @class */ (function (_super) {
    __extends(Folders, _super);
    /**
     * Creates a new instance of the Folders class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    function Folders(baseUrl, path) {
        if (path === void 0) { path = "folders"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets a folder by folder name
     *
     */
    Folders.prototype.getByName = function (name) {
        var f = new Folder(this);
        f.concat("('" + name + "')");
        return f;
    };
    /**
     * Adds a new folder to the current folder (relative) or any folder (absolute)
     *
     * @param url The relative or absolute url where the new folder will be created. Urls starting with a forward slash are absolute.
     * @returns The new Folder and the raw response.
     */
    Folders.prototype.add = function (url) {
        var _this = this;
        return this.clone(Folders, "add('" + url + "')").postCore().then(function (response) {
            return {
                data: response,
                folder: _this.getByName(url),
            };
        });
    };
    return Folders;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.Folders = Folders;
/**
 * Describes a single Folder instance
 *
 */
var Folder = /** @class */ (function (_super) {
    __extends(Folder, _super);
    function Folder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Folder.prototype, "contentTypeOrder", {
        /**
         * Specifies the sequence in which content types are displayed.
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "contentTypeOrder");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Folder.prototype, "files", {
        /**
         * Gets this folder's files
         *
         */
        get: function () {
            return new files_1.Files(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Folder.prototype, "folders", {
        /**
         * Gets this folder's sub folders
         *
         */
        get: function () {
            return new Folders(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Folder.prototype, "listItemAllFields", {
        /**
         * Gets this folder's list item field values
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "listItemAllFields");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Folder.prototype, "parentFolder", {
        /**
         * Gets the parent folder, if available
         *
         */
        get: function () {
            return new Folder(this, "parentFolder");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Folder.prototype, "properties", {
        /**
         * Gets this folder's properties
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableInstance(this, "properties");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Folder.prototype, "serverRelativeUrl", {
        /**
         * Gets this folder's server relative url
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryable(this, "serverRelativeUrl");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Folder.prototype, "uniqueContentTypeOrder", {
        /**
         * Gets a value that specifies the content type order.
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "uniqueContentTypeOrder");
        },
        enumerable: true,
        configurable: true
    });
    Folder.prototype.update = function (properties) {
        var _this = this;
        var postBody = JSON.stringify(util_1.Util.extend({
            "__metadata": { "type": "SP.Folder" },
        }, properties));
        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            return {
                data: data,
                folder: _this,
            };
        });
    };
    /**
    * Delete this folder
    *
    * @param eTag Value used in the IF-Match header, by default "*"
    */
    Folder.prototype.delete = function (eTag) {
        if (eTag === void 0) { eTag = "*"; }
        return this.clone(Folder, null).postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    /**
     * Moves the folder to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    Folder.prototype.recycle = function () {
        return this.clone(Folder, "recycle").postCore();
    };
    /**
     * Gets the associated list item for this folder, loading the default properties
     */
    Folder.prototype.getItem = function () {
        var selects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selects[_i] = arguments[_i];
        }
        var q = this.listItemAllFields;
        return q.select.apply(q, selects).get().then(function (d) {
            return util_1.Util.extend(new items_1.Item(odata_1.spGetEntityUrl(d)), d);
        });
    };
    return Folder;
}(sharepointqueryableshareable_1.SharePointQueryableShareableFolder));
exports.Folder = Folder;


/***/ }),

/***/ "q1wT":
/*!*****************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/utils/storage.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ./util */ "bk0Y");
var collections_1 = __webpack_require__(/*! ../collections/collections */ "hd/X");
var pnplibconfig_1 = __webpack_require__(/*! ../configuration/pnplibconfig */ "Mvka");
var logging_1 = __webpack_require__(/*! ./logging */ "2C3z");
/**
 * A wrapper class to provide a consistent interface to browser based storage
 *
 */
var PnPClientStorageWrapper = /** @class */ (function () {
    /**
     * Creates a new instance of the PnPClientStorageWrapper class
     *
     * @constructor
     */
    function PnPClientStorageWrapper(store, defaultTimeoutMinutes) {
        this.store = store;
        this.defaultTimeoutMinutes = defaultTimeoutMinutes;
        this.defaultTimeoutMinutes = (defaultTimeoutMinutes === void 0) ? -1 : defaultTimeoutMinutes;
        this.enabled = this.test();
        // if the cache timeout is enabled call the handler
        // this will clear any expired items and set the timeout function
        if (pnplibconfig_1.RuntimeConfig.enableCacheExpiration) {
            logging_1.Logger.write("Enabling cache expiration.", logging_1.LogLevel.Info);
            this.cacheExpirationHandler();
        }
    }
    /**
     * Get a value from storage, or null if that value does not exist
     *
     * @param key The key whose value we want to retrieve
     */
    PnPClientStorageWrapper.prototype.get = function (key) {
        if (!this.enabled) {
            return null;
        }
        var o = this.store.getItem(key);
        if (o == null) {
            return null;
        }
        var persistable = JSON.parse(o);
        if (new Date(persistable.expiration) <= new Date()) {
            logging_1.Logger.write("Removing item with key '" + key + "' from cache due to expiration.", logging_1.LogLevel.Info);
            this.delete(key);
            return null;
        }
        else {
            return persistable.value;
        }
    };
    /**
     * Adds a value to the underlying storage
     *
     * @param key The key to use when storing the provided value
     * @param o The value to store
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    PnPClientStorageWrapper.prototype.put = function (key, o, expire) {
        if (this.enabled) {
            this.store.setItem(key, this.createPersistable(o, expire));
        }
    };
    /**
     * Deletes a value from the underlying storage
     *
     * @param key The key of the pair we want to remove from storage
     */
    PnPClientStorageWrapper.prototype.delete = function (key) {
        if (this.enabled) {
            this.store.removeItem(key);
        }
    };
    /**
     * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
     *
     * @param key The key to use when storing the provided value
     * @param getter A function which will upon execution provide the desired value
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    PnPClientStorageWrapper.prototype.getOrPut = function (key, getter, expire) {
        var _this = this;
        if (!this.enabled) {
            return getter();
        }
        return new Promise(function (resolve) {
            var o = _this.get(key);
            if (o == null) {
                getter().then(function (d) {
                    _this.put(key, d, expire);
                    resolve(d);
                });
            }
            else {
                resolve(o);
            }
        });
    };
    /**
     * Deletes any expired items placed in the store by the pnp library, leaves other items untouched
     */
    PnPClientStorageWrapper.prototype.deleteExpired = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.enabled) {
                resolve();
            }
            try {
                for (var i = 0; i < _this.store.length; i++) {
                    var key = _this.store.key(i);
                    // test the stored item to see if we stored it
                    if (/["|']?pnp["|']? ?: ?1/i.test(_this.store.getItem(key))) {
                        // get those items as get will delete from cache if they are expired
                        _this.get(key);
                    }
                }
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * Used to determine if the wrapped storage is available currently
     */
    PnPClientStorageWrapper.prototype.test = function () {
        var str = "test";
        try {
            this.store.setItem(str, str);
            this.store.removeItem(str);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * Creates the persistable to store
     */
    PnPClientStorageWrapper.prototype.createPersistable = function (o, expire) {
        if (typeof expire === "undefined") {
            // ensure we are by default inline with the global library setting
            var defaultTimeout = pnplibconfig_1.RuntimeConfig.defaultCachingTimeoutSeconds;
            if (this.defaultTimeoutMinutes > 0) {
                defaultTimeout = this.defaultTimeoutMinutes * 60;
            }
            expire = util_1.Util.dateAdd(new Date(), "second", defaultTimeout);
        }
        return JSON.stringify({ pnp: 1, expiration: expire, value: o });
    };
    /**
     * Deletes expired items added by this library in this.store and sets a timeout to call itself
     */
    PnPClientStorageWrapper.prototype.cacheExpirationHandler = function () {
        var _this = this;
        logging_1.Logger.write("Called cache expiration handler.", logging_1.LogLevel.Verbose);
        this.deleteExpired().then(function (_) {
            // call ourself in the future
            setTimeout(util_1.Util.getCtxCallback(_this, _this.cacheExpirationHandler), pnplibconfig_1.RuntimeConfig.cacheExpirationIntervalMilliseconds);
        }).catch(function (e) {
            // we've got some error - so just stop the loop and report the error
            logging_1.Logger.log({
                data: e,
                level: logging_1.LogLevel.Error,
                message: "Error deleting expired cache entries, see data for details. Timeout not reset.",
            });
        });
    };
    return PnPClientStorageWrapper;
}());
exports.PnPClientStorageWrapper = PnPClientStorageWrapper;
/**
 * A thin implementation of in-memory storage for use in nodejs
 */
var MemoryStorage = /** @class */ (function () {
    function MemoryStorage(_store) {
        if (_store === void 0) { _store = new collections_1.Dictionary(); }
        this._store = _store;
    }
    Object.defineProperty(MemoryStorage.prototype, "length", {
        get: function () {
            return this._store.count();
        },
        enumerable: true,
        configurable: true
    });
    MemoryStorage.prototype.clear = function () {
        this._store.clear();
    };
    MemoryStorage.prototype.getItem = function (key) {
        return this._store.get(key);
    };
    MemoryStorage.prototype.key = function (index) {
        return this._store.getKeys()[index];
    };
    MemoryStorage.prototype.removeItem = function (key) {
        this._store.remove(key);
    };
    MemoryStorage.prototype.setItem = function (key, data) {
        this._store.add(key, data);
    };
    return MemoryStorage;
}());
/**
 * A class that will establish wrappers for both local and session storage
 */
var PnPClientStorage = /** @class */ (function () {
    /**
     * Creates a new instance of the PnPClientStorage class
     *
     * @constructor
     */
    function PnPClientStorage(_local, _session) {
        if (_local === void 0) { _local = null; }
        if (_session === void 0) { _session = null; }
        this._local = _local;
        this._session = _session;
    }
    Object.defineProperty(PnPClientStorage.prototype, "local", {
        /**
         * Provides access to the local storage of the browser
         */
        get: function () {
            if (this._local === null) {
                this._local = typeof localStorage !== "undefined" ? new PnPClientStorageWrapper(localStorage) : new PnPClientStorageWrapper(new MemoryStorage());
            }
            return this._local;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PnPClientStorage.prototype, "session", {
        /**
         * Provides access to the session storage of the browser
         */
        get: function () {
            if (this._session === null) {
                this._session = typeof sessionStorage !== "undefined" ? new PnPClientStorageWrapper(sessionStorage) : new PnPClientStorageWrapper(new MemoryStorage());
            }
            return this._session;
        },
        enumerable: true,
        configurable: true
    });
    return PnPClientStorage;
}());
exports.PnPClientStorage = PnPClientStorage;


/***/ }),

/***/ "r/M4":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/odata.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var logging_1 = __webpack_require__(/*! ../utils/logging */ "2C3z");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "tv1o");
var core_1 = __webpack_require__(/*! ../odata/core */ "ntgF");
function spExtractODataId(candidate) {
    if (candidate.hasOwnProperty("odata.id")) {
        return candidate["odata.id"];
    }
    else if (candidate.hasOwnProperty("__metadata") && candidate.__metadata.hasOwnProperty("id")) {
        return candidate.__metadata.id;
    }
    else {
        throw new exceptions_1.ODataIdException(candidate);
    }
}
exports.spExtractODataId = spExtractODataId;
var SPODataEntityParserImpl = /** @class */ (function (_super) {
    __extends(SPODataEntityParserImpl, _super);
    function SPODataEntityParserImpl(factory) {
        var _this = _super.call(this) || this;
        _this.factory = factory;
        _this.hydrate = function (d) {
            var o = new _this.factory(spGetEntityUrl(d), null);
            return util_1.Util.extend(o, d);
        };
        return _this;
    }
    SPODataEntityParserImpl.prototype.parse = function (r) {
        var _this = this;
        return _super.prototype.parse.call(this, r).then(function (d) {
            var o = new _this.factory(spGetEntityUrl(d), null);
            return util_1.Util.extend(o, d);
        });
    };
    return SPODataEntityParserImpl;
}(core_1.ODataParserBase));
var SPODataEntityArrayParserImpl = /** @class */ (function (_super) {
    __extends(SPODataEntityArrayParserImpl, _super);
    function SPODataEntityArrayParserImpl(factory) {
        var _this = _super.call(this) || this;
        _this.factory = factory;
        _this.hydrate = function (d) {
            return d.map(function (v) {
                var o = new _this.factory(spGetEntityUrl(v), null);
                return util_1.Util.extend(o, v);
            });
        };
        return _this;
    }
    SPODataEntityArrayParserImpl.prototype.parse = function (r) {
        var _this = this;
        return _super.prototype.parse.call(this, r).then(function (d) {
            return d.map(function (v) {
                var o = new _this.factory(spGetEntityUrl(v), null);
                return util_1.Util.extend(o, v);
            });
        });
    };
    return SPODataEntityArrayParserImpl;
}(core_1.ODataParserBase));
function spGetEntityUrl(entity) {
    if (entity.hasOwnProperty("odata.metadata") && entity.hasOwnProperty("odata.editLink")) {
        // we are dealign with minimal metadata (default)
        return util_1.Util.combinePaths(util_1.extractWebUrl(entity["odata.metadata"]), "_api", entity["odata.editLink"]);
    }
    else if (entity.hasOwnProperty("__metadata")) {
        // we are dealing with verbose, which has an absolute uri
        return entity.__metadata.uri;
    }
    else {
        // we are likely dealing with nometadata, so don't error but we won't be able to
        // chain off these objects
        logging_1.Logger.write("No uri information found in ODataEntity parsing, chaining will fail for this object.", logging_1.LogLevel.Warning);
        return "";
    }
}
exports.spGetEntityUrl = spGetEntityUrl;
function spODataEntity(factory) {
    return new SPODataEntityParserImpl(factory);
}
exports.spODataEntity = spODataEntity;
function spODataEntityArray(factory) {
    return new SPODataEntityArrayParserImpl(factory);
}
exports.spODataEntityArray = spODataEntityArray;


/***/ }),

/***/ "rLF8":
/*!*******************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/regionalsettings.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Describes regional settings ODada object
 */
var RegionalSettings = /** @class */ (function (_super) {
    __extends(RegionalSettings, _super);
    /**
     * Creates a new instance of the RegionalSettings class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this regional settings collection
     */
    function RegionalSettings(baseUrl, path) {
        if (path === void 0) { path = "regionalsettings"; }
        return _super.call(this, baseUrl, path) || this;
    }
    Object.defineProperty(RegionalSettings.prototype, "installedLanguages", {
        /**
         * Gets the collection of languages used in a server farm.
         */
        get: function () {
            return new InstalledLanguages(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegionalSettings.prototype, "globalInstalledLanguages", {
        /**
         * Gets the collection of language packs that are installed on the server.
         */
        get: function () {
            return new InstalledLanguages(this, "globalinstalledlanguages");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegionalSettings.prototype, "timeZone", {
        /**
         * Gets time zone
         */
        get: function () {
            return new TimeZone(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegionalSettings.prototype, "timeZones", {
        /**
         * Gets time zones
         */
        get: function () {
            return new TimeZones(this);
        },
        enumerable: true,
        configurable: true
    });
    return RegionalSettings;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.RegionalSettings = RegionalSettings;
/**
 * Describes installed languages ODada queriable collection
 */
var InstalledLanguages = /** @class */ (function (_super) {
    __extends(InstalledLanguages, _super);
    function InstalledLanguages(baseUrl, path) {
        if (path === void 0) { path = "installedlanguages"; }
        return _super.call(this, baseUrl, path) || this;
    }
    return InstalledLanguages;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.InstalledLanguages = InstalledLanguages;
/**
 * Describes TimeZone ODada object
 */
var TimeZone = /** @class */ (function (_super) {
    __extends(TimeZone, _super);
    function TimeZone(baseUrl, path) {
        if (path === void 0) { path = "timezone"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets an Local Time by UTC Time
     *
     * @param utcTime UTC Time as Date or ISO String
     */
    TimeZone.prototype.utcToLocalTime = function (utcTime) {
        var dateIsoString;
        if (typeof utcTime === "string") {
            dateIsoString = utcTime;
        }
        else {
            dateIsoString = utcTime.toISOString();
        }
        return this.clone(TimeZone, "utctolocaltime('" + dateIsoString + "')")
            .postCore()
            .then(function (res) { return res.hasOwnProperty("UTCToLocalTime") ? res.UTCToLocalTime : res; });
    };
    /**
     * Gets an UTC Time by Local Time
     *
     * @param localTime Local Time as Date or ISO String
     */
    TimeZone.prototype.localTimeToUTC = function (localTime) {
        var dateIsoString;
        if (typeof localTime === "string") {
            dateIsoString = localTime;
        }
        else {
            dateIsoString = util_1.Util.dateAdd(localTime, "minute", localTime.getTimezoneOffset() * -1).toISOString();
        }
        return this.clone(TimeZone, "localtimetoutc('" + dateIsoString + "')")
            .postCore()
            .then(function (res) { return res.hasOwnProperty("LocalTimeToUTC") ? res.LocalTimeToUTC : res; });
    };
    return TimeZone;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.TimeZone = TimeZone;
/**
 * Describes time zones queriable collection
 */
var TimeZones = /** @class */ (function (_super) {
    __extends(TimeZones, _super);
    function TimeZones(baseUrl, path) {
        if (path === void 0) { path = "timezones"; }
        return _super.call(this, baseUrl, path) || this;
    }
    // https://msdn.microsoft.com/en-us/library/office/jj247008.aspx - timezones ids
    /**
     * Gets an TimeZone by id
     *
     * @param id The integer id of the timezone to retrieve
     */
    TimeZones.prototype.getById = function (id) {
        // do the post and merge the result into a TimeZone instance so the data and methods are available
        return this.clone(TimeZones, "GetById(" + id + ")").postAsCore({}, odata_1.spODataEntity(TimeZone));
    };
    return TimeZones;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.TimeZones = TimeZones;


/***/ }),

/***/ "rUwr":
/*!*********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/social.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Exposes social following methods
 */
var SocialQuery = /** @class */ (function (_super) {
    __extends(SocialQuery, _super);
    /**
     * Creates a new instance of the SocialQuery class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this social query
     */
    function SocialQuery(baseUrl, path) {
        if (path === void 0) { path = "_api/social.following"; }
        return _super.call(this, baseUrl, path) || this;
    }
    Object.defineProperty(SocialQuery.prototype, "my", {
        get: function () {
            return new MySocialQuery(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets a URI to a site that lists the current user's followed sites.
     */
    SocialQuery.prototype.getFollowedSitesUri = function () {
        return this.clone(SocialQuery, "FollowedSitesUri").get().then(function (r) {
            return r.FollowedSitesUri || r;
        });
    };
    /**
     * Gets a URI to a site that lists the current user's followed documents.
     */
    SocialQuery.prototype.getFollowedDocumentsUri = function () {
        return this.clone(SocialQuery, "FollowedDocumentsUri").get().then(function (r) {
            return r.FollowedDocumentsUri || r;
        });
    };
    /**
     * Makes the current user start following a user, document, site, or tag
     *
     * @param actorInfo The actor to start following
     */
    SocialQuery.prototype.follow = function (actorInfo) {
        return this.clone(SocialQuery, "follow").postCore({ body: this.createSocialActorInfoRequestBody(actorInfo) });
    };
    /**
     * Indicates whether the current user is following a specified user, document, site, or tag
     *
     * @param actorInfo The actor to find the following status for
     */
    SocialQuery.prototype.isFollowed = function (actorInfo) {
        return this.clone(SocialQuery, "isfollowed").postCore({ body: this.createSocialActorInfoRequestBody(actorInfo) });
    };
    /**
     * Makes the current user stop following a user, document, site, or tag
     *
     * @param actorInfo The actor to stop following
     */
    SocialQuery.prototype.stopFollowing = function (actorInfo) {
        return this.clone(SocialQuery, "stopfollowing").postCore({ body: this.createSocialActorInfoRequestBody(actorInfo) });
    };
    /**
     * Creates SocialActorInfo request body
     *
     * @param actorInfo The actor to create request body
     */
    SocialQuery.prototype.createSocialActorInfoRequestBody = function (actorInfo) {
        return JSON.stringify({
            "actor": util_1.Util.extend({
                Id: null,
                "__metadata": { "type": "SP.Social.SocialActorInfo" },
            }, actorInfo),
        });
    };
    return SocialQuery;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.SocialQuery = SocialQuery;
var MySocialQuery = /** @class */ (function (_super) {
    __extends(MySocialQuery, _super);
    /**
     * Creates a new instance of the SocialQuery class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this social query
     */
    function MySocialQuery(baseUrl, path) {
        if (path === void 0) { path = "my"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets users, documents, sites, and tags that the current user is following.
     *
     * @param types Bitwise set of SocialActorTypes to retrieve
     */
    MySocialQuery.prototype.followed = function (types) {
        return this.clone(MySocialQuery, "followed(types=" + types + ")").get().then(function (r) {
            return r.hasOwnProperty("Followed") ? r.Followed.results : r;
        });
    };
    /**
     * Gets the count of users, documents, sites, and tags that the current user is following.
     *
     * @param types Bitwise set of SocialActorTypes to retrieve
     */
    MySocialQuery.prototype.followedCount = function (types) {
        return this.clone(MySocialQuery, "followedcount(types=" + types + ")").get().then(function (r) {
            return r.FollowedCount || r;
        });
    };
    /**
     * Gets the users who are following the current user.
     */
    MySocialQuery.prototype.followers = function () {
        return this.clone(MySocialQuery, "followers").get().then(function (r) {
            return r.hasOwnProperty("Followers") ? r.Followers.results : r;
        });
    };
    /**
     * Gets users who the current user might want to follow.
     */
    MySocialQuery.prototype.suggestions = function () {
        return this.clone(MySocialQuery, "suggestions").get().then(function (r) {
            return r.hasOwnProperty("Suggestions") ? r.Suggestions.results : r;
        });
    };
    return MySocialQuery;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.MySocialQuery = MySocialQuery;


/***/ }),

/***/ "ruv1":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/@microsoft/loader-load-themed-styles/node_modules/@microsoft/load-themed-styles/lib/index.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitStyles = exports.detokenize = exports.clearStyles = exports.loadTheme = exports.flush = exports.configureRunMode = exports.configureLoadStyles = exports.loadStyles = void 0;
// Store the theming state in __themeState__ global scope for reuse in the case of duplicate
// load-themed-styles hosted on the page.
var _root = typeof window === 'undefined' ? global : window; // eslint-disable-line @typescript-eslint/no-explicit-any
// Nonce string to inject into script tag if one provided. This is used in CSP (Content Security Policy).
var _styleNonce = _root && _root.CSPSettings && _root.CSPSettings.nonce;
var _themeState = initializeThemeState();
/**
 * Matches theming tokens. For example, "[theme: themeSlotName, default: #FFF]" (including the quotes).
 */
var _themeTokenRegex = /[\'\"]\[theme:\s*(\w+)\s*(?:\,\s*default:\s*([\\"\']?[\.\,\(\)\#\-\s\w]*[\.\,\(\)\#\-\w][\"\']?))?\s*\][\'\"]/g;
var now = function () {
    return typeof performance !== 'undefined' && !!performance.now ? performance.now() : Date.now();
};
function measure(func) {
    var start = now();
    func();
    var end = now();
    _themeState.perf.duration += end - start;
}
/**
 * initialize global state object
 */
function initializeThemeState() {
    var state = _root.__themeState__ || {
        theme: undefined,
        lastStyleElement: undefined,
        registeredStyles: []
    };
    if (!state.runState) {
        state = __assign(__assign({}, state), { perf: {
                count: 0,
                duration: 0
            }, runState: {
                flushTimer: 0,
                mode: 0 /* sync */,
                buffer: []
            } });
    }
    if (!state.registeredThemableStyles) {
        state = __assign(__assign({}, state), { registeredThemableStyles: [] });
    }
    _root.__themeState__ = state;
    return state;
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load
 * event is fired.
 * @param {string | ThemableArray} styles Themable style text to register.
 * @param {boolean} loadAsync When true, always load styles in async mode, irrespective of current sync mode.
 */
function loadStyles(styles, loadAsync) {
    if (loadAsync === void 0) { loadAsync = false; }
    measure(function () {
        var styleParts = Array.isArray(styles) ? styles : splitStyles(styles);
        var _a = _themeState.runState, mode = _a.mode, buffer = _a.buffer, flushTimer = _a.flushTimer;
        if (loadAsync || mode === 1 /* async */) {
            buffer.push(styleParts);
            if (!flushTimer) {
                _themeState.runState.flushTimer = asyncLoadStyles();
            }
        }
        else {
            applyThemableStyles(styleParts);
        }
    });
}
exports.loadStyles = loadStyles;
/**
 * Allows for customizable loadStyles logic. e.g. for server side rendering application
 * @param {(processedStyles: string, rawStyles?: string | ThemableArray) => void}
 * a loadStyles callback that gets called when styles are loaded or reloaded
 */
function configureLoadStyles(loadStylesFn) {
    _themeState.loadStyles = loadStylesFn;
}
exports.configureLoadStyles = configureLoadStyles;
/**
 * Configure run mode of load-themable-styles
 * @param mode load-themable-styles run mode, async or sync
 */
function configureRunMode(mode) {
    _themeState.runState.mode = mode;
}
exports.configureRunMode = configureRunMode;
/**
 * external code can call flush to synchronously force processing of currently buffered styles
 */
function flush() {
    measure(function () {
        var styleArrays = _themeState.runState.buffer.slice();
        _themeState.runState.buffer = [];
        var mergedStyleArray = [].concat.apply([], styleArrays);
        if (mergedStyleArray.length > 0) {
            applyThemableStyles(mergedStyleArray);
        }
    });
}
exports.flush = flush;
/**
 * register async loadStyles
 */
function asyncLoadStyles() {
    return setTimeout(function () {
        _themeState.runState.flushTimer = 0;
        flush();
    }, 0);
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load event
 * is fired.
 * @param {string} styleText Style to register.
 * @param {IStyleRecord} styleRecord Existing style record to re-apply.
 */
function applyThemableStyles(stylesArray, styleRecord) {
    if (_themeState.loadStyles) {
        _themeState.loadStyles(resolveThemableArray(stylesArray).styleString, stylesArray);
    }
    else {
        registerStyles(stylesArray);
    }
}
/**
 * Registers a set theme tokens to find and replace. If styles were already registered, they will be
 * replaced.
 * @param {theme} theme JSON object of theme tokens to values.
 */
function loadTheme(theme) {
    _themeState.theme = theme;
    // reload styles.
    reloadStyles();
}
exports.loadTheme = loadTheme;
/**
 * Clear already registered style elements and style records in theme_State object
 * @param option - specify which group of registered styles should be cleared.
 * Default to be both themable and non-themable styles will be cleared
 */
function clearStyles(option) {
    if (option === void 0) { option = 3 /* all */; }
    if (option === 3 /* all */ || option === 2 /* onlyNonThemable */) {
        clearStylesInternal(_themeState.registeredStyles);
        _themeState.registeredStyles = [];
    }
    if (option === 3 /* all */ || option === 1 /* onlyThemable */) {
        clearStylesInternal(_themeState.registeredThemableStyles);
        _themeState.registeredThemableStyles = [];
    }
}
exports.clearStyles = clearStyles;
function clearStylesInternal(records) {
    records.forEach(function (styleRecord) {
        var styleElement = styleRecord && styleRecord.styleElement;
        if (styleElement && styleElement.parentElement) {
            styleElement.parentElement.removeChild(styleElement);
        }
    });
}
/**
 * Reloads styles.
 */
function reloadStyles() {
    if (_themeState.theme) {
        var themableStyles = [];
        for (var _i = 0, _a = _themeState.registeredThemableStyles; _i < _a.length; _i++) {
            var styleRecord = _a[_i];
            themableStyles.push(styleRecord.themableStyle);
        }
        if (themableStyles.length > 0) {
            clearStyles(1 /* onlyThemable */);
            applyThemableStyles([].concat.apply([], themableStyles));
        }
    }
}
/**
 * Find theme tokens and replaces them with provided theme values.
 * @param {string} styles Tokenized styles to fix.
 */
function detokenize(styles) {
    if (styles) {
        styles = resolveThemableArray(splitStyles(styles)).styleString;
    }
    return styles;
}
exports.detokenize = detokenize;
/**
 * Resolves ThemingInstruction objects in an array and joins the result into a string.
 * @param {ThemableArray} splitStyleArray ThemableArray to resolve and join.
 */
function resolveThemableArray(splitStyleArray) {
    var theme = _themeState.theme;
    var themable = false;
    // Resolve the array of theming instructions to an array of strings.
    // Then join the array to produce the final CSS string.
    var resolvedArray = (splitStyleArray || []).map(function (currentValue) {
        var themeSlot = currentValue.theme;
        if (themeSlot) {
            themable = true;
            // A theming annotation. Resolve it.
            var themedValue = theme ? theme[themeSlot] : undefined;
            var defaultValue = currentValue.defaultValue || 'inherit';
            // Warn to console if we hit an unthemed value even when themes are provided, but only if "DEBUG" is true.
            // Allow the themedValue to be undefined to explicitly request the default value.
            if (theme &&
                !themedValue &&
                console &&
                !(themeSlot in theme) &&
                "boolean" !== 'undefined' &&
                true) {
                console.warn("Theming value not provided for \"" + themeSlot + "\". Falling back to \"" + defaultValue + "\".");
            }
            return themedValue || defaultValue;
        }
        else {
            // A non-themable string. Preserve it.
            return currentValue.rawString;
        }
    });
    return {
        styleString: resolvedArray.join(''),
        themable: themable
    };
}
/**
 * Split tokenized CSS into an array of strings and theme specification objects
 * @param {string} styles Tokenized styles to split.
 */
function splitStyles(styles) {
    var result = [];
    if (styles) {
        var pos = 0; // Current position in styles.
        var tokenMatch = void 0;
        while ((tokenMatch = _themeTokenRegex.exec(styles))) {
            var matchIndex = tokenMatch.index;
            if (matchIndex > pos) {
                result.push({
                    rawString: styles.substring(pos, matchIndex)
                });
            }
            result.push({
                theme: tokenMatch[1],
                defaultValue: tokenMatch[2] // May be undefined
            });
            // index of the first character after the current match
            pos = _themeTokenRegex.lastIndex;
        }
        // Push the rest of the string after the last match.
        result.push({
            rawString: styles.substring(pos)
        });
    }
    return result;
}
exports.splitStyles = splitStyles;
/**
 * Registers a set of style text. If it is registered too early, we will register it when the
 * window.load event is fired.
 * @param {ThemableArray} styleArray Array of IThemingInstruction objects to register.
 * @param {IStyleRecord} styleRecord May specify a style Element to update.
 */
function registerStyles(styleArray) {
    if (typeof document === 'undefined') {
        return;
    }
    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    var _a = resolveThemableArray(styleArray), styleString = _a.styleString, themable = _a.themable;
    styleElement.setAttribute('data-load-themed-styles', 'true');
    if (_styleNonce) {
        styleElement.setAttribute('nonce', _styleNonce);
    }
    styleElement.appendChild(document.createTextNode(styleString));
    _themeState.perf.count++;
    head.appendChild(styleElement);
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('styleinsert', true /* bubbleEvent */, false /* cancelable */);
    ev.args = {
        newStyle: styleElement
    };
    document.dispatchEvent(ev);
    var record = {
        styleElement: styleElement,
        themableStyle: styleArray
    };
    if (themable) {
        _themeState.registeredThemableStyles.push(record);
    }
    else {
        _themeState.registeredStyles.push(record);
    }
}
//# sourceMappingURL=index.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../../webpack/buildin/global.js */ "yLpj")))

/***/ }),

/***/ "t3D1":
/*!*****************************************************************!*\
  !*** ./node_modules/@pnp/odata/node_modules/tslib/tslib.es6.js ***!
  \*****************************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArray", function() { return __spreadArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || from);
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}


/***/ }),

/***/ "t5HP":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/roles.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var sitegroups_1 = __webpack_require__(/*! ./sitegroups */ "pwpL");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Describes a set of role assignments for the current scope
 *
 */
var RoleAssignments = /** @class */ (function (_super) {
    __extends(RoleAssignments, _super);
    /**
     * Creates a new instance of the RoleAssignments class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this role assignments collection
     */
    function RoleAssignments(baseUrl, path) {
        if (path === void 0) { path = "roleassignments"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Adds a new role assignment with the specified principal and role definitions to the collection
     *
     * @param principalId The id of the user or group to assign permissions to
     * @param roleDefId The id of the role definition that defines the permissions to assign
     *
     */
    RoleAssignments.prototype.add = function (principalId, roleDefId) {
        return this.clone(RoleAssignments, "addroleassignment(principalid=" + principalId + ", roledefid=" + roleDefId + ")").postCore();
    };
    /**
     * Removes the role assignment with the specified principal and role definition from the collection
     *
     * @param principalId The id of the user or group in the role assignment
     * @param roleDefId The id of the role definition in the role assignment
     *
     */
    RoleAssignments.prototype.remove = function (principalId, roleDefId) {
        return this.clone(RoleAssignments, "removeroleassignment(principalid=" + principalId + ", roledefid=" + roleDefId + ")").postCore();
    };
    /**
     * Gets the role assignment associated with the specified principal id from the collection.
     *
     * @param id The id of the role assignment
     */
    RoleAssignments.prototype.getById = function (id) {
        var ra = new RoleAssignment(this);
        ra.concat("(" + id + ")");
        return ra;
    };
    return RoleAssignments;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.RoleAssignments = RoleAssignments;
/**
 * Describes a role assignment
 *
 */
var RoleAssignment = /** @class */ (function (_super) {
    __extends(RoleAssignment, _super);
    function RoleAssignment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(RoleAssignment.prototype, "groups", {
        /**
         * Gets the groups that directly belong to the access control list (ACL) for this securable object
         *
         */
        get: function () {
            return new sitegroups_1.SiteGroups(this, "groups");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleAssignment.prototype, "bindings", {
        /**
         * Gets the role definition bindings for this role assignment
         *
         */
        get: function () {
            return new RoleDefinitionBindings(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Deletes this role assignment
     *
     */
    RoleAssignment.prototype.delete = function () {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    return RoleAssignment;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.RoleAssignment = RoleAssignment;
/**
 * Describes a collection of role definitions
 *
 */
var RoleDefinitions = /** @class */ (function (_super) {
    __extends(RoleDefinitions, _super);
    /**
     * Creates a new instance of the RoleDefinitions class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this role definitions collection
     *
     */
    function RoleDefinitions(baseUrl, path) {
        if (path === void 0) { path = "roledefinitions"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Gets the role definition with the specified id from the collection
     *
     * @param id The id of the role definition
     *
     */
    RoleDefinitions.prototype.getById = function (id) {
        return new RoleDefinition(this, "getById(" + id + ")");
    };
    /**
     * Gets the role definition with the specified name
     *
     * @param name The name of the role definition
     *
     */
    RoleDefinitions.prototype.getByName = function (name) {
        return new RoleDefinition(this, "getbyname('" + name + "')");
    };
    /**
     * Gets the role definition with the specified role type
     *
     * @param roleTypeKind The roletypekind of the role definition (None=0, Guest=1, Reader=2, Contributor=3, WebDesigner=4, Administrator=5, Editor=6, System=7)
     *
     */
    RoleDefinitions.prototype.getByType = function (roleTypeKind) {
        return new RoleDefinition(this, "getbytype(" + roleTypeKind + ")");
    };
    /**
     * Creates a role definition
     *
     * @param name The new role definition's name
     * @param description The new role definition's description
     * @param order The order in which the role definition appears
     * @param basePermissions The permissions mask for this role definition
     *
     */
    RoleDefinitions.prototype.add = function (name, description, order, basePermissions) {
        var _this = this;
        var postBody = JSON.stringify({
            BasePermissions: util_1.Util.extend({ __metadata: { type: "SP.BasePermissions" } }, basePermissions),
            Description: description,
            Name: name,
            Order: order,
            __metadata: { "type": "SP.RoleDefinition" },
        });
        return this.postCore({ body: postBody }).then(function (data) {
            return {
                data: data,
                definition: _this.getById(data.Id),
            };
        });
    };
    return RoleDefinitions;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.RoleDefinitions = RoleDefinitions;
/**
 * Describes a role definition
 *
 */
var RoleDefinition = /** @class */ (function (_super) {
    __extends(RoleDefinition, _super);
    function RoleDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Updates this role definition with the supplied properties
     *
     * @param properties A plain object hash of values to update for the role definition
     */
    /* tslint:disable no-string-literal */
    RoleDefinition.prototype.update = function (properties) {
        var _this = this;
        if (typeof properties.hasOwnProperty("BasePermissions") !== "undefined") {
            properties["BasePermissions"] = util_1.Util.extend({ __metadata: { type: "SP.BasePermissions" } }, properties["BasePermissions"]);
        }
        var postBody = JSON.stringify(util_1.Util.extend({
            "__metadata": { "type": "SP.RoleDefinition" },
        }, properties));
        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then(function (data) {
            var retDef = _this;
            if (properties.hasOwnProperty("Name")) {
                var parent_1 = _this.getParent(RoleDefinitions, _this.parentUrl, "");
                retDef = parent_1.getByName(properties["Name"]);
            }
            return {
                data: data,
                definition: retDef,
            };
        });
    };
    /* tslint:enable */
    /**
     * Deletes this role definition
     *
     */
    RoleDefinition.prototype.delete = function () {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    };
    return RoleDefinition;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.RoleDefinition = RoleDefinition;
/**
 * Describes the role definitons bound to a role assignment object
 *
 */
var RoleDefinitionBindings = /** @class */ (function (_super) {
    __extends(RoleDefinitionBindings, _super);
    /**
     * Creates a new instance of the RoleDefinitionBindings class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this role definition bindings collection
     */
    function RoleDefinitionBindings(baseUrl, path) {
        if (path === void 0) { path = "roledefinitionbindings"; }
        return _super.call(this, baseUrl, path) || this;
    }
    return RoleDefinitionBindings;
}(sharepointqueryable_1.SharePointQueryableCollection));
exports.RoleDefinitionBindings = RoleDefinitionBindings;


/***/ }),

/***/ "t8hP":
/*!******************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/toResourcePath.js ***!
  \******************************************************/
/*! exports provided: toResourcePath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toResourcePath", function() { return toResourcePath; });
function toResourcePath(url) {
    return {
        DecodedUrl: url,
        __metadata: { type: "SP.ResourcePath" },
    };
}
//# sourceMappingURL=toResourcePath.js.map

/***/ }),

/***/ "tSEd":
/*!*****************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/extractweburl.js ***!
  \*****************************************************/
/*! exports provided: extractWebUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractWebUrl", function() { return extractWebUrl; });
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/common */ "zqEK");

function extractWebUrl(candidateUrl) {
    if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_0__["stringIsNullOrEmpty"])(candidateUrl)) {
        return "";
    }
    var index = candidateUrl.indexOf("_api/");
    if (index < 0) {
        index = candidateUrl.indexOf("_vti_bin/");
    }
    if (index > -1) {
        return candidateUrl.substr(0, index);
    }
    // if all else fails just give them what they gave us back
    return candidateUrl;
}
//# sourceMappingURL=extractweburl.js.map

/***/ }),

/***/ "tv1o":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/utils/exceptions.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __webpack_require__(/*! ../utils/logging */ "2C3z");
function defaultLog(error) {
    logging_1.Logger.log({ data: {}, level: logging_1.LogLevel.Error, message: "[" + error.name + "]::" + error.message });
}
/**
 * Represents an exception with an HttpClient request
 *
 */
var ProcessHttpClientResponseException = /** @class */ (function (_super) {
    __extends(ProcessHttpClientResponseException, _super);
    function ProcessHttpClientResponseException(status, statusText, data) {
        var _this = _super.call(this, "Error making HttpClient request in queryable: [" + status + "] " + statusText) || this;
        _this.status = status;
        _this.statusText = statusText;
        _this.data = data;
        _this.name = "ProcessHttpClientResponseException";
        logging_1.Logger.log({ data: _this.data, level: logging_1.LogLevel.Error, message: _this.message });
        return _this;
    }
    return ProcessHttpClientResponseException;
}(Error));
exports.ProcessHttpClientResponseException = ProcessHttpClientResponseException;
var NoCacheAvailableException = /** @class */ (function (_super) {
    __extends(NoCacheAvailableException, _super);
    function NoCacheAvailableException(msg) {
        if (msg === void 0) { msg = "Cannot create a caching configuration provider since cache is not available."; }
        var _this = _super.call(this, msg) || this;
        _this.name = "NoCacheAvailableException";
        defaultLog(_this);
        return _this;
    }
    return NoCacheAvailableException;
}(Error));
exports.NoCacheAvailableException = NoCacheAvailableException;
var APIUrlException = /** @class */ (function (_super) {
    __extends(APIUrlException, _super);
    function APIUrlException(msg) {
        if (msg === void 0) { msg = "Unable to determine API url."; }
        var _this = _super.call(this, msg) || this;
        _this.name = "APIUrlException";
        defaultLog(_this);
        return _this;
    }
    return APIUrlException;
}(Error));
exports.APIUrlException = APIUrlException;
var AuthUrlException = /** @class */ (function (_super) {
    __extends(AuthUrlException, _super);
    function AuthUrlException(data, msg) {
        if (msg === void 0) { msg = "Auth URL Endpoint could not be determined from data. Data logged."; }
        var _this = _super.call(this, msg) || this;
        _this.name = "APIUrlException";
        logging_1.Logger.log({ data: data, level: logging_1.LogLevel.Error, message: _this.message });
        return _this;
    }
    return AuthUrlException;
}(Error));
exports.AuthUrlException = AuthUrlException;
var NodeFetchClientUnsupportedException = /** @class */ (function (_super) {
    __extends(NodeFetchClientUnsupportedException, _super);
    function NodeFetchClientUnsupportedException(msg) {
        if (msg === void 0) { msg = "Using NodeFetchClient in the browser is not supported."; }
        var _this = _super.call(this, msg) || this;
        _this.name = "NodeFetchClientUnsupportedException";
        defaultLog(_this);
        return _this;
    }
    return NodeFetchClientUnsupportedException;
}(Error));
exports.NodeFetchClientUnsupportedException = NodeFetchClientUnsupportedException;
var SPRequestExecutorUndefinedException = /** @class */ (function (_super) {
    __extends(SPRequestExecutorUndefinedException, _super);
    function SPRequestExecutorUndefinedException() {
        var _this = this;
        var msg = [
            "SP.RequestExecutor is undefined. ",
            "Load the SP.RequestExecutor.js library (/_layouts/15/SP.RequestExecutor.js) before loading the PnP JS Core library.",
        ].join(" ");
        _this = _super.call(this, msg) || this;
        _this.name = "SPRequestExecutorUndefinedException";
        defaultLog(_this);
        return _this;
    }
    return SPRequestExecutorUndefinedException;
}(Error));
exports.SPRequestExecutorUndefinedException = SPRequestExecutorUndefinedException;
var MaxCommentLengthException = /** @class */ (function (_super) {
    __extends(MaxCommentLengthException, _super);
    function MaxCommentLengthException(msg) {
        if (msg === void 0) { msg = "The maximum comment length is 1023 characters."; }
        var _this = _super.call(this, msg) || this;
        _this.name = "MaxCommentLengthException";
        defaultLog(_this);
        return _this;
    }
    return MaxCommentLengthException;
}(Error));
exports.MaxCommentLengthException = MaxCommentLengthException;
var NotSupportedInBatchException = /** @class */ (function (_super) {
    __extends(NotSupportedInBatchException, _super);
    function NotSupportedInBatchException(operation) {
        if (operation === void 0) { operation = "This operation"; }
        var _this = _super.call(this, operation + " is not supported as part of a batch.") || this;
        _this.name = "NotSupportedInBatchException";
        defaultLog(_this);
        return _this;
    }
    return NotSupportedInBatchException;
}(Error));
exports.NotSupportedInBatchException = NotSupportedInBatchException;
var ODataIdException = /** @class */ (function (_super) {
    __extends(ODataIdException, _super);
    function ODataIdException(data, msg) {
        if (msg === void 0) { msg = "Could not extract odata id in object, you may be using nometadata. Object data logged to logger."; }
        var _this = _super.call(this, msg) || this;
        _this.name = "ODataIdException";
        logging_1.Logger.log({ data: data, level: logging_1.LogLevel.Error, message: _this.message });
        return _this;
    }
    return ODataIdException;
}(Error));
exports.ODataIdException = ODataIdException;
var BatchParseException = /** @class */ (function (_super) {
    __extends(BatchParseException, _super);
    function BatchParseException(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = "BatchParseException";
        defaultLog(_this);
        return _this;
    }
    return BatchParseException;
}(Error));
exports.BatchParseException = BatchParseException;
var AlreadyInBatchException = /** @class */ (function (_super) {
    __extends(AlreadyInBatchException, _super);
    function AlreadyInBatchException(msg) {
        if (msg === void 0) { msg = "This query is already part of a batch."; }
        var _this = _super.call(this, msg) || this;
        _this.name = "AlreadyInBatchException";
        defaultLog(_this);
        return _this;
    }
    return AlreadyInBatchException;
}(Error));
exports.AlreadyInBatchException = AlreadyInBatchException;
var FunctionExpectedException = /** @class */ (function (_super) {
    __extends(FunctionExpectedException, _super);
    function FunctionExpectedException(msg) {
        if (msg === void 0) { msg = "This query is already part of a batch."; }
        var _this = _super.call(this, msg) || this;
        _this.name = "FunctionExpectedException";
        defaultLog(_this);
        return _this;
    }
    return FunctionExpectedException;
}(Error));
exports.FunctionExpectedException = FunctionExpectedException;
var UrlException = /** @class */ (function (_super) {
    __extends(UrlException, _super);
    function UrlException(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = "UrlException";
        defaultLog(_this);
        return _this;
    }
    return UrlException;
}(Error));
exports.UrlException = UrlException;


/***/ }),

/***/ "uJEh":
/*!*******************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/configuration/configuration.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var collections_1 = __webpack_require__(/*! ../collections/collections */ "hd/X");
/**
 * Class used to manage the current application settings
 *
 */
var Settings = /** @class */ (function () {
    /**
     * Creates a new instance of the settings class
     *
     * @constructor
     */
    function Settings() {
        this._settings = new collections_1.Dictionary();
    }
    /**
     * Adds a new single setting, or overwrites a previous setting with the same key
     *
     * @param {string} key The key used to store this setting
     * @param {string} value The setting value to store
     */
    Settings.prototype.add = function (key, value) {
        this._settings.add(key, value);
    };
    /**
     * Adds a JSON value to the collection as a string, you must use getJSON to rehydrate the object when read
     *
     * @param {string} key The key used to store this setting
     * @param {any} value The setting value to store
     */
    Settings.prototype.addJSON = function (key, value) {
        this._settings.add(key, JSON.stringify(value));
    };
    /**
     * Applies the supplied hash to the setting collection overwriting any existing value, or created new values
     *
     * @param {TypedHash<any>} hash The set of values to add
     */
    Settings.prototype.apply = function (hash) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._settings.merge(hash);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * Loads configuration settings into the collection from the supplied provider and returns a Promise
     *
     * @param {IConfigurationProvider} provider The provider from which we will load the settings
     */
    Settings.prototype.load = function (provider) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            provider.getConfiguration().then(function (value) {
                _this._settings.merge(value);
                resolve();
            }).catch(function (reason) {
                reject(reason);
            });
        });
    };
    /**
     * Gets a value from the configuration
     *
     * @param {string} key The key whose value we want to return. Returns null if the key does not exist
     * @return {string} string value from the configuration
     */
    Settings.prototype.get = function (key) {
        return this._settings.get(key);
    };
    /**
     * Gets a JSON value, rehydrating the stored string to the original object
     *
     * @param {string} key The key whose value we want to return. Returns null if the key does not exist
     * @return {any} object from the configuration
     */
    Settings.prototype.getJSON = function (key) {
        var o = this.get(key);
        if (typeof o === "undefined" || o === null) {
            return o;
        }
        return JSON.parse(o);
    };
    return Settings;
}());
exports.Settings = Settings;


/***/ }),

/***/ "vfgx":
/*!***************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/userprofiles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var files_1 = __webpack_require__(/*! ../utils/files */ "ppNx");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
var parsers_1 = __webpack_require__(/*! ../odata/parsers */ "eGqj");
var UserProfileQuery = /** @class */ (function (_super) {
    __extends(UserProfileQuery, _super);
    /**
     * Creates a new instance of the UserProfileQuery class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this user profile query
     */
    function UserProfileQuery(baseUrl, path) {
        if (path === void 0) { path = "_api/sp.userprofiles.peoplemanager"; }
        var _this = _super.call(this, baseUrl, path) || this;
        _this.clientPeoplePickerQuery = new ClientPeoplePickerQuery(baseUrl);
        _this.profileLoader = new ProfileLoader(baseUrl);
        return _this;
    }
    Object.defineProperty(UserProfileQuery.prototype, "editProfileLink", {
        /**
         * The url of the edit profile page for the current user
         */
        get: function () {
            return this.clone(UserProfileQuery, "EditProfileLink").getAs(parsers_1.ODataValue());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileQuery.prototype, "isMyPeopleListPublic", {
        /**
         * A boolean value that indicates whether the current user's "People I'm Following" list is public
         */
        get: function () {
            return this.clone(UserProfileQuery, "IsMyPeopleListPublic").getAs(parsers_1.ODataValue());
        },
        enumerable: true,
        configurable: true
    });
    /**
     * A boolean value that indicates whether the current user is being followed by the specified user
     *
     * @param loginName The account name of the user
     */
    UserProfileQuery.prototype.amIFollowedBy = function (loginName) {
        var q = this.clone(UserProfileQuery, "amifollowedby(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    };
    /**
     * A boolean value that indicates whether the current user is following the specified user
     *
     * @param loginName The account name of the user
     */
    UserProfileQuery.prototype.amIFollowing = function (loginName) {
        var q = this.clone(UserProfileQuery, "amifollowing(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    };
    /**
     * Gets tags that the current user is following
     *
     * @param maxCount The maximum number of tags to retrieve (default is 20)
     */
    UserProfileQuery.prototype.getFollowedTags = function (maxCount) {
        if (maxCount === void 0) { maxCount = 20; }
        return this.clone(UserProfileQuery, "getfollowedtags(" + maxCount + ")").get();
    };
    /**
     * Gets the people who are following the specified user
     *
     * @param loginName The account name of the user
     */
    UserProfileQuery.prototype.getFollowersFor = function (loginName) {
        var q = this.clone(UserProfileQuery, "getfollowersfor(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    };
    Object.defineProperty(UserProfileQuery.prototype, "myFollowers", {
        /**
         * Gets the people who are following the current user
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableCollection(this, "getmyfollowers");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileQuery.prototype, "myProperties", {
        /**
         * Gets user properties for the current user
         *
         */
        get: function () {
            return new UserProfileQuery(this, "getmyproperties");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the people who the specified user is following
     *
     * @param loginName The account name of the user.
     */
    UserProfileQuery.prototype.getPeopleFollowedBy = function (loginName) {
        var q = this.clone(UserProfileQuery, "getpeoplefollowedby(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    };
    /**
     * Gets user properties for the specified user.
     *
     * @param loginName The account name of the user.
     */
    UserProfileQuery.prototype.getPropertiesFor = function (loginName) {
        var q = this.clone(UserProfileQuery, "getpropertiesfor(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    };
    Object.defineProperty(UserProfileQuery.prototype, "trendingTags", {
        /**
         * Gets the 20 most popular hash tags over the past week, sorted so that the most popular tag appears first
         *
         */
        get: function () {
            var q = this.clone(UserProfileQuery, null);
            q.concat(".gettrendingtags");
            return q.get();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the specified user profile property for the specified user
     *
     * @param loginName The account name of the user
     * @param propertyName The case-sensitive name of the property to get
     */
    UserProfileQuery.prototype.getUserProfilePropertyFor = function (loginName, propertyName) {
        var q = this.clone(UserProfileQuery, "getuserprofilepropertyfor(accountname=@v, propertyname='" + propertyName + "')");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.get();
    };
    /**
     * Removes the specified user from the user's list of suggested people to follow
     *
     * @param loginName The account name of the user
     */
    UserProfileQuery.prototype.hideSuggestion = function (loginName) {
        var q = this.clone(UserProfileQuery, "hidesuggestion(@v)");
        q.query.add("@v", "'" + encodeURIComponent(loginName) + "'");
        return q.postCore();
    };
    /**
     * A boolean values that indicates whether the first user is following the second user
     *
     * @param follower The account name of the user who might be following the followee
     * @param followee The account name of the user who might be followed by the follower
     */
    UserProfileQuery.prototype.isFollowing = function (follower, followee) {
        var q = this.clone(UserProfileQuery, null);
        q.concat(".isfollowing(possiblefolloweraccountname=@v, possiblefolloweeaccountname=@y)");
        q.query.add("@v", "'" + encodeURIComponent(follower) + "'");
        q.query.add("@y", "'" + encodeURIComponent(followee) + "'");
        return q.get();
    };
    /**
     * Uploads and sets the user profile picture (Users can upload a picture to their own profile only). Not supported for batching.
     *
     * @param profilePicSource Blob data representing the user's picture in BMP, JPEG, or PNG format of up to 4.76MB
     */
    UserProfileQuery.prototype.setMyProfilePic = function (profilePicSource) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            files_1.readBlobAsArrayBuffer(profilePicSource).then(function (buffer) {
                var request = new UserProfileQuery(_this, "setmyprofilepicture");
                request.postCore({
                    body: String.fromCharCode.apply(null, new Uint16Array(buffer)),
                }).then(function (_) { return resolve(); });
            }).catch(function (e) { return reject(e); });
        });
    };
    /**
     * Sets single value User Profile property
     *
     * @param accountName The account name of the user
     * @param propertyName Property name
     * @param propertyValue Property value
     */
    UserProfileQuery.prototype.setSingleValueProfileProperty = function (accountName, propertyName, propertyValue) {
        var postBody = JSON.stringify({
            accountName: accountName,
            propertyName: propertyName,
            propertyValue: propertyValue,
        });
        return this.clone(UserProfileQuery, "SetSingleValueProfileProperty")
            .postCore({ body: postBody });
    };
    /**
     * Sets multi valued User Profile property
     *
     * @param accountName The account name of the user
     * @param propertyName Property name
     * @param propertyValues Property values
     */
    UserProfileQuery.prototype.setMultiValuedProfileProperty = function (accountName, propertyName, propertyValues) {
        var postBody = JSON.stringify({
            accountName: accountName,
            propertyName: propertyName,
            propertyValues: propertyValues,
        });
        return this.clone(UserProfileQuery, "SetMultiValuedProfileProperty")
            .postCore({ body: postBody });
    };
    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only)
     *
     * @param emails The email addresses of the users to provision sites for
     */
    UserProfileQuery.prototype.createPersonalSiteEnqueueBulk = function () {
        var emails = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            emails[_i] = arguments[_i];
        }
        return this.profileLoader.createPersonalSiteEnqueueBulk(emails);
    };
    Object.defineProperty(UserProfileQuery.prototype, "ownerUserProfile", {
        /**
         * Gets the user profile of the site owner
         *
         */
        get: function () {
            return this.profileLoader.ownerUserProfile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserProfileQuery.prototype, "userProfile", {
        /**
         * Gets the user profile for the current user
         */
        get: function () {
            return this.profileLoader.userProfile;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files
     *
     * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
     */
    UserProfileQuery.prototype.createPersonalSite = function (interactiveRequest) {
        if (interactiveRequest === void 0) { interactiveRequest = false; }
        return this.profileLoader.createPersonalSite(interactiveRequest);
    };
    /**
     * Sets the privacy settings for this profile
     *
     * @param share true to make all social data public; false to make all social data private
     */
    UserProfileQuery.prototype.shareAllSocialData = function (share) {
        return this.profileLoader.shareAllSocialData(share);
    };
    /**
     * Resolves user or group using specified query parameters
     *
     * @param queryParams The query parameters used to perform resolve
     */
    UserProfileQuery.prototype.clientPeoplePickerResolveUser = function (queryParams) {
        return this.clientPeoplePickerQuery.clientPeoplePickerResolveUser(queryParams);
    };
    /**
     * Searches for users or groups using specified query parameters
     *
     * @param queryParams The query parameters used to perform search
     */
    UserProfileQuery.prototype.clientPeoplePickerSearchUser = function (queryParams) {
        return this.clientPeoplePickerQuery.clientPeoplePickerSearchUser(queryParams);
    };
    return UserProfileQuery;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.UserProfileQuery = UserProfileQuery;
var ProfileLoader = /** @class */ (function (_super) {
    __extends(ProfileLoader, _super);
    /**
   * Creates a new instance of the ProfileLoader class
   *
   * @param baseUrl The url or SharePointQueryable which forms the parent of this profile loader
   */
    function ProfileLoader(baseUrl, path) {
        if (path === void 0) { path = "_api/sp.userprofiles.profileloader.getprofileloader"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only) Doesn't support batching
     *
     * @param emails The email addresses of the users to provision sites for
     */
    ProfileLoader.prototype.createPersonalSiteEnqueueBulk = function (emails) {
        return this.clone(ProfileLoader, "createpersonalsiteenqueuebulk", false).postCore({
            body: JSON.stringify({ "emailIDs": emails }),
        });
    };
    Object.defineProperty(ProfileLoader.prototype, "ownerUserProfile", {
        /**
         * Gets the user profile of the site owner.
         *
         */
        get: function () {
            var q = this.getParent(ProfileLoader, this.parentUrl, "_api/sp.userprofiles.profileloader.getowneruserprofile");
            if (this.hasBatch) {
                q = q.inBatch(this.batch);
            }
            return q.postAsCore();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileLoader.prototype, "userProfile", {
        /**
         * Gets the user profile of the current user.
         *
         */
        get: function () {
            return this.clone(ProfileLoader, "getuserprofile").postAsCore();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files.
     *
     * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
     */
    ProfileLoader.prototype.createPersonalSite = function (interactiveRequest) {
        if (interactiveRequest === void 0) { interactiveRequest = false; }
        return this.clone(ProfileLoader, "getuserprofile/createpersonalsiteenque(" + interactiveRequest + ")").postCore();
    };
    /**
     * Sets the privacy settings for this profile
     *
     * @param share true to make all social data public; false to make all social data private.
     */
    ProfileLoader.prototype.shareAllSocialData = function (share) {
        return this.clone(ProfileLoader, "getuserprofile/shareallsocialdata(" + share + ")").postCore();
    };
    return ProfileLoader;
}(sharepointqueryable_1.SharePointQueryable));
var ClientPeoplePickerQuery = /** @class */ (function (_super) {
    __extends(ClientPeoplePickerQuery, _super);
    /**
     * Creates a new instance of the PeoplePickerQuery class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this people picker query
     */
    function ClientPeoplePickerQuery(baseUrl, path) {
        if (path === void 0) { path = "_api/sp.ui.applicationpages.clientpeoplepickerwebserviceinterface"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * Resolves user or group using specified query parameters
     *
     * @param queryParams The query parameters used to perform resolve
     */
    ClientPeoplePickerQuery.prototype.clientPeoplePickerResolveUser = function (queryParams) {
        var q = this.clone(ClientPeoplePickerQuery, null);
        q.concat(".clientpeoplepickerresolveuser");
        return q.postAsCore({
            body: this.createClientPeoplePickerQueryParametersRequestBody(queryParams),
        }).then(function (json) { return JSON.parse(json); });
    };
    /**
     * Searches for users or groups using specified query parameters
     *
     * @param queryParams The query parameters used to perform search
     */
    ClientPeoplePickerQuery.prototype.clientPeoplePickerSearchUser = function (queryParams) {
        var q = this.clone(ClientPeoplePickerQuery, null);
        q.concat(".clientpeoplepickersearchuser");
        return q.postAsCore({
            body: this.createClientPeoplePickerQueryParametersRequestBody(queryParams),
        }).then(function (json) { return JSON.parse(json); });
    };
    /**
     * Creates ClientPeoplePickerQueryParameters request body
     *
     * @param queryParams The query parameters to create request body
     */
    ClientPeoplePickerQuery.prototype.createClientPeoplePickerQueryParametersRequestBody = function (queryParams) {
        return JSON.stringify({
            "queryParams": util_1.Util.extend({
                "__metadata": { "type": "SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters" },
            }, queryParams),
        });
    };
    return ClientPeoplePickerQuery;
}(sharepointqueryable_1.SharePointQueryable));


/***/ }),

/***/ "vy67":
/*!*********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/search.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var util_1 = __webpack_require__(/*! ../utils/util */ "bk0Y");
/**
 * Allows for the fluent construction of search queries
 */
var SearchQueryBuilder = /** @class */ (function () {
    function SearchQueryBuilder(queryText, _query) {
        if (queryText === void 0) { queryText = ""; }
        if (_query === void 0) { _query = {}; }
        this._query = _query;
        if (typeof queryText === "string" && queryText.length > 0) {
            this.extendQuery({ Querytext: queryText });
        }
    }
    SearchQueryBuilder.create = function (queryText, queryTemplate) {
        if (queryText === void 0) { queryText = ""; }
        if (queryTemplate === void 0) { queryTemplate = {}; }
        return new SearchQueryBuilder(queryText, queryTemplate);
    };
    SearchQueryBuilder.prototype.text = function (queryText) {
        return this.extendQuery({ Querytext: queryText });
    };
    SearchQueryBuilder.prototype.template = function (template) {
        return this.extendQuery({ QueryTemplate: template });
    };
    SearchQueryBuilder.prototype.sourceId = function (id) {
        return this.extendQuery({ SourceId: id });
    };
    Object.defineProperty(SearchQueryBuilder.prototype, "enableInterleaving", {
        get: function () {
            return this.extendQuery({ EnableInterleaving: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "enableStemming", {
        get: function () {
            return this.extendQuery({ EnableStemming: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "trimDuplicates", {
        get: function () {
            return this.extendQuery({ TrimDuplicates: true });
        },
        enumerable: true,
        configurable: true
    });
    SearchQueryBuilder.prototype.trimDuplicatesIncludeId = function (n) {
        return this.extendQuery({ TrimDuplicatesIncludeId: n });
    };
    Object.defineProperty(SearchQueryBuilder.prototype, "enableNicknames", {
        get: function () {
            return this.extendQuery({ EnableNicknames: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "enableFql", {
        get: function () {
            return this.extendQuery({ EnableFQL: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "enablePhonetic", {
        get: function () {
            return this.extendQuery({ EnablePhonetic: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "bypassResultTypes", {
        get: function () {
            return this.extendQuery({ BypassResultTypes: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "processBestBets", {
        get: function () {
            return this.extendQuery({ ProcessBestBets: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "enableQueryRules", {
        get: function () {
            return this.extendQuery({ EnableQueryRules: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "enableSorting", {
        get: function () {
            return this.extendQuery({ EnableSorting: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchQueryBuilder.prototype, "generateBlockRankLog", {
        get: function () {
            return this.extendQuery({ GenerateBlockRankLog: true });
        },
        enumerable: true,
        configurable: true
    });
    SearchQueryBuilder.prototype.rankingModelId = function (id) {
        return this.extendQuery({ RankingModelId: id });
    };
    SearchQueryBuilder.prototype.startRow = function (n) {
        return this.extendQuery({ StartRow: n });
    };
    SearchQueryBuilder.prototype.rowLimit = function (n) {
        return this.extendQuery({ RowLimit: n });
    };
    SearchQueryBuilder.prototype.rowsPerPage = function (n) {
        return this.extendQuery({ RowsPerPage: n });
    };
    SearchQueryBuilder.prototype.selectProperties = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        return this.extendQuery({ SelectProperties: properties });
    };
    SearchQueryBuilder.prototype.culture = function (culture) {
        return this.extendQuery({ Culture: culture });
    };
    SearchQueryBuilder.prototype.timeZoneId = function (id) {
        return this.extendQuery({ TimeZoneId: id });
    };
    SearchQueryBuilder.prototype.refinementFilters = function () {
        var filters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filters[_i] = arguments[_i];
        }
        return this.extendQuery({ RefinementFilters: filters });
    };
    SearchQueryBuilder.prototype.refiners = function (refiners) {
        return this.extendQuery({ Refiners: refiners });
    };
    SearchQueryBuilder.prototype.hiddenConstraints = function (constraints) {
        return this.extendQuery({ HiddenConstraints: constraints });
    };
    SearchQueryBuilder.prototype.sortList = function () {
        var sorts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sorts[_i] = arguments[_i];
        }
        return this.extendQuery({ SortList: sorts });
    };
    SearchQueryBuilder.prototype.timeout = function (milliseconds) {
        return this.extendQuery({ Timeout: milliseconds });
    };
    SearchQueryBuilder.prototype.hithighlightedProperties = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        return this.extendQuery({ HitHighlightedProperties: properties });
    };
    SearchQueryBuilder.prototype.clientType = function (clientType) {
        return this.extendQuery({ ClientType: clientType });
    };
    SearchQueryBuilder.prototype.personalizationData = function (data) {
        return this.extendQuery({ PersonalizationData: data });
    };
    SearchQueryBuilder.prototype.resultsURL = function (url) {
        return this.extendQuery({ ResultsUrl: url });
    };
    SearchQueryBuilder.prototype.queryTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.extendQuery({ QueryTag: tags });
    };
    SearchQueryBuilder.prototype.properties = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        return this.extendQuery({ Properties: properties });
    };
    Object.defineProperty(SearchQueryBuilder.prototype, "processPersonalFavorites", {
        get: function () {
            return this.extendQuery({ ProcessPersonalFavorites: true });
        },
        enumerable: true,
        configurable: true
    });
    SearchQueryBuilder.prototype.queryTemplatePropertiesUrl = function (url) {
        return this.extendQuery({ QueryTemplatePropertiesUrl: url });
    };
    SearchQueryBuilder.prototype.reorderingRules = function () {
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i] = arguments[_i];
        }
        return this.extendQuery({ ReorderingRules: rules });
    };
    SearchQueryBuilder.prototype.hitHighlightedMultivaluePropertyLimit = function (limit) {
        return this.extendQuery({ HitHighlightedMultivaluePropertyLimit: limit });
    };
    Object.defineProperty(SearchQueryBuilder.prototype, "enableOrderingHitHighlightedProperty", {
        get: function () {
            return this.extendQuery({ EnableOrderingHitHighlightedProperty: true });
        },
        enumerable: true,
        configurable: true
    });
    SearchQueryBuilder.prototype.collapseSpecification = function (spec) {
        return this.extendQuery({ CollapseSpecification: spec });
    };
    SearchQueryBuilder.prototype.uiLanguage = function (lang) {
        return this.extendQuery({ UILanguage: lang });
    };
    SearchQueryBuilder.prototype.desiredSnippetLength = function (len) {
        return this.extendQuery({ DesiredSnippetLength: len });
    };
    SearchQueryBuilder.prototype.maxSnippetLength = function (len) {
        return this.extendQuery({ MaxSnippetLength: len });
    };
    SearchQueryBuilder.prototype.summaryLength = function (len) {
        return this.extendQuery({ SummaryLength: len });
    };
    SearchQueryBuilder.prototype.toSearchQuery = function () {
        return this._query;
    };
    SearchQueryBuilder.prototype.extendQuery = function (part) {
        this._query = util_1.Util.extend(this._query, part);
        return this;
    };
    return SearchQueryBuilder;
}());
exports.SearchQueryBuilder = SearchQueryBuilder;
/**
 * Describes the search API
 *
 */
var Search = /** @class */ (function (_super) {
    __extends(Search, _super);
    /**
     * Creates a new instance of the Search class
     *
     * @param baseUrl The url for the search context
     * @param query The SearchQuery object to execute
     */
    function Search(baseUrl, path) {
        if (path === void 0) { path = "_api/search/postquery"; }
        return _super.call(this, baseUrl, path) || this;
    }
    /**
     * .......
     * @returns Promise
     */
    Search.prototype.execute = function (query) {
        var _this = this;
        var formattedBody;
        formattedBody = query;
        if (formattedBody.SelectProperties) {
            formattedBody.SelectProperties = this.fixupProp(query.SelectProperties);
        }
        if (formattedBody.RefinementFilters) {
            formattedBody.RefinementFilters = this.fixupProp(query.RefinementFilters);
        }
        if (formattedBody.SortList) {
            formattedBody.SortList = this.fixupProp(query.SortList);
        }
        if (formattedBody.HithighlightedProperties) {
            formattedBody.HithighlightedProperties = this.fixupProp(query.HitHighlightedProperties);
        }
        if (formattedBody.ReorderingRules) {
            formattedBody.ReorderingRules = this.fixupProp(query.ReorderingRules);
        }
        if (formattedBody.Properties) {
            formattedBody.Properties = this.fixupProp(query.Properties);
        }
        var postBody = JSON.stringify({
            request: util_1.Util.extend({
                "__metadata": { "type": "Microsoft.Office.Server.Search.REST.SearchRequest" },
            }, formattedBody),
        });
        return this.postCore({ body: postBody }).then(function (data) { return new SearchResults(data, _this.toUrl(), query); });
    };
    /**
     * Fixes up properties that expect to consist of a "results" collection when needed
     *
     * @param prop property to fixup for container struct
     */
    Search.prototype.fixupProp = function (prop) {
        if (prop.hasOwnProperty("results")) {
            return prop;
        }
        return { results: prop };
    };
    return Search;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.Search = Search;
/**
 * Describes the SearchResults class, which returns the formatted and raw version of the query response
 */
var SearchResults = /** @class */ (function () {
    /**
     * Creates a new instance of the SearchResult class
     *
     */
    function SearchResults(rawResponse, _url, _query, _raw, _primary) {
        if (_raw === void 0) { _raw = null; }
        if (_primary === void 0) { _primary = null; }
        this._url = _url;
        this._query = _query;
        this._raw = _raw;
        this._primary = _primary;
        this._raw = rawResponse.postquery ? rawResponse.postquery : rawResponse;
    }
    Object.defineProperty(SearchResults.prototype, "ElapsedTime", {
        get: function () {
            return this.RawSearchResults.ElapsedTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchResults.prototype, "RowCount", {
        get: function () {
            return this.RawSearchResults.PrimaryQueryResult.RelevantResults.RowCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchResults.prototype, "TotalRows", {
        get: function () {
            return this.RawSearchResults.PrimaryQueryResult.RelevantResults.TotalRows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchResults.prototype, "TotalRowsIncludingDuplicates", {
        get: function () {
            return this.RawSearchResults.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchResults.prototype, "RawSearchResults", {
        get: function () {
            return this._raw;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchResults.prototype, "PrimarySearchResults", {
        get: function () {
            if (this._primary === null) {
                this._primary = this.formatSearchResults(this._raw.PrimaryQueryResult.RelevantResults.Table.Rows);
            }
            return this._primary;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets a page of results
     *
     * @param pageNumber Index of the page to return. Used to determine StartRow
     * @param pageSize Optional, items per page (default = 10)
     */
    SearchResults.prototype.getPage = function (pageNumber, pageSize) {
        // if we got all the available rows we don't have another page
        if (this.TotalRows < this.RowCount) {
            return Promise.resolve(null);
        }
        // if pageSize is supplied, then we use that regardless of any previous values
        // otherwise get the previous RowLimit or default to 10
        var rows = typeof pageSize !== "undefined" ? pageSize : this._query.hasOwnProperty("RowLimit") ? this._query.RowLimit : 10;
        var query = util_1.Util.extend(this._query, {
            RowLimit: rows,
            StartRow: rows * (pageNumber - 1),
        });
        // we have reached the end
        if (query.StartRow > this.TotalRows) {
            return Promise.resolve(null);
        }
        var search = new Search(this._url, null);
        return search.execute(query);
    };
    /**
     * Formats a search results array
     *
     * @param rawResults The array to process
     */
    SearchResults.prototype.formatSearchResults = function (rawResults) {
        var results = new Array();
        var tempResults = rawResults.results ? rawResults.results : rawResults;
        for (var _i = 0, tempResults_1 = tempResults; _i < tempResults_1.length; _i++) {
            var tempResult = tempResults_1[_i];
            var cells = tempResult.Cells.results ? tempResult.Cells.results : tempResult.Cells;
            results.push(cells.reduce(function (res, cell) {
                Object.defineProperty(res, cell.Key, {
                    configurable: false,
                    enumerable: false,
                    value: cell.Value,
                    writable: false,
                });
                return res;
            }, {}));
        }
        return results;
    };
    return SearchResults;
}());
exports.SearchResults = SearchResults;
/**
 * defines the SortDirection enum
 */
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["Ascending"] = 0] = "Ascending";
    SortDirection[SortDirection["Descending"] = 1] = "Descending";
    SortDirection[SortDirection["FQLFormula"] = 2] = "FQLFormula";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
/**
 * defines the ReorderingRuleMatchType  enum
 */
var ReorderingRuleMatchType;
(function (ReorderingRuleMatchType) {
    ReorderingRuleMatchType[ReorderingRuleMatchType["ResultContainsKeyword"] = 0] = "ResultContainsKeyword";
    ReorderingRuleMatchType[ReorderingRuleMatchType["TitleContainsKeyword"] = 1] = "TitleContainsKeyword";
    ReorderingRuleMatchType[ReorderingRuleMatchType["TitleMatchesKeyword"] = 2] = "TitleMatchesKeyword";
    ReorderingRuleMatchType[ReorderingRuleMatchType["UrlStartsWith"] = 3] = "UrlStartsWith";
    ReorderingRuleMatchType[ReorderingRuleMatchType["UrlExactlyMatches"] = 4] = "UrlExactlyMatches";
    ReorderingRuleMatchType[ReorderingRuleMatchType["ContentTypeIs"] = 5] = "ContentTypeIs";
    ReorderingRuleMatchType[ReorderingRuleMatchType["FileExtensionMatches"] = 6] = "FileExtensionMatches";
    ReorderingRuleMatchType[ReorderingRuleMatchType["ResultHasTag"] = 7] = "ResultHasTag";
    ReorderingRuleMatchType[ReorderingRuleMatchType["ManualCondition"] = 8] = "ManualCondition";
})(ReorderingRuleMatchType = exports.ReorderingRuleMatchType || (exports.ReorderingRuleMatchType = {}));
/**
 * Specifies the type value for the property
 */
var QueryPropertyValueType;
(function (QueryPropertyValueType) {
    QueryPropertyValueType[QueryPropertyValueType["None"] = 0] = "None";
    QueryPropertyValueType[QueryPropertyValueType["StringType"] = 1] = "StringType";
    QueryPropertyValueType[QueryPropertyValueType["Int32Type"] = 2] = "Int32Type";
    QueryPropertyValueType[QueryPropertyValueType["BooleanType"] = 3] = "BooleanType";
    QueryPropertyValueType[QueryPropertyValueType["StringArrayType"] = 4] = "StringArrayType";
    QueryPropertyValueType[QueryPropertyValueType["UnSupportedType"] = 5] = "UnSupportedType";
})(QueryPropertyValueType = exports.QueryPropertyValueType || (exports.QueryPropertyValueType = {}));
var SearchBuiltInSourceId = /** @class */ (function () {
    function SearchBuiltInSourceId() {
    }
    SearchBuiltInSourceId.Documents = "e7ec8cee-ded8-43c9-beb5-436b54b31e84";
    SearchBuiltInSourceId.ItemsMatchingContentType = "5dc9f503-801e-4ced-8a2c-5d1237132419";
    SearchBuiltInSourceId.ItemsMatchingTag = "e1327b9c-2b8c-4b23-99c9-3730cb29c3f7";
    SearchBuiltInSourceId.ItemsRelatedToCurrentUser = "48fec42e-4a92-48ce-8363-c2703a40e67d";
    SearchBuiltInSourceId.ItemsWithSameKeywordAsThisItem = "5c069288-1d17-454a-8ac6-9c642a065f48";
    SearchBuiltInSourceId.LocalPeopleResults = "b09a7990-05ea-4af9-81ef-edfab16c4e31";
    SearchBuiltInSourceId.LocalReportsAndDataResults = "203fba36-2763-4060-9931-911ac8c0583b";
    SearchBuiltInSourceId.LocalSharePointResults = "8413cd39-2156-4e00-b54d-11efd9abdb89";
    SearchBuiltInSourceId.LocalVideoResults = "78b793ce-7956-4669-aa3b-451fc5defebf";
    SearchBuiltInSourceId.Pages = "5e34578e-4d08-4edc-8bf3-002acf3cdbcc";
    SearchBuiltInSourceId.Pictures = "38403c8c-3975-41a8-826e-717f2d41568a";
    SearchBuiltInSourceId.Popular = "97c71db1-58ce-4891-8b64-585bc2326c12";
    SearchBuiltInSourceId.RecentlyChangedItems = "ba63bbae-fa9c-42c0-b027-9a878f16557c";
    SearchBuiltInSourceId.RecommendedItems = "ec675252-14fa-4fbe-84dd-8d098ed74181";
    SearchBuiltInSourceId.Wiki = "9479bf85-e257-4318-b5a8-81a180f5faa1";
    return SearchBuiltInSourceId;
}());
exports.SearchBuiltInSourceId = SearchBuiltInSourceId;


/***/ }),

/***/ "wSGh":
/*!*******************************************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/sharepointqueryablesecurable.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var webs_1 = __webpack_require__(/*! ./webs */ "U0SV");
var roles_1 = __webpack_require__(/*! ./roles */ "t5HP");
var types_1 = __webpack_require__(/*! ./types */ "z9XP");
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
var SharePointQueryableSecurable = /** @class */ (function (_super) {
    __extends(SharePointQueryableSecurable, _super);
    function SharePointQueryableSecurable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SharePointQueryableSecurable.prototype, "roleAssignments", {
        /**
         * Gets the set of role assignments for this item
         *
         */
        get: function () {
            return new roles_1.RoleAssignments(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SharePointQueryableSecurable.prototype, "firstUniqueAncestorSecurableObject", {
        /**
         * Gets the closest securable up the security hierarchy whose permissions are applied to this list item
         *
         */
        get: function () {
            return new sharepointqueryable_1.SharePointQueryableInstance(this, "FirstUniqueAncestorSecurableObject");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the effective permissions for the user supplied
     *
     * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
     */
    SharePointQueryableSecurable.prototype.getUserEffectivePermissions = function (loginName) {
        var q = this.clone(sharepointqueryable_1.SharePointQueryable, "getUserEffectivePermissions(@user)");
        q.query.add("@user", "'" + encodeURIComponent(loginName) + "'");
        return q.get().then(function (r) {
            // handle verbose mode
            return r.hasOwnProperty("GetUserEffectivePermissions") ? r.GetUserEffectivePermissions : r;
        });
    };
    /**
     * Gets the effective permissions for the current user
     */
    SharePointQueryableSecurable.prototype.getCurrentUserEffectivePermissions = function () {
        var _this = this;
        var w = webs_1.Web.fromUrl(this.toUrl());
        return w.currentUser.select("LoginName").getAs().then(function (user) {
            return _this.getUserEffectivePermissions(user.LoginName);
        });
    };
    /**
     * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
     *
     * @param copyRoleAssignments If true the permissions are copied from the current parent scope
     * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
     */
    SharePointQueryableSecurable.prototype.breakRoleInheritance = function (copyRoleAssignments, clearSubscopes) {
        if (copyRoleAssignments === void 0) { copyRoleAssignments = false; }
        if (clearSubscopes === void 0) { clearSubscopes = false; }
        return this.clone(SharePointQueryableSecurable, "breakroleinheritance(copyroleassignments=" + copyRoleAssignments + ", clearsubscopes=" + clearSubscopes + ")").postCore();
    };
    /**
     * Removes the local role assignments so that it re-inherit role assignments from the parent object.
     *
     */
    SharePointQueryableSecurable.prototype.resetRoleInheritance = function () {
        return this.clone(SharePointQueryableSecurable, "resetroleinheritance").postCore();
    };
    /**
     * Determines if a given user has the appropriate permissions
     *
     * @param loginName The user to check
     * @param permission The permission being checked
     */
    SharePointQueryableSecurable.prototype.userHasPermissions = function (loginName, permission) {
        var _this = this;
        return this.getUserEffectivePermissions(loginName).then(function (perms) {
            return _this.hasPermissions(perms, permission);
        });
    };
    /**
     * Determines if the current user has the requested permissions
     *
     * @param permission The permission we wish to check
     */
    SharePointQueryableSecurable.prototype.currentUserHasPermissions = function (permission) {
        var _this = this;
        return this.getCurrentUserEffectivePermissions().then(function (perms) {
            return _this.hasPermissions(perms, permission);
        });
    };
    /**
     * Taken from sp.js, checks the supplied permissions against the mask
     *
     * @param value The security principal's permissions on the given object
     * @param perm The permission checked against the value
     */
    /* tslint:disable:no-bitwise */
    SharePointQueryableSecurable.prototype.hasPermissions = function (value, perm) {
        if (!perm) {
            return true;
        }
        var low = parseFloat(value.Low);
        var high = parseFloat(value.High);
        if (perm === types_1.PermissionKind.FullMask) {
            return (high & 32767) === 32767 && low === 65535;
        }
        perm = perm - 1;
        var num = 1;
        if (perm >= 0 && perm < 32) {
            num = num << perm;
            return 0 !== (low & num);
        }
        else if (perm >= 32 && perm < 64) {
            num = num << perm - 32;
            return 0 !== (high & num);
        }
        return false;
    };
    return SharePointQueryableSecurable;
}(sharepointqueryable_1.SharePointQueryableInstance));
exports.SharePointQueryableSecurable = SharePointQueryableSecurable;


/***/ }),

/***/ "xT8B":
/*!******************************************!*\
  !*** ./node_modules/@pnp/odata/index.js ***!
  \******************************************/
/*! exports provided: Batch, CachingOptions, CachingParserWrapper, addProp, invokableFactory, pipelineBinder, defaultPipelineBinder, ODataParser, TextParser, BlobParser, JSONParser, BufferParser, LambdaParser, HttpRequestError, setResult, pipe, requestPipelineMethod, PipelineMethods, getDefaultPipeline, cloneQueryableData, Queryable, body, headers, extendGlobal, extendObj, extendFactory, clearGlobalExtensions, enableExtensions, disableExtensions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _batch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./batch.js */ "SQg3");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Batch", function() { return _batch_js__WEBPACK_IMPORTED_MODULE_0__["Batch"]; });

/* harmony import */ var _caching_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./caching.js */ "Zl34");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CachingOptions", function() { return _caching_js__WEBPACK_IMPORTED_MODULE_1__["CachingOptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CachingParserWrapper", function() { return _caching_js__WEBPACK_IMPORTED_MODULE_1__["CachingParserWrapper"]; });

/* harmony import */ var _add_prop_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./add-prop.js */ "W7+7");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addProp", function() { return _add_prop_js__WEBPACK_IMPORTED_MODULE_2__["addProp"]; });

/* harmony import */ var _invokable_binder_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./invokable-binder.js */ "pG6f");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "invokableFactory", function() { return _invokable_binder_js__WEBPACK_IMPORTED_MODULE_3__["invokableFactory"]; });

/* harmony import */ var _pipeline_binder_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline-binder.js */ "5e8D");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "pipelineBinder", function() { return _pipeline_binder_js__WEBPACK_IMPORTED_MODULE_4__["pipelineBinder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultPipelineBinder", function() { return _pipeline_binder_js__WEBPACK_IMPORTED_MODULE_4__["defaultPipelineBinder"]; });

/* harmony import */ var _parsers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parsers.js */ "xbXq");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ODataParser", function() { return _parsers_js__WEBPACK_IMPORTED_MODULE_5__["ODataParser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextParser", function() { return _parsers_js__WEBPACK_IMPORTED_MODULE_5__["TextParser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BlobParser", function() { return _parsers_js__WEBPACK_IMPORTED_MODULE_5__["BlobParser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "JSONParser", function() { return _parsers_js__WEBPACK_IMPORTED_MODULE_5__["JSONParser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BufferParser", function() { return _parsers_js__WEBPACK_IMPORTED_MODULE_5__["BufferParser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LambdaParser", function() { return _parsers_js__WEBPACK_IMPORTED_MODULE_5__["LambdaParser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HttpRequestError", function() { return _parsers_js__WEBPACK_IMPORTED_MODULE_5__["HttpRequestError"]; });

/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pipeline.js */ "TZA7");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setResult", function() { return _pipeline_js__WEBPACK_IMPORTED_MODULE_6__["setResult"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "pipe", function() { return _pipeline_js__WEBPACK_IMPORTED_MODULE_6__["pipe"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "requestPipelineMethod", function() { return _pipeline_js__WEBPACK_IMPORTED_MODULE_6__["requestPipelineMethod"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PipelineMethods", function() { return _pipeline_js__WEBPACK_IMPORTED_MODULE_6__["PipelineMethods"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getDefaultPipeline", function() { return _pipeline_js__WEBPACK_IMPORTED_MODULE_6__["getDefaultPipeline"]; });

/* harmony import */ var _queryable_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./queryable.js */ "dKLh");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "cloneQueryableData", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_7__["cloneQueryableData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Queryable", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_7__["Queryable"]; });

/* harmony import */ var _request_builders_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./request-builders.js */ "xsXS");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "body", function() { return _request_builders_js__WEBPACK_IMPORTED_MODULE_8__["body"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "headers", function() { return _request_builders_js__WEBPACK_IMPORTED_MODULE_8__["headers"]; });

/* harmony import */ var _invokable_extensions_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./invokable-extensions.js */ "01TU");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "extendGlobal", function() { return _invokable_extensions_js__WEBPACK_IMPORTED_MODULE_9__["extendGlobal"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "extendObj", function() { return _invokable_extensions_js__WEBPACK_IMPORTED_MODULE_9__["extendObj"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "extendFactory", function() { return _invokable_extensions_js__WEBPACK_IMPORTED_MODULE_9__["extendFactory"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "clearGlobalExtensions", function() { return _invokable_extensions_js__WEBPACK_IMPORTED_MODULE_9__["clearGlobalExtensions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "enableExtensions", function() { return _invokable_extensions_js__WEBPACK_IMPORTED_MODULE_9__["enableExtensions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "disableExtensions", function() { return _invokable_extensions_js__WEBPACK_IMPORTED_MODULE_9__["disableExtensions"]; });











//# sourceMappingURL=index.js.map

/***/ }),

/***/ "xbXq":
/*!********************************************!*\
  !*** ./node_modules/@pnp/odata/parsers.js ***!
  \********************************************/
/*! exports provided: ODataParser, TextParser, BlobParser, JSONParser, BufferParser, LambdaParser, HttpRequestError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ODataParser", function() { return ODataParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextParser", function() { return TextParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlobParser", function() { return BlobParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JSONParser", function() { return JSONParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BufferParser", function() { return BufferParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LambdaParser", function() { return LambdaParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpRequestError", function() { return HttpRequestError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "t3D1");
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/common */ "zqEK");


var ODataParser = /** @class */ (function () {
    function ODataParser() {
    }
    ODataParser.prototype.parse = function (r) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.handleError(r, reject)) {
                _this.parseImpl(r, resolve, reject);
            }
        });
    };
    ODataParser.prototype.parseImpl = function (r, resolve, reject) {
        var _this = this;
        if ((r.headers.has("Content-Length") && parseFloat(r.headers.get("Content-Length")) === 0) || r.status === 204) {
            resolve({});
        }
        else {
            // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
            r.text()
                .then(function (txt) { return txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {}; })
                .then(function (json) { return resolve(_this.parseODataJSON(json)); })
                .catch(function (e) { return reject(e); });
        }
    };
    /**
     * Handles a response with ok === false by parsing the body and creating a ProcessHttpClientResponseException
     * which is passed to the reject delegate. This method returns true if there is no error, otherwise false
     *
     * @param r Current response object
     * @param reject reject delegate for the surrounding promise
     */
    ODataParser.prototype.handleError = function (r, reject) {
        if (!r.ok) {
            HttpRequestError.init(r).then(reject);
        }
        return r.ok;
    };
    /**
     * Normalizes the json response by removing the various nested levels
     *
     * @param json json object to parse
     */
    ODataParser.prototype.parseODataJSON = function (json) {
        var result = json;
        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(json, "d")) {
            if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(json.d, "results")) {
                result = json.d.results;
            }
            else {
                result = json.d;
            }
        }
        else if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["hOP"])(json, "value")) {
            result = json.value;
        }
        return result;
    };
    return ODataParser;
}());

var TextParser = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(TextParser, _super);
    function TextParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextParser.prototype.parseImpl = function (r, resolve) {
        r.text().then(resolve);
    };
    return TextParser;
}(ODataParser));

var BlobParser = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(BlobParser, _super);
    function BlobParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlobParser.prototype.parseImpl = function (r, resolve) {
        r.blob().then(resolve);
    };
    return BlobParser;
}(ODataParser));

var JSONParser = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(JSONParser, _super);
    function JSONParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONParser.prototype.parseImpl = function (r, resolve) {
        r.json().then(resolve);
    };
    return JSONParser;
}(ODataParser));

var BufferParser = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(BufferParser, _super);
    function BufferParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BufferParser.prototype.parseImpl = function (r, resolve) {
        if (Object(_pnp_common__WEBPACK_IMPORTED_MODULE_1__["isFunc"])(r.arrayBuffer)) {
            r.arrayBuffer().then(resolve);
        }
        else {
            r.buffer().then(resolve);
        }
    };
    return BufferParser;
}(ODataParser));

var LambdaParser = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(LambdaParser, _super);
    function LambdaParser(parser) {
        var _this = _super.call(this) || this;
        _this.parser = parser;
        return _this;
    }
    LambdaParser.prototype.parseImpl = function (r, resolve) {
        this.parser(r).then(resolve);
    };
    return LambdaParser;
}(ODataParser));

var HttpRequestError = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(HttpRequestError, _super);
    function HttpRequestError(message, response, status, statusText) {
        if (status === void 0) { status = response.status; }
        if (statusText === void 0) { statusText = response.statusText; }
        var _this = _super.call(this, message) || this;
        _this.response = response;
        _this.status = status;
        _this.statusText = statusText;
        _this.isHttpRequestError = true;
        return _this;
    }
    HttpRequestError.init = function (r) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var t;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, r.clone().text()];
                    case 1:
                        t = _a.sent();
                        return [2 /*return*/, new HttpRequestError("Error making HttpClient request in queryable [" + r.status + "] " + r.statusText + " ::> " + t, r.clone())];
                }
            });
        });
    };
    return HttpRequestError;
}(Error));

//# sourceMappingURL=parsers.js.map

/***/ }),

/***/ "xsXS":
/*!*****************************************************!*\
  !*** ./node_modules/@pnp/odata/request-builders.js ***!
  \*****************************************************/
/*! exports provided: body, headers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "body", function() { return body; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "headers", function() { return headers; });
/* harmony import */ var _pnp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/common */ "zqEK");

function body(o, previous) {
    return Object.assign({ body: Object(_pnp_common__WEBPACK_IMPORTED_MODULE_0__["jsS"])(o) }, previous);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function headers(o, previous) {
    return Object.assign({ headers: o }, previous);
}
//# sourceMappingURL=request-builders.js.map

/***/ }),

/***/ "y3hc":
/*!***************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/graph/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var graphqueryable_1 = __webpack_require__(/*! ./graphqueryable */ "LGj0");
exports.GraphQueryable = graphqueryable_1.GraphQueryable;
exports.GraphQueryableCollection = graphqueryable_1.GraphQueryableCollection;
exports.GraphQueryableInstance = graphqueryable_1.GraphQueryableInstance;
exports.GraphQueryableSearchableCollection = graphqueryable_1.GraphQueryableSearchableCollection;


/***/ }),

/***/ "yLpj":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "z067":
/*!************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/metadata.js ***!
  \************************************************/
/*! exports provided: metadata */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "metadata", function() { return metadata; });
function metadata(type) {
    return {
        "__metadata": { "type": type },
    };
}
//# sourceMappingURL=metadata.js.map

/***/ }),

/***/ "z9XP":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/types.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Determines the display mode of the given control or view
 */
var ControlMode;
(function (ControlMode) {
    ControlMode[ControlMode["Display"] = 1] = "Display";
    ControlMode[ControlMode["Edit"] = 2] = "Edit";
    ControlMode[ControlMode["New"] = 3] = "New";
})(ControlMode = exports.ControlMode || (exports.ControlMode = {}));
/**
 * Specifies the type of the field.
 */
var FieldTypes;
(function (FieldTypes) {
    FieldTypes[FieldTypes["Invalid"] = 0] = "Invalid";
    FieldTypes[FieldTypes["Integer"] = 1] = "Integer";
    FieldTypes[FieldTypes["Text"] = 2] = "Text";
    FieldTypes[FieldTypes["Note"] = 3] = "Note";
    FieldTypes[FieldTypes["DateTime"] = 4] = "DateTime";
    FieldTypes[FieldTypes["Counter"] = 5] = "Counter";
    FieldTypes[FieldTypes["Choice"] = 6] = "Choice";
    FieldTypes[FieldTypes["Lookup"] = 7] = "Lookup";
    FieldTypes[FieldTypes["Boolean"] = 8] = "Boolean";
    FieldTypes[FieldTypes["Number"] = 9] = "Number";
    FieldTypes[FieldTypes["Currency"] = 10] = "Currency";
    FieldTypes[FieldTypes["URL"] = 11] = "URL";
    FieldTypes[FieldTypes["Computed"] = 12] = "Computed";
    FieldTypes[FieldTypes["Threading"] = 13] = "Threading";
    FieldTypes[FieldTypes["Guid"] = 14] = "Guid";
    FieldTypes[FieldTypes["MultiChoice"] = 15] = "MultiChoice";
    FieldTypes[FieldTypes["GridChoice"] = 16] = "GridChoice";
    FieldTypes[FieldTypes["Calculated"] = 17] = "Calculated";
    FieldTypes[FieldTypes["File"] = 18] = "File";
    FieldTypes[FieldTypes["Attachments"] = 19] = "Attachments";
    FieldTypes[FieldTypes["User"] = 20] = "User";
    FieldTypes[FieldTypes["Recurrence"] = 21] = "Recurrence";
    FieldTypes[FieldTypes["CrossProjectLink"] = 22] = "CrossProjectLink";
    FieldTypes[FieldTypes["ModStat"] = 23] = "ModStat";
    FieldTypes[FieldTypes["Error"] = 24] = "Error";
    FieldTypes[FieldTypes["ContentTypeId"] = 25] = "ContentTypeId";
    FieldTypes[FieldTypes["PageSeparator"] = 26] = "PageSeparator";
    FieldTypes[FieldTypes["ThreadIndex"] = 27] = "ThreadIndex";
    FieldTypes[FieldTypes["WorkflowStatus"] = 28] = "WorkflowStatus";
    FieldTypes[FieldTypes["AllDayEvent"] = 29] = "AllDayEvent";
    FieldTypes[FieldTypes["WorkflowEventType"] = 30] = "WorkflowEventType";
})(FieldTypes = exports.FieldTypes || (exports.FieldTypes = {}));
var DateTimeFieldFormatType;
(function (DateTimeFieldFormatType) {
    DateTimeFieldFormatType[DateTimeFieldFormatType["DateOnly"] = 0] = "DateOnly";
    DateTimeFieldFormatType[DateTimeFieldFormatType["DateTime"] = 1] = "DateTime";
})(DateTimeFieldFormatType = exports.DateTimeFieldFormatType || (exports.DateTimeFieldFormatType = {}));
/**
 * Specifies the control settings while adding a field.
 */
var AddFieldOptions;
(function (AddFieldOptions) {
    /**
     *  Specify that a new field added to the list must also be added to the default content type in the site collection
     */
    AddFieldOptions[AddFieldOptions["DefaultValue"] = 0] = "DefaultValue";
    /**
     * Specify that a new field added to the list must also be added to the default content type in the site collection.
     */
    AddFieldOptions[AddFieldOptions["AddToDefaultContentType"] = 1] = "AddToDefaultContentType";
    /**
     * Specify that a new field must not be added to any other content type
     */
    AddFieldOptions[AddFieldOptions["AddToNoContentType"] = 2] = "AddToNoContentType";
    /**
     *  Specify that a new field that is added to the specified list must also be added to all content types in the site collection
     */
    AddFieldOptions[AddFieldOptions["AddToAllContentTypes"] = 4] = "AddToAllContentTypes";
    /**
     * Specify adding an internal field name hint for the purpose of avoiding possible database locking or field renaming operations
     */
    AddFieldOptions[AddFieldOptions["AddFieldInternalNameHint"] = 8] = "AddFieldInternalNameHint";
    /**
     * Specify that a new field that is added to the specified list must also be added to the default list view
     */
    AddFieldOptions[AddFieldOptions["AddFieldToDefaultView"] = 16] = "AddFieldToDefaultView";
    /**
     * Specify to confirm that no other field has the same display name
     */
    AddFieldOptions[AddFieldOptions["AddFieldCheckDisplayName"] = 32] = "AddFieldCheckDisplayName";
})(AddFieldOptions = exports.AddFieldOptions || (exports.AddFieldOptions = {}));
var CalendarType;
(function (CalendarType) {
    CalendarType[CalendarType["Gregorian"] = 1] = "Gregorian";
    CalendarType[CalendarType["Japan"] = 3] = "Japan";
    CalendarType[CalendarType["Taiwan"] = 4] = "Taiwan";
    CalendarType[CalendarType["Korea"] = 5] = "Korea";
    CalendarType[CalendarType["Hijri"] = 6] = "Hijri";
    CalendarType[CalendarType["Thai"] = 7] = "Thai";
    CalendarType[CalendarType["Hebrew"] = 8] = "Hebrew";
    CalendarType[CalendarType["GregorianMEFrench"] = 9] = "GregorianMEFrench";
    CalendarType[CalendarType["GregorianArabic"] = 10] = "GregorianArabic";
    CalendarType[CalendarType["GregorianXLITEnglish"] = 11] = "GregorianXLITEnglish";
    CalendarType[CalendarType["GregorianXLITFrench"] = 12] = "GregorianXLITFrench";
    CalendarType[CalendarType["KoreaJapanLunar"] = 14] = "KoreaJapanLunar";
    CalendarType[CalendarType["ChineseLunar"] = 15] = "ChineseLunar";
    CalendarType[CalendarType["SakaEra"] = 16] = "SakaEra";
    CalendarType[CalendarType["UmAlQura"] = 23] = "UmAlQura";
})(CalendarType = exports.CalendarType || (exports.CalendarType = {}));
var UrlFieldFormatType;
(function (UrlFieldFormatType) {
    UrlFieldFormatType[UrlFieldFormatType["Hyperlink"] = 0] = "Hyperlink";
    UrlFieldFormatType[UrlFieldFormatType["Image"] = 1] = "Image";
})(UrlFieldFormatType = exports.UrlFieldFormatType || (exports.UrlFieldFormatType = {}));
var ChoiceFieldFormatType;
(function (ChoiceFieldFormatType) {
    ChoiceFieldFormatType[ChoiceFieldFormatType["Dropdown"] = 0] = "Dropdown";
    ChoiceFieldFormatType[ChoiceFieldFormatType["RadioButtons"] = 1] = "RadioButtons";
})(ChoiceFieldFormatType = exports.ChoiceFieldFormatType || (exports.ChoiceFieldFormatType = {}));
var PermissionKind;
(function (PermissionKind) {
    /**
     * Has no permissions on the Site. Not available through the user interface.
     */
    PermissionKind[PermissionKind["EmptyMask"] = 0] = "EmptyMask";
    /**
     * View items in lists, documents in document libraries, and Web discussion comments.
     */
    PermissionKind[PermissionKind["ViewListItems"] = 1] = "ViewListItems";
    /**
     * Add items to lists, documents to document libraries, and Web discussion comments.
     */
    PermissionKind[PermissionKind["AddListItems"] = 2] = "AddListItems";
    /**
     * Edit items in lists, edit documents in document libraries, edit Web discussion comments
     * in documents, and customize Web Part Pages in document libraries.
     */
    PermissionKind[PermissionKind["EditListItems"] = 3] = "EditListItems";
    /**
     * Delete items from a list, documents from a document library, and Web discussion
     * comments in documents.
     */
    PermissionKind[PermissionKind["DeleteListItems"] = 4] = "DeleteListItems";
    /**
     * Approve a minor version of a list item or document.
     */
    PermissionKind[PermissionKind["ApproveItems"] = 5] = "ApproveItems";
    /**
     * View the source of documents with server-side file handlers.
     */
    PermissionKind[PermissionKind["OpenItems"] = 6] = "OpenItems";
    /**
     * View past versions of a list item or document.
     */
    PermissionKind[PermissionKind["ViewVersions"] = 7] = "ViewVersions";
    /**
     * Delete past versions of a list item or document.
     */
    PermissionKind[PermissionKind["DeleteVersions"] = 8] = "DeleteVersions";
    /**
     * Discard or check in a document which is checked out to another user.
     */
    PermissionKind[PermissionKind["CancelCheckout"] = 9] = "CancelCheckout";
    /**
     * Create, change, and delete personal views of lists.
     */
    PermissionKind[PermissionKind["ManagePersonalViews"] = 10] = "ManagePersonalViews";
    /**
     * Create and delete lists, add or remove columns in a list, and add or remove public views of a list.
     */
    PermissionKind[PermissionKind["ManageLists"] = 12] = "ManageLists";
    /**
     * View forms, views, and application pages, and enumerate lists.
     */
    PermissionKind[PermissionKind["ViewFormPages"] = 13] = "ViewFormPages";
    /**
     * Make content of a list or document library retrieveable for anonymous users through SharePoint search.
     * The list permissions in the site do not change.
     */
    PermissionKind[PermissionKind["AnonymousSearchAccessList"] = 14] = "AnonymousSearchAccessList";
    /**
     * Allow users to open a Site, list, or folder to access items inside that container.
     */
    PermissionKind[PermissionKind["Open"] = 17] = "Open";
    /**
     * View pages in a Site.
     */
    PermissionKind[PermissionKind["ViewPages"] = 18] = "ViewPages";
    /**
     * Add, change, or delete HTML pages or Web Part Pages, and edit the Site using
     * a Windows SharePoint Services compatible editor.
     */
    PermissionKind[PermissionKind["AddAndCustomizePages"] = 19] = "AddAndCustomizePages";
    /**
     * Apply a theme or borders to the entire Site.
     */
    PermissionKind[PermissionKind["ApplyThemeAndBorder"] = 20] = "ApplyThemeAndBorder";
    /**
     * Apply a style sheet (.css file) to the Site.
     */
    PermissionKind[PermissionKind["ApplyStyleSheets"] = 21] = "ApplyStyleSheets";
    /**
     * View reports on Site usage.
     */
    PermissionKind[PermissionKind["ViewUsageData"] = 22] = "ViewUsageData";
    /**
     * Create a Site using Self-Service Site Creation.
     */
    PermissionKind[PermissionKind["CreateSSCSite"] = 23] = "CreateSSCSite";
    /**
     * Create subsites such as team sites, Meeting Workspace sites, and Document Workspace sites.
     */
    PermissionKind[PermissionKind["ManageSubwebs"] = 24] = "ManageSubwebs";
    /**
     * Create a group of users that can be used anywhere within the site collection.
     */
    PermissionKind[PermissionKind["CreateGroups"] = 25] = "CreateGroups";
    /**
     * Create and change permission levels on the Site and assign permissions to users
     * and groups.
     */
    PermissionKind[PermissionKind["ManagePermissions"] = 26] = "ManagePermissions";
    /**
     * Enumerate files and folders in a Site using Microsoft Office SharePoint Designer
     * and WebDAV interfaces.
     */
    PermissionKind[PermissionKind["BrowseDirectories"] = 27] = "BrowseDirectories";
    /**
     * View information about users of the Site.
     */
    PermissionKind[PermissionKind["BrowseUserInfo"] = 28] = "BrowseUserInfo";
    /**
     * Add or remove personal Web Parts on a Web Part Page.
     */
    PermissionKind[PermissionKind["AddDelPrivateWebParts"] = 29] = "AddDelPrivateWebParts";
    /**
     * Update Web Parts to display personalized information.
     */
    PermissionKind[PermissionKind["UpdatePersonalWebParts"] = 30] = "UpdatePersonalWebParts";
    /**
     * Grant the ability to perform all administration tasks for the Site as well as
     * manage content, activate, deactivate, or edit properties of Site scoped Features
     * through the object model or through the user interface (UI). When granted on the
     * root Site of a Site Collection, activate, deactivate, or edit properties of
     * site collection scoped Features through the object model. To browse to the Site
     * Collection Features page and activate or deactivate Site Collection scoped Features
     * through the UI, you must be a Site Collection administrator.
     */
    PermissionKind[PermissionKind["ManageWeb"] = 31] = "ManageWeb";
    /**
     * Content of lists and document libraries in the Web site will be retrieveable for anonymous users through
     * SharePoint search if the list or document library has AnonymousSearchAccessList set.
     */
    PermissionKind[PermissionKind["AnonymousSearchAccessWebLists"] = 32] = "AnonymousSearchAccessWebLists";
    /**
     * Use features that launch client applications. Otherwise, users must work on documents
     * locally and upload changes.
     */
    PermissionKind[PermissionKind["UseClientIntegration"] = 37] = "UseClientIntegration";
    /**
     * Use SOAP, WebDAV, or Microsoft Office SharePoint Designer interfaces to access the Site.
     */
    PermissionKind[PermissionKind["UseRemoteAPIs"] = 38] = "UseRemoteAPIs";
    /**
     * Manage alerts for all users of the Site.
     */
    PermissionKind[PermissionKind["ManageAlerts"] = 39] = "ManageAlerts";
    /**
     * Create e-mail alerts.
     */
    PermissionKind[PermissionKind["CreateAlerts"] = 40] = "CreateAlerts";
    /**
     * Allows a user to change his or her user information, such as adding a picture.
     */
    PermissionKind[PermissionKind["EditMyUserInfo"] = 41] = "EditMyUserInfo";
    /**
     * Enumerate permissions on Site, list, folder, document, or list item.
     */
    PermissionKind[PermissionKind["EnumeratePermissions"] = 63] = "EnumeratePermissions";
    /**
     * Has all permissions on the Site. Not available through the user interface.
     */
    PermissionKind[PermissionKind["FullMask"] = 65] = "FullMask";
})(PermissionKind = exports.PermissionKind || (exports.PermissionKind = {}));
/* tslint:enable:no-bitwise */
var RoleType;
(function (RoleType) {
    RoleType[RoleType["None"] = 0] = "None";
    RoleType[RoleType["Guest"] = 1] = "Guest";
    RoleType[RoleType["Reader"] = 2] = "Reader";
    RoleType[RoleType["Contributor"] = 3] = "Contributor";
    RoleType[RoleType["WebDesigner"] = 4] = "WebDesigner";
    RoleType[RoleType["Administrator"] = 5] = "Administrator";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
var PageType;
(function (PageType) {
    PageType[PageType["Invalid"] = -1] = "Invalid";
    PageType[PageType["DefaultView"] = 0] = "DefaultView";
    PageType[PageType["NormalView"] = 1] = "NormalView";
    PageType[PageType["DialogView"] = 2] = "DialogView";
    PageType[PageType["View"] = 3] = "View";
    PageType[PageType["DisplayForm"] = 4] = "DisplayForm";
    PageType[PageType["DisplayFormDialog"] = 5] = "DisplayFormDialog";
    PageType[PageType["EditForm"] = 6] = "EditForm";
    PageType[PageType["EditFormDialog"] = 7] = "EditFormDialog";
    PageType[PageType["NewForm"] = 8] = "NewForm";
    PageType[PageType["NewFormDialog"] = 9] = "NewFormDialog";
    PageType[PageType["SolutionForm"] = 10] = "SolutionForm";
    PageType[PageType["PAGE_MAXITEMS"] = 11] = "PAGE_MAXITEMS";
})(PageType = exports.PageType || (exports.PageType = {}));
var SharingLinkKind;
(function (SharingLinkKind) {
    /**
     * Uninitialized link
     */
    SharingLinkKind[SharingLinkKind["Uninitialized"] = 0] = "Uninitialized";
    /**
     * Direct link to the object being shared
     */
    SharingLinkKind[SharingLinkKind["Direct"] = 1] = "Direct";
    /**
     * Organization-shareable link to the object being shared with view permissions
     */
    SharingLinkKind[SharingLinkKind["OrganizationView"] = 2] = "OrganizationView";
    /**
     * Organization-shareable link to the object being shared with edit permissions
     */
    SharingLinkKind[SharingLinkKind["OrganizationEdit"] = 3] = "OrganizationEdit";
    /**
     * View only anonymous link
     */
    SharingLinkKind[SharingLinkKind["AnonymousView"] = 4] = "AnonymousView";
    /**
     * Read/Write anonymous link
     */
    SharingLinkKind[SharingLinkKind["AnonymousEdit"] = 5] = "AnonymousEdit";
    /**
     * Flexible sharing Link where properties can change without affecting link URL
     */
    SharingLinkKind[SharingLinkKind["Flexible"] = 6] = "Flexible";
})(SharingLinkKind = exports.SharingLinkKind || (exports.SharingLinkKind = {}));
/**
 * Indicates the role of the sharing link
 */
var SharingRole;
(function (SharingRole) {
    SharingRole[SharingRole["None"] = 0] = "None";
    SharingRole[SharingRole["View"] = 1] = "View";
    SharingRole[SharingRole["Edit"] = 2] = "Edit";
    SharingRole[SharingRole["Owner"] = 3] = "Owner";
})(SharingRole = exports.SharingRole || (exports.SharingRole = {}));
var SharingOperationStatusCode;
(function (SharingOperationStatusCode) {
    /**
     * The share operation completed without errors.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["CompletedSuccessfully"] = 0] = "CompletedSuccessfully";
    /**
     * The share operation completed and generated requests for access.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["AccessRequestsQueued"] = 1] = "AccessRequestsQueued";
    /**
     * The share operation failed as there were no resolved users.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["NoResolvedUsers"] = -1] = "NoResolvedUsers";
    /**
     * The share operation failed due to insufficient permissions.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["AccessDenied"] = -2] = "AccessDenied";
    /**
     * The share operation failed when attempting a cross site share, which is not supported.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["CrossSiteRequestNotSupported"] = -3] = "CrossSiteRequestNotSupported";
    /**
     * The sharing operation failed due to an unknown error.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["UnknowError"] = -4] = "UnknowError";
    /**
     * The text you typed is too long. Please shorten it.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["EmailBodyTooLong"] = -5] = "EmailBodyTooLong";
    /**
     * The maximum number of unique scopes in the list has been exceeded.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["ListUniqueScopesExceeded"] = -6] = "ListUniqueScopesExceeded";
    /**
     * The share operation failed because a sharing capability is disabled in the site.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["CapabilityDisabled"] = -7] = "CapabilityDisabled";
    /**
     * The specified object for the share operation is not supported.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["ObjectNotSupported"] = -8] = "ObjectNotSupported";
    /**
     * A SharePoint group cannot contain another SharePoint group.
     */
    SharingOperationStatusCode[SharingOperationStatusCode["NestedGroupsNotSupported"] = -9] = "NestedGroupsNotSupported";
})(SharingOperationStatusCode = exports.SharingOperationStatusCode || (exports.SharingOperationStatusCode = {}));
var SPSharedObjectType;
(function (SPSharedObjectType) {
    SPSharedObjectType[SPSharedObjectType["Unknown"] = 0] = "Unknown";
    SPSharedObjectType[SPSharedObjectType["File"] = 1] = "File";
    SPSharedObjectType[SPSharedObjectType["Folder"] = 2] = "Folder";
    SPSharedObjectType[SPSharedObjectType["Item"] = 3] = "Item";
    SPSharedObjectType[SPSharedObjectType["List"] = 4] = "List";
    SPSharedObjectType[SPSharedObjectType["Web"] = 5] = "Web";
    SPSharedObjectType[SPSharedObjectType["Max"] = 6] = "Max";
})(SPSharedObjectType = exports.SPSharedObjectType || (exports.SPSharedObjectType = {}));
var SharingDomainRestrictionMode;
(function (SharingDomainRestrictionMode) {
    SharingDomainRestrictionMode[SharingDomainRestrictionMode["None"] = 0] = "None";
    SharingDomainRestrictionMode[SharingDomainRestrictionMode["AllowList"] = 1] = "AllowList";
    SharingDomainRestrictionMode[SharingDomainRestrictionMode["BlockList"] = 2] = "BlockList";
})(SharingDomainRestrictionMode = exports.SharingDomainRestrictionMode || (exports.SharingDomainRestrictionMode = {}));
var RenderListDataOptions;
(function (RenderListDataOptions) {
    RenderListDataOptions[RenderListDataOptions["None"] = 0] = "None";
    RenderListDataOptions[RenderListDataOptions["ContextInfo"] = 1] = "ContextInfo";
    RenderListDataOptions[RenderListDataOptions["ListData"] = 2] = "ListData";
    RenderListDataOptions[RenderListDataOptions["ListSchema"] = 4] = "ListSchema";
    RenderListDataOptions[RenderListDataOptions["MenuView"] = 8] = "MenuView";
    RenderListDataOptions[RenderListDataOptions["ListContentType"] = 16] = "ListContentType";
    RenderListDataOptions[RenderListDataOptions["FileSystemItemId"] = 32] = "FileSystemItemId";
    RenderListDataOptions[RenderListDataOptions["ClientFormSchema"] = 64] = "ClientFormSchema";
    RenderListDataOptions[RenderListDataOptions["QuickLaunch"] = 128] = "QuickLaunch";
    RenderListDataOptions[RenderListDataOptions["Spotlight"] = 256] = "Spotlight";
    RenderListDataOptions[RenderListDataOptions["Visualization"] = 512] = "Visualization";
    RenderListDataOptions[RenderListDataOptions["ViewMetadata"] = 1024] = "ViewMetadata";
    RenderListDataOptions[RenderListDataOptions["DisableAutoHyperlink"] = 2048] = "DisableAutoHyperlink";
    RenderListDataOptions[RenderListDataOptions["EnableMediaTAUrls"] = 4096] = "EnableMediaTAUrls";
    RenderListDataOptions[RenderListDataOptions["ParentInfo"] = 8192] = "ParentInfo";
    RenderListDataOptions[RenderListDataOptions["PageContextInfo"] = 16384] = "PageContextInfo";
    RenderListDataOptions[RenderListDataOptions["ClientSideComponentManifest"] = 32768] = "ClientSideComponentManifest";
})(RenderListDataOptions = exports.RenderListDataOptions || (exports.RenderListDataOptions = {}));
var FieldUserSelectionMode;
(function (FieldUserSelectionMode) {
    FieldUserSelectionMode[FieldUserSelectionMode["PeopleAndGroups"] = 1] = "PeopleAndGroups";
    FieldUserSelectionMode[FieldUserSelectionMode["PeopleOnly"] = 0] = "PeopleOnly";
})(FieldUserSelectionMode = exports.FieldUserSelectionMode || (exports.FieldUserSelectionMode = {}));


/***/ }),

/***/ "zqEK":
/*!*******************************************!*\
  !*** ./node_modules/@pnp/common/index.js ***!
  \*******************************************/
/*! exports provided: objectToMap, mergeMaps, setup, onRuntimeCreate, Runtime, DefaultRuntime, mergeHeaders, mergeOptions, getADALResource, FetchClient, BearerTokenFetchClient, LambdaFetchClient, SPFxAdalClient, PnPClientStorageWrapper, PnPClientStorage, getCtxCallback, dateAdd, combine, getRandomString, getGUID, isFunc, objectDefinedNotNull, isArray, assign, isUrlAbsolute, stringIsNullOrEmpty, sanitizeGuid, jsS, hOP, getHashCode, safeGlobal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _collections_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collections.js */ "eVhm");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "objectToMap", function() { return _collections_js__WEBPACK_IMPORTED_MODULE_0__["objectToMap"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeMaps", function() { return _collections_js__WEBPACK_IMPORTED_MODULE_0__["mergeMaps"]; });

/* harmony import */ var _libconfig_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./libconfig.js */ "hyGn");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setup", function() { return _libconfig_js__WEBPACK_IMPORTED_MODULE_1__["setup"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onRuntimeCreate", function() { return _libconfig_js__WEBPACK_IMPORTED_MODULE_1__["onRuntimeCreate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Runtime", function() { return _libconfig_js__WEBPACK_IMPORTED_MODULE_1__["Runtime"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DefaultRuntime", function() { return _libconfig_js__WEBPACK_IMPORTED_MODULE_1__["DefaultRuntime"]; });

/* harmony import */ var _net_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./net.js */ "UxNQ");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeHeaders", function() { return _net_js__WEBPACK_IMPORTED_MODULE_2__["mergeHeaders"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeOptions", function() { return _net_js__WEBPACK_IMPORTED_MODULE_2__["mergeOptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getADALResource", function() { return _net_js__WEBPACK_IMPORTED_MODULE_2__["getADALResource"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FetchClient", function() { return _net_js__WEBPACK_IMPORTED_MODULE_2__["FetchClient"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BearerTokenFetchClient", function() { return _net_js__WEBPACK_IMPORTED_MODULE_2__["BearerTokenFetchClient"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LambdaFetchClient", function() { return _net_js__WEBPACK_IMPORTED_MODULE_2__["LambdaFetchClient"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SPFxAdalClient", function() { return _net_js__WEBPACK_IMPORTED_MODULE_2__["SPFxAdalClient"]; });

/* harmony import */ var _spfxcontextinterface_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./spfxcontextinterface.js */ "fgBf");
/* empty/unused harmony star reexport *//* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./storage.js */ "9TEK");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PnPClientStorageWrapper", function() { return _storage_js__WEBPACK_IMPORTED_MODULE_4__["PnPClientStorageWrapper"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PnPClientStorage", function() { return _storage_js__WEBPACK_IMPORTED_MODULE_4__["PnPClientStorage"]; });

/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util.js */ "97IE");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCtxCallback", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["getCtxCallback"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dateAdd", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["dateAdd"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "combine", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["combine"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRandomString", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["getRandomString"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getGUID", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["getGUID"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isFunc", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["isFunc"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "objectDefinedNotNull", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["objectDefinedNotNull"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["isArray"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["assign"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isUrlAbsolute", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["isUrlAbsolute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "stringIsNullOrEmpty", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["stringIsNullOrEmpty"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sanitizeGuid", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["sanitizeGuid"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "jsS", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["jsS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hOP", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["hOP"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getHashCode", function() { return _util_js__WEBPACK_IMPORTED_MODULE_5__["getHashCode"]; });

/* harmony import */ var _safe_global_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./safe-global.js */ "08ZC");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "safeGlobal", function() { return _safe_global_js__WEBPACK_IMPORTED_MODULE_6__["safeGlobal"]; });








//# sourceMappingURL=index.js.map

/***/ }),

/***/ "zvTx":
/*!********************************************************!*\
  !*** ./node_modules/sp-pnp-js/lib/sharepoint/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var appcatalog_1 = __webpack_require__(/*! ./appcatalog */ "P6J3");
exports.AppCatalog = appcatalog_1.AppCatalog;
exports.App = appcatalog_1.App;
__export(__webpack_require__(/*! ./clientsidepages */ "YJnM"));
var batch_1 = __webpack_require__(/*! ./batch */ "PbI0");
exports.ODataBatch = batch_1.ODataBatch;
var fields_1 = __webpack_require__(/*! ./fields */ "TT1A");
exports.Field = fields_1.Field;
exports.Fields = fields_1.Fields;
var files_1 = __webpack_require__(/*! ./files */ "MMX7");
exports.CheckinType = files_1.CheckinType;
exports.WebPartsPersonalizationScope = files_1.WebPartsPersonalizationScope;
exports.MoveOperations = files_1.MoveOperations;
exports.TemplateFileType = files_1.TemplateFileType;
exports.File = files_1.File;
exports.Files = files_1.Files;
var folders_1 = __webpack_require__(/*! ./folders */ "q1dm");
exports.Folder = folders_1.Folder;
exports.Folders = folders_1.Folders;
var items_1 = __webpack_require__(/*! ./items */ "/pGJ");
exports.Item = items_1.Item;
exports.Items = items_1.Items;
exports.ItemVersion = items_1.ItemVersion;
exports.ItemVersions = items_1.ItemVersions;
exports.PagedItemCollection = items_1.PagedItemCollection;
var navigation_1 = __webpack_require__(/*! ./navigation */ "/1ZT");
exports.NavigationNodes = navigation_1.NavigationNodes;
exports.NavigationNode = navigation_1.NavigationNode;
var lists_1 = __webpack_require__(/*! ./lists */ "FFhP");
exports.List = lists_1.List;
exports.Lists = lists_1.Lists;
var odata_1 = __webpack_require__(/*! ./odata */ "r/M4");
exports.spExtractODataId = odata_1.spExtractODataId;
exports.spODataEntity = odata_1.spODataEntity;
exports.spODataEntityArray = odata_1.spODataEntityArray;
var sharepointqueryable_1 = __webpack_require__(/*! ./sharepointqueryable */ "4bZL");
exports.SharePointQueryable = sharepointqueryable_1.SharePointQueryable;
exports.SharePointQueryableInstance = sharepointqueryable_1.SharePointQueryableInstance;
exports.SharePointQueryableCollection = sharepointqueryable_1.SharePointQueryableCollection;
var roles_1 = __webpack_require__(/*! ./roles */ "t5HP");
exports.RoleDefinitionBindings = roles_1.RoleDefinitionBindings;
var search_1 = __webpack_require__(/*! ./search */ "vy67");
exports.Search = search_1.Search;
exports.SearchQueryBuilder = search_1.SearchQueryBuilder;
exports.SearchResults = search_1.SearchResults;
exports.SortDirection = search_1.SortDirection;
exports.ReorderingRuleMatchType = search_1.ReorderingRuleMatchType;
exports.QueryPropertyValueType = search_1.QueryPropertyValueType;
exports.SearchBuiltInSourceId = search_1.SearchBuiltInSourceId;
var searchsuggest_1 = __webpack_require__(/*! ./searchsuggest */ "i8K7");
exports.SearchSuggest = searchsuggest_1.SearchSuggest;
exports.SearchSuggestResult = searchsuggest_1.SearchSuggestResult;
var site_1 = __webpack_require__(/*! ./site */ "Dems");
exports.Site = site_1.Site;
__export(__webpack_require__(/*! ./social */ "rUwr"));
__export(__webpack_require__(/*! ./types */ "z9XP"));
var utilities_1 = __webpack_require__(/*! ./utilities */ "Bqol");
exports.UtilityMethod = utilities_1.UtilityMethod;
var webparts_1 = __webpack_require__(/*! ./webparts */ "C3fl");
exports.WebPartDefinitions = webparts_1.WebPartDefinitions;
exports.WebPartDefinition = webparts_1.WebPartDefinition;
exports.WebPart = webparts_1.WebPart;
var webs_1 = __webpack_require__(/*! ./webs */ "U0SV");
exports.Web = webs_1.Web;


/***/ })

/******/ })});;
//# sourceMappingURL=crud-pnpjs-web-part.js.map