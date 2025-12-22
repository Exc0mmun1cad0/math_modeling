function createSeededRandom(seed) {
    let state = seed;

    return function() {
        state = (state * 42871) % 0x7fffffff;
        return state / 0x7fffffff;
    }
}

// TODO: pass all args as one config object
// TODO: сделать что-то с компонентами связности
export function generateGraph(
    numberOfVertexes,
    maxVertexDegree,
    minEdgeWeight,
    maxEdgeWeight,
    seed = 1
) {
    const rand = createSeededRandom(seed)

    const graph = Array.from({ length: numberOfVertexes }, () => []);
    const degree = Array(numberOfVertexes).fill(0);

    function hasEdge(u, v) {
        return graph[u].some(([to]) => to === v);
    }

    function addEdge(u, v) {
        const w = Math.floor(
        rand() * (maxEdgeWeight - minEdgeWeight) + minEdgeWeight
        );

        graph[u].push([v, w]);
        graph[v].push([u, w]);

        degree[u]++;
        degree[v]++;
    }

    for (let i = 1; i < numberOfVertexes; i++) {
        let connected = false;

        while (!connected) {
            const v = Math.floor(rand() * i);

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
        const u = Math.floor(rand() * numberOfVertexes);
        const v = Math.floor(rand() * numberOfVertexes);

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