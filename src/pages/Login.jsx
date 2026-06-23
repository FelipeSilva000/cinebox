import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import GoogleMockLogin from '../components/GoogleMockLogin';
import { User, Lock, Compass } from 'lucide-react';

const Login = () => {
  const { login, register, loginWithGoogleMock } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login Form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form states
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regAvatar, setRegAvatar] = useState('');

  // Dialog State
  const [isGoogleOpen, setIsGoogleOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginUsername || !loginPassword) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }

    const res = login(loginUsername, loginPassword);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regUsername || !regPassword || !regName) {
      setErrorMsg('Preencha todos os campos obrigatórios.');
      return;
    }

    const res = register(regUsername, regPassword, regName, regAvatar);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg('Cadastro realizado com sucesso! Conectando...');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box glass-panel">
        <div className="auth-logo">
          <Compass size={40} className="text-neon" style={{ margin: '0 auto 0.5rem' }} />
          <div>CineBox</div>
        </div>

        <div className="auth-tabs">
          <div 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
          >
            Entrar
          </div>
          <div 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
          >
            Cadastrar
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {successMsg}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Usuário</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Nome de usuário (Ex: felipe)"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
                <User size={16} style={{ position: 'absolute', right: '14px', top: '15px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Sua senha"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', right: '14px', top: '15px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}>
              Acessar Diário
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Nome Completo *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Felipe Silva"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Usuário *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="nome_usuario (Ex: felipe)"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Digite uma senha"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL do Avatar / Foto (Opcional)</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://exemplo.com/foto.jpg"
                value={regAvatar}
                onChange={(e) => setRegAvatar(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}>
              Criar Conta e Entrar
            </button>
          </form>
        )}

        <div className="divider">ou</div>

        {/* Google Authentication Button */}
        <button 
          type="button" 
          onClick={() => setIsGoogleOpen(true)}
          className="btn btn-google"
          style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#ea4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 15 0 12 0 7.35 0 3.37 2.67 1.44 6.56l3.85 2.99C6.22 6.56 8.9 5.04 12 5.04z"/>
            <path fill="#4285f4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.33 3.51l3.61 2.8c2.12-1.95 3.33-4.83 3.33-8.46z"/>
            <path fill="#fbbc05" d="M5.29 14.43c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.44 6.56C.52 8.39 0 10.39 0 12s.52 3.61 1.44 5.44l3.85-3.01z"/>
            <path fill="#34a853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.61-2.8c-1.1.74-2.5 1.18-4.35 1.18-3.1 0-5.78-2.01-6.72-4.73L1.44 17.66C3.37 21.33 7.35 24 12 24z"/>
          </svg>
          Entrar com o Google
        </button>
      </div>

      {/* Google Chooser Modal Sim */}
      <GoogleMockLogin 
        isOpen={isGoogleOpen} 
        onClose={() => setIsGoogleOpen(false)}
        onSelect={loginWithGoogleMock}
      />
    </div>
  );
};

export default Login;
