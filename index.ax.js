ax.debug.stackLayout = true
ax.app(
    new VStack(
        new HStack(
            new VStack(
                new View()
                    .text("ax.js Web框架"),
                new View()
                    .text("布局测试 (version 22a1fd)"),
            ),
            new ActivityIndicator(30).fixed()
        )
            .fixed()
            .color("yellow")
            .backgroundColor("black")
            .padding(20)
        ,
        new View().text("VStack(纵向排列)演示").color("black").fixed(),
        new VStack(
            new View().text("y轴(纵向)自动高度元素")
                .style("background-color", "blue"),
            new View().text("固定高度(元素撑满)")
                .style("background-color", "green")
                .fixed(),
            new View().text("固定高度(元素撑满 & padding)")
                .style("background-color", "black")
                .fixed().padding(10),
            new View().text("固定高度(手动设置)")
                .style("background-color", "rgba(0,0,0,0.2)")
                .frame(null, 50).fixed()
                .color("black"),
            new View().text("自动高度")
                .style("background-color", "red"),
            //---------------------ScrollView Start

            new VStack(
                new View().backgroundColor("green").fixed().height(30),
                new View().backgroundColor("blue").fixed().height(30),
                new View().backgroundColor("red").fixed().height(30),
                new View().backgroundColor("green").fixed().height(30),
                new View().backgroundColor("blue").fixed().height(30),
            ).scroll()

                .style("background-color", "rgba(0,0,0,0.2)").color("black")
            //---------------------ScrollView End
        ).padding(20),
        new View().text("HStack(横向排列)演示").color("black").fixed(),
        new HStack(
            new VStack(
                new HStack(
                    new View().text("x轴(横向)自动宽度元素(溢出文本自动换行)")
                        .style("background-color", "blue"),
                    new View().text("自动宽度(不换行)")
                        .style("background-color", "black")
                        .nowrap(true),
                ),
                new HStack(
                    new View().text("x轴(横向)自动宽度元素(溢出文本自动省略)")
                        .style("background-color", "red")
                        .nowrap(true, true),
                    new View().text("固定(手动&自动省略)").style("background-color", "rgba(0,0,0,0.2)")
                        .color("black").fixed().style("width", "150px").nowrap(true, true).label("g"),
                    new View().text("固定(元素撑满)")
                        .style("background-color", "green")
                        .fixed()
                        .nowrap(),
                ),



                new HStack(
                    new View().backgroundColor("red").fixed().frame(30, 30),
                    new View().backgroundColor("green").fixed().frame(30, 30),
                    new View().backgroundColor("blue").fixed().frame(30, 30),
                    new View().backgroundColor("red").fixed().frame(30, 30),
                    new View().backgroundColor("green").fixed().frame(30, 30),
                    new View().backgroundColor("blue").fixed().frame(30, 30),
                    new View().backgroundColor("red").fixed().frame(30, 30),
                    new View().backgroundColor("green").fixed().frame(30, 30),
                    new View().backgroundColor("blue").fixed().frame(30, 30),
                    new View().backgroundColor("red").fixed().frame(30, 30),
                    new View().backgroundColor("green").fixed().frame(30, 30),
                    new View().backgroundColor("blue").fixed().frame(30, 30),
                    new View().backgroundColor("red").fixed().frame(30, 30),
                    new View().backgroundColor("green").fixed().frame(30, 30),
                    new View().backgroundColor("blue").fixed().frame(30, 30),
                    new View().backgroundColor("red").fixed().frame(30, 30),
                    new View().backgroundColor("green").fixed().frame(30, 30),
                    new View().backgroundColor("blue").fixed().frame(30, 30),
                    new View().backgroundColor("red").fixed().frame(30, 30),
                    new View().backgroundColor("green").fixed().frame(30, 30),
                    new View().backgroundColor("blue").fixed().frame(30, 30),
                    new View().backgroundColor("red").fixed().frame(30, 30),
                    new View().backgroundColor("green").fixed().frame(30, 30),
                    new View().backgroundColor("blue").fixed().frame(30, 30),
                ).scroll().label("y")

            )
        ).fixed()
            .padding(20),
        new View().text("ZStack(z轴排列)演示").color("black").fixed(),
        new ZStack(
            new View().text("z轴(重叠)元素111111111111")
                .backgroundColor("green")
                .style("opacity", "0.6"),
            new View().text("z轴(重叠)元素22222222")
                .backgroundColor("red")
                .style("opacity", "0.4"),
            new View().text("z轴(重叠)元素3333")
                .backgroundColor("blue")
                .style("opacity", "0.3"),
        ).fixed().padding(20),
        new View()
            .text("具有青色(Cyan)边框的视图是ZStack子视图,<br>"
                + "具有粉色(Magenta)边框的视图是VStack子视图,<br>"
                + "具有黄色(Yellow)边框的视图是HStack子视图(调试模式已启动)")
            .color("black")
            .fixed()
            .padding(10),
    ).color("white")
)
// ax.app(
//     new VStack(
//         new VStack(
//         new View()
//             .fixed()
//             .text("ax.js")
//             .style("color", "yellow"),
//         new View()
//             .fixed()
//             .text("testing")
//             .style("color", "yellow")
//             .label("a")
//             .style("display", "inline-block"),
//         new View()
//             .fixed()
//             .text(ax.resources.indicator_svg_ios)
//             .style("width", "25px")
//             .style("padding", "3px")
//             .style("background-color", "white")
//             .style("display", "inline-block"),
//         )
//             .style("background-color", "black")
//             .fixed(),

//         new View()
//             .fixed()
//             .text("ax.js")
//             .style("color", "blue")
//             .label("c")
//             .apply((v)=>{
//                 v.event("click",function(){
//                     console.log(v)
//                 })
//             }),
//         new VStack(new View().text("-"))
//             .label("e")
//             .style("background-color", "green"),
//         new VStack(new View().text("-"))
//             .label("f")
//             .style("background-color", "red"),
//         new ZStack(
//             new View().rectangle(90,null,"yellow"),
//             new View().text("1111重叠视图1111"),
//             new View().text("22重叠视图22"),
//             new View().text("3重叠视图3"),
//         ),
//         new HStack(
//             new View().text("11横向视图11").fixed().nowrap(),
//             new View().text("2横向视图2").nowrap(),
//             new ZStack(
//                 new View().rectangle(90,20,"green"),
//                 new View().text(33).style("width","90px"),
//             ).fixed()
//         ).fixed()
//     ).label("b"),
//     //.style("height","300px")
//     // new ContainerView(
//     //     new View().text(1),

//     // ).background(
//     //     new View().text(2),
//     //     new View().text(3),
//     //     new View().rectangle(90,20,"blue")
//     // )
// )


// //----------------------------------------------------------------------
// // var tStart=Date.now()
// // for(let i=0;i<10000;i++){
// //     ax.labels.b.append(
// //         new Container(
// //             new View()
// //             .text(i)
// //             .style("color","blue")
// //             .style("float", "left")
// //             .style("padding", "5px")
// //             .style("display","inline-block")
// //         )
// //         .style("display","inline-block")
// //     )
// // }
// // ax.labels.a.text("creating 20000 elements spended: "+(Date.now()-tStart))


class ViewRepresentable extends Container {
    constructor(obj) {
        obj.self = this
        obj.init()
        super(obj.body)
    }
}