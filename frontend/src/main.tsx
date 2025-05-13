import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StarknetConfig, publicProvider, voyager } from '@starknet-react/core';
import { WebWalletConnector } from 'starknetkit/webwallet';
import { mainnet, sepolia } from '@starknet-react/chains';
import type { Connector } from 'starknetkit';
import { BrowserRouter } from 'react-router-dom';

const connectors = [
  new WebWalletConnector({ url: 'https://web.argent.xyz' }),
];

const chains = [mainnet, sepolia];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StarknetConfig
        chains={chains}
        provider={publicProvider()}
        connectors={connectors as Connector[]}
        explorer={voyager}
      >
        <App />
      </StarknetConfig>
    </BrowserRouter>
  </StrictMode>,
)
