import React, { useState } from 'react';
import { X } from 'lucide-react';

const GoogleMockLogin = ({ isOpen, onClose, onSelect }) => {
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    
    // Derive name from email (e.g. felipe.silva@gmail.com -> Felipe Silva)
    const emailParts = customEmail.split('@')[0];
    const formattedName = emailParts
      .split(/[._\-+]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    handleSelect({
      email: customEmail,
      name: formattedName,
      picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${emailParts}`
    });
  };

  const handleSelect = (account) => {
    onSelect(account);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content google-chooser" style={{ maxWidth: '380px', background: '#ffffff', color: '#1f2937', padding: '2rem' }}>
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
          <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1.5rem' }}>para acessar o CineBox</p>
        </div>

        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>E-mail ou telefone</label>
            <input 
              type="email" 
              className="form-input" 
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="seu-email@gmail.com"
              required
              style={{ background: '#f9fafb', border: '1px solid #d1d5db', color: '#1f2937', padding: '0.75rem 1rem', borderRadius: '4px', width: '100%', fontSize: '0.95rem' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ color: '#fff', background: '#1a73e8', padding: '0.6rem 1.5rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '600' }}
            >
              Próximo
            </button>
          </div>
        </form>
        
        <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2rem', textAlign: 'left', lineHeight: '1.4' }}>
          Para continuar, o Google compartilhará seu nome, endereço de e-mail, preferência de idioma e foto do perfil com o CineBox. (Simulação segura para fins locais).
        </div>
      </div>
    </div>
  );
};

export default GoogleMockLogin;
