// TODO: pass all args as one config object
// TODO: сделать что-то с компонентами связности
export function generateGraph(
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