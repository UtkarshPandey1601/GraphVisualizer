export default function  Dijkstra(grid, startNode, endNode) {
  const visitedNodes = [];
  const unvisited = [];
  
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.previousNode = null;
      unvisited.push(node);
    }
  }
  
  startNode.distance = 0;
  
  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const node = unvisited.shift();
    
    if (node.isWall) continue;
    if (node.distance === Infinity) break;
    
    visitedNodes.push(node);
    if (node === endNode) break;
    
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      const alt = node.distance + 1;
      if (alt < neighbor.distance) {
        neighbor.distance = alt;
        neighbor.previousNode = node;
      }
    }
  }
  return visitedNodes;
}

function getNeighbors(node, grid) {
  const { row, col } = node
  const neighbors = []

  if (row > 0) neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])

  return neighbors
}
