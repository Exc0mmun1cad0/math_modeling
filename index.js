let maxVertexDegree = 4;
let numberOfVertexes = 10;

let minEdgeWeight = 1;
let maxEdgeWeight = 10


function printGraph(graph) {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].length == 0) {
            continue;
        }

        console.log(i, ":", JSON.stringify(graph[i]));
    }
}

// TODO: pass all args as one config object
// TODO: сделать что-то с компонентами связности
function generateGraph(
    numberOfVertexes,
    maxVertexDegree,
    minEdgeWeight,
    maxEdgeWeight
) {
    const graph = Array.from({ length: numberOfVertexes }, () => []);
    const degree = Array(numberOfVertexes).fill(0);

    function hasEdge(u, v) {
        return graph[u].some(([to]) => to === v);
    }

    function addEdge(u, v) {
        const w = Math.floor(
        Math.random() * (maxEdgeWeight - minEdgeWeight) + minEdgeWeight
        );

        graph[u].push([v, w]);
        graph[v].push([u, w]);

        degree[u]++;
        degree[v]++;
    }

    for (let i = 1; i < numberOfVertexes; i++) {
        let connected = false;

        while (!connected) {
            const v = Math.floor(Math.random() * i);

            if (
                degree[i] < maxVertexDegree &&
                degree[v] < maxVertexDegree &&
                !hasEdge(i, v)
            ) {
                addEdge(i, v);
                connected = true;
            }
        }
    }

    const maxAttempts = numberOfVertexes * 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const u = Math.floor(Math.random() * numberOfVertexes);
        const v = Math.floor(Math.random() * numberOfVertexes);

        if (
        u !== v &&
        degree[u] < maxVertexDegree &&
        degree[v] < maxVertexDegree &&
        !hasEdge(u, v)
        ) {
        addEdge(u, v);
        }

        attempts++;
    }

    return graph;
}


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