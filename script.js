

const start_botton = document.querySelector("#start_button");
const grid = document.querySelector('#container');
const round_display = document.querySelector('#round');
const score_display = document.querySelector('#score');
const status_bar = document.querySelector('#game_status');
const completion_status = document.querySelector('#completion_status');

status_bar.removeChild(round_display);
status_bar.removeChild(score_display);
status_bar.removeChild(completion_status);


var tiles_seq = []; //tile_sq[tile] = pos
var tiles_pos = []; //tiles_pos[pos] = tile

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function start()
{
    window.alert('Game started...');

    
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
    round_display.innerText = "Round 1"
    status_bar.appendChild(round_display);
    status_bar.appendChild(completion_status);

    //create tiles using dom 
    for(let tile_id = 1;tile_id <= 16;tile_id++)
    {
         let tile = document.createElement('div');
         tile.setAttribute('id','tile' + tile_id);
         tile.setAttribute('class','tile');
         tile.innerText = tile_id;
         grid.appendChild(tile);
    }
   
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
            if(target.className == 'tile')
            {
               if(clicked_tiles_num < round)
               {
                let tile_id = parseInt(target.id.substring(4));
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
            tile.style.backgroundColor = "yellow";
            await sleep(600);
            tile.style = prev_style;
        }


        async function user_response()
        {
            
            await sleep(6000);
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

    for(let round = 1;round <= 16;round++)
    {
        round_display.innerText = "Round: "+round;
        completion_status.querySelector('span').style.width = ((round-1)/16)*100 + '%'; 
        completion_status.querySelector('span').innerText = ((round-1)/16)*100 + '%';
        let result = await conduct_round(round);

        let won = result;
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
    
    window.alert("Game over! Score: " + score);


    status_bar.removeChild(completion_status);
    status_bar.removeChild(round_display);
    score_display.innerText = "Score: "+ score; 
    status_bar.appendChild(start_botton);
    status_bar.appendChild(score_display);
    return;
};

start_botton.addEventListener('click',(event) => {
    start();
    return;
});