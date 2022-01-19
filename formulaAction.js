//Storing the value of the cell which is entered before going to the next cell
//Concept of blur and focus event-listener
//focus--> it is used when we are working in the current cell
//blur --> it is triggered when we move to the next cell and it actually stores the address ofthe previous cell

for(let i=0; i<rows; i++){
   for(let j=0; j<cols; j++){
      
      //select the current cell using query selector
      let cell = document.querySelector(`.cells[rid="${i}"][cid="${j}"]`);

      cell.addEventListener("blur", (e) =>{
          
          //get the address of the current cell
          let address = addressBar.value;
          let [cellProp, prevCell] = getAddressOf_UiandDatabase(address);
          
          //get the entered value
          let enteredValue = prevCell.innerText;

          //if there was a previous formula existing there in the cell
          //then we have to remove it
          //or the previous entered value is not equal to the current value
          cellProp.value = enteredValue;

          removeParentChildConnection(cellProp.formula);
          cellProp.formula = "";

          changeChildValue(cellProp);
      })
   }
}


formulaBar.addEventListener("keydown", async(e) => {
   
   //if the value of the event is Enter (i.e a formula is entered)
   //evaluate the formula
   let inputFormula = formulaBar.value; 

   //only the evaluation will be done if the input formula is not empty
   if(e.key === "Enter" && inputFormula){
      
      let address = addressBar.value;
      let [cellProp, cell] = getAddressOf_UiandDatabase(address);

      if(cellProp.formula !== inputFormula)removeParentChildConnection(cellProp.formula);

      //calulate the evaluated value
      let evaluatedValue = performEvaluation(inputFormula);

      //add all the dependencies to create a graph
      //this will help us to detect whether cycle is present or not
      addDependencyInGraph(inputFormula,address);
      

      //check whether there is cycle in graph or not
      let cycleResponse = isCyclicGraph(graphComponent);
      if(cycleResponse){
           
           let confirmResponse = confirm("You have a cyclic response . Do you want to trace your path?");

           //If a user want to trace the cyclic path then this part is executed
           while(confirmResponse === true){
               await colorTrace(graphComponent , cycleResponse);
               confirmResponse = confirm("You have a cyclic response . Do you want to trace your path?");
           }

           removeDependencyInGraph(inputFormula,address);
           return;
      }

      addParentChildConnection(inputFormula);
      changeUIandDB(evaluatedValue,address,inputFormula);
      changeChildValue(cellProp);
   }
})

//Funtion to create the graph
function addDependencyInGraph(inputFormula,childAddress){
     
   let encodeFormula = inputFormula.split(" ");
   let crid = Number(childAddress.slice(1))-1;
   let ccid = Number(childAddress.charCodeAt(0))-65;
   
   for(let i=0 ;i<encodeFormula.length ;i++){
       let asciValue = encodeFormula[i].charCodeAt(0);
       if(asciValue >= 65 && asciValue <= 90){
           let prid = Number(encodeFormula[i].slice(1))-1;
           let pcid = Number(encodeFormula[i].charCodeAt(0))-65;
           graphComponent[prid][pcid].push([crid,ccid]);
       }
   }
}

//Function to remove dependency in graph
function removeDependencyInGraph(inputFormula,childAddress){
     
   let encodeFormula = inputFormula.split(" ");
   let crid = Number(childAddress.slice(1))-1;
   let ccid = Number(childAddress.charCodeAt(0))-65;
   
   for(let i=0 ;i<encodeFormula.length ;i++){
       let asciValue = encodeFormula[i].charCodeAt(0);
       if(asciValue >= 65 && asciValue <= 90){
           let prid = Number(encodeFormula[i].slice(1))-1;
           let pcid = Number(encodeFormula[i].charCodeAt(0))-65;
           graphComponent[prid][pcid].pop();
       }
   }
}


//Function to add parent and child connection
function addParentChildConnection(inputFormula){
    
   let encodeFormula = inputFormula.split(" ");
   let childaddress = addressBar.value;
   
   for(let i=0 ;i<encodeFormula.length ;i++){
       let asciValue = encodeFormula[i].charCodeAt(0);
       if(asciValue >= 65 && asciValue <= 90){
          let [cellProp , cell] = getAddressOf_UiandDatabase(encodeFormula[i]);
          cellProp.child.push(childaddress);
       }
   }
}

//Function to remove parent child connection
function removeParentChildConnection(inputFormula){
    
    let encodeFormula = inputFormula.split(" ");
    let childaddress = addressBar.value;

    for(let i=0 ;i<encodeFormula.length ;i++){
        let asciValue = encodeFormula[i].charCodeAt(0);
        if(asciValue >= 65 && asciValue <= 90){
          let [cellProp , cell] = getAddressOf_UiandDatabase(encodeFormula[i]);

          //finding the index of the child from the dependency list
          let idx = cellProp.child.indexOf(childaddress);

          //poping the dependency out from parent child list
          cellProp.child.splice(idx, 1);
        }
    }
}

//Function to recursively change the child values on changing values or formula
function changeChildValue(cellProp){
     
     //from cell properties of parent access the child and make the required changes
     //and call function recursively
     for(let i=0 ;i<cellProp.child.length ;i++){
          //get access of the child address
          let childAddress = cellProp.child[i];

          //get the access of the cellprop and cell of child
          let [childCellProp , childCell] = getAddressOf_UiandDatabase(childAddress);

          //perform evaluation changes
          let evaluatedValue = performEvaluation(childCellProp.formula);

          //change the ui and db too
          changeUIandDB(evaluatedValue,childAddress,childCellProp.formula);

          //recursive call to other child
          changeChildValue(childCellProp);
     }
}

//Function to evaluate formula
function performEvaluation(inputFormula){
    //formula can have harcoded value or it 
    //can also have dependency value
    //we have to decode it it to harcode value if it has dependency

    let encodeFormula = inputFormula.split(" ");

    for(let i=0; i<encodeFormula.length; i++){
       let value = encodeFormula[i];
       let asciValue = value.charCodeAt(0);

       //formula has dependency
       if(asciValue >=65 && asciValue <= 90){
          let [cellProp , cell] = getAddressOf_UiandDatabase(value);
          encodeFormula[i] = cellProp.value;
       }
    }

    //now lets decode the formula
    let decodedValue = encodeFormula.join(" ");

    let result = eval(decodedValue);
    return result;
}

//Function to change ui and database with evaluated value and formula
function changeUIandDB(evaluatedValue,address,inputFormula){
    
    let [cellProp, cell] = getAddressOf_UiandDatabase(address);
    cellProp.value = evaluatedValue;
    cellProp.formula = inputFormula;
    cell.innerText = evaluatedValue;
}
