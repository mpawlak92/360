import React from 'react';
import ReactDOM from 'react-dom/client';

import Viewer from './Viewer/Viewer';

import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className='container'>
      <div className='wrapper'>
        <Viewer />
      </div>
    </div>
  </React.StrictMode>
);
