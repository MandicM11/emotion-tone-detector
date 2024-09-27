import React, { useState } from 'react';
import './app.css';
import axios from "axios";

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const emojiMap: Record<string, string> = {
    joy: '😄',
    anger: '😡',
    sadness: '😢',
    fear: '😱',
    surprise: '😲',
    disgust: '🤢',
    neutral: '😐',
    confident: '💪', 
  };

  const handleSubmit = async () => {
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

      if (emotions && emotions.length > 0) {
        const highestEmotion = emotions.reduce((prev, current) => {
          return (prev.score > current.score) ? prev : current;
        });

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
      {emoji && <div className="emoji" style={{ fontSize: '3rem' }}>{emoji}</div>} {/* Prikazivanje smajlija */}
      {result && <div className="result">{result}</div>} {/* Prikazivanje rezultata */}
    </div>
  );
};

export default App;
