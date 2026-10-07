import react, { useState } from 'react';
function ImageGenerator(){
    const [prompt,setPrompt]=useState('');
    const [imageUrls,setImageUrls]=useState([]);
const generateImage=async()=>{

}
    return(
        <div className='tab-content'>
<h2>Generate an Image</h2>
<input type='text' value={prompt} onChange={(e)=>setPrompt(e.target.value)}
placeholder='Enter prompt for image'/>
<button onClick={generateImage}>Generate Image</button>
<div className='image-grid'>
    {imageUrls.map((url,index)=>{
            <img key={index} src={url} alt={`Generated ${index} `}/>
        }
    )
    }

</div>
        </div>
        
    );

}
export default ImageGenerator;