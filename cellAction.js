let collectedCellDB = [];
let cellDB = [];

{
   let sheetAddIcon = document.querySelector(".sheet-add-icon");
   sheetAddIcon.click();
   // let firstCell = document.querySelector(".cells");
   // firstCell.click();
}

// // database for storing the properties of all the cells
// //so that we can access later
// for(let i=0; i<rows; i++){
  
//   let cellRowDb = [];
//   for(let j=0; j<cols; j++){

//     //making an object for each cells
//     let cellProperties ={
//       bold: false,
//       italic: false,
//       underline: false,
//       alignment: "left",
//       fontSize: "14",
//       fontFamily: "monospace",
//       fontColor: "#000000",
//       bgColor: "#000000",
//       value: "",
//       formula: "",
//       child: [],
//     }
//     cellRowDb.push(cellProperties);
//   }
//   cellDB.push(cellRowDb);
// }

//selectors for all the cellAction icons
let boldIcn = document.querySelector(".bold");
let italicIcn = document.querySelector(".italic");
let underlineIcn = document.querySelector(".underline");
let fontFamilyIcn = document.querySelector(".font-family-prop");
let fontSizeIcn = document.querySelector(".font-size-prop");
let fontColorIcn = document.querySelector(".font-color-prop");
let bgColorIcn = document.querySelector(".BGcolor-prop");
let alignmentIcn = document.querySelectorAll(".alignment");
let leftAlign = alignmentIcn[0];
let centerAlign = alignmentIcn[1];
let rightAlign = alignmentIcn[2];

//active/inactive cell icon
let activeColor = "#d1d8e0";
let inactiveColor = "#ecf0f1";

//making action for bold icons
boldIcn.addEventListener("click", (e)=>{
   
  //first get the active cell
   let address = addressBar.value;
   let [cellProp, cell] = getAddressOf_UiandDatabase(address);
   
   cellProp.bold = !cellProp.bold;
   cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
   boldIcn.style.backgroundColor = cellProp.bold ? activeColor : inactiveColor;
})

//making action for italic icons
italicIcn.addEventListener("click", (e)=>{
   
  //first get the active cell
   let address = addressBar.value;
   let [cellProp, cell] = getAddressOf_UiandDatabase(address);
   
   cellProp.italic = !cellProp.italic;
   cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
   italicIcn.style.backgroundColor = cellProp.italic ? activeColor : inactiveColor;
})

//making action for underline icons
underlineIcn.addEventListener("click", (e)=>{
   
  //first get the active cell
   let address = addressBar.value;
   let [cellProp, cell] = getAddressOf_UiandDatabase(address);
   
   cellProp.underline = !cellProp.underline;
   cell.style.textDecoration = cellProp.underline ? "underline" : "none";
   underlineIcn.style.backgroundColor = cellProp.underline ? activeColor : inactiveColor;
})

//making action for fontsize icons
fontSizeIcn.addEventListener("change", (e)=>{
   
  //first get the active cell
   let address = addressBar.value;
   let [cellProp, cell] = getAddressOf_UiandDatabase(address);
   
   cellProp.fontSize = fontSizeIcn.value;
   cell.style.fontSize = cellProp.fontSize + "px";
   fontSizeIcn.value = cellProp.fontSize;
})

//making change for fontfamily
fontFamilyIcn.addEventListener("change", (e)=>{
   
  //first get the active cell
   let address = addressBar.value;
   let [cellProp, cell] = getAddressOf_UiandDatabase(address);
   
   cellProp.fontFamily = fontFamilyIcn.value;
   cell.style.fontFamily = cellProp.fontFamily;
   fontFamilyIcn.value = cellProp.fontFamily;
})

//making change for fontColor
fontColorIcn.addEventListener("change", (e)=>{
   
  //first get the active cell
   let address = addressBar.value;
   let [cellProp, cell] = getAddressOf_UiandDatabase(address);
   
   cellProp.fontColor = fontColorIcn.value;
   cell.style.color = cellProp.fontColor;
   fontColorIcn.value = cellProp.fontColor;
})

//making change for BgColor
bgColorIcn.addEventListener("change", (e)=>{
   
  //first get the active cell
   let address = addressBar.value;
   let [cellProp, cell] = getAddressOf_UiandDatabase(address);
   
   cellProp.bgColor = bgColorIcn.value;
   cell.style.backgroundColor = cellProp.bgColor;
   bgColorIcn.value = cellProp.bgColor;
})

//alignment changes
alignmentIcn.forEach((alignElement) => {
   
  alignElement.addEventListener("click", (e)=> {

    //first get the active cell
    let address = addressBar.value;
    let [cellProp, cell] = getAddressOf_UiandDatabase(address);

    //get the value of alignment (i.e which alignment to be done)
    let alignValue = e.target.classList[0];
    
    //database change and cell change
    cellProp.alignment = alignValue;
    cell.style.textAlign = cellProp.alignment;

    //cell prop container ui change
    switch(alignValue){
       case "left":
          leftAlign.style.backgroundColor = activeColor;
          centerAlign.style.backgroundColor = inactiveColor;
          rightAlign.style.backgroundColor = inactiveColor;
          break;

       case "center":
          leftAlign.style.backgroundColor = inactiveColor;
          centerAlign.style.backgroundColor = activeColor;
          rightAlign.style.backgroundColor = inactiveColor;
          break;

       case "right":
          leftAlign.style.backgroundColor = inactiveColor;
          centerAlign.style.backgroundColor = inactiveColor;
          rightAlign.style.backgroundColor = activeColor;
          break;
    }
  })
})


//Most important
//while clicking on cell all the properties of that cell should be displayed
//on ui and also the changes should be there on database

let allCells = document.querySelectorAll(".cells"); 
for(let i= 0; i < allCells.length; i++){
   displayPropertyOfParticularCell(allCells[i]);
}

function displayPropertyOfParticularCell(cell){
    
   cell.addEventListener("click", (e)=> {
      
        //first get the address of active cell
        let address = addressBar.value;

        //slicing of address
        let rid = Number(address.slice(1))-1;
        let cid = Number(address.charCodeAt(0))-65;

        //cellProp --> database access
        let cellProp = cellDB[rid][cid];

        //UI changes in the cell
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
        cell.style.textAlign = cellProp.alignment;

        //UI changes in cellProp container
        boldIcn.style.backgroundColor = cellProp.bold ? activeColor : inactiveColor;
        italicIcn.style.backgroundColor = cellProp.italic ? activeColor : inactiveColor;
        underlineIcn.style.backgroundColor = cellProp.underline ? activeColor : inactiveColor;
        fontColorIcn.value = cellProp.fontColor;
        bgColorIcn.value = cellProp.bgColor;
        fontSizeIcn.value = cellProp.fontSize;
        fontFamilyIcn.value = cellProp.fontFamily;
        switch(cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColor;
                centerAlign.style.backgroundColor = inactiveColor;
                rightAlign.style.backgroundColor = inactiveColor;
                break;

            case "center":
                leftAlign.style.backgroundColor = inactiveColor;
                centerAlign.style.backgroundColor = activeColor;
                rightAlign.style.backgroundColor = inactiveColor;
                break;

            case "right":
                leftAlign.style.backgroundColor = inactiveColor;
                centerAlign.style.backgroundColor = inactiveColor;
                rightAlign.style.backgroundColor = activeColor;
                break;
        }

        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
   })
}

function getAddressOf_UiandDatabase(address){
   
  //split thae address to get row and column identification
  let rid = Number(address.slice(1))-1;
  let cid = Number(address.charCodeAt(0))-65;


  let cellProp = cellDB[rid][cid];
  let cell = document.querySelector(`.cells[rid="${rid}"][cid="${cid}"]`);
  return [cellProp, cell];
}
