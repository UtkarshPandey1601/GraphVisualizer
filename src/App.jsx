import { useState,useEffect } from 'react';
import Grid from './components/Grid';
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Pathfinding Visualizer
          </h1>
          <p className="text-gray-600">
            Visualize how different algorithms find paths between two points
          </p>
        </div>
        
        <Grid />
        
      </div>
    </div>
  );
}