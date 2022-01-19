//1-->Storage of the dependencies of each cell
//2-->An adjacency matrix will be created to store the edges
//3->Representation
//4-->[ [..[][][].........] ]
//5-->Outer array to store the rows
//6-->Inner array to store colums
//7-->Innermost array to store the array of dependencies

let collectedGraphComponent = [];

let graphComponent = [];
// for(let i = 0;i < rows; i++){
    
//     let edges = [];
//     for(let j=0; j<cols; j++){
//         //Inside the edges an array of all the dependencies will be there
//         edges.push([]);
//     }                                 
//     graphComponent.push(edges);
// }

//Function to check whether the graph contains cycle or not
//1->2 arrays is needed i)visited array, ii)dfsVisited array
//visited array -> to track which cells are alredy visited during dfs traversal
//dfsvisited array -> to track which cells are visited in the current path

function isCyclicGraph(graphComponent){
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

    for(let i=0 ;i<rows; i++){
        for(let j=0; j<cols ; j++){

            if(visited[i][j] === false){
                let response = cyclicDetection(graphComponent,i,j,visited,dfsVisited);
                if(response === true)return [i,j];
            }
        }
    }

    return null;
}

// dfs traversal to check whether there is a cycle in graph or not
function cyclicDetection(graphComponent,srcr,srcc,visited,dfsVisited){

    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    for(let children = 0; children < graphComponent[srcr][srcc].length; children++){

        let [crid,ccid] = graphComponent[srcr][srcc][children];
        if(visited[crid][ccid] === false){
            let response = cyclicDetection(graphComponent,crid,ccid,visited,dfsVisited);
            if(response===true)return true;
        }
        else if(dfsVisited[crid][ccid] === true){
            return true;
        }
    }

    dfsVisited[srcr][srcc] = false;
    return false;
}