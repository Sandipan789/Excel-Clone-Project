function colorPromise() {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve();
      }, 1000);
  })
}

async function colorTrace(graphComponent , cycleResponse){
  let visited = []
  let dfsVisited = []

  //innitialising the dfsvisited and visited 2-d array to false
  for(let i=0 ;i<rows; i++){
      let visitedRows = [];
      let dfsVisitedRows = [];
      for(let j=0 ; j<cols ; j++){
          visitedRows.push(false);
          dfsVisitedRows.push(false);
      }
      visited.push(visitedRows);
      dfsVisited.push(dfsVisitedRows);
  }

  let [srcr , srcc] = cycleResponse;

  let response = await colorTraceDfs(graphComponent,srcr,srcc,visited,dfsVisited);
  return Promise.resolve(false);
}

// dfs traversal to check whether there is a cycle in graph or not
async function colorTraceDfs(graphComponent,srcr,srcc,visited,dfsVisited){

  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  let cell = document.querySelector(`.cells[rid="${srcr}"][cid="${srcc}"]`);
  cell.style.backgroundColor = "lightblue";
  await colorPromise();

  for(let children = 0; children < graphComponent[srcr][srcc].length; children++){

      let [crid,ccid] = graphComponent[srcr][srcc][children];
      if(visited[crid][ccid] === false){
          let response = await colorTraceDfs(graphComponent,crid,ccid,visited,dfsVisited);
          if(response===true){

            cell.style.backgroundColor = "transparent";
            await colorPromise();

            return Promise.resolve(true);
          }
      }
      else if(dfsVisited[crid][ccid] === true){
          
          let cycleCell = document.querySelector(`.cells[rid="${crid}"][cid="${ccid}"]`);

          cycleCell.style.backgroundColor = "lightpink";
          await colorPromise();

          cycleCell.style.backgroundColor = "transparent";
          await colorPromise();

          cell.style.backgroundColor = "transparent";
          await colorPromise();

          return Promise.resolve(true);
      }
  }

  dfsVisited[srcr][srcc] = false;
  return Promise.resolve(false);
}