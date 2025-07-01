export default function astar(grid, startNode, endNode) {
  const openSet = [];
  const visitedNodes = [];
  startNode.distance = 0;
  startNode.estDis = estDis(startNode, endNode);
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => (a.distance + a.estDis) - (b.distance + b.estDis));
    const current = openSet.shift();

    if (current.isWall) continue;
    visitedNodes.push(current);

    if (current === endNode) break;

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;
      const tentativeG = current.distance + 1;
      if (tentativeG < neighbor.distance) {
        neighbor.distance = tentativeG;
        neighbor.estDis = estDis(neighbor, endNode);
        neighbor.previousNode = current;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodes;
}

function estDis(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function getNeighbors(node, grid) {
  const { row, col } = node;
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}
