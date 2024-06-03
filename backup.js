console.log('hii');


let currentsong =  new Audio() ;
let songs;
let currfolder ;

function secondsToMinutesSeconds(seconds){
  // if (isNaN(seconds) || seconds<0 ) {
  //   return "invalid input";
    
  // }

  const minutes = Math.floor(seconds/60);
  const remainingSeconds =  Math.floor(seconds%60);

  const formattedminutes = String(minutes).padStart(2,'0');
  const formatteSeconds= String(remainingSeconds).padStart(2,'0');

  return `${formattedminutes}:${formatteSeconds}`;
}



async function getsongs(folder) {
    
    currfolder = folder;

    // let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    
    
   let div = document.createElement("div")
   div.innerHTML=response;
   let as= div.getElementsByTagName("a")
   songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
         songs.push(element.href.split(`/${folder}/`)[1])
    }
  }
 
       // show all song in playlisg
  let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songul.innerHTML=" "
  for (const song of songs) {
    songul.innerHTML += `<li> 
    <img class="invert" src="img/music.svg" alt="" />
    <div class="info">
      <div>${song.replace("_320(PaglaSongs).mp3" ," ")}</div>
      <div>Sachin</div>
    </div>
    <div class="playnow">
      <span>Play Now</span>
      <img  class="invert" width="25px" src="img/play.svg" alt="" />
    </div>
     </li> `;
  }
    

  // atach an event listner to each song 
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{

      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim()); 
    }) 
  })  
} 

const playmusic = (track ,  pause=false)=>{
  // let audio = new Audio("/songs/" + track)
  currentsong.src=`/${currfolder}/` + track 
  if (!pause) {
    
    currentsong.play();
    play.src="img/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML=track
  document.querySelector(".songtime").innerHTML="00:00"
}

async function displayalbum(){
  let  a= await fetch(`/songs/`)
  let response = await a.text();
   let div =  document.createElement("div")
   div.innerHTML = response;
   let anchors = div.getElementsByTagName("a")
   Array.from(anchors).forEach( async e=>{
    if(e.href.includes("/songs")) {
      let folder = (e.href.split('/').slice(-2)[1])
      let  a= await fetch(`/songs/${folder}/info.json`)
      let response = await a.json();
      console.log(response);
      let cardcontainer = document.querySelector(".ca")
      cardcontainer.innerHTML=cardcontainer.innerHTML+` <div data-folder="c" class="card">
      <div class="play">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http:// www.w3.org/2000/svg"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="#141834"
            stroke-width="1.5"
            fill="#000"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img
        src="/songs/${folder}/cover.jpg"
        alt=""
      />
      <h4>${response.title}</h4>
      <p>${response.description}</p>
    </div>`
      
      
    }
   })
  
}


async function main(){


      await getsongs("songs/cs");
     playmusic(songs[0] , true)

      //display all the  albums on the  page
    displayalbum()

     
     
 
  
   // atach an event listner to play pause and previous 
  //  play.addEventListener("Click",()=>{
  //   if(currentsong.paused){
  //     currentsong.play()
  //     play.src="pause.svg"
  //   }
  //   else{
  //     currentsong.pause()
  //     play.src="play.svg"
  //   }
  //  })
  play.addEventListener("click" , ()=>{
    if(currentsong.paused){
      currentsong.play()
      play.src="img/pause.svg"      
    }
    else{
      currentsong.pause()
      play.src="img/play.svg"
    }
  })


  //lsiten for time update
  currentsong.addEventListener("timeupdate" , ()=>{
   
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
  })

  // add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener( "click" , (e)=>{
    let percent =  ( e.offsetX/ e.target.getBoundingClientRect().width )*100;
    document.querySelector(".circle").style.left= percent + '%';
    currentsong.currentTime = ( (currentsong.duration)*percent)/100;
  })

  // add an event listener to hanberg
  hanberg.addEventListener("click",()=>{
    document.querySelector(".left").style.left=-14+'px';
  })

  //add an event lsitener to close button
  document.querySelector(".close").addEventListener('click',()=>{
    document.querySelector(".left").style.left=-550+'px';
  })
  
let Sachin = currentsong;
console.log(Sachin);

  // add an event listener to next 
  next.addEventListener("click",()=>{
    console.log('cliked');
    
    let index =  songs.indexOf(currentsong.src.split('/').slice(-1)[0])
    //  Audio.play(index+1)
    console.log(index);
    
    if (index+1 < songs.length) {
      playmusic(songs[index+1]);    
    }
  })

  // add an event listener to previous 
  previous.addEventListener("click",()=>{
    
    let index =  songs.indexOf(currentsong.src.split('/').slice(-1)[0])
    //  Audio.play(index+1)
    if (index > 0) {
      playmusic(songs[index-1]); 
    }
  })
      // load the playlist whenever card is clicked 
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click" ,async item=>{
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      // songs =  await getsongs("songs/ncs")  
    })
  });

}      
   
main()