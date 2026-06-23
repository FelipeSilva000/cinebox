import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Key, User, Download, Upload, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const { 
    tmdbKey, 
    updateTmdbKey, 
    user, 
    users, 
    register, 
    exportData, 
    importData 
  } = useContext(AppContext);

  // TMDB state
  const [apiKeyInput, setApiKeyInput] = useState(tmdbKey);
  const [keySaved, setKeySaved] = useState(false);

  // Profile Edit State
  const [nameInput, setNameInput] = useState(user ? user.name : '');
  const [avatarInput, setAvatarInput] = useState(user ? user.avatar : '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Backup State
  const [importStatus, setImportStatus] = useState({ show: false, success: false, message: '' });

  const handleSaveKey = (e) => {
    e.preventDefault();
    updateTmdbKey(apiKeyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!user) return;
    
    // Mutate registered users list and active user
    user.name = nameInput.trim();
    user.avatar = avatarInput.trim();
    
    // Save state back to trigger AppContext state synchronization
    localStorage.setItem('cinebox_current_user', JSON.stringify(user));
    
    const updatedUsers = users.map(u => u.username === user.username ? { ...u, name: nameInput.trim(), avatar: avatarInput.trim() } : u);
    localStorage.setItem('cinebox_registered_users', JSON.stringify(updatedUsers));
    
    setProfileSaved(true);
    setTimeout(() => {
      setProfileSaved(false);
      // Reload page to propagate changes safely or rely on React context
      window.location.reload();
    }, 2000);
  };

  const handleExport = () => {
    const dataStr = exportData();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cinebox-backup-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        const result = importData(event.target.result);
        if (result.success) {
          setImportStatus({
            show: true,
            success: true,
            message: 'Backup restaurado com sucesso! Recarregando página...'
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setImportStatus({
            show: true,
            success: false,
            message: result.message
          });
        }
      };
    }
  };

  return (
    <div style={{ padding: '0 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem' }}>
        Configurações do Sistema
      </h1>

      {/* 1. TMDB Key Integration Card */}
      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Key className="text-neon" size={22} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Chave de API do TMDB
          </h2>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          O CineBox funciona de forma autônoma integrada ao The Movie Database (TMDB). Adicione sua chave de API para habilitar buscas automáticas de pôsteres, sinopses, diretores e destaques mundiais.
        </p>

        <form onSubmit={handleSaveKey} style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cole aqui sua API Key do TMDB (Ex: abc123xyz...)"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">
            Salvar Chave
          </button>
        </form>

        {keySaved && (
          <div style={{ color: 'var(--accent-neon-green)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '600' }}>
            ✓ Chave de API atualizada com sucesso!
          </div>
        )}

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: '8px', 
          border: '1px solid var(--border-light)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          lineHeight: '1.4'
        }}>
          <strong>Como obter uma chave gratuita:</strong>
          <ol style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
            <li>Crie uma conta gratuita em <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-neon-green)', textDecoration: 'none' }}>themoviedb.org</a>.</li>
            <li>Acesse seu perfil, clique em <strong>Configurações</strong> e selecione a aba <strong>API</strong> à esquerda.</li>
            <li>Clique em "Criar" e peça uma chave de desenvolvedor (preencha dados simples solicitados).</li>
            <li>Copie a <strong>Chave de API (v3 auth)</strong> gerada e cole no campo acima!</li>
          </ol>
        </div>
      </section>

      {/* 2. Profile Editor Card */}
      {user && (
        <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <User className="text-neon" size={22} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
              Editar Perfil Ativo
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Seu Nome de Exibição</label>
              <input 
                type="text" 
                className="form-input" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Link da Foto de Perfil (Avatar URL)</label>
              <input 
                type="url" 
                className="form-input" 
                value={avatarInput}
                onChange={(e) => setAvatarInput(e.target.value)}
              />
            </div>

            <div>
              <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                Salvar Alterações
              </button>
            </div>
          </form>

          {profileSaved && (
            <div style={{ color: 'var(--accent-neon-green)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '600' }}>
              ✓ Perfil atualizado! Recarregando...
            </div>
          )}
        </section>
      )}

      {/* 3. Backup JSON Data Card */}
      <section className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <ShieldCheck className="text-neon" size={22} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Segurança e Backup
          </h2>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Como seus dados de avaliações, watchlist e perfis de casal são salvos localmente no navegador, limpar o histórico do navegador pode apagá-los. Baixe um arquivo de backup para restaurar seus dados quando quiser!
        </p>

        {importStatus.show && (
          <div style={{ 
            background: importStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            border: importStatus.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)', 
            color: importStatus.success ? '#34d399' : '#f87171', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            fontSize: '0.85rem', 
            marginBottom: '1.25rem' 
          }}>
            {importStatus.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Export button */}
          <button onClick={handleExport} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            <Download size={18} /> Exportar Backup (JSON)
          </button>

          {/* Import Button Mocked */}
          <label className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', margin: 0, cursor: 'pointer' }}>
            <Upload size={18} /> Importar Backup (JSON)
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </section>
    </div>
  );
};

export default Settings;
