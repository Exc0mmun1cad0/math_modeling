import { generateGraph } from "./generate_graph.js";
import { Dijkstra } from "./graph_algorithms.js";

let maxVertexDegree = 4;
let numberOfVertexes = 100;
let minEdgeWeight = 1;
let maxEdgeWeight = 10

let graph = null;

let network = null;
let nodes = null;
let edges = null;
let edgesMap = new Map();
let highlightedEdgeIds = new Set();

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


function renderGraph() {    
    edgesMap.clear();

    // visualization
    nodes = new vis.DataSet(
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

    let addedEdges = new Set();
    let edgeObjs = new Array();
    let currEdgeId = 100;
    for (let i = 0; i < graph.length; i++) {
        let edges = graph[i];
        for (let edge of edges) {
            if (addedEdges.has(`${edge[0]}-${i}`)) 
                continue;
            currEdgeId++;
            edgeObjs.push({
                id: currEdgeId,
                from: i,
                to: edge[0],
                label: `${edge[1]}`,
                arrows: ''
            })
            let addedEdge = `${i}-${edge[0]}`
            addedEdges.add(addedEdge);
            edgesMap.set(addedEdge, currEdgeId);
            edgesMap.set(`${edge[0]}-${i}`, currEdgeId);
        }
    }
    edges = new vis.DataSet(edgeObjs); 

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

function highlightPath(path) {
    if (highlightedEdgeIds.size != 0)
        for (let id of highlightedEdgeIds)
            edges.update({ id: id, color: { color: "#1680c2ff" }, width: 1 });
    highlightedEdgeIds.clear();

    for (let i = 0; i < path.length-1; i++) {
        let edgeId = edgesMap.get(`${path[i]}-${path[i+1]}`);
        edges.update({
            id: edgeId,
            color: { color: "red" },
            width: 4,
        });
        highlightedEdgeIds.add(edgeId);
    }
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

        console.log(path);
        highlightPath(path);
    })