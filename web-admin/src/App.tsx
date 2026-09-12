import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/auth/auth-provider';
import { AppRouter } from './router/AppRouter';
import './styles/admin.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}
