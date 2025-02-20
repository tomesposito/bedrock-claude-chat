import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';

import './i18n';
import { router } from './routes';

// Load the Pendo script using the key from an environment variable
const pendoKey = import.meta.env.VITE_PENDO_KEY;
console.log('PENDO_KEY', pendoKey);

if (pendoKey) {
  (function(apiKey: string) {
    (function(
      p: any,
      e: Document,
      n: string,
      d: string,
      o: any = {}
    ) {
      // Explicitly type 'v' as an array of strings and other variables with proper types.
      var v: string[] = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'],
          w: number,
          x: number,
          y: HTMLScriptElement,
          z: Element;
      o = p[d] = p[d] || {};
      o._q = o._q || [];
      for (w = 0, x = v.length; w < x; w++) {
        (function(m: string) {
          o[m] = o[m] || function() {
            o._q[m === v[0] ? 'unshift' : 'push'](
              [m].concat(Array.prototype.slice.call(arguments, 0))
            );
          };
        })(v[w]);
      }
      y = e.createElement(n) as HTMLScriptElement;
      y.async = true;
      y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
      z = e.getElementsByTagName(n)[0];
      if (z.parentNode) {
        z.parentNode.insertBefore(y, z);
      } else {
        console.warn('Could not find parent node for script insertion.');
      }
    })(window, document, 'script', 'pendo'); // Now, o defaults to {}
  })(pendoKey);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);