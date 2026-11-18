// Camada de comunicação com o Back-end (sem alterar as telas existentes).
const LEXI_API_URL = 'https://lexi-api-p9m8.onrender.com/api';

async function lexiApi(caminho, opcoes = {}) {
    const resposta = await fetch(`${LEXI_API_URL}${caminho}`, {
        ...opcoes,
        headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) }
    });
    if (!resposta.ok) {
        let detalhe = '';
        try { detalhe = (await resposta.text()).slice(0, 180); } catch (_) {}
        throw new Error(`API retornou HTTP ${resposta.status}${detalhe ? ': ' + detalhe : ''}`);
    }
    if (resposta.status === 204) return null;
    return resposta.json();
}

const lexiServico = {
    listarLivros: () => lexiApi('/livros'),
    buscarLivros: (tipo, termo) => lexiApi(`/livros?${encodeURIComponent(tipo)}=${encodeURIComponent(termo)}`),
    obterLivro: (id) => lexiApi(`/livros/${encodeURIComponent(id)}`),
    cadastrarLivro: (livro) => lexiApi('/livros', { method: 'POST', body: JSON.stringify(livro) }),
    excluirLivro: (id) => lexiApi(`/livros/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    cadastrarUsuario: (usuario) => lexiApi('/usuarios', { method: 'POST', body: JSON.stringify(usuario) }),
    obterPreferencias: (id) => lexiApi(`/usuarios/${encodeURIComponent(id)}/preferencias`),
    salvarPreferencias: (id, preferencias) => lexiApi(`/usuarios/${encodeURIComponent(id)}/preferencias`, {
        method: 'PUT', body: JSON.stringify(preferencias)
    })
};

// A rota /usuarios/login ainda não consta no Back-end fornecido.
// idUsuario identifica um cadastro, mas sozinho NÃO autentica uma sessão.
