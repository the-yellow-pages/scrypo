import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StarknetConfig, publicProvider, voyager, argent } from '@starknet-react/core';
import { WebWalletConnector } from 'starknetkit/webwallet';
import { mainnet, sepolia } from '@starknet-react/chains';
import type { Connector } from 'starknetkit';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider.tsx';

const connectors = [
  argent(),
  //new WebWalletConnector({ url: 'https://web.argent.xyz' }),
];

const chains = [sepolia];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StarknetConfig
        chains={chains}
        provider={publicProvider()}
        connectors={connectors as Connector[]}
        explorer={voyager}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </StarknetConfig>
    </BrowserRouter>
  </StrictMode>,
)
