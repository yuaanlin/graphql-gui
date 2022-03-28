import { useState } from 'react';
import React from 'react';

interface Props {
  onSubmit: (name: string) => void;
}

function Welcome(props: Props) {
  const [input, setInput] = useState('');
  return <div
    className="w-screen h-screen flex
  flex-row items-center justify-center">
    <div className="text-center">
      <p className="text-xl font-extrabold mb-4">
        GraphQL GUI
      </p>
      <input
        className="outline-none rounded p-1 border border-gray-300
           transition-all focus:border-gray-700"
        placeholder="Enter your GraphQL endpoint there"
        value={input}
        onChange={e => setInput(e.target.value)} />
      <div className="mt-2">
        <button onClick={() => props.onSubmit(input)}>
          Go
        </button>
      </div>
    </div>
  </div>;
}

export default Welcome;
