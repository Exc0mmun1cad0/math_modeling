import { generateGraph } from "./generate_graph.js";
import { Dijkstra, DijkstraWithHeap } from "./graph_algorithms.js";

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

function initGraph(seed) {
    graph = generateGraph(
        numberOfVertexes,
        maxVertexDegree,
        minEdgeWeight,
        maxEdgeWeight,
        seed
    );
}

function getSeed() {
    const value = document.getElementById("seed").value;
    const seed = Number(value);

    if (!Number.isInteger(seed)) {
        alert("Seed должен быть целым числом");
    }

    if (seed <= 0) {
        alert("Seed должен быть положительным числом");
        return null;
    }

    return seed;
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
        // physics: {
        //     enabled: true,
        //     barnesHut: {
        //     springLength: 150,
        //     },
        // }
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
        const seed = getSeed();
        if (seed === null) return;

        if (network) {
            network.destroy();
        }

        initGraph(seed);
        network = renderGraph(null);

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `
        Кратчайший путь не найден
        `;

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

        // console.time("dijkstra-with-heap");
        const start1 = performance.now();
        const { dist, path, ops } = DijkstraWithHeap(graph, start, end);
        // console.timeEnd("dijkstra-with-heap");
        const end1 = performance.now();

        // console.time("dijkstra");
        const start2 = performance.now();
        const { dist2, path2, ops2 } = Dijkstra(graph, start, end);
        // console.timeEnd("dijkstra");
        const end2 = performance.now();

        highlightPath(path2);

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `
            <b>Длина пути:</b> ${dist2}<br>
            <b>Путь:</b> ${path2.join(" → ")} <br>
            <b>Дейкстра обычная:</b> ${ops2} (${end2 - start2}) ms <br>
            <b>Дейкстра с кучей:</b> ${ops} (${end1 - start1}) ms <br>
        `;
    });
