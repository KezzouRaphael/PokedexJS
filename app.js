//ALL THE DOM MANIPULATION HERE
const mainScreen = document.querySelector(".main-screen");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const pokeFrontImage = document.querySelector(".poke-front-image");
const pokeBackImage = document.querySelector(".poke-back-image");
const pokeFrontImageShiny = document.querySelector(".poke-front-image-shiny");
const pokeBackImageShiny = document.querySelector(".poke-back-image-shiny");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const pokeHeight = document.querySelector(".poke-height");
const pokeWeight = document.querySelector(".poke-weight");

const pokeListItems = document.querySelectorAll(".list-item");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");
//CONSTS AND VARIABLES
const TYPES = ['normal','fighting','flying','poison','ground','rock','bug','ghost','steel','fire','water','grass','electric','psychic','ice','dragon','dark','fairy'];
let previousUrl = null;
let nextUrl = null;
let cries;
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
  let audio = new Audio("click_sound.mp3");
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