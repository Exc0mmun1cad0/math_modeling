import { generateGraph } from "./generate_graph.js";
import { printGraph } from "./utils.js";

let maxVertexDegree = 4;
let numberOfVertexes = 10;

let minEdgeWeight = 1;
let maxEdgeWeight = 10



const graph = generateGraph(
    100,
    4,
    1,
    10
);


// visualization
var nodes = new vis.DataSet(
    Array.from(
        { length: 100}, (_, i) => {
            return { 
                id: i, 
                label: `${i + 1}`, 
                shape: "circle",
                size: 30
            };
        }
    )
)

let addedEdges = new Set();
let edgeObjs = new Array();
for (let i = 0; i < graph.length; i++) {
    let edges = graph[i];
    for (let edge of edges) {
        if (addedEdges.has(`${edge[0]}-${i}`)) 
            continue;
        edgeObjs.push({
            from: i,
            to: edge[0],
            label: `${edge[1]}`,
            arrows: ''
        })
        addedEdges.add(`${i}-${edge[0]}`);
    }
}
let edges = new vis.DataSet(edgeObjs); 

var container = document.getElementById("network");
var data = {
    nodes: nodes,
    edges: edges
}
var options = {
    physics: {
        enabled: true,
        barnesHut: {
        springLength: 150,
        },
    }
};

var network = new vis.Network(container, data, options);

alert("where is my mind?");