!function(a) {
    a.fn.combo = function(b) {
        if (0 == this.length)
            return this;
        var c, d = arguments;
        return this.each(function() {
            var e = a(this).data("_combo");
            if ("string" == typeof b) {
                if (!e)
                    return;
                "function" == typeof e[b] && (d = Array.prototype.slice.call(d, 1),
                c = e[b].apply(e, d))
            } else
                e || (e = new a.Combo(a(this),b),
                a(this).data("_combo", e))
        }
        ),
        void 0 === c ? this : c
    }
    ,
    a.fn.getCombo = function() {
        return a.Combo.getCombo(this)
    }
    ,
    a.Combo = function(b, c) {
        this.obj = b,
        this.opts = a.extend(!0, {}, a.Combo.defaults, c),
        this.dataOpt = this.opts.data,
        this._selectedIndex = -1,
        this.addQuery = !0,
        this._disabled = "undefined" != typeof this.opts.disabled ? !!this.opts.disabled : !!this.obj.attr("disabled"),
        a.extend(this, this.opts.callback),
        this._init()
    }
    ,
    a.Combo.getCombo = function(b) {
        if (b = a(b),
        0 != b.length) {
            if (1 == b.length)
                return b.data("_combo");
            if (b.length > 1) {
                var c = [];
                return b.each(function(b) {
                    c.push(a(this).data("_combo"))
                }
                ),
                c
            }
        }
    }
    ,
    a.Combo.prototype = {
        constructor: a.Combo,
        _init: function() {
            var a = this.opts;
            "select" == this.obj[0].tagName.toLowerCase() && (this.originSelect = this.obj,
            this.dataOpt = this._getDataFromSelect()),
            this._createCombo(),
            this.loadData(this.dataOpt, a.defaultSelected, a.defaultFlag),
            this._handleDisabled(this._disabled),
            this._bindEvent()
        },
        loadData: function(a, b, c) {
            this.xhr && this.xhr.abort(),
            this.empty(!1),
            this.dataOpt = a,
            this.mode = this._getRenderMode(),
            this.mode && ("local" == this.mode ? (this._formatData(),
            this._populateList(this.formattedData),
            this._setDefaultSelected(b, c)) : "remote" == this.mode && this._loadAjaxData(b, c))
        },
        activate: function() {
            this.focus || this.input.focus(),
            this.wrap.addClass(this.opts.activeCls),
            this.active = !0
        },
        _blur: function() {
            this.active && (this.collapse(),
            this.opts.editable && this.opts.forceSelection && (this.selectByText(this.input.val()),
            -1 == this._selectedIndex && this.input.val("")),
            this.wrap.removeClass(this.opts.activeCls),
            this.active = !1,
            "function" == typeof this.onBlur && this.onBlur())
        },
        blur: function() {
            this.focus && this.input.blur(),
            this._blur()
        },
        _bindEvent: function() {
            var b = this
              , c = this.opts
              , d = "." + c.listItemCls;
            b.list.on("click", d, function(d) {
                a(this).hasClass(c.selectedCls) || b.selectByItem(a(this)),
                b.collapse(),
                b.input.focus(),
                "function" == typeof c.callback.onListClick && c.callback.onListClick.call(b)
            }
            ).on("mouseover", d, function(b) {
                a(this).addClass(c.hoverCls).siblings().removeClass(c.hoverCls)
            }
            ).on("mouseleave", d, function(b) {
                a(this).removeClass(c.hoverCls)
            }
            ),
            b.input.on("focus", function(a) {
                b.wrap.addClass(c.activeCls),
                b.focus = !0,
                b.active = !0,
                "function" == typeof b.onFocus && b.onFocus()
            }
            ).on("blur", function(a) {
                b.focus = !1
            }
            ),
            c.editable ? b.input.on("click", function(a) {}
            ) : b.input.on("click", function(a) {
                b._onTriggerClick()
            }
            ),
            b.trigger && b.trigger.on("click", function(a) {
                b._onTriggerClick()
            }
            ),
            a(document).on("click", function(c) {
                var d = c.target || c.srcElement;
                0 == a(d).closest(b.wrap).length && 0 == a(d).closest(b.listWrap).length && b.blur()
            }
            ),
            this.listWrap.on("click", function(a) {
                a.stopPropagation()
            }
            ),
            a(window).on("resize", function() {
                b._setListPosition()
            }
            ),
            this._bindKeyEvent()
        },
        _bindKeyEvent: function() {
            var b = this
              , c = this.opts
              , d = {
                backSpace: 8,
                esc: 27,
                f7: 118,
                up: 38,
                down: 40,
                tab: 9,
                enter: 13,
                home: 36,
                end: 35,
                pageUp: 33,
                pageDown: 34,
                space: 32
            };
            this.input.on("keydown", function(e) {
                switch (e.keyCode) {
                case d.tab:
                    b._blur();
                    break;
                case d.down:
                case d.up:
                    if (b.isExpanded) {
                        var f = e.keyCode == d.down ? "next" : "prev";
                        b._setItemFocus(f)
                    } else
                        b._onTriggerClick();
                    e.preventDefault();
                    break;
                case d.enter:
                    if (b.queryDelay && window.clearTimeout(b.queryDelay),
                    b.isExpanded) {
                        var g = b.list.find("." + c.hoverCls);
                        g.length > 0 && b.selectByItem(g),
                        b.collapse()
                    } else {
                        var h = a.trim(b.input.val());
                        b.selectByText(h)
                    }
                    "function" == typeof c.callback.onEnter && c.callback.onEnter(e);
                    break;
                case d.home:
                case d.end:
                    if (b.isExpanded) {
                        var g = e.keyCode == d.home ? b.list.find("." + c.listItemCls).eq(0) : b.list.find("." + c.listItemCls).filter(":last");
                        b._scrollToItem(g),
                        e.preventDefault()
                    }
                    break;
                case d.pageUp:
                case d.pageDown:
                    if (b.isExpanded) {
                        var f = e.keyCode == d.pageUp ? "up" : "down";
                        b._scrollPage(f),
                        e.preventDefault()
                    }
                }
            }
            ).on("keyup", function(a) {
                if (c.editable) {
                    var e = a.which
                      , f = 8 == e || 9 == e || 13 == e || 27 == e || e >= 16 && 20 >= e || e >= 33 && 40 >= e || e >= 44 && 46 >= e || e >= 112 && 123 >= e || 144 == e || 145 == e
                      , g = b.input.val();
                    f && e != d.backSpace || b.doDelayQuery(g)
                }
            }
            ),
            a(document).on("keydown", function(a) {
                a.keyCode == d.esc && b.collapse()
            }
            )
        },
        distory: function() {},
        enable: function() {
            this._handleDisabled(!1)
        },
        disable: function(a) {
            a = "undefined" == typeof a ? !0 : !!a,
            this._handleDisabled(a)
        },
        _handleDisabled: function(a) {
            var b = this.opts;
            this._disabled = a,
            1 == a ? this.wrap.addClass(b.disabledCls) : this.wrap.removeClass(b.disabledCls),
            this.input.attr("disabled", a)
        },
        _createCombo: function() {
            var b, c, d, e = this.opts, f = parseInt(this.opts.width);
            this.originSelect && this.originSelect.hide(),
            "input" == this.obj[0].tagName.toLowerCase() ? this.input = this.obj : (c = this.obj.find("." + e.inputCls),
            this.input = c.length > 0 ? c : a('<input type="text" class="' + e.inputCls + '"/>')),
            this.input.attr({
                autocomplete: "off",
                readOnly: !e.editable
            }).css({
                cursor: e.editable ? "" : "default"
            }),
            d = a(this.obj).find("." + e.triggerCls),
            d.length > 0 ? this.trigger = d : e.trigger !== !1 && (this.trigger = a('<span class="' + e.triggerCls + '"></span>')),
            b = this.obj.hasClass(e.wrapCls) ? this.obj : this.obj.find("." + e.wrapCls),
            b.length > 0 ? this.wrap = b.append(this.input, this.trigger) : this.trigger && (this.wrap = a('<span class="' + e.wrapCls + '"></span>').append(this.input, this.trigger),
            this.originSelect && this.obj[0] == this.originSelect[0] || this.obj[0] == this.input[0] ? this.obj.next().length > 0 ? this.wrap.insertBefore(this.obj.next()) : this.wrap.appendTo(this.obj.parent()) : this.wrap.appendTo(this.obj)),
            this.wrap && e.id && this.wrap.attr("id", e.id),
            this.wrap || (this.wrap = this.input),
            this._setComboLayout(f),
            this.list = a("<div />").addClass(e.listCls).css({
                position: "relative",
                overflow: "auto"
            }),
            this.listWrap = a("<div />").addClass(e.listWrapCls).attr("id", e.listId).hide().append(this.list).css({
                position: "absolute",
                top: 0,
                zIndex: e.zIndex
            }),
            e.extraListHtml && a("<div />").addClass(e.extraListHtmlCls).append(e.extraListHtml).appendTo(this.listWrap),
            e.listRenderToBody ? (a.Combo.allListWrap || (a.Combo.allListWrap = a('<div id="COMBO_WRAP"/>').appendTo("body")),
            this.listWrap.appendTo(a.Combo.allListWrap)) : this.wrap.after(this.listWrap)
        },
        _setListLayout: function() {
            var a, b, c = this.opts, d = parseInt(c.listHeight), e = 0, f = this.trigger ? this.trigger.outerWidth() : 0, g = parseInt(c.minListWidth), h = parseInt(c.maxListWidth);
            if (this.listWrap.width("auto"),
            this.list.height("auto"),
            this.listWrap.show(),
            this.isExpanded = !0,
            b = this.list.height(),
            !isNaN(d) && d >= 0 && (d = Math.min(d, b),
            this.list.height(d)),
            "auto" == c.listWidth || "auto" == c.width ? (a = this.listWrap.outerWidth(),
            b < this.list.height() && (e = 20,
            a += e)) : (a = parseInt(c.listWidth),
            isNaN(a) ? a = this.wrap.outerWidth() : null ),
            "auto" == c.width) {
                var i = this.listWrap.outerWidth() + Math.max(f, e);
                this._setComboLayout(i)
            }
            g = isNaN(g) ? this.wrap.outerWidth() : Math.max(g, this.wrap.outerWidth()),
            !isNaN(g) && g > a && (a = g),
            !isNaN(h) && a > h && (a = h),
            a -= this.listWrap.outerWidth() - this.listWrap.width(),
            this.listWrap.width(a),
            this.listWrap.hide(),
            this.isExpanded = !1
        },
        _setComboLayout: function(a) {
            if (a) {
                var b = this.opts
                  , c = parseInt(b.maxWidth)
                  , d = parseInt(b.minWidth);
                !isNaN(c) && a > c && (a = c),
                !isNaN(d) && d > a && (a = d);
                var e;
                a -= this.wrap.outerWidth() - this.wrap.width(),
                this.wrap.width(a),
                this.wrap[0] != this.input[0] && (e = a - (this.trigger ? this.trigger.outerWidth() : 0) - (this.input.outerWidth() - this.input.width()),
                this.input.width(e))
            }
        },
        _setListPosition: function() {
            if (this.isExpanded) {
                var b, c, d = (this.opts,
                a(window)), e = this.wrap.offset().top, f = this.wrap.offset().left, g = d.height(), h = d.width(), i = d.scrollTop(), j = d.scrollLeft(), k = this.wrap.outerHeight(), l = this.wrap.outerWidth(), m = this.listWrap.outerHeight(), n = this.listWrap.outerWidth(), o = parseInt(this.listWrap.css("border-top-width"));
                b = e - i + k + m > g && e > m ? e - m + o : e + k - o,
                c = f - j + n > h ? f + l - n : f,
                this.listWrap.css({
                    top: b,
                    left: c
                })
            }
        },
        _getRenderMode: function() {
            var b, c = this.dataOpt;
            return a.isFunction(c) && (c = c()),
            a.isArray(c) ? (this.rawData = c,
            b = "local") : "string" == typeof c && (this.url = c,
            b = "remote"),
            b
        },
        _loadAjaxData: function(b, c, d) {
            var e = this
              , f = e.opts
              , g = f.ajaxOptions
              , h = a("<div />").addClass(f.loadingCls).text(g.loadingText);
            e.list.append(h),
            e.list.find(f.listTipsCls).remove(),
            e._setListLayout(),
            e._setListPosition(),
            e.xhr = a.ajax({
                url: e.url,
                type: g.type,
                dataType: g.dataType,
                timeout: g.timeout,
                success: function(f) {
                    h.remove(),
                    a.isFunction(g.success) && g.success(f),
                    a.isFunction(g.formatData) && (f = g.formatData(f)),
                    f && (e.rawData = f,
                    e._formatData(),
                    e._populateList(e.formattedData),
                    "" === b ? (e.lastQuery = d,
                    e.filterData = e.formattedData,
                    e.expand()) : e._setDefaultSelected(b, c),
                    e.xhr = null ,
                    e.mode = e._getRenderMode())
                },
                error: function(b, c, d) {
                    h.remove(),
                    a("<div />").addClass(f.tipsCls).text(g.errorText).appendTo(e.list),
                    e.xhr = null 
                }
            })
        },
        getDisabled: function() {
            return this._disabled
        },
        getValue: function() {
            return this._selectedIndex > -1 ? this.formattedData[this._selectedIndex].value : this.opts.forceSelection ? "" : this.input.val()
        },
        getText: function() {
            return this._selectedIndex > -1 ? this.formattedData[this._selectedIndex].text : this.opts.forceSelection ? "" : this.input.val()
        },
        getSelectedIndex: function() {
            return this._selectedIndex
        },
        getSelectedRow: function() {
            return this._selectedIndex > -1 ? this.rawData[this._selectedIndex] : void 0
        },
        getDataRow: function() {
            return this._selectedIndex > -1 ? this.rawData[this._selectedIndex] : void 0
        },
        getAllData: function() {
            return this.formattedData
        },
        getAllRawData: function() {
            return this.rawData
        },
        _setDefaultSelected: function(b, c) {
            var d = this.opts;
            if ("function" == typeof b && (defaultSelected = defaultSelected.call(this, this.rawData)),
            isNaN(parseInt(b)))
                if (a.isArray(b))
                    this.selectByKey(b[0], b[1], c);
                else if (this.originSelect) {
                    var e = this.originSelect[0].selectedIndex;
                    this._setSelected(e, c)
                } else
                    d.autoSelect && this._setSelected(0, c);
            else {
                var e = parseInt(b);
                this._setSelected(e, c)
            }
        },
        selectByIndex: function(a, b) {
            this._setSelected(a, b)
        },
        selectByText: function(a, b) {
            if (this.formattedData) {
                for (var c = this.formattedData, d = -1, e = 0, f = c.length; f > e; e++)
                    if (c[e].text === a) {
                        d = e;
                        break
                    }
                this._setSelected(d, b)
            }
        },
        selectByValue: function(a, b) {
            if (this.formattedData) {
                for (var c = this.formattedData, d = -1, e = 0, f = c.length; f > e; e++)
                    if (c[e].value === a) {
                        d = e;
                        break
                    }
                this._setSelected(d, b)
            }
        },
        selectByKey: function(a, b, c) {
            if (this.rawData) {
                var d = this
                  , e = d.opts
                  , f = this.rawData
                  , g = -1;
                if (e.addOptions || e.emptyOptions) {
                    f = this.formattedData;
                    for (var h = 0, i = f.length; i > h; h++)
                        if (f[h].value === b) {
                            g = h;
                            break
                        }
                } else
                    for (var h = 0, i = f.length; i > h; h++)
                        if (f[h][a] === b) {
                            g = h;
                            break
                        }
                this._setSelected(g, c)
            }
        },
        selectByItem: function(a, b) {
            if (a && a.parent()[0] == this.list[0]) {
                var c = a.text();
                this.selectByText(c, b)
            }
        },
        _setSelected: function(a, b) {
            var c = this.opts
              , a = parseInt(a)
              , b = "undefined" != typeof b ? !!b : !0;
            if (!isNaN(a)) {
                if (!this.formattedData || 0 == this.formattedData.length)
                    return void (this._selectedIndex = -1);
                var d = this.formattedData.length;
                if ((-1 > a || a >= d) && (a = -1),
                this._selectedIndex != a) {
                    var e = -1 == a ? null  : this.formattedData[a]
                      , f = -1 == a ? null  : e.rawData
                      , g = -1 == a ? "" : e.text;
                    this.list.find("." + c.listItemCls);
                    (!b || "function" != typeof this.beforeChange || this.beforeChange(f)) && (c.editable && -1 == a && this.focus || this.input.val(g),
                    this._selectedIndex = a,
                    b && "function" == typeof this.onChange && this.onChange(f),
                    this.originSelect && (this.originSelect[0].selectedIndex = a))
                }
            }
        },
        removeSelected: function(a) {
            this.input.val(""),
            this._setSelected(-1, a)
        },
        _triggerCallback: function(a, b) {},
        _getDataFromSelect: function() {
            var b = this.opts
              , c = [];
            return a.each(this.originSelect.find("option"), function(d) {
                var e = a(this)
                  , f = {};
                f[b.text] = e.text(),
                f[b.value] = e.attr("value"),
                c.push(f)
            }
            ),
            c
        },
        _formatData: function() {
            if (a.isArray(this.rawData)) {
                var b = this
                  , c = b.opts;
                b.formattedData = [],
                c.emptyOptions && b.formattedData.push({
                    text: "(空)",
                    value: 0
                }),
                c.addOptions && b.formattedData.push(c.addOptions),
                a.each(this.rawData, function(d, e) {
                    var f = {};
                    f.text = a.isFunction(c.formatText) ? c.formatText(e) : e[c.text],
                    f.value = a.isFunction(c.formatValue) ? c.formatValue(e) : e[c.value],
                    f.rawData = e,
                    b.formattedData.push(f)
                }
                ),
                b.formattedLen = b.formattedData.length
            }
        },
        _filter: function(b) {
            function c() {
                this._formatData(),
                this.filterData = this.formattedData,
                this.lastQuery = b,
                this.list.empty(),
                this._populateList(this.filterData),
                this.expand()
            }
            b = "undefined" == typeof b ? "" : b,
            this.input.val() != this.getText() && this.selectByText(this.input.val());
            var d = this.opts
              , e = this;
            d.maxFilter;
            if (this.opts.cache || ("local" == this.mode && a.isFunction(this.dataOpt) && (this.rawData = this.dataOpt()),
            this._formatData()),
            a.isArray(this.formattedData)) {
                if ("" == b)
                    this.filterData = this.formattedData;
                else {
                    this.filterData = [];
                    var f = [];
                    a.each(e.formattedData, function(c, g) {
                        var h = g.text;
                        if (a.isFunction(d.customMatch)) {
                            if (!d.customMatch(g, b))
                                return
                        } else {
                            var i = d.caseSensitive ? "" : "i"
                              , j = new RegExp(b.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),i);
                            if (-1 == h.search(j))
                                return
                        }
                        return e.filterData.push(g),
                        f.push({
                            i: c,
                            val: g.value
                        }),
                        e.filterData.length == d.maxFilter ? !1 : void 0
                    }
                    )
                }
                for (var g = {}, h = [], i = 0, j = this.filterData.length; j > i; i++) {
                    var k = this.filterData[i];
                    g[k.value] || (g[k.value] = !0,
                    h.push(k))
                }
                this.filterData = h,
                h = [],
                g = {},
                a.isFunction(this.incrementalSearch) && 100 === e.formattedLen && e.filterData.length < d.maxFilter ? e.addQuery === !0 && this.incrementalSearch(f, c) : (this.lastQuery = b,
                this.list.empty(),
                this._populateList(this.filterData),
                this.expand())
            }
        },
        doDelayQuery: function(a) {
            var b = this
              , c = b.opts
              , d = parseInt(c.queryDelay);
            isNaN(d) && (d = 0),
            b.queryDelay && window.clearTimeout(b.queryDelay),
            b.queryDelay = window.setTimeout(function() {
                b.doQuery(a)
            }
            , d)
        },
        doQuery: function(a) {
            "local" == this.mode || "remote" == this.mode && this.opts.loadOnce ? this._filter(a) : this._loadAjaxData("", !1, a)
        },
        _populateList: function(b) {
            if (b) {
                var c = this
                  , d = c.opts;
                if (0 == b.length)
                    d.forceSelection && (a("<div />").addClass(d.tipsCls).html(d.noDataText).appendTo(c.list),
                    this._setListLayout());
                else {
                    for (var e = 0, f = b.length; f > e; e++) {
                        var g = b[e]
                          , h = g.text
                          , i = g.value
                          , j = a("<div />").attr({
                            "class": d.listItemCls + (e == this._selectedIndex ? " " + d.selectedCls : ""),
                            "data-value": i
                        });
                        d.disStrict ? j.html(h).appendTo(c.list) : j.text(h).appendTo(c.list)
                    }
                    this._setListLayout()
                }
            }
        },
        expand: function() {
            var b = this.opts;
            if (!this.active || this.isExpanded || 0 == this.filterData.length && !b.noDataText && !b.extraListHtmlCls)
                return void this.listWrap.hide();
            this.isExpanded = !0,
            this.listWrap.show(),
            this._setListPosition(),
            a.isFunction(this.onExpand) && this.onExpand();
            var c = this.list.find("." + b.listItemCls);
            if (0 != c.length) {
                var d = c.filter("." + b.selectedCls);
                0 == d.length && (d = c.eq(0),
                b.autoSelectFirst && d.addClass(b.hoverCls)),
                this._scrollToItem(d)
            }
        },
        collapse: function() {
            if (this.isExpanded) {
                var b = this.opts;
                this.listWrap.hide(),
                this.isExpanded = !1,
                this.listItems && this.listItems.removeClass(b.hoverCls),
                a.isFunction(this.onCollapse) && this.onCollapse()
            }
        },
        _onTriggerClick: function() {
            this._disabled || (this.active = !0,
            this.input.focus(),
            this.isExpanded ? this.collapse() : this._filter())
        },
        _scrollToItem: function(a) {
            if (a && 0 != a.length) {
                var b = this.list.scrollTop()
                  , c = b + a.position().top
                  , d = b + this.list.height()
                  , e = c + a.outerHeight();
                (b > c || e > d) && this.list.scrollTop(c)
            }
        },
        _scrollPage: function(a) {
            var b, c = this.list.scrollTop(), d = this.list.height();
            "up" == a ? b = c - d : "down" == a && (b = c + d),
            this.list.scrollTop(b)
        },
        _setItemFocus: function(a) {
            var b, c, d = this.opts, e = this.list.find("." + d.listItemCls);
            if (0 != e.length) {
                var f = e.filter("." + d.hoverCls).eq(0);
                0 == f.length && (f = e.filter("." + d.selectedCls).eq(0)),
                0 == f.length ? b = 0 : (b = e.index(f),
                b = "next" == a ? b == e.length - 1 ? 0 : b + 1 : 0 == b ? e.length - 1 : b - 1),
                c = e.eq(b),
                e.removeClass(d.hoverCls),
                c.addClass(d.hoverCls),
                this._scrollToItem(c)
            }
        },
        empty: function(a) {
            this._setSelected(-1, !1),
            this.input.val(""),
            this.list.empty(),
            this.rawData = null ,
            this.formattedData = null 
        },
        setEdit: function() {}
    },
    a.Combo.defaults = {
        data: null ,
        text: "text",
        value: "value",
        formatText: null ,
        formatValue: null ,
        defaultSelected: void 0,
        defaultFlag: !0,
        autoSelect: !0,
        disabled: void 0,
        editable: !1,
        caseSensitive: !1,
        forceSelection: !0,
        cache: !0,
        queryDelay: 100,
        maxFilter: 20,
        minChars: 0,
        customMatch: null ,
        addQuery: "",
        noDataText: "没有匹配的选项",
        autoSelectFirst: !0,
        width: void 0,
        minWidth: void 0,
        maxWidth: void 0,
        listWidth: void 0,
        listHeight: 150,
        maxListWidth: void 0,
        maxListWidth: void 0,
        zIndex: 1e3,
        listRenderToBody: !0,
        extraListHtml: void 0,
        disStrict: !1,
        ajaxOptions: {
            type: "post",
            dataType: "json",
            queryParam: "query",
            timeout: 1e4,
            formatData: null ,
            loadingText: "Loading...",
            success: null ,
            error: null ,
            errorText: "数据加载失败"
        },
        loadOnce: !0,
        id: void 0,
        listId: void 0,
        wrapCls: "ui-combo-wrap",
        focusCls: "ui-combo-focus",
        disabledCls: "ui-combo-disabled",
        activeCls: "ui-combo-active",
        inputCls: "input-txt",
        triggerCls: "trigger",
        listWrapCls: "ui-droplist-wrap",
        listCls: "droplist",
        listItemCls: "list-item",
        selectedCls: "selected",
        hoverCls: "on",
        loadingCls: "loading",
        tipsCls: "tips",
        extraListHtmlCls: "extra-list-ctn",
        callback: {
            onFocus: null ,
            onBlur: null ,
            beforeChange: null ,
            onChange: null ,
            onExpand: null ,
            onCollapse: null ,
            onEnter: null ,
            onListClick: null 
        }
    }
}
(jQuery),
function(a) {
    a.extend(a.fn, {
        validate: function(b) {
            if (!this.length)
                return void (b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
            var c = a.data(this[0], "validator");
            return c ? c : ("undefined" != typeof Worker && this.attr("novalidate", "novalidate"),
            c = new a.validator(b,this[0]),
            a.data(this[0], "validator", c),
            c.settings.onsubmit && (this.validateDelegate(":submit", "click", function(b) {
                c.settings.submitHandler && (c.submitButton = b.target),
                a(b.target).hasClass("cancel") && (c.cancelSubmit = !0),
                void 0 !== a(b.target).attr("formnovalidate") && (c.cancelSubmit = !0)
            }
            ),
            this.submit(function(b) {
                function d() {
                    var d;
                    return c.settings.submitHandler ? (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),
                    c.settings.submitHandler.call(c, c.currentForm, b),
                    c.submitButton && d.remove(),
                    !1) : !0
                }
                return c.settings.debug && b.preventDefault(),
                c.cancelSubmit ? (c.cancelSubmit = !1,
                d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0,
                !1) : d() : (c.focusInvalid(),
                !1)
            }
            )),
            c)
        },
        valid: function() {
            if (a(this[0]).is("form"))
                return this.validate().form();
            var b = !0
              , c = a(this[0].form).validate();
            return this.each(function() {
                b = b && c.element(this)
            }
            ),
            b
        },
        removeAttrs: function(b) {
            var c = {}
              , d = this;
            return a.each(b.split(/\s/), function(a, b) {
                c[b] = d.attr(b),
                d.removeAttr(b)
            }
            ),
            c
        },
        rules: function(b, c) {
            var d = this[0];
            if (b) {
                var e = a.data(d.form, "validator").settings
                  , f = e.rules
                  , g = a.validator.staticRules(d);
                switch (b) {
                case "add":
                    a.extend(g, a.validator.normalizeRule(c)),
                    delete g.messages,
                    f[d.name] = g,
                    c.messages && (e.messages[d.name] = a.extend(e.messages[d.name], c.messages));
                    break;
                case "remove":
                    if (!c)
                        return delete f[d.name],
                        g;
                    var h = {};
                    return a.each(c.split(/\s/), function(a, b) {
                        h[b] = g[b],
                        delete g[b]
                    }
                    ),
                    h
                }
            }
            var i = a.validator.normalizeRules(a.extend({}, a.validator.classRules(d), a.validator.attributeRules(d), a.validator.dataRules(d), a.validator.staticRules(d)), d);
            if (i.required) {
                var j = i.required;
                delete i.required,
                i = a.extend({
                    required: j
                }, i)
            }
            return i
        }
    }),
    a.extend(a.expr[":"], {
        blank: function(b) {
            return !a.trim("" + a(b).val())
        },
        filled: function(b) {
            return !!a.trim("" + a(b).val())
        },
        unchecked: function(b) {
            return !a(b).prop("checked")
        }
    }),
    a.validator = function(b, c) {
        this.settings = a.extend(!0, {}, a.validator.defaults, b),
        this.currentForm = c,
        this.init()
    }
    ,
    a.validator.format = function(b, c) {
        return 1 === arguments.length ? function() {
            var c = a.makeArray(arguments);
            return c.unshift(b),
            a.validator.format.apply(this, c)
        }
         : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)),
        c.constructor !== Array && (c = [c]),
        a.each(c, function(a, c) {
            b = b.replace(RegExp("\\{" + a + "\\}", "g"), function() {
                return c
            }
            )
        }
        ),
        b)
    }
    ,
    a.extend(a.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: !0,
            errorContainer: a([]),
            errorLabelContainer: a([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function(a) {
                this.lastActive = a,
                this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass),
                this.addWrapper(this.errorsFor(a)).hide())
            },
            onfocusout: function(a) {
                this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a)
            },
            onkeyup: function(a, b) {
                (9 !== b.which || "" !== this.elementValue(a)) && (a.name in this.submitted || a === this.lastElement) && this.element(a)
            },
            onclick: function(a) {
                a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
            },
            highlight: function(b, c, d) {
                "radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
            },
            unhighlight: function(b, c, d) {
                "radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
            }
        },
        setDefaults: function(b) {
            a.extend(a.validator.defaults, b)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            maxlength: a.validator.format("Please enter no more than {0} characters."),
            minlength: a.validator.format("Please enter at least {0} characters."),
            rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
            range: a.validator.format("Please enter a value between {0} and {1}."),
            max: a.validator.format("Please enter a value less than or equal to {0}."),
            min: a.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                function b(b) {
                    var c = a.data(this[0].form, "validator")
                      , d = "on" + b.type.replace(/^validate/, "");
                    c.settings[d] && c.settings[d].call(c, this[0], b)
                }
                this.labelContainer = a(this.settings.errorLabelContainer),
                this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm),
                this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer),
                this.submitted = {},
                this.valueCache = {},
                this.pendingRequest = 0,
                this.pending = {},
                this.invalid = {},
                this.reset();
                var c = this.groups = {};
                a.each(this.settings.groups, function(b, d) {
                    "string" == typeof d && (d = d.split(/\s/)),
                    a.each(d, function(a, d) {
                        c[d] = b
                    }
                    )
                }
                );
                var d = this.settings.rules;
                a.each(d, function(b, c) {
                    d[b] = a.validator.normalizeRule(c)
                }
                ),
                a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", b).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", b),
                this.settings.invalidHandler && a(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler)
            },
            form: function() {
                return this.checkForm(),
                a.extend(this.submitted, this.errorMap),
                this.invalid = a.extend({}, this.errorMap),
                this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]),
                this.showErrors(),
                this.valid()
            },
            checkForm: function() {
                this.prepareForm();
                for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++)
                    this.check(b[a]);
                return this.valid()
            },
            element: function(b) {
                b = this.validationTargetFor(this.clean(b)),
                this.lastElement = b,
                this.prepareElement(b),
                this.currentElements = a(b);
                var c = this.check(b) !== !1;
                return c ? delete this.invalid[b.name] : this.invalid[b.name] = !0,
                this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)),
                this.showErrors(),
                c
            },
            showErrors: function(b) {
                if (b) {
                    a.extend(this.errorMap, b),
                    this.errorList = [];
                    for (var c in b)
                        this.errorList.push({
                            message: b[c],
                            element: this.findByName(c)[0]
                        });
                    this.successList = a.grep(this.successList, function(a) {
                        return !(a.name in b)
                    }
                    )
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function() {
                a.fn.resetForm && a(this.currentForm).resetForm(),
                this.submitted = {},
                this.lastElement = null ,
                this.prepareForm(),
                this.hideErrors(),
                this.elements().removeClass(this.settings.errorClass).removeData("previousValue")
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid)
            },
            objectLength: function(a) {
                var b = 0;
                for (var c in a)
                    b++;
                return b
            },
            hideErrors: function() {
                this.addWrapper(this.toHide).hide()
            },
            valid: function() {
                return 0 === this.size()
            },
            size: function() {
                return this.errorList.length
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid)
                    try {
                        a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                    } catch (b) {}
            },
            findLastActive: function() {
                var b = this.lastActive;
                return b && 1 === a.grep(this.errorList, function(a) {
                    return a.element.name === b.name
                }
                ).length && b
            },
            elements: function() {
                var b = this
                  , c = {};
                return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function() {
                    return !this.name && b.settings.debug && window.console && console.error("%o has no name assigned", this),
                    this.name in c || !b.objectLength(a(this).rules()) ? !1 : (c[this.name] = !0,
                    !0)
                }
                )
            },
            clean: function(b) {
                return a(b)[0]
            },
            errors: function() {
                var b = this.settings.errorClass.replace(" ", ".");
                return a(this.settings.errorElement + "." + b, this.errorContext)
            },
            reset: function() {
                this.successList = [],
                this.errorList = [],
                this.errorMap = {},
                this.toShow = a([]),
                this.toHide = a([]),
                this.currentElements = a([])
            },
            prepareForm: function() {
                this.reset(),
                this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function(a) {
                this.reset(),
                this.toHide = this.errorsFor(a)
            },
            elementValue: function(b) {
                var c = a(b).attr("type")
                  , d = a(b).val();
                return "radio" === c || "checkbox" === c ? a("input[name='" + a(b).attr("name") + "']:checked").val() : "string" == typeof d ? d.replace(/\r/g, "") : d
            },
            check: function(b) {
                b = this.validationTargetFor(this.clean(b));
                var c, d = a(b).rules(), e = !1, f = this.elementValue(b);
                for (var g in d) {
                    var h = {
                        method: g,
                        parameters: d[g]
                    };
                    try {
                        if (c = a.validator.methods[g].call(this, f, b, h.parameters),
                        "dependency-mismatch" === c) {
                            e = !0;
                            continue
                        }
                        if (e = !1,
                        "pending" === c)
                            return void (this.toHide = this.toHide.not(this.errorsFor(b)));
                        if (!c)
                            return this.formatAndAdd(b, h),
                            !1
                    } catch (i) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + h.method + "' method.", i),
                        i
                    }
                }
                return e ? void 0 : (this.objectLength(d) && this.successList.push(b),
                !0)
            },
            customDataMessage: function(b, c) {
                return a(b).data("msg-" + c.toLowerCase()) || b.attributes && a(b).attr("data-msg-" + c.toLowerCase())
            },
            customMessage: function(a, b) {
                var c = this.settings.messages[a];
                return c && (c.constructor === String ? c : c[b])
            },
            findDefined: function() {
                for (var a = 0; arguments.length > a; a++)
                    if (void 0 !== arguments[a])
                        return arguments[a];
                return void 0
            },
            defaultMessage: function(b, c) {
                return this.findDefined(this.customMessage(b.name, c), this.customDataMessage(b, c), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c], "<strong>Warning: No message defined for " + b.name + "</strong>")
            },
            formatAndAdd: function(b, c) {
                var d = this.defaultMessage(b, c.method)
                  , e = /\$?\{(\d+)\}/g;
                "function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)),
                this.errorList.push({
                    message: d,
                    element: b
                }),
                this.errorMap[b.name] = d,
                this.submitted[b.name] = d
            },
            addWrapper: function(a) {
                return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))),
                a
            },
            defaultShowErrors: function() {
                var a, b;
                for (a = 0; this.errorList[a]; a++) {
                    var c = this.errorList[a];
                    this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass),
                    this.showLabel(c.element, c.message)
                }
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)),
                this.settings.success)
                    for (a = 0; this.successList[a]; a++)
                        this.showLabel(this.successList[a]);
                if (this.settings.unhighlight)
                    for (a = 0,
                    b = this.validElements(); b[a]; a++)
                        this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow),
                this.hideErrors(),
                this.addWrapper(this.toShow).show()
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function() {
                return a(this.errorList).map(function() {
                    return this.element
                }
                )
            },
            showLabel: function(b, c) {
                var d = this.errorsFor(b);
                d.length ? (d.removeClass(this.settings.validClass).addClass(this.settings.errorClass),
                d.html(c)) : (d = a("<" + this.settings.errorElement + ">").attr("for", this.idOrName(b)).addClass(this.settings.errorClass).html(c || ""),
                this.settings.wrapper && (d = d.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()),
                this.labelContainer.append(d).length || (this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b))),
                !c && this.settings.success && (d.text(""),
                "string" == typeof this.settings.success ? d.addClass(this.settings.success) : this.settings.success(d, b)),
                this.toShow = this.toShow.add(d)
            },
            errorsFor: function(b) {
                var c = this.idOrName(b);
                return this.errors().filter(function() {
                    return a(this).attr("for") === c
                }
                )
            },
            idOrName: function(a) {
                return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
            },
            validationTargetFor: function(a) {
                return this.checkable(a) && (a = this.findByName(a.name).not(this.settings.ignore)[0]),
                a
            },
            checkable: function(a) {
                return /radio|checkbox/i.test(a.type)
            },
            findByName: function(b) {
                return a(this.currentForm).find("[name='" + b + "']")
            },
            getLength: function(b, c) {
                switch (c.nodeName.toLowerCase()) {
                case "select":
                    return a("option:selected", c).length;
                case "input":
                    if (this.checkable(c))
                        return this.findByName(c.name).filter(":checked").length
                }
                return b.length
            },
            depend: function(a, b) {
                return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0
            },
            dependTypes: {
                "boolean": function(a) {
                    return a
                },
                string: function(b, c) {
                    return !!a(b, c.form).length
                },
                "function": function(a, b) {
                    return a(b)
                }
            },
            optional: function(b) {
                var c = this.elementValue(b);
                return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch"
            },
            startRequest: function(a) {
                this.pending[a.name] || (this.pendingRequest++,
                this.pending[a.name] = !0)
            },
            stopRequest: function(b, c) {
                this.pendingRequest--,
                0 > this.pendingRequest && (this.pendingRequest = 0),
                delete this.pending[b.name],
                c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(),
                this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [this]),
                this.formSubmitted = !1)
            },
            previousValue: function(b) {
                return a.data(b, "previousValue") || a.data(b, "previousValue", {
                    old: null ,
                    valid: !0,
                    message: this.defaultMessage(b, "remote")
                })
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function(b, c) {
            b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
        },
        classRules: function(b) {
            var c = {}
              , d = a(b).attr("class");
            return d && a.each(d.split(" "), function() {
                this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
            }
            ),
            c
        },
        attributeRules: function(b) {
            var c = {}
              , d = a(b)
              , e = d[0].getAttribute("type");
            for (var f in a.validator.methods) {
                var g;
                "required" === f ? (g = d.get(0).getAttribute(f),
                "" === g && (g = !0),
                g = !!g) : g = d.attr(f),
                /min|max/.test(f) && (null  === e || /number|range|text/.test(e)) && (g = Number(g)),
                g ? c[f] = g : e === f && "range" !== e && (c[f] = !0)
            }
            return c.maxlength && /-1|2147483647|524288/.test(c.maxlength) && delete c.maxlength,
            c
        },
        dataRules: function(b) {
            var c, d, e = {}, f = a(b);
            for (c in a.validator.methods)
                d = f.data("rule-" + c.toLowerCase()),
                void 0 !== d && (e[c] = d);
            return e
        },
        staticRules: function(b) {
            var c = {}
              , d = a.data(b.form, "validator");
            return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}),
            c
        },
        normalizeRules: function(b, c) {
            return a.each(b, function(d, e) {
                if (e === !1)
                    return void delete b[d];
                if (e.param || e.depends) {
                    var f = !0;
                    switch (typeof e.depends) {
                    case "string":
                        f = !!a(e.depends, c.form).length;
                        break;
                    case "function":
                        f = e.depends.call(c, c)
                    }
                    f ? b[d] = void 0 !== e.param ? e.param : !0 : delete b[d]
                }
            }
            ),
            a.each(b, function(d, e) {
                b[d] = a.isFunction(e) ? e(c) : e
            }
            ),
            a.each(["minlength", "maxlength"], function() {
                b[this] && (b[this] = Number(b[this]))
            }
            ),
            a.each(["rangelength", "range"], function() {
                var c;
                b[this] && (a.isArray(b[this]) ? b[this] = [Number(b[this][0]), Number(b[this][1])] : "string" == typeof b[this] && (c = b[this].split(/[\s,]+/),
                b[this] = [Number(c[0]), Number(c[1])]))
            }
            ),
            a.validator.autoCreateRanges && (b.min && b.max && (b.range = [b.min, b.max],
            delete b.min,
            delete b.max),
            b.minlength && b.maxlength && (b.rangelength = [b.minlength, b.maxlength],
            delete b.minlength,
            delete b.maxlength)),
            b
        },
        normalizeRule: function(b) {
            if ("string" == typeof b) {
                var c = {};
                a.each(b.split(/\s/), function() {
                    c[this] = !0
                }
                ),
                b = c
            }
            return b
        },
        addMethod: function(b, c, d) {
            a.validator.methods[b] = c,
            a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b],
            3 > c.length && a.validator.addClassRules(b, a.validator.normalizeRule(b))
        },
        methods: {
            required: function(b, c, d) {
                if (!this.depend(d, c))
                    return "dependency-mismatch";
                if ("select" === c.nodeName.toLowerCase()) {
                    var e = a(c).val();
                    return e && e.length > 0
                }
                return this.checkable(c) ? this.getLength(b, c) > 0 : a.trim(b).length > 0
            },
            email: function(a, b) {
                return this.optional(b) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a)
            },
            url: function(a, b) {
                return this.optional(b) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
            },
            date: function(a, b) {
                return this.optional(b) || !/Invalid|NaN/.test("" + new Date(a))
            },
            dateISO: function(a, b) {
                return this.optional(b) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(a)
            },
            number: function(a, b) {
                return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)
            },
            digits: function(a, b) {
                return this.optional(b) || /^\d+$/.test(a)
            },
            creditcard: function(a, b) {
                if (this.optional(b))
                    return "dependency-mismatch";
                if (/[^0-9 \-]+/.test(a))
                    return !1;
                var c = 0
                  , d = 0
                  , e = !1;
                a = a.replace(/\D/g, "");
                for (var f = a.length - 1; f >= 0; f--) {
                    var g = a.charAt(f);
                    d = parseInt(g, 10),
                    e && (d *= 2) > 9 && (d -= 9),
                    c += d,
                    e = !e
                }
                return 0 === c % 10
            },
            minlength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
                return this.optional(c) || e >= d
            },
            maxlength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
                return this.optional(c) || d >= e
            },
            rangelength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
                return this.optional(c) || e >= d[0] && d[1] >= e
            },
            min: function(a, b, c) {
                return this.optional(b) || a >= c
            },
            max: function(a, b, c) {
                return this.optional(b) || c >= a
            },
            range: function(a, b, c) {
                return this.optional(b) || a >= c[0] && c[1] >= a
            },
            equalTo: function(b, c, d) {
                var e = a(d);
                return this.settings.onfocusout && e.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    a(c).valid()
                }
                ),
                b === e.val()
            },
            remote: function(b, c, d) {
                if (this.optional(c))
                    return "dependency-mismatch";
                var e = this.previousValue(c);
                if (this.settings.messages[c.name] || (this.settings.messages[c.name] = {}),
                e.originalMessage = this.settings.messages[c.name].remote,
                this.settings.messages[c.name].remote = e.message,
                d = "string" == typeof d && {
                    url: d
                } || d,
                e.old === b)
                    return e.valid;
                e.old = b;
                var f = this;
                this.startRequest(c);
                var g = {};
                return g[c.name] = b,
                a.ajax(a.extend(!0, {
                    url: d,
                    mode: "abort",
                    port: "validate" + c.name,
                    dataType: "json",
                    data: g,
                    success: function(d) {
                        f.settings.messages[c.name].remote = e.originalMessage;
                        var g = d === !0 || "true" === d;
                        if (g) {
                            var h = f.formSubmitted;
                            f.prepareElement(c),
                            f.formSubmitted = h,
                            f.successList.push(c),
                            delete f.invalid[c.name],
                            f.showErrors()
                        } else {
                            var i = {}
                              , j = d || f.defaultMessage(c, "remote");
                            i[c.name] = e.message = a.isFunction(j) ? j(b) : j,
                            f.invalid[c.name] = !0,
                            f.showErrors(i)
                        }
                        e.valid = g,
                        f.stopRequest(c, g)
                    }
                }, d)),
                "pending"
            }
        }
    }),
    a.format = a.validator.format
}
(jQuery),
function(a) {
    var b = {};
    if (a.ajaxPrefilter)
        a.ajaxPrefilter(function(a, c, d) {
            var e = a.port;
            "abort" === a.mode && (b[e] && b[e].abort(),
            b[e] = d)
        }
        );
    else {
        var c = a.ajax;
        a.ajax = function(d) {
            var e = ("mode" in d ? d : a.ajaxSettings).mode
              , f = ("port" in d ? d : a.ajaxSettings).port;
            return "abort" === e ? (b[f] && b[f].abort(),
            b[f] = c.apply(this, arguments),
            b[f]) : c.apply(this, arguments)
        }
    }
}
(jQuery),
function(a) {
    a.extend(a.fn, {
        validateDelegate: function(b, c, d) {
            return this.bind(c, function(c) {
                var e = a(c.target);
                return e.is(b) ? d.apply(e, arguments) : void 0
            }
            )
        }
    })
}
(jQuery),
function(a) {
    a.fn.powerFloat = function(d) {
        return a(this).each(function() {
            var e, f = a.extend({}, c, d || {}), g = function(a, c) {
                b.target && "none" !== b.target.css("display") && b.targetHide(),
                b.s = a,
                b.trigger = c
            }
            ;
            switch (f.eventType) {
            case "hover":
                a(this).hover(function() {
                    b.timerHold && (b.flagDisplay = !0);
                    var c = parseInt(f.showDelay, 10);
                    g(f, a(this)),
                    c ? (e && clearTimeout(e),
                    e = setTimeout(function() {
                        b.targetGet.call(b)
                    }
                    , c)) : b.targetGet()
                }
                , function() {
                    e && clearTimeout(e),
                    b.timerHold && clearTimeout(b.timerHold),
                    b.flagDisplay = !1,
                    b.targetHold()
                }
                ),
                f.hoverFollow && a(this).mousemove(function(a) {
                    return b.cacheData.left = a.pageX,
                    b.cacheData.top = a.pageY,
                    b.targetGet.call(b),
                    !1
                }
                );
                break;
            case "click":
                a(this).click(function(c) {
                    b.display && b.trigger && c.target === b.trigger.get(0) ? (b.flagDisplay = !1,
                    b.displayDetect()) : (g(f, a(this)),
                    b.targetGet(),
                    a(document).data("mouseupBind") || a(document).bind("mouseup", function(c) {
                        var d = !1;
                        if (b.trigger) {
                            var e = b.target.attr("id");
                            e || (e = "R_" + Math.random(),
                            b.target.attr("id", e)),
                            a(c.target).parents().each(function() {
                                a(this).attr("id") === e && (d = !0)
                            }
                            ),
                            "click" === f.eventType && b.display && c.target != b.trigger.get(0) && !d && (b.flagDisplay = !1,
                            b.displayDetect())
                        }
                        return !1
                    }
                    ).data("mouseupBind", !0))
                }
                );
                break;
            case "focus":
                a(this).focus(function() {
                    var c = a(this);
                    setTimeout(function() {
                        g(f, c),
                        b.targetGet()
                    }
                    , 200)
                }
                ).blur(function() {
                    b.flagDisplay = !1,
                    setTimeout(function() {
                        b.displayDetect()
                    }
                    , 190)
                }
                );
                break;
            default:
                g(f, a(this)),
                b.targetGet(),
                a(document).unbind("mouseup").data("mouseupBind", !1)
            }
        }
        )
    }
    ;
    var b = {
        targetGet: function() {
            if (!this.trigger)
                return this;
            var c = this.trigger.attr(this.s.targetAttr)
              , d = "function" == typeof this.s.target ? this.s.target.call(this.trigger) : this.s.target;
            switch (this.s.targetMode) {
            case "common":
                if (d) {
                    var e = typeof d;
                    "object" === e ? d.size() && (b.target = d.eq(0)) : "string" === e && a(d).size() && (b.target = a(d).eq(0))
                } else
                    c && a("#" + c).size() && (b.target = a("#" + c));
                if (!b.target)
                    return this;
                b.targetShow();
                break;
            case "ajax":
                var f = d || c;
                if (this.targetProtect = !1,
                !f)
                    return;
                b.cacheData[f] || b.loading();
                var g = new Image;
                g.onload = function() {
                    var c = g.width
                      , d = g.height
                      , e = a(window).width()
                      , h = a(window).height()
                      , i = c / d
                      , j = e / h;
                    i > j ? c > e / 2 && (c = e / 2,
                    d = c / i) : d > h / 2 && (d = h / 2,
                    c = d * i);
                    var k = '<img class="float_ajax_image" src="' + f + '" width="' + c + '" height = "' + d + '" />';
                    b.cacheData[f] = !0,
                    b.target = a(k),
                    b.targetShow()
                }
                ,
                g.onerror = function() {
                    /(\.jpg|\.png|\.gif|\.bmp|\.jpeg)$/i.test(f) ? (b.target = a('<div class="float_ajax_error">图片加载失败。</div>'),
                    b.targetShow()) : a.ajax({
                        url: f,
                        success: function(c) {
                            "string" == typeof c && (b.cacheData[f] = !0,
                            b.target = a('<div class="float_ajax_data">' + c + "</div>"),
                            b.targetShow())
                        },
                        error: function() {
                            b.target = a('<div class="float_ajax_error">数据没有加载成功。</div>'),
                            b.targetShow()
                        }
                    })
                }
                ,
                g.src = f;
                break;
            case "list":
                var h, i = '<ul class="float_list_ul">';
                a.isArray(d) && (h = d.length) ? a.each(d, function(a, b) {
                    var c, d, e = "", f = "";
                    0 === a && (f = ' class="float_list_li_first"'),
                    a === h - 1 && (f = ' class="float_list_li_last"'),
                    "object" == typeof b && (c = b.text.toString()) ? e = (d = b.href || "javascript:") ? '<a href="' + d + '" class="float_list_a">' + c + "</a>" : c : "string" == typeof b && b && (e = b),
                    e && (i += "<li" + f + ">" + e + "</li>")
                }
                ) : i += '<li class="float_list_null">列表无数据。</li>',
                i += "</ul>",
                b.target = a(i),
                this.targetProtect = !1,
                b.targetShow();
                break;
            case "remind":
                var j = d || c;
                this.targetProtect = !1,
                "string" == typeof j && (b.target = a("<span>" + j + "</span>"),
                b.targetShow());
                break;
            default:
                var k = d || c
                  , e = typeof k;
                k && ("string" === e ? (/^.[^:#\[\.,]*$/.test(k) ? a(k).size() ? (b.target = a(k).eq(0),
                this.targetProtect = !0) : a("#" + k).size() ? (b.target = a("#" + k).eq(0),
                this.targetProtect = !0) : (b.target = a("<div>" + k + "</div>"),
                this.targetProtect = !1) : (b.target = a("<div>" + k + "</div>"),
                this.targetProtect = !1),
                b.targetShow()) : "object" === e && !a.isArray(k) && k.size() && (b.target = k.eq(0),
                this.targetProtect = !0,
                b.targetShow()))
            }
            return this
        },
        container: function() {
            var c = this.s.container
              , d = this.s.targetMode || "mode";
            return "ajax" === d || "remind" === d ? this.s.sharpAngle = !0 : this.s.sharpAngle = !1,
            this.s.reverseSharp && (this.s.sharpAngle = !this.s.sharpAngle),
            "common" !== d && (null  === c && (c = "plugin"),
            "plugin" === c && (a("#floatBox_" + d).size() || a('<div id="floatBox_' + d + '" class="float_' + d + '_box"></div>').appendTo(a("body")).hide(),
            c = a("#floatBox_" + d)),
            c && "string" != typeof c && c.size() && (this.targetProtect && b.target.show().css("position", "static"),
            b.target = c.empty().append(b.target))),
            this
        },
        setWidth: function() {
            var a = this.s.width;
            return "auto" === a ? this.target.get(0).style.width && this.target.css("width", "auto") : "inherit" === a ? this.target.width(this.trigger.width()) : this.target.css("width", a),
            this
        },
        position: function() {
            if (!this.trigger || !this.target)
                return this;
            var c, d, e, f, g, h, i, j = 0, k = 0, l = 0, m = 0, n = this.target.data("height"), o = this.target.data("width"), p = a(window).scrollTop(), q = parseInt(this.s.offsets.x, 10) || 0, r = parseInt(this.s.offsets.y, 10) || 0, s = this.cacheData;
            n || (n = this.target.outerHeight(),
            this.s.hoverFollow && this.target.data("height", n)),
            o || (o = this.target.outerWidth(),
            this.s.hoverFollow && this.target.data("width", o)),
            c = this.trigger.offset(),
            j = this.trigger.outerHeight(),
            k = this.trigger.outerWidth(),
            d = c.left,
            e = c.top;
            var t = function() {
                0 > d ? d = 0 : d + j > a(window).width() && (d = a(window).width() - k)
            }
              , u = function() {
                0 > e ? e = 0 : e + j > a(document).height() && (e = a(document).height() - j)
            }
            ;
            this.s.hoverFollow && s.left && s.top && ("x" === this.s.hoverFollow ? (d = s.left,
            t()) : "y" === this.s.hoverFollow ? (e = s.top,
            u()) : (d = s.left,
            e = s.top,
            t(),
            u()));
            var v, w = ["4-1", "1-4", "5-7", "2-3", "2-1", "6-8", "3-4", "4-3", "8-6", "1-2", "7-5", "3-2"], x = this.s.position, y = !1;
            a.each(w, function(a, b) {
                return b === x ? void (y = !0) : void 0
            }
            ),
            y || (x = "4-1");
            var z = function(a) {
                var b = "bottom";
                switch (a) {
                case "1-4":
                case "5-7":
                case "2-3":
                    b = "top";
                    break;
                case "2-1":
                case "6-8":
                case "3-4":
                    b = "right";
                    break;
                case "1-2":
                case "8-6":
                case "4-3":
                    b = "left";
                    break;
                case "4-1":
                case "7-5":
                case "3-2":
                    b = "bottom"
                }
                return b
            }
              , A = function(a) {
                return "5-7" === a || "6-8" === a || "8-6" === a || "7-5" === a ? !0 : !1
            }
              , B = function(c) {
                var f = 0
                  , g = 0
                  , h = b.s.sharpAngle && b.corner ? !0 : !1;
                if ("right" === c) {
                    if (g = d + k + o + q,
                    h && (g += b.corner.width()),
                    g > a(window).width())
                        return !1
                } else if ("bottom" === c) {
                    if (f = e + j + n + r,
                    h && (f += b.corner.height()),
                    f > p + a(window).height())
                        return !1
                } else if ("top" === c) {
                    if (f = n + r,
                    h && (f += b.corner.height()),
                    f > e - p)
                        return !1
                } else if ("left" === c && (g = o + q,
                h && (g += b.corner.width()),
                g > d))
                    return !1;
                return !0
            }
            ;
            v = z(x),
            this.s.sharpAngle && this.createSharp(v),
            this.s.edgeAdjust && (B(v) ? !function() {
                if (!A(x)) {
                    var a, b = {
                        top: {
                            right: "2-3",
                            left: "1-4"
                        },
                        right: {
                            top: "2-1",
                            bottom: "3-4"
                        },
                        bottom: {
                            right: "3-2",
                            left: "4-1"
                        },
                        left: {
                            top: "1-2",
                            bottom: "4-3"
                        }
                    }, c = b[v];
                    if (c)
                        for (a in c)
                            B(a) || (x = c[a])
                }
            }
            () : !function() {
                if (A(x)) {
                    var a = {
                        "5-7": "7-5",
                        "7-5": "5-7",
                        "6-8": "8-6",
                        "8-6": "6-8"
                    };
                    x = a[x]
                } else {
                    var b = {
                        top: {
                            left: "3-2",
                            right: "4-1"
                        },
                        right: {
                            bottom: "1-2",
                            top: "4-3"
                        },
                        bottom: {
                            left: "2-3",
                            right: "1-4"
                        },
                        left: {
                            bottom: "2-1",
                            top: "3-4"
                        }
                    }
                      , c = b[v]
                      , d = [];
                    for (name in c)
                        d.push(name);
                    x = B(d[0]) || !B(d[1]) ? c[d[0]] : c[d[1]]
                }
            }
            ());
            var C = z(x)
              , D = x.split("-")[0];
            if (this.s.sharpAngle && (this.createSharp(C),
            l = this.corner.width(),
            m = this.corner.height()),
            this.s.hoverFollow)
                "x" === this.s.hoverFollow ? (f = d + q,
                f = "1" === D || "8" === D || "4" === D ? d - (o - k) / 2 + q : d - (o - k) + q,
                "1" === D || "5" === D || "2" === D ? (g = e - r - n - m,
                i = e - m - r - 1) : (g = e + j + r + m,
                i = e + j + r + 1),
                h = c.left - (l - k) / 2) : "y" === this.s.hoverFollow ? (g = "1" === D || "5" === D || "2" === D ? e - (n - j) / 2 + r : e - (n - j) + r,
                "1" === D || "8" === D || "4" === D ? (f = d - o - q - l,
                h = d - l - q - 1) : (f = d + k - q + l,
                h = d + k + q + 1),
                i = c.top - (m - j) / 2) : (f = d + q,
                g = e + r);
            else
                switch (C) {
                case "top":
                    g = e - r - n - m,
                    f = "1" == D ? d - q : "5" === D ? d - (o - k) / 2 - q : d - (o - k) - q,
                    i = e - m - r - 1,
                    h = d - (l - k) / 2;
                    break;
                case "right":
                    f = d + k + q + l,
                    g = "2" == D ? e + r : "6" === D ? e - (n - j) / 2 + r : e - (n - j) + r,
                    h = d + k + q + 1,
                    i = e - (m - j) / 2;
                    break;
                case "bottom":
                    g = e + j + r + m,
                    f = "4" == D ? d + q : "7" === D ? d - (o - k) / 2 + q : d - (o - k) + q,
                    i = e + j + r + 1,
                    h = d - (l - k) / 2;
                    break;
                case "left":
                    f = d - o - q - l,
                    g = "2" == D ? e - r : "6" === D ? e - (o - k) / 2 - r : e - (n - j) - r,
                    h = f + l,
                    i = e - (o - l) / 2
                }
            return m && l && this.corner && this.corner.css({
                left: h,
                top: i,
                zIndex: this.s.zIndex + 1
            }),
            this.target.css({
                position: "absolute",
                left: f,
                top: g,
                zIndex: this.s.zIndex
            }),
            this
        },
        createSharp: function(b) {
            var c, d, e = "", f = "", g = {
                left: "right",
                right: "left",
                bottom: "top",
                top: "bottom"
            }, h = g[b] || "top";
            this.target && (c = this.target.css("background-color"),
            parseInt(this.target.css("border-" + h + "-width")) > 0 && (d = this.target.css("border-" + h + "-color")),
            e = d && "transparent" !== d ? 'style="color:' + d + ';"' : 'style="display:none;"',
            f = c && "transparent" !== c ? 'style="color:' + c + ';"' : 'style="display:none;"');
            var i = '<div id="floatCorner_' + b + '" class="float_corner float_corner_' + b + '"><span class="corner corner_1" ' + e + '>◆</span><span class="corner corner_2" ' + f + ">◆</span></div>";
            return a("#floatCorner_" + b).size() || a("body").append(a(i)),
            this.corner = a("#floatCorner_" + b),
            this
        },
        targetHold: function() {
            if (this.s.hoverHold) {
                var a = parseInt(this.s.hideDelay, 10) || 200;
                this.target && this.target.hover(function() {
                    b.flagDisplay = !0
                }
                , function() {
                    b.timerHold && clearTimeout(b.timerHold),
                    b.flagDisplay = !1,
                    b.targetHold()
                }
                ),
                b.timerHold = setTimeout(function() {
                    b.displayDetect.call(b)
                }
                , a)
            } else
                this.displayDetect();
            return this
        },
        loading: function() {
            return this.target = a('<div class="float_loading"></div>'),
            this.targetShow(),
            this.target.removeData("width").removeData("height"),
            this
        },
        displayDetect: function() {
            return !this.flagDisplay && this.display && (this.targetHide(),
            this.timerHold = null ),
            this
        },
        targetShow: function() {
            return b.cornerClear(),
            this.display = !0,
            this.container().setWidth().position(),
            this.target.show(),
            a.isFunction(this.s.showCall) && this.s.showCall.call(this.trigger, this.target),
            this
        },
        targetHide: function() {
            return this.display = !1,
            this.targetClear(),
            this.cornerClear(),
            a.isFunction(this.s.hideCall) && this.s.hideCall.call(this.trigger),
            this.target = null ,
            this.trigger = null ,
            this.s = {},
            this.targetProtect = !1,
            this
        },
        targetClear: function() {
            this.target && (this.target.data("width") && this.target.removeData("width").removeData("height"),
            this.targetProtect && this.target.children().hide().appendTo(a("body")),
            this.target.unbind().hide())
        },
        cornerClear: function() {
            this.corner && this.corner.remove()
        },
        target: null ,
        trigger: null ,
        s: {},
        cacheData: {},
        targetProtect: !1
    };
    a.powerFloat = {},
    a.powerFloat.hide = function() {
        b.targetHide()
    }
    ;
    var c = {
        width: "auto",
        offsets: {
            x: 0,
            y: 0
        },
        zIndex: 999,
        eventType: "hover",
        showDelay: 0,
        hideDelay: 0,
        hoverHold: !0,
        hoverFollow: !1,
        targetMode: "common",
        target: null ,
        targetAttr: "rel",
        container: null ,
        reverseSharp: !1,
        position: "4-1",
        edgeAdjust: !0,
        showCall: a.noop,
        hideCall: a.noop
    }
}
(jQuery),
function(a, b) {
    "use strict";
    var c = "function" == typeof moment
      , d = !!a.addEventListener
      , e = a.document
      , f = a.setTimeout
      , g = function(a, b, c, e) {
        d ? a.addEventListener(b, c, !!e) : a.attachEvent("on" + b, c)
    }
      , h = function(a, b, c, e) {
        d ? a.removeEventListener(b, c, !!e) : a.detachEvent("on" + b, c)
    }
      , i = function(a, b, c) {
        var d;
        e.createEvent ? (d = e.createEvent("HTMLEvents"),
        d.initEvent(b, !0, !1),
        d = u(d, c),
        a.dispatchEvent(d)) : e.createEventObject && (d = e.createEventObject(),
        d = u(d, c),
        a.fireEvent("on" + b, d))
    }
      , j = function(a) {
        return a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, "")
    }
      , k = function(a, b) {
        return -1 !== (" " + a.className + " ").indexOf(" " + b + " ")
    }
      , l = function(a, b) {
        k(a, b) || (a.className = "" === a.className ? b : a.className + " " + b)
    }
      , m = function(a, b) {
        a.className = j((" " + a.className + " ").replace(" " + b + " ", " "))
    }
      , n = function(a) {
        return /Array/.test(Object.prototype.toString.call(a))
    }
      , o = function(a) {
        return /Date/.test(Object.prototype.toString.call(a)) && !isNaN(a.getTime())
    }
      , p = function(a) {
        return new Date(Date.parse(a.replace(/\.|\-/g, "/")))
    }
      , q = function(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }
      , r = function(a, b) {
        return [31, q(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][b]
    }
      , s = function(a) {
        o(a) && a.setHours(0, 0, 0, 0)
    }
      , t = function(a, b) {
        return a.getTime() === b.getTime()
    }
      , u = function(a, c, d) {
        var e, f;
        for (e in c)
            f = a[e] !== b,
            f && "object" == typeof c[e] && c[e].nodeName === b ? o(c[e]) ? d && (a[e] = new Date(c[e].getTime())) : n(c[e]) ? d && (a[e] = c[e].slice(0)) : a[e] = u({}, c[e], d) : (d || !f) && (a[e] = c[e]);
        return a
    }
      , v = {
        field: null ,
        bound: b,
        format: "YYYY-MM-DD",
        defaultDate: null ,
        setDefaultDate: !1,
        firstDay: 0,
        minDate: null ,
        maxDate: null ,
        yearRange: 10,
        minYear: 1990,
        maxYear: 2099,
        minMonth: b,
        maxMonth: b,
        isRTL: !1,
        yearSuffix: "年",
        showMonthAfterYear: !0,
        numberOfMonths: 1,
        i18n: {
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            monthsShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"]
        },
        onSelect: null ,
        onOpen: null ,
        onClose: null ,
        onDraw: null 
    }
      , w = function(a, b, c) {
        for (b += a.firstDay; b >= 7; )
            b -= 7;
        return c ? a.i18n.weekdaysShort[b] : a.i18n.weekdays[b]
    }
      , x = function(a, b, c, d, e) {
        if (e)
            return '<td class="is-empty"></td>';
        var f = [];
        return d && f.push("is-disabled"),
        c && f.push("is-today"),
        b && f.push("is-selected"),
        '<td data-day="' + a + '" class="' + f.join(" ") + '"><a class="pika-button" href="javascript:void(0);">' + a + "</a></td>"
    }
      , y = function(a, b) {
        return "<tr>" + (b ? a.reverse() : a).join("") + "</tr>"
    }
      , z = function(a) {
        return "<tbody>" + a.join("") + "</tbody>"
    }
      , A = function(a) {
        var b, c = [];
        for (b = 0; 7 > b; b++)
            c.push('<th scope="col"><abbr title="' + w(a, b) + '">' + w(a, b, !0) + "</abbr></th>");
        return "<thead>" + (a.isRTL ? c.reverse() : c).join("") + "</thead>"
    }
      , B = function(a) {
        var b, c, d, e, f, g = a._o, h = a._m, i = a._y, j = i === g.minYear, k = i === g.maxYear, l = '<div class="pika-title">', m = !0, o = !0;
        for (l += '<a class="pika-prev' + (m ? "" : " is-disabled") + '" href="javascript:void(0);">&lt;</a>',
        d = [],
        b = 0; 12 > b; b++)
            d.push('<option value="' + b + '"' + (b === h ? " selected" : "") + (j && b < g.minMonth || k && b > g.maxMonth ? "disabled" : "") + ">" + g.i18n.months[b] + "</option>");
        for (e = '<div class="pika-label pika-label-month">' + g.i18n.months[h] + '<select class="pika-select pika-select-month">' + d.join("") + "</select></div>",
        n(g.yearRange) ? (b = g.yearRange[0],
        c = g.yearRange[1] + 1) : (b = i - g.yearRange,
        c = 1 + i + g.yearRange),
        d = []; c > b && b <= g.maxYear; b++)
            b >= g.minYear && d.push('<option value="' + b + '"' + (b === i ? " selected" : "") + ">" + b + "</option>");
        return f = '<div class="pika-label pika-label-year">' + i + g.yearSuffix + '<select class="pika-select pika-select-year">' + d.join("") + "</select></div>",
        l += g.showMonthAfterYear ? f + e : e + f,
        j && (0 === h || g.minMonth >= h) && (m = !1),
        k && (11 === h || g.maxMonth <= h) && (o = !1),
        l += '<a class="pika-next' + (o ? "" : " is-disabled") + '" href="javascript:void(0);">&gt;</a>',
        l += "</div>"
    }
      , C = function(a, b) {
        return '<table cellpadding="0" cellspacing="0" class="pika-table">' + A(a) + z(b) + "</table>"
    }
      , D = function(b) {
        var h = this
          , i = h.config(b);
        h._onMouseDown = function(b) {
            if (h._v) {
                b = b || a.event;
                var c = b.target || b.srcElement;
                if (c) {
                    if (!k(c, "is-disabled")) {
                        if (k(c, "pika-button") && !k(c, "is-empty"))
                            return h.setDate(new Date(h._y,h._m,parseInt(c.innerHTML, 10))),
                            void (i.bound && f(function() {
                                h.hide()
                            }
                            , 100));
                        k(c, "pika-prev") ? h.prevMonth() : k(c, "pika-next") && h.nextMonth()
                    }
                    if (h._c = !0,
                    !k(c, "pika-select")) {
                        if (!b.preventDefault)
                            return b.returnValue = !1,
                            b.cancelBubble = !0,
                            !1;
                        b.preventDefault(),
                        b.stopPropagation()
                    }
                }
            }
        }
        ,
        h._onChange = function(b) {
            b = b || a.event;
            var c = b.target || b.srcElement;
            c && (k(c, "pika-select-month") ? h.gotoMonth(c.value) : k(c, "pika-select-year") && h.gotoYear(c.value))
        }
        ,
        h._onInputChange = function(a) {
            var b;
            a.firedBy !== h && (c ? (b = moment(i.field.value, i.format),
            b = b && b.isValid() ? b.toDate() : null ) : b = p(i.field.value),
            h.setDate(o(b) ? b : null ),
            h._v || h.show())
        }
        ,
        h._onInputFocus = function() {
            h.show()
        }
        ,
        h._onInputClick = function() {
            h.show()
        }
        ,
        h._onInputBlur = function() {
            h._c || (h._b = f(function() {
                h.hide()
            }
            , 50)),
            h._c = !1
        }
        ,
        h._onClick = function(b) {
            b = b || a.event;
            var c = b.target || b.srcElement
              , e = c;
            if (c) {
                !d && k(c, "pika-select") && (c.onchange || (c.setAttribute("onchange", "return;"),
                g(c, "change", h._onChange)));
                do
                    if (k(e, "pika-single"))
                        return;
                while (e = e.parentNode);h._v && c !== i.trigger && h.hide()
            }
        }
        ,
        h.el = e.createElement("div"),
        h.el.className = "pika-single" + (i.isRTL ? " is-rtl" : ""),
        g(h.el, "mousedown", h._onMouseDown, !0),
        g(h.el, "change", h._onChange),
        i.field && (i.bound ? e.body.appendChild(h.el) : i.field.parentNode.insertBefore(h.el, i.field.nextSibling),
        g(i.field, "change", h._onInputChange),
        i.defaultDate || (c && i.field.value ? i.defaultDate = moment(i.field.value, i.format).toDate() : i.defaultDate = p(i.field.value),
        i.setDefaultDate = !0));
        var j = i.defaultDate;
        o(j) ? i.setDefaultDate ? h.setDate(j, !0) : h.gotoDate(j) : h.gotoDate(new Date),
        i.bound ? (this.hide(),
        h.el.className += " is-bound",
        g(i.trigger, "click", h._onInputClick),
        g(i.trigger, "focus", h._onInputFocus),
        g(i.trigger, "blur", h._onInputBlur)) : this.show()
    }
    ;
    D.prototype = {
        config: function(a) {
            this._o || (this._o = u({}, v, !0));
            var c = u(this._o, a, !0);
            c.isRTL = !!c.isRTL,
            c.field = c.field && c.field.nodeName ? c.field : null ,
            c.bound = !!(c.bound !== b ? c.field && c.bound : c.field),
            c.trigger = c.trigger && c.trigger.nodeName ? c.trigger : c.field;
            var d = parseInt(c.numberOfMonths, 10) || 1;
            if (c.numberOfMonths = d > 4 ? 4 : d,
            o(c.minDate) || (c.minDate = !1),
            o(c.maxDate) || (c.maxDate = !1),
            c.minDate && c.maxDate && c.maxDate < c.minDate && (c.maxDate = c.minDate = !1),
            c.minDate && (s(c.minDate),
            c.minYear = c.minDate.getFullYear(),
            c.minMonth = c.minDate.getMonth()),
            c.maxDate && (s(c.maxDate),
            c.maxYear = c.maxDate.getFullYear(),
            c.maxMonth = c.maxDate.getMonth()),
            n(c.yearRange)) {
                var e = (new Date).getFullYear() - 10;
                c.yearRange[0] = parseInt(c.yearRange[0], 10) || e,
                c.yearRange[1] = parseInt(c.yearRange[1], 10) || e
            } else
                c.yearRange = Math.abs(parseInt(c.yearRange, 10)) || v.yearRange,
                c.yearRange > 100 && (c.yearRange = 100);
            return c
        },
        toString: function(a) {
            if (!o(this._d))
                return "";
            var b = this._d.getFullYear()
              , d = this._d.getMonth() + 1
              , e = this._d.getDate();
            return d = 10 > d ? "0" + d : d,
            e = 10 > e ? "0" + e : e,
            o(this._d) ? c ? moment(this._d).format(a || this._o.format) : b + "-" + d + "-" + e : ""
        },
        getMoment: function() {
            return c ? moment(this._d) : null 
        },
        setMoment: function(a) {
            c && moment.isMoment(a) && this.setDate(a.toDate())
        },
        getDate: function() {
            return o(this._d) ? new Date(this._d.getTime()) : null 
        },
        setDate: function(a, b) {
            if (!a)
                return this._d = null ,
                this.draw();
            if ("string" == typeof a && (a = p(a)),
            o(a)) {
                var c = this._o.minDate
                  , d = this._o.maxDate;
                o(c) && c > a ? a = c : o(d) && a > d && (a = d),
                this._d = new Date(a.getTime()),
                s(this._d),
                this.gotoDate(this._d),
                this._o.field && (this._o.field.value = this.toString(),
                i(this._o.field, "change", {
                    firedBy: this
                })),
                b || "function" != typeof this._o.onSelect || this._o.onSelect.call(this, this.getDate())
            }
        },
        gotoDate: function(a) {
            o(a) && (this._y = a.getFullYear(),
            this._m = a.getMonth(),
            this.draw())
        },
        gotoToday: function() {
            this.gotoDate(new Date)
        },
        gotoMonth: function(a) {
            isNaN(a = parseInt(a, 10)) || (this._m = 0 > a ? 0 : a > 11 ? 11 : a,
            this.draw())
        },
        nextMonth: function() {
            ++this._m > 11 && (this._m = 0,
            this._y++),
            this.draw()
        },
        prevMonth: function() {
            --this._m < 0 && (this._m = 11,
            this._y--),
            this.draw()
        },
        gotoYear: function(a) {
            isNaN(a) || (this._y = parseInt(a, 10),
            this.draw())
        },
        setMinDate: function(a) {
            this._o.minDate = a
        },
        setMaxDate: function(a) {
            this._o.maxDate = a
        },
        draw: function(a) {
            if (this._v || a) {
                var b = this._o
                  , c = b.minYear
                  , d = b.maxYear
                  , e = b.minMonth
                  , g = b.maxMonth;
                if (this._y <= c && (this._y = c,
                !isNaN(e) && this._m < e && (this._m = e)),
                this._y >= d && (this._y = d,
                !isNaN(g) && this._m > g && (this._m = g)),
                this.el.innerHTML = B(this) + this.render(this._y, this._m),
                b.bound && (this.adjustPosition(),
                "hidden" !== b.field.type && f(function() {
                    b.trigger.focus()
                }
                , 1)),
                "function" == typeof this._o.onDraw) {
                    var h = this;
                    f(function() {
                        h._o.onDraw.call(h)
                    }
                    , 0)
                }
            }
        },
        adjustPosition: function() {
            var b, c, d, f = this._o.trigger, g = f, h = this.el.offsetWidth, i = this.el.offsetHeight, j = a.innerWidth || e.documentElement.clientWidth, k = a.innerHeight || e.documentElement.clientHeight, n = a.pageYOffset || e.body.scrollTop || e.documentElement.scrollTop;
            if (l(this.el, "is-hidden"),
            "function" == typeof f.getBoundingClientRect)
                d = f.getBoundingClientRect(),
                b = d.left + a.pageXOffset,
                c = d.bottom + a.pageYOffset;
            else
                for (b = g.offsetLeft,
                c = g.offsetTop + g.offsetHeight; g = g.offsetParent; )
                    b += g.offsetLeft,
                    c += g.offsetTop;
            m(this.el, "is-hidden"),
            b + h > j && (b = b - h + f.offsetWidth),
            c + i > k + n && (c = c - i - f.offsetHeight),
            this.el.style.cssText = "position:absolute;left:" + b + "px;top:" + c + "px;"
        },
        render: function(a, b) {
            var c = this._o
              , d = new Date
              , e = r(a, b)
              , f = new Date(a,b,1).getDay()
              , g = []
              , h = [];
            s(d),
            c.firstDay > 0 && (f -= c.firstDay,
            0 > f && (f += 7));
            for (var i = e + f, j = i; j > 7; )
                j -= 7;
            i += 7 - j;
            for (var k = 0, l = 0; i > k; k++) {
                var m = new Date(a,b,1 + (k - f))
                  , n = c.minDate && m < c.minDate || c.maxDate && m > c.maxDate
                  , p = o(this._d) ? t(m, this._d) : !1
                  , q = t(m, d)
                  , u = f > k || k >= e + f;
                h.push(x(1 + (k - f), p, q, n, u)),
                7 === ++l && (g.push(y(h, c.isRTL)),
                h = [],
                l = 0)
            }
            return C(c, g)
        },
        isVisible: function() {
            return this._v
        },
        show: function() {
            this._v || (this._o.bound && g(e, "click", this._onClick),
            m(this.el, "is-hidden"),
            this._v = !0,
            this.draw(),
            "function" == typeof this._o.onOpen && this._o.onOpen.call(this))
        },
        hide: function() {
            var a = this._v;
            a !== !1 && (this._o.bound && h(e, "click", this._onClick),
            this.el.style.cssText = "",
            l(this.el, "is-hidden"),
            this._v = !1,
            a !== b && "function" == typeof this._o.onClose && this._o.onClose.call(this))
        },
        destroy: function() {
            this.hide(),
            h(this.el, "mousedown", this._onMouseDown, !0),
            h(this.el, "change", this._onChange),
            this._o.field && (h(this._o.field, "change", this._onInputChange),
            this._o.bound && (h(this._o.trigger, "click", this._onInputClick),
            h(this._o.trigger, "focus", this._onInputFocus),
            h(this._o.trigger, "blur", this._onInputBlur))),
            this.el.parentNode && this.el.parentNode.removeChild(this.el)
        }
    },
    a.Pikaday = D
}
(window),
function(a, b) {
    a.define && "function" == typeof define ? define(function(c) {
        b(c("jquery"), a.Pikaday)
    }
    ) : b(a.jQuery, a.Pikaday)
}
(this, function(a, b) {
    a && (a.fn.datepicker = a.fn.pikaday = function() {
        var c = arguments;
        return c && c.length || (c = [{}]),
        this.each(function() {
            var d = a(this)
              , e = d.data("pikaday");
            if (e instanceof b)
                "string" == typeof c[0] && "function" == typeof e[c[0]] && e[c[0]].apply(e, Array.prototype.slice.call(c, 1));
            else if ("object" == typeof c[0]) {
                var f = a.extend({}, c[0]);
                f.field = d[0],
                d.data("pikaday", new b(f))
            }
        }
        )
    }
    )
}
),
function($) {
    var settings = {}
      , roots = {}
      , caches = {}
      , _consts = {
        className: {
            BUTTON: "button",
            LEVEL: "level",
            ICO_LOADING: "ico_loading",
            SWITCH: "switch"
        },
        event: {
            NODECREATED: "ztree_nodeCreated",
            CLICK: "ztree_click",
            EXPAND: "ztree_expand",
            COLLAPSE: "ztree_collapse",
            ASYNC_SUCCESS: "ztree_async_success",
            ASYNC_ERROR: "ztree_async_error",
            REMOVE: "ztree_remove"
        },
        id: {
            A: "_a",
            ICON: "_ico",
            SPAN: "_span",
            SWITCH: "_switch",
            UL: "_ul"
        },
        line: {
            ROOT: "root",
            ROOTS: "roots",
            CENTER: "center",
            BOTTOM: "bottom",
            NOLINE: "noline",
            LINE: "line"
        },
        folder: {
            OPEN: "open",
            CLOSE: "close",
            DOCU: "docu"
        },
        node: {
            CURSELECTED: "curSelectedNode"
        }
    }
      , _setting = {
        treeId: "",
        treeObj: null ,
        view: {
            addDiyDom: null ,
            autoCancelSelected: !0,
            dblClickExpand: !0,
            expandSpeed: "fast",
            fontCss: {},
            nameIsHTML: !1,
            selectedMulti: !0,
            showIcon: !0,
            showLine: !0,
            showTitle: !0,
            txtSelectedEnable: !1
        },
        data: {
            key: {
                children: "children",
                name: "name",
                title: "",
                url: "url"
            },
            simpleData: {
                enable: !1,
                idKey: "id",
                pIdKey: "pId",
                rootPId: null 
            },
            keep: {
                parent: !1,
                leaf: !1
            }
        },
        async: {
            enable: !1,
            contentType: "application/x-www-form-urlencoded",
            type: "post",
            dataType: "text",
            url: "",
            autoParam: [],
            otherParam: [],
            dataFilter: null 
        },
        callback: {
            beforeAsync: null ,
            beforeClick: null ,
            beforeDblClick: null ,
            beforeRightClick: null ,
            beforeMouseDown: null ,
            beforeMouseUp: null ,
            beforeExpand: null ,
            beforeCollapse: null ,
            beforeRemove: null ,
            onAsyncError: null ,
            onAsyncSuccess: null ,
            onNodeCreated: null ,
            onClick: null ,
            onDblClick: null ,
            onRightClick: null ,
            onMouseDown: null ,
            onMouseUp: null ,
            onExpand: null ,
            onCollapse: null ,
            onRemove: null 
        }
    }
      , _initRoot = function(a) {
        var b = data.getRoot(a);
        b || (b = {},
        data.setRoot(a, b)),
        b[a.data.key.children] = [],
        b.expandTriggerFlag = !1,
        b.curSelectedList = [],
        b.noSelection = !0,
        b.createdNodes = [],
        b.zId = 0,
        b._ver = (new Date).getTime()
    }
      , _initCache = function(a) {
        var b = data.getCache(a);
        b || (b = {},
        data.setCache(a, b)),
        b.nodes = [],
        b.doms = []
    }
      , _bindEvent = function(a) {
        var b = a.treeObj
          , c = consts.event;
        b.bind(c.NODECREATED, function(b, c, d) {
            tools.apply(a.callback.onNodeCreated, [b, c, d])
        }
        ),
        b.bind(c.CLICK, function(b, c, d, e, f) {
            tools.apply(a.callback.onClick, [c, d, e, f])
        }
        ),
        b.bind(c.EXPAND, function(b, c, d) {
            tools.apply(a.callback.onExpand, [b, c, d])
        }
        ),
        b.bind(c.COLLAPSE, function(b, c, d) {
            tools.apply(a.callback.onCollapse, [b, c, d])
        }
        ),
        b.bind(c.ASYNC_SUCCESS, function(b, c, d, e) {
            tools.apply(a.callback.onAsyncSuccess, [b, c, d, e])
        }
        ),
        b.bind(c.ASYNC_ERROR, function(b, c, d, e, f, g) {
            tools.apply(a.callback.onAsyncError, [b, c, d, e, f, g])
        }
        ),
        b.bind(c.REMOVE, function(b, c, d) {
            tools.apply(a.callback.onRemove, [b, c, d])
        }
        )
    }
      , _unbindEvent = function(a) {
        var b = a.treeObj
          , c = consts.event;
        b.unbind(c.NODECREATED).unbind(c.CLICK).unbind(c.EXPAND).unbind(c.COLLAPSE).unbind(c.ASYNC_SUCCESS).unbind(c.ASYNC_ERROR).unbind(c.REMOVE)
    }
      , _eventProxy = function(a) {
        var b = a.target
          , c = data.getSetting(a.data.treeId)
          , d = ""
          , e = null 
          , f = ""
          , g = ""
          , h = null 
          , i = null 
          , j = null ;
        if (tools.eqs(a.type, "mousedown") ? g = "mousedown" : tools.eqs(a.type, "mouseup") ? g = "mouseup" : tools.eqs(a.type, "contextmenu") ? g = "contextmenu" : tools.eqs(a.type, "click") ? tools.eqs(b.tagName, "span") && null  !== b.getAttribute("treeNode" + consts.id.SWITCH) ? (d = tools.getNodeMainDom(b).id,
        f = "switchNode") : (j = tools.getMDom(c, b, [{
            tagName: "a",
            attrName: "treeNode" + consts.id.A
        }]),
        j && (d = tools.getNodeMainDom(j).id,
        f = "clickNode")) : tools.eqs(a.type, "dblclick") && (g = "dblclick",
        j = tools.getMDom(c, b, [{
            tagName: "a",
            attrName: "treeNode" + consts.id.A
        }]),
        j && (d = tools.getNodeMainDom(j).id,
        f = "switchNode")),
        g.length > 0 && 0 == d.length && (j = tools.getMDom(c, b, [{
            tagName: "a",
            attrName: "treeNode" + consts.id.A
        }]),
        j && (d = tools.getNodeMainDom(j).id)),
        d.length > 0)
            switch (e = data.getNodeCache(c, d),
            f) {
            case "switchNode":
                e.isParent && (tools.eqs(a.type, "click") || tools.eqs(a.type, "dblclick") && tools.apply(c.view.dblClickExpand, [c.treeId, e], c.view.dblClickExpand)) ? h = handler.onSwitchNode : f = "";
                break;
            case "clickNode":
                h = handler.onClickNode
            }
        switch (g) {
        case "mousedown":
            i = handler.onZTreeMousedown;
            break;
        case "mouseup":
            i = handler.onZTreeMouseup;
            break;
        case "dblclick":
            i = handler.onZTreeDblclick;
            break;
        case "contextmenu":
            i = handler.onZTreeContextmenu
        }
        var k = {
            stop: !1,
            node: e,
            nodeEventType: f,
            nodeEventCallback: h,
            treeEventType: g,
            treeEventCallback: i
        };
        return k
    }
      , _initNode = function(a, b, c, d, e, f, g) {
        if (c) {
            var h = data.getRoot(a)
              , i = a.data.key.children;
            c.level = b,
            c.tId = a.treeId + "_" + ++h.zId,
            c.parentTId = d ? d.tId : null ,
            c.open = "string" == typeof c.open ? tools.eqs(c.open, "true") : !!c.open,
            c[i] && c[i].length > 0 ? (c.isParent = !0,
            c.zAsync = !0) : (c.isParent = "string" == typeof c.isParent ? tools.eqs(c.isParent, "true") : !!c.isParent,
            c.open = c.isParent && !a.async.enable ? c.open : !1,
            c.zAsync = !c.isParent),
            c.isFirstNode = e,
            c.isLastNode = f,
            c.getParentNode = function() {
                return data.getNodeCache(a, c.parentTId)
            }
            ,
            c.getPreNode = function() {
                return data.getPreNode(a, c)
            }
            ,
            c.getNextNode = function() {
                return data.getNextNode(a, c)
            }
            ,
            c.isAjaxing = !1,
            data.fixPIdKeyValue(a, c)
        }
    }
      , _init = {
        bind: [_bindEvent],
        unbind: [_unbindEvent],
        caches: [_initCache],
        nodes: [_initNode],
        proxys: [_eventProxy],
        roots: [_initRoot],
        beforeA: [],
        afterA: [],
        innerBeforeA: [],
        innerAfterA: [],
        zTreeTools: []
    }
      , data = {
        addNodeCache: function(a, b) {
            data.getCache(a).nodes[data.getNodeCacheId(b.tId)] = b
        },
        getNodeCacheId: function(a) {
            return a.substring(a.lastIndexOf("_") + 1)
        },
        addAfterA: function(a) {
            _init.afterA.push(a)
        },
        addBeforeA: function(a) {
            _init.beforeA.push(a)
        },
        addInnerAfterA: function(a) {
            _init.innerAfterA.push(a)
        },
        addInnerBeforeA: function(a) {
            _init.innerBeforeA.push(a)
        },
        addInitBind: function(a) {
            _init.bind.push(a)
        },
        addInitUnBind: function(a) {
            _init.unbind.push(a)
        },
        addInitCache: function(a) {
            _init.caches.push(a)
        },
        addInitNode: function(a) {
            _init.nodes.push(a)
        },
        addInitProxy: function(a, b) {
            b ? _init.proxys.splice(0, 0, a) : _init.proxys.push(a)
        },
        addInitRoot: function(a) {
            _init.roots.push(a)
        },
        addNodesData: function(a, b, c) {
            var d = a.data.key.children;
            b[d] || (b[d] = []),
            b[d].length > 0 && (b[d][b[d].length - 1].isLastNode = !1,
            view.setNodeLineIcos(a, b[d][b[d].length - 1])),
            b.isParent = !0,
            b[d] = b[d].concat(c)
        },
        addSelectedNode: function(a, b) {
            var c = data.getRoot(a);
            data.isSelectedNode(a, b) || c.curSelectedList.push(b)
        },
        addCreatedNode: function(a, b) {
            if (a.callback.onNodeCreated || a.view.addDiyDom) {
                var c = data.getRoot(a);
                c.createdNodes.push(b)
            }
        },
        addZTreeTools: function(a) {
            _init.zTreeTools.push(a)
        },
        exSetting: function(a) {
            $.extend(!0, _setting, a)
        },
        fixPIdKeyValue: function(a, b) {
            a.data.simpleData.enable && (b[a.data.simpleData.pIdKey] = b.parentTId ? b.getParentNode()[a.data.simpleData.idKey] : a.data.simpleData.rootPId)
        },
        getAfterA: function(a, b, c) {
            for (var d = 0, e = _init.afterA.length; e > d; d++)
                _init.afterA[d].apply(this, arguments)
        },
        getBeforeA: function(a, b, c) {
            for (var d = 0, e = _init.beforeA.length; e > d; d++)
                _init.beforeA[d].apply(this, arguments)
        },
        getInnerAfterA: function(a, b, c) {
            for (var d = 0, e = _init.innerAfterA.length; e > d; d++)
                _init.innerAfterA[d].apply(this, arguments)
        },
        getInnerBeforeA: function(a, b, c) {
            for (var d = 0, e = _init.innerBeforeA.length; e > d; d++)
                _init.innerBeforeA[d].apply(this, arguments)
        },
        getCache: function(a) {
            return caches[a.treeId]
        },
        getNextNode: function(a, b) {
            if (!b)
                return null ;
            for (var c = a.data.key.children, d = b.parentTId ? b.getParentNode() : data.getRoot(a), e = 0, f = d[c].length - 1; f >= e; e++)
                if (d[c][e] === b)
                    return e == f ? null  : d[c][e + 1];
            return null 
        },
        getNodeByParam: function(a, b, c, d) {
            if (!b || !c)
                return null ;
            for (var e = a.data.key.children, f = 0, g = b.length; g > f; f++) {
                if (b[f][c] == d)
                    return b[f];
                var h = data.getNodeByParam(a, b[f][e], c, d);
                if (h)
                    return h
            }
            return null 
        },
        getNodeCache: function(a, b) {
            if (!b)
                return null ;
            var c = caches[a.treeId].nodes[data.getNodeCacheId(b)];
            return c ? c : null 
        },
        getNodeName: function(a, b) {
            var c = a.data.key.name;
            return "" + b[c]
        },
        getNodeTitle: function(a, b) {
            var c = "" === a.data.key.title ? a.data.key.name : a.data.key.title;
            return "" + b[c]
        },
        getNodes: function(a) {
            return data.getRoot(a)[a.data.key.children]
        },
        getNodesByParam: function(a, b, c, d) {
            if (!b || !c)
                return [];
            for (var e = a.data.key.children, f = [], g = 0, h = b.length; h > g; g++)
                b[g][c] == d && f.push(b[g]),
                f = f.concat(data.getNodesByParam(a, b[g][e], c, d));
            return f
        },
        getNodesByParamFuzzy: function(a, b, c, d) {
            if (!b || !c)
                return [];
            var e = a.data.key.children
              , f = [];
            d = d.toLowerCase();
            for (var g = 0, h = b.length; h > g; g++)
                "string" == typeof b[g][c] && b[g][c].toLowerCase().indexOf(d) > -1 && f.push(b[g]),
                f = f.concat(data.getNodesByParamFuzzy(a, b[g][e], c, d));
            return f
        },
        getNodesByFilter: function(a, b, c, d, e) {
            if (!b)
                return d ? null  : [];
            for (var f = a.data.key.children, g = d ? null  : [], h = 0, i = b.length; i > h; h++) {
                if (tools.apply(c, [b[h], e], !1)) {
                    if (d)
                        return b[h];
                    g.push(b[h])
                }
                var j = data.getNodesByFilter(a, b[h][f], c, d, e);
                if (d && j)
                    return j;
                g = d ? j : g.concat(j)
            }
            return g
        },
        getPreNode: function(a, b) {
            if (!b)
                return null ;
            for (var c = a.data.key.children, d = b.parentTId ? b.getParentNode() : data.getRoot(a), e = 0, f = d[c].length; f > e; e++)
                if (d[c][e] === b)
                    return 0 == e ? null  : d[c][e - 1];
            return null 
        },
        getRoot: function(a) {
            return a ? roots[a.treeId] : null 
        },
        getRoots: function() {
            return roots
        },
        getSetting: function(a) {
            return settings[a]
        },
        getSettings: function() {
            return settings
        },
        getZTreeTools: function(a) {
            var b = this.getRoot(this.getSetting(a));
            return b ? b.treeTools : null 
        },
        initCache: function(a) {
            for (var b = 0, c = _init.caches.length; c > b; b++)
                _init.caches[b].apply(this, arguments)
        },
        initNode: function(a, b, c, d, e, f) {
            for (var g = 0, h = _init.nodes.length; h > g; g++)
                _init.nodes[g].apply(this, arguments)
        },
        initRoot: function(a) {
            for (var b = 0, c = _init.roots.length; c > b; b++)
                _init.roots[b].apply(this, arguments)
        },
        isSelectedNode: function(a, b) {
            for (var c = data.getRoot(a), d = 0, e = c.curSelectedList.length; e > d; d++)
                if (b === c.curSelectedList[d])
                    return !0;
            return !1
        },
        removeNodeCache: function(a, b) {
            var c = a.data.key.children;
            if (b[c])
                for (var d = 0, e = b[c].length; e > d; d++)
                    arguments.callee(a, b[c][d]);
            data.getCache(a).nodes[data.getNodeCacheId(b.tId)] = null 
        },
        removeSelectedNode: function(a, b) {
            for (var c = data.getRoot(a), d = 0, e = c.curSelectedList.length; e > d; d++)
                b !== c.curSelectedList[d] && data.getNodeCache(a, c.curSelectedList[d].tId) || (c.curSelectedList.splice(d, 1),
                d--,
                e--)
        },
        setCache: function(a, b) {
            caches[a.treeId] = b
        },
        setRoot: function(a, b) {
            roots[a.treeId] = b
        },
        setZTreeTools: function(a, b) {
            for (var c = 0, d = _init.zTreeTools.length; d > c; c++)
                _init.zTreeTools[c].apply(this, arguments)
        },
        transformToArrayFormat: function(a, b) {
            if (!b)
                return [];
            var c = a.data.key.children
              , d = [];
            if (tools.isArray(b))
                for (var e = 0, f = b.length; f > e; e++)
                    d.push(b[e]),
                    b[e][c] && (d = d.concat(data.transformToArrayFormat(a, b[e][c])));
            else
                d.push(b),
                b[c] && (d = d.concat(data.transformToArrayFormat(a, b[c])));
            return d
        },
        transformTozTreeFormat: function(a, b) {
            var c, d, e = a.data.simpleData.idKey, f = a.data.simpleData.pIdKey, g = a.data.key.children;
            if (!e || "" == e || !b)
                return [];
            if (tools.isArray(b)) {
                var h = []
                  , i = [];
                for (c = 0,
                d = b.length; d > c; c++)
                    i[b[c][e]] = b[c];
                for (c = 0,
                d = b.length; d > c; c++)
                    i[b[c][f]] && b[c][e] != b[c][f] ? (i[b[c][f]][g] || (i[b[c][f]][g] = []),
                    i[b[c][f]][g].push(b[c])) : h.push(b[c]);
                return h
            }
            return [b]
        }
    }
      , event = {
        bindEvent: function(a) {
            for (var b = 0, c = _init.bind.length; c > b; b++)
                _init.bind[b].apply(this, arguments)
        },
        unbindEvent: function(a) {
            for (var b = 0, c = _init.unbind.length; c > b; b++)
                _init.unbind[b].apply(this, arguments)
        },
        bindTree: function(a) {
            var b = {
                treeId: a.treeId
            }
              , c = a.treeObj;
            a.view.txtSelectedEnable || c.bind("selectstart", function(a) {
                var b = a.originalEvent.srcElement.nodeName.toLowerCase();
                return "input" === b || "textarea" === b
            }
            ).css({
                "-moz-user-select": "-moz-none"
            }),
            c.bind("click", b, event.proxy),
            c.bind("dblclick", b, event.proxy),
            c.bind("mouseover", b, event.proxy),
            c.bind("mouseout", b, event.proxy),
            c.bind("mousedown", b, event.proxy),
            c.bind("mouseup", b, event.proxy),
            c.bind("contextmenu", b, event.proxy)
        },
        unbindTree: function(a) {
            var b = a.treeObj;
            b.unbind("click", event.proxy).unbind("dblclick", event.proxy).unbind("mouseover", event.proxy).unbind("mouseout", event.proxy).unbind("mousedown", event.proxy).unbind("mouseup", event.proxy).unbind("contextmenu", event.proxy)
        },
        doProxy: function(a) {
            for (var b = [], c = 0, d = _init.proxys.length; d > c; c++) {
                var e = _init.proxys[c].apply(this, arguments);
                if (b.push(e),
                e.stop)
                    break
            }
            return b
        },
        proxy: function(a) {
            var b = data.getSetting(a.data.treeId);
            if (!tools.uCanDo(b, a))
                return !0;
            for (var c = event.doProxy(a), d = !0, e = !1, f = 0, g = c.length; g > f; f++) {
                var h = c[f];
                h.nodeEventCallback && (e = !0,
                d = h.nodeEventCallback.apply(h, [a, h.node]) && d),
                h.treeEventCallback && (e = !0,
                d = h.treeEventCallback.apply(h, [a, h.node]) && d)
            }
            return d
        }
    }
      , handler = {
        onSwitchNode: function(a, b) {
            var c = data.getSetting(a.data.treeId);
            if (b.open) {
                if (0 == tools.apply(c.callback.beforeCollapse, [c.treeId, b], !0))
                    return !0;
                data.getRoot(c).expandTriggerFlag = !0,
                view.switchNode(c, b)
            } else {
                if (0 == tools.apply(c.callback.beforeExpand, [c.treeId, b], !0))
                    return !0;
                data.getRoot(c).expandTriggerFlag = !0,
                view.switchNode(c, b)
            }
            return !0
        },
        onClickNode: function(a, b) {
            var c = data.getSetting(a.data.treeId)
              , d = c.view.autoCancelSelected && (a.ctrlKey || a.metaKey) && data.isSelectedNode(c, b) ? 0 : c.view.autoCancelSelected && (a.ctrlKey || a.metaKey) && c.view.selectedMulti ? 2 : 1;
            return 0 == tools.apply(c.callback.beforeClick, [c.treeId, b, d], !0) ? !0 : (0 === d ? view.cancelPreSelectedNode(c, b) : view.selectNode(c, b, 2 === d),
            c.treeObj.trigger(consts.event.CLICK, [a, c.treeId, b, d]),
            !0)
        },
        onZTreeMousedown: function(a, b) {
            var c = data.getSetting(a.data.treeId);
            return tools.apply(c.callback.beforeMouseDown, [c.treeId, b], !0) && tools.apply(c.callback.onMouseDown, [a, c.treeId, b]),
            !0
        },
        onZTreeMouseup: function(a, b) {
            var c = data.getSetting(a.data.treeId);
            return tools.apply(c.callback.beforeMouseUp, [c.treeId, b], !0) && tools.apply(c.callback.onMouseUp, [a, c.treeId, b]),
            !0
        },
        onZTreeDblclick: function(a, b) {
            var c = data.getSetting(a.data.treeId);
            return tools.apply(c.callback.beforeDblClick, [c.treeId, b], !0) && tools.apply(c.callback.onDblClick, [a, c.treeId, b]),
            !0
        },
        onZTreeContextmenu: function(a, b) {
            var c = data.getSetting(a.data.treeId);
            return tools.apply(c.callback.beforeRightClick, [c.treeId, b], !0) && tools.apply(c.callback.onRightClick, [a, c.treeId, b]),
            "function" != typeof c.callback.onRightClick
        }
    }
      , tools = {
        apply: function(a, b, c) {
            return "function" == typeof a ? a.apply(zt, b ? b : []) : c
        },
        canAsync: function(a, b) {
            var c = a.data.key.children;
            return a.async.enable && b && b.isParent && !(b.zAsync || b[c] && b[c].length > 0)
        },
        clone: function(a) {
            if (null  === a)
                return null ;
            var b = tools.isArray(a) ? [] : {};
            for (var c in a)
                b[c] = a[c] instanceof Date ? new Date(a[c].getTime()) : "object" == typeof a[c] ? arguments.callee(a[c]) : a[c];
            return b
        },
        eqs: function(a, b) {
            return a.toLowerCase() === b.toLowerCase()
        },
        isArray: function(a) {
            return "[object Array]" === Object.prototype.toString.apply(a)
        },
        $: function(a, b, c) {
            return b && "string" != typeof b && (c = b,
            b = ""),
            "string" == typeof a ? $(a, c ? c.treeObj.get(0).ownerDocument : null ) : $("#" + a.tId + b, c ? c.treeObj : null )
        },
        getMDom: function(a, b, c) {
            if (!b)
                return null ;
            for (; b && b.id !== a.treeId; ) {
                for (var d = 0, e = c.length; b.tagName && e > d; d++)
                    if (tools.eqs(b.tagName, c[d].tagName) && null  !== b.getAttribute(c[d].attrName))
                        return b;
                b = b.parentNode
            }
            return null 
        },
        getNodeMainDom: function(a) {
            return $(a).parent("li").get(0) || $(a).parentsUntil("li").parent().get(0)
        },
        isChildOrSelf: function(a, b) {
            return $(a).closest("#" + b).length > 0
        },
        uCanDo: function(a, b) {
            return !0
        }
    }
      , view = {
        addNodes: function(a, b, c, d) {
            if (!a.data.keep.leaf || !b || b.isParent)
                if (tools.isArray(c) || (c = [c]),
                a.data.simpleData.enable && (c = data.transformTozTreeFormat(a, c)),
                b) {
                    var e = $$(b, consts.id.SWITCH, a)
                      , f = $$(b, consts.id.ICON, a)
                      , g = $$(b, consts.id.UL, a);
                    b.open || (view.replaceSwitchClass(b, e, consts.folder.CLOSE),
                    view.replaceIcoClass(b, f, consts.folder.CLOSE),
                    b.open = !1,
                    g.css({
                        display: "none"
                    })),
                    data.addNodesData(a, b, c),
                    view.createNodes(a, b.level + 1, c, b),
                    d || view.expandCollapseParentNode(a, b, !0)
                } else
                    data.addNodesData(a, data.getRoot(a), c),
                    view.createNodes(a, 0, c, null )
        },
        appendNodes: function(a, b, c, d, e, f) {
            if (!c)
                return [];
            for (var g = [], h = a.data.key.children, i = 0, j = c.length; j > i; i++) {
                var k = c[i];
                if (e) {
                    var l = d ? d : data.getRoot(a)
                      , m = l[h]
                      , n = m.length == c.length && 0 == i
                      , o = i == c.length - 1;
                    data.initNode(a, b, k, d, n, o, f),
                    data.addNodeCache(a, k)
                }
                var p = [];
                k[h] && k[h].length > 0 && (p = view.appendNodes(a, b + 1, k[h], k, e, f && k.open)),
                f && (view.makeDOMNodeMainBefore(g, a, k),
                view.makeDOMNodeLine(g, a, k),
                data.getBeforeA(a, k, g),
                view.makeDOMNodeNameBefore(g, a, k),
                data.getInnerBeforeA(a, k, g),
                view.makeDOMNodeIcon(g, a, k),
                data.getInnerAfterA(a, k, g),
                view.makeDOMNodeNameAfter(g, a, k),
                data.getAfterA(a, k, g),
                k.isParent && k.open && view.makeUlHtml(a, k, g, p.join("")),
                view.makeDOMNodeMainAfter(g, a, k),
                data.addCreatedNode(a, k))
            }
            return g
        },
        appendParentULDom: function(a, b) {
            var c = []
              , d = $$(b, a);
            !d.get(0) && b.parentTId && (view.appendParentULDom(a, b.getParentNode()),
            d = $$(b, a));
            var e = $$(b, consts.id.UL, a);
            e.get(0) && e.remove();
            var f = a.data.key.children
              , g = view.appendNodes(a, b.level + 1, b[f], b, !1, !0);
            view.makeUlHtml(a, b, c, g.join("")),
            d.append(c.join(""))
        },
        asyncNode: function(setting, node, isSilent, callback) {
            var i, l;
            if (node && !node.isParent)
                return tools.apply(callback),
                !1;
            if (node && node.isAjaxing)
                return !1;
            if (0 == tools.apply(setting.callback.beforeAsync, [setting.treeId, node], !0))
                return tools.apply(callback),
                !1;
            if (node) {
                node.isAjaxing = !0;
                var icoObj = $$(node, consts.id.ICON, setting);
                icoObj.attr({
                    style: "",
                    "class": consts.className.BUTTON + " " + consts.className.ICO_LOADING
                })
            }
            var tmpParam = {};
            for (i = 0,
            l = setting.async.autoParam.length; node && l > i; i++) {
                var pKey = setting.async.autoParam[i].split("=")
                  , spKey = pKey;
                pKey.length > 1 && (spKey = pKey[1],
                pKey = pKey[0]),
                tmpParam[spKey] = node[pKey]
            }
            if (tools.isArray(setting.async.otherParam))
                for (i = 0,
                l = setting.async.otherParam.length; l > i; i += 2)
                    tmpParam[setting.async.otherParam[i]] = setting.async.otherParam[i + 1];
            else
                for (var p in setting.async.otherParam)
                    tmpParam[p] = setting.async.otherParam[p];
            var _tmpV = data.getRoot(setting)._ver;
            return $.ajax({
                contentType: setting.async.contentType,
                type: setting.async.type,
                url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
                data: tmpParam,
                dataType: setting.async.dataType,
                success: function(msg) {
                    if (_tmpV == data.getRoot(setting)._ver) {
                        var newNodes = [];
                        try {
                            newNodes = msg && 0 != msg.length ? "string" == typeof msg ? eval("(" + msg + ")") : msg : []
                        } catch (err) {
                            newNodes = msg
                        }
                        node && (node.isAjaxing = null ,
                        node.zAsync = !0),
                        view.setNodeLineIcos(setting, node),
                        newNodes && "" !== newNodes ? (newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes),
                        view.addNodes(setting, node, newNodes ? tools.clone(newNodes) : [], !!isSilent)) : view.addNodes(setting, node, [], !!isSilent),
                        setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]),
                        tools.apply(callback)
                    }
                },
                error: function(a, b, c) {
                    _tmpV == data.getRoot(setting)._ver && (node && (node.isAjaxing = null ),
                    view.setNodeLineIcos(setting, node),
                    setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, a, b, c]))
                }
            }),
            !0
        },
        cancelPreSelectedNode: function(a, b) {
            for (var c = data.getRoot(a).curSelectedList, d = 0, e = c.length - 1; e >= d; e--)
                if ((!b || b === c[e]) && ($$(c[e], consts.id.A, a).removeClass(consts.node.CURSELECTED),
                b)) {
                    data.removeSelectedNode(a, b);
                    break
                }
            b || (data.getRoot(a).curSelectedList = [])
        },
        createNodeCallback: function(a) {
            if (a.callback.onNodeCreated || a.view.addDiyDom)
                for (var b = data.getRoot(a); b.createdNodes.length > 0; ) {
                    var c = b.createdNodes.shift();
                    tools.apply(a.view.addDiyDom, [a.treeId, c]),
                    a.callback.onNodeCreated && a.treeObj.trigger(consts.event.NODECREATED, [a.treeId, c])
                }
        },
        createNodes: function(a, b, c, d) {
            if (c && 0 != c.length) {
                var e = data.getRoot(a)
                  , f = a.data.key.children
                  , g = !d || d.open || !!$$(d[f][0], a).get(0);
                e.createdNodes = [];
                var h = view.appendNodes(a, b, c, d, !0, g);
                if (d) {
                    var i = $$(d, consts.id.UL, a);
                    i.get(0) && i.append(h.join(""))
                } else
                    a.treeObj.append(h.join(""));
                view.createNodeCallback(a)
            }
        },
        destroy: function(a) {
            a && (data.initCache(a),
            data.initRoot(a),
            event.unbindTree(a),
            event.unbindEvent(a),
            a.treeObj.empty(),
            delete settings[a.treeId])
        },
        expandCollapseNode: function(a, b, c, d, e) {
            var f = data.getRoot(a)
              , g = a.data.key.children;
            if (!b)
                return void tools.apply(e, []);
            if (f.expandTriggerFlag) {
                var h = e;
                e = function() {
                    h && h(),
                    b.open ? a.treeObj.trigger(consts.event.EXPAND, [a.treeId, b]) : a.treeObj.trigger(consts.event.COLLAPSE, [a.treeId, b])
                }
                ,
                f.expandTriggerFlag = !1
            }
            if (!b.open && b.isParent && (!$$(b, consts.id.UL, a).get(0) || b[g] && b[g].length > 0 && !$$(b[g][0], a).get(0)) && (view.appendParentULDom(a, b),
            view.createNodeCallback(a)),
            b.open == c)
                return void tools.apply(e, []);
            var i = $$(b, consts.id.UL, a)
              , j = $$(b, consts.id.SWITCH, a)
              , k = $$(b, consts.id.ICON, a);
            b.isParent ? (b.open = !b.open,
            b.iconOpen && b.iconClose && k.attr("style", view.makeNodeIcoStyle(a, b)),
            b.open ? (view.replaceSwitchClass(b, j, consts.folder.OPEN),
            view.replaceIcoClass(b, k, consts.folder.OPEN),
            0 == d || "" == a.view.expandSpeed ? (i.show(),
            tools.apply(e, [])) : b[g] && b[g].length > 0 ? i.slideDown(a.view.expandSpeed, e) : (i.show(),
            tools.apply(e, []))) : (view.replaceSwitchClass(b, j, consts.folder.CLOSE),
            view.replaceIcoClass(b, k, consts.folder.CLOSE),
            0 != d && "" != a.view.expandSpeed && b[g] && b[g].length > 0 ? i.slideUp(a.view.expandSpeed, e) : (i.hide(),
            tools.apply(e, [])))) : tools.apply(e, [])
        },
        expandCollapseParentNode: function(a, b, c, d, e) {
            if (b) {
                if (!b.parentTId)
                    return void view.expandCollapseNode(a, b, c, d, e);
                view.expandCollapseNode(a, b, c, d),
                b.parentTId && view.expandCollapseParentNode(a, b.getParentNode(), c, d, e)
            }
        },
        expandCollapseSonNode: function(a, b, c, d, e) {
            var f = data.getRoot(a)
              , g = a.data.key.children
              , h = b ? b[g] : f[g]
              , i = b ? !1 : d
              , j = data.getRoot(a).expandTriggerFlag;
            if (data.getRoot(a).expandTriggerFlag = !1,
            h)
                for (var k = 0, l = h.length; l > k; k++)
                    h[k] && view.expandCollapseSonNode(a, h[k], c, i);
            data.getRoot(a).expandTriggerFlag = j,
            view.expandCollapseNode(a, b, c, d, e)
        },
        makeDOMNodeIcon: function(a, b, c) {
            var d = data.getNodeName(b, c)
              , e = b.view.nameIsHTML ? d : d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            a.push("<span id='", c.tId, consts.id.ICON, "' title='' treeNode", consts.id.ICON, " class='", view.makeNodeIcoClass(b, c), "' style='", view.makeNodeIcoStyle(b, c), "'></span><span id='", c.tId, consts.id.SPAN, "'>", e, "</span>")
        },
        makeDOMNodeLine: function(a, b, c) {
            a.push("<span id='", c.tId, consts.id.SWITCH, "' title='' class='", view.makeNodeLineClass(b, c), "' treeNode", consts.id.SWITCH, "></span>")
        },
        makeDOMNodeMainAfter: function(a, b, c) {
            a.push("</li>")
        },
        makeDOMNodeMainBefore: function(a, b, c) {
            a.push("<li id='", c.tId, "' class='", consts.className.LEVEL, c.level, "' tabindex='0' hidefocus='true' treenode>")
        },
        makeDOMNodeNameAfter: function(a, b, c) {
            a.push("</a>")
        },
        makeDOMNodeNameBefore: function(a, b, c) {
            var d = data.getNodeTitle(b, c)
              , e = view.makeNodeUrl(b, c)
              , f = view.makeNodeFontCss(b, c)
              , g = [];
            for (var h in f)
                g.push(h, ":", f[h], ";");
            a.push("<a id='", c.tId, consts.id.A, "' class='", consts.className.LEVEL, c.level, "' treeNode", consts.id.A, ' onclick="', c.click || "", '" ', null  != e && e.length > 0 ? "href='" + e + "'" : "", " target='", view.makeNodeTarget(c), "' style='", g.join(""), "'"),
            tools.apply(b.view.showTitle, [b.treeId, c], b.view.showTitle) && d && a.push("title='", d.replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "'"),
            a.push(">")
        },
        makeNodeFontCss: function(a, b) {
            var c = tools.apply(a.view.fontCss, [a.treeId, b], a.view.fontCss);
            return c && "function" != typeof c ? c : {}
        },
        makeNodeIcoClass: function(a, b) {
            var c = ["ico"];
            return b.isAjaxing || (c[0] = (b.iconSkin ? b.iconSkin + "_" : "") + c[0],
            b.isParent ? c.push(b.open ? consts.folder.OPEN : consts.folder.CLOSE) : c.push(consts.folder.DOCU)),
            consts.className.BUTTON + " " + c.join("_")
        },
        makeNodeIcoStyle: function(a, b) {
            var c = [];
            if (!b.isAjaxing) {
                var d = b.isParent && b.iconOpen && b.iconClose ? b.open ? b.iconOpen : b.iconClose : b.icon;
                d && c.push("background:url(", d, ") 0 0 no-repeat;"),
                0 != a.view.showIcon && tools.apply(a.view.showIcon, [a.treeId, b], !0) || c.push("width:0px;height:0px;")
            }
            return c.join("")
        },
        makeNodeLineClass: function(a, b) {
            var c = [];
            return a.view.showLine ? 0 == b.level && b.isFirstNode && b.isLastNode ? c.push(consts.line.ROOT) : 0 == b.level && b.isFirstNode ? c.push(consts.line.ROOTS) : b.isLastNode ? c.push(consts.line.BOTTOM) : c.push(consts.line.CENTER) : c.push(consts.line.NOLINE),
            b.isParent ? c.push(b.open ? consts.folder.OPEN : consts.folder.CLOSE) : c.push(consts.folder.DOCU),
            view.makeNodeLineClassEx(b) + c.join("_")
        },
        makeNodeLineClassEx: function(a) {
            return consts.className.BUTTON + " " + consts.className.LEVEL + a.level + " " + consts.className.SWITCH + " "
        },
        makeNodeTarget: function(a) {
            return a.target || "_blank"
        },
        makeNodeUrl: function(a, b) {
            var c = a.data.key.url;
            return b[c] ? b[c] : null 
        },
        makeUlHtml: function(a, b, c, d) {
            c.push("<ul id='", b.tId, consts.id.UL, "' class='", consts.className.LEVEL, b.level, " ", view.makeUlLineClass(a, b), "' style='display:", b.open ? "block" : "none", "'>"),
            c.push(d),
            c.push("</ul>")
        },
        makeUlLineClass: function(a, b) {
            return a.view.showLine && !b.isLastNode ? consts.line.LINE : ""
        },
        removeChildNodes: function(a, b) {
            if (b) {
                var c = a.data.key.children
                  , d = b[c];
                if (d) {
                    for (var e = 0, f = d.length; f > e; e++)
                        data.removeNodeCache(a, d[e]);
                    if (data.removeSelectedNode(a),
                    delete b[c],
                    a.data.keep.parent)
                        $$(b, consts.id.UL, a).empty();
                    else {
                        b.isParent = !1,
                        b.open = !1;
                        var g = $$(b, consts.id.SWITCH, a)
                          , h = $$(b, consts.id.ICON, a);
                        view.replaceSwitchClass(b, g, consts.folder.DOCU),
                        view.replaceIcoClass(b, h, consts.folder.DOCU),
                        $$(b, consts.id.UL, a).remove()
                    }
                }
            }
        },
        setFirstNode: function(a, b) {
            var c = a.data.key.children
              , d = b[c].length;
            d > 0 && (b[c][0].isFirstNode = !0)
        },
        setLastNode: function(a, b) {
            var c = a.data.key.children
              , d = b[c].length;
            d > 0 && (b[c][d - 1].isLastNode = !0)
        },
        removeNode: function(a, b) {
            var c = data.getRoot(a)
              , d = a.data.key.children
              , e = b.parentTId ? b.getParentNode() : c;
            if (b.isFirstNode = !1,
            b.isLastNode = !1,
            b.getPreNode = function() {
                return null 
            }
            ,
            b.getNextNode = function() {
                return null 
            }
            ,
            data.getNodeCache(a, b.tId)) {
                $$(b, a).remove(),
                data.removeNodeCache(a, b),
                data.removeSelectedNode(a, b);
                for (var f = 0, g = e[d].length; g > f; f++)
                    if (e[d][f].tId == b.tId) {
                        e[d].splice(f, 1);
                        break
                    }
                view.setFirstNode(a, e),
                view.setLastNode(a, e);
                var h, i, j, k = e[d].length;
                if (a.data.keep.parent || 0 != k) {
                    if (a.view.showLine && k > 0) {
                        var l = e[d][k - 1];
                        if (h = $$(l, consts.id.UL, a),
                        i = $$(l, consts.id.SWITCH, a),
                        j = $$(l, consts.id.ICON, a),
                        e == c)
                            if (1 == e[d].length)
                                view.replaceSwitchClass(l, i, consts.line.ROOT);
                            else {
                                var m = $$(e[d][0], consts.id.SWITCH, a);
                                view.replaceSwitchClass(e[d][0], m, consts.line.ROOTS),
                                view.replaceSwitchClass(l, i, consts.line.BOTTOM)
                            }
                        else
                            view.replaceSwitchClass(l, i, consts.line.BOTTOM);
                        h.removeClass(consts.line.LINE)
                    }
                } else
                    e.isParent = !1,
                    e.open = !1,
                    h = $$(e, consts.id.UL, a),
                    i = $$(e, consts.id.SWITCH, a),
                    j = $$(e, consts.id.ICON, a),
                    view.replaceSwitchClass(e, i, consts.folder.DOCU),
                    view.replaceIcoClass(e, j, consts.folder.DOCU),
                    h.css("display", "none")
            }
        },
        replaceIcoClass: function(a, b, c) {
            if (b && !a.isAjaxing) {
                var d = b.attr("class");
                if (void 0 != d) {
                    var e = d.split("_");
                    switch (c) {
                    case consts.folder.OPEN:
                    case consts.folder.CLOSE:
                    case consts.folder.DOCU:
                        e[e.length - 1] = c
                    }
                    b.attr("class", e.join("_"))
                }
            }
        },
        replaceSwitchClass: function(a, b, c) {
            if (b) {
                var d = b.attr("class");
                if (void 0 != d) {
                    var e = d.split("_");
                    switch (c) {
                    case consts.line.ROOT:
                    case consts.line.ROOTS:
                    case consts.line.CENTER:
                    case consts.line.BOTTOM:
                    case consts.line.NOLINE:
                        e[0] = view.makeNodeLineClassEx(a) + c;
                        break;
                    case consts.folder.OPEN:
                    case consts.folder.CLOSE:
                    case consts.folder.DOCU:
                        e[1] = c
                    }
                    b.attr("class", e.join("_")),
                    c !== consts.folder.DOCU ? b.removeAttr("disabled") : b.attr("disabled", "disabled")
                }
            }
        },
        selectNode: function(a, b, c) {
            c || view.cancelPreSelectedNode(a),
            $$(b, consts.id.A, a).addClass(consts.node.CURSELECTED),
            data.addSelectedNode(a, b)
        },
        setNodeFontCss: function(a, b) {
            var c = $$(b, consts.id.A, a)
              , d = view.makeNodeFontCss(a, b);
            d && c.css(d)
        },
        setNodeLineIcos: function(a, b) {
            if (b) {
                var c = $$(b, consts.id.SWITCH, a)
                  , d = $$(b, consts.id.UL, a)
                  , e = $$(b, consts.id.ICON, a)
                  , f = view.makeUlLineClass(a, b);
                0 == f.length ? d.removeClass(consts.line.LINE) : d.addClass(f),
                c.attr("class", view.makeNodeLineClass(a, b)),
                b.isParent ? c.removeAttr("disabled") : c.attr("disabled", "disabled"),
                e.removeAttr("style"),
                e.attr("style", view.makeNodeIcoStyle(a, b)),
                e.attr("class", view.makeNodeIcoClass(a, b))
            }
        },
        setNodeName: function(a, b) {
            var c = data.getNodeTitle(a, b)
              , d = $$(b, consts.id.SPAN, a);
            if (d.empty(),
            a.view.nameIsHTML ? d.html(data.getNodeName(a, b)) : d.text(data.getNodeName(a, b)),
            tools.apply(a.view.showTitle, [a.treeId, b], a.view.showTitle)) {
                var e = $$(b, consts.id.A, a);
                e.attr("title", c ? c : "")
            }
        },
        setNodeTarget: function(a, b) {
            var c = $$(b, consts.id.A, a);
            c.attr("target", view.makeNodeTarget(b))
        },
        setNodeUrl: function(a, b) {
            var c = $$(b, consts.id.A, a)
              , d = view.makeNodeUrl(a, b);
            null  == d || 0 == d.length ? c.removeAttr("href") : c.attr("href", d)
        },
        switchNode: function(a, b) {
            if (b.open || !tools.canAsync(a, b))
                view.expandCollapseNode(a, b, !b.open);
            else if (a.async.enable) {
                if (!view.asyncNode(a, b))
                    return void view.expandCollapseNode(a, b, !b.open)
            } else
                b && view.expandCollapseNode(a, b, !b.open)
        }
    };
    $.fn.zTree = {
        consts: _consts,
        _z: {
            tools: tools,
            view: view,
            event: event,
            data: data
        },
        getZTreeObj: function(a) {
            var b = data.getZTreeTools(a);
            return b ? b : null 
        },
        destroy: function(a) {
            if (a && a.length > 0)
                view.destroy(data.getSetting(a));
            else
                for (var b in settings)
                    view.destroy(settings[b])
        },
        init: function(a, b, c) {
            var d = tools.clone(_setting);
            $.extend(!0, d, b),
            d.treeId = a.attr("id"),
            d.treeObj = a,
            d.treeObj.empty(),
            settings[d.treeId] = d,
            "undefined" == typeof document.body.style.maxHeight && (d.view.expandSpeed = ""),
            data.initRoot(d);
            var e = data.getRoot(d)
              , f = d.data.key.children;
            c = c ? tools.clone(tools.isArray(c) ? c : [c]) : [],
            d.data.simpleData.enable ? e[f] = data.transformTozTreeFormat(d, c) : e[f] = c,
            data.initCache(d),
            event.unbindTree(d),
            event.bindTree(d),
            event.unbindEvent(d),
            event.bindEvent(d);
            var g = {
                setting: d,
                addNodes: function(a, b, c) {
                    function e() {
                        view.addNodes(d, a, f, 1 == c)
                    }
                    if (!b)
                        return null ;
                    if (a || (a = null ),
                    a && !a.isParent && d.data.keep.leaf)
                        return null ;
                    var f = tools.clone(tools.isArray(b) ? b : [b]);
                    return tools.canAsync(d, a) ? view.asyncNode(d, a, c, e) : e(),
                    f
                },
                cancelSelectedNode: function(a) {
                    view.cancelPreSelectedNode(d, a)
                },
                destroy: function() {
                    view.destroy(d)
                },
                expandAll: function(a) {
                    return a = !!a,
                    view.expandCollapseSonNode(d, null , a, !0),
                    a
                },
                expandNode: function(a, b, c, e, f) {
                    if (!a || !a.isParent)
                        return null ;
                    if (b !== !0 && b !== !1 && (b = !a.open),
                    f = !!f,
                    f && b && 0 == tools.apply(d.callback.beforeExpand, [d.treeId, a], !0))
                        return null ;
                    if (f && !b && 0 == tools.apply(d.callback.beforeCollapse, [d.treeId, a], !0))
                        return null ;
                    if (b && a.parentTId && view.expandCollapseParentNode(d, a.getParentNode(), b, !1),
                    b === a.open && !c)
                        return null ;
                    if (data.getRoot(d).expandTriggerFlag = f,
                    !tools.canAsync(d, a) && c)
                        view.expandCollapseSonNode(d, a, b, !0, function() {
                            if (e !== !1)
                                try {
                                    $$(a, d).focus().blur()
                                } catch (b) {}
                        }
                        );
                    else if (a.open = !b,
                    view.switchNode(this.setting, a),
                    e !== !1)
                        try {
                            $$(a, d).focus().blur()
                        } catch (g) {}
                    return b
                },
                getNodes: function() {
                    return data.getNodes(d)
                },
                getNodeByParam: function(a, b, c) {
                    return a ? data.getNodeByParam(d, c ? c[d.data.key.children] : data.getNodes(d), a, b) : null 
                },
                getNodeByTId: function(a) {
                    return data.getNodeCache(d, a)
                },
                getNodesByParam: function(a, b, c) {
                    return a ? data.getNodesByParam(d, c ? c[d.data.key.children] : data.getNodes(d), a, b) : null 
                },
                getNodesByParamFuzzy: function(a, b, c) {
                    return a ? data.getNodesByParamFuzzy(d, c ? c[d.data.key.children] : data.getNodes(d), a, b) : null 
                },
                getNodesByFilter: function(a, b, c, e) {
                    return b = !!b,
                    a && "function" == typeof a ? data.getNodesByFilter(d, c ? c[d.data.key.children] : data.getNodes(d), a, b, e) : b ? null  : []
                },
                getNodeIndex: function(a) {
                    if (!a)
                        return null ;
                    for (var b = d.data.key.children, c = a.parentTId ? a.getParentNode() : data.getRoot(d), e = 0, f = c[b].length; f > e; e++)
                        if (c[b][e] == a)
                            return e;
                    return -1
                },
                getSelectedNodes: function() {
                    for (var a = [], b = data.getRoot(d).curSelectedList, c = 0, e = b.length; e > c; c++)
                        a.push(b[c]);
                    return a
                },
                isSelectedNode: function(a) {
                    return data.isSelectedNode(d, a)
                },
                reAsyncChildNodes: function(a, b, c) {
                    if (this.setting.async.enable) {
                        var e = !a;
                        if (e && (a = data.getRoot(d)),
                        "refresh" == b) {
                            for (var f = this.setting.data.key.children, g = 0, h = a[f] ? a[f].length : 0; h > g; g++)
                                data.removeNodeCache(d, a[f][g]);
                            if (data.removeSelectedNode(d),
                            a[f] = [],
                            e)
                                this.setting.treeObj.empty();
                            else {
                                var i = $$(a, consts.id.UL, d);
                                i.empty()
                            }
                        }
                        view.asyncNode(this.setting, e ? null  : a, !!c)
                    }
                },
                refresh: function() {
                    this.setting.treeObj.empty();
                    var a = data.getRoot(d)
                      , b = a[d.data.key.children];
                    data.initRoot(d),
                    a[d.data.key.children] = b,
                    data.initCache(d),
                    view.createNodes(d, 0, a[d.data.key.children])
                },
                removeChildNodes: function(a) {
                    if (!a)
                        return null ;
                    var b = d.data.key.children
                      , c = a[b];
                    return view.removeChildNodes(d, a),
                    c ? c : null 
                },
                removeNode: function(a, b) {
                    a && (b = !!b,
                    b && 0 == tools.apply(d.callback.beforeRemove, [d.treeId, a], !0) || (view.removeNode(d, a),
                    b && this.setting.treeObj.trigger(consts.event.REMOVE, [d.treeId, a])))
                },
                selectNode: function(a, b) {
                    if (a && tools.uCanDo(d)) {
                        if (b = d.view.selectedMulti && b,
                        a.parentTId)
                            view.expandCollapseParentNode(d, a.getParentNode(), !0, !1, function() {
                                try {
                                    $$(a, d).focus().blur()
                                } catch (b) {}
                            }
                            );
                        else
                            try {
                                $$(a, d).focus().blur()
                            } catch (c) {}
                        view.selectNode(d, a, b)
                    }
                },
                transformTozTreeNodes: function(a) {
                    return data.transformTozTreeFormat(d, a)
                },
                transformToArray: function(a) {
                    return data.transformToArrayFormat(d, a)
                },
                updateNode: function(a, b) {
                    if (a) {
                        var c = $$(a, d);
                        c.get(0) && tools.uCanDo(d) && (view.setNodeName(d, a),
                        view.setNodeTarget(d, a),
                        view.setNodeUrl(d, a),
                        view.setNodeLineIcos(d, a),
                        view.setNodeFontCss(d, a))
                    }
                }
            };
            return e.treeTools = g,
            data.setZTreeTools(d, g),
            e[f] && e[f].length > 0 ? view.createNodes(d, 0, e[f]) : d.async.enable && d.async.url && "" !== d.async.url && view.asyncNode(d),
            g
        }
    };
    var zt = $.fn.zTree
      , $$ = tools.$
      , consts = zt.consts
}
(jQuery),
function(a) {
    var b = {
        event: {
            CHECK: "ztree_check"
        },
        id: {
            CHECK: "_check"
        },
        checkbox: {
            STYLE: "checkbox",
            DEFAULT: "chk",
            DISABLED: "disable",
            FALSE: "false",
            TRUE: "true",
            FULL: "full",
            PART: "part",
            FOCUS: "focus"
        },
        radio: {
            STYLE: "radio",
            TYPE_ALL: "all",
            TYPE_LEVEL: "level"
        }
    }
      , c = {
        check: {
            enable: !1,
            autoCheckTrigger: !1,
            chkStyle: b.checkbox.STYLE,
            nocheckInherit: !1,
            chkDisabledInherit: !1,
            radioType: b.radio.TYPE_LEVEL,
            chkboxType: {
                Y: "ps",
                N: "ps"
            }
        },
        data: {
            key: {
                checked: "checked"
            }
        },
        callback: {
            beforeCheck: null ,
            onCheck: null 
        }
    }
      , d = function(a) {
        var b = v.getRoot(a);
        b.radioCheckedList = []
    }
      , e = function(a) {}
      , f = function(a) {
        var b = a.treeObj
          , c = t.event;
        b.bind(c.CHECK, function(b, c, d, e) {
            b.srcEvent = c,
            s.apply(a.callback.onCheck, [b, d, e])
        }
        )
    }
      , g = function(a) {
        var b = a.treeObj
          , c = t.event;
        b.unbind(c.CHECK)
    }
      , h = function(a) {
        var b = a.target
          , c = v.getSetting(a.data.treeId)
          , d = ""
          , e = null 
          , f = ""
          , g = ""
          , h = null 
          , i = null ;
        if (s.eqs(a.type, "mouseover") ? c.check.enable && s.eqs(b.tagName, "span") && null  !== b.getAttribute("treeNode" + t.id.CHECK) && (d = s.getNodeMainDom(b).id,
        f = "mouseoverCheck") : s.eqs(a.type, "mouseout") ? c.check.enable && s.eqs(b.tagName, "span") && null  !== b.getAttribute("treeNode" + t.id.CHECK) && (d = s.getNodeMainDom(b).id,
        f = "mouseoutCheck") : s.eqs(a.type, "click") && c.check.enable && s.eqs(b.tagName, "span") && null  !== b.getAttribute("treeNode" + t.id.CHECK) && (d = s.getNodeMainDom(b).id,
        f = "checkNode"),
        d.length > 0)
            switch (e = v.getNodeCache(c, d),
            f) {
            case "checkNode":
                h = n.onCheckNode;
                break;
            case "mouseoverCheck":
                h = n.onMouseoverCheck;
                break;
            case "mouseoutCheck":
                h = n.onMouseoutCheck
            }
        var j = {
            stop: "checkNode" === f,
            node: e,
            nodeEventType: f,
            nodeEventCallback: h,
            treeEventType: g,
            treeEventCallback: i
        };
        return j
    }
      , i = function(a, b, c, d, e, f, g) {
        if (c) {
            var h = a.data.key.checked;
            if ("string" == typeof c[h] && (c[h] = s.eqs(c[h], "true")),
            c[h] = !!c[h],
            c.checkedOld = c[h],
            "string" == typeof c.nocheck && (c.nocheck = s.eqs(c.nocheck, "true")),
            c.nocheck = !!c.nocheck || a.check.nocheckInherit && d && !!d.nocheck,
            "string" == typeof c.chkDisabled && (c.chkDisabled = s.eqs(c.chkDisabled, "true")),
            c.chkDisabled = !!c.chkDisabled || a.check.chkDisabledInherit && d && !!d.chkDisabled,
            "string" == typeof c.halfCheck && (c.halfCheck = s.eqs(c.halfCheck, "true")),
            c.halfCheck = !!c.halfCheck,
            c.check_Child_State = -1,
            c.check_Focus = !1,
            c.getCheckStatus = function() {
                return v.getCheckStatus(a, c)
            }
            ,
            a.check.chkStyle == t.radio.STYLE && a.check.radioType == t.radio.TYPE_ALL && c[h]) {
                var i = v.getRoot(a);
                i.radioCheckedList.push(c)
            }
        }
    }
      , j = function(a, b, c) {
        a.data.key.checked;
        a.check.enable && (v.makeChkFlag(a, b),
        c.push("<span ID='", b.tId, t.id.CHECK, "' class='", u.makeChkClass(a, b), "' treeNode", t.id.CHECK, b.nocheck === !0 ? " style='display:none;'" : "", "></span>"))
    }
      , k = function(a, b) {
        b.checkNode = function(a, b, c, d) {
            var e = this.setting.data.key.checked;
            if (a.chkDisabled !== !0 && (b !== !0 && b !== !1 && (b = !a[e]),
            d = !!d,
            (a[e] !== b || c) && (!d || 0 != s.apply(this.setting.callback.beforeCheck, [this.setting.treeId, a], !0)) && s.uCanDo(this.setting) && this.setting.check.enable && a.nocheck !== !0)) {
                a[e] = b;
                var f = w(a, t.id.CHECK, this.setting);
                (c || this.setting.check.chkStyle === t.radio.STYLE) && u.checkNodeRelation(this.setting, a),
                u.setChkClass(this.setting, f, a),
                u.repairParentChkClassWithSelf(this.setting, a),
                d && this.setting.treeObj.trigger(t.event.CHECK, [null , this.setting.treeId, a])
            }
        }
        ,
        b.checkAllNodes = function(a) {
            u.repairAllChk(this.setting, !!a)
        }
        ,
        b.getCheckedNodes = function(a) {
            var b = this.setting.data.key.children;
            return a = a !== !1,
            v.getTreeCheckedNodes(this.setting, v.getRoot(this.setting)[b], a)
        }
        ,
        b.getChangeCheckedNodes = function() {
            var a = this.setting.data.key.children;
            return v.getTreeChangeCheckedNodes(this.setting, v.getRoot(this.setting)[a])
        }
        ,
        b.setChkDisabled = function(a, b, c, d) {
            b = !!b,
            c = !!c,
            d = !!d,
            u.repairSonChkDisabled(this.setting, a, b, d),
            u.repairParentChkDisabled(this.setting, a.getParentNode(), b, c)
        }
        ;
        var c = b.updateNode;
        b.updateNode = function(a, d) {
            if (c && c.apply(b, arguments),
            a && this.setting.check.enable) {
                var e = w(a, this.setting);
                if (e.get(0) && s.uCanDo(this.setting)) {
                    var f = w(a, t.id.CHECK, this.setting);
                    (1 == d || this.setting.check.chkStyle === t.radio.STYLE) && u.checkNodeRelation(this.setting, a),
                    u.setChkClass(this.setting, f, a),
                    u.repairParentChkClassWithSelf(this.setting, a)
                }
            }
        }
    }
      , l = {
        getRadioCheckedList: function(a) {
            for (var b = v.getRoot(a).radioCheckedList, c = 0, d = b.length; d > c; c++)
                v.getNodeCache(a, b[c].tId) || (b.splice(c, 1),
                c--,
                d--);
            return b
        },
        getCheckStatus: function(a, b) {
            if (!a.check.enable || b.nocheck || b.chkDisabled)
                return null ;
            var c = a.data.key.checked
              , d = {
                checked: b[c],
                half: b.halfCheck ? b.halfCheck : a.check.chkStyle == t.radio.STYLE ? 2 === b.check_Child_State : b[c] ? b.check_Child_State > -1 && b.check_Child_State < 2 : b.check_Child_State > 0
            };
            return d
        },
        getTreeCheckedNodes: function(a, b, c, d) {
            if (!b)
                return [];
            var e = a.data.key.children
              , f = a.data.key.checked
              , g = c && a.check.chkStyle == t.radio.STYLE && a.check.radioType == t.radio.TYPE_ALL;
            d = d ? d : [];
            for (var h = 0, i = b.length; i > h && (b[h].nocheck === !0 || b[h].chkDisabled === !0 || b[h][f] != c || (d.push(b[h]),
            !g)) && (v.getTreeCheckedNodes(a, b[h][e], c, d),
            !(g && d.length > 0)); h++)
                ;
            return d
        },
        getTreeChangeCheckedNodes: function(a, b, c) {
            if (!b)
                return [];
            var d = a.data.key.children
              , e = a.data.key.checked;
            c = c ? c : [];
            for (var f = 0, g = b.length; g > f; f++)
                b[f].nocheck !== !0 && b[f].chkDisabled !== !0 && b[f][e] != b[f].checkedOld && c.push(b[f]),
                v.getTreeChangeCheckedNodes(a, b[f][d], c);
            return c
        },
        makeChkFlag: function(a, b) {
            if (b) {
                var c = a.data.key.children
                  , d = a.data.key.checked
                  , e = -1;
                if (b[c])
                    for (var f = 0, g = b[c].length; g > f; f++) {
                        var h = b[c][f]
                          , i = -1;
                        if (a.check.chkStyle == t.radio.STYLE) {
                            if (i = h.nocheck === !0 || h.chkDisabled === !0 ? h.check_Child_State : h.halfCheck === !0 ? 2 : h[d] ? 2 : h.check_Child_State > 0 ? 2 : 0,
                            2 == i) {
                                e = 2;
                                break
                            }
                            0 == i && (e = 0)
                        } else if (a.check.chkStyle == t.checkbox.STYLE) {
                            if (i = h.nocheck === !0 || h.chkDisabled === !0 ? h.check_Child_State : h.halfCheck === !0 ? 1 : h[d] ? -1 === h.check_Child_State || 2 === h.check_Child_State ? 2 : 1 : h.check_Child_State > 0 ? 1 : 0,
                            1 === i) {
                                e = 1;
                                break
                            }
                            if (2 === i && e > -1 && f > 0 && i !== e) {
                                e = 1;
                                break
                            }
                            if (2 === e && i > -1 && 2 > i) {
                                e = 1;
                                break
                            }
                            i > -1 && (e = i)
                        }
                    }
                b.check_Child_State = e;
            }
        }
    }
      , m = {}
      , n = {
        onCheckNode: function(a, b) {
            if (b.chkDisabled === !0)
                return !1;
            var c = v.getSetting(a.data.treeId)
              , d = c.data.key.checked;
            if (0 == s.apply(c.callback.beforeCheck, [c.treeId, b], !0))
                return !0;
            b[d] = !b[d],
            u.checkNodeRelation(c, b);
            var e = w(b, t.id.CHECK, c);
            return u.setChkClass(c, e, b),
            u.repairParentChkClassWithSelf(c, b),
            c.treeObj.trigger(t.event.CHECK, [a, c.treeId, b]),
            !0
        },
        onMouseoverCheck: function(a, b) {
            if (b.chkDisabled === !0)
                return !1;
            var c = v.getSetting(a.data.treeId)
              , d = w(b, t.id.CHECK, c);
            return b.check_Focus = !0,
            u.setChkClass(c, d, b),
            !0
        },
        onMouseoutCheck: function(a, b) {
            if (b.chkDisabled === !0)
                return !1;
            var c = v.getSetting(a.data.treeId)
              , d = w(b, t.id.CHECK, c);
            return b.check_Focus = !1,
            u.setChkClass(c, d, b),
            !0
        }
    }
      , o = {}
      , p = {
        checkNodeRelation: function(a, b) {
            var c, d, e, f = a.data.key.children, g = a.data.key.checked, h = t.radio;
            if (a.check.chkStyle == h.STYLE) {
                var i = v.getRadioCheckedList(a);
                if (b[g])
                    if (a.check.radioType == h.TYPE_ALL) {
                        for (d = i.length - 1; d >= 0; d--)
                            c = i[d],
                            c[g] && c != b && (c[g] = !1,
                            i.splice(d, 1),
                            u.setChkClass(a, w(c, t.id.CHECK, a), c),
                            c.parentTId != b.parentTId && u.repairParentChkClassWithSelf(a, c));
                        i.push(b)
                    } else {
                        var j = b.parentTId ? b.getParentNode() : v.getRoot(a);
                        for (d = 0,
                        e = j[f].length; e > d; d++)
                            c = j[f][d],
                            c[g] && c != b && (c[g] = !1,
                            u.setChkClass(a, w(c, t.id.CHECK, a), c))
                    }
                else if (a.check.radioType == h.TYPE_ALL)
                    for (d = 0,
                    e = i.length; e > d; d++)
                        if (b == i[d]) {
                            i.splice(d, 1);
                            break
                        }
            } else
                b[g] && (!b[f] || 0 == b[f].length || a.check.chkboxType.Y.indexOf("s") > -1) && u.setSonNodeCheckBox(a, b, !0),
                b[g] || b[f] && 0 != b[f].length && !(a.check.chkboxType.N.indexOf("s") > -1) || u.setSonNodeCheckBox(a, b, !1),
                b[g] && a.check.chkboxType.Y.indexOf("p") > -1 && u.setParentNodeCheckBox(a, b, !0),
                !b[g] && a.check.chkboxType.N.indexOf("p") > -1 && u.setParentNodeCheckBox(a, b, !1)
        },
        makeChkClass: function(a, b) {
            var c = a.data.key.checked
              , d = t.checkbox
              , e = t.radio
              , f = "";
            f = b.chkDisabled === !0 ? d.DISABLED : b.halfCheck ? d.PART : a.check.chkStyle == e.STYLE ? b.check_Child_State < 1 ? d.FULL : d.PART : b[c] ? 2 === b.check_Child_State || -1 === b.check_Child_State ? d.FULL : d.PART : b.check_Child_State < 1 ? d.FULL : d.PART;
            var g = a.check.chkStyle + "_" + (b[c] ? d.TRUE : d.FALSE) + "_" + f;
            return g = b.check_Focus && b.chkDisabled !== !0 ? g + "_" + d.FOCUS : g,
            t.className.BUTTON + " " + d.DEFAULT + " " + g
        },
        repairAllChk: function(a, b) {
            if (a.check.enable && a.check.chkStyle === t.checkbox.STYLE)
                for (var c = a.data.key.checked, d = a.data.key.children, e = v.getRoot(a), f = 0, g = e[d].length; g > f; f++) {
                    var h = e[d][f];
                    h.nocheck !== !0 && h.chkDisabled !== !0 && (h[c] = b),
                    u.setSonNodeCheckBox(a, h, b)
                }
        },
        repairChkClass: function(a, b) {
            if (b && (v.makeChkFlag(a, b),
            b.nocheck !== !0)) {
                var c = w(b, t.id.CHECK, a);
                u.setChkClass(a, c, b)
            }
        },
        repairParentChkClass: function(a, b) {
            if (b && b.parentTId) {
                var c = b.getParentNode();
                u.repairChkClass(a, c),
                u.repairParentChkClass(a, c)
            }
        },
        repairParentChkClassWithSelf: function(a, b) {
            if (b) {
                var c = a.data.key.children;
                b[c] && b[c].length > 0 ? u.repairParentChkClass(a, b[c][0]) : u.repairParentChkClass(a, b)
            }
        },
        repairSonChkDisabled: function(a, b, c, d) {
            if (b) {
                var e = a.data.key.children;
                if (b.chkDisabled != c && (b.chkDisabled = c),
                u.repairChkClass(a, b),
                b[e] && d)
                    for (var f = 0, g = b[e].length; g > f; f++) {
                        var h = b[e][f];
                        u.repairSonChkDisabled(a, h, c, d)
                    }
            }
        },
        repairParentChkDisabled: function(a, b, c, d) {
            b && (b.chkDisabled != c && d && (b.chkDisabled = c),
            u.repairChkClass(a, b),
            u.repairParentChkDisabled(a, b.getParentNode(), c, d))
        },
        setChkClass: function(a, b, c) {
            b && (c.nocheck === !0 ? b.hide() : b.show(),
            b.attr("class", u.makeChkClass(a, c)))
        },
        setParentNodeCheckBox: function(a, b, c, d) {
            var e = a.data.key.children
              , f = a.data.key.checked
              , g = w(b, t.id.CHECK, a);
            if (d || (d = b),
            v.makeChkFlag(a, b),
            b.nocheck !== !0 && b.chkDisabled !== !0 && (b[f] = c,
            u.setChkClass(a, g, b),
            a.check.autoCheckTrigger && b != d && a.treeObj.trigger(t.event.CHECK, [null , a.treeId, b])),
            b.parentTId) {
                var h = !0;
                if (!c)
                    for (var i = b.getParentNode()[e], j = 0, k = i.length; k > j; j++)
                        if (i[j].nocheck !== !0 && i[j].chkDisabled !== !0 && i[j][f] || (i[j].nocheck === !0 || i[j].chkDisabled === !0) && i[j].check_Child_State > 0) {
                            h = !1;
                            break
                        }
                h && u.setParentNodeCheckBox(a, b.getParentNode(), c, d)
            }
        },
        setSonNodeCheckBox: function(a, b, c, d) {
            if (b) {
                var e = a.data.key.children
                  , f = a.data.key.checked
                  , g = w(b, t.id.CHECK, a);
                d || (d = b);
                var h = !1;
                if (b[e])
                    for (var i = 0, j = b[e].length; j > i && b.chkDisabled !== !0; i++) {
                        var k = b[e][i];
                        u.setSonNodeCheckBox(a, k, c, d),
                        k.chkDisabled === !0 && (h = !0)
                    }
                b != v.getRoot(a) && b.chkDisabled !== !0 && (h && b.nocheck !== !0 && v.makeChkFlag(a, b),
                b.nocheck !== !0 && b.chkDisabled !== !0 ? (b[f] = c,
                h || (b.check_Child_State = b[e] && b[e].length > 0 ? c ? 2 : 0 : -1)) : b.check_Child_State = -1,
                u.setChkClass(a, g, b),
                a.check.autoCheckTrigger && b != d && b.nocheck !== !0 && b.chkDisabled !== !0 && a.treeObj.trigger(t.event.CHECK, [null , a.treeId, b]))
            }
        }
    }
      , q = {
        tools: o,
        view: p,
        event: m,
        data: l
    };
    a.extend(!0, a.fn.zTree.consts, b),
    a.extend(!0, a.fn.zTree._z, q);
    var r = a.fn.zTree
      , s = r._z.tools
      , t = r.consts
      , u = r._z.view
      , v = r._z.data
      , w = (r._z.event,
    s.$);
    v.exSetting(c),
    v.addInitBind(f),
    v.addInitUnBind(g),
    v.addInitCache(e),
    v.addInitNode(i),
    v.addInitProxy(h, !0),
    v.addInitRoot(d),
    v.addBeforeA(j),
    v.addZTreeTools(k);
    var x = u.createNodes;
    u.createNodes = function(a, b, c, d) {
        x && x.apply(u, arguments),
        c && u.repairParentChkClassWithSelf(a, d)
    }
    ;
    var y = u.removeNode;
    u.removeNode = function(a, b) {
        var c = b.getParentNode();
        y && y.apply(u, arguments),
        b && c && (u.repairChkClass(a, c),
        u.repairParentChkClass(a, c))
    }
    ;
    var z = u.appendNodes;
    u.appendNodes = function(a, b, c, d, e, f) {
        var g = "";
        return z && (g = z.apply(u, arguments)),
        d && v.makeChkFlag(a, d),
        g
    }
}
(jQuery),
function(a) {
    var b = {
        event: {
            DRAG: "ztree_drag",
            DROP: "ztree_drop",
            RENAME: "ztree_rename",
            DRAGMOVE: "ztree_dragmove"
        },
        id: {
            EDIT: "_edit",
            INPUT: "_input",
            REMOVE: "_remove"
        },
        move: {
            TYPE_INNER: "inner",
            TYPE_PREV: "prev",
            TYPE_NEXT: "next"
        },
        node: {
            CURSELECTED_EDIT: "curSelectedNode_Edit",
            TMPTARGET_TREE: "tmpTargetzTree",
            TMPTARGET_NODE: "tmpTargetNode"
        }
    }
      , c = {
        edit: {
            enable: !1,
            editNameSelectAll: !1,
            showRemoveBtn: !0,
            showRenameBtn: !0,
            removeTitle: "remove",
            renameTitle: "rename",
            drag: {
                autoExpandTrigger: !1,
                isCopy: !0,
                isMove: !0,
                prev: !0,
                next: !0,
                inner: !0,
                minMoveSize: 5,
                borderMax: 10,
                borderMin: -5,
                maxShowNodeNum: 5,
                autoOpenTime: 500
            }
        },
        view: {
            addHoverDom: null ,
            removeHoverDom: null 
        },
        callback: {
            beforeDrag: null ,
            beforeDragOpen: null ,
            beforeDrop: null ,
            beforeEditName: null ,
            beforeRename: null ,
            onDrag: null ,
            onDragMove: null ,
            onDrop: null ,
            onRename: null 
        }
    }
      , d = function(a) {
        var b = u.getRoot(a)
          , c = u.getRoots();
        b.curEditNode = null ,
        b.curEditInput = null ,
        b.curHoverNode = null ,
        b.dragFlag = 0,
        b.dragNodeShowBefore = [],
        b.dragMaskList = new Array,
        c.showHoverDom = !0
    }
      , e = function(a) {}
      , f = function(a) {
        var b = a.treeObj
          , c = s.event;
        b.bind(c.RENAME, function(b, c, d, e) {
            r.apply(a.callback.onRename, [b, c, d, e])
        }
        ),
        b.bind(c.DRAG, function(b, c, d, e) {
            r.apply(a.callback.onDrag, [c, d, e])
        }
        ),
        b.bind(c.DRAGMOVE, function(b, c, d, e) {
            r.apply(a.callback.onDragMove, [c, d, e])
        }
        ),
        b.bind(c.DROP, function(b, c, d, e, f, g, h) {
            r.apply(a.callback.onDrop, [c, d, e, f, g, h])
        }
        )
    }
      , g = function(a) {
        var b = a.treeObj
          , c = s.event;
        b.unbind(c.RENAME),
        b.unbind(c.DRAG),
        b.unbind(c.DRAGMOVE),
        b.unbind(c.DROP)
    }
      , h = function(a) {
        var b = a.target
          , c = u.getSetting(a.data.treeId)
          , d = a.relatedTarget
          , e = ""
          , f = null 
          , g = ""
          , h = ""
          , i = null 
          , j = null 
          , k = null ;
        if (r.eqs(a.type, "mouseover") ? (k = r.getMDom(c, b, [{
            tagName: "a",
            attrName: "treeNode" + s.id.A
        }]),
        k && (e = r.getNodeMainDom(k).id,
        g = "hoverOverNode")) : r.eqs(a.type, "mouseout") ? (k = r.getMDom(c, d, [{
            tagName: "a",
            attrName: "treeNode" + s.id.A
        }]),
        k || (e = "remove",
        g = "hoverOutNode")) : r.eqs(a.type, "mousedown") && (k = r.getMDom(c, b, [{
            tagName: "a",
            attrName: "treeNode" + s.id.A
        }]),
        k && (e = r.getNodeMainDom(k).id,
        g = "mousedownNode")),
        e.length > 0)
            switch (f = u.getNodeCache(c, e),
            g) {
            case "mousedownNode":
                i = m.onMousedownNode;
                break;
            case "hoverOverNode":
                i = m.onHoverOverNode;
                break;
            case "hoverOutNode":
                i = m.onHoverOutNode
            }
        var l = {
            stop: !1,
            node: f,
            nodeEventType: g,
            nodeEventCallback: i,
            treeEventType: h,
            treeEventCallback: j
        };
        return l
    }
      , i = function(a, b, c, d, e, f, g) {
        c && (c.isHover = !1,
        c.editNameFlag = !1)
    }
      , j = function(a, b) {
        b.cancelEditName = function(a) {
            var b = u.getRoot(this.setting);
            b.curEditNode && t.cancelCurEditNode(this.setting, a ? a : null , !0)
        }
        ,
        b.copyNode = function(a, b, c, d) {
            function e() {
                t.addNodes(f.setting, a, [g], d)
            }
            if (!b)
                return null ;
            if (a && !a.isParent && this.setting.data.keep.leaf && c === s.move.TYPE_INNER)
                return null ;
            var f = this
              , g = r.clone(b);
            return a || (a = null ,
            c = s.move.TYPE_INNER),
            c == s.move.TYPE_INNER ? r.canAsync(this.setting, a) ? t.asyncNode(this.setting, a, d, e) : e() : (t.addNodes(this.setting, a.parentNode, [g], d),
            t.moveNode(this.setting, a, g, c, !1, d)),
            g
        }
        ,
        b.editName = function(a) {
            a && a.tId && a === u.getNodeCache(this.setting, a.tId) && (a.parentTId && t.expandCollapseParentNode(this.setting, a.getParentNode(), !0),
            t.editNode(this.setting, a))
        }
        ,
        b.moveNode = function(a, b, c, d) {
            function e() {
                t.moveNode(f.setting, a, b, c, !1, d)
            }
            if (!b)
                return b;
            if (a && !a.isParent && this.setting.data.keep.leaf && c === s.move.TYPE_INNER)
                return null ;
            if (a && (b.parentTId == a.tId && c == s.move.TYPE_INNER || v(b, this.setting).find("#" + a.tId).length > 0))
                return null ;
            a || (a = null );
            var f = this;
            return r.canAsync(this.setting, a) && c === s.move.TYPE_INNER ? t.asyncNode(this.setting, a, d, e) : e(),
            b
        }
        ,
        b.setEditable = function(a) {
            return this.setting.edit.enable = a,
            this.refresh()
        }
    }
      , k = {
        setSonNodeLevel: function(a, b, c) {
            if (c) {
                var d = a.data.key.children;
                if (c.level = b ? b.level + 1 : 0,
                c[d])
                    for (var e = 0, f = c[d].length; f > e; e++)
                        c[d][e] && u.setSonNodeLevel(a, c, c[d][e])
            }
        }
    }
      , l = {}
      , m = {
        onHoverOverNode: function(a, b) {
            var c = u.getSetting(a.data.treeId)
              , d = u.getRoot(c);
            d.curHoverNode != b && m.onHoverOutNode(a),
            d.curHoverNode = b,
            t.addHoverDom(c, b)
        },
        onHoverOutNode: function(a, b) {
            var c = u.getSetting(a.data.treeId)
              , d = u.getRoot(c);
            d.curHoverNode && !u.isSelectedNode(c, d.curHoverNode) && (t.removeTreeDom(c, d.curHoverNode),
            d.curHoverNode = null )
        },
        onMousedownNode: function(c, d) {
            function e(c) {
                if (0 == k.dragFlag && Math.abs(I - c.clientX) < j.edit.drag.minMoveSize && Math.abs(J - c.clientY) < j.edit.drag.minMoveSize)
                    return !0;
                var d, e, g, h, i, m = j.data.key.children;
                if (A.css("cursor", "pointer"),
                0 == k.dragFlag) {
                    if (0 == r.apply(j.callback.beforeDrag, [j.treeId, o], !0))
                        return f(c),
                        !0;
                    for (d = 0,
                    e = o.length; e > d; d++)
                        0 == d && (k.dragNodeShowBefore = []),
                        g = o[d],
                        g.isParent && g.open ? (t.expandCollapseNode(j, g, !g.open),
                        k.dragNodeShowBefore[g.tId] = !0) : k.dragNodeShowBefore[g.tId] = !1;
                    k.dragFlag = 1,
                    l.showHoverDom = !1,
                    r.showIfameMask(j, !0);
                    var n = !0
                      , D = -1;
                    if (o.length > 1) {
                        var L = o[0].parentTId ? o[0].getParentNode()[m] : u.getNodes(j);
                        for (i = [],
                        d = 0,
                        e = L.length; e > d; d++)
                            if (void 0 !== k.dragNodeShowBefore[L[d].tId] && (n && D > -1 && D + 1 !== d && (n = !1),
                            i.push(L[d]),
                            D = d),
                            o.length === i.length) {
                                o = i;
                                break
                            }
                    }
                    for (n && (x = o[0].getPreNode(),
                    y = o[o.length - 1].getNextNode()),
                    p = v("<ul class='zTreeDragUL'></ul>", j),
                    d = 0,
                    e = o.length; e > d; d++)
                        g = o[d],
                        g.editNameFlag = !1,
                        t.selectNode(j, g, d > 0),
                        t.removeTreeDom(j, g),
                        d > j.edit.drag.maxShowNodeNum - 1 || (h = v("<li id='" + g.tId + "_tmp'></li>", j),
                        h.append(v(g, s.id.A, j).clone()),
                        h.css("padding", "0"),
                        h.children("#" + g.tId + s.id.A).removeClass(s.node.CURSELECTED),
                        p.append(h),
                        d == j.edit.drag.maxShowNodeNum - 1 && (h = v("<li id='" + g.tId + "_moretmp'><a>  ...  </a></li>", j),
                        p.append(h)));
                    p.attr("id", o[0].tId + s.id.UL + "_tmp"),
                    p.addClass(j.treeObj.attr("class")),
                    p.appendTo(A),
                    q = v("<span class='tmpzTreeMove_arrow'></span>", j),
                    q.attr("id", "zTreeMove_arrow_tmp"),
                    q.appendTo(A),
                    j.treeObj.trigger(s.event.DRAG, [c, j.treeId, o])
                }
                if (1 == k.dragFlag) {
                    if (w && q.attr("id") == c.target.id && G && c.clientX + z.scrollLeft() + 2 > a("#" + G + s.id.A, w).offset().left) {
                        var M = a("#" + G + s.id.A, w);
                        c.target = M.length > 0 ? M.get(0) : c.target
                    } else
                        w && (w.removeClass(s.node.TMPTARGET_TREE),
                        G && a("#" + G + s.id.A, w).removeClass(s.node.TMPTARGET_NODE + "_" + s.move.TYPE_PREV).removeClass(s.node.TMPTARGET_NODE + "_" + b.move.TYPE_NEXT).removeClass(s.node.TMPTARGET_NODE + "_" + b.move.TYPE_INNER));
                    w = null ,
                    G = null ,
                    B = !1,
                    C = j;
                    var N = u.getSettings();
                    for (var O in N)
                        N[O].treeId && N[O].edit.enable && N[O].treeId != j.treeId && (c.target.id == N[O].treeId || a(c.target).parents("#" + N[O].treeId).length > 0) && (B = !0,
                        C = N[O]);
                    var P = z.scrollTop()
                      , Q = z.scrollLeft()
                      , R = C.treeObj.offset()
                      , S = C.treeObj.get(0).scrollHeight
                      , T = C.treeObj.get(0).scrollWidth
                      , U = c.clientY + P - R.top
                      , V = C.treeObj.height() + R.top - c.clientY - P
                      , W = c.clientX + Q - R.left
                      , X = C.treeObj.width() + R.left - c.clientX - Q
                      , Y = U < j.edit.drag.borderMax && U > j.edit.drag.borderMin
                      , Z = V < j.edit.drag.borderMax && V > j.edit.drag.borderMin
                      , $ = W < j.edit.drag.borderMax && W > j.edit.drag.borderMin
                      , _ = X < j.edit.drag.borderMax && X > j.edit.drag.borderMin
                      , aa = U > j.edit.drag.borderMin && V > j.edit.drag.borderMin && W > j.edit.drag.borderMin && X > j.edit.drag.borderMin
                      , ba = Y && C.treeObj.scrollTop() <= 0
                      , ca = Z && C.treeObj.scrollTop() + C.treeObj.height() + 10 >= S
                      , da = $ && C.treeObj.scrollLeft() <= 0
                      , ea = _ && C.treeObj.scrollLeft() + C.treeObj.width() + 10 >= T;
                    if (c.target && r.isChildOrSelf(c.target, C.treeId)) {
                        for (var fa = c.target; fa && fa.tagName && !r.eqs(fa.tagName, "li") && fa.id != C.treeId; )
                            fa = fa.parentNode;
                        var ga = !0;
                        for (d = 0,
                        e = o.length; e > d; d++) {
                            if (g = o[d],
                            fa.id === g.tId) {
                                ga = !1;
                                break
                            }
                            if (v(g, j).find("#" + fa.id).length > 0) {
                                ga = !1;
                                break
                            }
                        }
                        ga && c.target && r.isChildOrSelf(c.target, fa.id + s.id.A) && (w = a(fa),
                        G = fa.id)
                    }
                    g = o[0],
                    aa && r.isChildOrSelf(c.target, C.treeId) && (!w && (c.target.id == C.treeId || ba || ca || da || ea) && (B || !B && g.parentTId) && (w = C.treeObj),
                    Y ? C.treeObj.scrollTop(C.treeObj.scrollTop() - 10) : Z && C.treeObj.scrollTop(C.treeObj.scrollTop() + 10),
                    $ ? C.treeObj.scrollLeft(C.treeObj.scrollLeft() - 10) : _ && C.treeObj.scrollLeft(C.treeObj.scrollLeft() + 10),
                    w && w != C.treeObj && w.offset().left < C.treeObj.offset().left && C.treeObj.scrollLeft(C.treeObj.scrollLeft() + w.offset().left - C.treeObj.offset().left)),
                    p.css({
                        top: c.clientY + P + 3 + "px",
                        left: c.clientX + Q + 3 + "px"
                    });
                    var ha = 0
                      , ia = 0;
                    if (w && w.attr("id") != C.treeId) {
                        var ja = null  == G ? null  : u.getNodeCache(C, G)
                          , ka = (c.ctrlKey || c.metaKey) && j.edit.drag.isMove && j.edit.drag.isCopy || !j.edit.drag.isMove && j.edit.drag.isCopy
                          , la = !(!x || G !== x.tId)
                          , ma = !(!y || G !== y.tId)
                          , na = g.parentTId && g.parentTId == G
                          , oa = (ka || !ma) && r.apply(C.edit.drag.prev, [C.treeId, o, ja], !!C.edit.drag.prev)
                          , pa = (ka || !la) && r.apply(C.edit.drag.next, [C.treeId, o, ja], !!C.edit.drag.next)
                          , qa = (ka || !na) && !(C.data.keep.leaf && !ja.isParent) && r.apply(C.edit.drag.inner, [C.treeId, o, ja], !!C.edit.drag.inner);
                        if (oa || pa || qa) {
                            var ra = a("#" + G + s.id.A, w)
                              , sa = ja.isLastNode ? null  : a("#" + ja.getNextNode().tId + s.id.A, w.next())
                              , ta = ra.offset().top
                              , ua = ra.offset().left
                              , va = oa ? qa ? .25 : pa ? .5 : 1 : -1
                              , wa = pa ? qa ? .75 : oa ? .5 : 0 : -1
                              , xa = (c.clientY + P - ta) / ra.height();
                            if ((1 == va || va >= xa && xa >= -.2) && oa ? (ha = 1 - q.width(),
                            ia = ta - q.height() / 2,
                            H = s.move.TYPE_PREV) : (0 == wa || xa >= wa && 1.2 >= xa) && pa ? (ha = 1 - q.width(),
                            ia = null  == sa || ja.isParent && ja.open ? ta + ra.height() - q.height() / 2 : sa.offset().top - q.height() / 2,
                            H = s.move.TYPE_NEXT) : (ha = 5 - q.width(),
                            ia = ta,
                            H = s.move.TYPE_INNER),
                            q.css({
                                display: "block",
                                top: ia + "px",
                                left: ua + ha + "px"
                            }),
                            ra.addClass(s.node.TMPTARGET_NODE + "_" + H),
                            (E != G || F != H) && (K = (new Date).getTime()),
                            ja && ja.isParent && H == s.move.TYPE_INNER) {
                                var ya = !0;
                                window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId !== ja.tId ? (clearTimeout(window.zTreeMoveTimer),
                                window.zTreeMoveTargetNodeTId = null ) : window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId === ja.tId && (ya = !1),
                                ya && (window.zTreeMoveTimer = setTimeout(function() {
                                    H == s.move.TYPE_INNER && ja && ja.isParent && !ja.open && (new Date).getTime() - K > C.edit.drag.autoOpenTime && r.apply(C.callback.beforeDragOpen, [C.treeId, ja], !0) && (t.switchNode(C, ja),
                                    C.edit.drag.autoExpandTrigger && C.treeObj.trigger(s.event.EXPAND, [C.treeId, ja]))
                                }
                                , C.edit.drag.autoOpenTime + 50),
                                window.zTreeMoveTargetNodeTId = ja.tId)
                            }
                        } else
                            w = null ,
                            G = "",
                            H = s.move.TYPE_INNER,
                            q.css({
                                display: "none"
                            }),
                            window.zTreeMoveTimer && (clearTimeout(window.zTreeMoveTimer),
                            window.zTreeMoveTargetNodeTId = null )
                    } else
                        H = s.move.TYPE_INNER,
                        w && r.apply(C.edit.drag.inner, [C.treeId, o, null ], !!C.edit.drag.inner) ? w.addClass(s.node.TMPTARGET_TREE) : w = null ,
                        q.css({
                            display: "none"
                        }),
                        window.zTreeMoveTimer && (clearTimeout(window.zTreeMoveTimer),
                        window.zTreeMoveTargetNodeTId = null );
                    E = G,
                    F = H,
                    j.treeObj.trigger(s.event.DRAGMOVE, [c, j.treeId, o])
                }
                return !1
            }
            function f(c) {
                function d() {
                    if (B) {
                        if (!n)
                            for (var a = 0, b = o.length; b > a; a++)
                                t.removeNode(j, o[a]);
                        if (H == s.move.TYPE_INNER)
                            t.addNodes(C, x, y);
                        else if (t.addNodes(C, x.getParentNode(), y),
                        H == s.move.TYPE_PREV)
                            for (a = 0,
                            b = y.length; b > a; a++)
                                t.moveNode(C, x, y[a], H, !1);
                        else
                            for (a = -1,
                            b = y.length - 1; b > a; b--)
                                t.moveNode(C, x, y[b], H, !1)
                    } else if (n && H == s.move.TYPE_INNER)
                        t.addNodes(C, x, y);
                    else if (n && t.addNodes(C, x.getParentNode(), y),
                    H != s.move.TYPE_NEXT)
                        for (a = 0,
                        b = y.length; b > a; a++)
                            t.moveNode(C, x, y[a], H, !1);
                    else
                        for (a = -1,
                        b = y.length - 1; b > a; b--)
                            t.moveNode(C, x, y[b], H, !1);
                    t.selectNodes(C, y),
                    v(y[0], j).focus().blur(),
                    j.treeObj.trigger(s.event.DROP, [c, C.treeId, y, x, H, n])
                }
                if (window.zTreeMoveTimer && (clearTimeout(window.zTreeMoveTimer),
                window.zTreeMoveTargetNodeTId = null ),
                E = null ,
                F = null ,
                z.unbind("mousemove", e),
                z.unbind("mouseup", f),
                z.unbind("selectstart", g),
                A.css("cursor", "auto"),
                w && (w.removeClass(s.node.TMPTARGET_TREE),
                G && a("#" + G + s.id.A, w).removeClass(s.node.TMPTARGET_NODE + "_" + s.move.TYPE_PREV).removeClass(s.node.TMPTARGET_NODE + "_" + b.move.TYPE_NEXT).removeClass(s.node.TMPTARGET_NODE + "_" + b.move.TYPE_INNER)),
                r.showIfameMask(j, !1),
                l.showHoverDom = !0,
                0 != k.dragFlag) {
                    k.dragFlag = 0;
                    var h, i, m;
                    for (h = 0,
                    i = o.length; i > h; h++)
                        m = o[h],
                        m.isParent && k.dragNodeShowBefore[m.tId] && !m.open && (t.expandCollapseNode(j, m, !m.open),
                        delete k.dragNodeShowBefore[m.tId]);
                    p && p.remove(),
                    q && q.remove();
                    var n = (c.ctrlKey || c.metaKey) && j.edit.drag.isMove && j.edit.drag.isCopy || !j.edit.drag.isMove && j.edit.drag.isCopy;
                    if (!n && w && G && o[0].parentTId && G == o[0].parentTId && H == s.move.TYPE_INNER && (w = null ),
                    w) {
                        var x = null  == G ? null  : u.getNodeCache(C, G);
                        if (0 == r.apply(j.callback.beforeDrop, [C.treeId, o, x, H, n], !0))
                            return void t.selectNodes(D, o);
                        var y = n ? r.clone(o) : o;
                        H == s.move.TYPE_INNER && r.canAsync(C, x) ? t.asyncNode(C, x, !1, d) : d()
                    } else
                        t.selectNodes(D, o),
                        j.treeObj.trigger(s.event.DROP, [c, j.treeId, o, null , null , null ])
                }
            }
            function g() {
                return !1
            }
            var h, i, j = u.getSetting(c.data.treeId), k = u.getRoot(j), l = u.getRoots();
            if (2 == c.button || !j.edit.enable || !j.edit.drag.isCopy && !j.edit.drag.isMove)
                return !0;
            var m = c.target
              , n = u.getRoot(j).curSelectedList
              , o = [];
            if (u.isSelectedNode(j, d))
                for (h = 0,
                i = n.length; i > h; h++) {
                    if (n[h].editNameFlag && r.eqs(m.tagName, "input") && null  !== m.getAttribute("treeNode" + s.id.INPUT))
                        return !0;
                    if (o.push(n[h]),
                    o[0].parentTId !== n[h].parentTId) {
                        o = [d];
                        break
                    }
                }
            else
                o = [d];
            t.editNodeBlur = !0,
            t.cancelCurEditNode(j);
            var p, q, w, x, y, z = a(j.treeObj.get(0).ownerDocument), A = a(j.treeObj.get(0).ownerDocument.body), B = !1, C = j, D = j, E = null , F = null , G = null , H = s.move.TYPE_INNER, I = c.clientX, J = c.clientY, K = (new Date).getTime();
            return r.uCanDo(j) && z.bind("mousemove", e),
            z.bind("mouseup", f),
            z.bind("selectstart", g),
            c.preventDefault && c.preventDefault(),
            !0
        }
    }
      , n = {
        getAbs: function(a) {
            var b = a.getBoundingClientRect()
              , c = document.body.scrollTop + document.documentElement.scrollTop
              , d = document.body.scrollLeft + document.documentElement.scrollLeft;
            return [b.left + d, b.top + c]
        },
        inputFocus: function(a) {
            a.get(0) && (a.focus(),
            r.setCursorPosition(a.get(0), a.val().length))
        },
        inputSelect: function(a) {
            a.get(0) && (a.focus(),
            a.select())
        },
        setCursorPosition: function(a, b) {
            if (a.setSelectionRange)
                a.focus(),
                a.setSelectionRange(b, b);
            else if (a.createTextRange) {
                var c = a.createTextRange();
                c.collapse(!0),
                c.moveEnd("character", b),
                c.moveStart("character", b),
                c.select()
            }
        },
        showIfameMask: function(a, b) {
            for (var c = u.getRoot(a); c.dragMaskList.length > 0; )
                c.dragMaskList[0].remove(),
                c.dragMaskList.shift();
            if (b)
                for (var d = v("iframe", a), e = 0, f = d.length; f > e; e++) {
                    var g = d.get(e)
                      , h = r.getAbs(g)
                      , i = v("<div id='zTreeMask_" + e + "' class='zTreeMask' style='top:" + h[1] + "px; left:" + h[0] + "px; width:" + g.offsetWidth + "px; height:" + g.offsetHeight + "px;'></div>", a);
                    i.appendTo(v("body", a)),
                    c.dragMaskList.push(i)
                }
        }
    }
      , o = {
        addEditBtn: function(a, b) {
            if (!(b.editNameFlag || v(b, s.id.EDIT, a).length > 0) && r.apply(a.edit.showRenameBtn, [a.treeId, b], a.edit.showRenameBtn)) {
                var c = v(b, s.id.A, a)
                  , d = "<span class='" + s.className.BUTTON + " edit' id='" + b.tId + s.id.EDIT + "' title='" + r.apply(a.edit.renameTitle, [a.treeId, b], a.edit.renameTitle) + "' treeNode" + s.id.EDIT + " style='display:none;'></span>";
                c.append(d),
                v(b, s.id.EDIT, a).bind("click", function() {
                    return r.uCanDo(a) && 0 != r.apply(a.callback.beforeEditName, [a.treeId, b], !0) ? (t.editNode(a, b),
                    !1) : !1
                }
                ).show()
            }
        },
        addRemoveBtn: function(a, b) {
            if (!(b.editNameFlag || v(b, s.id.REMOVE, a).length > 0) && r.apply(a.edit.showRemoveBtn, [a.treeId, b], a.edit.showRemoveBtn)) {
                var c = v(b, s.id.A, a)
                  , d = "<span class='" + s.className.BUTTON + " remove' id='" + b.tId + s.id.REMOVE + "' title='" + r.apply(a.edit.removeTitle, [a.treeId, b], a.edit.removeTitle) + "' treeNode" + s.id.REMOVE + " style='display:none;'></span>";
                c.append(d),
                v(b, s.id.REMOVE, a).bind("click", function() {
                    return r.uCanDo(a) && 0 != r.apply(a.callback.beforeRemove, [a.treeId, b], !0) ? (t.removeNode(a, b),
                    a.treeObj.trigger(s.event.REMOVE, [a.treeId, b]),
                    !1) : !1
                }
                ).bind("mousedown", function(a) {
                    return !0
                }
                ).show()
            }
        },
        addHoverDom: function(a, b) {
            u.getRoots().showHoverDom && (b.isHover = !0,
            a.edit.enable && (t.addEditBtn(a, b),
            t.addRemoveBtn(a, b)),
            r.apply(a.view.addHoverDom, [a.treeId, b]))
        },
        cancelCurEditNode: function(a, b, c) {
            var d = u.getRoot(a)
              , e = a.data.key.name
              , f = d.curEditNode;
            if (f) {
                var g = d.curEditInput
                  , h = b ? b : c ? f[e] : g.val();
                if (r.apply(a.callback.beforeRename, [a.treeId, f, h, c], !0) === !1)
                    return !1;
                f[e] = h,
                a.treeObj.trigger(s.event.RENAME, [a.treeId, f, c]);
                var i = v(f, s.id.A, a);
                i.removeClass(s.node.CURSELECTED_EDIT),
                g.unbind(),
                t.setNodeName(a, f),
                f.editNameFlag = !1,
                d.curEditNode = null ,
                d.curEditInput = null ,
                t.selectNode(a, f, !1)
            }
            return d.noSelection = !0,
            !0
        },
        editNode: function(a, b) {
            var c = u.getRoot(a);
            if (t.editNodeBlur = !1,
            u.isSelectedNode(a, b) && c.curEditNode == b && b.editNameFlag)
                return void setTimeout(function() {
                    r.inputFocus(c.curEditInput)
                }
                , 0);
            var d = a.data.key.name;
            b.editNameFlag = !0,
            t.removeTreeDom(a, b),
            t.cancelCurEditNode(a),
            t.selectNode(a, b, !1),
            v(b, s.id.SPAN, a).html("<input type=text class='rename' id='" + b.tId + s.id.INPUT + "' treeNode" + s.id.INPUT + " >");
            var e = v(b, s.id.INPUT, a);
            e.attr("value", b[d]),
            a.edit.editNameSelectAll ? r.inputSelect(e) : r.inputFocus(e),
            e.bind("blur", function(b) {
                t.editNodeBlur || t.cancelCurEditNode(a)
            }
            ).bind("keydown", function(b) {
                "13" == b.keyCode ? (t.editNodeBlur = !0,
                t.cancelCurEditNode(a)) : "27" == b.keyCode && t.cancelCurEditNode(a, null , !0)
            }
            ).bind("click", function(a) {
                return !1
            }
            ).bind("dblclick", function(a) {
                return !1
            }
            ),
            v(b, s.id.A, a).addClass(s.node.CURSELECTED_EDIT),
            c.curEditInput = e,
            c.noSelection = !1,
            c.curEditNode = b
        },
        moveNode: function(a, b, c, d, e, f) {
            var g = u.getRoot(a)
              , h = a.data.key.children;
            if (b != c && (!a.data.keep.leaf || !b || b.isParent || d != s.move.TYPE_INNER)) {
                var i = c.parentTId ? c.getParentNode() : g
                  , j = null  === b || b == g;
                j && null  === b && (b = g),
                j && (d = s.move.TYPE_INNER);
                var k = b.parentTId ? b.getParentNode() : g;
                d != s.move.TYPE_PREV && d != s.move.TYPE_NEXT && (d = s.move.TYPE_INNER),
                d == s.move.TYPE_INNER && (j ? c.parentTId = null  : (b.isParent || (b.isParent = !0,
                b.open = !!b.open,
                t.setNodeLineIcos(a, b)),
                c.parentTId = b.tId));
                var l, m;
                if (j)
                    l = a.treeObj,
                    m = l;
                else {
                    if (f || d != s.move.TYPE_INNER ? f || t.expandCollapseNode(a, b.getParentNode(), !0, !1) : t.expandCollapseNode(a, b, !0, !1),
                    l = v(b, a),
                    m = v(b, s.id.UL, a),
                    l.get(0) && !m.get(0)) {
                        var n = [];
                        t.makeUlHtml(a, b, n, ""),
                        l.append(n.join(""))
                    }
                    m = v(b, s.id.UL, a)
                }
                var o = v(c, a);
                o.get(0) ? l.get(0) || o.remove() : o = t.appendNodes(a, c.level, [c], null , !1, !0).join(""),
                m.get(0) && d == s.move.TYPE_INNER ? m.append(o) : l.get(0) && d == s.move.TYPE_PREV ? l.before(o) : l.get(0) && d == s.move.TYPE_NEXT && l.after(o);
                var p, q, r = -1, w = 0, x = null , y = null , z = c.level;
                if (c.isFirstNode)
                    r = 0,
                    i[h].length > 1 && (x = i[h][1],
                    x.isFirstNode = !0);
                else if (c.isLastNode)
                    r = i[h].length - 1,
                    x = i[h][r - 1],
                    x.isLastNode = !0;
                else
                    for (p = 0,
                    q = i[h].length; q > p; p++)
                        if (i[h][p].tId == c.tId) {
                            r = p;
                            break
                        }
                if (r >= 0 && i[h].splice(r, 1),
                d != s.move.TYPE_INNER)
                    for (p = 0,
                    q = k[h].length; q > p; p++)
                        k[h][p].tId == b.tId && (w = p);
                if (d == s.move.TYPE_INNER ? (b[h] || (b[h] = new Array),
                b[h].length > 0 && (y = b[h][b[h].length - 1],
                y.isLastNode = !1),
                b[h].splice(b[h].length, 0, c),
                c.isLastNode = !0,
                c.isFirstNode = 1 == b[h].length) : b.isFirstNode && d == s.move.TYPE_PREV ? (k[h].splice(w, 0, c),
                y = b,
                y.isFirstNode = !1,
                c.parentTId = b.parentTId,
                c.isFirstNode = !0,
                c.isLastNode = !1) : b.isLastNode && d == s.move.TYPE_NEXT ? (k[h].splice(w + 1, 0, c),
                y = b,
                y.isLastNode = !1,
                c.parentTId = b.parentTId,
                c.isFirstNode = !1,
                c.isLastNode = !0) : (d == s.move.TYPE_PREV ? k[h].splice(w, 0, c) : k[h].splice(w + 1, 0, c),
                c.parentTId = b.parentTId,
                c.isFirstNode = !1,
                c.isLastNode = !1),
                u.fixPIdKeyValue(a, c),
                u.setSonNodeLevel(a, c.getParentNode(), c),
                t.setNodeLineIcos(a, c),
                t.repairNodeLevelClass(a, c, z),
                !a.data.keep.parent && i[h].length < 1) {
                    i.isParent = !1,
                    i.open = !1;
                    var A = v(i, s.id.UL, a)
                      , B = v(i, s.id.SWITCH, a)
                      , C = v(i, s.id.ICON, a);
                    t.replaceSwitchClass(i, B, s.folder.DOCU),
                    t.replaceIcoClass(i, C, s.folder.DOCU),
                    A.css("display", "none")
                } else
                    x && t.setNodeLineIcos(a, x);
                y && t.setNodeLineIcos(a, y),
                a.check && a.check.enable && t.repairChkClass && (t.repairChkClass(a, i),
                t.repairParentChkClassWithSelf(a, i),
                i != c.parent && t.repairParentChkClassWithSelf(a, c)),
                f || t.expandCollapseParentNode(a, c.getParentNode(), !0, e)
            }
        },
        removeEditBtn: function(a, b) {
            v(b, s.id.EDIT, a).unbind().remove()
        },
        removeRemoveBtn: function(a, b) {
            v(b, s.id.REMOVE, a).unbind().remove()
        },
        removeTreeDom: function(a, b) {
            b.isHover = !1,
            t.removeEditBtn(a, b),
            t.removeRemoveBtn(a, b),
            r.apply(a.view.removeHoverDom, [a.treeId, b])
        },
        repairNodeLevelClass: function(a, b, c) {
            if (c !== b.level) {
                var d = v(b, a)
                  , e = v(b, s.id.A, a)
                  , f = v(b, s.id.UL, a)
                  , g = s.className.LEVEL + c
                  , h = s.className.LEVEL + b.level;
                d.removeClass(g),
                d.addClass(h),
                e.removeClass(g),
                e.addClass(h),
                f.removeClass(g),
                f.addClass(h)
            }
        },
        selectNodes: function(a, b) {
            for (var c = 0, d = b.length; d > c; c++)
                t.selectNode(a, b[c], c > 0)
        }
    }
      , p = {
        tools: n,
        view: o,
        event: l,
        data: k
    };
    a.extend(!0, a.fn.zTree.consts, b),
    a.extend(!0, a.fn.zTree._z, p);
    var q = a.fn.zTree
      , r = q._z.tools
      , s = q.consts
      , t = q._z.view
      , u = q._z.data
      , v = (q._z.event,
    r.$);
    u.exSetting(c),
    u.addInitBind(f),
    u.addInitUnBind(g),
    u.addInitCache(e),
    u.addInitNode(i),
    u.addInitProxy(h),
    u.addInitRoot(d),
    u.addZTreeTools(j);
    var w = t.cancelPreSelectedNode;
    t.cancelPreSelectedNode = function(a, b) {
        for (var c = u.getRoot(a).curSelectedList, d = 0, e = c.length; e > d && (b && b !== c[d] || (t.removeTreeDom(a, c[d]),
        !b)); d++)
            ;
        w && w.apply(t, arguments)
    }
    ;
    var x = t.createNodes;
    t.createNodes = function(a, b, c, d) {
        x && x.apply(t, arguments),
        c && t.repairParentChkClassWithSelf && t.repairParentChkClassWithSelf(a, d)
    }
    ;
    var y = t.makeNodeUrl;
    t.makeNodeUrl = function(a, b) {
        return a.edit.enable ? null  : y.apply(t, arguments)
    }
    ;
    var z = t.removeNode;
    t.removeNode = function(a, b) {
        var c = u.getRoot(a);
        c.curEditNode === b && (c.curEditNode = null ),
        z && z.apply(t, arguments)
    }
    ;
    var A = t.selectNode;
    t.selectNode = function(a, b, c) {
        var d = u.getRoot(a);
        return u.isSelectedNode(a, b) && d.curEditNode == b && b.editNameFlag ? !1 : (A && A.apply(t, arguments),
        t.addHoverDom(a, b),
        !0)
    }
    ;
    var B = r.uCanDo;
    r.uCanDo = function(a, b) {
        var c = u.getRoot(a);
        return b && (r.eqs(b.type, "mouseover") || r.eqs(b.type, "mouseout") || r.eqs(b.type, "mousedown") || r.eqs(b.type, "mouseup")) ? !0 : (c.curEditNode && (t.editNodeBlur = !1,
        c.curEditInput.focus()),
        !c.curEditNode && (B ? B.apply(t, arguments) : !0))
    }
}
(jQuery);
