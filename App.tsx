import React from 'react';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <Calculator />
    </div>
  );
};

export default App;