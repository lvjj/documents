define([
    'jquery',
    'common', 
    'layuiAll',
    'css!css/project/project-device'
], function(
    $, 
    HSKJ
){
return function() {
    HSKJ.ready(function () {
        var roleid = HSKJ.getUserInfo('roleid');
        
        var deviceList = {
            init: function () {
                this.renderHtml();
                this.wactch();
            },

            data: {
                
            },
            renderHtml: function() {
                var self = this;
                
                HSKJ.renderTpl('.module-container', 'text!tpl/project/project-device.tpl', { 
                    roleid: roleid,
                    pname: router.getParameter('pname')
                }, function () {
                    self.renderTable();//渲染表格
                    layui.form.render('select');
                    layui.laydate.render({ //渲染日期
                        elem: '#activationDate'
                        , type: 'date'
                        , range: '~'
                        , format: 'yyyy-MM-dd'
                        , done: function (value, date) {
                            self.reloadTable();
                        }
                    });
                })
            },

            renderTable: function (status){ 
                var self = this;
                HSKJ.loadingShow();

                HSKJ.renderTable({
                    url: ENV.API + 'system/project/device/query',
                    where: {
                        projectid: router.getParameter('pid')
                    },
                    id: 'deviceListTable',
                    elem: '#tableContent'
                    , cols: [ //标题栏
                        , { field: 'name', title: '设备名称' }
                        , { field: 'deviceid', title: '编码 ' }
                        , { field: 'modelname', title: '型号' }
                        , { title: '出入状态 ',templet: '<div>{{d.usetype == 2? "出": "入"}}</div>' }
                        , { title: '使用状态', templet: '<div>{{d.status == 1? "使用中": d.status == 2? "故障" : "闲置"}}</div>' } //使用状态(1：使用中，2：故障，0：闲置)
                        , { title: '在线状态', templet: '<div><div class="m-status-txt">{{d.online == 1? "<i>在线</i>": "<em>离线</em>"}}</div></div>' } //设备状态(1：在线，0：离线)
                        , { field: 'installaddress', title: '安装位置' }
                    ]
                });
            },

            reloadTable: function(){
                layui.table.reload('deviceListTable', {
                    where: { 
                        status: $('select[name=deviceStatus]').val(),
                        name: $("#keyword").val()
                    }
                    , page: {
                        curr: 1
                    }
                });
            },
            
            //删除设备
            delDeviceAjax: function (id, callback) {
                var self = this;
                HSKJ.POST({
                    url: 'organization/device/delete',
                    data: {
                        deviceids: id
                    },
                    beforeSend: function () {
                        HSKJ.loadingShow();
                    },
                    success: function (json) {
                        if (json && json.code == 0) {
                            callback && callback();
                        } else {
                            layui.layer.msg(json.message)
                        }
                    }
                })
            },

            wactch: function () {
                var self = this; 

                $(document)
                .off('click', '#addDevice')
                .on('click', '#addDevice', function () {//添加设备
                    require(['js/project/project-device-add'], function (addDevice) {
                        addDevice(roleid, self);
                    })
                })
                .off('click', '#doSearch')
                .on('click', '#doSearch', function () {
                    self.reloadTable();
                })
            }
        }
        deviceList.init();
    })
}}
)