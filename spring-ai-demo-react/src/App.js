
import React, { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import ChatBot from './components/Chat';
import RecipeGenerator from './components/RecipeGenerator';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('image-generator');

  return (
    <div className="App">
      <header className="app-header">
        <h1>Imagine AI</h1>

        <nav className="header-nav">
          <button
            className={activeTab === 'image-generator' ? 'active' : ''}
            onClick={() => setActiveTab('image-generator')}
          >
            Image Generator
          </button>

          <button
            className={activeTab === 'chat-ai' ? 'active' : ''}
            onClick={() => setActiveTab('chat-ai')}
          >
            Chat AI
          </button>

          <button
            className={activeTab === 'recipe-generator' ? 'active' : ''}
            onClick={() => setActiveTab('recipe-generator')}
          >
            Recipe Generator
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'image-generator' && <ImageGenerator />}
        {activeTab === 'chat-ai' && <ChatBot />}
        {activeTab === 'recipe-generator' && <RecipeGenerator />}
      </main>
    </div>
  );
}

export default App;