/* ================================================================
   APP.JS — Arquivo consolidado com toda a lógica JavaScript
   ================================================================
   Consolidação de:
   - cep/cep.js (Busca de CEP via ViaCEP)
   - form/script.js (Cálculo de IMC)
   - salary/script.js (Cálculo de salário)
   ================================================================ */


/* ================================================================
   MÓDULO CEP — Busca de endereço via API ViaCEP
   ================================================================ */

/**
 * Busca informações de CEP na API ViaCEP
 * @author Júlia Dias <jdoc173@gmail.com>
 * @since 2026-03-31
 * @param {string} cep - CEP sem máscara (8 dígitos)
 */
async function searchCEP(cep) {
  const zipStatus = document.getElementById('zipStatus');
  zipStatus.innerHTML = "<img src='loading.gif' alt='Buscando o CEP'> Carregando...";
  zipStatus.style.color = 'blue';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error('Erro na requisição. Tente novamente!');
    }

    if (data.erro) {
      throw new Error('CEP não encontrado!');
    }

    document.getElementById('street').value = data.logradouro;
    document.getElementById('neighborhood').value = data.bairro;
    document.getElementById('city').value = data.localidade;
    document.getElementById('state').value = data.uf;

    zipStatus.textContent = 'CEP encontrado com sucesso!';
    zipStatus.style.color = 'green';
  } catch (error) {
    zipStatus.textContent = error.message;
    zipStatus.style.color = 'red';
    document.getElementById('street').value = '';
    document.getElementById('neighborhood').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
  }
}

/**
 * Inicializa o event listener para o campo de CEP
 */
const cepInput = document.getElementById('postalCode');
if (cepInput) {
  cepInput.addEventListener('input', (e) => {
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length === 8) {
      searchCEP(cep);
    }
  });
}

/**
 * Renderiza a tabela de clientes a partir do LocalStorage
 */
function renderTable() {
  const tableWrapper = document.getElementById('tableWrapper');
  const emptyMessage = document.getElementById('emptyMessage');
  const clients = JSON.parse(localStorage.getItem('clients')) || [];

  if (clients.length === 0) {
    tableWrapper.hidden = true;
    emptyMessage.hidden = false;
    return;
  }
}

/**
 * Event listener para submit do formulário de CEP
 */
const form = document.getElementById('registerForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newClient = {
      id: crypto.randomUUID(),
      taxId: document.getElementById('taxId').value,
      fullName: document.getElementById('fullName').value,
      postalCode: document.getElementById('postalCode').value,
      street: document.getElementById('street').value,
      addressNumber: document.getElementById('addressNumber').value,
      complement: document.getElementById('addressComplement') ? document.getElementById('addressComplement').value : '',
      neighborhood: document.getElementById('neighborhood').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
    };

    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.push(newClient);
    localStorage.setItem('clients', JSON.stringify(clients));
    renderTable();
  });
}



/* ================================================================
   MÓDULO IMC — Cálculo de IMC (Índice de Massa Corporal)
   ================================================================ */

/**
 * Define limite de data máxima (hoje) no campo date
 * @author Júlia Dias <jdoc173@gmail.com>
 * @since 2026-02-24
 */
function setDateLimit() {
  const limit = new Date().toISOString().split("T")[0];
  const inputDate = document.getElementById("birthDate");

  if (inputDate) {
    inputDate.setAttribute("max", limit);
  }
}

document.addEventListener("DOMContentLoaded", setDateLimit);

/**
 * Calcula a idade com base na data de nascimento
 * @param {string} birth - Data de nascimento (formato YYYY-MM-DD)
 * @returns {number} Idade em anos
 * @author Júlia Dias <jdoc173@gmail.com>
 * @since 2026-03-19
 */
function age(birth) {
  const dateBirth = new Date(birth);
  const today = new Date();

  let age = today.getFullYear() - dateBirth.getFullYear();
  const month = today.getMonth() - dateBirth.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < dateBirth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calcula o IMC e exibe o resultado
 * @param {Event} event - Evento do formulário
 * @author Júlia Dias <jdoc173@gmail.com>
 * @since 2026-03-19
 */
function IMC(event) {
  event.preventDefault();

  const name = document.getElementById("userName").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  const IMC = weight / (height * height);

  let classification = "";
  if (IMC >= 30) {
    classification = "Obesidade";
  } else if (IMC >= 25) {
    classification = "Excesso de peso";
  } else if (IMC >= 18.5) {
    classification = "Peso normal";
  } else {
    classification = "Abaixo do peso";
  }

  document.getElementById("resultImc").innerText = `${name} (${age(document.getElementById("birthDate").value)} anos), seu IMC é ${IMC.toFixed(2)} (${classification})`;

  const resultDiv = document.getElementById("result");
  const resetIMC = document.getElementById("resetImcButton");
  const calcIMC = document.getElementById("calculateImcButton");

  if (calcIMC) {
    calcIMC.addEventListener('click', function () {
      resultDiv.style.display = "flex";
    });
  }

  if (resetIMC) {
    resetIMC.addEventListener('click', function () {
      resultDiv.style.display = "none";
    });
  }
}


/* ================================================================
   MÓDULO SALÁRIO — Cálculo de INSS, IRRF e Salário Líquido
   ================================================================ */

/**
 * Calcula o INSS com base no salário e tipo de vínculo
 * @author Júlia Dias <jdoc173@gmail.com>
 * @since 2026-03-17
 * @param {number} salary - Salário bruto
 * @returns {number} Valor do INSS
 */
function calculateINSS(salary) {
  const link = document.getElementById('employmentType') ? document.getElementById('employmentType').value : '1';

  switch (link) {
    case '1': // CLT
      if (salary <= 1621.00) {
        return salary * 0.075;
      } else if (salary <= 2902.84) {
        return salary * 0.09 - 24.32;
      } else if (salary <= 4354.27) {
        return salary * 0.12 - 111.40;
      } else {
        return 8475.55 * 0.14 - 198.49;
      }
    case '2': // MEI/PJ
      return 0;
    case '3': // Pró-labore
      return 1621.00 * 0.11;
    default:
      return 0;
  }
}

/**
 * Calcula o IRRF com base no salário e INSS
 * @param {number} salary - Salário bruto
 * @param {number} inss - Valor do INSS
 * @returns {number} Valor do IRRF
 */
function calculateIRRF(salary, inss) {
  const taxable = salary - inss;

  if (taxable <= 2259.20) {
    return 0;
  } else if (taxable <= 2826.65) {
    return taxable * 0.075 - 169.44;
  } else if (taxable <= 3751.05) {
    return taxable * 0.15 - 381.44;
  } else if (taxable <= 4664.68) {
    return taxable * 0.225 - 645.44;
  } else {
    return taxable * 0.275 - 993.44;
  }
}

/**
 * Processa o formulário de cálculo de salário
 * @param {Event} event - Evento do formulário
 * @author Júlia Dias <jdoc173@gmail.com>
 * @since 2026-03-17
 */
function Salary(event) {
  event.preventDefault();

  const salaryInput = document.getElementById('salaryInput') ? document.getElementById('salaryInput').value : '';
  const link = document.getElementById('employmentType') ? document.getElementById('employmentType').value : '1';

  const salary = parseFloat(salaryInput.replace(',', '.'));

  if (isNaN(salary) || salary <= 0) {
    alert('Por favor, insira um valor salarial válido');
    return;
  }

  const inss = calculateINSS(salary);
  const irrf = calculateIRRF(salary, inss);
  const netSalary = salary - inss - irrf;

  const resultElement = document.getElementById('resultSalary');
  resultElement.innerHTML = `
    <strong>Vínculo:</strong> ${link === '1' ? 'CLT' : link === '2' ? 'MEI/PJ' : 'Pró-labore'}<br>
    <strong>Salário:</strong> R$ ${salary.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
    <strong>INSS:</strong> R$ ${inss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
    <strong>IRRF:</strong> R$ ${irrf.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
    <strong>Salário Líquido:</strong> R$ ${netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  `;

  const resultDiv = document.getElementById("result");
  const resetSalary = document.getElementById("resetSalaryButton");
  const calcSalary = document.getElementById("calculateSalaryButton");

  if (calcSalary) {
    calcSalary.addEventListener('click', function () {
      resultDiv.style.display = "flex";
    });
  }

  if (resetSalary) {
    resetSalary.addEventListener('click', function () {
      resultDiv.style.display = "none";
    });
  }
}
