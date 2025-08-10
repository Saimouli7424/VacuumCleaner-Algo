#include <bits/stdc++.h>
using namespace std;

struct Node {
    int x, y;
    double cost, heuristic;
    bool operator>(const Node &other) const {
        return (cost + heuristic) > (other.cost + other.heuristic);
    }
};

int n, m; // Grid dimensions
vector<vector<int>> grid; // 0 = empty, 1 = obstacle, 2 = dirt
vector<pair<int,int>> dirtSpots;
pair<int,int> startPos;

vector<int> dx = {1, -1, 0, 0};
vector<int> dy = {0, 0, 1, -1};

bool isValid(int x, int y) {
    return x >= 0 && x < n && y >= 0 && y < m && grid[x][y] != 1;
}

double heuristic(int x1, int y1, int x2, int y2) {
    // Manhattan distance
    return abs(x1 - x2) + abs(y1 - y2);
}

double aStar(pair<int,int> start, pair<int,int> goal) {
    vector<vector<double>> dist(n, vector<double>(m, 1e9));
    priority_queue<Node, vector<Node>, greater<Node>> pq;
    pq.push({start.first, start.second, 0.0, heuristic(start.first, start.second, goal.first, goal.second)});
    dist[start.first][start.second] = 0.0;

    while (!pq.empty()) {
        auto cur = pq.top(); pq.pop();
        if (cur.x == goal.first && cur.y == goal.second) {
            return cur.cost; // To Found shortest path
        }
        for (int i = 0; i < 4; i++) {
            int nx = cur.x + dx[i], ny = cur.y + dy[i];
            if (isValid(nx, ny) && dist[nx][ny] > cur.cost + 1) {
                dist[nx][ny] = cur.cost + 1;
                pq.push({nx, ny, cur.cost + 1, heuristic(nx, ny, goal.first, goal.second)});
            }
        }
    }
    return 1e9; // If No path
}

int main() {
    // Example: 5x6 grid
    n = 5; m = 6;
    grid = {
        {0,0,0,0,0,0},
        {0,1,1,0,0,0},
        {0,0,0,2,0,0},
        {0,0,1,0,2,0},
        {0,0,0,0,0,0}
    };

    startPos = {4, 0};

    // Collect dirt spots
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (grid[i][j] == 2) dirtSpots.push_back({i,j});
        }
    }

    // Precompute all distances (start + dirt spots)
    vector<pair<int,int>> points = {startPos};
    points.insert(points.end(), dirtSpots.begin(), dirtSpots.end());

    int P = points.size();
    vector<vector<double>> distMatrix(P, vector<double>(P, 1e9));

    for (int i = 0; i < P; i++) {
        for (int j = 0; j < P; j++) {
            if (i != j) {
                distMatrix[i][j] = aStar(points[i], points[j]);
            } else {
                distMatrix[i][j] = 0;
            }
        }
    }

    // Greedy nearest-neighbor TSP
    vector<bool> visited(P, false);
    int cur = 0; // start
    visited[cur] = true;
    double totalCost = 0;

    cout << "Vacuum path order:\n";
    cout << "Start at (" << points[cur].first << "," << points[cur].second << ")\n";

    for (int step = 1; step < P; step++) {
        int next = -1;
        double best = 1e9;
        for (int j = 1; j < P; j++) { // skip start
            if (!visited[j] && distMatrix[cur][j] < best) {
                best = distMatrix[cur][j];
                next = j;
            }
        }
        if (next == -1) break;
        visited[next] = true;
        totalCost += best;
        cout << " -> (" << points[next].first << "," << points[next].second << ")"
             << " cost: " << best << "\n";
        cur = next;
    }

    cout << "Total movement cost: " << totalCost << "\n";
}
