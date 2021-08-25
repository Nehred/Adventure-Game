fetch('js/json/areas.json')
  .then(function(areas){
    return areas.json();
  })
  .then(function(areaJSON){
    areas=areaJSON;
  });
fetch('js/json/characters.json')
  .then(function(characters){
    return characters.json();
  })
  .then(function(characterJSON){
    characters=characterJSON;
  });
fetch('js/json/dialogs.json')
  .then(function(dialogs){
    return dialogs.json();
  })
  .then(function(dialogJSON){
    dialogs=dialogJSON;
  });
fetch('js/json/inventory.json')
  .then(function(inventory){
    return inventory.json();
  })
  .then(function(inventoryJSON){
    inventory=inventoryJSON;
  });
fetch('js/json/scenery.json')
  .then(function(scenery){
    return scenery.json();
  })
  .then(function(sceneryJSON){
    sceneries=sceneryJSON;
  });

var sfx_blip_select=new Howl({
  src:['./audio/sfx_blip_select.wav'],
  preload:true,
  volume:.25,
  loop:false
});
var sfx_blip_next=new Howl({
  src:['./audio/sfx_blip_next.wav'],
  preload:true,
  volume:.5,
  loop:false
});
var sfx_ambient_museum=new Howl({
  src:['./audio/sfx_ambient_museum.wav'],
  preload:true,
  volume:0,
  loop:true,
  onplay:function(){
    sfx_ambient_museum.fade(0,1,1000);
  }
});
var sfx_locked_door=new Howl({
  src:['./audio/sfx_locked_door.wav'],
  preload:true,
  volume:1
});
var sfx_footsteps=new Howl({
  src:['./audio/sfx_footsteps.wav'],
  preload:true,
  volume:.25
});

var karmaScore=JSON.parse(localStorage.getItem('karmaScore'));
var currentCharacter=JSON.parse(localStorage.getItem('savedCharacter'));
var currentCharacterId=JSON.parse(localStorage.getItem('savedCharacterId'));
var currentStage=JSON.parse(localStorage.getItem('savedStage'));
var currentArea=JSON.parse(localStorage.getItem('savedArea'));
var currentSentence=0;
var selectedAction=0;
var currentDialog=0;
var currentPart=0;
var currentItem=0;
var hasControl=false;

var manual=false;
var credits=false;
function doShowManual(){
  doHideCredits();
  if(manual==false){
    document.getElementById("manual").innerHTML="CLOSE";
    document.getElementById("manualUrl").style.opacity="1";
    manual=true;
  }
  else{
    doHideManual();
  }
}
function doHideManual(){
  document.getElementById("manual").innerHTML="MANUAL";
  document.getElementById("manualUrl").style.opacity="0";
  manual=false;
}
function doShowCredits(){
  doHideManual();
  if(credits==false){
    document.getElementById("credits").innerHTML="CLOSE";
    document.getElementById("creditsUrl").style.opacity="1";
    credits=true;
  }
  else{
    doHideCredits();
  }
}
function doHideCredits(){
  document.getElementById("credits").innerHTML="CREDITS";
  document.getElementById("creditsUrl").style.opacity="0";
  credits=false;
}

function doLoad(){
  hasControl=true;
  document.getElementById('homeScreen').style.opacity='1';
  if(JSON.parse(localStorage.getItem('canContinue'))==true){
    document.getElementById('continue').style.opacity='1';
  }
  else{
    document.getElementById('continue').style.pointerEvents='none';
    // setTimeout(function(){
    //   doShowManual();
    // },2000);
    // setTimeout(function(){
    //   doHideManual();
    // },12000);
  }
}
function flash(){
  var i =1;
  if(hasControl==true){
    hasControl=false;
    document.getElementById('flashScreen').style.opacity=('1');
    setTimeout(function(){
      document.getElementById('title').style.opacity=('1');
      document.getElementById('flashScreen').style.transition=('2.5s');
      document.getElementById('flashScreen').style.opacity=('0');
      document.getElementById("img" + i + "").style.opacity=('1');
    }, 250);
    setTimeout(function(){
      document.getElementById("img" + i + "").style.transition=('2.5s');
      document.getElementById("img" + i + "").style.opacity=('0');
    }, 300);
    setTimeout(function(){
      document.getElementById('flashScreen').style.transition=('.1s');
      document.getElementById("img" + i + "").style.transition=('0s');
      hasControl=true;
    }, 2800);
  }
}

function doNewGame(){
  document.getElementById('homeScreen').style.opacity='0';
  document.getElementById('homeScreen').style.pointerEvents='none';
  sfx_ambient_museum.play();
  localStorage.clear();
  localStorage.setItem('karmaScore',0);
  localStorage.setItem('savedStage',0);
  localStorage.setItem('savedArea',2);
  localStorage.setItem('savedCharacter',null);
  localStorage.setItem('savedCharacterId',null);
  localStorage.setItem('gotMap',false);
  localStorage.setItem('gotBag',false);
  localStorage.setItem('gotMask',false);
  localStorage.setItem('gotPhone',false);
  for(i=0;i<inventory.bag.item.length;i++){
    bag=inventory.bag;
    item=bag.item[i].name;
    localStorage.setItem(item,false);
  }
  currentStage=JSON.parse(localStorage.getItem('savedStage'));
  currentArea=JSON.parse(localStorage.getItem('savedArea'));
  currentCharacter=JSON.parse(localStorage.getItem('savedCharacter'));
  currentCharacterId=JSON.parse(localStorage.getItem('savedCharacterId'));
  vueArea.url=areas.area[currentArea].url;
  document.getElementById("HUD").style.marginTop="0";
  setTimeout(function(){
    currentDialog=1;
    currentPart=0;
    doTalk();
  },5000);
}
function doContinue(){
  document.getElementById('homeScreen').style.opacity='0';
  document.getElementById('homeScreen').style.pointerEvents='none';
  currentStage=JSON.parse(localStorage.getItem('savedStage'));
  if(JSON.parse(localStorage.getItem('gotMap'))==true){
    document.getElementById('mapIcon').style.pointerEvents='auto';
    document.getElementById('mapIcon').innerHTML='<img src="img/closed-map.png"/>';
  }
  if(JSON.parse(localStorage.getItem('gotBag'))==true){
    document.getElementById('bagIcon').style.pointerEvents='auto';
    document.getElementById('bagIcon').innerHTML='<img src="img/closed-bag.png"/>';
  }
  if(JSON.parse(localStorage.getItem('gotMask'))==true){
    document.getElementById('maskIcon').style.pointerEvents='auto';
    document.getElementById('maskIcon').innerHTML='<img src="img/closed-mask.png"/>';
  }
  if(JSON.parse(localStorage.getItem('gotPhone'))==true){
    document.getElementById('phoneIcon').style.pointerEvents='auto';
    document.getElementById('phoneIcon').innerHTML='<img src="img/closed-phone.png"/>';
  }
  document.getElementById("HUD").style.marginTop="0";
  for(i=0;i<inventory.bag.item.length;i++){
    bag=inventory.bag;
    item=bag.item[i].name;
    icon=bag.item[i].icon;
    savedItem=JSON.parse(localStorage.getItem(item));
    if(savedItem==true){
      document.getElementById('items').innerHTML += "<div id='item"+i+"' onclick=\"selectedItem='"+i+"',doShowDescription()\"><img class='item' src='"+icon+"'/></div>";
    }
  }
  if(currentStage>=2){
    areas.area[1].locked=true;
    areas.area[2].locked=true;
    if(currentStage==2&&currentArea==0||currentStage==3&&currentArea==0){
      document.getElementById("scenery").style.opacity="1";
      vueScenery.url=sceneries.scenery[0].url;
    }
  }
  if(currentStage==3){
    localStorage.setItem('savedCharacter',null);
  }
  if(currentStage>=4){
    if(currentStage==4&&JSON.parse(localStorage.getItem('savedArea'))!=0){
      localStorage.setItem('savedArea',0);
    }
    localStorage.setItem('savedCharacter',null);
    areas.area[3].presentCharacter[0].character=5;
    areas.area[3].presentCharacter[0].img=0;
    areas.area[3].available=true;
    areas.area[3].locked=false;
    areas.area[9].available=false;
    areas.area[9].locked=true;
  }
  if(currentStage>=5){
    localStorage.setItem('savedCharacter',5);
    localStorage.setItem('savedCharacterId',1);
  }
  if(currentStage>=6){
    localStorage.setItem('savedCharacterId',2);
  }
  currentCharacter=JSON.parse(localStorage.getItem('savedCharacter'));
  currentCharacterId=JSON.parse(localStorage.getItem('savedCharacterId'));
  if(currentCharacter!=null){
    character=characters.character[currentCharacter];
    document.getElementById(character.img[currentCharacterId].url).style.pointerEvents="auto";
    doShowCharacter();
  }
  currentArea=JSON.parse(localStorage.getItem('savedArea'));
  vueArea.url=areas.area[currentArea].url;
  setTimeout(function(){
    document.getElementById('blackScreen').style.opacity="0";
    hasControl=true;
  },1500);
}
function doQuit(){
  location.reload();
}

function doTalk(){
  doCloseMap();
  doCloseBag();
  hasControl=false;
  dialog=dialogs[currentDialog].dialog[currentPart];
  document.getElementById("dialog").style.pointerEvents="none";
  document.getElementById("HUD").style.marginTop="-100%";
  if(document.getElementById("scenery").style.opacity=="1"){
    document.getElementById("blackScreen02").style.opacity=".75";
    document.getElementById("blackScreen03").style.opacity="0";
  }
  else{
    document.getElementById("blackScreen02").style.opacity="0";
    document.getElementById("blackScreen03").style.opacity=".75";
  }
  document.getElementById("dialogSentence").innerHTML="";
  document.getElementById("dialogButtonBox").innerHTML="";
  document.getElementById("buttonBoxLeft").style.left="-100%";
  document.getElementById("buttonBoxRight").style.right="-100%";
  var nodes=document.getElementById('characterBox').childNodes;
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].nodeName.toLowerCase() == 'img'){
      nodes[i].style.transform="translateX(25%)";
      nodes[i].style.pointerEvents="none";
    }
  }
  if(dialog.tag==true){
    document.getElementById("dialogText").style.borderRadius="0 .5vw .5vw .5vw";
    document.getElementById("dialogName").style.opacity="1";
    if(dialog.showName==true){
      document.getElementById("dialogName").innerHTML=characters.character[dialog.who].name;
    }
    else{
      document.getElementById("dialogName").innerHTML="? ? ?";
    }
  }
  else{
    document.getElementById("dialogText").style.borderRadius=".5vw .5vw .5vw .5vw";
    document.getElementById("dialogName").style.opacity="0";
    document.getElementById("dialogName").innerHTML="";
  }
  document.getElementById("dialogBox").style.opacity="1";
  var voice=new Howl({
    src:[characters.character[dialog.who].voice],
    preload:true,
    volume:.1,
    loop:true
  });
  voice.play();
  speechtext= dialog.sentence[currentSentence].text;
  new Typed('#dialogSentence',{
    strings:[speechtext],
    typeSpeed:dialog.sentence[currentSentence].speed,
    showCursor:false,
    onTypingPaused(){voice.stop();},
    onTypingResumed(){voice.play();},
    onComplete(){
      voice.stop();
      if(currentSentence==(dialog.sentence.length-1)){
        document.getElementById("buttonBoxLeft").innerHTML="";
        document.getElementById("buttonBoxRight").innerHTML="";
        for(i=0;i<dialog.action.length;i++){
          if(dialogs[currentDialog].dialog[currentPart].action[i].choice!=null){
            if(i<=1){
              document.getElementById("buttonBoxLeft").innerHTML += "<button class=\"choice left\" onclick=\"selectedAction="+i+",sfx_blip_next.play(),doAction("+i+")\">-"+dialog.action[i].choice+"</button>";
            }
            else{
              document.getElementById("buttonBoxRight").innerHTML += "<button class=\"choice right\" onclick=\"selectedAction="+i+",sfx_blip_next.play(),doAction("+i+")\">-"+dialog.action[i].choice+"</button>";
            }
            document.getElementById("buttonBoxLeft").style.left="0";
            document.getElementById("buttonBoxRight").style.right="0";
          }
          else{
            if(dialog.sentence[currentSentence].skip!=null){
              document.getElementById("dialogButtonBox").innerHTML += "<i id=\"nextButton\" class=\"fas fa-caret-right\"onclick=\"selectedAction="+i+",doAction("+i+")\"></i>";
              document.getElementById("nextButton").style.opacity="0";
            }
            else{
              document.getElementById("dialogButtonBox").innerHTML += "<i id=\"nextButton\" class=\"fas fa-caret-right\"onclick=\"selectedAction="+i+",sfx_blip_next.play(),doAction("+i+")\"></i>";
              document.getElementById("dialog").style.pointerEvents="auto";
              document.getElementById("nextButton").style.opacity="1";
              hasControl=true;
            }
          }
        }
      }
      else{
        if(dialog.sentence[currentSentence].skip!=null){
          document.getElementById("dialogButtonBox").innerHTML += "<i id=\"nextButton\" class=\"fas fa-caret-right\" onclick=\"doTalk()\"></i>";
          document.getElementById("nextButton").style.opacity="0";
        }
        else{
          document.getElementById("dialogButtonBox").innerHTML += "<i id=\"nextButton\" class=\"fas fa-caret-right\" onclick=\"sfx_blip_next.play(),doTalk()\"></i>";
          document.getElementById("dialog").style.pointerEvents="auto";
          document.getElementById("nextButton").style.opacity="1";
          hasControl=true;
        }
      }
      if(dialog.sentence[currentSentence].skip!=null){
        setTimeout(function(){
          currentSentence++;
          document.getElementById("nextButton").click();
        },dialog.sentence[currentSentence].skip);
      }
      else{
        document.getElementById("dialog").style.pointerEvents="auto";
        currentSentence++;
        hasControl=true;
      }
    }
  });
}
function doAction(selectedAction){
  dialog=dialogs[currentDialog].dialog[currentPart];
  action=dialog.action[selectedAction];
  currentStage=action.nextStage;
  currentPart=action.nextDialog;
  currentSentence=0;
  if(action.nextStage!=null){
    doNextStage();
  }
  if(action.fadeIn!=null){
    doFadeIn();
  }
  if(action.fadeOut!=null){
    doFadeOut();
  }
  if(action.showCharacter[0].character!=null){
    currentCharacter=action.showCharacter[0].character;
    currentCharacterId=action.showCharacter[0].img;
    doShowCharacter();
  }
  if(action.hideCharacter!=false){
    doHideCharacter();
  }
  if(action.changeCharacter[0].character!=null){
    doChangeCharacter();
  }
  if(action.showScenery!=null){
    doShowScenery();
  }
  if(action.hideScenery!=false){
    doHideScenery();
  }
  if(action.addItem!=null){
    currentItem=action.addItem;
    doAddItem();
  }
  if(action.removeItem!=null){
    doRemoveItem();
  }
  if(action.addScore!=false){
    karmaScore=JSON.parse(localStorage.getItem('karmaScore'));
    karmaScore++;
    localStorage.setItem('karmaScore',karmaScore);
  }
  if(action.removeScore!=false){
    karmaScore=JSON.parse(localStorage.getItem('karmaScore'));
    karmaScore--;
    localStorage.setItem('karmaScore',karmaScore);
  }
  if(action.pause!=null){
    doPause();
  }
  else if(action.stopTalk!=false){
    doStopTalk();
  }
  else{
    doTalk();
  }
}

function doFadeIn(){
  document.getElementById("blackScreen").style.transition="1s";
  setTimeout(function(){
    document.getElementById("blackScreen").style.opacity="1";
  },action.fadeIn);
}
function doFadeOut(){
  document.getElementById("blackScreen").style.transition="1s";
  setTimeout(function(){
    document.getElementById("blackScreen").style.opacity="0";
  },action.fadeOut);
}
function doShowCharacter(){
  character=characters.character[currentCharacter];
  setTimeout(function(){
    if(character.ghost==true){
      document.getElementById(character.img[currentCharacterId].url).style.pointerEvents="none";
      document.getElementById(character.img[currentCharacterId].url).style.opacity="0";
      areas.area[currentArea].presentCharacter[0].character=currentCharacter;
      areas.area[currentArea].presentCharacter[0].img=currentCharacterId;
    }
    else{
      document.getElementById(character.img[currentCharacterId].url).style.opacity="1";
    }
  },1000);
  localStorage.setItem('savedCharacter',currentCharacter);
  localStorage.setItem('savedCharacterId',currentCharacterId);
}
function doHideCharacter(){
  var nodes=document.getElementById('characterBox').childNodes;
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].nodeName.toLowerCase() == 'img'){
      nodes[i].style.opacity="0";
      nodes[i].style.transform="translateX(0)";
      nodes[i].style.pointerEvents="none";
    }
  }
  areas.area[currentArea].presentCharacter[0].character=null;
  areas.area[currentArea].presentCharacter[0].img=null;
  localStorage.setItem('savedCharacter',null);
  localStorage.setItem('savedCharacterId',null);
}
function doChangeCharacter(){
  currentCharacter=JSON.parse(localStorage.getItem('savedCharacter'));
  currentCharacterId=JSON.parse(localStorage.getItem('savedCharacterId'));
  character=characters.character[currentCharacter];
  document.getElementById(character.img[currentCharacterId].url).style.opacity="0";
  setTimeout(function(){
    currentCharacter=action.changeCharacter[0].character;
    currentCharacterId=action.changeCharacter[0].img;
    character=characters.character[currentCharacter];
    document.getElementById(character.img[currentCharacterId].url).style.opacity="1";
    localStorage.setItem('savedCharacter',action.changeCharacter[0].character);
    localStorage.setItem('savedCharacterId',action.changeCharacter[0].img);
  },525);
}
function doShowScenery(){
  document.getElementById("blackScreen").style.transition=".5s";
  document.getElementById("blackScreen").style.opacity="1";
  setTimeout(function(){
    document.getElementById("scenery").style.opacity="1";
    vueScenery.url=sceneries.scenery[action.showScenery].url;
  },525);
  setTimeout(function(){
    document.getElementById('blackScreen').style.opacity="0";
  },550);
}
function doHideScenery(){
  document.getElementById("blackScreen").style.transition=".5s";
  document.getElementById("blackScreen").style.opacity="1";
  setTimeout(function(){
    document.getElementById("scenery").style.opacity="0";
  },525);
  setTimeout(function(){
    document.getElementById('blackScreen').style.opacity="0";
  },550);
}
function doChangeArea(selectedArea){
  sfx_footsteps.play();
  hasControl=false;
  document.getElementById('mapWindow').style.left="-100%";
  document.getElementById("blackScreen").style.transition=".5s";
  document.getElementById('blackScreen').style.opacity="1";
  setTimeout(function(){
    doCloseMap();
    doHideCharacter();
    currentArea=areas.area[currentArea].canGoTo[selectedArea].nextArea;
    vueArea.url=areas.area[currentArea].url;
    localStorage.setItem('savedArea',currentArea);
    presentCharacter=areas.area[currentArea].presentCharacter[0].character;
    presentCharacterId=areas.area[currentArea].presentCharacter[0].img;
    if(presentCharacter!=null){
      currentCharacter=presentCharacter;
      currentCharacterId=presentCharacterId;
      character=characters.character[currentCharacter];
      if(character.ghost==true){
        if(maskOpened==true){
          document.getElementById(character.img[currentCharacterId].url).style.pointerEvents="auto";
          document.getElementById(character.img[currentCharacterId].url).style.opacity="1";
        }
        else{
          document.getElementById(character.img[currentCharacterId].url).style.pointerEvents="none";
          document.getElementById(character.img[currentCharacterId].url).style.opacity="0";
        }
      }
      else{
        document.getElementById(character.img[currentCharacterId].url).style.pointerEvents="auto";
        document.getElementById(character.img[currentCharacterId].url).style.opacity="1";
      }
      localStorage.setItem('savedCharacter',currentCharacter);
      localStorage.setItem('savedCharacterId',currentCharacterId);
    }
    else{
      localStorage.setItem('savedCharacter',null);
      localStorage.setItem('savedCharacterId',null);
    }
    doTrigger();
  },1000);
  setTimeout(function(){
    document.getElementById('blackScreen').style.opacity="0";
    hasControl=true;
  },2000);
}
function doAddItem(){
  bag=inventory.bag;
  item=bag.item[currentItem].name;
  icon=bag.item[currentItem].icon;
  document.getElementById('items').innerHTML += "<div id='item"+currentItem+"' onclick=\"selectedItem='"+currentItem+"',doShowDescription()\"><img class='item' src='"+icon+"'/></div>";
  localStorage.setItem(item,true);
}
function doRemoveItem(){
  currentItem=action.removeItem;
  var remove=document.getElementById('item'+currentItem+'');
  remove.parentNode.removeChild(remove);
  localStorage.setItem(item,true);
}
function doPause(){
  document.getElementById("dialogBox").style.opacity="0";
  document.getElementById("buttonBoxLeft").style.left="-100%";
  document.getElementById("buttonBoxRight").style.right="-100%";
  setTimeout(doTalk,action.pause);
}
function doStopTalk(){
  currentDialog=0;
  currentSentence=0;
  document.getElementById("dialog").style.pointerEvents="none";
  document.getElementById("blackScreen02").style.opacity="0";
  document.getElementById("blackScreen03").style.opacity="0";
  document.getElementById("buttonBoxLeft").style.left="-100%";
  document.getElementById("buttonBoxRight").style.right="-100%";
  var nodes=document.getElementById('characterBox').childNodes;
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].nodeName.toLowerCase()=='img'){
      nodes[i].style.transform="translateX(0)";
      nodes[i].style.pointerEvents="none";
    }
  }
  document.getElementById("dialogBox").style.opacity="0";
  document.getElementById("HUD").style.marginTop="0";
  var voice=new Howl({
    src:[characters.character[dialog.who].voice],
    preload:true,
    volume:.1,
    loop:true
  });
  voice.stop();
  setTimeout(function(){
    if(currentCharacter!=null){
      character=characters.character[currentCharacter];
      if(action.hideCharacter==false){
        document.getElementById(character.img[currentCharacterId].url).style.pointerEvents="auto";
      }
    }
  },550);
  setTimeout(function(){
    hasControl=true;
    doTrigger();
  },575);
}

var mapOpened=false;
var bagOpened=false;
var maskOpened=false;
var phoneOpened=false;
function doOpenMap(){
  doCloseBag();
  doClosePhone();
  if(mapOpened==false){
    document.getElementById('mapWindow').innerHTML="";
    document.getElementById('mapWindow').style.left="0";
    for(i=0;i<areas.area[currentArea].canGoTo.length;i++){
      var area=areas.area[areas.area[currentArea].canGoTo[i].nextArea];
      if(area.available==true){
        if(area.locked==false){
          document.getElementById('mapWindow').innerHTML += ""+area.name+"<img id='selectArea' onclick='doChangeArea("+i+")' src='"+area.url+"'/>";
          document.getElementById('mapIcon').innerHTML='<img src="img/opened-map.png"/>';
        }
        else{
          document.getElementById('mapIcon').innerHTML='<img src="img/opened-map.png"/>';
          document.getElementById('mapWindow').innerHTML += ""+area.name+"<img id='selectArea' onclick='sfx_locked_door.play(),currentDialog=0,currentPart="+area.trigger+",setTimeout(function(){doTalk()},2000)' src='"+area.url+"'/>";
        }
      }
    }
    mapOpened=true;
  }
  else{
    doCloseMap();
  }
}
function doCloseMap(){
  document.getElementById('mapWindow').style.left="-100%";
  hasMap=JSON.parse(localStorage.getItem('gotMap'));
  if(hasMap==true){
    document.getElementById('mapIcon').innerHTML='<img src="img/closed-map.png"/>';
  }
  mapOpened=false;
}
function doOpenBag(){
  doCloseMap();
  doClosePhone();
  if(bagOpened==false){
    document.getElementById('description').innerHTML="";
    document.getElementById('bagWindow').style.bottom='0';
    document.getElementById('bagIcon').innerHTML='<img src="img/opened-bag.png"/>';
    bagOpened=true;
  }
  else{
    doCloseBag();
  }
}
function doCloseBag(){
  document.getElementById('bagWindow').style.bottom='-100%';
  hasBag=JSON.parse(localStorage.getItem('gotBag'));
  if(hasBag==true){
    document.getElementById('bagIcon').innerHTML='<img src="img/closed-bag.png"/>';
  }
  bagOpened=false;
}
function doShowDescription(){
  currentItem=selectedItem;
  icon=bag.item[currentItem].icon;
  description=bag.item[currentItem].description;
  document.getElementById('description').innerHTML="<img class='item' src='"+icon+"'/></div><p>"+description+"</p>";
}
function doOpenMask(){
  doCloseMap();
  doCloseBag();
  doClosePhone();
  hasControl=false;
  if(maskOpened==false){
    document.getElementById("blackScreen").style.transition=".15s";
    document.getElementById('blackScreen').style.opacity="1";
    setTimeout(function(){
      document.getElementById('mask').style.opacity="1";
      if(areas.area[currentArea].presentCharacter[0].character!=null){
        character=characters.character[currentCharacter];
        if(characters.character[currentCharacter].ghost==true){
          document.getElementById(character.img[currentCharacterId].url).style.pointerEvents="auto";
          document.getElementById(character.img[currentCharacterId].url).style.opacity="1";
        }
      }
    },175);
    setTimeout(function(){
      document.getElementById('maskIcon').innerHTML='<img src="img/opened-mask.png"/>';
      document.getElementById('blackScreen').style.opacity="0";
    },700);
    hasControl=true;
    maskOpened=true;
  }
  else{
    doCloseMask();
  }
}
function doCloseMask(){
  document.getElementById("blackScreen").style.transition=".15s";
  hasMask=JSON.parse(localStorage.getItem('gotMask'));
  if(hasMask==true){
  }
  document.getElementById('blackScreen').style.opacity="1";
  setTimeout(function(){
    document.getElementById('mask').style.opacity="0";
    if(areas.area[currentArea].presentCharacter[0].character!=null){
      character=characters.character[currentCharacter];
      if(characters.character[currentCharacter].ghost==true){
        document.getElementById(character.img[currentCharacterId].url).style.pointerEvents="none";
        document.getElementById(character.img[currentCharacterId].url).style.opacity="0";
      }
    }
  },175);
  setTimeout(function(){
    document.getElementById('maskIcon').innerHTML='<img src="img/closed-mask.png"/>';
    document.getElementById('blackScreen').style.opacity="0";
  },700);
  hasControl=true;
  maskOpened=false;
}
function doOpenPhone(){
  doCloseMap();
  doCloseBag();
  if(phoneOpened==false){
    document.getElementById('phoneWindow').style.right='1vw';
    document.getElementById('phoneIcon').innerHTML='<img src="img/opened-phone.png"/>';
    phoneOpened=true;
  }
  else{
    doClosePhone();
  }
}
function doClosePhone(){
  document.getElementById('phoneWindow').style.right='-100%';
  hasPhone=JSON.parse(localStorage.getItem('gotPhone'));
  if(hasPhone==true){
    document.getElementById('phoneIcon').innerHTML='<img src="img/closed-phone.png"/>';
}
  phoneOpened=false;
}
function doCloseAll(){
  doCloseMap();
  doCloseBag();
  doClosePhone();
}

function doNextStage(){
  localStorage.setItem('savedStage',action.nextStage);
  if(action.nextStage==1){
    localStorage.setItem('gotMap',true);
    localStorage.setItem('gotBag',true);
    localStorage.setItem('gotMask',true);
    localStorage.setItem('gotPhone',true);
    document.getElementById('mapIcon').style.pointerEvents='auto';
    document.getElementById('bagIcon').style.pointerEvents='auto';
    document.getElementById('maskIcon').style.pointerEvents='auto';
    document.getElementById('phoneIcon').style.pointerEvents='auto';
    document.getElementById('mapIcon').innerHTML='<img src="img/closed-map.png"/>';
    document.getElementById('bagIcon').innerHTML='<img src="img/closed-bag.png"/>';
    document.getElementById('maskIcon').innerHTML='<img src="img/closed-mask.png"/>';
    document.getElementById('phoneIcon').innerHTML='<img src="img/closed-phone.png"/>';
    localStorage.setItem('canContinue',true);
  }
  if(action.nextStage==2){
    areas.area[1].locked=true;
    areas.area[2].locked=true;
  }
  if(action.nextStage==4){
    areas.area[3].presentCharacter[0].character=5;
    areas.area[3].presentCharacter[0].img=0;
    areas.area[3].available=true;
    areas.area[3].locked=false;
    areas.area[9].available=false;
    areas.area[9].locked=true;
  }
  if(action.nextStage==5){
    areas.area[3].presentCharacter[0].img=1;
  }
  if(action.nextStage==6){
    areas.area[3].presentCharacter[0].img=2;
  }
}
function doTrigger(){
  // minimum 1000 for setTimeOut
  if(currentStage==1 && currentArea==1){
    setTimeout(function(){
      sfx_ambient_museum.fade(1,0,1000);
    },2000);
    setTimeout(function(){
      sfx_ambient_museum.stop();
      currentDialog=1;
      currentPart=3;
      doTalk();
    },3000);
  }
  if(currentStage==2 && currentArea==0){
    document.getElementById("scenery").style.opacity="1";
    vueScenery.url=sceneries.scenery[0].url;
  }
  if(currentStage==3 && currentArea==0){
    setTimeout(function(){
      currentDialog=2;
      currentPart=0;
      doTalk();
    },1500);
  }
  if(currentStage==4 && currentArea==3){
    setTimeout(function(){
      currentDialog=3;
      currentPart=0;
      doTalk();
    },2000);
  }
  if(currentStage==7){
    setTimeout(function(){
      doQuit();
    },6000);
  }
}

document.body.addEventListener('keyup', function(e) {
  if(hasControl==true){
    if(document.getElementById("nextButton")!=null){
      if(e.keyCode==69||e.keyCode==39){
        document.getElementById("nextButton").click();
      }
    }
    if(JSON.parse(localStorage.getItem('gotMap'))==true){
      if(e.keyCode==77){
        doOpenMap();
      }
    }
    if(JSON.parse(localStorage.getItem('gotBag'))==true){
      if(e.keyCode==66){
        doOpenBag();
      }
    }
    if(JSON.parse(localStorage.getItem('gotMask'))==true){
      if(e.keyCode==70){
        doOpenMask();
      }
    }
    if(JSON.parse(localStorage.getItem('gotPhone'))==true){
      if(e.keyCode==27){
        doOpenPhone();
      }
    }
    // if(e.keyCode==123){
    //   location.href = 'https://youtu.be/dQw4w9WgXcQ';
    // }
  }
});
