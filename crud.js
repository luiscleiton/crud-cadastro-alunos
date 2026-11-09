
const BASE_URL = 'https://lion-school-phbo.onrender.com/alunos';

// ==========================================
// REQUISIÇÃO PADRÃO
// ==========================================

const requisicao = async (url, options = {}) => {

    const response = await fetch(url, options);

    const texto = await response.text();

    let data = null;

    try {
        data = texto ? JSON.parse(texto) : null;
    } catch {
        data = texto;
    }

    if (!response.ok) {

        throw new Error(
            data?.message ||
            data?.mensagem ||
            `Erro HTTP ${response.status}`
        );

    }

    return data;
};


// ==========================================
// BUSCAR TODOS OS ALUNOS
// ==========================================

const getAlunos = async () => {

    return await requisicao(BASE_URL);

};


// ==========================================
// BUSCAR ALUNO POR ID
// ==========================================

const getAluno = async (id) => {

    return await requisicao(`${BASE_URL}/${id}`);

};


// ==========================================
// CADASTRAR ALUNO
// ==========================================

const postAluno = async (aluno) => {

    return await requisicao(BASE_URL, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(aluno)

    });

};


// ==========================================
// ATUALIZAR ALUNO
// ==========================================

const putAluno = async (aluno) => {

    return await requisicao(`${BASE_URL}/${aluno.id}`, {

        method: 'PUT',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(aluno)

    });

};


// ==========================================
// EXCLUIR ALUNO
// ==========================================

const deleteAluno = async (id) => {

    return await requisicao(`${BASE_URL}/${id}`, {

        method: 'DELETE'

    });

};