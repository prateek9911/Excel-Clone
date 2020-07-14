//there will be 4 things - - - -
// 1.value   2. formula  3. upstream ka array  4. downstream ka array

const $  = require('jquery');

$(document).ready(function (){

    let data = [];
    let lsc;  //last click

    $('#grid .cell').on('click', function () {
        
        //catch last clicked cell  -- done
        lsc = this;


        let rid = parseInt($(this).attr('r-id'));
        let cid = parseInt($(this).attr('c-id'));

        let cidAddr = String.fromCharCode(cid + 65);
        $('#text-input').val(cidAddr + (rid + 1));

        //update formula bar value

        
    })

    $('#grid .cell').on('blur', function(){
        //if value is not changed do nothing

        //return without doing anything

        //delete formula

        //update dependent cells or dwonstream array
        
    })

    $('#formula-input').on('blur', function() {

        // find a way to work on last clicked cell

        //delete the exixting formula from that cell

        //set the new formula for that cell

        //evaluate value from the formula

        //update cell and dependents
    })Formula 

// 1. Delete formula function

function deleteFormula(cellObject){


}

//2. Evaluate function

function evaluate(cell) {

}

//3. Set formula value of cell

    function setFormula(cellObject,formula){
        formula  = formula.replace('(','').replace(')','');
        
        let formulaComponents = formula.split(' ');

        for(let i=0;i<formulaComponents.length;i++){

            //find the alphabet's value i.e from A2 find A
            let chCode = formulaComponents[i].charCodeAt(0);

            if(chCode>=65 && chCode<=90){

                let upstreamAddress = indicesFromAddress(formulaComponents[i]);
                let myIndices = getIndices(cellObject);
                //set my upstream to cells I am dependent on
                data[myIndices.rid][myIndices.cid].upstream.push({
                    rid:upstreamAddress.rid,
                    cid:upstreamAddress.cid
                })

                //set their downstream
                //as in jispe me depend kar ra hu uske downstream me mujhe daal do taaki agr wo change
                //ho to me bh change ho jau
                data[upstreamAddress.rid][upstreamAddress.cid].downstream.push({
                    rid : myIndices.rid,
                    cid : myIndices.cid
                })
            }
        }
    }

    function getIndices(cellObject){
        let rid = parseInt($(this).attr('r-id'));
        let cid = parseInt($(this).attr('c-id'));

        return {
            rid: rid,
            cid : cid
        }
    }


    function indicesFromAddress(cellAddress){
        let rid = parseInt(cellAddress.substr(1));
        let cid = cellAddress.charCodeAt(0) - 65;


        return {
            rid : rid -1,
            cid : cid
        }
    }
//4. update cell values
function updateCell(cellObject){

}   




//initialization function

    function init(){
        data = [];
        $('#grid').find('.row').each(function () {

            let row = [];
            $(this).find('.cell').each(function (){
                let cell = {
                    value : '',
                    formula : '',
                    upstream : [],
                    downstream : []
                }
                $(this).html(cell.value);
                row.push(cell);
            })
            data.push(row);
        })
        console.log(data);
    }

    init();
})