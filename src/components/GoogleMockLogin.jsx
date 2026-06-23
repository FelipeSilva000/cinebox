import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';

const GoogleMockLogin = ({ isOpen, onClose, onSelect }) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const mockGoogleAccounts = [
    {
      email: 'felipe.silva@gmail.com',
      name: 'Felipe Silva',
      picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    {
      email: 'dupla.cinebox@gmail.com',
      name: 'Amor CineBox',
      picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const handleSelect = (account) => {
    onSelect(account);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    
    handleSelect({
      email: customEmail,
      name: customName,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${customEmail}`
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content google-chooser" style={{ maxWidth: '400px', background: '#ffffff', color: '#1f2937' }}>
        <button onClick={onClose} className="modal-close" style={{ color: '#9ca3af' }}>
          <X size={20} />
        </button>
        
        <div className="google-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Mock Google Logo */}
          <svg viewBox="0 0 24 24" width="32" height="32" style={{ marginBottom: '1rem' }}>
            <path fill="#ea4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 15 0 12 0 7.35 0 3.37 2.67 1.44 6.56l3.85 2.99C6.22 6.56 8.9 5.04 12 5.04z"/>
            <path fill="#4285f4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.33 3.51l3.61 2.8c2.12-1.95 3.33-4.83 3.33-8.46z"/>
            <path fill="#fbbc05" d="M5.29 14.43c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.44 6.56C.52 8.39 0 10.39 0 12s.52 3.61 1.44 5.44l3.85-3.01z"/>
            <path fill="#34a853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.61-2.8c-1.1.74-2.5 1.18-4.35 1.18-3.1 0-5.78-2.01-6.72-4.73L1.44 17.66C3.37 21.33 7.35 24 12 24z"/>
          </svg>
          <h2 className="google-title" style={{ color: '#1f2937', marginBottom: '0.25rem' }}>Fazer login com o Google</h2>
          <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>para continuar no CineBox</p>
        </div>

        {!showCustomForm ? (
          <div>
            <div className="google-account-list">
              {mockGoogleAccounts.map((account) => (
                <div 
                  key={account.email} 
                  className="google-account-item" 
                  onClick={() => handleSelect(account)}
                  style={{ border: '1px solid #e5e7eb', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0' }}
                >
                  <img src={account.picture} alt={account.name} className="google-avatar" style={{ borderRadius: '50%', width: '36px', height: '36px' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1f2937' }}>{account.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{account.email}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowCustomForm(true)}
              className="btn"
              style={{ width: '100%', justifyContent: 'center', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', marginTop: '0.5rem' }}
            >
              <Mail size={16} /> Usar outra conta
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.25rem' }}>Nome Completo</label>
              <input 
                type="text" 
                className="form-input" 
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: Felipe Silva"
                required
                style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937', padding: '0.6rem 0.8rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.25rem' }}>E-mail do Google</label>
              <input 
                type="email" 
                className="form-input" 
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="nome@gmail.com"
                required
                style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937', padding: '0.6rem 0.8rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setShowCustomForm(false)}
                className="btn btn-secondary"
                style={{ flex: 1, color: '#374151', background: '#f3f4f6', borderColor: '#d1d5db' }}
              >
                Voltar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ flex: 1, color: '#fff', background: '#4285f4' }}
              >
                Fazer Login
              </button>
            </div>
          </form>
        )}
        
        <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '1.5rem', textAlign: 'left', lineHeight: '1.3' }}>
          Para simular o Google Sign-In, esta janela permite que você escolha uma conta fictícia pré-carregada ou insira seus próprios dados para simular uma resposta do OAuth do Google de forma segura no ambiente local.
        </div>
      </div>
    </div>
  );
};

export default GoogleMockLogin;
