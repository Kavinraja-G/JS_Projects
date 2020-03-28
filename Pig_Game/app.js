
var activeplayer,scores,Gamestatus,roundscore,player0,player1;
//Player Inputs
player0 = prompt("Enter the Player 0 Name");
player1 = prompt("Enter the Player 1 Name");

init();

document.querySelector('.btn-new').addEventListener('click', init);
document.querySelector('.btn-roll').addEventListener('click', function()
{
    if(Gamestatus)
    {
        var dice = Math.floor(Math.random() * 6 + 1);
        
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-'+ dice +'.png';
        
        if(dice!=1){
            roundscore+=dice;
            document.querySelector('#current-'+ activeplayer).textContent = roundscore;
        }
        else{
            NextPlayer();
        }

    }
});

document.querySelector('.btn-hold').addEventListener('click',function(){
    if(Gamestatus)
    {
        scores[activeplayer]+=roundscore;
        document.querySelector('#score-'+ activeplayer).textContent = scores[activeplayer];

        if(scores[activeplayer]>=100)
        {
            document.querySelector('#name-'+ activeplayer).textContent = 'WINNER';
            document.querySelector('.player-' + activeplayer +'-panel').classList.add('winner');
            document.querySelector('.player-' + activeplayer +'-panel').classList.remove('active');
            Gamestatus = false;
        }
        else{
            NextPlayer();
        }
    }
});

function NextPlayer()
{
    if(activeplayer === 0) activeplayer = 1;
    else  activeplayer = 0;
    
    roundscore = 0;
    document.querySelector('#current-0').textContent = 0;
    document.querySelector('#current-1').textContent = 0;
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.dice').style.display = 'none';
}

function init()
{
    scores=[0,0];
    activeplayer=0;
    roundscore=0;
    document.querySelector('#score-0').textContent = 0;
    document.querySelector('#score-1').textContent = 0;
    document.querySelector('#current-0').textContent = 0;
    document.querySelector('#current-1').textContent = 0;
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('name-0').textContent = player0;
    document.getElementById('name-1').textContent = player1;
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    Gamestatus =true;
}