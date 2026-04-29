
import { PropertyProvider } from "./context/PropertyContext"
import { AuthProvider} from "./context/AuthContext"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
    <PropertyProvider>
      <App />
    </PropertyProvider>,
    </AuthProvider>
  </BrowserRouter>
)
