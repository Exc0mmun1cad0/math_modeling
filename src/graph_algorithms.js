const INF = 99999999;


export function dfs(graph, visited, source, compNum) {
    let stack = [source];
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

export function countComponents(graph) {
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

// TODO: upgrade with heap
export function Dijkstra(graph, source, target) {
    let n = graph.length;
    let visited = new Array(n).fill(false);
    let dist = new Array(n).fill(INF);
    dist[source] = 0;
    let prev = new Array(n).fill(0);
    prev[source] = -1;

    for (let q = 0; q < n; q++) {
        let minV = -1;
        let minDist = INF;
        for (let v = 0; v < n; v++) {
            let distance = dist[v];
            if (minDist  >= distance && !visited[v]) {
                minDist = distance;
                minV = v;
            }
        }

        for (let entry of graph[minV]) {
            let neighbour = entry[0], nDist = entry[1];
            if (nDist + dist[minV] < dist[neighbour]) {
                dist[neighbour] = nDist + dist[minV];
                prev[neighbour] = minV;
            }
        }
        visited[minV] = true;
    }

    if (dist[target] == INF) {
        return {}
    }

    let curr = target;
    let path = new Array();
    while (curr != -1) {
        path.push(curr);
        curr = prev[curr];
    }

    return {
        dist: dist[target],
        path: path.reverse()
    };
}