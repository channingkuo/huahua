(window.webpackJsonp=window.webpackJsonp||[]).push([["clock"],{5314:function(t,e,o){(e=o("24fb")(!1)).push([t.i,".k-ant-page-header .ant-page-header-heading-extra[data-v-7814b945]{float:unset}.k-table .ant-table-pagination[data-v-7814b945]{float:left!important}.k-table .ant-table-thead>tr>th[data-v-7814b945]{background-color:#fff!important}.huahua-drawer .ant-select-selection__clear[data-v-7814b945]{margin-top:-8px}.single[data-v-7814b945]{background-color:#fbfafa}.clock-full-screen .ant-modal-centered[data-v-7814b945]{overflow-y:hidden}.windows[data-v-7814b945] ::-webkit-scrollbar{width:6px;height:6px}.windows[data-v-7814b945] ::-webkit-scrollbar-track{width:10px;background:rgba(145,146,146,.1);border-radius:2em}.windows[data-v-7814b945] ::-webkit-scrollbar-thumb{background-color:rgba(145,146,146,.3);background-clip:padding-box;min-height:28px;border-radius:2em}.windows[data-v-7814b945] ::-webkit-scrollbar-corner{border-radius:2em}.windows[data-v-7814b945] ::-webkit-scrollbar-thumb:hover{background-color:#919292}.size-change[data-v-7814b945]{font-size:20px;position:absolute;z-index:10000;right:20px}.size-change[data-v-7814b945]:hover{color:#1890ff;transform:scale(1.2) rotate(1turn);transition:transform .5s}",""]),t.exports=e},"6a63":function(t,e,o){var a=o("5314");a.__esModule&&(a=a.default),"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,o("499e").default)("10d49c3a",a,!0,{sourceMap:!1,shadowMode:!1})},"9fde":function(t,e,o){"use strict";o.r(e);var a=o("313e"),s=o("cf45"),i={name:"clock",components:{},data:function(){return{height:Object(s.a)()-47,visible:!1,myChart:null,myChartFullScreen:null,option:{series:[{name:"hour",type:"gauge",startAngle:90,endAngle:-270,min:0,max:12,splitNumber:12,axisLine:{lineStyle:{width:15,color:[[1,"rgba(0,0,0,0.7)"]],shadowColor:"rgba(0, 0, 0, 0.5)",shadowBlur:15}},splitLine:{lineStyle:{shadowColor:"rgba(0, 0, 0, 0.3)",shadowBlur:3,shadowOffsetX:1,shadowOffsetY:2}},axisLabel:{fontSize:50,distance:25,formatter:function(t){return 0===t?"":t}},anchor:{show:!0,icon:"path://M532.8,70.8C532.8,70.8,532.8,70.8,532.8,70.8L532.8,70.8C532.7,70.8,532.8,70.8,532.8,70.8z M456.1,49.6c-2.2-6.2-8.1-10.6-15-10.6h-37.5v10.6h37.5l0,0c2.9,0,5.3,2.4,5.3,5.3c0,2.9-2.4,5.3-5.3,5.3v0h-22.5c-1.5,0.1-3,0.4-4.3,0.9c-4.5,1.6-8.1,5.2-9.7,9.8c-0.6,1.7-0.9,3.4-0.9,5.3v16h10.6v-16l0,0l0,0c0-2.7,2.1-5,4.7-5.3h10.3l10.4,21.2h11.8l-10.4-21.2h0c6.9,0,12.8-4.4,15-10.6c0.6-1.7,0.9-3.5,0.9-5.3C457,53,456.7,51.2,456.1,49.6z M388.9,92.1h11.3L381,39h-3.6h-11.3L346.8,92v0h11.3l3.9-10.7h7.3h7.7l3.9-10.6h-7.7h-7.3l7.7-21.2v0L388.9,92.1z M301,38.9h-10.6v53.1H301V70.8h28.4l3.7-10.6H301V38.9zM333.2,38.9v10.6v10.7v31.9h10.6V38.9H333.2z M249.5,81.4L249.5,81.4L249.5,81.4c-2.9,0-5.3-2.4-5.3-5.3h0V54.9h0l0,0c0-2.9,2.4-5.3,5.3-5.3l0,0l0,0h33.6l3.9-10.6h-37.5c-1.9,0-3.6,0.3-5.3,0.9c-4.5,1.6-8.1,5.2-9.7,9.7c-0.6,1.7-0.9,3.5-0.9,5.3l0,0v21.3c0,1.9,0.3,3.6,0.9,5.3c1.6,4.5,5.2,8.1,9.7,9.7c1.7,0.6,3.5,0.9,5.3,0.9h33.6l3.9-10.6H249.5z M176.8,38.9v10.6h49.6l3.9-10.6H176.8z M192.7,81.4L192.7,81.4L192.7,81.4c-2.9,0-5.3-2.4-5.3-5.3l0,0v-5.3h38.9l3.9-10.6h-53.4v10.6v5.3l0,0c0,1.9,0.3,3.6,0.9,5.3c1.6,4.5,5.2,8.1,9.7,9.7c1.7,0.6,3.4,0.9,5.3,0.9h23.4h10.2l3.9-10.6l0,0H192.7z M460.1,38.9v10.6h21.4v42.5h10.6V49.6h17.5l3.8-10.6H460.1z M541.6,68.2c-0.2,0.1-0.4,0.3-0.7,0.4C541.1,68.4,541.4,68.3,541.6,68.2L541.6,68.2z M554.3,60.2h-21.6v0l0,0c-2.9,0-5.3-2.4-5.3-5.3c0-2.9,2.4-5.3,5.3-5.3l0,0l0,0h33.6l3.8-10.6h-37.5l0,0c-6.9,0-12.8,4.4-15,10.6c-0.6,1.7-0.9,3.5-0.9,5.3c0,1.9,0.3,3.7,0.9,5.3c2.2,6.2,8.1,10.6,15,10.6h21.6l0,0c2.9,0,5.3,2.4,5.3,5.3c0,2.9-2.4,5.3-5.3,5.3l0,0h-37.5v10.6h37.5c6.9,0,12.8-4.4,15-10.6c0.6-1.7,0.9-3.5,0.9-5.3c0-1.9-0.3-3.7-0.9-5.3C567.2,64.6,561.3,60.2,554.3,60.2z",showAbove:!1,offsetCenter:[0,"-35%"],size:120,keepAspect:!0,itemStyle:{color:"#707177"}},pointer:{icon:"path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",width:12,length:"55%",offsetCenter:[0,"8%"],itemStyle:{color:"#FF0000",shadowColor:"rgba(0, 0, 0, 0.3)",shadowBlur:8,shadowOffsetX:2,shadowOffsetY:4}},detail:{show:!1},title:{offsetCenter:[0,"30%"]},data:[{value:0}]},{name:"minute",type:"gauge",startAngle:90,endAngle:-270,min:0,max:60,axisLine:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLabel:{show:!1},pointer:{icon:"path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",width:8,length:"70%",offsetCenter:[0,"8%"],itemStyle:{color:"#C0911F",shadowColor:"rgba(0, 0, 0, 0.3)",shadowBlur:8,shadowOffsetX:2,shadowOffsetY:4}},anchor:{show:!0,size:20,showAbove:!1,itemStyle:{borderWidth:15,borderColor:"#C0911F",shadowColor:"rgba(0, 0, 0, 0.3)",shadowBlur:8,shadowOffsetX:2,shadowOffsetY:4}},detail:{show:!1},title:{offsetCenter:["0%","-40%"]},data:[{value:0}]},{name:"second",type:"gauge",startAngle:90,endAngle:-270,min:0,max:60,animationEasingUpdate:"bounceOut",axisLine:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLabel:{show:!1},pointer:{icon:"path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",width:4,length:"85%",offsetCenter:[0,"8%"],itemStyle:{color:"#C0911F",shadowColor:"rgba(0, 0, 0, 0.3)",shadowBlur:8,shadowOffsetX:2,shadowOffsetY:4}},anchor:{show:!0,size:15,showAbove:!0,itemStyle:{color:"#C0911F",shadowColor:"rgba(0, 0, 0, 0.3)",shadowBlur:8,shadowOffsetX:2,shadowOffsetY:4}},detail:{show:!1},title:{offsetCenter:["0%","-40%"]},data:[{value:0}]}]},timeUpdatedStatus:{second:!1,minute:!1,hour:!1},hour:"00",minute:"00",second:"00",loading:!0,loadingFull:!1}},created:function(){},mounted:function(){var t=this;window.onresize=function(){return window.screenWidth=document.body.clientWidth,window.screenHeight=document.body.clientHeight,void(t.height=Object(s.a)()-47)},this.$nextTick((function(){t.myChart=a.a(document.getElementById("clock")),t.loading=!1,setInterval((function(){var e=new Date,o=e.getSeconds(),a=e.getMinutes()+o/60,s=e.getHours()%12+a/60;t.hour=e.getHours()<=9?"0".concat(e.getHours()):e.getHours(),t.minute=e.getMinutes()<=9?"0".concat(e.getMinutes()):e.getMinutes(),t.second=o<=9?"0".concat(o):o,t.updateSeries(o,t.option.series[2],"second"),t.updateSeries(a,t.option.series[1],"minute"),t.updateSeries(s,t.option.series[0],"hour"),t.option.animationDurationUpdate=300,t.myChart.setOption(t.option,!0),t.myChartFullScreen&&t.myChartFullScreen.setOption(t.option,!0),e=null}),1e3)}))},methods:{updateSeries:function(t,e,o){(0===Math.floor(t)||"second"===o&&1===t)&&!0===this.timeUpdatedStatus[o]&&(this.timeUpdatedStatus[o]=!1,e.data[0].value=0,e.clockwise=!0,this.option.animationDurationUpdate=0,this.myChart.setOption(this.option,!0),this.myChartFullScreen&&this.myChartFullScreen.setOption(this.option,!0)),e.data[0].value=t,e.clockwise=!0,0===t&&(this.timeUpdatedStatus[o]=!0,e.clockwise=!1)},onFullScreen:function(){var t=this;this.visible=!0,this.loadingFull=!0,setTimeout((function(){t.myChartFullScreen=a.a(document.getElementById("clock-full-screen")),t.loadingFull=!1}),1e3)},onClose:function(){this.visible=!1,this.myChartFullScreen=null}},computed:{}},l=(o("a01d"),o("2877")),n=Object(l.a)(i,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"clock"},[o("a-tooltip",{attrs:{placement:"top",title:"全屏"}},[o("a-icon",{staticClass:"size-change",attrs:{type:"fullscreen"},on:{click:t.onFullScreen}})],1),o("div",{staticClass:"flex justify-center items-center w-full",style:{height:t.height+"px"}},[o("div",{staticClass:"w-1/2 h-full",attrs:{id:"clock"}},[t.loading?o("a-spin",{staticStyle:{position:"absolute",left:"25%",top:"50%"},attrs:{size:"large"}}):t._e()],1),o("div",{staticClass:"w-1/2 h-full flex justify-center items-center",style:{fontSize:"140px"}},[t._v(" "+t._s(t.hour+":"+t.minute+":"+t.second)+" ")])]),o("a-modal",{staticClass:"clock-full-screen",attrs:{forceRender:!0,width:"100%",maskClosable:!1,visible:t.visible,destroyOnClose:"",zIndex:1e5,centered:!0,footer:null},on:{cancel:t.onClose}},[o("div",{staticClass:"flex justify-center items-center w-full",style:{height:t.height+"px"}},[o("div",{staticClass:"w-1/2 h-full",attrs:{id:"clock-full-screen"}},[t.loadingFull?o("a-spin",{staticStyle:{position:"absolute",left:"25%",top:"50%"},attrs:{size:"large"}}):t._e()],1),o("div",{staticClass:"w-1/2 h-full flex justify-center items-center",style:{fontSize:"140px"}},[t._v(" "+t._s(t.hour+":"+t.minute+":"+t.second)+" ")])])])],1)}),[],!1,null,"7814b945",null);e.default=n.exports},a01d:function(t,e,o){"use strict";o("6a63")}}]);