//global buttons 
var mainContainer = $("<div>");
var btnHideShowMenu = $("<div>");
var btnStopDungeonAutoAtacks = $("<div>");
var btnStopExpeditionAutoAtacks = $("<div>");
var btnStopArenaAutoAtacks = $("<div>");
var btnStopCircusTurmaAutoAtacks = $("<div>");
var btnStopTraining = $("<div>");
var btnStopArenaProvAutoAtack = $("<div>");
var btnStopCTProvAutoAtack = $("<div>");
var btnStopQuestPicker = $("<div>");
var btnAddNewFood = $("<div>");


var btnSendMessageToGuild = $("<div>");

var btnPaketToBackpack = $("<div>");
var btnBidFood = $("<div>");
var btnEventExpedition = $("<div>");

//determinate on which server user is connected
var host = location.host;
var h = host.split(".")[0];
var goToDungeon = 'Zum Dungeon';
var goToExp = "Zur Expedition";
var goToArena = 'Zur Arena';
var goToCT = "Zum Circus Turma";
if(host.indexOf("ba.glad")> -1){
	goToDungeon = 'Idi u tamnicu';
	goToExp = 'Idi na ekspediciju';
	goToArena = 'Idi u arenu';
	goToCT = 'Za Cirkus Turmu';
}else if(host.indexOf("en.glad")> -1){
	goToDungeon = 'Go to dungeon';
	goToExp = 'Go to expedition';
	goToArena = 'Go to the arena';
	goToCT = 'To Circus Turma';
}

var hp = $(document).find("#header_values_hp_percent").text().slice(0,-1);




var trainNum = 1
var isDungeonAutoAtackOn = 0;
var isExpeditionAutoAtackOn = 0;
var isAutotrainingOn = 0;
var isArenaAutoAtackOn = 0;
var isCircusAutoAtackOn = 0;
var isArenaProvAutoAtackOn = 0;
var isCTProvAutoAtackOn = 0;
var isQuestPickOn = 0;
var isAutoFoodOn = 0;
var expLoc = 0;
var expPos = 0;
var dunDif = 0;
var hpHeal = 1;
var doEventExpedition = 0;
var eventMonsterId = 0;




var testArray=[0,1];

chrome.storage.local.get({
    [h]:testArray//put defaultvalues if any
},
function(data) {
	$.each(data, function(i,n){
		 isDungeonAutoAtackOn = n[0];
	   isExpeditionAutoAtackOn = n[1];
	   isAutotrainingOn = n[2];
	   isArenaAutoAtackOn = n[3];
	   isCircusAutoAtackOn = n[4];
	   isArenaProvAutoAtackOn = n[5];
	   isCTProvAutoAtackOn = n[6];
	   expLoc = n[7];
	   expPos = n[8];
	   dunDif = n[9];
	   isQuestPickOn = n[10];
	   isAutoFoodOn = n[11];
	   hpHeal = n[12];
	   doEventExpedition = n[13];
	   eventMonsterId = n[14];
		});
  
}
); 

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const currentTime = new Date().getTime();
const clickDelay = getRandomInt(900, 2400);
const currentDate = $("#server-time").html().split(',')[0];
let nextEventExpeditionTime = 0;
    if (localStorage.getItem('nextEventExpeditionTime')) {
        nextEventExpeditionTime = Number(localStorage.getItem('nextEventExpeditionTime'));
    };
	let eventPoints = 16;
    if (localStorage.getItem('eventPoints')) {
        const savedEventPoints = JSON.parse(localStorage.getItem('eventPoints'));

        if (savedEventPoints.date === currentDate) {
            eventPoints = savedEventPoints.count;
        };
    };
	


let doQuests = true;
    if (localStorage.getItem('doQuests')) {
        doQuests = localStorage.getItem('doQuests') === "true" ? true : false;
    }
    let questTypes = {
        combat: false,
        arena: true,
        circus: true,
        expedition: false,
        dungeon: false,
        items: false
    };
    if (localStorage.getItem('questTypes')) {
        questTypes = JSON.parse(localStorage.getItem('questTypes'));
    }
    let nextQuestTime = 0;
    if (localStorage.getItem('nextQuestTime')) {
        nextQuestTime = Number(localStorage.getItem('nextQuestTime'));
    }

console.log(h);




chrome.storage.local.get("tt", function(items){
	console.log(items.tt);
	if(!isNaN(items.tt)){
	    trainNum = items.tt * 1;
	    console.log("train " + trainNum);
	}
});

function storeInInventory() {


	var whereToPlace =[];
	var usedSpots = [];
	for (var p = $("body").find(".packageItem").length - 1; p >= 0; p--) {
		
		var selectedItem = $($("body").find(".packageItem")[p]);
		var selected = $($($("body").find(".packageItem")[p]).find("input")[0]).val();

		var sizex = $(selectedItem).find(".ui-draggable").attr("data-measurement-x")*1;
		var sizey = $(selectedItem).find(".ui-draggable").attr("data-measurement-y")*1;

		var am = $(selectedItem).find(".ui-draggable").attr("data-amount");

		if($(selectedItem).find(".ui-draggable").attr("data-content-type") == "-1"){
			continue;
		}
		
		if(usedSpots.length == 0){
			$($("body").find(".inventory_box")[0]).find(".ui-draggable").each(function(){
					usedSpots.push($(this).attr("data-position-x")*1+":"+$(this).attr("data-position-y")*1);
					if($(this).attr("data-measurement-x") == 2){
						usedSpots.push((($(this).attr("data-position-x") * 1)+1)+":"+$(this).attr("data-position-y")*1);
					}

					if($(this).attr("data-measurement-y") == 2){
						usedSpots.push($(this).attr("data-position-x")*1+":"+(($(this).attr("data-position-y")*1)+1));
						if($(this).attr("data-measurement-x") == 2){
							usedSpots.push((($(this).attr("data-position-x") * 1)+1)+":"+(($(this).attr("data-position-y")*1)+1));
						}
					}
					if($(this).attr("data-measurement-y") == 3){
						usedSpots.push($(this).attr("data-position-x")*1+":"+(($(this).attr("data-position-y")*1)+1));
						usedSpots.push($(this).attr("data-position-x")*1+":"+(($(this).attr("data-position-y")*1)+2));
						if($(this).attr("data-measurement-x") == 2){
							usedSpots.push((($(this).attr("data-position-x") * 1)+1)+":"+(($(this).attr("data-position-y")*1)+1));
							usedSpots.push((($(this).attr("data-position-x") * 1)+1)+":"+(($(this).attr("data-position-y")*1)+2));
						}
					}
				});
		}
		
		var emptyx = 0;
		var emptyy = 0;
		var has = false;
		for (var i = 1; i < 9; i++) {
			for (var j = 1; j<6; j++) {
				//find if there is empty spot then see if other are free
				if(emptyx == 0){
					if(sizex == 1 && sizey == 1){
						if(!usedSpots.includes(i+":"+j)){
							usedSpots.push(i+":"+j);
							emptyx = i;
							emptyy = j;
						}
					}

					if(sizex == 2 && sizey == 2 && i <=7 && j <=4){
						if(!usedSpots.includes(i+":"+j) &&
							!usedSpots.includes((i+1)+":"+j) &&
							!usedSpots.includes((i+1)+":"+(j+1)) &&
							!usedSpots.includes((i)+":"+(j+1)) ){
							emptyx = i;
							emptyy = j;

							usedSpots.push(i+":"+j);
							usedSpots.push((i+1)+":"+j);
							usedSpots.push((i+1)+":"+(j+1));
							usedSpots.push(i+":"+(j+1));

						}
					}

					if(sizex == 1 && sizey == 2 && i <=8 && j <=4){
						if(!usedSpots.includes(i+":"+j) &&
							!usedSpots.includes((i)+":"+(j+1)) ){
							emptyx = i;
							emptyy = j;

							usedSpots.push(i+":"+j);
							usedSpots.push(i+":"+(j+1));

						}
					}

					if(sizex == 1 && sizey == 3 && i <=8 && j <=3){
						if(!usedSpots.includes(i+":"+j) &&
							!usedSpots.includes((i)+":"+(j+1)) &&
							!usedSpots.includes((i)+":"+(j+2)) ){
							emptyx = i;
							emptyy = j;

							usedSpots.push(i+":"+j);
							usedSpots.push(i+":"+(j+1));
							usedSpots.push(i+":"+(j+2));

						}
					}

					if(sizex == 2 && sizey == 3 && i <=7 && j <=3){
						if(!usedSpots.includes(i+":"+j) &&
							!usedSpots.includes((i)+":"+(j+1)) &&
							!usedSpots.includes((i)+":"+(j+2)) &&
							!usedSpots.includes((i+1)+":"+(j+1)) &&
							!usedSpots.includes((i+1)+":"+(j+2)) &&
							!usedSpots.includes((i+1)+":"+(j))  ){
							emptyx = i;
							emptyy = j;

							usedSpots.push(i+":"+j);
							usedSpots.push(i+":"+(j+1));
							usedSpots.push(i+":"+(j+2));
							usedSpots.push((i+1)+":"+(j+1));
							usedSpots.push((i+1)+":"+(j+2));
							usedSpots.push((i+1)+":"+(j+0));

						}
					}
				}

			}
		}

		
		if(emptyx != 0){
			whereToPlace.push(selected+":"+emptyx+":"+emptyy+":"+am);
		}
		


	}
	var bag = 0;
	$($("body").find("#inventory_nav")[0]).find("a").each(function(){
		if($(this).hasClass("current")){
			bag = $(this).attr("data-bag-number");
		}
	});

	$.each(whereToPlace, function(i,item){
		var s = item.split(":");
		$.post( "/game/ajax.php?mod=inventory&submod=move&from=-"+s[0]+"&fromX=1&fromY=1&to="+bag+"&toX="+s[1]+"&toY="+s[2]+"&amount="+s[3], {a : "1507315367531", sh: $.urlParam('sh')}, function( data ) {
				  
				});
	});
	setTimeout(function(){
		location.reload();
	},1000);
}



$(document).ready(function(){

	//calculateTotalBag();
	
	mainContainer.addClass("mainContainer mainmenu");

	btnHideShowMenu.addClass("toggleMenu");
	btnHideShowMenu.text("Toggle Menu");
	mainContainer.append(btnHideShowMenu);
	
	btnStopDungeonAutoAtacks.addClass("btnStopDungeonAutoAtacks menuitem");
	btnStopDungeonAutoAtacks.text("Dungeon AutoAtack" + (isDungeonAutoAtackOn == 1 ? " on": " off"));
	mainContainer.append(btnStopDungeonAutoAtacks);
	mainContainer.append("<div class='tt'><input type='number' class='dunDif' value='"+dunDif+"' min='1' max='2' ></div><div style='clear:both;'></div>");


	btnStopExpeditionAutoAtacks.addClass("btnStopExpeditionAutoAtacks menuitem");
	btnStopExpeditionAutoAtacks.text("Expedition AutoAtack" + (isExpeditionAutoAtackOn == 1 ? " on": " off"));

	mainContainer.append(btnStopExpeditionAutoAtacks);
	mainContainer.append("<div class='tt'><input type='number' class='expLoc' value='"+expLoc+"' min='0' max='9'></div>");
	mainContainer.append("<div class='tt'><input type='number' class='expPos' value='"+expPos+"' min='1' max='4'></div><div style='clear:both;'></div>");

	btnPaketToBackpack.addClass("btnPaketToBackpack menuitem");
	btnPaketToBackpack.text("Paket - backpack");


	

	mainContainer.append(btnPaketToBackpack);

	btnBidFood.addClass("btnBidFood menuitem");
	btnBidFood.text("Bid on food");
	mainContainer.append(btnBidFood);

	btnStopTraining.addClass("btnStopTraining menuitem");
	btnStopTraining.text("Auto training"  + (isAutotrainingOn == 1 ? " on": " off"));
	mainContainer.append(btnStopTraining);

	btnStopArenaAutoAtacks.addClass("btnStopArenaAutoAtacks menuitem");
	btnStopArenaAutoAtacks.text("Arena AutoAtack"  + (isArenaAutoAtackOn == 1 ? " on": " off"));
	//mainContainer.append(btnStopArenaAutoAtacks);

	btnStopCircusTurmaAutoAtacks.addClass("btnStopCircusTurmaAutoAtacks menuitem");
	btnStopCircusTurmaAutoAtacks.text("CT AutoAtack"  + (isCircusAutoAtackOn == 1 ? " on": " off"));
	//mainContainer.append(btnStopCircusTurmaAutoAtacks);

	btnStopArenaProvAutoAtack.addClass("btnStopArenaProvAutoAtack menuitem");
	btnStopArenaProvAutoAtack.text("Arena Province AutoAtack"  + (isArenaProvAutoAtackOn == 1 ? " on": " off"));
	mainContainer.append(btnStopArenaProvAutoAtack);

	btnStopCTProvAutoAtack.addClass("btnStopCTProvAutoAtack menuitem");
	btnStopCTProvAutoAtack.text("CT Province AutoAtack"  + (isCTProvAutoAtackOn == 1 ? " on": " off"));
	mainContainer.append(btnStopCTProvAutoAtack);

	btnSendMessageToGuild.addClass("btnSendMessageToGuild menuitem");
	btnSendMessageToGuild.text("Sell to merchant");
	mainContainer.append(btnSendMessageToGuild);

	btnStopQuestPicker.addClass("btnStopQuestPicker menuitem");
	btnStopQuestPicker.text("Quest Picker: "  + (isQuestPickOn == 1 ? " on": " off"));
	mainContainer.append(btnStopQuestPicker);

	btnAddNewFood.addClass("btnAddNewFood menuitem");
	btnAddNewFood.text("Add New Food: "  + (isAutoFoodOn == 1 ? " on": " off"));
	mainContainer.append(btnAddNewFood);

	mainContainer.append("<div class='tt'><input type='number' class='eventMonsterId' value='"+eventMonsterId+"' min='0' max='3' ></div><div style='clear:both;'></div>");
	btnEventExpedition.addClass("btnEventExpedition menuitem");
	btnEventExpedition.text("Event expedition: "  + (doEventExpedition == 1 ? " on": " off"));
	mainContainer.append(btnEventExpedition);


	$("body").append(mainContainer);
});

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.href);

	if(typeof results == "undefined" || results == null ){
		return "asdasd";
	}
    return results[1] || 0;
}

const delay = (ms) => {
	return new Promise((resolve) => {
	  setTimeout(() => resolve(), ms);
	}, ms);
  };



setInterval(function(){
if(isQuestPickOn == 1){
	if (doQuests === true && nextQuestTime < currentTime) {
		function completeQuests() {
			const inPanteonPage = $("body").first().attr("id") === "questsPage";

			if (!inPanteonPage) {
				$("#mainmenu a.menuitem")[1].click();
			} else {
				const completedQuests = $("#content .contentboard_slot a.quest_slot_button_finish");

				if (completedQuests.length) {
					completedQuests[0].click();
				} else {
					repeatQuests();
				}
			}
		};

		function repeatQuests() {
			const failedQuests = $("#content .contentboard_slot a.quest_slot_button_restart");

			if (failedQuests.length) {
				failedQuests[0].click();
			} else {
				takeQuest();
			}
		};

		function takeQuest() {
			const canTakeQuest = $("#content .contentboard_slot a.quest_slot_button_accept");

			if (canTakeQuest.length) {
				function getIconName(url) {
					return url.split("/quest/icon_")[1].split("_inactive")[0];
				}

				const availableQuests = $("#content .contentboard_slot_inactive");

				for (const quest of availableQuests) {
					let icon = getIconName(quest.getElementsByClassName("quest_slot_icon")[0].style.backgroundImage);

					if (icon === "grouparena") {
						icon = "circus";
					};

					if (questTypes[icon]) {
						return quest.getElementsByClassName("quest_slot_button_accept")[0].click();
					};
				}           

				$("#quest_footer_reroll input").first().click()
			}  

			checkNextQuestTime();
		};

		function checkNextQuestTime() {
			const isTimer = $("#quest_header_cooldown")

			if (isTimer.length) {
				const nextQuestIn = Number($("#quest_header_cooldown b span").attr("data-ticker-time-left"))

				nextQuestTime = currentTime + nextQuestIn
				localStorage.setItem('nextQuestTime', nextQuestTime)
			} else {
				nextQuestTime = currentTime + 300000;
				localStorage.setItem('nextQuestTime', nextQuestTime)
			}

			if($("#blackoutDialogbod").is(":visible")){
					$($("#blackoutDialogbod").find("input")[1]).click();
				}
			}
		

		setTimeout(function(){
			completeQuests();
		}, clickDelay);
	}};

	

	if(isExpeditionAutoAtackOn == 1 && (hp*1) > 30){
		if($("#cooldown_bar_text_expedition").text() == goToExp){
			$.get( "/game/ajax.php?mod=location&submod=attack&location="+expLoc+"&stage="+expPos+"&premium=0&a=1507315367530&sh="+$.urlParam('sh'), function( data ) {
			  
			  location.reload();
			});
		}
	}
	//

	if(isDungeonAutoAtackOn == 1){
		if($("#cooldown_bar_text_dungeon").text() == goToDungeon && $.urlParam('mod') != "dungeon"){
			$("#cooldown_bar_text_dungeon").parent().find("a")[0].click();
		}

		if($("#cooldown_bar_text_dungeon").text() == goToDungeon && $.urlParam('mod') == "dungeon"){
			$('[onclick]').each(function(){
				if($(this).prop("tagName").toLowerCase() == "img"){
					$(this).click();
				}
			});
			setTimeout(function(){
				$("input[name='dif"+dunDif+"']")[0].click();
			},500);
		}
	}

	if(isCircusAutoAtackOn == 1){
		if($("#cooldown_bar_text_ct").text() == goToCT && $.urlParam('mod') != "arena" && $.urlParam('submod') != "groupArena" ){
			$("#cooldown_bar_text_ct").parent().find("a")[1].click();
		}

		if($("#cooldown_bar_text_ct").text() == goToCT && $.urlParam('mod') == "arena" && $.urlParam('submod') == "groupArena"){
			var count = $('.attack').length;
			var i = 1;
			
			$('.attack').first().click();
		}
	}
	if(isCTProvAutoAtackOn == 1){
		if($("#cooldown_bar_text_ct").text() == goToCT && ( $.urlParam('mod') != "arena" || $.urlParam('submod') != "serverArena" || $.urlParam('aType') != "3")){
			window.location.href = "/game/index.php?mod=arena&submod=serverArena&aType=3&sh="+$.urlParam('sh');
		}

		if($("#cooldown_bar_text_ct").text() == goToCT && $.urlParam('mod') == "arena" && $.urlParam('submod') == "serverArena" && $.urlParam('aType') == "3"){
			if($("#blackoutDialogbod").is(":visible")){
				$($("#blackoutDialogbod").find("input")[1]).click();
			}else{
				$('.attack').first().click();
			}
		}
	}

	if(isArenaAutoAtackOn == 1  && (hp*1) > 30 ){
		if($("#cooldown_bar_text_arena").text() == goToArena && $.urlParam('mod') != "arena" ){
			$("#cooldown_bar_text_arena").parent().find("a")[0].click();
		}

		if($("#cooldown_bar_text_arena").text() == goToArena && $.urlParam('mod') == "arena" ){

			
			$('.attack').first().click();
		}
	}

	if(isArenaProvAutoAtackOn == 1  && (hp*1) > 30){
		if($("#cooldown_bar_text_arena").text() == goToArena && ($.urlParam('mod') != "arena" || $.urlParam('submod') != "serverArena" || $.urlParam('aType') != "2")){
					window.location.href = "/game/index.php?mod=arena&submod=serverArena&aType=2&sh="+$.urlParam('sh');
				}
		
				if($("#cooldown_bar_text_arena").text() == goToArena && $.urlParam('mod') == "arena" && $.urlParam('submod') == "serverArena" && $.urlParam('aType') == "2"){
					if($("#blackoutDialogbod").is(":visible")){
						$($("#blackoutDialogbod").find("input")[0]).click();
					}else{
						$('.attack').first().click();
					}
				}
	}

	if (doEventExpedition == 1 && nextEventExpeditionTime < currentTime && eventPoints > 0 && hp >= 30) {
		function goEventExpedition() {
			const inEventExpeditionPage = document.getElementById("submenu2").getElementsByClassName("menuitem active glow")[0];

			if (!inEventExpeditionPage) {
				document.getElementById("submenu2").getElementsByClassName("menuitem glow")[0].click();
			} else {
				eventPoints = document.getElementById("content").getElementsByClassName("section-header")[0].getElementsByTagName("p")[1].firstChild.nodeValue.replace(/[^0-9]/gi, '')
				localStorage.setItem('eventPoints', JSON.stringify({count: eventPoints, date: currentDate}));

				const isTimer = $('#content .ticker').first()

				if (isTimer.length) {
					nextEventExpeditionTime = currentTime + Number($('#content .ticker').first().attr('data-ticker-time-left'));
					localStorage.setItem('nextEventExpeditionTime', nextEventExpeditionTime);

					location.reload();
				} else if (eventPoints == 0) {
					location.reload();
				} else if (eventPoints == 1 && eventMonsterId == 3) {
					localStorage.setItem('eventPoints', JSON.stringify({count: 0, date: currentDate}));

					document.getElementsByClassName("expedition_button")[2].click();
				} else {
					if (eventMonsterId == 3) {
						localStorage.setItem('eventPoints', JSON.stringify({count: eventPoints - 2, date: currentDate}));
					} else {
						localStorage.setItem('eventPoints', JSON.stringify({count: eventPoints - 1, date: currentDate}));
					}

					nextEventExpeditionTime = currentTime + 303000;
					localStorage.setItem('nextEventExpeditionTime', nextEventExpeditionTime);

					document.getElementsByClassName("expedition_button")[eventMonsterId].click();
				}
			}                
		};

		setTimeout(function(){
			goEventExpedition();
		}, clickDelay);

		

	}

	if(!!document.getElementById("mmoLogo") == false){
		console.log("Reloading...");
		
	};
	
	

	

	

	

}, 3000);


setInterval(function(){
	hp = $(document).find("#header_values_hp_percent").text().slice(0,-1);
	
	var isInPreview = false;
	
	
		
		
		
		if(hp <=  30){
			if(!$($("#sidebar_inner").find(".menuitem")[0]).hasClass("active")){
				window.location.href = "/game/index.php?mod=overview&sh="+$.urlParam('sh');
			}else{
				var posx = -1;
					var posy = -1;
				//find items to heal char
				$($("body").find(".inventory_box")[0]).find(".ui-draggable").each(function(){
					
					if($(this).attr("data-content-type") == 64 && posx <0){
						
						posx = $(this).attr("data-position-x")*1;
						posy = $(this).attr("data-position-y")*1;
					}
							
				});
				
				if(posx > -1){
				$.post( "/game/ajax.php?mod=inventory&submod=move&from=512&fromX="+posx+"&fromY="+posy+"&to=8&toX=1&toY=1&amount=1&doll=1", {a : "1507315367531", sh: $.urlParam('sh')}, function( data ) {
						  location.reload();
						});
						
						
				}
		}
	}
	
}, 15000);

setInterval(function(){

	if(!!document.querySelector('#packages > div:nth-child(1) > div:nth-child(3)') == false && isAutoFoodOn == 1){
		window.location.href = "/game/index.php?mod=packages&f=7&fq=-1&qry=&page=1&sh="+$.urlParam('sh');
		console.log("Da")
	} else {
	   storeInInventory();
	   console.log("Ne")
	}
	}, 20000);



	



$(function () {
   $( ".tt input" ).change(function() {
   var max = parseInt($(this).attr('max'));
   var min = parseInt($(this).attr('min'));
   if ($(this).val() > max)
   {
      $(this).val(max);
   }
   else if ($(this).val() < min)
   {
      $(this).val(min);
   }       
 }); 
});

$(document).on("click", ".btnStopDungeonAutoAtacks", function(){

	if(isDungeonAutoAtackOn == 1){isDungeonAutoAtackOn = 0} else {isDungeonAutoAtackOn = 1}

	btnStopDungeonAutoAtacks.text("Dungeon Autoatack" + (isDungeonAutoAtackOn == 1 ? " on": " off"));

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
	}, function() {
	    console.log("added to list");
	});
});


$(document).on("click", ".btnStopExpeditionAutoAtacks", function(){

	if(isExpeditionAutoAtackOn == 1){isExpeditionAutoAtackOn = 0} else {isExpeditionAutoAtackOn = 1}

	btnStopExpeditionAutoAtacks.text("Expedition AutoAtack" + (isExpeditionAutoAtackOn == 1 ? " on": " off"));

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("click", ".btnStopTraining", function(){

	if(isAutotrainingOn == 1){isAutotrainingOn = 0} else {isAutotrainingOn = 1}

	btnStopTraining.text("Auto training" + (isAutotrainingOn == 1 ? " on": " off"));

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("click", ".btnStopArenaAutoAtacks", function(){

	if(isArenaAutoAtackOn == 1){isArenaAutoAtackOn = 0} else {
		isArenaAutoAtackOn = 1;
		isArenaProvAutoAtackOn = 0;
		btnStopArenaProvAutoAtack.text("Arena Province AutoAtack off");
	}

	btnStopArenaAutoAtacks.text("Arena AutoAtack" + (isArenaAutoAtackOn == 1 ? " on": " off"));

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("click", ".btnStopQuestPicker", function(){

	if(isQuestPickOn == 1){isQuestPickOn = 0} else {
		isQuestPickOn = 1;
		btnStopQuestPicker.text("Quest Picker: off");
	}

	btnStopQuestPicker.text("Quest Picker: " + (isQuestPickOn == 1 ? " on": " off"));

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("click", ".btnAddNewFood", function(){

	if(isAutoFoodOn == 1){isAutoFoodOn = 0} else {
		isAutoFoodOn = 1;
		btnAddNewFood.text("Add New Food: off");
	}

	btnAddNewFood.text("Add New Food: " + (isAutoFoodOn == 1 ? " on": " off"));

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("click", ".btnEventExpedition", function(){

	if(doEventExpedition == 1){doEventExpedition = 0} else {
		doEventExpedition = 1;
		btnEventExpedition.text("Event expedition: off");
	}

	btnEventExpedition.text("Event expedition: " + (doEventExpedition == 1 ? " on": " off"));

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("click", ".btnStopCircusTurmaAutoAtacks", function(){

	if(isCircusAutoAtackOn == 1){isCircusAutoAtackOn = 0} else {
		isCircusAutoAtackOn = 1;
		isCTProvAutoAtackOn = 0;
		btnStopCTProvAutoAtack.text("CT Province AutoAtack off");
	}

	btnStopCircusTurmaAutoAtacks.text("CT AutoAtack" + (isCircusAutoAtackOn == 1 ? " on": " off"));

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("click", ".btnStopArenaProvAutoAtack", function(){
	
		if(isArenaProvAutoAtackOn == 1){isArenaProvAutoAtackOn = 0} else {
			isArenaProvAutoAtackOn = 1; 
			isArenaAutoAtackOn = 0;
			btnStopArenaProvAutoAtack.text("Arena AutoAtack off");
		}
	
		btnStopArenaProvAutoAtack.text("Arena Province AutoAtack" + (isArenaProvAutoAtackOn == 1 ? " on": " off"));
	
		chrome.storage.local.set({
			[h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
		}, function() {
			console.log("added to list");
		});
	});

	$(document).on("click", ".btnStopCTProvAutoAtack", function(){
		
			if(isCTProvAutoAtackOn == 1){isCTProvAutoAtackOn = 0} else {
				isCTProvAutoAtackOn = 1; 
				isCircusAutoAtackOn = 0;
				btnStopCircusTurmaAutoAtacks.text("CT AutoAtack off");
			}
		
			btnStopCTProvAutoAtack.text("CT Province AutoAtack" + (isCTProvAutoAtackOn == 1 ? " on": " off"));
		
			chrome.storage.local.set({
				[h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, isQuestPickOn, isAutoFoodOn, hpHeal, doEventExpedition, eventMonsterId]
			}, function() {
				console.log("added to list");
			});
		});

$(document).on("click", ".toggleMenu", function(){
	$(".menuitem", mainContainer).toggle();
});


$(document).on("click", ".btnPaketToBackpack", function(){

	storeInInventory();
});

$(document).on("click", ".btnBidFood", function(){

	var allOrangeJuiceQuery = document.getElementsByName("bid");

for (var i=0, len=allOrangeJuiceQuery.length|0; i<len; i=i+1|0) {
    setTimeout(allOrangeJuiceQuery[i].click(), 3000);
}
});

$(document).on("click", ".btnSendMessageToGuild", function(){

	var whereToPlace =[];
	var usedSpots = [];
	for (var p = $($("body").find(".inventory_box")[0]).find(".ui-draggable").length - 1; p >= 0; p--) {
		
		var selectedItem = $($("body").find(".inventory_box")[0]).find(".ui-draggable")[p];
		var selected = $(selectedItem).attr("data-item-id");
		var sizex = $(selectedItem).attr("data-measurement-x")*1;
		var sizey = $(selectedItem).attr("data-measurement-y")*1;
		var posx = $(selectedItem).attr("data-position-x")*1;
		var posy = $(selectedItem).attr("data-position-y")*1;

		var am = $(selectedItem).attr("data-amount");
		if(usedSpots.length == 0){
			$($("body").find("#shop")[0]).find(".ui-draggable").each(function(){
					usedSpots.push($(this).attr("data-position-x")*1+":"+$(this).attr("data-position-y")*1);
					if($(this).attr("data-measurement-x") == 2){
						usedSpots.push((($(this).attr("data-position-x") * 1)+1)+":"+$(this).attr("data-position-y")*1);
					}

					if($(this).attr("data-measurement-y") == 2){
						usedSpots.push($(this).attr("data-position-x")*1+":"+(($(this).attr("data-position-y")*1)+1));
						if($(this).attr("data-measurement-x") == 2){
							usedSpots.push((($(this).attr("data-position-x") * 1)+1)+":"+(($(this).attr("data-position-y")*1)+1));
						}
					}
					if($(this).attr("data-measurement-y") == 3){
						usedSpots.push($(this).attr("data-position-x")*1+":"+(($(this).attr("data-position-y")*1)+1));
						usedSpots.push($(this).attr("data-position-x")*1+":"+(($(this).attr("data-position-y")*1)+2));
						if($(this).attr("data-measurement-x") == 2){
							usedSpots.push((($(this).attr("data-position-x") * 1)+1)+":"+(($(this).attr("data-position-y")*1)+1));
							usedSpots.push((($(this).attr("data-position-x") * 1)+1)+":"+(($(this).attr("data-position-y")*1)+2));
						}
					}
				});
		}
	

		
		var emptyx = 0;
		var emptyy = 0;
		var has = false;
		for (var i = 1; i < 7; i++) {
			for (var j = 1; j<9; j++) {
				//find if there is empty spot then see if other are free
				if(emptyx == 0){
					if(sizex == 1 && sizey == 1){
						if(!usedSpots.includes(i+":"+j)){
							usedSpots.push(i+":"+j);
							emptyx = i;
							emptyy = j;
						}
					}

					if(sizex == 2 && sizey == 2 && i <=5 && j <=7){
						if(!usedSpots.includes(i+":"+j) &&
							!usedSpots.includes((i+1)+":"+j) &&
							!usedSpots.includes((i+1)+":"+(j+1)) &&
							!usedSpots.includes((i)+":"+(j+1)) ){
							emptyx = i;
							emptyy = j;

							usedSpots.push(i+":"+j);
							usedSpots.push((i+1)+":"+j);
							usedSpots.push((i+1)+":"+(j+1));
							usedSpots.push(i+":"+(j+1));

						}
					}

					if(sizex == 1 && sizey == 2 && i <=6 && j <=7){
						if(!usedSpots.includes(i+":"+j) &&
							!usedSpots.includes((i)+":"+(j+1)) ){
							emptyx = i;
							emptyy = j;

							usedSpots.push(i+":"+j);
							usedSpots.push(i+":"+(j+1));

						}
					}

					if(sizex == 1 && sizey == 3 && i <=6 && j <=6){
						if(!usedSpots.includes(i+":"+j) &&
							!usedSpots.includes((i)+":"+(j+1)) &&
							!usedSpots.includes((i)+":"+(j+2)) ){
							emptyx = i;
							emptyy = j;

							usedSpots.push(i+":"+j);
							usedSpots.push(i+":"+(j+1));
							usedSpots.push(i+":"+(j+2));

						}
					}

					if(sizex == 2 && sizey == 3 && i <=5 && j <=6){
						if(!usedSpots.includes(i+":"+j) &&
							!usedSpots.includes((i)+":"+(j+1)) &&
							!usedSpots.includes((i)+":"+(j+2)) &&
							!usedSpots.includes((i+1)+":"+(j+1)) &&
							!usedSpots.includes((i+1)+":"+(j+2)) &&
							!usedSpots.includes((i+1)+":"+(j))  ){
							emptyx = i;
							emptyy = j;

							usedSpots.push(i+":"+j);
							usedSpots.push(i+":"+(j+1));
							usedSpots.push(i+":"+(j+2));
							usedSpots.push((i+1)+":"+(j+1));
							usedSpots.push((i+1)+":"+(j+2));
							usedSpots.push((i+1)+":"+(j+0));

						}
					}
				}

			}
		}

		
		if(emptyx != 0){
			whereToPlace.push(selected+":"+emptyx+":"+emptyy+":"+posx+":"+posy+":"+am);
		}
		


	}
	var bag = 0;
	$($("body").find("#inventory_nav")[0]).find("a").each(function(){
		if($(this).hasClass("current")){
			bag = $(this).attr("data-bag-number");
		}
	});

	$.each(whereToPlace, function(i,item){
		var s = item.split(":");
		var inv = $($("body").find("#shop")[0]).attr("data-container-number");
		$.post( "/game/ajax.php?mod=inventory&submod=move&from="+bag+"&fromX="+s[3]+"&fromY="+s[4]+"&to="+inv+"&toX="+s[1]+"&toY="+s[2]+"&amount="+s[5], {a : "1507315367531", sh: $.urlParam('sh')}, function( data ) {
				  
				});
	});

	setTimeout(function(){
		location.reload();
	},1000);

	console.log(whereToPlace);
	
});



$(document).on("change", ".expLoc", function(){

	expLoc = $(this).val();

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, hpHeal, eventMonsterId, doEventExpedition]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("change", ".eventMonsterId", function(){

	eventMonsterId = $(this).val();

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, hpHeal, eventMonsterId, doEventExpedition]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("change", ".expPos", function(){

	expPos = $(this).val();

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, hpHeal, eventMonsterId, doEventExpedition]
	}, function() {
	    console.log("added to list");
	});
});

$(document).on("change", ".hpHeal", function(){

	hpHeal = $(this).val();
	console.log(hpHeal);

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif, hpHeal, eventMonsterId, doEventExpedition]
	}, function() {
	    console.log("added to list");
	});
});


$(document).on("change", ".dunDif", function(){

	dunDif = $(this).val();

	chrome.storage.local.set({
	    [h]:[isDungeonAutoAtackOn,isExpeditionAutoAtackOn,isAutotrainingOn,isArenaAutoAtackOn,isCircusAutoAtackOn,isArenaProvAutoAtackOn,isCTProvAutoAtackOn,expLoc,expPos,dunDif,hpHeal, eventMonsterId, doEventExpedition]
	}, function() {
	    console.log("added to list");
	});
});




setInterval(function(){
	//try to train 
	if(isAutotrainingOn == 1){
		trainNum++;

		if(trainNum > 6){
			trainNum = 1;
		}
		console.log(trainNum);

		chrome.storage.local.set({'tt': trainNum});

		window.location.href = "/game/index.php?mod=training&submod=train&skillToTrain="+ trainNum +"&sh="+$.urlParam('sh');
	}
		
},35000);

	var calculateTotalBag = function(){
		var total = 0;
		for (var p = $($("body").find(".inventory_box")[0]).find(".ui-draggable").length - 1; p >= 0; p--) {
		
			var selectedItem = $($("body").find(".inventory_box")[0]).find(".ui-draggable")[p];
			var selected = $(selectedItem).attr("data-item-id");
			var sizex = $(selectedItem).attr("data-measurement-x")*1;
			var sizey = $(selectedItem).attr("data-measurement-y")*1;
			var posx = $(selectedItem).attr("data-position-x")*1;
			var posy = $(selectedItem).attr("data-position-y")*1;


		}
	}
