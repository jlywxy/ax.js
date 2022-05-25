var ax = {
    init(documentObject) {
        if (this.root) return

        console.log(`
    * %cAX.JS WEB FRAMEWORK%c
    * Version 22a19a
    @ jlywxy https://github.com/jlywxy
    `, 'font-weight: bold;', 'font-weight: normal;')

        with (ax.views) {
            this.content = new Container().style("display", "flex")
            this.base = new ZStack().style("min-height", "100vh")
            this.base.append(this.content)
            this.base.create()
        }
        this.root = ax.documentInterface.createElement("div")
        ax.documentInterface.body.appendChild(this.root)
        this.root.appendChild(this.base.documentObject)
    },
    version: "22a202",
    documentInterface: {
        createElement(tag = "div", options) {
            let documentObject = document.createElement(tag, options)
            return {
                type: "AXProxiedDocumentObject",
                documentObject: documentObject,
                eventListeners: [],
                setProp(key, value, path = []) {
                    let target = this.documentObject
                    for (let k of path) {
                        target = target[k]
                    }
                    target[key] = value
                },
                getProp(key, path = []) {
                    let target = this.documentObject
                    for (let k of path) {
                        target = target[k]
                    }
                    return target[key]
                },
                setStyle(key, value) {
                    this.setProp(key, value, ["style"])
                },
                getStyle(key) {
                    return this.getProp(key, ["style"])
                },
                set innerHTML(value) {
                    this.documentObject.innerHTML = value
                },
                get innerHTML() {
                    return this.documentObject.innerHTML
                },
                addEventListener(event, listener, options) {
                    let eventInfo = {
                        id: "__ax_event_callback_" + ax.tools.uuid(),
                        event: event,
                        listener: listener,
                        options: options
                    }
                    this.eventListeners.push(eventInfo)
                    this.documentObject.addEventListener(eventInfo.event, eventInfo.listener, eventInfo.options)
                },
                removeEventListenerByEventId(id) {
                    for (let eventInfo of this.eventListeners) {
                        if (eventInfo.id == id) {
                            this.documentObject.removeEventListener(eventInfo.event, eventInfo.listener, eventInfo.options)
                        }
                    }
                },
                appendChild(v) {
                    this.documentObject.appendChild(v.documentObject)
                },
                removeChild(v) {
                    this.documentObject.removeChild(v.documentObject)
                }
            }
        },
        head: {
            appendChild(v) {
                document.head.appendChild(v.documentObject)
            },
            removeChild(v) {
                document.head.removeChild(v.documentObject)
            }
        },
        body: {
            appendChild(v) {
                document.body.appendChild(v.documentObject)
            },
            removeChild(v) {
                document.body.removeChild(v.documentObject)
            }
        },
    },
    virtualDocument: {
        head: {
            appendChild(v) {
            },
            removeChild(v) {
            }
        },
        body: {
            appendChild(v) {
            },
            removeChild(v) {
            }
        },
        createElement() {
            postMessage({
                "protocol": "saxrpc",
                "version": "1.0",
                "method": "document.createElement",
                "args": {
                    "tag": "div",
                    "id": "__sax_vdo_" + ax.tools.uuid()
                }
            })
        },
        localEventListeners: [],
        addEventListener(event, listener, options) {

        }
    },
    labels: {},
    app(v) {
        ax.content.append(v.style("flex", 1))
    },
    import(...args) {
        return new Promise(
            (rs, rj) => {

            }
        )
    },
    debug: {
        stackLayout: false,
        canvasLayout: false
    },
    tools: {
        funcFromSrc(srcStr) {
            return new Function(srcStr)
        },
        import(url, progress = () => { }) {
            return new Promise(
                (rs, rj) => {
                    ax.tools.ajax.get(url, (r) => {
                        rs(r.response)
                    }, (e) => {
                        rj(e)
                    }, progress)
                }
            )
        },
        // funcFromSrcWithEnv(envStr, srcStr) {
        //     return new Function("with (" + envStr + "){" + srcStr + "}")
        // },
        exportAxViews() {
            let axViewRet = ""
            for (let v of Object.keys(ax.views)) {
                axViewRet += ("let " + v + " = ax.views." + v + ";\n")
            }
            return "\n\n//----GENERATED BY AX.JS----\n"
                + axViewRet + "//--------------------------\n\n"
        },
        setupSandbox() {
            let virtualAx = {}
            //set ax and axviews
            //initializesandboxworker
            //seteventlisteners
        },
        sandboxWorker(srcStr) {
            return new Worker(window.URL.createObjectURL(new Blob([srcStr])))
        },
        setHead(tag, prop, content) {
            if (!tag) { console.warn("invalid call"); return }
            let headElement = ax.documentInterface.createElement(tag)
            for (let key of Object.keys(prop)) {
                headElement.setProp(key, prop[key])
            }
            if (content) headElement.innerHTML = content
            ax.documentInterface.head.appendChild(headElement)
        },
        uuid() {
            let block = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
            return (block() + block() + "-" + block() + "-" + block() + "-" + block() + "-" + block() + block() + block());
        },
        ajax: {
            get: (url, callback, err, prog, blob = false) => {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if ((xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)) { callback(xhr); } else { err(new Error(url + " " + xhr.readyState + " " + xhr.status)); }
                    }
                };
                xhr.onerror = err
                xhr.onprogress = prog
                if (blob) xhr.responseType = "blob"
                xhr.send();
            },
            post: (url, body, callback, err, prog, blob = false) => {
                let xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if ((xhr.status >= 200 && xhr.status < 300 || xhr.status == 304)) { callback(xhr); } else { err(new Error(url + " " + xhr.readyState + " " + xhr.status)); }
                    }
                };
                xhr.onerror = err
                xhr.onprogress = prog
                if (blob) xhr.responseType = "blob"
                xhr.send(body);
            },
            postJson(url, body, callback, error) {
                ax.tools.ajax.post(url, JSON.stringify(body), callback, error)
            }
        }
    },
    views: {},
    resources: {}
}



ax.resources = {
    indicator_svg_ios: `
    <svg version="1.1" x="0px" y="0px" viewBox="-100 -100 3000 3000" xml:space="preserve">
    <g stroke-width="330" stroke-linecap="round" stroke="#000000" fill="none" id="spinner">
    <line x1="1400" y1="100" x2="1400" y2="800" />
    <line opacity="0.875" x1="2319.24" y1="480.76" x2="1824.27" y2="975.75" />
    <line opacity="0.75" x1="2000" y1="1400" x2="2700" y2="1400" />
    <line opacity="0.625" x1="2319.24" y1="2319.24" x2="1824.27" y2="1824.27" />
    <line opacity="0.5" x1="1400" y1="2700" x2="1400" y2="2000" />
    <line opacity="0.375" x1="480.76" y1="2319.24" x2="975.75" y2="1824.27" />
    <line opacity="0.25" x1="100" y1="1400" x2="800" y2="1400" />
    <line opacity="0.125" x1="480.76" y1="480.76" x2="975.75" y2="975.75" />
    <animateTransform attributeName="transform" attributeType="XML" type="rotate" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" values="0 1400 1400;45 1400 1400;90 1400 1400;135 1400 1400;180 1400 1400;225 1400 1400;270 1400 1400;315 1400 1400;360 1400 1400" dur="0.67s" begin="0s" repeatCount="indefinite" calcMode="discrete" />
    </g>
    </svg>`
}
/*
 TinyView:
 provides basic functions for dynamic operation to leaf node

 View:
 simplified style,props,etc setting function

 Container:
 provides basic function for generating operatable tree node

//  ContainerView:
//  wrapped subviews with content layer and splited out a background layer
//  to operate foreground and background separately
 */
ax.views.TinyView = class {
    constructor(tag = "div") {
        this.tag = tag
        this.prop_unactivated = {
            style: {},
            attrib: {},
            event: []
        }
    }
    rebind(documentObject) {
        this.documentObject = documentObject
        this.syncStyle()
        this.syncAttrib()
        this.syncEventListener()
    }
    apply(setterFunc) {
        setterFunc(this)
        return this
    }
    style(key, value) {
        if (this.activated) {
            this.documentObject.setStyle(key, value)
        } else {
            this.prop_unactivated.style[key] = value
        }
        return this
    }
    getStyle(key) {
        if (this.activated) {
            return this.documentObject.getStyle(key)
        } else {
            return this.prop_unactivated.style[key]
        }
    }
    attrib(key, value) {
        if (this.activated) {
            this.documentObject.setProp(key, value)
        } else {
            this.prop_unactivated.attrib[key] = value
        }
        return this
    }
    getAttrib(key) {
        if (this.activated) {
            return this.documentObject.getProp(key)
        } else {
            return this.prop_unactivated.attrib[key]
        }
    }
    getEventListener() {
        if (this.activated) {
            return window.getEventListeners(this.documentObject)
        } else {
            return this.prop_unactivated.event
        }
    }
    event(event, listener, options) {
        if (this.activated) {
            this.documentObject.addEventListener(event, listener, options)
        } else {
            this.prop_unactivated.event.push({
                event: event,
                listener: listener,
                options: options
            })
        }
        return this
    }
    label(label) {
        ax.labels[label] = this
        this.labelName = label
        return this
    }
    get activated() {
        if (!this.documentObject) return false
        return true
    }
    oncreate() { }
    create() {
        this.documentObject = ax.documentInterface.createElement(this.tag)
        this.syncStyle()
        this.syncAttrib()
        this.syncEventListener()
        this.oncreate()
    }
    syncStyle() {
        for (let p of Object.keys(this.prop_unactivated.style)) {
            this.documentObject.setStyle(p, this.prop_unactivated.style[p])
            delete this.prop_unactivated.style[p]
        }
    }
    syncAttrib() {
        for (let p of Object.keys(this.prop_unactivated.attrib)) {
            this.documentObject.setProp(p, this.prop_unactivated.attrib[p])
            delete this.prop_unactivated.attrib[p]
        }
    }
    syncEventListener() {
        for (let event of this.prop_unactivated.event) {
            this.documentObject.addEventListener(event.event, event.listener, event.options)
        }
    }
}
ax.views.View = class extends ax.views.TinyView {
    // __setPropBinding(binding){
    //     // if (typeof value == 'string') {
    //     //     this.attrib("innerHTML", value)
    //     //     if (this.__axprop_text_binding_listener && this.__axprop_text_binding) {
    //     //         this.__axprop_text_binding.removeListener(this.__axprop_text_binding_listener)
    //     //     }
    //     // } else {
    //     //     this.__axprop_text_binding = value
    //     //     this.__axprop_text_binding_listener = (v) => {
    //     //         this.attrib("innerHTML", v)
    //     //     }
    //     //     this.attrib("innerHTML", value.wrappedValue)
    //     //     value.addListener(this.__axprop_text_binding_listener)
    //     // }
    // }
    // __removePropBinding(){

    // }
    setStackElementFixedStyle(enabled = true) {
        //fixed不可与高度同时设置：高度失效，需套一层Container
        //fixed不可和nowrap自动省略同时设置：导致元素消失
        if (enabled) {
            this.style("flex", "0")
        } else {
            this.style("flex", "1")
        }
        return this
    }
    fixed(enabled = true) {
        if (enabled) {
            this._stack_fixed = true //手动设置标志，stack中不能覆盖设置
        } else {
            this._stack_fixed = false
        }
        return this
    }
    nowrap(enabled = true, showEllipsis = false) {
        if (enabled) {
            this.style("white-space", "nowrap")
                .style("text-overflow", "unset")
            if (showEllipsis) {
                this._nowrap_store_width = this.getStyle("width")
                this.style("overflow", "hidden")
                    .style("text-overflow", "ellipsis")
                    .style("width", this._nowrap_store_width ? this._nowrap_store_width : "0")
                //ellipses只在提供具体像素宽度时生效 https://stackoverflow.com/questions/17779293/css-text-overflow-ellipsis-not-working
            } else {
                this.style("width", this._nowrap_store_width ? this._nowrap_store_width : "")
            }
        } else {
            this.style("white-space", "inherit")
                .style("text-overflow", "unset")
                .style("width", this._nowrap_store_width ? this._nowrap_store_width : "")
        }
        return this
    }
    text(value) {
        this.attrib("innerHTML", value)
        return this
    }
    color(color) {
        return this.style("color", color)
    }
    backgroundColor(color) {
        return this.style("background-color", color)
    }
    padding(size) {
        this.style("padding", size + "px")
        return this
    }
    width(pixels) {
        this.style("width", pixels + "px")
        return this
    }
    height(pixels) {
        this.style("height", pixels + "px")
        return this
    }
    frame(width, height) {
        this.width(width)
        this.height(height)
        return this
    }
    rectangle(width, height, color) {
        if (width != undefined) this.style("width", width + "px")
        if (height != undefined) { this.style("height", height + "px") } else { this.style("height", "100%") }
        this.style("background-color", color)
        return this
    }
    backgroundMaterial(pixels = 10) {
        this.style("backdrop-filter", "blur(" + pixels + "px)")
        this.style("-webkit-backdrop-filter", "blur(" + pixels + "px)")
        this.style("background-color", "rgba(230,230,230,0.4)")
        //this.style("background-color","rgba(0,0,0,0.3)"

        return this
    }
    panelStyle() {
        this.style("box-shadow", "0px 0px 5px rgba(0,0,0,0.14)")
            .style("border-radius", "9px")
        return this
    }
    borderRadius(pixels) {
        this.style("border-radius", pixels + "px")
        return this
    }
    visible(enabled) {
        this.isVisible = enabled
        if (!enabled) {
            this._visible_store_displayStyle = this.getStyle("display")
            if (this._visible_store_displayStyle == undefined || this._visible_store_displayStyle == "none") this._visible_store_displayStyle = "block"
            this.style("display", "none")
        } else {
            this.style("display", this._visible_store_displayStyle)
        }
        return this
    }
    getRect() {
        if (this.activated) {
            return [window.getComputedStyle(this.documentObject.documentObject).width.replace("px", ""), window.getComputedStyle(this.documentObject.documentObject).height.replace("px", "")]
        } else {
            return [null, null]
        }
    }
}
ax.views.Container = class extends ax.views.View {
    constructor(...args) {
        super()
        this.subviews = args
    }
    static taggedContainer(tag = "div") {
        let view = new ax.views.Container()
        view.tag = tag
        return view
    }
    removeChild(v) {
        let index = this.subviews.indexOf(v)
        if (index != -1) {
            this.subviews.splice(index, 1)
            if (this.activated && v.activated) this.documentObject.removeChild(v.documentObject)
            v.parent = null
        } else {
            console.warn("removing non-existing child from pointing parent")
        }
        return this
    }
    clear() {
        for (let v of this.subviews) {
            this.removeChild(v)
        }
        return this
    }
    append(...args) {
        for (let v of args) {
            this.subviews.push(v)
            if (v.parent) {
                v.parent.removeChild(v)
            }
            v.parent = this
            if (this.activated) {
                if (!v.activated) v.create()
                this.documentObject.appendChild(v.documentObject)
            }
        }
        return this
    }
    create() {
        super.create()
        for (let v of this.subviews) {
            v.parent = this
            if (!v.activated) v.create()
            this.documentObject.appendChild(v.documentObject)
        }
    }
}
ax.views.Button = class extends ax.views.Container {
    constructor(label, action) {
        super(label)
        this.onClick = action
        this.colors = {
            foreground: "#00a0f0",
            background: "#e9e9e9",
            backgroundActive: "#c0c0c0"
        }
        this.event("click", this.onClick)
        this.event("mousedown", () => {
            this.backgroundColor(this.colors.backgroundActive)
        })
        this.event("mouseup", () => {
            this.backgroundColor(this.colors.background)
        })
        this.nowrap()
            .backgroundColor(this.colors.background)
            .color(this.colors.foreground)
            .padding(7)
            .style("padding-left", "20px")
            .style("padding-right", "20px")
            .style("border-radius", "20px")
            .style("transition", "all 0.5s cubic-bezier(0.17,0.73,0,1)")

    }
    buttonColor(v) {
        this.colors.background = v
        this.backgroundColor(this.colors.background)
        return this
    }
    buttonActiveColor(v) {
        this.colors.backgroundActive = v
        return this
    }
}
// ax.views.ContainerView = class extends ax.views.Container {
//     constructor(...args) {
//         let backgroundContainer = new ax.views.Container()
//         let contentContainer = new ax.views.Container(...args)
//         super(backgroundContainer, contentContainer)
//         this.backgroundContainer = backgroundContainer
//         this.contentContainer = contentContainer
//         this.subviewsContent = args
//         this.style("display", "grid")
//         this.style("grid-template-areas: ", "\"ax_containercontent_overlay\"")
//         this.backgroundContainer.style("grid-area", "ax_containercontent_overlay")
//         this.contentContainer.style("grid-area", "ax_containercontent_overlay")
//     }
//     removeChild(v) {
//         let index = this.subviewsContent.indexOf(v)
//         if (index != -1) {
//             this.subviewsContent.splice(index, 1)
//             if (this.activated && v.activated) this.documentObject.removeChild(v.documentObject)
//             v.parent = null
//         } else {
//             console.warn("removing non-existing child from pointing parent")
//         }
//     }
//     clear() {
//         for (let v of this.subviewsContent) {
//             this.removeChild(v)
//         }
//     }
//     background(...args) {
//         this.backgroundContainer.append(view)
//         return this
//     }
// }
//ax.views.VStack = ax.views.Container
ax.views.FlexContainer = class extends ax.views.Container {
    constructor(...args) {
        super(...args)
        this.style("dislpay", "flex")
    }
    append(...args) {
        for (let v of args) {
            super.append(v.style("flex", 1))
        }
    }
}

ax.views.ZStack = class extends ax.views.Container {
    constructor(...args) {
        let contentContainer = new ax.views.Container()
            .style("display", "grid")
            .style("grid-template-areas", "\"ax_containercontent_overlay\"")
            .style("flex", 1)
        super(contentContainer)
        this.subviewsContent = []
        this.contentContainer = contentContainer
        this.append(...args)
        this.style("display", "flex")
    }
    append(...args) {
        for (let view of args) {
            this.contentContainer.append(
                new ax.views.Container(
                    view.style("flex", 1)
                )
                    .style("grid-area", "ax_containercontent_overlay")  //将子元素定位到同一单元格
                    .style("display", "flex")
                    .style("border", ax.debug.stackLayout ? "1px solid cyan" : "")
            )
            this.subviewsContent.push(view)
        }
    }
    removeChild(v) {
        let index = this.subviewsContent.indexOf(v)
        if (index != -1) {
            this.subviewsContent.splice(index, 1)
            if (this.activated && v.activated) this.contentContainer.documentObject.removeChild(v.documentObject)
            v.parent = null
        } else {
            console.warn("removing non-existing child from pointing parent")
        }
    }
}

function HVStackTemplate(vertical) {
    return class extends ax.views.Container {
        constructor(...args) {
            let contentContainer = new ax.views.Container()
                .style("display", "flex")
                .style("flex-direction", vertical ? "column" : "row")
                .style("flex", 1)
            super(contentContainer)
            this.contentContainer = contentContainer
            this.append(...args)
            this.style("display", "flex")
        }
        append(...args) {
            for (let view of args) {
                this.contentContainer.append(
                    new ax.views.Container(
                        view.style("flex", 1)
                    )
                        .style("display", "flex")
                        .style("border", ax.debug.stackLayout ? "1px solid " + (vertical ? "magenta" : "yellow") : "")
                        .apply((v) => {
                            v.setStackElementFixedStyle(view.hasOwnProperty("_stack_fixed") && view._stack_fixed)
                        })
                )
            }
        }
        removeChild(v) {
            this.contentContainer.removeChild(v)
        }
        scroll(enabled = true) {
            if (enabled) {
                this.style("overflow", "scroll")
                if (vertical) {
                    this.contentContainer.height(0)
                } else {
                    this.contentContainer.width(0)
                }
            } else {
                this.style("overflow", "")
                if (vertical) {
                    this.contentContainer.style("height", "")
                } else {
                    this.contentContainer.style("width", "")
                }
            }
            return this
        }
    }
}
ax.views.VStack = HVStackTemplate(true)
ax.views.HStack = HVStackTemplate()
ax.views.ActivityIndicator = class extends ax.views.Container {
    constructor(width) {
        super()
        this.wrappedElement = new ax.views.View()
            .text(ax.resources.indicator_svg_ios)
            .frame(width, width)
            .style("padding", "3px")

        this.append(this.wrappedElement)
    }
    invert() {
        this.style("filter", "invert()")
        return this
    }
    show() {
        this.wrappedElement.style("display", "inline-block")
    }
    hide() {
        this.wrappedElement.style("display", "none")
    }
}
function debounce(func) {  //https://stackoverflow.com/questions/45905160/javascript-on-window-resize-end
    var timer;
    return function (event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 50, event);
    };
}
ax.views.Canvas = class extends ax.views.View {
    constructor() {
        super("canvas")
        this.context = null
        if (ax.debug.canvasLayout) this.style("border", "1px solid black")
        this.canvasWidth = 0
        this.canvasHeight = 0
    }
    onDraw(callback = () => { }) {
        this.onDrawCallBack = callback
        return this
    }
    oncreate() {
        var PIXEL_RATIO = 1
        this.context = this.documentObject.documentObject.getContext('2d')
        this.context.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0)
        let redraw = () => {
            window.requestAnimationFrame(() => {
                this.attrib("width", 0)
                this.attrib("height", 0)
                this.canvasWidth = window.getComputedStyle(this.documentObject.documentObject).width.replace("px", "")
                this.canvasHeight = window.getComputedStyle(this.documentObject.documentObject).height.replace("px", "")
                this.attrib("width", this.canvasWidth * PIXEL_RATIO)
                this.attrib("height", this.canvasHeight * PIXEL_RATIO)
                this.onDrawCallBack(this.context, this, this.canvasWidth * PIXEL_RATIO, this.canvasHeight * PIXEL_RATIO)
            })
        }
        redraw()
        this.redraw=redraw
        window.addEventListener("resize", redraw)//debounce(redraw))
    }
}
ax.views.ScrollView = class extends ax.views.Container {
    constructor(...args) {
        let contentContainer = new ax.views.Container(...args)
        contentContainer.frame(0, 0)
        super(contentContainer)
        this.contentContainer = contentContainer
        this.style("overflow", "scroll")
    }
}

ax.views.Text = class extends ax.views.View {
    constructor(text) {
        super().text(text)
    }
    bold(enabled = true, weight = "bold") {
        if (enabled) {
            this.style("font-weight", weight)
        } else {
            this.style("font-weight", "normal")
        }
        return this
    }
}

ax.views.Dialog = class extends ax.views.VStack {
    constructor(title, content = new ax.views.View(), buttons = []) {
        super()
        this.dialogContentContainer = new ax.views.VStack(
            new ax.views.Text(title).bold(true, 518).padding(7).fixed().style("font-size", "16px"),
            content.style("font-size", "14px"),
        ).padding(12)
        this.buttonContainer = new ax.views.HStack().fixed().color("#0090ff")

        let applyButtonEvent = (self, action) => {
            self.event("mousedown", () => {
                setTimeout(() => self.backgroundColor("#d0d0d0"))
            })
            self.event("mouseup", () => {
                setTimeout(() => self.backgroundColor("rgba(0,0,0,0)"))
            })
            self.event("click", () => {
                action()
                this.visible(false)
            })
        }
        if (buttons.length == 0) {
            buttons = [{
                label: "OK"
            }]
        }
        for (let i in buttons) {
            let button = new ax.views.Text(buttons[i].label)
            if (i == 0) {
                button.padding(10).style('border-bottom-left-radius', "8px")
            } else if (i == buttons.length - 1) {
                button
                    .padding(10)
                    .style("border-left", "1px solid #ccc")
                    .padding(10).style('border-bottom-right-radius', "8px")
            } else {
                button
                    .padding(10)
                    .style("border-left", "1px solid #ccc")
            }
            button.apply((self) => {
                let action = buttons[i].action
                applyButtonEvent(self, action ? action : () => { })
            })
            this.buttonContainer.append(button)
        }


        this.panel = new ax.views.VStack(
            this.dialogContentContainer,
            this.buttonContainer
                .style("border-top", "1px solid #ccc")
        ).borderRadius(8).style("text-align", "center")
            .fixed().backgroundMaterial(5)
            .backgroundColor("rgba(255,255,255,0.75)").width(280)
            .style("transition", "all 0.5s cubic-bezier(0.17,0.73,0,1)")
            .style("-webkit-transition", "all 0.5s cubic-bezier(0.17,0.73,0,1)").style("opacity", 1).style("transform", "scale(1.2)")
        this.append(
            new ax.views.View(),
            new ax.views.HStack(
                new ax.views.View(),
                this.panel,
                new ax.views.View()
            ).fixed(),
            new ax.views.View()
        )
        this.style("z-index", 2).style("transition", "all 1s cubic-bezier(0.17,0.73,0,1)").style("-webkit-transition", "all 0.5s cubic-bezier(0.17,0.73,0,1)").backgroundColor("rgba(0,0,0,0)")
        this.fadeOutTimer = null
        this.visible(false)
    }
    width(px) {
        this.panel.width(px)
        return this
    }
    visible(enabled) {
        console.log(enabled)
        if (enabled) {

            clearInterval(this.fadeOutTimer)
            this.style("display", "flex")
            //https://stackoverflow.com/questions/44035457/using-css-transitions-to-create-a-specific-zoom-in-effect


            this.style("background-color", "rgba(0,0,0,0)")
            this.panel.style("opacity", 0)
            this.panel.style("transform", "scale(1.2)")
            setTimeout(() => {
                this.style("background-color", "rgba(0,0,0,0.3)")
                this.panel.style("opacity", 1)
                this.panel.style("transform", "scale(1)")

            }, 20)


            this.style("pointer-events", "auto")
        } else {
            this.style("background-color", "rgba(0,0,0,0.3)")
            this.panel.style("opacity", 1)
            this.panel.style("transform", "scale(1)")
            setTimeout(() => {
                this.style("background-color", "rgba(0,0,0,0)")
                this.panel.style("opacity", 0)
            })


            this.style("pointer-events", "none")

            if (!this.activated) {
                this.style("display", "none")
            } else {
                this.fadeOutTimer = setTimeout(() => {
                    this.style("display", "none")
                    this.panel.style("transform", "scale(1.2)")
                }, 500)
            }
        }
        return this
    }
}



ax.views.Popup = class extends ax.views.VStack {
    constructor(content) {
        super()

        this.dialogContentContainer = new ax.views.VStack(
            content.style("font-size", "14px"),
        )

        this.panel = new ax.views.VStack(
            this.dialogContentContainer,

        ).borderRadius(8)
            .fixed().panelStyle().backgroundMaterial(5)
            .backgroundColor("rgba(255,255,255,0.75)").width(280)
            .style("transition", "all 0.2s cubic-bezier(0.17,0.73,0,1)")
            .style("-webkit-transition", "all 0.2s cubic-bezier(0.17,0.73,0,1)")

        this.append(
            new ax.views.HStack(
                this.panel,
                new ax.views.View()
            ).fixed(),
            new ax.views.View()
        )
        this.style("z-index", 2)
        this.fadeOutTimer = null
        this.panel.event("click", (e) => {
            //https://stackoverflow.com/questions/13966734/child-element-click-event-trigger-the-parent-click-event
            e.stopPropagation();
        })
        this.event("click", () => {
            if (!this._modal) {
                this.visible(false)
            }

        })
        this.backgroundColor("rgba(0,0,0,0.2)").style("z-index", 2).style("transition", "all 1s cubic-bezier(0.17,0.73,0,1)").style("-webkit-transition", "all 0.5s cubic-bezier(0.17,0.73,0,1)")
    }
    popAt(x, y) {
        this.panel.style("margin-left", x + "px")
        this.panel.style("margin-top", y + "px")
        this.visible(true)
    }
    modal(enabled = true) {
        if (enabled) {
            this._modal = true
        } else {
            this._modal = false
        }
        return this
    }
    width(px) {
        this.panel.width(px)
        return this
    }
    visible(enabled) {
        if (enabled) {
            clearInterval(this.fadeOutTimer)
            this.style("display", "flex")
            //https://stackoverflow.com/questions/44035457/using-css-transitions-to-create-a-specific-zoom-in-effect
            this.panel.style("transform", "scale(0.8)")
            setTimeout(() => {
                this.style("background-color", "rgba(0,0,0,0.3)")
                this.panel.style("opacity", 1)
                this.panel.style("transform", "scale(1)")
                this.style("pointer-events", "auto")
            },20)
        } else {
            setTimeout(() => {
                this.style("background-color", "rgba(0,0,0,0)")
                this.panel.style("transform", "scale(0.8)")
                this.panel.style("opacity", 0)
            })
            this.style("pointer-events", "none")
            if (!this.activated) {
                this.style("display", "none")
            } else {
                this.fadeOutTimer = setTimeout(() => {
                    this.style("display", "none")
                }, 200)
            }
        }
        return this
    }
}
ax.views.TextField = class extends ax.views.View {
    constructor(isPassword = false) {
        super("input")
        this.attrib("type", isPassword ? "password" : "text")
        this.style("-webkit-tap-highlight-color", "transparent")
            .style("-webkit-appearance", "none")
            .style("outline", "none")
            .style("border", "none")
            .style("font-size", "13px")
    }
    placeholder(v) {
        this.attrib("placeholder", v)
        return this
    }
    text(v) {
        this.attrib("value", v)
        return this
    }
    getText() {
        return this.getAttrib("value")
    }
}
// ax.views.NavigationLink=class extends ax.views.ZStack{
//     constructor(){
//         super()
//         this.backgroundColor("rgba(0,0,0,0.3)")
//         this.navcontentContainer=new ax.views.Container(

//         ).backgroundColor("white")
//         this.append(this.navcontentContainer)
//         window.addEventListener("load",()=>{
//             this.visible()
//         })
//         this.style("transition", "all 0.6s cubic-bezier(0.09, 0.75, 0.17, 1.01)").style("-webkit-transition", "all 0.6s cubic-bezier(0.09, 0.75, 0.17, 1.01)")
//     }
//     visible(enabled=true){
//         if(enabled){
//             this.navcontentContainer.style("transform","translateX(0)")
//             window.requestAnimationFrame(()=>{
//                 this.navcontentContainer.style("transition", "all 0.6s cubic-bezier(0.09, 0.75, 0.17, 1.01)").style("-webkit-transition", "all 0.6s cubic-bezier(0.09, 0.75, 0.17, 1.01)")
//                 this.navcontentContainer.style("transform","translateX("+this.getRect()[0]+"px)")
//             })
//         }else{
//             this.navcontentContainer.style("transform","translateX("+this.getRect()[0]+"px)")

//             window.requestAnimationFrame(()=>{
//                 this.navcontentContainer.style("transition", "all 0.6s cubic-bezier(0.09, 0.75, 0.17, 1.01)").style("-webkit-transition", "all 0.6s cubic-bezier(0.09, 0.75, 0.17, 1.01)")
//                 this.navcontentContainer.style("transform","translateX(0)")
//             })
//         }

//     }
// }
// ax.views.HStack = class extends ax.views.Container {
//     constructor(...args) {
//         let contentContainer = ax.views.Container.taggedContainer("tr")
//         let baseContainer=ax.views.Container.taggedContainer("table")
//             .append(contentContainer)
//             .style("width", "100%")
//             .style("border-collapse", "collapse")
//         super(baseContainer)
//         this.subviewsContent = []
//         this.contentContainer = contentContainer
//         this.append(...args)
//     }
//     append(...args) {
//         for (let view of args) {
//             this.contentContainer.append(
//                 ax.views.Container.taggedContainer("td")  //子元素横向单元格（宽度由子元素撑开、空白部分平均分）
//                     .append(view
//                         //.style("float","left")
//                         .style("display","inline-block")
//                     ) //父元素自适应子元素
//                     .style("text-align","center")         //子元素居中
//                     .style("vertical-align","middle")
//             )
//             this.subviewsContent.push(view)
//         }
//     }
//     removeChild(v) {
//         let index = this.subviewsContent.indexOf(v)
//         if (index != -1) {
//             this.subviewsContent.splice(index, 1)
//             if (this.activated && v.activated) this.contentContainer.documentObject.removeChild(v.documentObject)
//             v.parent = null
//         } else {
//             console.warn("removing non-existing child from pointing parent")
//         }
//     }
// }

// ax.views.Binding = class {
//     wrappedValue = null
//     listeners = []
//     get value() {
//         return this.wrappedValue
//     }
//     set value(v) {
//         this.wrappedValue = v
//         this.onChange(v)
//     }
//     onChange(v){}
// }

ax.tools.setHead("meta", { httpEquiv: "Cache-Control", content: "no-cache, no-store, must-revalidate" })
ax.tools.setHead("meta", { httpEquiv: "Expires", content: "0" })
ax.tools.setHead("meta", { httpEquiv: "Pragma", content: "no-cache" })
ax.tools.setHead("meta", { name: "viewport", content: "width=device-width" })
ax.tools.setHead("link", { rel: "icon", href: "data:;base64,=" })
ax.tools.setHead("style", {}, `
    html, body { 
        font-family: -apple-system, Helvetica, sans-serif; 
        margin: 0;
    }
    body{
        touch-action: none;
    }
`)
document.body.removeChild(document.getElementById('s'))
updateProgress = (p = "") => {
    document.getElementById("l").innerHTML = "<div style='width:20px;display:inline-block'>" + ax.resources.indicator_svg_ios + "</div><br>正在加载页面 " + p
}
updateProgress()
ax.init(document)
ax.tools.import(window.location.search.substring(1) + ".ax.js?" + Date.now(), (p) => {
    let per = Math.ceil(p.loaded / p.totalSize * 100) + "%"
    updateProgress(per)
})
    .then((rs) => {
        document.body.removeChild(document.getElementById('l'))
        ax.tools.funcFromSrc(ax.tools.exportAxViews() + rs)()
    })
    .catch((e) => {
        console.error(e)
    })