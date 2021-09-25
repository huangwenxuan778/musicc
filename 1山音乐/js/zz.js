$(function(){
$(".conterlist").mCustomScrollbar();
var $audio=$("audio");
var voiceprogress;
var progress;
var player=new 	Player($audio);
var $progressbar =$(".music_progress_bar");	   
var $progressline =$(".music_progress_line");	   
var $progressdot =$(".music_progress_dot");	 
 progress=Progress($progressbar,$progressline,$progressdot);
progress.progressClick(function (value){
	player.musicseekto(value);
});
progress.progressMove(function (value){
	player.musicseekto(value);
});


var $voicebar =$(".m_voice_bar");	   
var $voiceline =$(".m_voice_l");	   
var $voicedot =$(".m_voice_d");	 
 voiceprogress = Progress($voicebar,$voiceline,$voicedot);
 
voiceprogress.progressClick(function (value){
	player.musicvoiceseekto(value);
});
voiceprogress.progressMove(function (value){
	player.musicvoiceseekto(value);
});



//player.xxx();


	   //加载歌曲列表
	getplaylist();
function getplaylist(){
	$.ajax({
		type:"get", 
		url:"./source/musiclist.json",
		dataType:"json",
		success:function(data){
			player.musiclist=data;
				var $musiclist =$(".conterlist ul");
			$.each(data,function(index,ele){
				var $item=crateMusicItem(index,ele);
			
				$musiclist.append($item);
				
			});
			//播放歌曲第一条数据
			initMusicinfo(data[0]);
		},
		error:function(e){
			console.log(e);
		}
	});
}
function initMusicinfo(music){
		var $musicImage=$(".song_info_pic img");
		var $musicName=$(".song_info_name a");
		var $musicSinger=$(".song_info_songer a");
		var $musicAblum=$(".music_pre a");
		var $musicProgressName=$(".mp_name");
		var $musicProgresstime=$(".mp_time");
		  var $musicBg = $(".mask_bg");
	
		
		$musicImage.attr("src", music.cover);
		$musicName.text(music.name);
		$musicSinger.text(music.singer); 
		$musicAblum.text(music.album);
		$musicProgressName.text(music.name +" / " +music.singer);
		$musicProgresstime.text("00:00/ " +music.time);
	  $musicBg.css("background", "url('"+music.cover+"') ");
	
	
}

	   //初始化事件监听
	   initevens();
	function initevens(){
		   //进行委托，鼠标加入特效
	   $(".conterlist").delegate(".music","mouseenter",function(){
	   	$(this).find(".menu ").stop().fadeIn(100);
		$(this).find(".listtime  a").stop().fadeIn(100);
		// $(this).find(".listtime span").stop().fadeIn(100);
	   });
	    $(".conterlist").delegate(".music","mouseleave",function(){
	   	
			$(this).find(".menu ").stop().fadeOut(100);
			$(this).find(".listtime  a").stop().fadeOut(100);
				// $(this).find(".listtime span").stop().fadeOut(100);
	   });
	   
	$(".conterlist").delegate(".listcheck","click",function(){
		 $(this).toggleClass("listchecked")
	});
	//拉宽
	$(".left").click(function(){
	$(".conterhide").stop().slideToggle(1000);
		
});
	
var $musicplay=$(".music_play");


 //播放按键
$(".conterlist").delegate(".list_menu_play","click",function(){
	var $item=$(this).parents(".music");
	console.log($item.get(0).index);
		console.log($item.get(0).music); 
	$(this).toggleClass("list_menu_play2")
	//复原其他播放图标
		 $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
//	
//	if($(this).attr("class").indexOf("list_menu_play2") !=-1){
		//当前为播放状态  
		//
		if($(this).hasClass("list_menu_play") ==true  ){
		
				$musicplay.removeClass("music_play2")
		$item.find("div").css("color","rgba(255,255,255,0.5)")
	}
	
	

	if($(this).hasClass("list_menu_play2") ==true ){
	$musicplay.addClass("music_play2")
			$item.find("div").css("color","#FFFFFF");
			$item.siblings().find("div").css("color","rgba(255,255,255,0.5)")

	} 
 
//$musicplay.toggleClass("music_play2")
 //3.4切换序号
$item.find(".listnum").toggleClass("listnum2");
$item.siblings().find(".listnum").removeClass("listnum2");
//播放音乐当前
player.playMusic($item.get(0).index,$item.get(0).music);
initMusicinfo($item.get(0).music);
 
}) 


//4播放
$musicplay.click(function(){
	if(player.currentIndex == -1){
		//没有播放音乐 
		$(".music").eq(0).find(".list_menu_play").trigger("click");
	}else{
		$(".music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
	}
})
//5上一首
$(".music_pre").click(function(){
	$(".music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
})
//6下一首
$(".music_next").click(function(){
	$(".music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
})




//$(".left").click(function(){
//	$(".conterhide").stop().slideToggle(1000);
//		
//});

//排序
$(".conterlist").delegate(".list_menu_del","click" ,function(){
	var $item=$(this).parents(".music");
	
	if($item.get(0).index ==player.currentIndex){
		$(".music_next").trigger("click");
	} 
	$item.remove();
	player.changMusic($item.get(0).index);
	 $(".music").each(function(index,ele){
	 	ele.index=index; 
	    $(ele).find(".listnum").text(index+1)
	 })
 
})
 // 8.监听播放的进度
player.musictimeupdate(function(currentTime, duration, timeStr){
	$(".mp_time").text(timeStr);
	//如果时间等于播放下一首
		if(currentTime==duration){
		$(".music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
	}
	//计算播放百分比 
	var value =currentTime / duration *100;
	progress.setprogress(value)
//	if(currentTime==duration){
//		$(".music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
//	}
});



$(".music_voice_icon").click(function(){
	//图标切换
	$(this).toggleClass("music_voice_icon2");
	//声音切换
	if($(this).attr("class").indexOf("music_voice_icon2") != -1){
		player.musicvoiceseekto(0);
		
	}else{
			player.musicvoiceseekto(1);
		
	}
})
   
	}


	
	
    function crateMusicItem(index,music){
    	var $item=$(`<li class="music">
									<div class="listcheck"><i></i></div>
									<div class="listnum">`+(index+1)+`</div>
									<div class="name">`+music.name+`
										<div class="menu">
										<a href="javascript:;" title="播放" class='list_menu_play'></a>
										<a href="javascript:;" title="添加"></a>
										<a href="javascript:;" title="下载"></a>
										<a href="javascript:;" title="分享"></a>
									</div></div>
									
									<div class="singer">`+music.singer+`</div>
									<div class="listtime">
										<span>`+music.time+`</span>
										<a href="javascript:;" title="删除" class='list_menu_del'></a>
									</div>
								</li>`)
    	$item.get(0).index=index;
    	$item.get(0).music=music;
    	
    	return $item;
    }
//定义一个格式化时间

}) 
