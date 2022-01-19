
sheetAddIcon.addEventListener("click" , (e)=>{
    //add new sheets when sheet icon is clicked
    //create new div regaring a sheet
    //add it in sheet container
    let sheet = document.createElement("div");
    sheet.setAttribute("class" ,"sheet-folder");

    //Now we are providing a unique id to a sheet so that we can access it whenever needed
    let allSheets = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id" , allSheets.length);

    //provide the inner html to the sheet folder
    sheet.innerHTML =  `
           <div class="sheet-content">Sheet ${allSheets.length + 1}</div>
           `;
    sheetFolderCont.appendChild(sheet);

    //sheet storage work
    createSheetDB();
    createGraphComponent();

    //if there is any click in any of the sheet
    clickSheetActiveness(sheet);
    handleSheetRemoval(sheet);

    sheet.click();
})

//function to handle sheet removal
function handleSheetRemoval(sheet){
    //here if we use right key then it the sheet will delete
    sheet.addEventListener("mousedown", (e)=>{
        
        if(e.button !== 2)return;

        //there must be mandatory one sheet 
        let allSheets = document.querySelectorAll(".sheet-folder");
        if(allSheets.length === 1)return;

        //ask the user if he/she wants to delete the sheet or not
        let response = confirm("Are you sure to delete the particular sheet?");
        if(response === false)return ;

        let sheetId = Number(sheet.getAttribute("id"));

        //1.remove from DB
        collectedCellDB.splice(sheetId,1);
        collectedGraphComponent.splice(sheetId,1);

        //2.remove from UI
        sheet.remove();

        //3.make the first sheet aas active sheet
        cellDB = collectedCellDB[0];
        graphComponent = collectedGraphComponent[0];
        handleUIProperties();

        //make the sheet number on ui correct
        handleSheetUiRemoval();
    })
}

function handleSheetUiRemoval(){
    let allSheets = document.querySelectorAll(".sheet-folder");
    for(let i= 0 ;i < allSheets.length; i++){
        allSheets[i].setAttribute("id", i);
        let sheetContent = allSheets[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheets[i].style.backgroundColor = "transparent";
    }
    allSheets[0].style.backgroundColor = "lightgray";
}

//funtion to handle sheet activeness
function handleSheetActiveness(sheet){
    let allSheets = document.querySelectorAll(".sheet-folder");
    for(let i=0 ;i< allSheets.length; i++){
        allSheets[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "lightgray";
}

//funtion to handle all ui properties
function handleUIProperties(){
    for(let i=0 ;i<rows ;i++){
        for(let j=0; j<cols ;j++){
            //select the particular cell and once click it
            let cell = document.querySelector(`.cells[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }

    //after clicking all the cells 
    //we must gurantee that the first cell is always
    //remains clicked
    let firstCell = document.querySelector(".cells");
    firstCell.click();
}

//function to handle and assign all the properties to a particular sheet
function handleAllDBproperties(sheetIdx){
    //first assign the celldb properties
    cellDB = collectedCellDB[sheetIdx];

    //assign the graph component properties
    graphComponent = collectedGraphComponent[sheetIdx];
}

//Function to handle all the properties of sheet on clicking
function clickSheetActiveness(sheet){
    //add a event listener
    sheet.addEventListener("click" , (e)=>{ 
        //get the index of the sheet
        let sheetIdx = Number(sheet.getAttribute("id"));

        //handle its own db properties
        handleAllDBproperties(sheetIdx);

        //handle ui properties
        handleUIProperties();
        handleSheetActiveness(sheet);
    })
}

//functon to create sheet db
function createSheetDB(){
    let cellDB = [];

    // database for storing the properties of all the cells
    //so that we can access later
    for(let i=0; i<rows; i++){
      
      let cellRowDb = [];
      for(let j=0; j<cols; j++){
    
        //making an object for each cells
        let cellProperties ={
          bold: false,
          italic: false,
          underline: false,
          alignment: "left",
          fontSize: "14",
          fontFamily: "monospace",
          fontColor: "#000000",
          bgColor: "#000000",
          value: "",
          formula: "",
          child: [],
        }
        cellRowDb.push(cellProperties);
      }
      cellDB.push(cellRowDb);
    }

    collectedCellDB.push(cellDB);
}

//function to create graph component
function createGraphComponent(){
  
    let graphComponent = [];
    for(let i = 0;i < rows; i++){
        
        let edges = [];
        for(let j=0; j<cols; j++){
            //Inside the edges an array of all the dependencies will be there
            edges.push([]);
        }                                 
        graphComponent.push(edges);
    }
    collectedGraphComponent.push(graphComponent);
}