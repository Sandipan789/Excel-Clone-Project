let rows = 100;
let cols = 26;


let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let cellCont = document.querySelector(".cell-cont");
let addressBar = document.querySelector(".address-bar");
let formulaBar = document.querySelector(".formula-bar");
let sheetFolderCont = document.querySelector(".sheets-folder-cont")
let sheetAddIcon = document.querySelector(".sheet-add-icon");


for(let i=0 ; i<rows ; i++){
  let addressCols = document.createElement("div");
  addressCols.setAttribute("class","address-col");
  addressCols.innerText = i+1;
  addressColCont.appendChild(addressCols);
}

for(let i=0 ; i<cols ; i++){
  let addressRows = document.createElement("div");
  addressRows.setAttribute("class","address-row");
  addressRows.innerText = String.fromCharCode(65 + i);
  addressRowCont.appendChild(addressRows);
}


for(let i=0; i<rows; i++){

  let gridRow = document.createElement("div");
  gridRow.setAttribute("class","gridRow");

  for(let j=0; j<cols; j++){

    let cells = document.createElement("div");
    cells.setAttribute("class","cells");
    cells.setAttribute("contenteditable", "true");

    cells.setAttribute("rid",i);
    cells.setAttribute("cid",j);

    gridRow.appendChild(cells);
    addListenerForAddressBarDisplay(cells, i, j)
  }

  cellCont.appendChild(gridRow);
}


function addListenerForAddressBarDisplay(cell, i, j) {
  cell.addEventListener("click", (e) => {
      let rowID = i+1;
      let colID = String.fromCharCode(65 + j);
      addressBar.value = `${colID}${rowID}`;
  })
}


// default making the first cell click when page is loaded
