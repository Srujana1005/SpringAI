
import React, { useState } from 'react';

function RecipeGenerator() {
    const [ingredients, setIngredients] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [recipe, setRecipe] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const createRecipe = async () => {
        if (!ingredients.trim()) {
            setError('Please enter at least one ingredient.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setRecipe('');

            const params = new URLSearchParams({
                ingredients,
                cuisine,
                dietaryRestrictions
            });

            const response = await fetch(
                `http://localhost:8080/recipe-generate?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error('Failed to generate recipe. Please try again.');
            }

            const data = await response.text();
            setRecipe(data);
        } catch (error) {
            setError(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recipe-container">
            <div className="recipe-heading">
                <div className="recipe-icon">🍳</div>
                <h2>AI Recipe Generator</h2>
                <p>Turn your ingredients into something delicious.</p>
            </div>

            <div className="recipe-panel">
                <div className="recipe-intro">
                    <span className="recipe-badge">✦ SMART COOKING</span>
                    <h3>What's in your kitchen?</h3>
                    <p>Tell us what you have, and AI will suggest a recipe for you.</p>
                </div>

                <div className="recipe-form">
                    <div className="recipe-field">
                        <label htmlFor="ingredients">🥕 Ingredients *</label>
                        <input
                            id="ingredients"
                            type="text"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="e.g. Tomato, potato, onion"
                        />
                        <small>Separate multiple ingredients with commas.</small>
                    </div>

                    <div className="recipe-field">
                        <label htmlFor="cuisine">🌎 Preferred cuisine</label>
                        <select
                            id="cuisine"
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                        >
                            <option value="">Any cuisine</option>
                            <option value="Indian">Indian</option>
                            <option value="South Indian">South Indian</option>
                            <option value="North Indian">North Indian</option>
                            <option value="Italian">Italian</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Thai">Thai</option>
                        </select>
                    </div>

                    <div className="recipe-field">
                        <label htmlFor="diet">🥗 Dietary preferences</label>
                        <select
                            id="diet"
                            value={dietaryRestrictions}
                            onChange={(e) => setDietaryRestrictions(e.target.value)}
                        >
                            <option value="">No specific restriction</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Gluten-free">Gluten-free</option>
                            <option value="Dairy-free">Dairy-free</option>
                            <option value="High-protein">High-protein</option>
                        </select>
                    </div>

                    <button
                        className="recipe-generate-button"
                        onClick={createRecipe}
                        disabled={loading || !ingredients.trim()}
                    >
                        {loading ? 'Creating your recipe...' : '✦ Generate Recipe'}
                    </button>
                </div>

                {loading && (
                    <div className="recipe-loading">
                        <span className="recipe-spinner"></span>
                        Finding a delicious recipe for you...
                    </div>
                )}

                {error && <div className="recipe-error">{error}</div>}

                {recipe && (
                    <div className="recipe-result">
                        <div className="recipe-result-heading">
                            <span className="recipe-result-icon">🍽️</span>
                            <div>
                                <h3>Your AI Recipe</h3>
                                <p>Made with your chosen ingredients</p>
                            </div>
                        </div>
                        <div className="recipe-text">{recipe}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeGenerator;
