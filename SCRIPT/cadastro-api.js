// Cadastro conectado à API usando o botão já existente no cabeçalho.
// Os prompts são provisórios: não há formulário de cadastro na versão FINAL.
document.querySelector('.btn-cadastro-header')?.addEventListener('click', async () => {
    const nome = prompt('Cadastro Lexi — nome:');
    if (nome === null) return;
    const email = prompt('Cadastro Lexi — e-mail:');
    if (email === null) return;
    const senha = prompt('Cadastro Lexi — senha de TESTE (não use uma senha pessoal):');
    if (senha === null) return;
    if (!nome.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || !senha) {
        alert('Preencha nome, e-mail válido e senha.');
        return;
    }
    try {
        const usuario = await lexiServico.cadastrarUsuario({ nome: nome.trim(), email: email.trim(), senha });
        if (usuario?.idUsuario == null) throw new Error('A API não retornou idUsuario.');
        localStorage.setItem('idUsuario', String(usuario.idUsuario));
        alert('Cadastro enviado à API com sucesso! O login real ainda depende do Back-end.');
    } catch (erro) {
        console.error('Falha no cadastro:', erro);
        alert('Cadastro não concluído. Verifique o servidor e tente novamente.');
    }
});
