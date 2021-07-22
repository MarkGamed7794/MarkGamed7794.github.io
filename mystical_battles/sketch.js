var fnt
var assets = {}
var worlds = {}
var moves = {}
var weapons = {}
var armor = {}
var crafting = {}
var dmsel = 0
var cratereward = ""
var quests = {
  quests:[
    {name:"Rev 'Em Up",desc:"Equip the Trailblazer.",goal:1,rewards:{coins:500,crystals:0}},
    {name:"Sneaky Woods",desc:"Complete stage 1-3.",goal:1},
    {name:"The Bell Tolls You",desc:"Complete stage 1-5.",goal:1},
    {name:"Fourever Four",desc:"Reach level 4.",goal:4},
    {name:"Shopping Spree",desc:"Buy any crate from the shop.",goal:1},
    {name:"War Cry",desc:"Defeat a miniboss.",goal:1},
    {name:"Bloody Ogres",desc:"Complete stage 2-2.",goal:1},
    {name:"Puff That Jack Up",desc:"Equip the Pufferfish.",goal:1},
    {name:"Super Troll",desc:"Equip the Troll Sledgehammer.",goal:1},
    {name:"Unlucky Thirteen",desc:"Reach level 13.",goal:13},
    {name:"Movie Director",desc:"Complete stage 2-6.",goal:1},
    {name:"Outside Help",desc:"Redeem a code.",goal:1},
    {name:"Clockwork",desc:"Obtain 5 unique pieces of armor, 5 unique books, and 5 unique weapons.",goal:15},
    {name:"Overdrive",desc:"Obtain 10 unique pieces of armor, 10 unique books, and 10 unique weapons.",goal:30},
    {name:"Pulverize",desc:"Obtain 15 unique pieces or armor, 15 unique books, and 15 unique weapons.",goal:45},
    {name:"Events? Whicked.",desc:"Complete an Event Task.",goal:1},
    {name:"E",desc:"Say E.",goal:1},
    {name:"Splunter And Grind",desc:"Reach level 20.",goal:20},
    {name:"World Domination",desc:"Kill a Scarlet Ogre.",goal:1},
    {name:"Arsonist",desc:"Reach level 30.",goal:30}
  ]
}
var turn = 0 // 0 = player, 1 = enemy
var currentTurn = 1
var xpChange = 1
var attackamount = 1
var selectedStage = 0
var attackeveryone = false
var currentAttacking = 0
var selectedAttack = 0
var selectedTarget = 0
var oneuse = false

var deathmessages = [
  "Yikes!",
  "That had to hurt",
  "Shouldn't have done that.",
  "lol get rekt n00b",
  "Oops.",
  "this is a bruh moment",
  "This isn't very poggers",
  "You didn't win, to say the least",
  "10/10 would watch a death again",
  "Just like any of my\nrelationships, death isn't\npermanent",
  "The creepers WILL steal your stuff again",
  "Maybe try grinding?",
  "anti poggers",
  "https://www.youtube.com/\nwatch?v=kiEahw-p9uA",
  "Bring out the coffin",
  "Killing the enemies is highly\nreccomended",
  "This game was a pain to develop",
  "Run",
  "If you can read this, good\nfor you",
  "Oof",
  "I wouldn't recommend doing\nthat again",
  "Nice death",
  "Cleanup on aisle 5",
  "Sucks to suck!",
  "Imagine dying"
]

var transitiontimer = 60
var transitionto = ""

var crypt

var debugInfo = false // set to true for debug

var screen = "menu"

var levels = [
  {required:0,weapons:[],armor:[],books:[]},
  {required:100,weapons:[],armor:["Leather Armor","Leather Helmet","Leather Leggings","Leather Boots"],books:[],hp:4}, // to level 2
  {required:175,weapons:["Trailblazer"],armor:[],books:[],hp:4}, // to level 3
  {required:275,weapons:[],armor:[],books:[],hp:4},
  {required:450,weapons:[],armor:["Lapis Boots"],books:[],hp:4}, // to level 5
  {required:625,weapons:["Magic Stick"],armor:[],books:[],hp:4},
  {required:800,weapons:[],armor:["Lapis Leggings"],books:[],hp:4},
  {required:1000,weapons:[],armor:["Lapis Armor"],books:[],hp:4},
  {required:1250,weapons:["Basic Bow"],armor:[],books:[],hp:4},
  {required:1500,weapons:["Flaming Pulsar"],armor:[],books:[],hp:4}, // to level 10
  {required:1750,weapons:[],armor:[],books:[],hp:8},
  {required:2000,weapons:["Spider Dagger"],armor:[],books:[],hp:8},
  {required:2300,weapons:[],armor:["Jumping Boots"],books:[],hp:8},
  {required:2600,weapons:["Dagger"],armor:[],books:[],hp:8},
  {required:2900,weapons:["Rogue's Bow"],armor:[],books:[],hp:8},
  {required:3200,weapons:[],armor:[],books:[],hp:8},
  {required:3600,weapons:[],armor:[],books:[],hp:8},
  {required:4000,weapons:[],armor:[],books:[],hp:8},
  {required:4400,weapons:[],armor:[],books:[],hp:8},
  {required:4800,weapons:[],armor:[],books:[],hp:8}, // to level 20
  {required:5200,weapons:[],armor:[],books:[],hp:14},
  {required:5600,weapons:[],armor:[],books:[],hp:14},
  {required:6200,weapons:[],armor:[],books:[],hp:14},
  {required:6800,weapons:[],armor:[],books:[],hp:14},
  {required:7400,weapons:[],armor:[],books:[],hp:14},
  {required:8000,weapons:[],armor:[],books:[],hp:14},
  {required:9800,weapons:[],armor:[],books:[],hp:14},
  {required:10600,weapons:[],armor:[],books:[],hp:14},
  {required:11400,weapons:[],armor:[],books:[],hp:14},
  {required:12500,weapons:[],armor:[],books:[],hp:14} // to level 30
]
var currentEnemies = []
var damagenumbers = []
var chanceitems = {}
var chancematerials = {}
var chancearmor = {}
var player = {
  hp:20,
  maxhp:20,
  xp:0,
  nxp:250,
  level:0,
  armorbonus:0,
  weapon:"Stick",
  armor:["","","",""],
  inventory:{
    items:{},
    weapons:{},
    armor:{},
    books:{}
  },
  coins:0,
  crystals:0,
  poison:0,
  sleep:0,
  weakness:0,
  clears:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
}

var encryptkey
var currentStage = 0;
var currentWave = 0;
var xpToGive = 0;
var enemyUsed = ""
var currentlyAttacking = 0
var animation = ""
var animationTimer = 0
var enemyAttackTimer = 0;
var damagemultiplier = 1;
var sv
var ld
var sdata
var shop

function loadAssets(){
  fnt = loadFont("PressStart2P.ttf")
  assets.astro = loadImage("assets/astro.png")
  worlds = loadJSON("worlds.json")
  moves = loadJSON("moves.json")
  weapons = loadJSON("weapons.json")
  armor = loadJSON("armor.json")
  crafting = loadJSON("crafting.json")
  shop = loadJSON("shop.json")
}

function preload(){
  loadAssets() 
}

function setup() {
  createCanvas(768, 720);
  angleMode(DEGREES)
  loadStage(0)
  
  //xpChange = xpToGive/180
  
  sv = createButton("Export").mousePressed(function(){
    sdata.value(
      encryptkey + " " + CryptoJS.AES.encrypt(JSON.stringify(player), encryptkey)
    )
  })
  ld = createButton("Import").mousePressed(function(){
    if(screen == "map"){
      player = JSON.parse(
        CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(sdata.value().split(" ")[1],
                                                         sdata.value().split(" ")[0])
      ))
    }
  })
  createElement("br")
  sdata = createElement("textarea","Click \"Export\" to export save data to this textbox, click \"Import\" to load the data in this textbox").size(400,100)
}

function prepTransition(to){
  transitionto = to
  transitiontimer = 0
}

function calcQuestProgress(name){
  switch(name){
    case "Rev 'Em Up":
      return player.weapon == "Trailblazer" ? 1 : 0
    case "Sneaky Woods":
      return player.clears[2]
    case "The Bell Tolls You":
      return player.clears[4]
    case "Fourever Four":
      return player.level+1
    case "Shopping Spree":
      return 0 // todo
    case "War Cry":
      return 0 // todo
    case "Bloody Ogres":
      return player.clears[7]
    case "Puff That Jack Up":
      return player.weapon == "Pufferfish" ? 1 : 0
    case "Sledge and go Ham":
      return player.weapon == "Sledgehammer" ? 1 : 0
    case "Unlucky Thirteen":
      return player.level+1
    case "Clockwork":
      var a = [0,0,0]
      for(var q in player.inventory.books){
        if(player.inventory.books[q] > 0){
          if(a[0] < 5){a[0]++}
        }
      }
      for(var q in player.inventory.armor){
        if(player.inventory.armor[q] > 0){
          if(a[1] < 5){a[1]++}
        }
      }
      for(var q in player.inventory.weapons){
        if(player.inventory.weapons[q] > 0){
          if(a[2] < 5){a[2]++}
        }
      }
      return min(a[0],5) + min(a[1],5) + min(a[2],5)
    case "Overdrive":
      var a = [0,0,0]
      for(var q in player.inventory.books){
        if(player.inventory.books[q] > 0){
          if(a[0] < 10){a[0]++}
        }
      }
      for(var q in player.inventory.armor){
        if(player.inventory.armor[q] > 0){
          if(a[1] < 10){a[1]++}
        }
      }
      for(var q in player.inventory.weapons){
        if(player.inventory.weapons[q] > 0){
          if(a[2] < 10){a[2]++}
        }
      }
      return min(a[0],10) + min(a[1],10) + min(a[2],10)
    case "Pulverize":
      var a = [0,0,0]
      for(var q in player.inventory.books){
        if(player.inventory.books[q] > 0){
          if(a[0] < 15){a[0]++}
        }
      }
      for(var q in player.inventory.armor){
        if(player.inventory.armor[q] > 0){
          if(a[1] < 15){a[1]++}
        }
      }
      for(var q in player.inventory.weapons){
        if(player.inventory.weapons[q] > 0){
          if(a[2] < 15){a[2]++}
        }
      }
      return min(a[0],15) + min(a[1],15) + min(a[2],15)
    default:
      return 0
  }
}

function loadStage(stage,wave=0){
  currentStage = stage
  currentWave = wave
  currentTurn = 0
  switchTurn(0)
  animation = ""
  currentEnemies = worlds.stages[stage].waves[currentWave].enemies
  for(var i = 0;i < currentEnemies.length;i++){
    currentEnemies[i].hp = currentEnemies[i].maxhp
    currentEnemies[i].sleep = 0
    currentEnemies[i].shield = 0
    currentEnemies[i].strength = 0
    currentEnemies[i].protect = 0
  }
  if(wave == 0){
    damagenumbers = []
    oneuse = false
  }
}

function calcArmorBonus(){
  return (armor[player.armor[0]] || {def:0}).def + (armor[player.armor[1]] || {def:0}).def + (armor[player.armor[2]] || {def:0}).def + (armor[player.armor[3]] || {def:0}).def
}

function switchTurn(n){
  if(n == 0){
    if(player.hp < 1){
      animation = "death"
      animationTimer = 0
      currentTurn++
    }else if(player.sleep > 1){
      player.sleep--
      switchTurn(1)
    }else{
      turn = 0
      currentTurn++
      damagemultiplier = 1
      attackamount = 1
      attackeveryone = false
      checkPassive("turn")
      currentAttacking = 0

      if(player.poison > 0){
        player.hp -= player.poison
        damagenumbers.push(
        {value:-player.poison,x:80+random(-50,50),y:360+random(-50,50),opacity:500,color:color(127,0,255)}
          )
      }
    }
  }
  if(n == 1){
    enemyUsed = ""
    checkPassive("attack")
    turn = 1
    damagemultiplier = 1
    attackamount = 1
    enemyAttackTimer = 0
    for(var q = 0;q < currentEnemies.length;q++){
      currentEnemies[q].protect = 0
      currentEnemies[q].fury = 0
    }
  }
}

function getLevelName(stage,specific=""){
  if(specific == "number") return worlds.stages[stage].world + "-" + worlds.stages[stage].stage
  if(specific == "name") return worlds.stages[stage].name
  return worlds.stages[stage].world + "-" + worlds.stages[stage].stage + ": " + worlds.stages[stage].name
}

function attack(damage,target=selectedTarget,mul=damagemultiplier){
  for(var q = 0;q < attackamount;q++){
    if(target == -1 || attackeveryone){
      for(var x = 0;x < currentEnemies.length;x++){
        if(currentEnemies[x].shield > 0){
          currentEnemies[x].shield -= damage*mul*damagemultiplier-currentEnemies[x].protect
          damagenumbers.push(
          {value:-damage*mul*damagemultiplier+currentEnemies[x].protect,
            x:680+random(-50,50),
            y:(360-(currentEnemies.length-1)*80)+x*160+random(-50,50),
            opacity:500,color:color(0,75,255)}
        )
        }else{
          currentEnemies[x].hp -= max(damage*mul*damagemultiplier-currentEnemies[x].protect,0)
          damagenumbers.push(
          {value:-max(damage*mul*damagemultiplier-currentEnemies[x].protect,0),
            x:680+random(-50,50),
            y:(360-(currentEnemies.length-1)*80)+x*160+random(-50,50),
            opacity:500}
            )
        }
      }
    }else{
        if(currentEnemies[target].shield > 0){
        currentEnemies[target].shield -= damage*mul*damagemultiplier-currentEnemies[target].protect
          damagenumbers.push(
          {value:-damage*mul*damagemultiplier-currentEnemies[target].protect,
            x:680+random(-50,50),
            y:(360-(currentEnemies.length-1)*80)+target*160+random(-50,50),
            opacity:500,color:color(0,75,255)}
        )
        }else{
          currentEnemies[target].hp -= damage*mul*damagemultiplier-currentEnemies[target].protect
          damagenumbers.push(
          {value:-damage*mul*damagemultiplier+currentEnemies[target].protect,
            x:680+random(-50,50),
            y:(360-(currentEnemies.length-1)*80)+target*160+random(-50,50),
            opacity:500}
            )
        }
    }
  }
}

function attacknomod(damage,mul){
  for(var q = 0;q < attackamount;q++){
    if(target == -1 || attackeveryone){
      for(var x = 0;x < currentEnemies.length;x++){
        if(currentEnemies[x].shield > 0){
          currentEnemies[x].shield -= damage*mul
          damagenumbers.push(
          {value:-damage*mul,
            x:680+random(-50,50),
            y:(360-(currentEnemies.length-1)*80)+x*160+random(-50,50),
            opacity:500,color:color(0,75,255)}
        )
        }else{
          currentEnemies[x].hp -= damage*mul
          damagenumbers.push(
          {value:-damage*mul,
            x:680+random(-50,50),
            y:(360-(currentEnemies.length-1)*80)+x*160+random(-50,50),
            opacity:500}
            )
        }
      }
    }else{
        if(currentEnemies[target].shield > 0){
        currentEnemies[target].shield -= damage*mul
          damagenumbers.push(
          {value:-damage*mul,
            x:680+random(-50,50),
            y:(360-(currentEnemies.length-1)*80)+target*160+random(-50,50),
            opacity:500,color:color(0,75,255)}
        )
        }else{
          currentEnemies[target].hp -= damage*mul
          damagenumbers.push(
          {value:-damage*mul,
            x:680+random(-50,50),
            y:(360-(currentEnemies.length-1)*80)+target*160+random(-50,50),
            opacity:500}
            )
        }
    }
  }
}

function gg(){
  // congrats
  if(currentWave+1 < worlds.stages[currentStage].waves.length){
    currentWave++
    loadStage(currentStage,currentWave)
  }else{
    animation = "congrats" 
  }
}

// enemy functions
function attackplayer(damage){
  player.hp -= round(((damage+currentEnemies[currentAttacking].strength)*(currentEnemies[currentAttacking].fury+1))*(player.weakness+1))
  damagenumbers.push({value:-round(((damage+currentEnemies[currentAttacking].strength)*(currentEnemies[currentAttacking].fury+1)*(player.weakness+1))),x:80+random(-50,50),y:360+random(-50,50),opacity:500})
}

function destroySelf(){
  damagenumbers.push(
    {value:-currentEnemies[currentAttacking].hp,x:680+random(-50,50),y:(360-(currentEnemies.length-1)*80)+currentAttacking*160+random(-50,50),opacity:500}
  )
  currentEnemies[currentAttacking].hp = 0
}

function attackself(damage){
  damagenumbers.push(
    {value:-damage,x:680+random(-50,50),y:(360-(currentEnemies.length-1)*80)+currentAttacking*160+random(-50,50),opacity:500}
  )
  currentEnemies[currentAttacking].hp -= damage
}

function attackall(damage){
  attackplayer(damage)
  for(var x = 0;x < currentEnemies.length;x++){
     attack(damage,x,1)
  }
}

function sleepself(amount){
  currentEnemies[currentAttacking].sleep += amount
}

function poisonplayer(amount){
  player.poison += amount
}

function checkPassive(type="turn"){
  for(var x = 0;x < weapons[player.weapon].moves.length;x++){
    if(weapons[player.weapon].moves[x].passive){
      if(weapons[player.weapon].moves[x].passive == type){
        eval(weapons[player.weapon].moves[x].onUse)
      }
    }
  }
}

function isEveryoneDead(){
  var winbool = true
  for(var i = 0;i < currentEnemies.length;i++){
    if(currentEnemies[i].hp > 0){
      winbool = false
    }
  }
  return winbool
}

// ------------------------- BATTLE SCENE -------------------------

function drawBattleScene(){
  textSize(24)
  textAlign(LEFT,TOP)
  fill(255)
  stroke(0)
  strokeWeight(6)
  text(getLevelName(currentStage) + "\nWave " + (currentWave+1) + "/" + worlds.stages[currentStage].waves.length + ", Turn " + (currentTurn),20,20)
  
  // the enemy used...
  textAlign(LEFT,BOTTOM)
  textSize(12)
  strokeWeight(3)
  text(enemyUsed.substring(0,min(floor(enemyAttackTimer/2),enemyUsed.length)),20,700)
  textAlign(LEFT,TOP)
  // draw player
  strokeWeight(3)
  textSize(12)
  rect(20,300,120,120)
  rect(20,440,200,20)
  rect(20,460,200,20)
  
  fill(255,0,0)
  rect(20,440,200*player.hp/(player.maxhp+player.armorbonus),20)
  if((player.armorbonus-(player.maxhp+player.armorbonus-player.hp))/(player.maxhp+player.armorbonus) > 0){
    fill(0,127,255)
       rect(20+200*(player.maxhp/(player.maxhp+player.armorbonus)),
         440,
         200*((player.armorbonus-(player.maxhp+player.armorbonus-player.hp))/(player.maxhp+player.armorbonus)),
         20)}
  fill(0,127,255)
  rect(20,460,200*player.xp/floor(pow(player.level+1,1.6)*30+70),20)
  fill(255)
  strokeWeight(3)
  text(player.hp + "/" + (player.maxhp+player.armorbonus) + " HP",29,445)
  text(round(player.xp) + "/" + floor(pow(player.level+1,1.6)*30+70) + " XP",29,465)
  text("Level " + (player.level+1),29,485)
  var ty = 400
  if(player.poison > 0){
    fill(127,0,255)
    text("Poison " + player.poison,29,ty)
    ty -= 32
  }
  if(player.sleep > 0){
    fill(127,0,255)
    text("Sleep " + player.sleep,29,ty)
    ty -= 32
  }
  if(player.weakness > 0){
    fill(127,0,255)
    text("Weakness " + (player.weakness*100) + "%",29,ty)
    ty -= 32
  }
  fill(255)
  
  // draw enemies
  for(var i = 0;i < currentEnemies.length;i++){
    strokeWeight(3)
    textSize(12)
    rect(620,(300-(currentEnemies.length-1)*80)+i*160,120,120)
    rect(540,(430-(currentEnemies.length-1)*80)+i*160,200,20)
    fill(255,0,0)
    rect(540,(430-(currentEnemies.length-1)*80)+i*160,200*currentEnemies[i].hp/currentEnemies[i].maxhp,20)
    fill(255)
    strokeWeight(3)
    text(currentEnemies[i].hp + "/" + currentEnemies[i].maxhp + " HP",549,(435-(currentEnemies.length-1)*80)+i*160)
    text(currentEnemies[i].name,620,(300-(currentEnemies.length-1)*80)+i*160)
    var ty = (400-(currentEnemies.length-1)*80)+i*160
    if(currentEnemies[i].sleep > 0){
      fill(127,0,255)
      text("Sleep " + currentEnemies[i].sleep,620,ty)
      ty -= 16
    }
    if(currentEnemies[i].shield > 0){
      fill(0,75,255)
      text("Shield " + currentEnemies[i].shield,620,ty)
      ty -= 16
    }
    if(currentEnemies[i].strength > 0){
      fill(255,75,75)
      text("Strength " + currentEnemies[i].strength,620,ty)
      ty -= 16
    }
    if(currentEnemies[i].protect > 0){
      fill(200,55,0)
      text("Armor " + currentEnemies[i].protect,620,ty)
      ty -= 16
    }
    if(currentEnemies[i].fury > 0){
      fill(255,0,0)
      text("Fury " + currentEnemies[i].fury,620,ty)
      ty -= 16
    }
    fill(255)
  }
  
  // damage numbers
  textAlign(CENTER)
  for(var i = 0;i < damagenumbers.length;i++){
    damagenumbers[i].y -= damagenumbers[i].opacity/100;
    damagenumbers[i].opacity -= 12;
    textSize(24)
    noStroke()
    fill(40)
    text((damagenumbers[i].value > 0 ? "+" : "") + damagenumbers[i].value,
         damagenumbers[i].x+3,damagenumbers[i].y+3)
    fill(damagenumbers[i].color || color(255,0,0))
    text((damagenumbers[i].value > 0 ? "+" : "") + damagenumbers[i].value,damagenumbers[i].x,damagenumbers[i].y)
    
    if(damagenumbers[i].opacity < -512){damagenumbers.splice(i,1);i--}
  }
  
  // moves
  strokeWeight(3)
  stroke(0)
  fill(255)
  textSize(12)
  textAlign(LEFT)
  if(turn == 0){
    for(var i = 0;i < weapons[player.weapon].moves.length+1;i++){
      if(i == 0){
        rect(20,500+i*30,20+textWidth("Attack (-" + weapons[player.weapon].damage + ")"),30)
        text("Attack (-" + weapons[player.weapon].damage + ")",30,510+i*30)
      }else{
        fill(255)
        if(weapons[player.weapon].moves[i-1].passive || (weapons[player.weapon].moves[i-1].oneuse && oneuse)){
          fill(175) 
        }
        rect(20,500+i*30,20+textWidth(weapons[player.weapon].moves[i-1].name + " (" + weapons[player.weapon].moves[i-1].damageShown + ")"),30)
        text(weapons[player.weapon].moves[i-1].name + " (" + weapons[player.weapon].moves[i-1].damageShown + ")",30,510+i*30)
      }
    }
  }
  
  // enemy attack
  if(enemyAttackTimer >= 90 && random() < 0.04 && turn == 1 && animation == ""){
    if(currentEnemies[currentAttacking].hp > 0 && currentEnemies[currentAttacking].sleep == 0){
      var selectedMove = currentEnemies[currentAttacking]
      .moves[floor(random(currentEnemies[i].moves.length))]
      if(enemyUsed.length > 1){enemyUsed += "\n"}
      enemyUsed += currentEnemies[currentAttacking].name + " used " + selectedMove + "!"
      eval(moves[selectedMove]); // I'm sorry.
    }
    if(currentEnemies[currentAttacking].sleep > 0){currentEnemies[currentAttacking].sleep -= 1}
    currentAttacking++
    if(currentAttacking >= currentEnemies.length){
      switchTurn(0)
    }
    enemyAttackTimer = 0
  }
  
  // update enemy attack timer
  if(turn == 0){
    enemyAttackTimer++
  }else{
    enemyAttackTimer++ 
  }
  
  // check if everyone's dead
  var winbool = true
  for(var i = 0;i < currentEnemies.length;i++){
    if(currentEnemies[i].hp > 0){
      winbool = false
    }
  }
  if(winbool && animation == ""){
    // gg
    gg()
  }
}

// ------------------------- DRAW ANIMATIONS -------------------------

function drawAnimation(){
  if(animation == "levelup"){
    // level up (no kidding)
    noStroke()
    fill(0,0,0,150)
    rect(0,0,width,height)
    stroke(0)
    textSize(48)
    textAlign(CENTER,TOP)
    strokeWeight(12)
    fill(255,255,100)
    text("LEVEL UP!".substring(0,min(animationTimer/3,9)),width/2,100)
    if(animationTimer > 60){
      textSize(96)
      strokeWeight(24)
      text((player.level + " > " + (player.level+1)).substring(0,min(floor(animationTimer-60)/3,9)),width/2,200)
    }
    if(animationTimer > 180){
      textSize(24)
      strokeWeight(6)
      text("Rewards:\n" + levels[player.level].weapons.join("\n") + levels[player.level].armor.join("\n") + "\n" ,width/2,350)
    }
  }else if(animation == "congrats"){
    noStroke()
    fill(0,0,0,min(150,animationTimer*2))
    rect(0,0,width,height)
    stroke(0)
    textSize(48)
    textAlign(CENTER,TOP)
    strokeWeight(12)
    fill(255,255,100)
    if(animationTimer > 60){
      textSize(72)
      strokeWeight(18)
      text("VICTORY!".substring(0,min(floor(animationTimer)/3,9)),width/2,200)
    }
    if(animationTimer == 120){
      chanceitems = {}
      chancearmor = {}
      if(player.clears[currentStage] == 0){
        for(var ky in worlds.stages[currentStage].firstrewards.weapons){
          if(random() < worlds.stages[currentStage].firstrewards.weapons[ky]){
            if(!chanceitems.hasOwnProperty(ky)){chanceitems[ky] = 0}
            chanceitems[ky] += 1
          }
        }
        for(var ky in worlds.stages[currentStage].firstrewards.armor){
          if(random() < worlds.stages[currentStage].firstrewards.armor[ky]){
            if(!chancearmor.hasOwnProperty(ky)){chancearmor[ky] = 0}
            chancearmor[ky] += 1
          }
        }
        for(var ky in worlds.stages[currentStage].firstrewards.chanceitems){
          if(random() < worlds.stages[currentStage].firstrewards.chanceitems[ky]){
            if(!chancematerials.hasOwnProperty(ky)){chancematerials[ky] = 0}
            chancematerials[ky] += 1
          }
        }
      }else{
        for(var ky in worlds.stages[currentStage].rewards.weapons){
          if(random() < worlds.stages[currentStage].rewards.weapons[ky]){
            if(!chanceitems.hasOwnProperty(ky)){chanceitems[ky] = 0}
            chanceitems[ky] += 1
          }
        }
        for(var ky in worlds.stages[currentStage].rewards.armor){
          if(random() < worlds.stages[currentStage].rewards.armor[ky]){
            if(!chancearmor.hasOwnProperty(ky)){chancearmor[ky] = 0}
            chancearmor[ky] += 1
          }
        }
        for(var ky in worlds.stages[currentStage].rewards.chanceitems){
          if(random() < worlds.stages[currentStage].rewards.chanceitems[ky]){
            if(!chancematerials.hasOwnProperty(ky)){chancematerials[ky] = 0}
            chancematerials[ky] += 1
          }
        }
      }
    }
    if(animationTimer > 120){
      textSize(24)
      strokeWeight(6)
      var rewardsString = ""
      if(player.clears[currentStage] == 0){
        for(var ky in worlds.stages[currentStage].firstrewards.items){
          if(rewardsString.length > 1){rewardsString += "\n"}
          rewardsString += worlds.stages[currentStage].firstrewards.items[ky] + " " + ky
        }
        for(var ky in chanceitems){
          if(rewardsString.length > 1){rewardsString += "\n"}
          rewardsString += ky + " x" + chanceitems[ky]
        }
        rewardsString += "\n\nClick anywhere to continue"
        text("Rewards:\n" +
           worlds.stages[currentStage].firstrewards.xp + " XP\n" +
           worlds.stages[currentStage].firstrewards.coins + " coins\n" +
           rewardsString,width/2,350)
      }else{
        for(var ky in worlds.stages[currentStage].rewards.items){
          if(rewardsString.length > 1){rewardsString += "\n"}
          rewardsString += worlds.stages[currentStage].rewards.items[ky] + " " + ky
        }
        for(var ky in chanceitems){
          if(rewardsString.length > 1){rewardsString += "\n"}
          rewardsString += ky + " x" + chanceitems[ky]
        }
        rewardsString += "\n\nClick anywhere to continue"
        text("Rewards:\n" +
           worlds.stages[currentStage].rewards.xp + " XP\n" +
           worlds.stages[currentStage].rewards.coins + " coins\n" +
           rewardsString,width/2,350)
      }
    }
  }else if(animation == "death"){
    noStroke()
    fill(0,0,0,min(150,animationTimer*2))
    rect(0,0,width,height)
    stroke(0)
    textSize(48)
    textAlign(CENTER,TOP)
    strokeWeight(12)
    fill(255,255,100)
    if(animationTimer == 0){
      dmselect = deathmessages[floor(random(deathmessages.length))]
    }
    if(animationTimer > 60){
      textSize(24)
      strokeWeight(6)
      text(dmselect,width/2,200)
    }
    if(animationTimer > 120){
      textSize(24)
      strokeWeight(6)
      text("Click anywhere to continue",width/2,400)
    }
  }else if(animation == "crate"){
    noStroke()
    fill(0,0,0,min(150,animationTimer*4))
    rect(0,0,width,height)
    stroke(0)
    textSize(48)
    textAlign(CENTER,TOP)
    strokeWeight(12)
    fill(255,255,100)
    if(animationTimer > 60){
      textSize(24)
      strokeWeight(6)
      text("Reward:\n" + cratereward,width/2-300,300,600)
    }
  }
  if(animation == "targeting"){
    fill(0,0,0,150)
    noStroke()
    rect(0,100,width,60)
    textSize(24)
    stroke(0)
    fill(255)
    strokeWeight(6)
    text("Select a target.",20,120)
  }
}
// ----------------------------  DRAW LOOP ----------------------------

function draw() {
  textFont(fnt)
  try {
  encryptkey = floor(random(999999999999)).toString(36)
  if(screen == "fight"){
    background(0,200,0);
    drawBattleScene()
  }
  if(screen == "map"){
    // the map isn't very labor-intensive, so it's going here
    player.armorbonus = calcArmorBonus()
    player.hp = round((player.maxhp+player.armorbonus))
    player.poison = 0
    background(0,200,0)
    fill(255)
    stroke(0)
    strokeWeight(12)
    textSize(48)
    textAlign(CENTER,TOP)
    text("Select a stage",width/2,50)
    textAlign(CENTER,CENTER)
    text("<             >",width/2,height/2)
    strokeWeight(6)
    textSize(24)
    text(getLevelName(selectedStage,"number") + "\n" + getLevelName(selectedStage,"name") + "\nCleared " + player.clears[selectedStage] + " time" + (player.clears[selectedStage] == 1 ? "" : "s"),width/2,height/2)
    textAlign(LEFT,TOP)
    fill(255)
    rect(-3,150,300,40)
    rect(width-297,150,300,40)
    fill(255,0,0)
    rect(-3,150,
         300*(player.hp/(player.maxhp+player.armorbonus)),
         40)
    fill(0,127,255)
    if((player.armorbonus-(player.maxhp+player.armorbonus-player.hp))/(player.maxhp+player.armorbonus) > 0){
       rect(-3+300*(player.maxhp/(player.maxhp+player.armorbonus)),
         150,
         300*((player.armorbonus-(player.maxhp+player.armorbonus-player.hp))/(player.maxhp+player.armorbonus)),
         40)}
    fill(0,127,255)
    rect(width-297,150,300*player.xp/floor(pow(player.level+1,1.6)*30+70),40)
    fill(255)
    text((player.hp) + "/" + (player.maxhp+player.armorbonus) + " HP",7,160)
    text(floor(player.xp) + "/" + floor(pow(player.level+1,1.6)*30+70) + " XP",width-287,160)
    fill(255,255,150)
    text("$" + player.coins,7,200)
    fill(0,200,255)
    text("♦" + player.crystals,7,230)
    fill(255)
    text("Level " + (player.level+1),width-287,200)
    rect(-10,height-50,width-140,60)
    rect(width-150,height-50,400,60)
    textAlign(CENTER,TOP)
    text("Inventory",(width-150)/2,height-35)
    text("Menu",width-72,height-35)
  }
  if(screen == "inventory.items"){
    background(0,200,0)
    fill(0,0,0,150)
    noStroke()
    rect(width-320,0,320,height)
    stroke(0)
    strokeWeight(3)
    fill(255)
    rect(width-310,10,300,40)
    strokeWeight(6)
    textSize(24)
    textAlign(LEFT,TOP)
    text("Items",width-300,20)
    
    var counter = 0
    for(var k in player.inventory.items){
      strokeWeight(3)
      textSize(12)
      rect(22+(counter%3)*140,20+floor(counter/3)*140,120,120)
      text(k,22+(counter%3)*140,20+floor(counter/3)*140)
      textSize(24)
      strokeWeight(6)
      text("x" + player.inventory.items[k],32+(counter%3)*140,110+floor(counter/3)*140)
      counter++
    }
    rect(-20,height-50,width+40,60)
    textAlign(CENTER,TOP)
    text("Return To Map",width/2,height-35)
    textAlign(LEFT,TOP)
    text("Equipped",width-300,100)
    text("+" + calcArmorBonus() + " HP total",width-300,430)
    textSize(12)
    strokeWeight(3)
    text("(Click to unequip)",width-300,130)

    rect(width-300,150,120,120) // helm
    text(player.armor[0],width-300,150,120)
    rect(width-160,150,120,120) // chest
    text(player.armor[1],width-160,150,120)
    rect(width-300,290,120,120) // leg
    text(player.armor[2],width-300,290,120)
    rect(width-160,290,120,120) // boot
    text(player.armor[3],width-160,290,120)
    
    
    rect(width-230,480,120,120) // weapon
    text(player.weapon,width-230,480,120)
    textAlign(CENTER)
    for(var i = 0;i < damagenumbers.length;i++){
    damagenumbers[i].y -= damagenumbers[i].opacity/100;
    damagenumbers[i].opacity -= 12;
    textSize(24)
    noStroke()
    fill(40)
    text((damagenumbers[i].value > 0 ? "+" : "") + damagenumbers[i].value,
         damagenumbers[i].x+3,damagenumbers[i].y+3)
    fill(255,0,0)
    text((damagenumbers[i].value > 0 ? "+" : "") + damagenumbers[i].value,damagenumbers[i].x,damagenumbers[i].y)
      
    if(damagenumbers[i].opacity < -512){damagenumbers.splice(i,1);i--}
  }
  }
  if(screen == "inventory.weapons"){
    background(0,200,0)
    fill(0,0,0,150)
    noStroke()
    rect(width-320,0,320,height)
    stroke(0)
    strokeWeight(3)
    fill(255)
    rect(width-310,10,300,40)
    strokeWeight(6)
    textSize(24)
    textAlign(LEFT,TOP)
    text("Weapons",width-300,20)
    var counter = 0
    for(var k in player.inventory.weapons){
      if(player.inventory.weapons[k] > 0){
        strokeWeight(3)
        textSize(12)
        rect(22+(counter%3)*140,20+floor(counter/3)*140,120,120)
        text(k,22+(counter%3)*140,20+floor(counter/3)*140,120)
        textSize(24)
        strokeWeight(6)
        text("x" + player.inventory.weapons[k],32+(counter%3)*140,110+floor(counter/3)*140)
      }
      if(player.inventory.weapons[k] > 0){counter++}
    }
    textSize(24)
    strokeWeight(6)
    rect(-20,height-50,width+40,60)
    textAlign(CENTER,TOP)
    text("Return To Map",width/2,height-35)
    
    textAlign(LEFT,TOP)
    text("Equipped",width-300,100)
    text("+" + calcArmorBonus() + " HP total",width-300,430)
    textSize(12)
    strokeWeight(3)
    text("(Click to unequip)",width-300,130)
    
    rect(width-300,150,120,120) // helm
    text(player.armor[0],width-300,150,120)
    rect(width-160,150,120,120) // chest
    text(player.armor[1],width-160,150,120)
    rect(width-300,290,120,120) // leg
    text(player.armor[2],width-300,290,120)
    rect(width-160,290,120,120) // boot
    text(player.armor[3],width-160,290,120)
    counter = 0
    for(var k in player.inventory.weapons){
      if(player.inventory.weapons[k] > 0){
        if(mouseX > 22+(counter%3)*140 && mouseY > 20+floor(counter/3)*140 && mouseX < 142+(counter%3)*140 && mouseY < 140+floor(counter/3)*140){
          // tooltip
          textSize(12)
          strokeWeight(3)
          fill(0,0,0,150)
          rect(mouseX,mouseY,20+(
            weapons[k].moves.map((x) => 
            (textWidth(x.name + " (" + x.damageShown + ")\n"))).reduce((a,b) => max(a,b))),44+(12*weapons[k].moves.length))
          fill(255)
          textAlign(LEFT,TOP)
          text("Level " + weapons[k].level + "\n" + weapons[k].damage + " damage\n" +
               weapons[k].moves.map((x) => (x.name + " (" + x.damageShown + ")\n")),10+mouseX,10+mouseY)
        }
      }
      if(player.inventory.weapons[k] > 0){counter++}
    }
    
    rect(width-230,480,120,120) // weapon
    text(player.weapon,width-230,480,120)
    textAlign(CENTER)
    for(var i = 0;i < damagenumbers.length;i++){
    damagenumbers[i].y -= damagenumbers[i].opacity/100;
    damagenumbers[i].opacity -= 12;
    textSize(24)
    noStroke()
    fill(40)
    text((damagenumbers[i].value > 0 ? "+" : "") + damagenumbers[i].value,
         damagenumbers[i].x+3,damagenumbers[i].y+3)
    fill(255,0,0)
    text((damagenumbers[i].value > 0 ? "+" : "") + damagenumbers[i].value,damagenumbers[i].x,damagenumbers[i].y)
    
    if(damagenumbers[i].opacity < -512){damagenumbers.splice(i,1);i--}
  }
  }
  if(screen == "inventory.armor"){
    background(0,200,0)
    fill(0,0,0,150)
    noStroke()
    rect(width-320,0,320,height)
    stroke(0)
    strokeWeight(3)
    fill(255)
    rect(width-310,10,300,40)
    strokeWeight(6)
    textSize(24)
    textAlign(LEFT,TOP)
    text("Armor",width-300,20)
    var counter = 0
    for(var k in player.inventory.armor){
      if(player.inventory.armor[k] > 0){
        fill(255)
        strokeWeight(3)
        textSize(12)
        rect(22+(counter%3)*140,20+floor(counter/3)*140,120,120)
        text(k,22+(counter%3)*140,20+floor(counter/3)*140,140)
        textSize(24)
        strokeWeight(6)
        text("x" + player.inventory.armor[k],32+(counter%3)*140,110+floor(counter/3)*140)
        textSize(12)
        strokeWeight(3)
      }
      if(player.inventory.armor[k] > 0){counter++}
    }
    fill(255)
    textSize(24)
    strokeWeight(6)
    rect(-20,height-50,width+40,60)
    textAlign(CENTER,TOP)
    text("Return To Map",width/2,height-35)
    
    textAlign(LEFT,TOP)
    text("Equipped",width-300,100)
    text("+" + calcArmorBonus() + " HP total",width-300,430)
    textSize(12)
    strokeWeight(3)
    text("(Click to unequip)",width-300,130)

    rect(width-300,150,120,120) // helm
    text(player.armor[0],width-300,150,120)
    rect(width-160,150,120,120) // chest
    text(player.armor[1],width-160,150,120)
    rect(width-300,290,120,120) // leg
    text(player.armor[2],width-300,290,120)
    rect(width-160,290,120,120) // boot
    text(player.armor[3],width-160,290,120)
    
    counter = 0
    for(var k in player.inventory.armor){
      if(player.inventory.armor[k] > 0){
        if(mouseX > 22+(counter%3)*140 && mouseY > 20+floor(counter/3)*140 && mouseX < 142+(counter%3)*140 && mouseY < 140+floor(counter/3)*140){
          // tooltip
          fill(0,0,0,150)
          rect(mouseX,mouseY,20+textWidth("+" + armor[k].def + " HP"),32)
          fill(255)
          textAlign(LEFT,TOP)
          text("+" + armor[k].def + " HP",10+mouseX,10+mouseY)
        }
      }
      if(player.inventory.armor[k] > 0){counter++}
    }
    
    rect(width-230,480,120,120) // weapon
    text(player.weapon,width-230,480,120)
    textAlign(CENTER)
    for(var i = 0;i < damagenumbers.length;i++){
    damagenumbers[i].y -= damagenumbers[i].opacity/100;
    damagenumbers[i].opacity -= 12;
    textSize(24)
    noStroke()
    fill(40)
    text((damagenumbers[i].value > 0 ? "+" : "") + damagenumbers[i].value,
         damagenumbers[i].x+3,damagenumbers[i].y+3)
    fill(255,0,0)
    text((damagenumbers[i].value > 0 ? "+" : "") + damagenumbers[i].value,damagenumbers[i].x,damagenumbers[i].y)
    
    if(damagenumbers[i].opacity < -512){damagenumbers.splice(i,1);i--}
  }
  }
  if(screen == "crafting"){
    background(180)
    fill(255)
    stroke(0)
    strokeWeight(12)
    textSize(48)
    textAlign(CENTER,CENTER)
    text("Lincoln's\nCrafting\nWarehouse",width/2,100)
    text("<             >",width/2,height/2)
    textSize(24)
    strokeWeight(6)
    if(crafting.recipes[selectedStage].crystals){
      text(crafting.recipes[selectedStage].crystals + " crystals",width/2,250)
    }else if(crafting.recipes[selectedStage].coins){
      text(crafting.recipes[selectedStage].coins.toLocaleString() + " coins",width/2,250)
    }else if(crafting.recipes[selectedStage].items){
      for(var i in crafting.recipes[selectedStage].items){
        text(crafting.recipes[selectedStage].items[i] + "x " + i,width/2,250)
      }
    }
    text(crafting.recipes[selectedStage].weapons,width/2,250)
    var ableToCraft = true
    var costString = ""
    for(var x in crafting.recipes[selectedStage].cost){
      costString += (player.inventory.items[x] || 0) + "/" + crafting.recipes[selectedStage].cost[x]
      costString += " " + x
      costString += "\n"
      if((player.inventory.items[x] || 0) < crafting.recipes[selectedStage].cost[x]){ableToCraft = false}
    }
    costString = costString.substring(0,costString.length-1)
    text(costString,width/2,375)
    rect(-50,height-50,999,100)
    text("Return to Menu",width/2,height-25)
    if(!ableToCraft){fill(160)}
    rect(width/2-100,550,200,50)
    text("Craft!",width/2,575)
  }
  if(screen == "quests"){
    background(200,100,0)
    fill(255)
    stroke(0)
    strokeWeight(12)
    textSize(48)
    textAlign(CENTER,CENTER)
    text("QUEST BOARD",width/2,100-selectedStage)
    push()
    translate(width/2,175-selectedStage)
    for(var i = 0;i < quests.quests.length;i++){
      push()
      rotate((((i+1)*3.5)%11.6)-5.8)
      strokeWeight(6)
      rect(-300,0,600,150)
      textSize(24)
      text((i+1) + ". " + quests.quests[i].name,0,30)
      textSize(12)
      strokeWeight(3)
      text(quests.quests[i].desc,-195,60,400)
      rect(-250,100,500,35)
      fill(0,255,0)
      rect(-250,100,500*min(1,calcQuestProgress(quests.quests[i].name)/quests.quests[i].goal),35)
      fill(255)
      textSize(24)
      strokeWeight(6)
      text(calcQuestProgress(quests.quests[i].name) + "/" + quests.quests[i].goal,0,120)
      pop()
      translate(0,200)
    }
    pop()
    strokeWeight(6)
    rect(-5,height-50,305,60)
    rect(300,height-50,300,60)
    rect(600,height-50,305,60)
    textSize(24)
    text("Up",150,height-25)
    text("Down",450,height-25)
    text("Menu",684,height-25)
    
    if(mouseX > 0 && mouseX < 300 && mouseY > height-50 && mouseY < height && mouseIsPressed){
      selectedStage -= 5
    }
    else if(mouseX < 600 && mouseY > height-50 && mouseY < height && mouseIsPressed){
      selectedStage += 5
    }
    
  }
  if(screen == "menu"){
    selectedStage = 0
    background(0,200,0)
    textSize(48)
    fill(255)
    textAlign(CENTER,CENTER)
    strokeWeight(12)
    stroke(0)
    text("MYSTICAL",width/2,100+(sin(millis()/15)*30))
    text("BATTLES",width/2,152+sin((millis()+300)/15)*30)
    strokeWeight(6)
    textSize(24)
    textAlign(LEFT,TOP)
    fill(255)
    rect(40,250,40+textWidth("Adventure Mode"),50)
    text("Adventure Mode",60,265)
    rect(40,325,40+textWidth("Crafting Warehouse"),50)
    text("Crafting Warehouse",60,340)
    rect(40,400,40+textWidth("Quests"),50)
    text("Quests",60,415)
    rect(40,475,40+textWidth("Shop"),50)
    text("Shop",60,490)
  }
  if(screen == "shop"){
    background(180)
    fill(255)
    stroke(0)
    strokeWeight(12)
    textSize(48)
    textAlign(CENTER,CENTER)
    text("Andrew's Spicy\nShop",width/2,100)
    text("<             >",width/2,height/2)
    textSize(24)
    strokeWeight(6)
    textAlign(LEFT,CENTER)
    fill(255,255,100)
    text("$" + player.coins,width/2 - ("$" + player.coins + " ♦" + player.crystals).length*12,200)
    textAlign(RIGHT,CENTER)
    fill(100,200,255)
    text("♦" + player.crystals,width/2 + ("$" + player.coins + " C" + player.crystals).length*12,200)
    fill(255)
    textAlign(CENTER,CENTER)
    text(shop.crates[selectedStage].name,width/2,275)
    text("Common:    " + nf(shop.crates[selectedStage].prob[0],2) + "%",width/2,330)
    text("Uncommon:  " + nf(shop.crates[selectedStage].prob[1],2) + "%",width/2,330+28*1)
    text("Rare:      " + nf(shop.crates[selectedStage].prob[2],2) + "%",width/2,330+28*2)
    text("Very Rare: " + nf(shop.crates[selectedStage].prob[3],2) + "%",width/2,330+28*3)
    text("Epic:      " + nf(shop.crates[selectedStage].prob[4],2) + "%",width/2,330+28*4)
    text("Legendary: " + nf(shop.crates[selectedStage].prob[5],2) + "%",width/2,330+28*5)
    text("Mythic:    " + nf(shop.crates[selectedStage].prob[6],2) + "%",width/2,330+28*6)
    
    strokeWeight(3)
    rect(width/2-300,550,250,65)
    rect(width/2+50,550,250,65)
    strokeWeight(6)
    text("Purchase",width/2-175,575)
    text("Purchase",width/2+175,575)
    textSize(12)
    strokeWeight(3)
    fill(255,255,100)
    text("$" + shop.crates[selectedStage].coincost,width/2-175,600)
    fill(100,200,255)
    text("♦" + shop.crates[selectedStage].crystalcost,width/2+175,600)
    fill(255)
    rect(-20,height-50,900,100)
    textSize(24)
    strokeWeight(6)
    text("Return To Menu",width/2,height-25)
  }
  drawAnimation()
  
  // transition
  noStroke()
  fill(0,0,0,255*((30-abs(30-transitiontimer))/30))
  rect(0,0,width,height)
  
  if(transitiontimer == 30){
    screen = transitionto
    if(animation == "congrats"){player.clears[selectedStage] += 1}
    transitionto = ""
    animation = ""
  }
  
  if(transitiontimer < 60){
    transitiontimer += 2
  }
  
  // level up
  if(xpToGive > 0 && animation == "" && screen == "map"){
    player.xp += xpChange;
    xpToGive -= xpChange;
    
    if(xpToGive < 0){player.xp += xpToGive}
  }
  if(xpToGive < xpChange){
    player.xp = round(player.xp+xpToGive)
    xpChange = 0
    xpToGive = 0
  }
  if(player.xp >= floor(pow(player.level+1,1.6)*30+70)){
    player.xp -= floor(pow(player.level+1,1.6)*30+70)
    player.level++
    animation = "levelup"
    animationTimer = 0
  }
  if(animation != ""){
    animationTimer++
  }else{
    animationTimer = 0 
  }
  textAlign(LEFT,TOP)
  textSize(12)
  fill(255)
  strokeWeight(3)
  //debug info
  if(debugInfo) text("currentStage: " + currentStage +
                     "\ncurrentWave: " + currentWave +
                     "\nanimation: " + animation +
                     "\nanimation timer: " + animationTimer +
                     "\ncurrent attacking: " + currentAttacking +
                     "\ndamagemultiplier: " + damagemultiplier +
                     "\nxp to give: " + xpToGive,5,5,width)
  } catch (e) {
    sdata.value("An error occured: \n\n" + e + "\n\nPlease DM this textbox to Mark\n(don't worry, you can still export your data)")
    fill(0,0,0,127)
    rect(-10,height/2-50,width+20,100)
    textAlign(CENTER,CENTER)
    fill(255)
    stroke(0)
    strokeWeight(6)
    textSize(24)
    text("Looks like an error occured.",width/2,height/2-25)
    textSize(12)
    strokeWeight(3)
    text("Please check your save data box.",width/2,height/2+25)
    noLoop()
  }
}

// ------------------------ ON CLICK ------------------------

function mouseClicked(){
  if(mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height){
    if(screen == "fight"){
      // attacks
      if(turn == 0 && animation == ""){
        textSize(12)
        for(var i = 0;i < weapons[player.weapon].moves.length+1;i++){
          if(i == 0){
            if(mouseX > 20 && mouseY > 500+i*30 && mouseX < 40+textWidth("Attack (-" + weapons[player.weapon].damage + ")") && mouseY < 530+i*30){
              if(currentEnemies.length == 1){
                attack((weapons[player.weapon].damage),0)
                switchTurn(1)
              }else{
                selectedAttack = -1
                animation = "targeting"
              }
            }
          }else{
            if(mouseX > 20 && mouseY > 500+i*30 && mouseX < 40+textWidth(weapons[player.weapon].moves[i-1].name + " (" + weapons[player.weapon].moves[i-1].damageShown + ")") && mouseY < 530+i*30 && !weapons[player.weapon].moves[i-1].passive && !(weapons[player.weapon].moves[i-1].oneuse && oneuse)){
              if(currentEnemies.length == 1){
                selectedTarget = 0
                eval(weapons[player.weapon].moves[i-1].onUse); // I'm sorry.
                if(weapons[player.weapon].moves[i-1].oneuse){oneuse = true}
                switchTurn(1)
              }else{
                selectedAttack = i-1
                animation = "targeting"
              }
            }
          }
        }
        // targeting
        // check if everyone's dead
        var winbool = true
        for(var i = 0;i < currentEnemies.length;i++){
          if(currentEnemies[i].hp > 0){
            winbool = false
          }
        }
        if(winbool && animation == ""){
          // gg 
          gg()
        }
      }
      // target selection
    }else if(screen == "map" && animation == ""){
      if(mouseY > height-50 && mouseX < width-150){
        prepTransition("inventory.items")
      }else if(mouseY > height-50){
        prepTransition("menu")
      }else if(mouseX < 100){
        selectedStage--
        selectedStage = constrain(selectedStage,0,worlds.stages.length-1)
      }else if(mouseX > width-100){
        selectedStage++
        selectedStage = constrain(selectedStage,0,worlds.stages.length-1)
      }else{
        currentWave = 0
        loadStage(selectedStage,0)
        prepTransition("fight")
      }
    }else if(screen.substring(0,9) == "inventory" && animation == ""){
      // unequips
      if(mouseX > width-300 && mouseY > 150 && mouseX < width-300+120 && mouseY < 120+150){
        // unequip helmet
        if(player.armor[0]){
          if(!player.inventory.armor[player.armor[0]]){player.inventory.armor[player.armor[0]] = 0}
          player.inventory.armor[player.armor[0]] += 1
          player.armor[0] = ""
        }
      }
      if(mouseX > width-160 && mouseY > 150 && mouseX < width-160+120 && mouseY < 120+150){
        // unequip helmet
        if(player.armor[1]){
          if(!player.inventory.armor[player.armor[1]]){player.inventory.armor[player.armor[1]] = 0}
          player.inventory.armor[player.armor[1]] += 1
          player.armor[1] = ""
        }
      }
      if(mouseX > width-300 && mouseY > 310 && mouseX < width-300+120 && mouseY < 310+150){
        // unequip helmet
        if(player.armor[2]){
          if(!player.inventory.armor[player.armor[2]]){player.inventory.armor[player.armor[2]] = 0}
          player.inventory.armor[player.armor[2]] += 1
          player.armor[2] = ""
        }
      }
      if(mouseX > width-160 && mouseY > 310 && mouseX < width-160+120 && mouseY < 120+310){
        // unequip boots
        if(player.armor[3]){
          if(!player.inventory.armor[player.armor[3]]){player.inventory.armor[player.armor[3]] = 0}
          player.inventory.armor[player.armor[3]] += 1
          player.armor[3] = ""
        }
      }
      if(mouseX > width-230 && mouseY > 480 && mouseX < width-230+120 && mouseY < 120+480){
        // unequip helmet
        if(player.weapon){
          if(!player.inventory.weapons[player.weapon]){player.inventory.weapons[player.weapon] = 0}
          player.inventory.weapons[player.weapon] += 1
          player.weapon = ""
        }
      }
      if(mouseX > width-310 && mouseY > 10 && mouseX < width-10 && mouseY < 50){
        if(screen == "inventory.items"){screen = "inventory.weapons"}
        else if(screen == "inventory.weapons"){screen = "inventory.armor"}
        else if(screen == "inventory.armor"){screen = "inventory.items"}
      }

      // equip
      if(screen == "inventory.weapons"){
        var counter = 0
        for(var k in player.inventory.weapons){
          if(mouseX > 22+(counter%3)*140 && mouseY > 20+floor(counter/3)*140 && mouseX < 22+(counter%3)*140+120 && mouseY < 20+floor(counter/3)*140+120 && !player.weapon && weapons[k].level <= player.level+1){
            player.weapon = k
            player.inventory.weapons[k] -= 1
            break
          }
          if(player.inventory.weapons[k] > 0){counter++}
        }
      }
      if(screen == "inventory.armor"){
        var counter = 0
        for(var k in player.inventory.armor){
          if(mouseX > 22+(counter%3)*140 && mouseY > 20+floor(counter/3)*140 && mouseX < 22+(counter%3)*140+120 && mouseY < 20+floor(counter/3)*140+120 && player.inventory.armor[k] > 0){
            if(k.substring(k.length-6,k.length) == "Helmet" && !player.armor[0]){
              player.armor[0] = k
              player.inventory.armor[k] -= 1
              break
            }
            if(k.substring(k.length-5,k.length) == "Armor" && !player.armor[1]){
              player.armor[1] = k
              player.inventory.armor[k] -= 1
              break
            }
            if(k.substring(k.length-8,k.length) == "Leggings" && !player.armor[2]){
              player.armor[2] = k
              player.inventory.armor[k] -= 1
              break
            }
            if(k.substring(k.length-5,k.length) == "Boots" && !player.armor[3]){
              player.armor[3] = k
              player.inventory.armor[k] -= 1
              break
            }
          }
          if(player.inventory.armor[k] > 0){counter++}
        }
      }

      // return to map
      if(mouseY > height-50){
        if(player.weapon){
          prepTransition("map")
        }else{
          damagenumbers.push({value:"Equip a weapon!",x:mouseX,y:mouseY,opacity:500})
        }
      }
    }else if(screen == "menu"){
      textSize(24)
      if(mouseX > 40 && mouseY > 250 && mouseX < 80+textWidth("Adventure Mode") && mouseY < 300){prepTransition("map")}
      if(mouseX > 40 && mouseY > 325 && mouseX < 80+textWidth("Crafting Warehouse") && mouseY < 375){prepTransition("crafting")}
      if(mouseX > 40 && mouseY > 400 && mouseX < 80+textWidth("Quests") && mouseY < 450){
        prepTransition("quests")
      }
      if(mouseX > 40 && mouseY > 475 && mouseX < 80+textWidth("Encyclopedia") && mouseY < 525){
        prepTransition("shop")
      }
    }
    else if(screen == "crafting"){
      if(mouseY > height-50){
        prepTransition("menu")
      }else if(mouseX < 100){
        selectedStage--
        selectedStage = constrain(selectedStage,0,crafting.recipes.length-1)
      }else if(mouseX > width-100){
        selectedStage++
        selectedStage = constrain(selectedStage,0,crafting.recipes.length-1)
      }else if(mouseX > width/2-100 && mouseY > 550 && mouseX < width/2+100 && mouseY < 600){
        var ableToCraft = true
        for(var x in crafting.recipes[selectedStage].cost){
          if((player.inventory.items[x] || 0) < crafting.recipes[selectedStage].cost[x]){ableToCraft = false}
        }
        if(ableToCraft){
          if(crafting.recipes[selectedStage].items){
            for(var x in crafting.recipes[selectedStage].items){
              if(!player.inventory.items[x]){
                player.inventory.items[x] = 0
              }
              player.inventory.items[x]++
            }
          }
          if(crafting.recipes[selectedStage].crystals){
            player.crystals += crafting.recipes[selectedStage].crystals
          }
          if(crafting.recipes[selectedStage].coins){
            player.crystals += crafting.recipes[selectedStage].coins
          }
          if(crafting.recipes[selectedStage].weapons){
            if(!player.inventory.weapons[crafting.recipes[selectedStage].weapons]){
              player.inventory.weapons[crafting.recipes[selectedStage].weapons] = 0
            }
            player.inventory.weapons[crafting.recipes[selectedStage].weapons]++
          }
          for(var x in crafting.recipes[selectedStage].cost){
            player.inventory.items[x] -= crafting.recipes[selectedStage].cost[x]
          }
        }
      }
    }
    else if(screen == "shop"){
      if(mouseY > height-50){
        prepTransition("menu")
      }else if(mouseX < 100){
        selectedStage--
        selectedStage = constrain(selectedStage,0,shop.crates.length-1)
      }else if(mouseX > width-100){
        selectedStage++
        selectedStage = constrain(selectedStage,0,shop.crates.length-1)
      }else if(mouseX > width/2-300 && mouseY > 550 && mouseX < width/2-50 && mouseY < 615){
        // buy with coins
        if(player.coins >= shop.crates[selectedStage].coincost){
          player.coins -= shop.crates[selectedStage].coincost
          var rewards = []
          var selrar = 0
          // calc rarity
          var rn = floor(random(100))
          if(rn > shop.crates[selectedStage].prob[0]){
            rn -= shop.crates[selectedStage].prob[0]
            if(rn > shop.crates[selectedStage].prob[1]){
              rn -= shop.crates[selectedStage].prob[1]
              if(rn > shop.crates[selectedStage].prob[2]){
                rn -= shop.crates[selectedStage].prob[2]
                if(rn > shop.crates[selectedStage].prob[3]){
                  rn -= shop.crates[selectedStage].prob[3]
                  if(rn > shop.crates[selectedStage].prob[4]){
                    rn -= shop.crates[selectedStage].prob[4]
                    if(rn > shop.crates[selectedStage].prob[5]){
                      selrar = 7
                    }else{
                      selrar = 6
                    }
                  }else{
                    selrar = 5
                  }
                }else{
                  selrar = 4
                }
              }else{
                selrar = 3
              }
            }else{
              selrar = 2
            }
          }else{
            selrar = 1
          }
          for(var k in weapons){
            if(weapons[k].rarity == selrar){
              rewards.push(k)
            }
          }
          cratereward = rewards[floor(random(rewards.length))]
          if(!player.inventory.hasOwnProperty(cratereward)){player.inventory.weapons[cratereward] = 0}
          player.inventory.weapons[cratereward] += 1
          animationTimer = 0
          animation = "crate"
        }
      }else if(mouseX > width/2+50 && mouseY > 550 && mouseX < width/2+300 && mouseY < 615){
        // buy with crystals
        if(player.crystals >= shop.crates[selectedStage].crystalcost){
          player.crystals -= shop.crates[selectedStage].crystalcost
          var rewards = []
          var selrar = 0
          // calc rarity
          var rn = floor(random(100))
          if(rn > shop.crates[selectedStage].prob[0]){
            rn -= shop.crates[selectedStage].prob[0]
            if(rn > shop.crates[selectedStage].prob[1]){
              rn -= shop.crates[selectedStage].prob[1]
              if(rn > shop.crates[selectedStage].prob[2]){
                rn -= shop.crates[selectedStage].prob[2]
                if(rn > shop.crates[selectedStage].prob[3]){
                  rn -= shop.crates[selectedStage].prob[3]
                  if(rn > shop.crates[selectedStage].prob[4]){
                    rn -= shop.crates[selectedStage].prob[4]
                    if(rn > shop.crates[selectedStage].prob[5]){
                      selrar = 7
                    }else{
                      selrar = 6
                    }
                  }else{
                    selrar = 5
                  }
                }else{
                  selrar = 4
                }
              }else{
                selrar = 3
              }
            }else{
              selrar = 2
            }
          }else{
            selrar = 1
          }
          for(var k in weapons){
            if(weapons[k].rarity == selrar){
              rewards.push(k)
            }
          }
          cratereward = rewards[floor(random(rewards.length))]
          if(!player.inventory.hasOwnProperty(cratereward)){player.inventory.weapons[cratereward] = 0}
          player.inventory.weapons[cratereward] += 1
          animationTimer = 0
          animation = "crate"
        }
      }
    }
    else if(screen == "quests"){
      if(mouseX > 600 && mouseY > height-50){
        prepTransition("menu")
      }
    }
    if(animation != "" && animationTimer > 0){
        if(animation == "congrats" && animationTimer > 120){
          if(player.clears[currentStage] == 0){
            xpToGive += worlds.stages[currentStage].firstrewards.xp
            xpChange = ceil(xpToGive/180)
            player.coins += worlds.stages[currentStage].firstrewards.coins
            for(var k in worlds.stages[currentStage].firstrewards.items){
              if(!player.inventory.items.hasOwnProperty(k)){
                player.inventory.items[k] = 0
              }
              player.inventory.items[k] += worlds.stages[currentStage].firstrewards.items[k]
            }
            for(var k in chanceitems){
              if(!player.inventory.weapons.hasOwnProperty(k)){
                player.inventory.weapons[k] = 0
              }
              player.inventory.weapons[k] += chanceitems[k]
            }
            for(var k in chancearmor){
              if(!player.inventory.armor.hasOwnProperty(k)){
                player.inventory.armor[k] = 0
              }
              player.inventory.armor[k] += chancearmor[k]
            }
            for(var k in chancearmor){
              if(!player.inventory.armor.hasOwnProperty(k)){
                player.inventory.armor[k] = 0
              }
              player.inventory.armor[k] += chancearmor[k]
            }
          }else{
            xpToGive += worlds.stages[currentStage].rewards.xp
            xpChange = ceil(xpToGive/180)
            player.coins += worlds.stages[currentStage].rewards.coins
            for(var k in worlds.stages[currentStage].rewards.items){
              if(!player.inventory.items.hasOwnProperty(k)){
                player.inventory.items[k] = 0
              }
              player.inventory.items[k] += worlds.stages[currentStage].rewards.items[k]
            }
            for(var k in chanceitems){
                if(!player.inventory.weapons.hasOwnProperty(k)){
                  player.inventory.weapons[k] = 0
                }
                player.inventory.weapons[k] += chanceitems[k]
            }
          }
          prepTransition("map")
        }
        if(animation == "levelup" && animationTimer > 120){
          //claim rewards
          player.maxhp += levels[player.level].hp
          player.hp = player.maxhp
          for(var k = 0;k < levels[player.level].armor.length;k++){
            if(!player.inventory.armor.hasOwnProperty(levels[player.level].armor[k])){
              player.inventory.armor[levels[player.level].armor[k]] = 0
            }
            player.inventory.armor[levels[player.level].armor[k]] += 1
          }
          for(var k = 0;k < levels[player.level].weapons.length;k++){
            if(!player.inventory.weapons.hasOwnProperty(levels[player.level].weapons[k])){
              player.inventory.weapons[levels[player.level].weapons[k]] = 0
            }
            player.inventory.weapons[levels[player.level].weapons[k]] += 1
          }
          animation = ""
        }
        if(animation == "targeting"){
          for(var i = 0;i < currentEnemies.length;i++){
            if(mouseX > 620 && mouseY > (300-(currentEnemies.length-1)*80)+i*160 && mouseX < 120+620 && mouseY < 120+(300-(currentEnemies.length-1)*80)+i*160){
              if(selectedAttack == -1){
                attack((weapons[player.weapon].damage),i)
                switchTurn(1)
                animation = ""
              }else{
                selectedTarget = i
                eval(weapons[player.weapon].moves[selectedAttack].onUse); // I'm sorry.
                switchTurn(1)
                animation = ""
              }
            }
          }
        }
        if(animation == "death"){
          prepTransition("map")
        }
        if(animation == "crate"){
          animation = ""
        }
      }
      //damagenumbers.push({value:floor(random(-9,0)),x:mouseX,y:mouseY,opacity:500})
  }
} 