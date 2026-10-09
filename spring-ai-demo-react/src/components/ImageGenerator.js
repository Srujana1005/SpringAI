import React, { useState } from 'react';

function ImageGenerator() {
const [prompts, setPrompts] = useState(['', '', '', '']);
const [images, setImages] = useState(['', '', '', '']);
const [loading, setLoading] = useState([false, false, false, false]);
const [errors, setErrors] = useState(['', '', '', '']);


const handlePromptChange = (index, value) => {
    setPrompts(prev =>
        prev.map((prompt, i) => i === index ? value : prompt)
    );
};

const generateImage = async (index) => {
    if (!prompts[index].trim()) {
        setErrors(prev =>
            prev.map((error, i) =>
                i === index ? 'Enter a prompt first.' : error
            )
        );
        return;
    }

    setLoading(prev =>
        prev.map((value, i) => i === index ? true : value)
    );

    setErrors(prev =>
        prev.map((error, i) => i === index ? '' : error)
    );

    try {
        const response = await fetch(
            `http://localhost:8080/generate-images?prompt=${encodeURIComponent(prompts[index])}&count=1`
        );

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const urls = await response.json();

        if (!urls.length) {
            throw new Error('No image was returned.');
        }

        setImages(prev =>
            prev.map((image, i) => i === index ? urls[0] : image)
        );
    } catch (error) {
        console.error(error);
        setErrors(prev =>
            prev.map((message, i) =>
                i === index ? 'Image generation failed. Try again.' : message
            )
        );
    } finally {
        setLoading(prev =>
            prev.map((value, i) => i === index ? false : value)
        );
    }
};

return (
    <div className="image-generator">
        <div className="generator-header">
            <h2>AI Image Studio</h2>
            <p>Enter a different prompt in each box and create images individually.</p>
        </div>

        <div className="image-grid">
            {prompts.map((prompt, index) => (
                <div className="image-card" key={index}>
                    <div className="image-card-title">
                        <span className="image-number">{index + 1}</span>
                        <h3>Image {index + 1}</h3>
                    </div>

                    <div className="image-preview">
                        {images[index] ? (
                            <img
                                src={images[index]}
                                alt={`Generated from prompt ${index + 1}`}
                            />
                        ) : (
                            <div className="image-placeholder">
                                <span className="placeholder-icon">✦</span>
                                <p>Your image will appear here</p>
                            </div>
                        )}

                        {loading[index] && (
                            <div className="image-loading">
                                <div className="spinner"></div>
                                <p>Creating your image...</p>
                            </div>
                        )}
                    </div>

                    <label htmlFor={`prompt-${index}`}>
                        Describe your image
                    </label>

                    <textarea
                        id={`prompt-${index}`}
                        value={prompt}
                        onChange={(e) =>
                            handlePromptChange(index, e.target.value)
                        }
                        placeholder={
                            index === 0
                                ? 'e.g. A cute dog in a garden'
                                : index === 1
                                ? 'e.g. A futuristic city at night'
                                : index === 2
                                ? 'e.g. A mountain landscape at sunset'
                                : 'e.g. A colourful butterfly on a flower'
                        }
                        rows="3"
                    />

                    {errors[index] && (
                        <p className="image-error">{errors[index]}</p>
                    )}

                    <button
                        className="generate-button"
                        onClick={() => generateImage(index)}
                        disabled={loading[index]}
                    >
                        {loading[index] ? 'Generating...' : '✦ Generate Image'}
                    </button>
                </div>
            ))}
        </div>
    </div>
);


}

export default ImageGenerator;
