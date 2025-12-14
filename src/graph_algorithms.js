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

class MinHeap {
    constructor() {
        this.heap = [];
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    push(node, priority) {
        this.heap.push({ node, priority });
        this._siftUp(this.heap.length - 1);
    }

    pop() {
        if (this.isEmpty()) return null;

        const min = this.heap[0];
        const last = this.heap.pop();

        if (!this.isEmpty()) {
            this.heap[0] = last;
            this._siftDown(0);
        }

        return min;
    }

    _siftUp(i) {
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (this.heap[p].priority <= this.heap[i].priority) break;
            [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
            i = p;
        }
    }

    _siftDown(i) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1;
            const r = 2 * i + 2;

            if (l < n && this.heap[l].priority < this.heap[smallest].priority)
                smallest = l;
            if (r < n && this.heap[r].priority < this.heap[smallest].priority)
                smallest = r;

            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
}

export function DijkstraWithHeap(graph, source, target) {
    const n = graph.length;
    const dist = new Array(n).fill(INF);
    const prev = new Array(n).fill(-1);
    const visited = new Array(n).fill(false);

    dist[source] = 0;

    const pq = new MinHeap();
    pq.push(source, 0);

    while (!pq.isEmpty()) {
        const { node: u, priority: d } = pq.pop();

        if (visited[u]) continue;
        visited[u] = true;

        if (u === target) break;

        for (const [v, w] of graph[u]) {
            if (visited[v]) continue;

            const nd = d + w;
            if (nd < dist[v]) {
                dist[v] = nd;
                prev[v] = u;
                pq.push(v, nd);
            }
        }
    }

    if (dist[target] === INF) {
        return {};
    }

    const path = [];
    for (let v = target; v !== -1; v = prev[v]) {
        path.push(v);
    }

    return {
        dist: dist[target],
        path: path.reverse()
    };
}