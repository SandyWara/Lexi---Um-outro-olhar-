let CATALOGO_LIVROS = [];
let BIBLIOTECAS_USUARIOS = {};

// A interface espera id, ano e capa; a API documenta idLivro e anoPublicacao.
function adaptarLivroApi(livro, capasLocais = []) {
    const correspondencia = capasLocais.find(local =>
        local.titulo?.toLocaleLowerCase('pt-BR') === String(livro.titulo || '').toLocaleLowerCase('pt-BR'));
    return {
        id: livro.idLivro ?? livro.id,
        titulo: String(livro.titulo || ''),
        autor: typeof livro.autor === 'object' ? String(livro.autor?.nome || '') : String(livro.autor || ''),
        genero: typeof livro.genero === 'object' ? String(livro.genero?.nome || '') : String(livro.genero || ''),
        ano: livro.anoPublicacao ?? livro.ano ?? '',
        capa: livro.capa || correspondencia?.capa || 'ICON/iconBiblioteca.png',
        conteudo: livro.conteudo ?? ''
    };
}

async function carregarDadosJSON() {
    // A biblioteca pessoal permanece demonstrativa até existirem as rotas no Back-end.
    let bibliotecaLocal = { bibliotecas: {}, catalogo: [] };
    try {
        const local = await fetch('JSON/dados.json');
        if (local.ok) bibliotecaLocal = await local.json();
    } catch (erro) { console.warn('Biblioteca demonstrativa indisponível:', erro); }
    BIBLIOTECAS_USUARIOS = bibliotecaLocal.bibliotecas || {};
    try {
        const livros = await lexiServico.listarLivros();
        if (!Array.isArray(livros)) throw new Error('A API não retornou uma lista de livros.');
        CATALOGO_LIVROS = livros.map(livro => adaptarLivroApi(livro, bibliotecaLocal.catalogo || []));
        console.info('Catálogo carregado pela API:', CATALOGO_LIVROS.length, 'livros');
    } catch (erro) {
        console.error('Não foi possível carregar livros da API:', erro);
        CATALOGO_LIVROS = [];
        const vitrine = document.getElementById('tela-livros');
        if (vitrine) vitrine.innerHTML = '<p role="alert">Não foi possível obter os livros do servidor. Tente atualizar a página.</p>';
    }
}
