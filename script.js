
// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const form = document.getElementById('form-cadastro');

const tabela = document.getElementById('alunosTableBody');

const busca = document.getElementById('busca');

const campoId = document.getElementById('aluno-id');

const botaoSalvar = document.getElementById('btn-cadastrar');

const botaoLimpar = document.getElementById('btn-limpar');

const tituloForm = document.getElementById('titulo-form');

const campoCelular = document.getElementById('celular');

const campoCep = document.getElementById('cep');

const campoEmail = document.getElementById('email');

let alunos = [];


// ==========================================
// MÁSCARA DE CELULAR
// ==========================================

const formatarCelular = (valor) => {

    const numeros = String(valor || '')
        .replace(/\D/g, '')
        .slice(0, 11);

    if (numeros.length === 0) return '';

    if (numeros.length <= 2) {
        return `(${numeros}`;
    }

    if (numeros.length <= 6) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;

};


campoCelular.addEventListener('input', (event) => {

    event.target.value = formatarCelular(event.target.value);

});


// ==========================================
// MÁSCARA DE CEP
// ==========================================

const formatarCEP = (valor) => {

    const numeros = String(valor || '')
        .replace(/\D/g, '')
        .slice(0, 8);

    if (numeros.length <= 5) {
        return numeros;
    }

    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;

};


campoCep.addEventListener('input', (event) => {

    event.target.value = formatarCEP(event.target.value);

});


// ==========================================
// NORMALIZAÇÃO DOS CAMPOS
// ==========================================

campoEmail.addEventListener('input', (event) => {

    event.target.value = event.target.value.toLowerCase().trim();

});


['nome', 'cidade', 'logradouro', 'bairro'].forEach(id => {

    const campo = document.getElementById(id);

    campo.addEventListener('blur', () => {

        campo.value = campo.value.replace(/\s+/g, ' ').trim();

    });

});


document.getElementById('estado').addEventListener('input', (event) => {

    event.target.value = event.target.value
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 2)
        .toUpperCase();

});


// ==========================================
// PEGAR DADOS DO FORMULÁRIO
// ==========================================

const pegarDadosFormulario = () => {

    return {

        nome: document.getElementById('nome').value.trim(),

        email: campoEmail.value.trim().toLowerCase(),

        celular: campoCelular.value.replace(/\D/g, ''),

        logradouro: document.getElementById('logradouro').value.trim(),

        bairro: document.getElementById('bairro').value.trim(),

        cidade: document.getElementById('cidade').value.trim(),

        estado: document.getElementById('estado').value.trim().toUpperCase(),

        cep: campoCep.value.replace(/\D/g, '')

    };

};


// ==========================================
// VALIDAR DADOS
// ==========================================

const validarAluno = (aluno) => {

    if (!aluno.nome) {
        throw new Error('Informe o nome do aluno.');
    }

    if (!aluno.email) {
        throw new Error('Informe o e-mail do aluno.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aluno.email)) {
        throw new Error('Informe um e-mail válido.');
    }

    if (!aluno.celular) {
        throw new Error('Informe o celular do aluno.');
    }

    if (![10, 11].includes(aluno.celular.length)) {
        throw new Error('Informe um celular válido com DDD.');
    }

    if (!aluno.cep) {
        throw new Error('Informe o CEP.');
    }

    if (aluno.cep.length !== 8) {
        throw new Error('O CEP deve possuir 8 números.');
    }

    if (!aluno.cidade) {
        throw new Error('Informe a cidade.');
    }

    if (!aluno.estado) {
        throw new Error('Informe o estado.');
    }

    if (aluno.estado.length !== 2) {
        throw new Error('Informe a sigla do estado com duas letras.');
    }

};


// ==========================================
// PROTEGER TEXTO HTML
// ==========================================

const escaparHTML = (valor) => {

    return String(valor ?? '').replace(/[&<>"']/g, caractere => ({

        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'

    })[caractere]);

};


// ==========================================
// CARREGAR ALUNOS DA API
// ==========================================

const carregarAlunos = async () => {

    tabela.innerHTML = `
        <tr>
            <td colspan="7">Carregando alunos...</td>
        </tr>
    `;

    try {

        const resposta = await getAlunos();

        alunos = Array.isArray(resposta)
            ? resposta
            : Array.isArray(resposta?.alunos)
                ? resposta.alunos
                : [];

        renderizarAlunos();

    } catch (error) {

        console.error('Erro ao carregar alunos:', error);

        alunos = [];

        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="mensagem-erro">
                    Erro ao carregar alunos: ${escaparHTML(error.message)}
                </td>
            </tr>
        `;

    }

};


// ==========================================
// RENDERIZAR TABELA
// ==========================================

const renderizarAlunos = () => {

    const termo = busca.value.toLowerCase().trim();

    const filtrados = alunos.filter(aluno => {

        return (

            String(aluno.nome || '').toLowerCase().includes(termo) ||

            String(aluno.email || '').toLowerCase().includes(termo)

        );

    });

    tabela.innerHTML = '';

    if (filtrados.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="mensagem-vazia">
                    Nenhum aluno encontrado.
                </td>
            </tr>
        `;

        return;

    }


    filtrados.forEach(aluno => {

        const iniciais = String(aluno.nome || 'AL')

            .split(' ')

            .filter(Boolean)

            .slice(0, 2)

            .map(nome => nome[0])

            .join('')

            .toUpperCase();


        const linha = document.createElement('tr');


        linha.innerHTML = `

            <td>

                <div class="student-info">

                    <div class="avatar">
                        ${escaparHTML(iniciais)}
                    </div>

                    <div class="student-details">

                        <strong>
                            ${escaparHTML(aluno.nome)}
                        </strong>

                        <small>
                            Cadastro #${escaparHTML(aluno.id)}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${escaparHTML(
                    aluno.celular
                        ? formatarCelular(aluno.celular)
                        : 'Não informado'
                )}
            </td>


            <td>
                ${escaparHTML(aluno.email || 'Não informado')}
            </td>


            <td>
                ${escaparHTML(aluno.cidade || 'Não informado')}
            </td>


            <td>
                ${escaparHTML(aluno.estado || 'Não informado')}
            </td>


            <td>
                ${escaparHTML(
                    aluno.cep
                        ? formatarCEP(aluno.cep)
                        : 'Não informado'
                )}
            </td>


            <td>

                <div class="table-actions">

                    <button
                        type="button"
                        class="btn-edit"
                        data-action="editar"
                        data-id="${escaparHTML(aluno.id)}">

                        ✎ Editar

                    </button>


                    <button
                        type="button"
                        class="btn-delete"
                        data-action="excluir"
                        data-id="${escaparHTML(aluno.id)}">

                        Excluir

                    </button>

                </div>

            </td>

        `;


        tabela.appendChild(linha);

    });

};


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

const limparFormulario = () => {

    form.reset();

    campoId.value = '';

    botaoSalvar.textContent = 'Cadastrar';

    tituloForm.textContent = 'Cadastrar Aluno';

};


// ==========================================
// EVENTO DE RESET
// ==========================================

form.addEventListener('reset', () => {

    campoId.value = '';

    botaoSalvar.textContent = 'Cadastrar';

    tituloForm.textContent = 'Cadastrar Aluno';

});


// ==========================================
// CADASTRAR / ATUALIZAR ALUNO
// ==========================================

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    if (botaoSalvar.disabled) return;

    const aluno = pegarDadosFormulario();

    try {

        validarAluno(aluno);

        botaoSalvar.disabled = true;

        botaoSalvar.textContent = 'Salvando...';


        if (campoId.value) {

            aluno.id = campoId.value;

            await putAluno(aluno);

            alert('Aluno atualizado com sucesso!');

        } else {

            await postAluno(aluno);

            alert('Aluno cadastrado com sucesso!');

        }


        limparFormulario();

        await carregarAlunos();


    } catch (error) {

        console.error('Erro ao salvar aluno:', error);

        alert(`Não foi possível salvar: ${error.message}`);

    } finally {

        botaoSalvar.disabled = false;

        botaoSalvar.textContent = campoId.value
            ? 'Atualizar'
            : 'Cadastrar';

    }

});


// ==========================================
// EDITAR ALUNO
// ==========================================

const editarAluno = async (id) => {

    try {

        const aluno = await getAluno(id);

        campoId.value = aluno.id;

        document.getElementById('nome').value = aluno.nome || '';

        campoEmail.value = aluno.email || '';

        campoCelular.value = formatarCelular(aluno.celular || '');

        document.getElementById('logradouro').value = aluno.logradouro || '';

        document.getElementById('bairro').value = aluno.bairro || '';

        document.getElementById('cidade').value = aluno.cidade || '';

        document.getElementById('estado').value = aluno.estado || '';

        campoCep.value = formatarCEP(aluno.cep || '');


        botaoSalvar.textContent = 'Atualizar';

        tituloForm.textContent = 'Editar Aluno';


        window.scrollTo({

            top: 0,

            behavior: 'smooth'

        });


    } catch (error) {

        console.error('Erro ao buscar aluno:', error);

        alert(`Não foi possível buscar o aluno: ${error.message}`);

    }

};


// ==========================================
// EXCLUIR ALUNO
// ==========================================

const excluirAluno = async (id) => {

    const confirmar = confirm(
        'Deseja realmente excluir este aluno?'
    );

    if (!confirmar) return;


    try {

        await deleteAluno(id);

        alert('Aluno excluído com sucesso!');

        await carregarAlunos();


    } catch (error) {

        console.error('Erro ao excluir aluno:', error);

        alert(`Não foi possível excluir: ${error.message}`);

    }

};


// ==========================================
// EVENTOS DA TABELA
// ==========================================

tabela.addEventListener('click', async (event) => {

    const botao = event.target.closest('button[data-action]');

    if (!botao) return;

    const id = botao.dataset.id;

    const acao = botao.dataset.action;


    if (acao === 'editar') {

        await editarAluno(id);

    }


    if (acao === 'excluir') {

        await excluirAluno(id);

    }

});


// ==========================================
// PESQUISA
// ==========================================

busca.addEventListener('input', renderizarAlunos);


// ==========================================
// BOTÃO LIMPAR
// ==========================================

botaoLimpar.addEventListener('click', () => {

    limparFormulario();

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarAlunos();