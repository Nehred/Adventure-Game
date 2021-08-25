Vue.component('vhud', {
  template:`
  <div class="vue">
    <div id="icons">
      <div id="mapIcon" onclick="doOpenMap()"></div>
      <div id="bagIcon" onclick="doOpenBag()"></div>
      <div id="maskIcon" onclick="doOpenMask()"></div>
      <div id="phoneIcon" onclick="doOpenPhone()"></div>
    </div>
    <div id="mapWindow"></div>
    <div id="bagWindow">
      <div id="items"></div>
      <div id="description"></div>
    </div>
    <div id="phoneWindow">
      <div id="screen">
        <a onclick="doQuit()">QUIT GAME</a>
      </div>
    </div>
  </div>`
});
Vue.component('vdialog', {
  template:`
  <div class="vue">
    <div id="buttonBoxLeft"></div>
    <div id="dialogBox">
      <div id="dialogName"></div>
      <div id="dialogText">
        <div id="dialogSentence"></div>
        <div id="dialogButtonBox"></div>
      </div>
    </div>
    <div id="buttonBoxRight"></div>
  </div>`
});
Vue.component('vcharacter', {
  template:`
  <div class="vue">
    <div></div>
    <div id="characterBox">
      <img id="tomStageXX" src="img/template.png"/>
      <img id="terrilStageXX" src="img/terril.png"/>
      <img id="djarStageXX" class="float" src="img/djar.png"/>
      <img id="sphinxStageXX" src="img/sphinx.png"/>
      <img id="sphinxStage05" src="img/sphinx.png" onclick="currentDialog=3,currentPart=13,doTalk()"/>
      <img id="sphinxStage06" src="img/sphinx.png" onclick="currentDialog=3,currentPart=26,doTalk()"/>
    </div>
  </div>`
});

var vueHUD = new Vue({
  el: '#HUD'
});
var vueDialog = new Vue({
  el: '#dialog'
});
var vueCharacter = new Vue({
  el: '#character'
});
var vueArea = new Vue({
  el: '#area',
  data: {
    url: '',
  }
});
var vueScenery = new Vue({
  el: '#scenery',
  data: {
    url: '',
  }
});
