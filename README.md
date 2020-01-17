﻿# clientdata
umi工作 —— 客户端数据收集，应用在天空之门和救赎之地后台数据通用的页面（外网地址：http://center.umi-game.cn或者http://center.umi-game.cn:9400/view/realAll.html）
主要使用结合highcharts和echarts展示数据
1.中国地图结合china.js 这里上传了一个/js/dist配置文件可以借鉴使用方法
2.导出功能使用的都是table2Excel，简单粗暴，模式固定，每个页面都有使用方法
3.对于权限管理，使用vue导航栏非常方便。
4.使用echarts和highcharts直接在官网上模拟数据进行页面调试就可以，然后直接把代码换成你本地data即可。
5.图形的页面适配我使用echarts的时候echarts图形并没有做到根据窗口的大小改变，找了很多方法都没有实现，所以移动端我又写了一个页面，对大小布局做部分改变来适应移动端布局。
6.事件分析页面，我使用bootstraptable，找了很多资料才实现展开detail可以自定义内容，这个页面引用的css和js插件最好不要换，我试了比较多的其他的版本，有的会使页面功能失效。

