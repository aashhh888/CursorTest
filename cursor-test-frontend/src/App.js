import React from 'react';
import ImageGrid from './components/ImageGrid';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Grid Gallery</h1>
      </header>
      <main>
        <ImageGrid />
      </main>
    </div>
  );
}

export default App;
