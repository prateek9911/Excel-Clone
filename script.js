//there will be 4 things - - - -
// 1.value   2. formula  3. upstream ka array  4. downstream ka array

const $  = require("jquery");
const dialog = require("electron").remote.dialog;
const fs = require("fs");
$(document).ready(function (){

    let data = [];
    let lsc;  //last selected cell

    $('#grid .cell').on('click', function () {
        
        //catch last clicked cell  -- done
        lsc = this;


        let rid = parseInt($(this).attr('r-id'));
        let cid = parseInt($(this).attr('c-id'));

        let cidAddr = String.fromCharCode(cid + 65);
        $('#text-input').val(cidAddr + (rid + 1));

        //update formula bar value
        
    });

    $("#new").on("click", function () {
        data = [];
        $('#grid').find('.row').each(function () {

            let row = [];
            $(this).find('.cell').each(function (){
                let cell = {
                    value : "",
                    formula : "",
                    upstream : [],
                    downstream : []
                }
                $(this).html(cell.value);
                row.push(cell);
            })
            data.push(row);
        })
        console.log(data);
        $("#grid .cell").eq(0).trigger("click");
    })

    $("#save").on("click", async function () {
        // var input = $(document.createElement('input')); 
        //     input.attr("type", "file");
        //     input.trigger('click');
        //     return false;
        let sdb = await dialog.showOpenDialog();
        let fp = sdb.filePaths[0];
        if(fp == undefined){
            console.log("Plaease select a file");
            return;
        }
        let jsonData = JSON.stringify(data);
        fs.writeFileSync(fp, jsonData);
     });

     $("#open").on("click", async function () {
         let sdb = await dialog.showOpenDialog();
        let fp = sdb.filePaths[0];
        if(fp == undefined){
            console.log("Plaease select a file");
            return;
        }
        let buffer = fs.readFileSync(fp);
        data = JSON.parse(buffer);
        let allRows = $("#grid").find(".row");
        for(let i=0; i< allRows.length; i++){
            let allCol = $(allRows[i]).find(".cell");
            for(let j =0; j<allCol.length;j++) {

                $(`#grid .cell[r-id=${i}][c-id = ${j}]`).html(data[i][j].value);
            }
        }        
     });


//***********Formula wala kaam **************************/
 
    $('#grid .cell').on('blur', function(){
        //when we type anything in cells we want its value to be updated in data  array
        let {rid, cid} = getIndices(this);
        // data[rid][cid].value = $(this).text();
        

        let cellObject = getCell(this);
        //agr kisi cell pe click kar diya hai
        
        //if value is not changed do nothing
        //return without doing anything
        if(cellObject.value == $(this).html()){
            lsc = this;
            return;
        }

        //if value is updated delete formula
        if( cellObject.formula) {
            deleteFormula(cellObject , this);
        }

        cellObject.value = $(this).text();

        //update dependent cells or downstream array
        updateCell(rid,cid,cellObject.value);

        lsc = this;
        // console.log(data);
        
    })

    $('#formula-input').on('blur', function() {

        // find a way to work on last clicked cell
        
        let cellObject = getCell(lsc);
        if(cellObject.formula == $(this).val()){
            return;
        }
        
        let { rid, cid } = getIndices(lsc);
        //delete the exixting formula from that cell
        if(cellObject.formula){

            deleteFormula(cellObject,lsc);
        }

        cellObject.formula = $(this).val();
        //set the new formula for that cell
        setFormula(lsc,cellObject.formula);

        //evaluate value from the formula
        let nVal = evaluate(cellObject);
        console.log(nVal);
        //update cell and dependents and made changes to UI
        updateCell(rid, cid, nVal, true);
    })


function getIndices(cellObject){
        let rid = parseInt($(cellObject).attr('r-id'));
        let cid = parseInt($(cellObject).attr('c-id'));

        return {
            rid: rid,
            cid : cid
        }
    }
    function getCell(address){
        let { rid , cid } = getIndices(address);
        return data[rid][cid];
    }
// 1. Delete formula function

function deleteFormula(cellObject,cellElement){
    cellObject.formula = "";
    let {rid, cid} = getIndices(cellElement);
    for (let i=0; i< cellObject.upstream.length; i++){
        let uso = cellObject.upstream[i];
        let fuso = data[uso.rid][uso.cid];

        let fArr = fuso.downstream.filter( function (dCell) {
            return !(dCell.cid == cid && dCell.rid == rid);
        })
        fuso.downstream = fArr;
    }
    cellObject.upstream = [];
}

//2. Evaluate function



//3. Set formula value of cell

    function setFormula(cellElement,formula){
        console.log("3rd consoel " + formula);
        //formula --- (A1 + B1)
        formula  = formula.replace("(", "").replace(")", "");
        //formula -- A1 +B1
        let formulaComponents = formula.split(" ");
        // formula -- [A1 , + , B1]
        for(let i=0;i<formulaComponents.length;i++){

            //find the alphabet's value i.e from A2 find A
            let chCode = formulaComponents[i].charCodeAt(0);

            if(chCode>=65 && chCode<=90){
                let { r, c } = getRC(formulaComponents[i],chCode);
                let parentCell = data[r][c]

                let { cid, rid} = getIndices(cellElement);
                
                let cell = getCell(cellElement);
                //set my upstream to cells I am dependent on
                cell.upstream.push({
                    cid: c,
                    rid: r
                })

                //set their downstream
                //as in jispe me depend kar ra hu uske downstream me mujhe daal do taaki agr wo change
                //ho to me bh change ho jau
                parentCell.downstream.push({
                    cid: cid,
                    rid:  rid
                });
            }
        }
        console.log(formula);
    }

   

    function getRC(cellName, charAt0){
        let sArr = cellName.split("");
        sArr.shift();
        let sRow = sArr.join("");
        let r = Number(sRow) -1;
        let c = charAt0 - 65;
        return { r, c};
    }


    

function evaluate(cellObject) {
    // upstream me jaunga waha se unki values layenge
    let formula = cellObject.formula;
    console.log(formula);
    for(let i=0; i<cellObject.upstream.length; i++){
        let cuso = cellObject.upstream[i];
        let colAddress = String.fromCharCode(cuso.cid +65);
        let cellAddress = colAddress + (cuso.rid + 1);
        let fusokivalue = data[cuso.rid][cuso.cid].value;
        
        formula = formula.replace(cellAddress, fusokivalue);
    }

    console.log(formula);
    return eval(formula);
}

//4. update cell values
function updateCell(rid,cid,nVal){
    let cellObject = data[rid][cid];
    cellObject.value = nVal;
    //update ui
    $(`#grid .cell[r-id=${rid}][c-id = ${cid}]`).html(nVal);
    
    for(let i=0;i<cellObject.downstream.length;i++){
        let downstremCoordinates = cellObject.downstream[i];
        let dso = data[downstremCoordinates.rid][downstremCoordinates.cid];
        let dsoNval = evaluate(dso);
        updateCell(downstremCoordinates.rid,downstremCoordinates.cid,dsoNval);
    }

}   




//initialization function

    function init(){
        $("#new").click();
        // data = [];
        // $('#grid').find('.row').each(function () {

        //     let row = [];
        //     $(this).find('.cell').each(function (){
        //         let cell = {
        //             value : "",
        //             formula : "",
        //             upstream : [],
        //             downstream : []
        //         }
        //         $(this).html(cell.value);
        //         row.push(cell);
        //     })
        //     data.push(row);
        // })
        // console.log(data);
    }

    init();
})

