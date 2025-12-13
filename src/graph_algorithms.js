function dfs(graph, visited, start, compNum) {
    let stack = [start];
    while (stack.length > 0) {
        let node = stack.pop();

        if (visited[node] != 0) {
            continue;
        }

        visited[node] = compNum;

        for (let neighbour of graph[node]) {
            if (visited[neighbour[0]] == 0) 
                stack.push(neighbour[0]);
        }
    }
}

function countComponents(graph) {
    let visited = Array(graph.length).fill(0);

    let compNow = 0;
    for (let v = 0; v < graph.length; v++) {
        if (visited[v] == 0) {
            compNow++;
            dfs(graph, visited, v, compNow);
        }
    }

    return compNow
}
