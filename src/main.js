import { generateGraph } from "./generate_graph.js";
import { Dijkstra } from "./graph_algorithms.js";

let maxVertexDegree = 4;
let numberOfVertexes = 100;
let minEdgeWeight = 1;
let maxEdgeWeight = 10

let graph = null;
let network = null;

let source = 0;
let target = 99;

function initGraph() {
    graph = generateGraph(
        numberOfVertexes,
        maxVertexDegree,
        minEdgeWeight,
        maxEdgeWeight
    );
}


function renderGraph(path = null) {    
    // visualization
    var nodes = new vis.DataSet(
        Array.from(
            { length: numberOfVertexes}, (_, i) => {
                return { 
                    id: i, 
                    label: `${i}`, 
                    shape: "circle",
                    size: 30
                };
            }
        )
    )

    let highlightEdges = new Set();
    if (path !== null) {
        for (let i = 0; i < path.length-1; i++) {
            highlightEdges.add(`${path[i]}-${path[i+1]}`)
            highlightEdges.add(`${path[i+1]}-${path[i]}`)
        }
    }
    console.log(highlightEdges);
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
            let addedEdge = `${i}-${edge[0]}`
            if (highlightEdges.has(addedEdge))
                edgeObjs[edgeObjs.length-1]["color"] = "red";
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

    network = new vis.Network(container, data, options);
}

initGraph();
renderGraph();

document
    .getElementById("regen-btn")
    .addEventListener("click", () => {
        if (network) network.destroy();

        initGraph();
        network = renderGraph(null);
    });

document
    .getElementById("findPath-btn")
    .addEventListener("click", () => {
        const start = parseInt(document.getElementById("source").value, 10);
        const end = parseInt(document.getElementById("target").value, 10);

        if (isNaN(start) || isNaN(end) || start < 0 || end < 0 || start >= numberOfVertexes || end >= numberOfVertexes) {
            alert("Введите корректные вершины от 0 до " + (numberOfVertexes - 1));
            return;
        }

        const { dist, path } = Dijkstra(graph, start, end);
        renderGraph(path);

    })