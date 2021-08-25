<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'/>
  <link rel="stylesheet" href="css/fontawesome-all.css">
  <link rel="stylesheet" href="css/style.css">
  <title>LE COULOIR DU TEMPS</title>
</head>
<body onload="doLoad()">

  <section id="homeScreen">
    <button id="manual" onclick="sfx_blip_select.play(),doShowManual()">MANUAL</button>
    <img id="manualUrl" src="img/manual.png"/>
    <button id="credits" onclick="sfx_blip_select.play(),doShowCredits()">CREDITS</button>
    <img id="creditsUrl" src="img/credits.png"/>
    <img id="floatMask" class="float" onclick="flash()" src="img/float-mask.png" alt="">
    <div id="flashScreen"></div>
    <img class="flash-img" id="img1" src="img/terril.png">
    <p id="title">LE COULOIR DU TEMPS</p>
    <button id="newGame" onclick="sfx_blip_select.play(),doNewGame()">NEW GAME</button>
    <button id="continue" onclick="sfx_blip_select.play(),doContinue()">CONTINUE</button>
    <p id="copyright">Copyright © <?php echo date("Y");?>. All rights reserved.</p>
  </section>

  <section id="blackScreen"></section>

  <section id="HUD">
    <vhud></vhud>
  </section>

  <section id="dialog">
    <vdialog></vdialog>
  </section>

  <section id="mask"><img src="img/mask.png"></section>

  <section id="scenery" onclick="doCloseAll()">
    <div id="blackScreen02"></div>
    <img :src="url">
  </section>

  <section id="character">
    <vcharacter></vcharacter>
  </section>

  <section id="area" onclick="doCloseAll()">
    <div id="blackScreen03"></div>
    <img :src="url">
  </section>

  <script src="js/libraries/howler.js"></script>
  <script src="js/libraries/typed.js"></script>
  <script src="js/libraries/vue.js"></script>
  <script src="js/vue/components.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
