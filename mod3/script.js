

//including elements that are required
const start_botton = document.querySelector("#start_button");
const grid = document.body.querySelector('#container');
const round_display = document.querySelector('#round');
const score_display = document.querySelector('#score');
const status_bar = document.querySelector('#game_status');
const completion_status = document.querySelector('#completion_status');
const start_popups = document.querySelector('#start_game');
const end_popups = document.querySelector('#end_game');
const conduct_popup = document.querySelector('#conduct-popup');
const proceed_section = document.body.querySelector('#proceed');
status_bar.removeChild(round_display);
status_bar.removeChild(score_display);
status_bar.removeChild(completion_status);
document.body.removeChild(start_popups);
document.body.removeChild(end_popups);
const vw = window.innerWidth;
const vh = window.innerHeight;
var first = true;

//sleep functionality 
function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

//setting up the audio elements
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
async function start(){
    var users = new Array();
    var times = new Array();
    var tiles_pos = [];

    status_bar.removeChild(start_botton);
    document.body.appendChild(grid);
    grid.innerHTML = '';
    //start_music
    start_audio.play();

    //get user1 and user2
    document.body.appendChild(start_popups);
    start_popups.classList.add('active_popups');  
    

    async function user_response(){
        let button_clicked = false;
        start_popups.querySelector('button').addEventListener('click',(event) => {
            users[1] = start_popups.querySelector('#user_name1').value;
            users[2] = start_popups.querySelector('#user_name2').value;
            if(users[1] != '' && users[2] != '')
            {
               button_clicked = true;
            }
        });

        while(!button_clicked)
        {
            await sleep(100);
        }

        start_audio.pause();
        start_audio.currentTime = 0;
        start_popups.classList.remove('active_popups');
        document.body.removeChild(start_popups);

        return 'done';
    }

    await user_response();

    //show tiles

     //create tiles container in grid
     for(let id = 1;id <= 36;id++)
     {
         let tile_container = document.createElement('div');
         tile_container.classList.add('tile_container');
         tile_container.setAttribute('id','tile_container'+id);
         grid.appendChild(tile_container);
     }

    //fill tiles with aniamtion 
    for(let tile_id = 1;tile_id <= 36;tile_id++)
    {
         let tile = await createTile(1+ Math.floor(Math.random()*4));  
         tile.setAttribute('id','tile'+tile_id);          
         document.querySelector('#tile_container'+tile_id).appendChild(tile);
         tile.animate([
            {
                transform:'scale(0)',
                top:'-'+(grid.getBoundingClientRect().y + (window.innerHeight*0.2*(Math.floor(tile_id/4))))+'px',

            },
            {
                transform:'scale(1)',
                top:'0px' 
            }
        ],{
            duration:60,
            easing:'ease-in'
        });  
        tile_fall.play();
        tile_fall.currentTime = 0;
        await sleep(100);
    }

    sleep(1000);

    async function set(playerNum)
    {
        //show popup
        document.body.appendChild(conduct_popup);
        const popups_message = conduct_popup.querySelector('.popups-message');
        var playerNum1;
        if(playerNum == 1)
        {
            playerNum1 = 2;
        }
        else
        {
            playerNum1 = 1;
        }
        popups_message.innerHTML = `${users[playerNum]} Set pattern for ${users[playerNum1]}`;
        conduct_popup.classList.add('active_popups');
        
        var popup_button = conduct_popup.querySelector('.close_popups button');
        
        async function user_response_closepopups(){
            var responded = false;
            popup_button.addEventListener('click',(event) => {
                responded = true;  
            });

            while(!responded)
            {
                await sleep(100);
            }

            popups_message.innerHTML = '';
            conduct_popup.classList.remove('active_popups');
            document.body.removeChild(conduct_popup);
            return 'done';
        }

        await user_response_closepopups();
      
        //add req elements
        let tiles = grid.querySelectorAll('.tile');
        var tileNum = 1;

        let mark_pos = (tile) => {
            let tile_icon = tile.querySelector('img');
                if(tile_icon.style.height != '0px')
                {
                    let id = parseInt(tile.id.substr(4));
                    tiles_pos[tileNum] = id;
                    
                    
                    tile_icon.style.height = '0px';
                    tile_icon.style.width = '0px';
   
                    let pos = document.createElement('span');
                    pos.innerText = `${tileNum}`;
                    tile.appendChild(pos);
   
                    tileNum++;
                }
        };

        for(e of tiles)
        {
            let tile = e; 
            tile.addEventListener('click',(event) =>{
                mark_pos(tile);
            });
        }

        const finish_set = document.createElement('button');
        finish_set.innerText = 'Setted';
        finish_set.setAttribute('id','finish-set');
        proceed_section.appendChild(finish_set);
        
        async function user_response_finish_set()
        {
            let responded = false;

            finish_set.addEventListener('click',(event) => {
                if(tiles_pos.length > 1)
                {
                   responded = true;       
                }
            });

            while(!responded)
            {
                await sleep(100);
            }

            return 'done';
        }
        
        await user_response_finish_set();
        
        console.log(tiles_pos);
        //remove req elements
        proceed_section.removeChild(finish_set);
        for(let tilePos = 1;tilePos < tileNum;tilePos++)
        {
            let tile = document.body.querySelector('#tile'+tiles_pos[tilePos]);
            let pos = tile.querySelector('span');    
            tile.removeChild(pos);
            let tile_icon = tile.querySelector('img');
            tile_icon.style.height = '30px';
            tile_icon.style.width = '30px'; 
        }

        mark_pos = (tile) => {};
        console.log(tiles_pos);
    }  
    async function play(playerNum)
    {
        //show popup
        document.body.appendChild(conduct_popup);
        const popups_message = conduct_popup.querySelector('.popups-message');
        var playerNum1;
        if(playerNum == 1)
        {
            playerNum1 = 2;
        }
        else
        {
            playerNum1 = 1;
        }
        popups_message.innerHTML = `${users[playerNum]} Start Playing`;
        conduct_popup.classList.add('active_popups');
        
        var popup_button = conduct_popup.querySelector('.close_popups button');
        
        async function user_response_closepopups(){
            var responded = false;
            popup_button.addEventListener('click',(event) => {
                responded = true;  
            });

            while(!responded)
            {
                await sleep(100);
            }

            popups_message.innerHTML = '';
            conduct_popup.classList.remove('active_popups');
            document.body.removeChild(conduct_popup);
            return 'done';
        }

        await user_response_closepopups();
      
        //render UI to user and collect the user response

        async function conduct()
        {        
            
            //managing user clicks
            let clicked_tiles_num = 0;
            var game_over = false;
            let selectTile = (tile) =>{
                let id = parseInt(tile.id.substr(4));
                 if(tiles_pos[clicked_tiles_num+1] != id)
                 {
                    game_over = true;
                    return;
                 }
                 else
                 {
                     clicked_tiles_num++;
                 }

                 if(clicked_tiles_num == tiles_pos.length-1)
                 {
                     game_over = true;
                     return;
                 }
            };
            let tiles = grid.querySelectorAll('.tile');
            for(e of tiles)
            {
                let tile = e; 
                tile.addEventListener('click',(event) => {
                    selectTile(tile);
                })
            }

            //for hightlighting tiles 
            for(tileId of tiles_pos)
            {       
                if(tileId)
                {
                    let tile = document.body.querySelector('#tile' + tileId);
                    let prev_style = tile.style;
                    tile.style.backgroundColor = 'yellow';
                    tile.style.opacity = '1';
                    
                    let tile_clicked = false;
                    tile.addEventListener('click',(event) => {
                        tile_clicked = true;
                    })
                    for(let i = 1;i <= 18;i++)
                    {
                        if(tile_clicked||game_over)
                        {
                            tile.style = prev_style;
                            break;
                        }
                        await sleep(50);
                    }
                    tile.style = prev_style;
                }
            }

            //check status of the game and wait for user response
            async function wait_for_clicks(){
                while(!game_over)
                {
                    await sleep(50);
                }

                if(clicked_tiles_num == tiles_pos.length-1)
                {
                   return 'true';
                }
                else
                {
                   return 'false';
                }
            }

            const result = await wait_for_clicks();  
            selectTile = (tile) => {};    
            return result;
        }

        let result = await conduct();
 
        if(result == 'false')
        {
             end_music.play();
             document.body.appendChild(conduct_popup);
             let popups_message = conduct_popup.querySelector('.popups-message');

             popups_message.innerHTML = `${users[playerNum1]} Won`;
             conduct_popup.classList.add('active_popups');
        
             let popup_button = conduct_popup.querySelector('.close_popups button');
        
             async function user_response_endgame(){
                  var responded = false;
                  popup_button.addEventListener('click',(event) => {
                    responded = true;  
                  });

                  while(!responded)
                  {
                   await sleep(100);
                  }

                  end_music.pause();
                  end_music.currentTime = 0;
                  popups_message.innerHTML = '';
                  conduct_popup.classList.remove('active_popups');
                  document.body.removeChild(conduct_popup);
                  return 'done';
            }

           await user_response_endgame();
        }

        return result;
    }

    var game_ended = false;
    var game_status = 0;
    //game_status = 0 => p1 is setting
    //game_status = 1 => p1 is playing
    //game_status = 2 => p2 is setting
    //game_status = 3 => p2 is playing

    while(!game_ended)
    {
            if(game_status == 0){
                tiles_pos = [];
                await set(1);
            }        
            else if(game_status == 1)
            {
                const result = await play(1);
                if(result == 'false')
                {
                    game_ended = true;
                }   
            }                
            else if(game_status == 2)
            {
                tiles_pos = [];
                await set(2);
            }                
            else 
            {
                const result = await play(2);
                if(result == 'false')
                {
                    game_ended = true;
                }
            }
                

        if(game_status)
        {
            game_status = game_status -1;
        }
        else
        {
            game_status = 3;
        }
    }

    //ready for next game
    document.body.removeChild(grid);
    start_botton.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>'; 
    status_bar.appendChild(start_botton);
}
start_botton.addEventListener('click',(event) => {
    start();
});