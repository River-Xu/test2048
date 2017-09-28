//
getBestScore();
generateCell();
action();


$('.restart-button').on('click',function(){
    saveBestScore();
    window.location.reload();
});

document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if( Math.abs( deltax ) < 0.3*documentWidth && Math.abs( deltay ) < 0.3*documentWidth )
        return;

    if( Math.abs( deltax ) >= Math.abs( deltay ) ){

        if( deltax > 0 ){
            //move right
            goRight();
            getScore();
            isGameOver();    
        }
        else{
            //move left
            goLeft();
            getScore();
            isGameOver();    
        }
    }
    else{
        if( deltay > 0 ){
            //move down
            goDown();
            getScore();
            isGameOver();    
        }
        else{
            //move up
            goUp();
            getScore();
            isGameOver();    
        }
    }
});

//生成初始cell
function generateCell(){
    let cell1,cell2;
    while(true){
        let x1 = parseInt(Math.random()*4)+1;
        let x2 = parseInt(Math.random()*4)+1;
        let y1 = parseInt(Math.random()*4)+1;
        let y2 = parseInt(Math.random()*4)+1;
        let value1 = Math.random()<0.5?2:4;
        let value2 = Math.random()<0.5?2:4;
        if(x1 != x2 && y1 != y2){
            cell1 = new Cell(x1,y1,value1);
            cell2 = new Cell(x2,y2,value2);
            break;
        }        
    }
    
    $('.grid-container').after(`<div class="tile-container">
                                    <div class="exitcell tile tile-${cell1.value} tile-position-${cell1.x}-${cell1.y} tile-new">
                                        <div class="tile-inner" style="font-size: 45px; font-family: 黑体; overflow: hidden;">${cell1.value}</div>
                                    </div>
                                </div>
                                <div class="tile-container">
                                    <div class="exitcell tile tile-${cell2.value} tile-position-${cell2.x}-${cell2.y} tile-new">
                                        <div class="tile-inner" style="font-size: 45px; font-family: 黑体; overflow: hidden;">${cell2.value}</div>
                                    </div>
                                </div>`);

};

function action(){
    $(document).keydown(function(e){       
        switch(window.event.keyCode){
            case 37:
                goLeft();
                getScore();
                isGameOver();              
                break;
            case 38:
                goUp();
                getScore();
                isGameOver();
                break;
            case 39:
                goRight();
                getScore();
                isGameOver();
                break;
            case 40:
                goDown();
                getScore();
                isGameOver();   
                break;
            default:
                break;
        }
    });
};

function newCell(){
    let position =[];
    let cell;
    $('.exitcell').each(function(){
        position.push(getPostion($(this)));            
    });
    while(true){
        let count=0;
        let x = parseInt(Math.random()*4)+1;
        let y = parseInt(Math.random()*4)+1;
        let po = [x,y];
        for(let i=0;i<position.length;i++){
            if(position[i].toString() != po.toString())
            {          
                count++; 
            }  
        }
        if(count == position.length){
            let value = Math.random()<0.5?2:4;  
            cell = new Cell(x,y,value);  
            break;
        }
    }
     
    $('.grid-container').after(`<div class="tile-container">
                                    <div class="exitcell tile tile-${cell.value} tile-position-${cell.x}-${cell.y} tile-new">
                                        <div class="tile-inner" style="font-size: 45px; font-family: 黑体; overflow: hidden;">${cell.value}</div>
                                    </div>
                                </div>`);
};

function getScore(){
    let score = 0;
    $('.exitcell').each(function(){
        score += parseInt(getValue($(this)));
    });
    let bscore = getBestScore();
    if(score>=bscore){
        $('.best-container').text(score);
    }
    $('.score-container').text(score);
    return score;
};

function saveBestScore(){
    let oldscore = getBestScore();
    let curscore = getScore();
    if(curscore>=oldscore){
        localStorage.setItem('bestScore',curscore);
    }
    else{
        localStorage.setItem('bestScore',oldscore);
    }   
};

function getBestScore(){
    let bscore = localStorage.getItem('bestScore');
    $('.best-container').text(bscore);
    return bscore;
}


function isGameOver(){
    if($('.exitcell').length == 16){
        alert('game over');
    }else{
        newCell();
    }

};



function trushNew(){
    $('.exitcell').each(function(){            
        let classarr = $(this).attr('class').split('tile-new');
        $(this).attr('class',classarr[0].trim());    
    });
}


function move(cell,x,y,value){
    let recell = getCell(x,y);
    if(recell!='empty')
    {
        recell.parent().remove();
    }
    
    cell.attr('class',`exitcell tile tile-${value} tile-position-${x}-${y}`);
    cell.find('div').text(value);
};

function getPostion(cell){
    let position = [];
    let str = cell.attr('class').split(/-| /);
    for (let i = 0; i < str.length-1; i++) {                   
        if(str[i].length==1 && str[i+1].length==1)
        {  
            position = [parseInt(str[i]),parseInt(str[i+1])];

        }
    }
    return position;
};

function getValue(cell){
    let value = cell.find('div').text();
    return value;
};

function getCell(x,y){
    let cell = '';
    $('.exitcell').each(function(){
        let position = getPostion($(this));
        if(position[0] == x && position[1] == y){
            cell = $(this);
        }
    });
    return cell == ''?'empty':cell;

};

function goUp(){
    trushNew();
    let arr = sortCell('up');

    for(let a = 0; a < arr.length; a++){

        let cell = arr[a][2];       
        let cellpo = getPostion(cell);
        let cellvalue = getValue(cell);

        let range = cellpo[1]-1;

        for(let r = 1; r <= range; r++)
        {
            
            let nextcell = getCell(cellpo[0],cellpo[1]-r);
            let nextcellpo = [cellpo[0],cellpo[1]-r];
            if(nextcell != 'empty'){ //exist
                let nextcellvalue = getValue(nextcell);
                if(cellvalue == nextcellvalue){
                    move(cell,nextcellpo[0],nextcellpo[1],cellvalue*2);
                }
                break;
            }
            else{ // not exist
                move(cell,nextcellpo[0],nextcellpo[1],cellvalue);
            }
        }

        
    }
};

function goLeft(){
    trushNew();
    let arr = sortCell('left');

    for(let a = 0; a < arr.length; a++){

        let cell = arr[a][2];
        let cellpo = getPostion(cell);
        let cellvalue = getValue(cell);

        let range = cellpo[0]-1;
        
        for(let r = 1; r <= range; r++)
        {
            let nextcell = getCell(cellpo[0]-r,cellpo[1]);
            let nextcellpo = [cellpo[0]-r,cellpo[1]];
            if(nextcell != 'empty'){ //exist
                let nextcellvalue = getValue(nextcell);
                if(cellvalue == nextcellvalue){
                    move(cell,nextcellpo[0],nextcellpo[1],cellvalue*2);
                    
                }
                break;
            }
            else{ // not exist
                move(cell,nextcellpo[0],nextcellpo[1],cellvalue);
            }
        }
        
    }
};

function goRight(){
    trushNew();
    let arr = sortCell('right');

    for(let a = 0; a < arr.length; a++){

        let cell = arr[a][2];
        let cellpo = getPostion(cell);
        let cellvalue = getValue(cell);


        let range = 4 - cellpo[0];
        
        for(let r = 1; r <= range; r++)
        {
            
            let nextcell = getCell(parseInt(cellpo[0])+r,cellpo[1]);
            let nextcellpo = [parseInt(cellpo[0])+r,cellpo[1]];
            
            if(nextcell != 'empty'){ //exist
                let nextcellvalue = getValue(nextcell);
                if(cellvalue == nextcellvalue){
                    move(cell,nextcellpo[0],nextcellpo[1],cellvalue*2);
                    
                }
                break;
            }
            else{ // not exist
                move(cell,nextcellpo[0],nextcellpo[1],cellvalue);
            }

        }
        
    }
};

function goDown(){
    trushNew();
    let arr = sortCell('down');

    for(let a = 0; a < arr.length; a++){

        let cell = arr[a][2];
        let cellpo = getPostion(cell);
        let cellvalue = getValue(cell);


        let range = 4 - cellpo[1];
        
        for(let r = 1; r <= range; r++)
        {
            let nextcell = getCell(cellpo[0],parseInt(cellpo[1])+r);
            let nextcellpo = [cellpo[0],parseInt(cellpo[1])+r];
            
    
            if(nextcell != 'empty'){ //exist
                let nextcellvalue = getValue(nextcell);
                if(cellvalue == nextcellvalue){
                    move(cell,nextcellpo[0],nextcellpo[1],cellvalue*2);   
                }
                break;
            }
            else{ // not exist
                move(cell,nextcellpo[0],nextcellpo[1],cellvalue);
            }
        }
        
    }
};



function sortCell(o){ 
    let arr = [];
    $('.exitcell').each(function(){            
        let cell = $(this);
        let x = getPostion(cell)[0];
        let y = getPostion(cell)[1];
        arr.push([x,y,cell]);
    });

    switch(o){
        case 'up':
            arr.sort(function(a,b){
                return a[1] - b[1];
            });
            break
        case 'left':
            arr.sort(function(a,b){
                return a[0] - b[0];
            });
            break;
        case 'right':
            arr.sort(function(a,b){
                return b[0] - a[0];
            });
            break;
        case 'down':
            arr.sort(function(a,b){
                return b[1] - a[1];
            });
            break;

    }
    /* let resultarr = [...new Set(arr)];  */


    return arr;
    
}



