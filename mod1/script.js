

//including elements that are required
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
document.body.removeChild(start_popups);
document.body.removeChild(end_popups);
const vw = window.innerWidth;
const vh = window.innerHeight;

//info related to tiles
var tiles_seq = []; //tile_sq[tile] = pos
var tiles_pos = []; //tiles_pos[pos] = tile

//sleep functionality 
function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createTile(i)
{
   let tile = document.createElement('div');
   tile.classList.add('tile','tile' + i);   
   tile_icon = document.createElement('div');
   tile_icon.innerHTML = '<img class = "tile_icon" src = "./res/note'+ (1 + Math.floor(Math.random()*8))+'.png">  </img>';
   tile_icon.setAttribute('draggable','false');
   tile.appendChild(tile_icon);
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
    
    document.body.appendChild(start_popups);
    start_popups.classList.add('active_popups');
    
    //waiting till user respinse to start the game
    start_popups_close = start_popups.querySelector('button');
    // console.log(start_popups_close);
    async function start_popup_close_user_response(){
        var user_responded = false;
        start_popups_close.addEventListener('click',(event) => {
            console.log('Anand3');
            user_responded = true;
        });  
        
        console.log('Anand1');

        while(!user_responded)
        {
            await sleep(100);
        }

        start_popups.classList.remove('active_popups');        
        return 'done';
    };
    await start_popup_close_user_response();
    
    document.body.removeChild(start_popups);

    //showing round display and completion status of the game
    status_bar.appendChild(round_display);
    status_bar.appendChild(completion_status);

    //create tiles container in grid
    for(let id = 1;id <= 16;id++)
    {
        let tile_container = document.createElement('div');
        tile_container.classList.add('tile_container');
        tile_container.setAttribute('id','tile_container'+id);
        grid.appendChild(tile_container);
    }

    await sleep(1000);

    //fill the tiles
    for(let tile_id = 1;tile_id <= 16;tile_id++)
    {
         let tile = await createTile(1+ Math.floor(Math.random()*4));  
         tile.setAttribute('id','tile'+tile_id);          
         document.querySelector('#tile_container'+tile_id).appendChild(tile);
    }
   
    await sleep(1000);
    
    // //counduct rounds 
    async function conduct_round(round)
    {        
        
        tiles_seq = [];
        tiles_pos = [];
        
        //choose random tiles
        let length = 16;
        
        var pos_alloted_tiles = 0;
        while(pos_alloted_tiles < round)
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
    
        //managing user clicks
        let clicked_tiles = [];
        let clicked_tiles_num = 0;
        let tiles = grid.querySelectorAll('.tile');
        for(e of tiles)
        {
            let tile = e; 
            tile.addEventListener('click',(event) => {
                 let id = parseInt(tile.id.substr(4));
                 console.log(id);
                 clicked_tiles.push(id);
                 clicked_tiles_num++;
             })
        }

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

        //checking the status of the round
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
    
    //removing tiles
    grid.innerHTML = '';
    status_bar.removeChild(completion_status);
    status_bar.removeChild(round_display);

    //show end game popups and start music

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
    
    document.body.appendChild(end_popups);
    end_popups.classList.add('active_popups');
    
    //waiting till user response
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

        end_popups.classList.remove('active_popups');
        end_popups.querySelector('.popups_title').innerText = '';
        end_popups.querySelector('.popups_content').innerHTML = '';
        return 'done';
    };
    await end_popup_close_user_response();
  
    document.body.removeChild(end_popups);

    //getting ready for next game
    start_botton.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>'; 
    status_bar.appendChild(start_botton);
    return;
};


start_botton.addEventListener('click',(event) => {
    start();
});