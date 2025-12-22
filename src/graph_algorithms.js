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

class FastMinHeap {
    constructor(capacity = 1024) {
        // Используем типизированные массивы для максимальной скорости
        this.nodes = new Int32Array(capacity);
        this.priorities = new Float64Array(capacity);
        this.length = 0;
    }

    _resize() {
        const newCapacity = this.nodes.length * 2;
        const newNodes = new Int32Array(newCapacity);
        const newPriorities = new Float64Array(newCapacity);
        newNodes.set(this.nodes);
        newPriorities.set(this.priorities);
        this.nodes = newNodes;
        this.priorities = newPriorities;
    }

    isEmpty() {
        return this.length === 0;
    }

    push(node, priority) {
        if (this.length === this.nodes.length) this._resize();

        let i = this.length++;
        this.nodes[i] = node;
        this.priorities[i] = priority;

        // Sift Up
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.priorities[p] <= this.priorities[i]) break;
            this._swap(i, p);
            i = p;
        }
    }

    pop() {
        if (this.length === 0) return null;

        const resNode = this.nodes[0];
        const resPriority = this.priorities[0];

        this.length--;
        if (this.length > 0) {
            this.nodes[0] = this.nodes[this.length];
            this.priorities[0] = this.priorities[this.length];
            
            // Sift Down
            let i = 0;
            while (true) {
                let s = i;
                const l = (i << 1) + 1;
                const r = (i << 1) + 2;

                if (l < this.length && this.priorities[l] < this.priorities[s]) s = l;
                if (r < this.length && this.priorities[r] < this.priorities[s]) s = r;
                if (s === i) break;

                this._swap(i, s);
                i = s;
            }
        }

        return { node: resNode, priority: resPriority };
    }

    _swap(i, j) {
        const tempNode = this.nodes[i];
        const tempPriority = this.priorities[i];
        this.nodes[i] = this.nodes[j];
        this.priorities[i] = this.priorities[j];
        this.nodes[j] = tempNode;
        this.priorities[j] = tempPriority;
    }
}

export function DijkstraWithHeap(graph, source, target) {
    const n = graph.length;
    const dist = new Array(n).fill(INF);
    const prev = new Array(n).fill(-1);
    const visited = new Array(n).fill(false);

    dist[source] = 0;

    const pq = new FastMinHeap();
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