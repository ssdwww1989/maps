//调用地图api



'use strict';

var ViewModel = function(){
    var map;
    var self = this;

    self.markers =  ko.observableArray();



    self.currentIndex =ko.observable('');
   var  center={lat: 39.9127929, lng: 116.3758218};
    map = new google.maps.Map(document.getElementById('create_map'), {
        center:center,
        zoom: 13,
       // styles:style,
        mapTypeControl:false,
        streetViewControl:true,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },

    });


//定义标记点

    var favlocation = [
        {title: '世贸天阶', location: {lat: 39.916071, lng: 116.4530444}},
        {title: '北京嘉里大酒店', location: {lat: 39.9139168, lng: 116.4582177}},
        {title: '远洋光华国际', location: {lat: 39.91593, lng: 116.454124}},
        {title: '北京以太广场', location: {lat: 39.9155194, lng: 116.4568246}},
        {title: '枫丹白露家居', location: {lat: 39.9148763, lng: 116.4497483}},
        {title: '北京千禧大酒店', location: {lat: 39.9175513, lng: 116.4589785}}
    ];


    var showWindow = new google.maps.InfoWindow();//创建 InfoWindow实例
    var bounds = new google.maps.LatLngBounds();//创建 LatLngBounds 实例

    for(var i=0; i<favlocation.length;i++){//循环获取数组内信息，并且创建marker
        var location = favlocation[i];
        var title = location.title;
        var placesService = new google.maps.places.PlacesService(map);
        placesService.textSearch({
            query:title
        },function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK){
              createMaker(results[0]);
            }

        })
    }



    //创建标记
    function createMaker(locaiton){
        var marker = new google.maps.Marker({
            position:locaiton.geometry.location,
            title: locaiton.name,
            map: map,
            formatted_address:locaiton.formatted_address,
            photos:locaiton.photos,
            animation: google.maps.Animation.DROP,
            id: locaiton.id
        });

        self.markers.push(marker);

        bounds.extend(marker.position);
        map.fitBounds(bounds);


        marker.addListener('click',(function(copylocation){
            return function(){

                showInfo(this,showWindow)
                checkAnimation(this)//调用设置动画函数,将目标制定为this 即当前点击的marker
            }
        })(location))
    }


    




    //检查标记动画
    function checkAnimation(marker){
        if(marker.getAnimation() !== null){
                marker.getAnimation(null)
        }else{
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
                marker.setAnimation(null)
            },700)//700ss后   将动画设置为null
        }
    }

  //显示详细信息框
    function showInfo(marker,infowindow){//传入两个参数
        checkAnimation(marker)//调用设置动画函数
        var innerHTML = '<div class="mapinfo">';
        if (marker.title) {
            innerHTML += '<strong>' + marker.title + '</strong>';
        }
        if (marker.formatted_address) {
            innerHTML += '<br>' + marker.formatted_address;
        }
        if (marker.photos) {
            innerHTML += '<br><br><img src="' + marker.photos[0].getUrl(
                {maxHeight: 200, maxWidth: 350}) + '">';
        }else{
            innerHTML += '<br>' + '<div>这个位置没有照片可提供哦</div>';
        }
        innerHTML += '</div>';
        if(infowindow.marker != marker){//如果 infowwindow.marker 不等于marker
            infowindow.marker = marker;// 设置infowwindow.marker等于marker
            infowindow.setContent(innerHTML);//创建标签,标签内容为marker.title
            infowindow.open(map,marker);//打开infowindow
            infowindow.addListener('closeclick',function(){//点击关闭按钮则关闭 infowindow
                infowindow.setMarker(null)
            });
        }

    }


    //切换显示地区
    this.clickShowinfo = function (currentcoordinate) {
        self.currentIndex( showInfo(currentcoordinate,showWindow))
    }

    //输入框筛选列表
    self.filterList= ko.observable('');
    self.filterfinalarray = ko.computed(function(){
        return ko.utils.arrayFilter(self.markers(), function(marker) {
            return marker.title.indexOf(self.filterList()) !== -1;
        })

    },self)


    //隐藏marker 已经显示当前的输入框对应的marker
    self.filterfinalarray.subscribe(function(){
        var cpa = ko.utils.compareArrays(self.markers(), self.filterfinalarray());
        ko.utils.arrayForEach(cpa,function(marker){
            if(marker.status==='deleted'){
                marker.value.setMap(null);
            }else{
                marker.value.setMap(map);
            }
        })

    })











//计算高度
    function  computedAltitude(computedobject,target,customheigth){
        var objectheight = $(computedobject).height();
        var setHeight = objectheight - customheigth;
        $(target).height(setHeight)
    }

    computedAltitude("body","#create_map",50)

    $(window).resize(function(){

        computedAltitude("body","#create_map",50)
    })
//隐藏按钮
    $(".menus_icon_Wrap").click(function(){
        $("#mapwarp").toggleClass("hidemenu")//隐藏侧边栏
        google.maps.event.trigger(map, "resize");//重置地图
    })






}



function creat_Map(){
    ko.applyBindings(new ViewModel())
}







