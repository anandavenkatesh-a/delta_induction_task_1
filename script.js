

//including elements that are required
const start_botton = document.querySelector("#start_button");
const grid = document.querySelector('#container');
const round_display = document.querySelector('#round');
const score_display = document.querySelector('#score');
const status_bar = document.querySelector('#game_status');
const completion_status = document.querySelector('#completion_status');
const start_popups = document.querySelector('#start_game');
const end_popups = document.querySelector('#end_game');
const leader_board = document.querySelector('#leader_board');
const show_leaderboard_button = document.querySelector('#show-leaderboard');
status_bar.removeChild(round_display);
status_bar.removeChild(score_display);
status_bar.removeChild(completion_status);
document.body.removeChild(start_popups);
document.body.removeChild(end_popups);
document.body.removeChild(leader_board);
document.body.removeChild(grid);
document.body.removeChild(show_leaderboard_button);
status_bar.appendChild(show_leaderboard_button);
const vw = window.innerWidth;
const vh = window.innerHeight;
const timer = document.getElementById('count_down');
const context = timer.getContext('2d');
document.body.removeChild(timer);
var first = true;
//info related to tiles
var tiles_seq = []; //tile_sq[tile] = pos
var tiles_pos = []; //tiles_pos[pos] = tile

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
function show_leaderboard()
{
    leader_board.innerHTML = '';
    document.body.appendChild(leader_board);
    let leaderboard_title = document.createElement('div');
    leaderboard_title.classList.add('leaderboard-title');
    leader_board.appendChild(leaderboard_title);
    leaderboard_title.innerHTML = '<span> LeaderBorad </span> <span> <i class="fa-solid fa-trophy"></i> </span>';
    let leaderboard_data = Object.entries(localStorage).sort((p1,p2) => {
        return p2[1] - p1[1];
    });
    for([pname,hscore] of leaderboard_data)
    {
        let player_name = document.createElement('div');
        player_name.classList.add('player-name-container');
        let player_hscore =document.createElement('div');
        player_hscore.classList.add('player-hscore-container');

        leader_board.appendChild(player_name);
        leader_board.appendChild(player_hscore);
        
        player_name.innerHTML = `<span> ${pname} </span>`;
        player_hscore.innerHTML = `<span> ${hscore} </span>`;
    }
    leader_board.style.gridTemplateRows = `repeat(${localStorage.length+1},40px)`;
    
    leader_board_spans = leader_board.querySelectorAll('div span');
    for(span of leader_board_spans)
    {
        span.classList.add('leaderboard-inactive');
        span.classList.add('leaderboard-active');
    }
}
show_leaderboard_button.addEventListener('click',(event) => {
    show_leaderboard();
});
async function start()
{
    //username
    let user_name;
    
    //initialize the page for new game
    status_bar.removeChild(show_leaderboard_button);
    try{
      document.body.removeChild(leader_board);
    }
    catch{}  
    document.body.appendChild(grid); 

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
    
    //start audio
    start_audio.play();
    
    document.body.appendChild(start_popups);
    start_popups.classList.add('active_popups');

    //waiting till user resonse
    start_popups_button = start_popups.querySelector('.popups_content button');
    start_popups_content = start_popups.querySelector('.popups_content input');

    // console.log(start_popups_close);
    async function start_popup_user_response(){
        var user_responded = false;
        start_popups_button.addEventListener('click',(event) => {
            user_name = start_popups_content.value;
            user_responded = true;
        }); 
        
        while(!user_responded)
        {
            await sleep(100);
        }

        start_audio.pause();
        start_audio.currentTime = 0;
        start_popups.classList.remove('active_popups');        
        return 'done';
    };
    await start_popup_user_response();
    
    document.body.removeChild(start_popups);

    //showing round display and completion status of the game
    status_bar.appendChild(round_display);
    status_bar.appendChild(completion_status);

    //create tiles container in grid
    for(let id = 1;id <= 36;id++)
    {
        let tile_container = document.createElement('div');
        tile_container.classList.add('tile_container');
        tile_container.setAttribute('id','tile_container'+id);
        grid.appendChild(tile_container);
    }

    await sleep(1000);

    //fill tiles in tiles container with animation
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
   
    await sleep(1000);
    
    //counduct rounds 
    async function conduct_round(round)
    {        
        
        tiles_seq = [];
        tiles_pos = [];
        
        //choose random tiles
        let length = 36;
        
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

        for(let pos = 1;pos <= round;pos++)
        {
            for(let index = 0;index < 36;index++)
            {
                if(tiles_seq[index] == pos)
                {
                    tiles_pos[pos] = index+1;
                    break;
                }
            }
        }
        
        console.log('round',round,": ",tiles_pos);
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

        status_bar.appendChild(timer);
        context.strokeStyle = '#06FD04';
        context.lineWidth = 3;
        context.fillStyle = '#06FD04';
        context.font = '21px Sans-serif';

        var remaining_time = round*600 + 3000;
        var total_time = remaining_time;

        function show_time()
        {
            context.clearRect(0,0,timer.width,timer.height);
            context.beginPath();
            context.arc(32,32,30,-90,-90 + 2*(remaining_time/total_time)*Math.PI,false);
            context.stroke();             
            context.fillText(Math.floor(remaining_time/1000),27,40);
        }
        
        show_time();
        //for hightlighting tiles 
        for(let pos = 1;pos <= round;pos++)
        {       
            let tile = document.querySelector('#tile' + tiles_pos[pos]);
            let prev_style = tile.style;
            tile.style.backgroundColor = 'yellow';
            tile.style.opacity = '1';
            
            for(let i = 1;i <= 6;i++){
                await sleep(100);
                remaining_time = remaining_time - (100);
                show_time();
            }    
            tile.style = prev_style;
        }

        //checking the status of the round
        async function user_response()
        {
            
            while(remaining_time)
            {
                await sleep(100);
                remaining_time = remaining_time - 100;
                show_time();
            }

            show_time();

            //check the status of the game

            console.log('round',round,": ",clicked_tiles);

            for(let pos = 1;pos <= round;pos++)
            {
                if(clicked_tiles[pos-1] != (tiles_pos[pos]))
                {
                    return Promise.resolve("false");
                }
            }

            return Promise.resolve("true");
        }

        const result = await user_response();  
        status_bar.removeChild(timer);  
        return result;
    }

    let round = 1;
    for(;round <= 36;round++)
    {
        round_display.innerText = ""+round;
        completion_status.querySelector('span').style.width = ((round-1)/36)*100 + '%'; 
        completion_status.querySelector('span').innerText = Math.floor(((round-1)/36)*100) + '%';
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

    if(round == 37)
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
    end_music.play();
    
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

        end_music.pause();
        end_music.currentTime = 0;
        end_popups.classList.remove('active_popups');
        end_popups.querySelector('.popups_title').innerText = '';
        end_popups.querySelector('.popups_content').innerHTML = '';
        return 'done';
    };
    await end_popup_close_user_response();
  
    document.body.removeChild(end_popups);

    //getting ready for next game
    document.body.removeChild(grid);
    start_botton.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>'; 
    status_bar.appendChild(start_botton);
    status_bar.appendChild(show_leaderboard_button);

    //store the score
    if(localStorage.getItem(user_name))
    {
        if(score > localStorage.getItem(user_name))
        {
            localStorage.setItem(user_name,score);   
        }
    }
    else
    {
        localStorage.setItem(user_name,score);
    }

    
    return;
};
start_botton.addEventListener('click',(event) => {
    start();
});