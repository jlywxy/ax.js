// ax.debug.stackLayout = true
// ax.debug.canvasLayout = true

ax.tools.import("/lib/sha256.js")
    .then((rs) => {
        ax.tools.funcFromSrc(rs)()
        var globalCanvas = null
        var apiurl = "https://jlywxy.top/portguardian-api/vlistmc"
        var playerPoints = [
            // {
            //     name: "jlywxy",
            //     x: 18,
            //     y: 172
            // },
            // {
            //     name: "serverOp",
            //     x: 47,
            //     y: 72
            // }
        ]
        ax.app(
            new ZStack(
                new Canvas().onDraw((ctx, self, width, height) => {
                    draw(ctx, width, height, self.nowX, self.nowY, self.nowZoom)
                }).apply(canvasSetup).label("x").style("z-index", 0),
                new ScrollView(

                    new VStack(
                        new Text("TransRail 实时地图 & PortGuardian").fixed(),
                        new View().fixed().height(10),
                        new HStack(
                            new Text("用户 - ").padding(6).label("pg-userinfo.user"),
                            new Button(new Text("退出登录"), () => {
                                localStorage.removeItem("trfusion_token")
                                logState()
                            }).fixed()
                        ).panelStyle().padding(4).backgroundColor("#f9f9f9").fixed().style("font-size", "14px").label("pg-userinfo"),
                        new View().fixed().height(10),
                        new VStack(
                            new Container(
                                new HStack(
                                    new VStack(
                                        new HStack(
                                            new Container(
                                                new View().backgroundColor("green").borderRadius(10).fixed().frame(10, 10).label("pg-info.state1"),
                                            ).padding(5).fixed(),
                                            new Text("端口已连接").label("pg-info.stateText1")
                                        ),
                                        new HStack(
                                            new Container(
                                                new View().backgroundColor("green").borderRadius(10).fixed().frame(10, 10).label("pg-info.state2"),
                                            ).padding(5).fixed(),
                                            new Text("端口可连通").label("pg-info.stateText2")
                                        ).label("pg-info.state2panel"),
                                    ),
                                    new VStack(
                                        new View(),
                                        new ActivityIndicator().fixed().label("pg-info.indicator").visible(false),
                                        new View(),
                                    ).width(30).fixed(),
                                    new View().fixed().width(10),
                                    new VStack(
                                        new View(),
                                        new Button(new Text("设置"), (e) => {
                                            ax.labels.xx.popAt(30, e.clientY + 30)
                                        }).fixed(),
                                        new View(),
                                    ).fixed()
                                ),

                                new HStack(
                                    new View(),
                                    new Button(new Text("开启端口"), () => {
                                        portguardianAPI.openPort()

                                    }).fixed(),

                                    new View(),
                                ).padding(15),
                                new Text("*请勿在使用vpn或网络代理时开启连接").style("font-size", "11px").color("#909090"),
                            ).label("pg-info"),

                            new Container(
                                new View().fixed().height(10),
                                new Text("登录 Portguardian"),
                                new View().fixed().height(10),
                                new VStack(
                                    new TextField().backgroundColor("rgba(0,0,0,0)").placeholder("用户名").label("pg-login.username"),
                                ).padding(6).backgroundColor("white").borderRadius(10),
                                new View().fixed().height(10),
                                new VStack(
                                    new TextField(true).backgroundColor("rgba(0,0,0,0)").placeholder("密码").label("pg-login.pass"),
                                ).padding(6).backgroundColor("white").borderRadius(10),
                                new View().fixed().height(10),
                                new Button(
                                    new HStack(
                                        new View(),
                                        new ActivityIndicator().fixed().frame(20, 20).label("pg-login.indicator").invert().visible(false),
                                        new Text("登录"),
                                        new View(),

                                    )

                                    , () => {
                                        ax.labels["pg-login.indicator"].visible(true)
                                        portguardianAPI.login(ax.labels["pg-login.username"].getText(), ax.labels["pg-login.pass"].getText(), (r) => {
                                            if (!r) { dialog(new Dialog("用户名或密码错误")) } else {
                                                portguardianAPI.getState()
                                            }

                                            ax.labels["pg-login.indicator"].visible(false)
                                        })
                                        // localStorage.setItem("trfusion_token", "jlywxy|")
                                        // logState()
                                    }).color("white").buttonColor("#00a0f0"),

                            ).style("text-align", "center").label("pg-login").visible(false),



                        ).panelStyle().padding(13).backgroundColor("#f9f9f9").fixed().style("font-size", "15px"),
                        new View().fixed().height(10),
                        new VStack(
                            new Text("点按或悬停光标查看车站信息<br>按住并拖动可移动地图；滑动鼠标滚轮、触控板上下滑动或双指捏合缩放地图").label("tr-panel-info")
                        ).panelStyle().padding(13).backgroundColor("#f9f9f9").fixed().style("font-size", "13px").label("trmap-panel"),
                        new View(),
                    ).style("font-size", "17px").style("pointer-events", "auto")
                        .backgroundMaterial().padding(20).panelStyle().width(270)
                ).padding(20).style("z-index", 1).style("pointer-events", "none"),
                //https://stackoverflow.com/questions/1009753/pass-mouse-events-through-absolutely-positioned-element

                new Popup(
                    new VStack(
                        new View().fixed().height(10),
                        new VStack(
                            new View().fixed().height(10),
                            new VStack(
                                new TextField(true).backgroundColor("rgba(0,0,0,0)").placeholder("旧密码")
                                    .label("ax-setting.oldp"),
                            ).padding(6).backgroundColor("#f0f0f0").borderRadius(10),
                            new View().fixed().height(10),
                            new VStack(
                                new TextField(true).backgroundColor("rgba(0,0,0,0)").placeholder("新密码")
                                    .label("ax-setting.newp"),
                            ).padding(6).backgroundColor("#f0f0f0").borderRadius(10),
                            new View().fixed().height(10),
                            new VStack(
                                new TextField(true).backgroundColor("rgba(0,0,0,0)").placeholder("再次输入新密码")
                                    .label("ax-setting.newp2"),
                            ).padding(6).backgroundColor("#f0f0f0").borderRadius(10),
                            new View().fixed().height(10),
                            new HStack(
                                new View(),
                                new Button(new Text("修改密码"), () => {
                                    let oldp = ax.labels["ax-setting.oldp"].getText()
                                    let newp = ax.labels["ax-setting.newp"].getText()
                                    let newp2 = ax.labels["ax-setting.newp2"].getText()
                                    if (newp != newp2) {
                                        dialog(new Dialog("新密码不一致"))
                                        return
                                    } else if (newp == "") {
                                        dialog(new Dialog("新密码为空"))
                                        return
                                    }
                                    portguardianAPI.modpass(oldp, newp, (r) => {
                                        if (r) {
                                            dialog(new Dialog("密码修改成功"))
                                        }
                                        ax.labels["ax-setting.oldp"].text("")
                                        ax.labels["ax-setting.newp"].text("")
                                        ax.labels["ax-setting.newp2"].text("")
                                    })

                                }).padding(6).fixed(),
                                new View(),
                            )


                        ).panelStyle().padding(10).backgroundColor("white"),
                        new View().fixed().height(10),
                        new Container(
                            new VStack(
                                new TextField().backgroundColor("rgba(0,0,0,0)").placeholder("用户名").label("ax-setting.newuser"),
                            ).padding(6).backgroundColor("#f0f0f0").borderRadius(10),
                            new View().fixed().height(10),
                            new Text("*新用户的初始密码是 teleport").style("font-size", "11px").color("#909090"),
                            new View().fixed().height(10),
                            new HStack(
                                new View(),
                                new Button(new Text("新建用户"), () => {
                                    portguardianAPI.adduser(ax.labels["ax-setting.newuser"].getText(), "teleport")
                                }).padding(6).fixed(),
                                new View(),
                            )

                        ).panelStyle().padding(10).backgroundColor("white").label("pg-setting.admin.userpanel"),
                        new View().fixed().height(10),
                        new Container(
                        new HStack(
                            new View(),
                            new Button(new Text("关闭车站信息显示")).fixed().apply((self) => {
                                self.event("click", () => {
                                    if (ax.labels["trmap-panel"].isVisible == undefined) ax.labels["trmap-panel"].isVisible = true
                                    ax.labels["trmap-panel"].visible(!ax.labels["trmap-panel"].isVisible)
                                    if (ax.labels["trmap-panel"].isVisible) {
                                        self.text("关闭车站信息显示")
                                    } else {
                                        self.text("打开车站信息显示")
                                    }
                                })

                            }),
                            new View()
                        ),
                        new View().fixed().height(10),
                        new HStack(
                            new View(),
                            new Button(new Text("端口超控")).fixed().apply((self) => {
                                self.event("click", () => {
                                    portguardianAPI.overridePort()
                                })

                            }),
                            new View()
                        ).label("pg-setting.admin.port"),
                        ).panelStyle().padding(10).backgroundColor("white"),
                        new View().fixed().height(10),
                        new Text("Ax.js version "+ax.version).style("font-size", "11px").color("#909090"),
                        new Text("TransRail Fusion UI 1.1").style("font-size", "11px").color("#909090"),
                        new Text("Portguardian API -").style("font-size", "11px").color("#909090").label("pg-setting.ver"),
                        new Text("TransRail Bot version -").style("font-size", "11px").color("#909090").label("pg-setting.trbot.ver"),
                    ).padding(18)
                ).style("z-index", 3).visible(false).label("xx"),


            ).label("app-window")
        )

        function dialog(obj) {
            ax.labels["app-window"].append(obj.style("z-index", 9))
            obj.visible(true)
        }

        if(!localStorage.getItem("trfusion_flag")){
            localStorage.setItem("trfusion_flag","1")
            dialog(new Dialog("PortGuardian端口认证 和 TR实时地图 现已合二为一", new Text("新的网页提供端口认证服务和铁路图展示服务，并在铁路图上标注每一个在线玩家的实时位置。<br>如需使用旧版PortGuardian，请访问https://jlywxy.top/pg/?&mvt")))
        }
        var portguardianAPI = {
            login: (account, code, callBack) => {
                ax.tools.ajax.postJson(apiurl, {
                    type: "login",
                    account: account,
                    body: {
                        "code": sha256(code)
                    }
                }, (r) => {
                    let res = r.responseText
                    let obj = JSON.parse(res)
                    if (errorReceived(obj, [1])) return
                    if (obj.token) {
                        localStorage.setItem("trfusion_token", account + "|" + obj.token)
                        logState()
                        callBack(true)
                    } else {
                        console.log("login failed: " + res)
                        callBack(false)
                    }
                }, (err) => {
                    callBack(false, err)
                })
            },
            logout: () => {
                logui.login()
                portguardianAPI.portunauth(() => {
                    removeToken()
                })

            },
            portunauth: (callBack) => {
                shownetIndicator()
                ax.tools.ajax.postJson(apiurl, { "type": "portunauth", account: localStorage.getItem("trfusion_token").split("|")[0], token: localStorage.getItem("trfusion_token").split("|")[1] }, (r) => {
                    hidenetIndicator()
                    callBack()
                })
            },
            modpass: (oldp, newp, callBack) => {

                shownetIndicator()
                ax.tools.ajax.postJson(apiurl, {
                    type: "modpass",
                    account: localStorage.getItem("trfusion_token").split("|")[0], token: localStorage.getItem("trfusion_token").split("|")[1],
                    body: {
                        code: sha256(oldp),
                        codenew: sha256(newp)
                    }
                }, (r) => {
                    hidenetIndicator()
                    let obj = JSON.parse(r.responseText)
                    if (obj.error) {
                        if (errorReceived(obj)) {
                            callBack(false)
                        }
                        return
                    } else {
                        callBack(true)
                    }
                })
            },
            adduser: (account, code) => {
                shownetIndicator()
                ax.tools.ajax.postJson(apiurl, { "type": "adduser", account: localStorage.getItem("trfusion_token").split("|")[0], token: localStorage.getItem("trfusion_token").split("|")[1], body: { account: account, code: sha256(code) } }, (r) => {
                    hidenetIndicator()
                    let obj = JSON.parse(r.responseText)
                    if (errorReceived(obj)) {
                        return
                    } else {
                        console.log("已新建用户")
                        controls.newaccount.text = ""
                        controls.newpass.text = ""
                    }
                })
            },
            deluser: (account) => {
                shownetIndicator()
                ax.tools.ajax.postJson(apiurl, { "type": "deluser", account: localStorage.getItem(page.params + "_account"), token: localStorage.getItem(page.params + "_token"), body: { account: account } }, (r) => {
                    hidenetIndicator()
                    let obj = JSON.parse(r.responseText)
                    if (errorReceived(obj)) {
                        return
                    } else {
                        dialog(new Dialog("已删除用户"))
                    
                    }
                })
            },
            overridePort: () => {
                shownetIndicator()
                ax.tools.ajax.postJson(apiurl, { "type": "portoverride", account: localStorage.getItem("trfusion_token").split("|")[0], token: localStorage.getItem("trfusion_token").split("|")[1] }, (r) => {
                    hidenetIndicator()
                    let obj = JSON.parse(r.responseText)
                    if (errorReceived(obj)) {
                        return
                    } else {
                        dialog(new Dialog("已全局开启端口，30秒后限制新连接。"))
                    }
                })
            },
            openPort: () => {
                shownetIndicator()
                ax.tools.ajax.postJson(apiurl, { "type": "portauth", account: localStorage.getItem("trfusion_token").split("|")[0], token: localStorage.getItem("trfusion_token").split("|")[1] }, (r) => {
                    if (r) {
                        dialog(new Dialog("已开启端口", new Text("请在30秒内连接Minecraft服务器，30秒后端口限制新连接。若Minecraft客户端断开连接，需要重新开启端口。<br><br>服务器地址: <b>tr.jlywxy.top</b>")))
                    }
                    hidenetIndicator()
                })
            },
            getState: () => {
                ax.tools.ajax.postJson(apiurl, { "type": "userstat", account: localStorage.getItem("trfusion_token").split("|")[0], token: localStorage.getItem("trfusion_token").split("|")[1] }, (r) => {
                    let obj = JSON.parse(r.responseText)
                    console.log(obj)
                    if (obj.error) {
                        if (obj.type == 4) {
                            if(localStorage.getItem("trfusion_token")){
                                dialog(new Dialog("登录过期，需要重新登录"))
                            }
                            setpgInfo(0)
                            localStorage.removeItem("trfusion_token")
                            logState()
                            return
                        } else {
                            setpgInfo(5)
                            return
                        }
                    } else {
                        if(obj["trbot"]){
                            let trbotObj=JSON.parse(obj.trbot)
                            console.log(trbotObj.list)
                            playerPoints=trbotObj.list
                            ax.labels["pg-setting.trbot.ver"].text("TransRail Bot version "+trbotObj.version)
                        }
                        if (!obj.portstate) {
                            setpgInfo(9)
                        }
                        if (obj.isadmin) {
                            ax.labels["pg-setting.admin.userpanel"].visible(true)
                            ax.labels["pg-setting.admin.port"].visible(true)
                        }else{
                            ax.labels["pg-setting.admin.userpanel"].visible(false)
                            ax.labels["pg-setting.admin.port"].visible(false)
                            
                        }
                        let pgversion = obj.version ? obj.version : "0.9"
                        ax.labels["pg-setting.ver"].text("PortGuardian API version "+pgversion)
                        if(obj.portstate){
                            switch (obj.portstate.state) {
                                case "auth_limited":
                                    setpgInfo(2)
                                    break;
                                case "auth_opened":
                                    setpgInfo(1)
                                    break;
                                case "auth_global":
                                    setpgInfo(3)
                                    break;
                                case "auth_global_limited":
                                    setpgInfo(4)
                                    break;
                                case "unauth":
                                    setpgInfo(6)
                                    break;
                                default:
                                    setpgInfo(5)
                            }
                        }
                        
                        switch (obj.connstate) {
                            case false:
                                setpgInfo(7)
                                break;
                            default:
                                setpgInfo(11)
                        }
                    }
                }, () => {
                    setpgInfo(8)
                })
            }
        }
        window.portguardianAPI = portguardianAPI
        window.setpgInfo = setpgInfo
        setpgInfo(0)
        if (localStorage.getItem("trfusion_token")) {
            portguardianAPI.getState()
        }
        setInterval(() => {
            if (localStorage.getItem("trfusion_token")) {
                portguardianAPI.getState()
                globalCanvas.redraw()
            }
        }, 500)
        window.dialog = dialog
        function setpgInfo(state) {
            switch (state) {
                case 0:  //获取状态
                    ax.labels["pg-info.state1"].backgroundColor("orange")
                    ax.labels["pg-info.stateText1"].text("正在获取状态")
                    ax.labels["pg-info.state2panel"].visible(false)
                    break;
                case 1:  //已开启
                    ax.labels["pg-info.state1"].backgroundColor("green")
                    ax.labels["pg-info.stateText1"].text("端口已开启")
                    ax.labels["pg-info.state2panel"].visible(true)
                    break;
                case 2:  //已开启（限制性）
                    ax.labels["pg-info.state1"].backgroundColor("orange")
                    ax.labels["pg-info.stateText1"].text("端口限制性开启")
                    ax.labels["pg-info.state2panel"].visible(true)
                    break;
                case 3:  //已开启（管理员）
                    ax.labels["pg-info.state1"].backgroundColor("green")
                    ax.labels["pg-info.stateText1"].text("端口已开启(管理员超控)")

                    ax.labels["pg-info.state2panel"].visible(true)
                    break;
                case 4:  //已开启（管理员，限制性）
                    ax.labels["pg-info.state1"].backgroundColor("orange")
                    ax.labels["pg-info.stateText1"].text("端口限制性开启(管理员超控)")
                    ax.labels["pg-info.state2panel"].visible(true)
                    break;
                case 5:  //协议不支持
                    ax.labels["pg-info.state1"].backgroundColor("orange")
                    ax.labels["pg-info.stateText1"].text("不支持的协议")
                    ax.labels["pg-info.state2panel"].visible(false)
                    break;
                case 6:  //已关闭
                    ax.labels["pg-info.state1"].backgroundColor("red")
                    ax.labels["pg-info.stateText1"].text("端口已关闭")
                    ax.labels["pg-info.state2panel"].visible(true)
                    break;
                case 7:  //端口不能连通
                    ax.labels["pg-info.state2"].backgroundColor("red")
                    ax.labels["pg-info.stateText2"].text("端口无法连通")
                    ax.labels["pg-info.state2panel"].visible(true)
                    break;
                case 8:  //网络错误
                    ax.labels["pg-info.state1"].backgroundColor("red")
                    ax.labels["pg-info.stateText1"].text("网络错误")
                    ax.labels["pg-info.state2panel"].visible(false)
                    break;
                case 9:  //未初始化
                    ax.labels["pg-info.state1"].backgroundColor("gray")
                    ax.labels["pg-info.stateText1"].text("未初始化")
                    ax.labels["pg-info.state2panel"].visible(false)
                    break;
                case 10:  //需要重新登录
                    ax.labels["pg-info.state1"].backgroundColor("red")
                    ax.labels["pg-info.stateText1"].text("需要重新登录")
                    ax.labels["pg-info.state2panel"].visible(false)
                    break;
                case 11:  //端口可连通
                    ax.labels["pg-info.state2"].backgroundColor("green")
                    ax.labels["pg-info.stateText2"].text("端口可连通")
                    ax.labels["pg-info.state2panel"].visible(true)
                    break;
            }
        }

        function logState() {
            if (!localStorage.getItem("trfusion_token")) {
                ax.labels["pg-info"].visible(false)
                ax.labels["pg-userinfo"].visible(false)
                ax.labels["pg-login"].visible(true)
            } else {
                let tokenSeg = localStorage.getItem("trfusion_token").split("|")
                ax.labels["pg-userinfo.user"].text("用户 - " + tokenSeg[0])
                ax.labels["pg-info"].visible(true)
                ax.labels["pg-userinfo"].visible(true)
                ax.labels["pg-login"].visible(false)
            }
        }
        logState()

        let lastStationName = ""
        function findPoint(x, y, accuracy = 10) {
            for (let i of pointdata) {
                if (x > i.realX - accuracy && x < i.realX + accuracy
                    & y > i.realY - accuracy && y < i.realY + accuracy) {
                    showStationInfo(i)
                }
            }
        }
        function showStationInfo(station) {
            if (lastStationName != station.name) {
                let stationNameSeg = station.name.split("-")

                let admindepot = []
                for (let admin of railAdmin) {
                    for (let depot of admin.depot) {
                        for (let _station of depot.stations) {
                            if (_station == station.name) {
                                admindepot[0] = admin.name
                                admindepot[1] = depot.name
                                break
                            }
                        }
                    }
                }

                let stationOf = ""
                for (let i = 1; i < stationNameSeg.length - 2; i++) {
                    let trobj = tr[stationNameSeg[i].toLowerCase()]
                    stationOf += "<br>" + "<span style='color:" + trobj.color + "'>▇ " + trobj.name + "</span>"
                }
                ax.labels["tr-panel-info"].text(
                    "<b>" + stationNameSeg[stationNameSeg.length - 2] + "站</b>" + "<br>"
                    + "唯一编码: " + station.name + "<br>"
                    + "所属线路: " + stationOf + "<br>"
                    + "运营部门: " + admindepot.join(" ") + "<br>"
                    + "坐标: " + "(" + station.x + " ~ " + station.y + ")" + "<br>"
                )

                lastStationName = station.name
            }
        }
        var pointhash = {}


        let lastZoom = 1
        window
        function canvasSetup(self) {
            globalCanvas = self
            self.startX = 0
            self.startY = 0

            self.nowX = -550
            self.nowY = -200

            self.deltaZoom = 1
            self.nowZoom = 1

            self.zoomDiff = -1

            self.pointerEvents = []
            self.onpointerdown = (e) => {
                self.pointerEvents.push(e)
                findPoint(e.clientX, e.clientY, 80)
            }
            self.onpointermove = (e) => {
                for (let i in self.pointerEvents) {
                    if (e.pointerId == self.pointerEvents[i].pointerId) {
                        self.pointerEvents[i] = e;
                        break
                    }
                }
                let currentCenterX = 0, currentCenterY = 0
                if (self.pointerEvents.length == 2) {
                    let currentZoom = Math.sqrt(Math.pow(Math.abs(self.pointerEvents[0].clientX - self.pointerEvents[1].clientX), 2) + Math.pow(Math.abs(self.pointerEvents[0].clientY - self.pointerEvents[1].clientY), 2));
                    currentCenterX = (self.pointerEvents[0].clientX + self.pointerEvents[1].clientX) / 2
                    currentCenterY = (self.pointerEvents[0].clientY + self.pointerEvents[1].clientY) / 2
                    if (self.zoomDiff > 0) {
                        self.deltaZoom = currentZoom / self.zoomDiff - 1
                        self.zoomDiff = currentZoom
                        self.nowZoom += self.deltaZoom
                        self.nowZoom = Math.max(self.nowZoom, 0.3)
                        self.nowZoom = Math.min(self.nowZoom, 2.5)

                        if (!self.move) {
                            self.move = true
                            self.startX = currentCenterX
                            self.startY = currentCenterY
                        } else {
                            self.deltaX = currentCenterX - self.startX
                            self.deltaY = currentCenterY - self.startY

                            self.nowX += self.deltaX
                            self.nowY += self.deltaY
                            self.startX = currentCenterX
                            self.startY = currentCenterY
                        }






                        window.requestAnimationFrame(() => {
                            draw(self.context, self.canvasWidth, self.canvasHeight,
                                self.nowX,
                                self.nowY,
                                self.nowZoom, self.deltaZoom, [currentCenterX, currentCenterY])
                        })
                    } else {
                        self.zoomDiff = currentZoom
                    }
                } else if (self.pointerEvents.length == 1) {
                    currentCenterX = Math.floor(e.clientX)
                    currentCenterY = Math.floor(e.clientY)
                    if (!self.move) {
                        self.move = true
                        self.startX = currentCenterX
                        self.startY = currentCenterY
                    } else {
                        self.deltaX = currentCenterX - self.startX
                        self.deltaY = currentCenterY - self.startY

                        self.nowX += self.deltaX
                        self.nowY += self.deltaY
                        self.startX = currentCenterX
                        self.startY = currentCenterY




                        window.requestAnimationFrame(() => {
                            draw(self.context, self.canvasWidth, self.canvasHeight,
                                self.nowX,
                                self.nowY,
                                self.nowZoom, self.deltaZoom, [currentCenterX, currentCenterY])
                        })
                    }
                }
                findPoint(e.clientX, e.clientY)
            }

            self.onpointerup = (e) => {
                for (let i in self.pointerEvents) {
                    if (self.pointerEvents[i].pointerId == e.pointerId) {
                        self.pointerEvents.splice(i, 1)
                        break
                    }
                }
                if (self.pointerEvents.length < 2) {
                    self.zoomDiff = -1
                }
                self.move = false
            }
            self.event("pointerdown", self.onpointerdown)
            self.event("pointermove", self.onpointermove)
            self.event("pointerup", self.onpointerup)
            self.event("pointercancel", self.onpointerup)
            self.event("pointerout", self.onpointerup)
            self.event("pointerleave", self.onpointerup)
            self.event("wheel", (e) => {

                self.nowZoom += e.deltaY / 40
                self.nowZoom = Math.max(self.nowZoom, 0.3)
                self.nowZoom = Math.min(self.nowZoom, 2.5)
                self.deltaZoom = e.deltaY / 40



                window.requestAnimationFrame(() => {
                    draw(self.context, self.canvasWidth, self.canvasHeight,
                        self.nowX,
                        self.nowY,
                        self.nowZoom, self.deltaZoom, [e.clientX, e.clientY])
                })
            })

        }
        
        // setInterval(()=>{
        //     // draw(globalCanvas.context,globalCanvas.getRect[0],globalCanvas.getRect[1],globalCanvas.nowX,globalCanvas.nowY,globalCanvas.nowZoom)
            
            
        // },500)
        window.setPlayer = setPlayer
        function setPlayer(v){
            playerPoints=v
        }
        function draw(ctx, width, height, offsetX, offsetY, zoom = 1, deltaZoom = 0, zoomCenter = [0, 0]) {
            ctx.clearRect(0, 0, width, height)
            let minx = 0, miny = 0, maxx = 0, maxy = 0
            for (let i of pointdata) {
                let ix = Math.floor(i.x)
                let iy = Math.floor(i.y)
                if (ix < minx) minx = ix;
                if (iy < miny) miny = iy;
                if (ix > maxx) maxx = ix;
                if (iy > maxy) maxy = iy;
                pointhash[i.name] = i
            }
            let pointsOriginWidth = maxx - minx
            let pointsOriginHeight = maxy - miny

            let realZoom = zoom / 3
            let realWidth = pointsOriginWidth * realZoom
            let realHeight = pointsOriginHeight * realZoom

            let realLeft = offsetX + ((width) / 2 - offsetX) * (1 - zoom)
            let realTop = offsetY + ((height) / 2 - offsetY) * (1 - zoom)

            ctx.strokeStyle = "#909090"
            ctx.lineWidth = 1
            ctx.rect(realLeft, realTop, realWidth, realHeight)
            ctx.stroke()

            for (let l of Object.keys(tr)) {
                let line = tr[l]
                try {
                    let stations = line.stations
                    let reverses = line.reverses
                    let tilts = line.tilts
                    let color = line.color
                    let dashed = line.dashed
                    let start = null
                    let i = 0
                    for (let station of stations) {
                        if (start != null) {
                            if (!pointhash[station]) {
                                console.log(
                                    "车站地图点数据未找到", "位置：" + station + "，请联系管理员。"
                                )
                            }
                            if (tilts) {
                                drawRegionTiltLine(ctx,
                                    (start.x - minx) * realZoom + realLeft,
                                    (start.y - miny) * realZoom + realTop,
                                    (pointhash[station].x - minx) * realZoom + realLeft,
                                    (pointhash[station].y - miny) * realZoom + realTop,
                                    color, dashed[i - 1], reverses[i - 1])
                            } else {
                                drawRegionLine(ctx,
                                    (start.x - minx) * realZoom + realLeft,
                                    (start.y - miny) * realZoom + realTop,
                                    (pointhash[station].x - minx) * realZoom + realLeft,
                                    (pointhash[station].y - miny) * realZoom + realTop,
                                    color, dashed[i - 1])
                            }
                        }
                        start = pointhash[station]
                        i++
                    }
                } catch (e) {
                    console.log("error drawing: " + l + "\n" + e)
                }
            }
            ctx.strokeStyle = "black"
            ctx.font = "normal 13px Helvetica";
            ctx.lineWidth = 1
            let transformCoord = (d, mind, zoom, offset) => {
                return (Math.floor(d) - mind) * zoom + offset
            }
            for (let i of pointdata) {
                if (i.name.indexOf("NULL") != -1 || i.name.indexOf("UNDEFINED") != -1) continue
                let x = transformCoord(i.x, minx, realZoom, realLeft)//(Math.floor(i.x) - minx) * realZoom + realLeft
                let y = transformCoord(i.y, miny, realZoom, realTop)
                i.realX = x
                i.realY = y
                drawStationPoint(ctx, x, y)
                ctx.fillStyle = "#404040"
                let stationNameSeg = i.name.split("-")
                ctx.fillText(stationNameSeg[stationNameSeg.length - 2], x + 13, y + 13)
            }
            for (let i of playerPoints) {
                if(i.name=="serverOp")continue
                drawPlayerPoint(ctx, i.name, transformCoord(i.pos[0], minx, realZoom, realLeft), transformCoord(i.pos[2], miny, realZoom, realTop))
            }
            // return [realLeft, realTop]
            lastZoom = zoom
        }


        function drawStationPoint(ctx, x, y) {
            ctx.lineWidth = 3
            ctx.fillStyle = "#505050"
            ctx.beginPath();
            ctx.arc(x, y, 9, 0, angle(360))
            ctx.fill()
            ctx.fillStyle = "white"
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, angle(360))
            ctx.fill()


        }
        function drawPlayerPoint(ctx, playerName, x, y) {
            //https://stackoverflow.com/questions/20909585/html5-canvas-text-shadow-equivalent

            //ctx.lineWidth = 3
            ctx.fillStyle = "black"
            ctx.beginPath();
            ctx.moveTo(x - 15, y - 27)
            ctx.lineTo(x + 15, y - 27)
            ctx.lineTo(x, y)
            ctx.fill()
            ctx.fillStyle = "#f0d050"
            ctx.beginPath();
            ctx.moveTo(x - 10, y - 23)
            ctx.lineTo(x + 10, y - 23)
            ctx.lineTo(x, y - 4)
            ctx.fill()

            ctx.shadowColor = "#505050";
            ctx.shadowBlur = 4;
            ctx.font = "bold 17px Helvetica";
            ctx.strokeText(playerName, x - 20, y - 35)
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#f0d050"
            ctx.fillText(playerName, x - 20, y - 35)

        }
        function angle(v) {
            return Math.PI / 180 * v
        }
        function drawRegionTiltLine(ctx, x1, y1, x2, y2, color, dash, reverse = false) {
            let midX = (x1 + x2) / 2
            let midY = (y1 + y2) / 2
            if (reverse) {
                drawRegionLine(ctx, midX, midY, x1, y1, color, dash)
                drawRegionLine(ctx, midX, midY, x2, y2, color, dash)
            } else {
                drawRegionLine(ctx, x2, y2, midX, midY, color, dash)
                drawRegionLine(ctx, x1, y1, midX, midY, color, dash)
            }
        }
        function drawRegionLine(ctx, x1, y1, x2, y2, color, dash = false) {
            let cornerR = 10
            let pointR = 0
            if (Math.abs(x1 - x2) < 8 || Math.abs(y1 - y2) < 8) {
                cornerR = 3
            }

            ctx.lineWidth = 5;
            if (dash) {
                ctx.setLineDash([6, 6])
            } else {
                ctx.setLineDash([])
            }
            ctx.strokeStyle = color
            ctx.beginPath();
            let type = ""
            if (x1 < x2) {
                if (y1 < y2) {
                    type = "ws"
                } else {
                    type = "wn"
                }
            } else {
                if (y1 < y2) {
                    type = "es"
                } else {
                    type = "en"
                }
            }
            switch (type) {
                case "ws":
                    ctx.moveTo(x1 + pointR, y1)
                    ctx.lineTo(x2 - cornerR, y1)
                    ctx.arc(x2 - cornerR, y1 + cornerR, cornerR, angle(270), angle(0))
                    ctx.moveTo(x2, y1 + cornerR)
                    ctx.lineTo(x2, y2 - pointR)
                    break;
                case "wn":
                    ctx.moveTo(x1 + pointR, y1)
                    ctx.lineTo(x2 - cornerR, y1)
                    ctx.arc(x2 - cornerR, y1 - cornerR, cornerR, angle(90), angle(0), true)
                    ctx.moveTo(x2, y1 - cornerR)
                    ctx.lineTo(x2, y2 + pointR)
                    break;
                case "es":
                    ctx.moveTo(x1 - pointR, y1)
                    ctx.lineTo(x2 + cornerR, y1)
                    ctx.arc(x2 + cornerR, y1 + cornerR, cornerR, angle(270), angle(180), true)
                    ctx.moveTo(x2, y1 + cornerR)
                    ctx.lineTo(x2, y2 - pointR)
                    break;
                case "en":
                    ctx.moveTo(x1 - pointR, y1)
                    ctx.lineTo(x2 + cornerR, y1)
                    ctx.arc(x2 + cornerR, y1 - cornerR, cornerR, angle(90), angle(180))
                    ctx.moveTo(x2, y1 - cornerR)
                    ctx.lineTo(x2, y2 + pointR)
                    break;
            }
            ctx.stroke()
            ctx.fillStyle = "black"
            ctx.setLineDash([])
        }

        function shownetIndicator() {
            ax.labels["pg-info.indicator"].visible(true)
        }
        function hidenetIndicator() {
            ax.labels["pg-info.indicator"].visible(false)
        }
        function errorReceived(obj, filter = []) {
            
            if (obj.error) {
                console.error(obj.error)
                if (filter.indexOf(obj.type) != -1) return false
                console.log(obj)
                switch (obj.type) {
                    case -1:
                        console.log(obj.error)
                        break;
                    case 0:
                        switch (obj.code) {
                            case 0: case 1:
                                dialog(new Dialog("不受支持的协议", new Text("请使用最新版本客户端。")))
                                break;
                            case 2: case 3:
                                dialog(new Dialog("不受支持的协议", new Text("联系管理员更新软件版本。")))
                                break;
                        }
                        break;
                    case 1:
                        switch (obj.code) {
                            case 0:
                                dialog(new Dialog("用户名或密码错误", new Text("用户不存在")))
                                break
                            case 1:
                                dialog(new Dialog("用户名或密码错误", new Text("密码错误")))
                                break
                            case 2:
                                dialog(new Dialog("操作失败", new Text("旧密码错误")))
                                break
                        }
                        break;
                    case 2:
                        dialog(new Dialog("服务器拒绝当前请求", new Text("请稍后再试")))
                        break;
                    case 3:
                        dialog(new Dialog("未知错误", obj.error))
                        break;
                    case 4:
                        dialog(new Dialog("操作失败", new Text("用户鉴权失败，请重新登录。")))
                        break;
                    case 5:
                        switch (obj.code) {
                            case 0:
                                dialog(new Dialog("操作被拒绝", new Text("目前登录的用户没有进行此操作的权限。")))
                                break
                            case 1:
                                dialog(new Dialog("操作被拒绝", new Text("系统已拒绝此用户的操作：管理员权限冲突。")))
                        }
                        break;
                    default:
                        dialog(new Dialog("未知错误: 不受支持的协议", new Text("Error Type " + obj.type + "/" + obj.code + ":" + obj.error)))
                }
                return true
            }
            return false
        }


        var pointdata =
            [{ "name": "TR-C-彩虹-S2", "x": "113", "y": "178" }, { "name": "TR-C-小麦岛-S4E", "x": "222", "y": "23" }, { "name": "TR-NULL-土地资源局-S10", "x": "-14", "y": "227" }, { "name": "TR-S-盘龙江-S12", "x": "377", "y": "303" }, { "name": "TR-NULL-铁路博物馆-S6", "x": "829", "y": "298" }, { "name": "TR-S-齐云观-S11", "x": "1195", "y": "305" }, { "name": "TR-TG-檀城村-S13E", "x": "504", "y": "778" }, { "name": "TR-TG-致远村-S17E", "x": "1023", "y": "1072" }, { "name": "TR-NULL-藤原-S15", "x": "690", "y": "-176" }, { "name": "TR-C-芍药居-S19", "x": "469", "y": "-187" }, { "name": "TR-UNDEFINED-海贝大剧院-S23", "x": "720", "y": "-800" }, { "name": "TR-SP-桑瓦半岛-S33", "x": "1491", "y": "-1574" }, { "name": "TR-SP-杨柳湾-S34", "x": "1279", "y": "-1512" }, { "name": "TR-SRB-KM-白井大厦-S22", "x": "865", "y": "-514" }, { "name": "TR-H-大洋基地-S32", "x": "101", "y": "-1592" }, { "name": "TR-KM-S-白头岭-S36", "x": "1370", "y": "-398" }, { "name": "TR-KM-白头岭东-S37", "x": "1512", "y": "-456" }, { "name": "TR-KM-高岭海湾东-S38", "x": "1719", "y": "-396" }, { "name": "TR-KM-高岭海湾北-S39", "x": "1627", "y": "-516" }, { "name": "TR-TG-盘龙山南-S40", "x": "508", "y": "540" }, { "name": "TR-SP-红杨村-S41", "x": "1233", "y": "-1013" }, { "name": "TR-KM-雾峰-S43E", "x": "2068", "y": "-220" }, { "name": "TR-KM-飞瀑-S44E", "x": "2038", "y": "-240" }, { "name": "TR-KM-云顶-S45E", "x": "1985", "y": "-236" }, { "name": "TR-KM-近海-S46E", "x": "1968", "y": "-274" }, { "name": "TR-CN-牛角冲-S48", "x": "47", "y": "72" }, { "name": "TR-TC-乾阳宫-S50", "x": "1520", "y": "1474" }, { "name": "TR-TC-泰嘉湖东-S51", "x": "858", "y": "1463" }, { "name": "TR-S-雨花台-S49", "x": "1503", "y": "-95" }, { "name": "TR-TG-LC-泰嘉湖-S14", "x": "508", "y": "1070" }, { "name": "TR-LC-TC-云池北-S52", "x": "218", "y": "1463" }, { "name": "TR-LC-燕鸣岛-S53", "x": "212", "y": "2046" }, { "name": "TR-SRB-白井城-S54", "x": "887", "y": "-741" }, { "name": "TR-C-CN-M-竹居南-S56", "x": "18", "y": "172" }, { "name": "TR-SRB-C-白井城南-S20", "x": "825", "y": "-235" }, { "name": "TR-C-暮冬堡-S57", "x": "-246", "y": "167" }, { "name": "TR-KM-雾峰北-S35", "x": "1900", "y": "-315" }, { "name": "TR-C-花海-S8", "x": "342", "y": "-108" }, { "name": "TR-H-雾岛-S31", "x": "223", "y": "-1209" }, { "name": "TR-C-S-滨江-S3", "x": "312", "y": "151" }, { "name": "TR-TC-滴水湖-S60", "x": "-455", "y": "1227" }, { "name": "TR-S-TG-铁路科学院-S5", "x": "556", "y": "300" }, { "name": "TR-S-江津-S7", "x": "964", "y": "313" }, { "name": "TR-TG-湿地公园-S16", "x": "827", "y": "1116" }, { "name": "TR-S-齐云山北-S9", "x": "1184", "y": "89" }, { "name": "TR-LC-花溪-S61", "x": "214", "y": "2637" }, { "name": "TR-SRB-北方之门-S55", "x": "872", "y": "-945" }, { "name": "TR-SRB-H-白井城北-S62", "x": "918", "y": "-1136" }, { "name": "TR-LM-莲湖公寓-S103", "x": "-1830", "y": "142" }, { "name": "TR-LM-未央宫南-S104", "x": "-1562", "y": "-341" }, { "name": "TR-M-LM-潭江森林公园-S106", "x": "-1724", "y": "1005" }, { "name": "TR-LM-小石潭-S107", "x": "-1748", "y": "1170" }, { "name": "TR-M-风雪之星-S101", "x": "-34", "y": "365" }, { "name": "TR-M-松江村-S105", "x": "-234", "y": "686" }, { "name": "TR-S-海晶宫-S108", "x": "1553", "y": "76" }, { "name": "TR-M-松江-S102", "x": "-616", "y": "690" }, { "name": "TR-M-草津-S109", "x": "-1068", "y": "934" }, { "name": "TR-S-松上-S58", "x": "1216", "y": "-304" }, { "name": "TR-H-金沙塔-S110", "x": "1712", "y": "-936" }, { "name": "TR-H-黄金海湾-S30", "x": "1585", "y": "-1124" }, { "name": "TR-H-SP-江之岛-S29", "x": "1161", "y": "-1249" }, { "name": "TR-CN-浮梁-S47", "x": "-61", "y": "-252" }, { "name": "TR-M-葫芦山-S111", "x": "-2489", "y": "961" }, { "name": "TR-M-花江-S112", "x": "-2889", "y": "1299" }, { "name": "TR-IL-花莲-S113", "x": "2377", "y": "1551" }, { "name": "TR-IL-冰岛西-S114", "x": "2319", "y": "2137" }, { "name": "TR-IL-[生存区域检查点]-S901", "x": "2314", "y": "1988" }, { "name": "TR-TC-花见(古城北)-S59", "x": "-1166", "y": "1249" }, { "name": "TR-TC-驼峰岭-S115", "x": "-768", "y": "1227" }]

        var tr = {
            c: {
                name: "TR 中央本线",
                stations:
                    ["TR-C-暮冬堡-S57", "TR-C-CN-M-竹居南-S56",
                        "TR-C-彩虹-S2",
                        "TR-C-S-滨江-S3",
                        "TR-C-小麦岛-S4E",
                        "TR-C-花海-S8",
                        "TR-C-芍药居-S19",
                        "TR-SRB-C-白井城南-S20"],
                reverses:
                    [false,
                        false,
                        false,
                        true,
                        true,
                        false,
                        false],
                tilts:
                    [true,
                        true,
                        false,
                        true,
                        false,
                        true,
                        false],
                dashed:
                    [false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false],
                color: "#007fe0"
            },
            cn: {
                name: "TR 中央北线",
                stations:
                    ["TR-C-CN-M-竹居南-S56",
                        "TR-CN-牛角冲-S48",
                        "TR-CN-浮梁-S47"],
                reverses:
                    [true,
                        false],
                tilts:
                    [true,
                        true],
                dashed:
                    [false,
                        true],
                color: "#7820f4"
            },
            tg: {
                name: "TR 泰嘉线",
                stations:
                    ["TR-S-TG-铁路科学院-S5",
                        "TR-TG-盘龙山南-S40",
                        "TR-TG-檀城村-S13E",
                        "TR-TG-LC-泰嘉湖-S14",
                        "TR-TG-湿地公园-S16",
                        "TR-TG-致远村-S17E"],
                reverses:
                    [false,
                        true,
                        true,
                        true,
                        false,
                        false],
                tilts:
                    [false,
                        true,
                        true,
                        false,
                        true,
                        true],
                dashed:
                    [false,
                        false,
                        false,
                        false,
                        true,
                        true],
                color: "#fa4845"
            },
            s: {
                name: "TR 云岭线",
                stations:
                    ["TR-C-S-滨江-S3",
                        "TR-S-盘龙江-S12",
                        "TR-S-TG-铁路科学院-S5",
                        "TR-S-江津-S7",
                        "TR-S-齐云观-S11",
                        "TR-S-齐云山北-S9",
                        "TR-S-松上-S58",
                        "TR-KM-S-白头岭-S36",
                        "TR-S-雨花台-S49",
                        "TR-S-海晶宫-S108"
                    ],
                reverses:
                    [false,
                        false,
                        false,
                        false,
                        false,
                        true,
                        true,
                        false,
                        true
                    ],
                tilts:
                    [true,
                        true,
                        true,
                        true,
                        true,
                        true,
                        false,
                        false,
                        true],
                dashed:
                    [false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        true
                    ],
                color: "#ff8801"
            },
            km: {
                name: "TR 雾峰线",
                stations:
                    ["TR-SRB-KM-白井大厦-S22",
                        "TR-KM-S-白头岭-S36",
                        // "TR-KM-白头岭东-S37", 
                        // "TR-KM-高岭海湾北-S39", 
                        // "TR-KM-高岭海湾东-S38", 
                        "TR-KM-雾峰北-S35",
                        "TR-KM-近海-S46E",
                        "TR-KM-云顶-S45E",
                        "TR-KM-飞瀑-S44E",
                        "TR-KM-雾峰-S43E"],
                reverses:
                    [true,
                        // false, 
                        // true, 
                        // false, 
                        false],
                tilts:
                    [false,
                        // false, 
                        // false, 
                        // false, 
                        true,
                        true,
                        true,
                        true,
                        true],
                dashed:
                    [false,
                        // false, 
                        // false, 
                        // false, 
                        false,
                        false,
                        false,
                        false,
                        false],
                color: "#08b1cd"
            },
            srb: {
                name: "TR 白井线",
                stations:
                    ["TR-SRB-C-白井城南-S20",
                        "TR-SRB-KM-白井大厦-S22",
                        'TR-SRB-白井城-S54',
                        'TR-SRB-北方之门-S55',
                        "TR-SRB-H-白井城北-S62"],
                reverses:
                    [true,
                        true,
                        false,
                        true],
                tilts:
                    [true,
                        true,
                        true,
                        false],
                dashed:
                    [false,
                        false,
                        false,
                        false],
                color: "#b05d16"
            },
            h: {
                name: "TR 北洋线",
                stations:
                    ["TR-H-大洋基地-S32",
                        "TR-H-雾岛-S31",
                        "TR-SRB-H-白井城北-S62",
                        "TR-H-SP-江之岛-S29",
                        "TR-H-黄金海湾-S30",
                        "TR-H-金沙塔-S110"
                    ],
                reverses:
                    [true],
                tilts:
                    [false, true, true, true, true],
                dashed:
                    [false, false, false, false, false, false],
                color: "#0a662a"
            },
            sp: {
                name: "TR 半岛线",
                stations:
                    ["TR-SP-红杨村-S41",
                        "TR-H-SP-江之岛-S29",
                        "TR-SP-杨柳湾-S34",
                        "TR-SP-桑瓦半岛-S33"],
                reverses:
                    [false,
                        true,
                        false],
                tilts:
                    [true,
                        false,
                        false],
                dashed:
                    [true,
                        true,
                        true],
                color: "#055e6d"
            },
            tc: {
                name: "TR 泰池线",
                stations: [
                    "TR-TC-乾阳宫-S50",
                    "TR-TC-泰嘉湖东-S51",
                    "TR-LC-TC-云池北-S52",
                    "TR-TC-滴水湖-S60",
                    "TR-TC-驼峰岭-S115",
                    "TR-TC-花见(古城北)-S59"
                ],
                reverses:
                    [false,
                        false,
                        false,
                        true,
                        false],
                tilts:
                    [true,
                        true,
                        true,
                        true,
                        false],
                dashed:
                    [false,
                        false,
                        false,
                        false,
                        true],
                color: "#701e6d"
            },
            lc: {
                name: "TR 云池线",
                stations: [
                    "TR-TG-LC-泰嘉湖-S14", "TR-LC-TC-云池北-S52", "TR-LC-燕鸣岛-S53", "TR-LC-花溪-S61"
                ],
                reverses:
                    [false,
                        false, false],
                tilts:
                    [false,
                        true, true],
                dashed:
                    [false,
                        false, true],
                color: "#ff109d"
            },
            m: {
                name: "TR 三江线",
                stations: [
                    "TR-C-CN-M-竹居南-S56",
                    "TR-M-风雪之星-S101",
                    "TR-M-松江村-S105",
                    "TR-M-松江-S102",
                    "TR-M-草津-S109",
                    "TR-M-LM-潭江森林公园-S106",
                    "TR-M-葫芦山-S111",
                    "TR-M-花江-S112",
                ],
                tilts:
                    [
                        false, false, true, true, true, true, false
                    ],
                reverses:
                    [
                        false, true, false, false, false
                    ],
                dashed:
                    [
                        false, false, false, false, false, true, true
                    ],
                color: "#ac3030"
            },
            lm: {
                name: "TR 莲湖线",
                stations: [
                    "TR-LM-未央宫南-S104",
                    "TR-LM-莲湖公寓-S103",
                    "TR-M-LM-潭江森林公园-S106",
                    "TR-LM-小石潭-S107"
                ],
                tilts:
                    [
                        true, true, true
                    ],
                reverses:
                    [
                        true, true, true
                    ],
                dashed:
                    [
                        true, false, true
                    ],
                color: "#af10df"
            },
            il: {
                name: "TR 冰岛线",

                stations: [
                    "TR-IL-花莲-S113", "TR-IL-[生存区域检查点]-S901", "TR-IL-冰岛西-S114"
                ],
                tilts: [
                    true, true
                ],
                reverses: [
                    true, false
                ],
                dashed: [
                    true, true
                ],
                color: "#0090c0",
            }
        }

        var internationalize = {
            "暮冬堡": ["Winter Castle",],
            "竹居南": ["South Takei", "竹居南"],
            "牛角冲": ["Horn Sandbar",],
            "浮梁": ["Furyo",],
            "彩虹": ["Rainbow", "虹"],
            "滨江": ["Riverside",],
            "小麦岛": ["Wheat Island",],
            "花海": ["Blossom Garden",],
            "芍药居": ["Peony Villas",],
            "白井城南": ["South Shirai City", "白井城南"],
            "白井大厦": ["Shirai Tower", "白井タワー"],
            "白井城": ["Shirai City", "白井城"],
            "北方之门": ["Northern Gateway", ""],
            "甘井子": ["Kanseishi", "甘井子"],
            "雾岛": ["Kirishima", "霧島"],
            "大洋基地": ["OceanBase", "カヨキチ"],
            "甘井子东": ["East Kanseishi", "甘井子東"],
            "红杨村": ["Populus Village", ""],
            "江之岛": ["Enoshima", "江ノ島"],
            "杨柳湾": ["Willow Cove",],
            "桑瓦半岛": ["Savanna Peninsula",],
            "黄金海湾": ["Golden Cove",],
            "盘龙江": ["Pelysosaur River",],
            "盘龙山南": ["South Pelycosaur Hill",],
            "铁路科学院": ["Academy of Railway Sciences",],
            "梅城北": ["North Umehara City", "梅原城北"],
            "梅城南": ["South Umehara City", "梅原城南"],
            "江津": ["Goutsu", "江津"],
            "齐云观": ["Sierra Temple",],
            "齐云山北": ["North High Sierra",],
            "松上": ["Matsugami", "松上"],
            "白头岭": ["Silver Ridge", "白头山"],
            "白头岭东": ["East Silver Ridge", "白头山東"],
            "雨花台": ["Riverstone Terrace",],
            "高岭海湾北": ["North Kaolin Bay", "北カオリン湾"],
            "高岭海湾东": ["North Kaolin Bay", "東カオリン湾"],
            "雾峰北": ["North Kirigamine", "北霧ヶ峰"],
            "近海": ["Offshore",],
            "云顶": ["Genting",],
            "飞瀑": ["Great Waterfall",],
            "雾峰": ["Kirigamine", "霧ヶ峰"],
            "檀城村": ["Sandlewood Castle Village",],
            "泰嘉湖": ["Lake Taiga",],
            "泰嘉湖东": ["East Lake Taiga",],
            "湿地公园": ["Weatland Park",],
            "致远村": ["the Reach Village",],
            "云池北": ["North Lake Cloudscape", "雲景の湖北"],
            "乾阳宫": ["Qian Palace",],
            "燕鸣岛": ["Tweeter Island"],
            "滴水湖": ["Lake Droplet"],
            "古城": ["Legacy City"],
            "花溪": ["Hanatani", "花溪"],
            "白井城北": ["North Shirai City", ""],
            "未央宫南": ["", ""],
            "莲湖公寓": ["Lake Lotus Townhouse", "蓮湖マンション"],
            "潭江森林公园": ["", ""],
            "小石潭": ["", ""],
            "松江": ["Matsue", "松江"],
            "松江村": ["Matsue Village", ""],
            "风雪之星": ["Blizzard Core", ""],
            // "":["",""],
        }

        var railAdmin =
            [
                {
                    name: "中央铁路局",
                    depot: [
                        {
                            name: "竹居工务段",
                            stations: [
                                "TR-C-暮冬堡-S57", "TR-C-CN-M-竹居南-S56", "TR-C-彩虹-S2", "TR-CN-牛角冲-S48", "TR-CN-浮梁-S47", "TR-C-S-滨江-S3"
                            ]
                        },
                        {
                            name: "花海工务段",
                            stations: [
                                "TR-C-小麦岛-S4E", "TR-C-花海-S8", "TR-C-芍药居-S19"
                            ]
                        },
                        {
                            name: "盘龙工务段",
                            stations: [
                                "TR-S-盘龙江-S12", "TR-S-TG-铁路科学院-S5", "TR-S-江津-S7", "TR-TG-盘龙山南-S40", "TR-TG-檀城村-S13E"
                            ]
                        },
                        {
                            name: "东湖工务段",
                            stations: [
                                "TR-S-齐云观-S11", "TR-S-齐云山北-S9", "TR-S-松上-S58"
                            ]
                        },
                        {
                            name: "",
                            stations: [

                            ]
                        },
                        {
                            name: "泰嘉工务段",
                            stations: [
                                "TR-TG-LC-泰嘉湖-S14", "TR-TG-湿地公园-S16", "TR-TG-致远村-S17E"
                            ]
                        }
                    ]
                },
                {
                    name: "白井铁路局",
                    depot: [
                        {
                            name: "白井工务段",
                            stations: [
                                "TR-SRB-C-白井城南-S20", "TR-SRB-KM-白井大厦-S22", "TR-SRB-白井城-S54", "TR-SRB-北方之门-S55",
                            ]
                        },
                        {
                            name: "高岭工务段",
                            stations: [
                                "TR-KM-S-白头岭-S36", "TR-KM-白头岭东-S37", "TR-KM-高岭海湾北-S39", "TR-KM-高岭海湾东-S38", "TR-S-雨花台-S49"
                            ]
                        },
                        {
                            name: "雾岛工务段",
                            stations: [
                                "TR-H-大洋基地-S32", "TR-H-雾岛-S31"
                            ]
                        },
                        {
                            name: "江之岛工务段",
                            stations: [
                                "TR-SRB-H-白井城北-S62", "TR-H-SP-江之岛-S29", "TR-H-黄金海湾-S30", "TR-SP-红杨村-S41", "TR-SP-杨柳湾-S34", "TR-SP-桑瓦半岛-S33"
                            ]
                        },
                        {
                            name: "雾峰工务段",
                            stations: [
                                "TR-KM-雾峰北-S35", "TR-KM-近海-S46E", "TR-KM-云顶-S45E", "TR-KM-飞瀑-S44E", "TR-KM-雾峰-S43E"
                            ]
                        }
                    ]
                },
                {
                    name: "云池铁路局",
                    depot: [
                        {
                            name: "泰嘉工务段",
                            stations: [
                                "TR-TC-泰嘉湖东-S51", "TR-TC-乾阳宫-S50"
                            ]
                        },
                        {
                            name: "云池工务段",
                            stations: [
                                "TR-LC-TC-云池北-S52", "TR-LC-燕鸣岛-S53"
                            ]
                        },
                        {
                            name: "古城工务段",
                            stations: [
                                "TR-TC-滴水湖-S60", "TR-TC-古城-S59"
                            ]
                        }
                    ]
                }
            ]
    }).catch((e) => {

    })