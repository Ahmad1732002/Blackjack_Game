
function generateAndShuffleDeck(){
    const faces=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const suits=['♥️','♦','♠','♣'];
    const deck=[];
    for(let i=0;i<suits.length;i++){
        for(let j=0;j<faces.length;j++){
            deck.push({'faces':faces[j],'suits':suits[i]});
        }
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    return deck;
}

//source: https://www.w3schools.com/js/js_random.asp


function distributeCards(deck,playerHand,computerHand){
    while(deck.length>0){
       
        computerHand.push(deck.pop());
        playerHand.push(deck.pop());
    }

}

function createCard(hand,className,parentDiv){
    
    const cardBackground=document.createElement('div');
    const cardDetails=document.createElement('p');
    cardDetails.classList.add('bottomText');
    const cardBottomText=hand[hand.length-1].faces+'' +hand[hand.length-1].suits; 
    
    const cardDetails2=document.createElement('p');
    cardDetails2.classList.add('topText');
    const cardTopText=hand[hand.length-1].faces+'' +hand[hand.length-1].suits; 
     
    cardDetails.appendChild(document.createTextNode(cardBottomText));
    cardDetails2.appendChild(document.createTextNode(cardTopText));
    //cardBackground.classList.add('compCardBack');
    cardBackground.classList.add(className);
    
    cardBackground.appendChild(cardDetails);
    cardBackground.appendChild(cardDetails2);

   
    parentDiv.appendChild(cardBackground);

    return hand.pop();

    

}

function displayScore(parentDiv,val){
    const scoreBackground=document.createElement('div');
    let Score;
    if(val==='?'){
        Score='Computer Hand- Total: ' + val;
    }
    else{
        Score='Player Hand- Total: ' + val;
    }

    

    
    
    const scoreText=document.createElement('p');
    scoreText.appendChild(document.createTextNode(Score));

   
   
        scoreText.classList.add('scoreText');
        scoreBackground.appendChild(scoreText);
        scoreBackground.classList.add('playerScore');
        parentDiv.appendChild(scoreBackground);
    return scoreBackground;


}

function updateScore(scoreBackground,newSum){
    const scoreText=document.createElement('p');
    scoreText.appendChild(document.createTextNode('Player Hand- Total: ' + newSum));
    scoreBackground.replaceChild(scoreText,scoreBackground.childNodes[0]);
}
function convertFace(card,currentSum){
    if(card.faces==='J'||card.faces==='Q'||card.faces==='K'){
        return 10;
    }
    else if(card.faces==='A'){
        if(currentSum+11>21){
            return 1;
        }
        else{
            return 11;
        }
        
    }
    else{
        return parseInt(card.faces,10);
    }

}

function calculateScore(card1,card2,currentSum){
    currentSum=convertFace(card1,currentSum);
    currentSum=currentSum+convertFace(card2,currentSum);
    return(currentSum);
    
}

function createButton(text){
    const btn=document.createElement('button');
    const btnText=document.createTextNode(text);
    btn.appendChild(btnText);
    return btn;
}
function displayEndScreen(text){
    const screenLocation=document.querySelector('.buttons');
    screenLocation.replaceChildren();
    const lossBackground=document.createElement('div');
    lossBackground.classList.add('loss');
    
    const lossNode=document.createTextNode(text);
    lossBackground.appendChild(lossNode);
    screenLocation.appendChild(lossBackground);

}
function createForm(){
    const form = document.createElement('form');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const button = document.createElement('button');

    // set the attributes of the elements
    label.setAttribute('for', 'playerInitials');
    label.textContent = 'Player Initials:';
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'playerInitials');
    input.setAttribute('name', 'playerInitials');
    button.setAttribute('type', 'submit');
    button.textContent = 'Submit';
    button.setAttribute('class','formButton');
    

    // add the elements to the form
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);

    // add the form to the document
    document.body.appendChild(form);
   
}
function addSingleEl(element){
    
    const newListEl=document.createElement('li');
    const initialsText='Initials: '+element.initials+'\n';
    const playerScoreText='playerScore: '+element.playerScore+'\n';
    const computerScoreText='computerScore: '+element.computerScore+'\n';
    newListEl.textContent=(initialsText + playerScoreText + computerScoreText); 
    const list=document.querySelector('.list');
    list.appendChild(newListEl);
      
}

function addData(data){
    const list=document.createElement('ul');  
    list.classList.add('list');
    
    data.forEach(element => {
        const newListEl=document.createElement('li');
        const initialsText='Initials: '+element.initials+'\n';
        const playerScoreText='playerScore: '+element.playerScore+'\n';
        const computerScoreText='computerScore: '+element.computerScore+'\n';
        newListEl.textContent=(initialsText + playerScoreText + computerScoreText);
        list.appendChild(newListEl);
    
       
               
    });

    document.body.appendChild(list); 
}
function addHistoryButton(){
    const histBtn=document.createElement('button');
    const histText=document.createTextNode('Show History');
    histBtn.appendChild(histText);
    document.querySelector('.buttons').appendChild(histBtn);
    const newData={};
   
    histBtn.addEventListener('click',async function(){
        newData.playerScore=parseInt(document.querySelector('.playerScoreDiv').childNodes[0].childNodes[0].textContent.split(':')[1],10);
        newData.computerScore=parseInt(document.querySelector('.computerScoreDiv').childNodes[0].childNodes[0].textContent.split(':')[1],10);
      
        document.body.innerHTML='';
        const historyData=await fetch('/api/scores');
        const parsedData=await historyData.json();
        
       
        addData(parsedData);
        createForm();
        const formButton=document.querySelector('.formButton');
    
    
        
        
        formButton.addEventListener('click',async function(evt){
       
            evt.preventDefault();
            const playerInit=document.querySelector('#playerInitials');
            newData.initials=playerInit.value;
       
            
            
            await fetch('/api/scores',{         
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newData)
            }).then(response => console.log(response.status, response.statusText));
        
          
            addSingleEl(newData);
           

            
        });
        





    });

}



function hitEvent(hitBtn,hand,currentSum,playerOrComp,parentDiv,computerSum,computerBackground){
    hitBtn.addEventListener('click',function(){
        const newCard=createCard(hand,'playerCardBack',parentDiv);
        currentSum=currentSum+convertFace(newCard,currentSum);
        updateScore(playerOrComp,currentSum);
        if(currentSum>21){
            displayEndScreen('player lost :(');
            const hiddenCard=document.querySelector('.computerCardBack2');
            hiddenCard.classList.replace('computerCardBack2','computerCardBack');

            updateScore(computerBackground,computerSum);
            addHistoryButton();
        }
        


    });
 

}

function standEvent(stand,computerSum,computerHand,computerDiv,computerBackground,playerSum){
    stand.addEventListener('click',function(){
        while(computerSum<17){
            const compCard=createCard(computerHand,'computerCardBack',computerDiv);
            computerSum=computerSum+convertFace(compCard,computerSum);
            
            if(computerSum>21){
                displayEndScreen('player won yay');
                break;
            }
            
        }
        const hiddenCard=document.querySelector('.computerCardBack2');
        hiddenCard.classList.replace('computerCardBack2','computerCardBack');
        playerSum=parseInt(document.querySelector('.playerScoreDiv').childNodes[0].childNodes[0].textContent.split(':')[1],10);
       

        updateScore(computerBackground,computerSum);
        if(computerSum>=17 &&computerSum<=21){
            if(playerSum>computerSum){
                displayEndScreen('Player won yayy');

            }
            else if(playerSum===computerSum){
                displayEndScreen('It is a tie!!');

            }
            else{
                displayEndScreen('Player lost :(');
            }
        }
        addHistoryButton();
    });
}


function main(){
    
    const button=document.querySelector('.playBtn');
    const formEl=document.querySelector('form');
    const deck=generateAndShuffleDeck();
    const playerHand=[];
    const computerHand=[];
    
    button.addEventListener('click',function(evt){
        evt.preventDefault();
        
        formEl.style.display="none";
        const textInput=document.querySelector('#startValues').value;
       
        distributeCards(deck,playerHand,computerHand);
        if(textInput){
            const splittedText=textInput.split(',');
            const splittedObjects=splittedText.map(card=>{
                return{'faces':card,'suits':'♣'};
            });
            for (let i = splittedObjects.length - 1; i >= 0; i--) {
                deck.push(splittedObjects[i]);
              }
            console.log(deck[deck.length-1]);

        }
        distributeCards(deck,playerHand,computerHand); 

        const computerDiv=document.createElement('div');
        computerDiv.classList.add('computer');

        const playerDiv=document.createElement('div');
        playerDiv.classList.add('player');
        
        const playerScore=document.createElement('div');
        playerScore.classList.add('playerScoreDiv');

        const computerScore=document.createElement('div');
        computerScore.classList.add('computerScoreDiv');

        const buttons=document.createElement('div');
        buttons.classList.add('buttons');
        
        const compCard1=createCard(computerHand,'computerCardBack',computerDiv);
        const compCard2=createCard(computerHand,'computerCardBack2',computerDiv);

        const playerCard1=createCard(playerHand,'playerCardBack',playerDiv);
        const playerCard2=createCard(playerHand,'playerCardBack',playerDiv);

        let playerSum=calculateScore(playerCard1,playerCard2,0);
        const computerSum=calculateScore(compCard1,compCard2,0);

        const hitButton=createButton('Hit');
        const standButton=createButton('Stand');
        hitButton.classList.add('hit');
        standButton.classList.add('stand');
        buttons.appendChild(hitButton);
        buttons.appendChild(standButton);



        const playerScr=displayScore(playerScore,playerSum);
      
        const computerScr=displayScore(computerScore,'?');
        
        
        playerSum=hitEvent(hitButton,playerHand,playerSum,playerScr,playerDiv,computerSum,computerScr);
        standEvent(standButton,computerSum,computerHand,computerDiv,computerScr,playerSum);

        const gameDiv=document.querySelector('.game');

        
        gameDiv.appendChild(computerScore);        
        gameDiv.appendChild(computerDiv);
        gameDiv.appendChild(playerScore);
        gameDiv.appendChild(playerDiv);
        gameDiv.appendChild(buttons);
        
        
    });
    
    


}

document.addEventListener('DOMContentLoaded',main);