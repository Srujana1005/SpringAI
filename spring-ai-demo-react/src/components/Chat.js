
import React, { useState } from 'react';


function Chat() {
    const [prompt, setPrompt] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const askAI = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt first.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setChatResponse('');

            const response = await fetch(
                `http://localhost:8080/ask-ai-options?prompt=${encodeURIComponent(prompt)}`
            );

            if (!response.ok) {
                throw new Error('Failed to get a response from AI.');
            }

            const data = await response.text();
            setChatResponse(data);
        } catch (error) {
            setError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-heading">
                <div className="chat-icon">✦</div>
                <h2>Chat with AI</h2>
                <p>Ask anything. Explore ideas. Get instant answers.</p>
            </div>

            <div className="chat-panel">
                <div className="chat-welcome">
                    <span className="ai-badge">✦ AI ASSISTANT</span>
                    <h3>What can I help you with?</h3>
                    <p>Enter your question below and let AI help you.</p>
                </div>

                <div className="chat-input-area">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                askAI();
                            }
                        }}
                        placeholder="Ask me anything..."
                        rows={4}
                    />

                    <div className="chat-input-footer">
                        <span>Press Enter to send · Shift + Enter for a new line</span>

                        <button
                            className="chat-ask-button"
                            onClick={askAI}
                            disabled={loading || !prompt.trim()}
                        >
                            {loading ? 'Thinking...' : 'Ask AI ↗'}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="chat-loading">
                        <span className="chat-spinner"></span>
                        AI is thinking...
                    </div>
                )}

                {error && <div className="chat-error">{error}</div>}

                {chatResponse && (
                    <div className="chat-response">
                        <div className="response-title">
                            <span className="response-icon">✦</span>
                            <h3>AI Response</h3>
                        </div>
                        <p>{chatResponse}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;

