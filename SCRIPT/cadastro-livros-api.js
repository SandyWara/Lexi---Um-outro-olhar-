// Cadastro usando o contrato LivroDTO do Back-end atualizado.
const formCadastroLivro = document.getElementById('form-cadastro-livro');
const statusCadastroLivro = document.getElementById('status-cadastro-livro');

formCadastroLivro?.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = document.getElementById('btn-cadastrar-livro');
    const dados = new FormData(formCadastroLivro);
    const titulo = String(dados.get('titulo') || '').trim();
    const autor = String(dados.get('autor') || '').trim();
    const genero = String(dados.get('genero') || '').trim();
    const anoTexto = String(dados.get('anoPublicacao') || '').trim();
    const conteudo = String(dados.get('conteudo') || '');

    if (!titulo || !autor || !genero || (anoTexto && !/^\d{1,4}$/.test(anoTexto))) {
        statusCadastroLivro.textContent = 'Preencha título, autor e gênero e confira o ano.';
        return;
    }

    // LivroController.LivroDTO recebe autor e genero como textos.
    const livro = {
        titulo,
        autor,
        genero,
        anoPublicacao: anoTexto ? Number(anoTexto) : null,
        conteudo
    };
    botao.disabled = true;
    statusCadastroLivro.textContent = 'Enviando livro ao servidor...';
    try {
        const resposta = await lexiServico.cadastrarLivro(livro);
        if (resposta?.idLivro == null) throw new Error('API não confirmou o identificador do livro.');
        statusCadastroLivro.textContent = `Livro cadastrado no servidor! Código ${resposta.idLivro}.`;
        formCadastroLivro.reset();
        // Atualiza a vitrine apenas se a API ja permitir consultar livros.
        try {
            const livros = await lexiServico.listarLivros();
            if (Array.isArray(livros)) {
                CATALOGO_LIVROS = livros.map(l => adaptarLivroApi(l));
                if (typeof renderizarVitrine === 'function') renderizarVitrine();
            }
        } catch (erroConsulta) {
            console.warn('Livro recebido pela API, mas o catalogo nao pode ser atualizado:', erroConsulta);
            statusCadastroLivro.textContent += ' Atualize o catalogo quando a busca estiver disponivel.';
        }
    } catch (erro) {
        console.error('Falha ao cadastrar livro:', erro);
        statusCadastroLivro.textContent = 'Não foi possível confirmar o cadastro. Abra F12 > Network e confira a resposta de POST /api/livros.';
    } finally {
        botao.disabled = false;
    }
});
