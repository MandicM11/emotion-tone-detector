import React, { useState } from 'react';
import './app.css';
import axios from "axios";

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  //This is where we handle API call 
  const handleSubmit = async () => {
    //cant fetch data find correct API
    const apiUrl = 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/{instance_id}/v3/tone?version=2017-09-21';
    const apiKey = '79e02d44-4cf1-435d-a47a-2c02fc4ea43d';
  
    try {
      const response = await axios.post(apiUrl, { text }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('apikey:' + apiKey)}`,
        },
      });
      const tones = response.data.document_tone.tones;
      setResult(tones.length ? tones[0].tone_name : 'Neutral');
    } catch (error) {
      console.error('Error fetching tone analysis:', error);
      setResult('Error fetching tone analysis.');
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
      {result && <div className="result">{result}</div>}
    </div>
  );
};

export default App;
