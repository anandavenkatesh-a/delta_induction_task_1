

const start_botton = document.querySelector("#start_button");
const grid = document.querySelector('#container');
const round_display = document.querySelector('#round');
const score_display = document.querySelector('#score');
const status_bar = document.querySelector('#game_status');
const completion_status = document.querySelector('#completion_status');
const start_popups = document.querySelector('#start_game');
const end_popups = document.querySelector('#end_game');
status_bar.removeChild(round_display);
status_bar.removeChild(score_display);
status_bar.removeChild(completion_status);

var tiles_seq = []; //tile_sq[tile] = pos
var tiles_pos = []; //tiles_pos[pos] = tile

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}


const tiles_audio1 = new Audio();
tiles_audio1.src = './res/tile1.mp3';
const tiles_audio2 = new Audio();
tiles_audio2.src = "./res/tile2.mp3";
const tiles_audio3 = new Audio();
tiles_audio3.src = "./res/tile3.mp3";
const tiles_audio4 = new Audio();
tiles_audio4.src = "./res/tile4.mp3";
const start_audio = new Audio();
start_audio.src = "./res/start_music.mp3";
const end_music = new Audio();
end_music.src = "./res/end_music.mp3";
end_music.playbackRate = 3;
tile_fall = new Audio('./res/tiles_fall.mp3');
tile_fall.playbackRate = 3;
async function createTile(i)


{
   let tile = document.createElement('div');
   tile.classList.add('tile','tile' + i);   
   tile_icon = document.createElement('div');
   tile_icon.innerHTML = '<img class = "tile_icon" src = "./res/note'+ (1 + Math.floor(Math.random()*8))+'.png">  </img>';
   tile_icon.setAttribute('draggable','false');
   tile.appendChild(tile_icon);
   
   let tiles_audio;
         switch (i) {
            case 1:
               tiles_audio = tiles_audio4; 
               break;
            case 2:
               tiles_audio = tiles_audio1; 
               break;
            case 3:
                tiles_audio = tiles_audio2;
                break;
            case 4:
                tiles_audio = tiles_audio3;
                break;
         }
         
         tile.addEventListener('click',(event) => {
             tiles_audio.play();
             tiles_audio.currentTime = 0;
             tiles_audio.playbackRate = 6;
         });
         
         return tile;
}

async function start()
{
    //initialize the page for new game
    var score = 0;
    
    tiles_seq = [];
    tiles_pos = [];
    
    status_bar.removeChild(start_botton);
    try{
       status_bar.removeChild(completion_status);
    }
    catch{}

    grid.innerHTML = "";
    round_display.innerText = "1";
    completion_status.querySelector('span').style.width = 0 + '%'; 
    completion_status.querySelector('span').innerText = 0 + '%';
    start_audio.play();
    
    start_popups.animate([
        {
           height:'0',
           width:'0',
           top:'0',
        },
        {
           height:'20vh',
           width:'20vw',
           top:'40vh' 
        }
    ],300);
    start_popups.style.height = '20vh';
    start_popups.style.width = '20vw';
    start_popups.style.top = '40vh';
    start_popups.style.minHeight = "144px";
    start_popups.style.minWidth = '200px';
    start_popups_close = start_popups.querySelector('button');
    async function start_popup_close_user_response(){
        var user_responded = false;
        start_popups_close.addEventListener('click',(event) => {
            user_responded = true;
        });  

        while(!user_responded)
        {
            await sleep(100);
        }

        start_audio.pause();
        start_audio.currentTime = 0;
        start_popups.style.height = '0';
        start_popups.style.width = '0';
        start_popups.style.top = '0';
        start_popups.style.minHeight = "0px";
        start_popups.style.minWidth = '0px';
        return 'done';
    };
    await start_popup_close_user_response();
   
    status_bar.appendChild(round_display);
    status_bar.appendChild(completion_status);

    //create tiles using dom 
    for(let id = 1;id <= 16;id++)
    {
        let tile_container = document.createElement('div');
        tile_container.classList.add('tile_container');
        tile_container.setAttribute('id','tile_container'+id);
        grid.appendChild(tile_container);
    }
    await sleep(1000);
    for(let tile_id = 1;tile_id <= 16;tile_id++)
    {
         let tile = await createTile(1+ Math.floor(Math.random()*4));  
         tile.setAttribute('id','tile'+tile_id);          
         document.querySelector('#tile_container'+tile_id).appendChild(tile);
         tile.animate([
            {
                transform:'scale(0)',
                top:'-'+(220 + (window.innerHeight*0.2*(Math.floor(tile_id/4))))+'px',

            },
            {
                transform:'scale(1)',
                top:'0px' 
            }
        ],{
            duration:300,
            easing:'ease-in'
        });  
        tile_fall.play();
        tile_fall.currentTime = 0;
        await sleep(300);
    }
   
    await sleep(1000);
    //generrate random seq of tiles
    const length = 16;
    
    var pos_alloted_tiles = 0;
    while(pos_alloted_tiles < 16)
    {
        let tile_index = Math.floor(Math.random()*length);
        if(tiles_seq[tile_index] == undefined)
        {
            tiles_seq[tile_index] = pos_alloted_tiles+1;
            pos_alloted_tiles++;
        }
    } 

    for(let pos = 1;pos <= 16;pos++)
    {
        for(let index = 0;index < 16;index++)
        {
            if(tiles_seq[index] == pos)
            {
                tiles_pos[pos] = index+1;
                break;
            }
        }
    }

    
    //counduct rounds 
    async function conduct_round(round)
    {        
        //managing user clicks
        let clicked_tiles = [];
        let clicked_tiles_num = 0;
        grid.addEventListener('click',(event) => {
            let target = event.target;
            if(clicked_tiles_num < round)
            {
                if(target.classList.contains('tile'))
                {
                
                
                    let tile_id = parseInt(target.id.substring(4));
                    clicked_tiles.push(tile_id); 
                    clicked_tiles_num++;
                
                }
                else if(target.classList.contains('tile_icon'))
                {
                    let tile_id = parseInt(target.parentNode.parentNode.id.substring(4));
                    clicked_tiles.push(tile_id);
                    clicked_tiles_num++;
                }
            }
        });

        //for hightlighting tiles 
        for(let pos = 1;pos <= round;pos++)
        {       
            let tile = document.querySelector('#tile' + tiles_pos[pos]);
            let prev_style = tile.style;
            tile.style.backgroundColor = 'yellow';
            tile.style.opacity = '1';
            await sleep(600);
            tile.style = prev_style;
        }


        async function user_response()
        {
            
            await sleep(3000);
            //check the status of the game
            for(let pos = 1;pos <= round;pos++)
            {
                if(!clicked_tiles.includes(tiles_pos[pos]))
                {
                    return Promise.resolve("false");
                }
            }

            return Promise.resolve("true");
        }

        const result = await user_response();    
        return result;
    }

    let round = 1;
    for(;round <= 16;round++)
    {
        round_display.innerText = ""+round;
        completion_status.querySelector('span').style.width = ((round-1)/16)*100 + '%'; 
        completion_status.querySelector('span').innerText = ((round-1)/16)*100 + '%';
        let result = await conduct_round(round);

        let won = result;
        var win = true;
        if(won == "true")
        {
           //next round
           score += round; 
        }
        else
        {
           //edn the round 
           break;
        }
    }
    
    grid.innerHTML = '';
    
    if(round == 17)
    {
        completion_status.querySelector('span').innerText = 100 + '%';
        completion_status.querySelector('span').style.width = 100 + '%'; 
        await sleep(100);
        end_popups.querySelector('.popups_title').innerText = "You Won";
    }
    else
    {
        end_popups.querySelector('.popups_title').innerText = "You Lost";
        const popups_round = document.createElement('li');
        popups_round.innerText = 'Round:'+round;
        end_popups.querySelector('.popups_content').appendChild(popups_round);
    }
    
    const popups_score = document.createElement('li');
    popups_score.innerText = 'Score:'+score;
    end_popups.querySelector('.popups_content').appendChild(popups_score);
    
    end_music.play();
    
    end_popups.animate([
        {
            height:'0',
            width:'0',
            top:'0'
        },
        {
            height:'20vh',
            width:'20vw',
            top:'40vh'
        }
    ],300);
    end_popups.style.height = '20vh';
    end_popups.style.width ='20vw';
    end_popups.style.top = '40vh';
    end_popups.style.minHeight = '144px';
    end_popups.style.minWidth = '200px';
    end_popups_close = end_popups.querySelector('button');
    async function end_popup_close_user_response(){
        var user_responded = false;
        end_popups_close.addEventListener('click',(event) => {
            user_responded = true;
        });  

        while(!user_responded)
        {
            await sleep(100);
        }

        end_music.pause();
        end_music.currentTime = 0;
        end_popups.style.height = '0';
        end_popups.style.width = '0';
        end_popups.style.top = '0';
        end_popups.style.minHeight = '0px';
        end_popups.style.minWidth = '0px';
        end_popups.querySelector('.popups_title').innerText = '';
        end_popups.querySelector('.popups_content').innerHTML = '';
        return 'done';
    };
    await end_popup_close_user_response();

    status_bar.removeChild(completion_status);
    status_bar.removeChild(round_display);
    start_botton.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>'; 
    status_bar.appendChild(start_botton);
    return;
};
start_botton.addEventListener('click',(event) => {
    start();
    return;
});