const setting_en = function () {
	getKrpano().set("layer[skin_btn_home].onhover","showtext(Home,STYLETEXT);");
	getKrpano().set("layer[skin_nut_vr].onhover","showtext(VR Mode,STYLETEXT);");
	getKrpano().set("layer[skin_btn_audio_pause].onhover","showtext(Turn off Voice,STYLETEXT);");
	getKrpano().set("layer[skin_btn_audio_play].onhover","showtext(Turn on Voice,STYLETEXT);");
	getKrpano().set("layer[exit_full_screen].onhover","showtext(Exit Fullscreen,STYLETEXT);");
	getKrpano().set("layer[full_screen].onhover","showtext(Fullscreen,STYLETEXT);");
	// Menu
	getKrpano().set("layer[txt_1_2].html","OVERHEAD VIEW");
	getKrpano().set("layer[txt_1_1].html","HISTORICAL SITES");
	getKrpano().set("layer[txt_1_3].html","POTTERY ROAD");
	getKrpano().set("layer[txt_1_4].html","CENTER OF VIETNAM QUINTESSENTIAL HANDICRAFT");
	getKrpano().set("layer[txt_1_2_3].html","Overall observation position");
} 