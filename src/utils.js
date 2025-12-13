export function printGraph(graph) {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].length == 0) {
            continue;
        }

        console.log(i, ":", JSON.stringify(graph[i]));
    }
}