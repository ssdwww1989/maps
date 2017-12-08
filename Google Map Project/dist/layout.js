//调用地图api

var map;

function creat_Map(){
    map = new google.maps.Map(document.getElementById('create_map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
    });
}


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
    $(".map_left_wrap").toggleClass("hidemenu")
})

