document.addEventListener('DOMContentLoaded', () => {
  const cepInput = document.getElementById('cepInput');
  const searchButton = document.getElementById('searchButton');
  const resultBox = document.getElementById('result');
  const messageBox = document.getElementById('message');

  // Mapeamento dos elementos de resultado
  const cepResult = document.getElementById('cepResult');
  const logradouroResult = document.getElementById('logradouroResult');
  const complementoResult = document.getElementById('complementoResult');
  const bairroResult = document.getElementById('bairroResult');
  const localidadeResult = document.getElementById('localidadeResult');
  const ufResult = document.getElementById('ufResult');

  // Função para limpar os resultados e mensagens
  function clearResults() {
    cepResult.textContent = '';
    logradouroResult.textContent = '';
    complementoResult.textContent = '';
    bairroResult.textContent = '';
    localidadeResult.textContent = '';
    ufResult.textContent = '';
    // NÃO esconda o resultBox aqui, pois a mensagem está dentro dele
    // resultBox.classList.add('hidden');
    messageBox.classList.add('hidden');
    messageBox.textContent = '';
    messageBox.classList.remove('error');
  }

  // Função para exibir uma mensagem (erro ou info)
  function showMessage(msg, isError = false) {
    // garante que o container de mensagens esteja visível
    resultBox.classList.remove('hidden');
    messageBox.textContent = msg;
    messageBox.classList.remove('hidden');
    if (isError) {
      messageBox.classList.add('error');
    } else {
      messageBox.classList.remove('error');
    }
  }

  // Função assíncrona para buscar o CEP
  async function searchCEP() {
    clearResults();
    const cep = (cepInput.value || '').replace(/\D/g, ''); // só números

    if (cep.length !== 8) {
      showMessage('Por favor, digite um CEP válido com 8 dígitos.', true);
      return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }
      const data = await response.json();

      if (data.erro) {
        showMessage('CEP não encontrado.', true);
      } else {
        displayResults(data);
      }
    } catch (error) {
      console.error('Erro:', error);
      showMessage('Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.', true);
    }
  }

  // Função para exibir os dados na tela
  function displayResults(data) {
    cepResult.textContent = data.cep || '';
    logradouroResult.textContent = data.logradouro || '';
    complementoResult.textContent = data.complemento || '';
    bairroResult.textContent = data.bairro || '';
    localidadeResult.textContent = data.localidade || '';
    ufResult.textContent = data.uf || '';
    // se quiser que só apareça com dados, pode remover esta linha:
    resultBox.classList.remove('hidden');
  }

  // Clique do botão
  searchButton.addEventListener('click', searchCEP);

  // Enter no input (keydown é mais confiável que keypress)
  cepInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchCEP();
    }
  });
});
