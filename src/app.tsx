import React, { useState } from 'react';
import './app.css';
import axios from "axios";
//add some css styling and change err handling if the correct input is not being entered.
const App: React.FC = () => {
  // input text
  const [text, setText] = useState('');
  // our result after api reasons the solution
  const [result, setResult] = useState<string | null>(null);
  // emoji we show after the result based on the emotion
  const [emoji, setEmoji] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
// all our avaliable emotions mapped on a emoji
  const emojiMap: Record<string, string> = {
    joy: '😄',
    anger: '😡',
    sadness: '😢',
    fear: '😱',
    surprise: '😲',
    disgust: '🤢',
    neutral: '😐', 
  };

  const handleSubmit = async () => {
    //taking api from huggingface 
    const apiUrl = 'https://api-inference.huggingface.co/models/michellejieli/emotion_text_classifier';
    const apiKey = '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';

    try {
      const response = await axios.post(apiUrl, { inputs: text }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const emotions = response.data[0];
      // looping trough our emotions in our array of emotions and finding the one with the best score for this case
      if (emotions && emotions.length > 0) {
        const highestEmotion = emotions.reduce((prev, current) => {
          return (prev.score > current.score) ? prev : current;
        });
      // loging confidence on our predicted emotion
        setResult(`Confidence: ${(highestEmotion.score * 100).toFixed(2)}%`);
        setEmoji(emojiMap[highestEmotion.label] || null);
      } else {
        setResult('Neutral');
        setEmoji(emojiMap['neutral']);
      }
    } catch (error) {
      console.error('Error fetching tone analysis:', error);
      setResult('Error fetching tone analysis.');
      setEmoji(null);
    }
  };

  return (
    <div className="app">
      <h1>Emotional Tone Detector</h1>
      <textarea
        placeholder="Input text here"
        value={text}
        onChange={handleInputChange}
        rows={5}
      />
      <button onClick={handleSubmit}>Check</button>
      {emoji && <div className="emoji" style={{ fontSize: '3rem' }}>{emoji}</div>} {/* showing emoji */}
      {result && <div className="result">{result}</div>} {/* Showing result probability with certain confidance */}
    </div>
   
  );
  
};

export default App;
