export default function BFS(grid, startNode, endNode) {
  const visitedNodes = [];
  const queue = [startNode];
  const visited = new Set([`${startNode.row},${startNode.col}`]);
  
  while (queue.length) {
    const node = queue.shift();
    if (node.isWall) continue;
    visitedNodes.push(node);
    if (node === endNode) break;
    
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row},${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        neighbor.previousNode = node;
        queue.push(neighbor);
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
