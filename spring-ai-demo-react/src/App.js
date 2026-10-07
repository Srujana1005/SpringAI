import logo from './logo.svg';
import './App.css';
import React,{useState} from 'react';
import ImageGenerator from './components/ImageGenerator';
import Chat from './components/Chat';
import RecipeGenerator from './components/RecipeGenerator';
function App() {
  const [activeTab,setActiveTab]=useState('image-generator');
  const handleTabChange=(tab) =>{
    
    setActiveTab(tab);
  };
  return (
    <div className="App">
      <button onClick={()=>handleTabChange('image-generator')}>
        Image Generator
        </button>
      <button onClick={()=>handleTabChange('chat')}>
        Chat
        </button>
      <button onClick={()=>handleTabChange('recipe-generator')}>
        Recipe Generator
        </button>

        <div>
          {activeTab==='image-generator'&& <ImageGenerator/>}
          {activeTab==='chat' && <Chat/>}
          {activeTab==='recipe-generator' && <RecipeGenerator/>}
        </div>
      
    </div>
  );
}

export default App;
