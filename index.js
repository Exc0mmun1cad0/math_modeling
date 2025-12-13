let maxVertexDegree = 4;
let numberOfVertexes = 10;

let minEdgeWeight = 1;
let maxEdgeWeight = 10


function randomKeyFromMap(map) { //! NOT OPTIMIZED AT ALL
    let target = Math.floor(Math.random() * map.size);
    let i = 0;

    for (let key of map.keys()) {
        if (i == target) return key;
        i++;
    }
}


function printGraph(graph) {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].length == 0) {
            continue;
        }

        console.log(i, ":", JSON.stringify(graph[i]));
    }
}

// Список смежности:
// двумерный массив: 
//      список таких списков, в которых эл-ты - 
//          массив из 2, 
//              где первое - номер вершины в которую идёт ребро, 
//              а второе - длина ребра в эту вершину

// Есть много вариантов генерации но я выберу следующий (если не очень, всегда можно переписать)

// TODO: pass all args as one config object
// TODO: сделать что-то с компонентами связности
function generateGraph(numberOfVertexes, maxVertexDegree, minEdgeWeight, maxEdgeWeight) {
    let graph = Array.from({ length: numberOfVertexes }, () => []);
    
    let createdEdges = new Map();
    for (let i = 0; i < numberOfVertexes; i++) {
        createdEdges.set(i, 0);
    }

    for (let i = 0; i < numberOfVertexes; i++) {
        if (graph[i].length > 0) {
            continue;
        }

        createdEdges.delete(i);

        for (let j = 0; j < numberOfVertexes; j++) {
            if (createdEdges.size == 0) {
                break;
            }

            let edgeWeight = Math.floor(Math.random() * (maxEdgeWeight - minEdgeWeight) + minEdgeWeight);
            let destVertex = randomKeyFromMap(createdEdges);
            
            graph[i].push([destVertex, edgeWeight]);
            graph[destVertex].push([i, edgeWeight]);

            let degree = createdEdges.get(destVertex) + 1;
            createdEdges.set(destVertex, degree);
            if (degree == maxVertexDegree) {
                createdEdges.delete(destVertex);
            }
        }

    }

    return graph;
}

const graph = generateGraph(
    10,
    4,
    1,
    10
);
printGraph(graph);
