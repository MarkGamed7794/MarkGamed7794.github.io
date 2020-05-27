var fnt
var assets = {}
var worlds = {}
var moves = {}
var weapons = {}
var armor = {}
var turn = 0 // 0 = player, 1 = enemy
var currentTurn = 1
var xpChange = 0
var attackamount = 1
var selectedStage = 0
var attackall = false
var currentAttacking = 0
var selectedAttack = 0
var selectedTarget = 0

var debugInfo = false // set to true for debug

var screen = "map"
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
  poison:0,
  clears:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
}
var currentStage = 0;
var currentWave = 0;
var xpToGive = 0
var enemyUsed = ""
var currentlyAttacking = 0
var animation = ""
var animationTimer = 0
var enemyAttackTimer = 0;
var damagemultiplier = 1;
var sv
var ld
var sdata

function loadAssets(){
  fnt = loadFont("PressStart2P.ttf")
  assets.astro = loadImage("assets/astro.png")
  worlds = loadJSON("worlds.json")
  moves = loadJSON("moves.json")
  weapons = loadJSON("weapons.json")
  armor = loadJSON("armor.json")
}

function preload(){
  loadAssets() 
}

function setup() {
  createCanvas(768, 720);
  loadStage(0)
  
  xpChange = xpToGive/180
  
  sv = createButton("Export").mousePressed(function(){
    sdata.value(btoa(JSON.stringify(player)))
  })
  ld = createButton("Import").mousePressed(function(){
    if(screen == "map"){
      player = JSON.parse(atob(sdata.value()))
    }
  })
  createElement("br")
  sdata = createElement("textarea","Click \"Export\" to export save data to this textbox, click \"Import\" to load the data in this textbox").size(400,100)
}

function loadStage(stage,wave=0){
  currentStage = stage
  currentWave = wave
  switchTurn(0)
  animation = ""
  currentEnemies = worlds.stages[stage].waves[currentWave].enemies
  for(var i = 0;i < currentEnemies.length;i++){
    currentEnemies[i].hp = currentEnemies[i].maxhp
    currentEnemies[i].sleep = 0
    currentEnemies[i].shield = 0
  }
  if(wave == 0){
    damagenumbers = [] 
  }
}

function calcArmorBonus(){
  return (armor[player.armor[0]] || {def:0}).def + (armor[player.armor[1]] || {def:0}).def + (armor[player.armor[2]] || {def:0}).def + (armor[player.armor[3]] || {def:0}).def
}

function switchTurn(n){
  if(n == 0){
    turn = 0
    damagemultiplier = 1
    attackamount = 1
    attackall = false
    checkPassive("turn")
    currentAttacking = 0
    if(player.poison > 0){
      player.hp -= player.poison
      damagenumbers.push(
      {value:-player.poison,x:80+random(-50,50),y:360+random(-50,50),opacity:500,color:color(127,0,255)}
        )
    }
  }
  if(n == 1){
    enemyUsed = ""
    turn = 1
    damagemultiplier = 1
    attackamount = 1
    enemyAttackTimer = 0
  }
}

function getLevelName(stage,specific=""){
  if(specific == "number") return worlds.stages[stage].world + "-" + worlds.stages[stage].stage
  if(specific == "name") return worlds.stages[stage].name
  return worlds.stages[stage].world + "-" + worlds.stages[stage].stage + ": " + worlds.stages[stage].name
}

function attack(damage,target=selectedTarget,mul=damagemultiplier){
  for(var q = 0;q < attackamount;q++){
    if(target == -1 || attackall){
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
  player.hp -= damage 
  damagenumbers.push({value:-damage,x:80+random(-50,50),y:360+random(-50,50),opacity:500})
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

function attackeveryone(damage){
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
  text(getLevelName(currentStage) + "\nWave " + (currentWave+1) + "/" + worlds.stages[currentStage].waves.length,20,20)
  
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
  if(player.poison > 0){
    fill(127,0,255)
    text("Poison " + player.poison,29,400)
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
        if(weapons[player.weapon].moves[i-1].passive){
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
    rect(width-297,150,300*(player.xp/levels[player.level+1].required),40)
    fill(255)
    text((player.hp) + "/" + (player.maxhp+player.armorbonus) + " HP",7,160)
    text(floor(player.xp) + "/" + floor(pow(player.level+1,1.6)*30+70) + " XP",width-287,160)
    text("$" + player.coins,7,200)
    text("Level " + (player.level+1),width-287,200)
    rect(-20,height-50,width+40,60)
    textAlign(CENTER,TOP)
    text("Inventory",width/2,height-35)
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
        text(k,22+(counter%3)*140,20+floor(counter/3)*140)
        textSize(24)
        strokeWeight(6)
        text("x" + player.inventory.weapons[k],32+(counter%3)*140,110+floor(counter/3)*140)
      }
      if(player.inventory.weapons[k] > 0){counter++}
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
        strokeWeight(3)
        textSize(12)
        rect(22+(counter%3)*140,20+floor(counter/3)*140,120,120)
        text(k,22+(counter%3)*140,20+floor(counter/3)*140,140)
        textSize(24)
        strokeWeight(6)
        text("x" + player.inventory.armor[k],32+(counter%3)*140,110+floor(counter/3)*140)
      }
      if(player.inventory.armor[k] > 0){counter++}
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
  drawAnimation()
  
  
  // level up
  if(xpToGive > 0 && animation == ""){
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
            if(mouseX > 20 && mouseY > 500+i*30 && mouseX < 40+textWidth(weapons[player.weapon].moves[i-1].name + " (" + weapons[player.weapon].moves[i-1].damageShown + ")") && mouseY < 530+i*30 && !weapons[player.weapon].moves[i-1].passive){
              if(currentEnemies.length == 1){
                selectedTarget = 0
                eval(weapons[player.weapon].moves[i-1].onUse); // I'm sorry.
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
      if(mouseY > height-50){
        screen = "inventory.items"
      }else if(mouseX < 100){
        selectedStage--
        selectedStage = constrain(selectedStage,0,worlds.stages.length-1)
      }else if(mouseX > width-100){
        selectedStage++
        selectedStage = constrain(selectedStage,0,worlds.stages.length-1)
      }else{
        currentWave = 0
        loadStage(selectedStage,0)
        screen = "fight"
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
          if(mouseX > 22+(counter%3)*140 && mouseY > 20+floor(counter/3)*140 && mouseX < 22+(counter%3)*140+120 && mouseY < 20+floor(counter/3)*140+120 && !player.weapon){
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
          screen = "map"
        }else{
          damagenumbers.push({value:"Equip a weapon!",x:mouseX,y:mouseY,opacity:500})
        }
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
          player.clears[currentStage] += 1
          screen = "map"
          animation = ""
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
      }
      //damagenumbers.push({value:floor(random(-9,0)),x:mouseX,y:mouseY,opacity:500})
  }
} 