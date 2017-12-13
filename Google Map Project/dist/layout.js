//调用地图api

var map;
var markers = [];

var placeMarkers = [];



function creat_Map(){
   var  center={lat: 39.9127929, lng: 116.3758218};
    map = new google.maps.Map(document.getElementById('create_map'), {
        center:center,
        zoom: 17,
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
        var position = location.location;
        var title = location.title;
        var marker = new google.maps.Marker({
            position:position,
            title: title,
            map: map,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);//将创建的marker  写入数组
        bounds.extend(marker.position)//标记的位置

        marker.addListener('click',(function(copylocation){
            return function(){
                //showInfo(this,showWindow)
               showinfo(copylocation,this);// this 传入 信息框的位置


            }
        })(location))
        map.fitBounds(bounds)
    }


/*    //创建标记函数
    function showInfo(marker,infowindow){//传入两个参数
        if(infowindow.marker != marker){//如果 infowwindow.marker 不等于marker
            infowindow.marker = marker;// 设置infowwindow.marker等于marker
            infowindow.setContent('<div>'+ marker.title+'</div>');//创建标签,标签内容为marker.title
            infowindow.open(map,marker);//打开infowindow
            infowindow.addListener('closeclick',function(){//点击关闭按钮则关闭 infowindow
                infowindow.setMarker(null)
            });
        }
/!*



        //街景

        var streetViewService = new google.maps.StreetViewService();//
        var radius = 50;
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);

*!/

    }*/




       function showinfo(marker,markerindex){//参数1  传入当前点击的 marker , 参数2   传递 信息框位置
            var bounds = map.getBounds();
            var placesService = new google.maps.places.PlacesService(map);
            placesService.textSearch({
                query:marker.title
            },function(results,status){
                if(status === google.maps.places.PlacesServiceStatus.OK){
                    getDeta(results[0],markerindex)
                }else{
                    console.log("222")
                }
            })
        }


        function getDeta(places,markerindex){//传入两个参数    参数1  获取的坐标信息，参数2   信息窗的位置
           var place = places;
           var infowindow = showWindow;

            var innerHTML = '<div>';
            if (place.name) {
                innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
                innerHTML += '<br><br><strong>Hours:</strong><br>' +
                    place.opening_hours.weekday_text[0] + '<br>' +
                    place.opening_hours.weekday_text[1] + '<br>' +
                    place.opening_hours.weekday_text[2] + '<br>' +
                    place.opening_hours.weekday_text[3] + '<br>' +
                    place.opening_hours.weekday_text[4] + '<br>' +
                    place.opening_hours.weekday_text[5] + '<br>' +
                    place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                    {maxHeight: 100, maxWidth: 200}) + '">';
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, markerindex);

        }


}












var ViewModel = function(){
    this.test = function(){
    }

}

ko.applyBindings(new ViewModel())


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

