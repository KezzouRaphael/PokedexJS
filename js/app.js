//ALL THE DOM MANIPULATION HERE
const mainScreen = document.querySelector(".main-screen");
const screenMoves = document.querySelector(".screen__moves");
const screenPic = document.querySelector(".screen__image_main");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const pokeFrontImage = document.querySelector(".poke-front-image");
const pokeBackImage = document.querySelector(".poke-back-image");
const pokeFrontImageShiny = document.querySelector(".poke-front-image-shiny");
const pokeBackImageShiny = document.querySelector(".poke-back-image-shiny");
const pokeDWImage = document.querySelector(".poke-dw-image");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const pokeHeight = document.querySelector(".poke-height");
const pokeWeight = document.querySelector(".poke-weight");
const pokeHp = document.querySelector(".poke-stats-hp");
const pokeAtk = document.querySelector(".poke-stats-attack");
const pokeDef = document.querySelector(".poke-stats-defense");
const pokeSpAtk = document.querySelector(".poke-stats-special-attack");
const pokeSpDef = document.querySelector(".poke-stats-special-defense");
const pokeSpeed = document.querySelector(".poke-stats-speed");
const pokeListItems = document.querySelectorAll(".list-item");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");
//CONSTS AND VARIABLES
const TYPES = ['normal','fighting','flying','poison','ground','rock','bug','ghost','steel','fire','water','grass','electric','psychic','ice','dragon','dark','fairy'];
let previousUrl = null;
let nextUrl = null;
let cries;
let movesLevel = [];
///FUNCTIONS
function resetScreen() {
  mainScreen.classList.remove("hide");
  for(const type of TYPES){
    mainScreen.classList.remove(type);  
  }
}
function capitalize(str){
  return str[0].toUpperCase()+str.substr(1);
}
function createMoveLevel(move,method){
  if(method == "level-up"){
    movesLevel.push({name: move["move"]["name"],level: move["version_group_details"][0]["level_learned_at"],method : "level-up"});
  }
}
function createMoveEgg(move,method){
  if(method == "egg"){
    createMove(move);
  }
}
function createMoveTutor(move,method){
  if(method == "tutor"){
    createMove(move);
  }
}
function createMoveMachine(move,method){
  if(method == "machine"){
    createMove(move);
  }
}
function createMove(move){
  let moveName = document.createElement("a");
  moveName.classList.add("poke_moves");
  moveName.setAttribute("href",`https://pokemondb.net/move/${move["move"]["name"]}`);
  moveName.setAttribute("target","_blank");
  moveName.textContent = capitalize(move["move"]["name"]);
  screenMoves.appendChild(moveName);
  let moveLevel = document.createElement("p");
  moveLevel.classList.add("poke_level");
  moveLevel.textContent = move["version_group_details"][0]["level_learned_at"];
  screenMoves.appendChild(moveLevel);
  let moveMethod = document.createElement("p");
  moveMethod.classList.add("poke_method");
  moveMethod.textContent = capitalize(move["version_group_details"][0]["move_learn_method"]["name"]);
  screenMoves.appendChild(moveMethod);
}
const fetchPokeList = async url=>{
  //DATA FOR RIGHT SCREEN
  await fetch(url)
  .then(res=>res.json())
  .then(value => {
    const {results,previous,next} = value;
    if(previous)
    {
      previousUrl = previous.slice(0, -2) + '20';
    }
    else
    {
      previousUrl = previous;
    }
    nextUrl = next;
    
    for(let i = 0; i < pokeListItems.length;i++){
      const pokeListItem = pokeListItems[i];
      const resultData = results[i];
      
      if(resultData)
      {
        const { name,url } = resultData;
        const urlArray = url.split('/');
        const id = urlArray[urlArray.length - 2];
        pokeListItem.textContent = id + ". " + capitalize(name); 
      }else{
        pokeListItem.textContent = '';
      }
    }
  });
};
const fetchPokeData = async id =>{
  //DATA FOR LEFT SCREEN
  await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  .then(res =>res.json())
  .then(value =>{ 
    //TYPES
    const dataTypes = value['types'];
    const dataFirstType = dataTypes[0];
    const dataSecondType = dataTypes[1];
    pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
    if(dataSecondType){
      pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
      pokeTypeTwo.classList.remove("hide");
    }
    else{
      pokeTypeTwo.textContent='';
      pokeTypeTwo.classList.add("hide");
    }
    pokeHp.textContent = value['stats'][0]["base_stat"];
    pokeAtk.textContent = value['stats'][1]["base_stat"];
    pokeDef.textContent = value['stats'][2]["base_stat"];
    pokeSpAtk.textContent = value['stats'][3]["base_stat"];
    pokeSpDef.textContent = value['stats'][4]["base_stat"];
    pokeSpeed.textContent = value['stats'][5]["base_stat"]
    //MS
    resetScreen();
    mainScreen.classList.add(dataFirstType['type']['name']);
    
    //BASIC INFOS
    cries = value['name'];
    pokeName.textContent = capitalize(value['name']);
    pokeId.textContent = '#'+value['id'].toString().padStart(3,'0');
    pokeHeight.textContent = value['height'];
    pokeWeight.textContent = value['weight'];
    //SPRITES
    pokeFrontImage.src = value['sprites']['front_default'] ||'';
    pokeBackImage.src = value['sprites']['back_default']||'';
    console.log(value);
    pokeFrontImageShiny.src = value['sprites']['front_shiny'] ||'';
    pokeBackImageShiny.src = value['sprites']['back_shiny']||'';
    if(value["sprites"]["other"]["dream_world"]["front_default"])
    {
      screenPic.style.display = "flex";
      pokeDWImage.src = value["sprites"]["other"]["dream_world"]["front_default"];
    }
    //MOVES
    let movesArray = value["moves"];
    movesArray.forEach(move => {
     createMoveLevel(move,move["version_group_details"][0]["move_learn_method"]["name"]);
    });
    let movesSorted = movesLevel.sort(function(a, b) { return a.level - b.level });
    movesSorted.forEach(move =>{
      let moveName = document.createElement("a");
      moveName.classList.add("poke_moves");
      moveName.setAttribute("href",`https://pokemondb.net/move/${move["name"]}`);
      moveName.setAttribute("target","_blank");
      moveName.textContent = capitalize(move["name"]);
      screenMoves.appendChild(moveName);
      let moveLevel = document.createElement("p");
      moveLevel.classList.add("poke_level");
      moveLevel.textContent = move["level"];
      screenMoves.appendChild(moveLevel);
      let moveMethod = document.createElement("p");
      moveMethod.classList.add("poke_method");
      moveMethod.textContent = capitalize(move["method"]);
      screenMoves.appendChild(moveMethod);
    });
    movesArray.forEach(move => {
      createMoveEgg(move,move["version_group_details"][0]["move_learn_method"]["name"]);
    });   
    movesArray.forEach(move => {
      createMoveTutor(move,move["version_group_details"][0]["move_learn_method"]["name"]);
    });    
    movesArray.forEach(move => {
      createMoveMachine(move,move["version_group_details"][0]["move_learn_method"]["name"]);
    });
  });
};
const handleLeftButtonClick = (e) =>{
  if(previousUrl)
  {
    fetchPokeList(previousUrl);
  }
};
const handleRightButtonClick = (e) =>{
  if(nextUrl){
    fetchPokeList(nextUrl);
  }
};

const handleListItemClick = (e) =>{
  let audio = new Audio("./ressources/click_sound.mp3");
  audio.volume = 0.5;
  audio.play();
  if(!e.target)return
  const listItem = e.target;
  if(!listItem.textContent) return;
  const id = listItem.textContent.split('.')[0];
  fetchPokeData(id);
};
//Event Listener
leftButton.addEventListener("click",handleLeftButtonClick);
rightButton.addEventListener("click",handleRightButtonClick);
for(const pokeListitem of pokeListItems){
  pokeListitem.addEventListener("click",handleListItemClick);
}
pokeName.addEventListener("click",()=>{
  let audio = new Audio("https://play.pokemonshowdown.com/audio/cries/"+cries+".mp3");
  audio.volume = 0.5;
  audio.play();
});
//Initialize
fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20")