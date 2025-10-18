const senhaCorreta = 'ADM2025_01';
let autenticado = false, editando = false, section = 'objetivos', historico = [], imagemAtual = 0;

const conteudo = {
  objetivos: {
    titulo: 'Objetivos do Curso',
    texto: 'O curso de Administração tem como objetivo formar profissionais capazes de planejar, organizar, dirigir e controlar recursos humanos, financeiros e materiais, promovendo a eficiência e a inovação nas organizações.',
    imagens: []
  },
  historia: {
    titulo: 'História do Curso',
    texto: 'Criado em 1970, o curso de Administração surgiu com o propósito de atender à crescente demanda por gestores qualificados. Desde então, tem se atualizado constantemente para acompanhar as transformações do mercado e da sociedade.',
    imagens: []
  },
  trabalhos: {
    titulo: 'Trabalhos e Projetos',
    texto: 'Os alunos participam de projetos práticos, estágios e atividades de extensão, desenvolvendo competências em liderança, empreendedorismo, responsabilidade social e gestão estratégica.',
    imagens: []
  }
};

// Elementos do DOM
const loginDiv = document.getElementById('loginDiv');
const senhaInput = document.getElementById('senhaInput');
const entrarBtn = document.getElementById('entrarBtn');
const editarBtn = document.getElementById('editarBtn');
const textoSecao = document.getElementById('textoSecao');
const textoView = document.getElementById('textoView');
const tituloSecao = document.getElementById('tituloSecao');
const imagensContainer = document.getElementById('imagensContainer');
const desfazerBtn = document.getElementById('desfazerBtn');
const editControls = document.getElementById('editControls');
const sectionBtns = document.querySelectorAll('.sectionBtn');
const uploadDiv = document.getElementById('uploadDiv');
const inputImagens = document.getElementById('inputImagens');
const editBanner = document.getElementById('editBanner');
document.getElementById('anoAtual').innerText = new Date().getFullYear();

// Bate-papo
const comentariosList = document.getElementById('comentariosList');
const nomeUsuario = document.getElementById('nomeUsuario');
const textoComentario = document.getElementById('textoComentario');
const enviarComentario = document.getElementById('enviarComentario');

// Tema
const corPrimaria = document.getElementById('corPrimaria');
const corSecundaria = document.getElementById('corSecundaria');
const corAccent = document.getElementById('corAccent');
const aplicarTema = document.getElementById('aplicarTema');

// ------------------ Funções ------------------

function salvarHistorico() {
  historico.push(JSON.parse(JSON.stringify(conteudo)));
}

function renderSection() {
  const card = document.getElementById('cardContainer');
  card.style.opacity = 0;
  setTimeout(() => {
    tituloSecao.innerText = conteudo[section].titulo;
    textoView.innerText = conteudo[section].texto;
    textoSecao.value = conteudo[section].texto;
    imagensContainer.innerHTML = '';

    // Renderizar imagens
    if (conteudo[section].imagens.length > 0) {
      const imgDiv = document.createElement('div');
      imgDiv.className = 'relative w-full flex items-center justify-center mb-2';
      imgDiv.innerHTML = `
        <img src="${conteudo[section].imagens[imagemAtual]}" class="rounded-xl shadow-lg max-h-64 object-cover w-full">
        ${conteudo[section].imagens.length > 1 ? `
          <button class="absolute left-2 top-1/2 -translate-y-1/2 bg-white border border-primary px-2 py-1 rounded shadow" onclick="imagemAnterior()">⟨</button>
          <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-primary px-2 py-1 rounded shadow" onclick="proximaImagem()">⟩</button>
        ` : ''}
        ${autenticado ? `
          <div class="absolute top-2 right-2 flex gap-1 bg-white/90 p-1 rounded shadow">
            <label class="cursor-pointer text-sm text-primary">🔄
              <input type="file" accept="image/*" class="hidden" onchange="substituirImagem(event)">
            </label>
            <button class="bg-red-500 text-white px-2 rounded" onclick="removerImagem(imagemAtual)">🗑</button>
          </div>
        ` : ''}
      `;
      imagensContainer.appendChild(imgDiv);

      const miniDiv = document.createElement('div');
      miniDiv.className = 'flex gap-2 flex-wrap justify-center';
      conteudo[section].imagens.forEach((img, index) => {
        const m = document.createElement('div');
        m.className = 'relative';
        m.innerHTML = `
          <img src="${img}" class="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${imagemAtual === index ? 'border-primary' : 'border-transparent'}" onclick="imagemAtual=${index}; renderSection()">
          ${autenticado ? `<button class="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white text-xs" onclick="removerImagem(${index})">×</button>` : ''}
        `;
        miniDiv.appendChild(m);
      });
      imagensContainer.appendChild(miniDiv);
    }

    if (editando) {
      textoSecao.classList.remove('hidden');
      textoView.classList.add('hidden');
      uploadDiv.classList.remove('hidden');
      editarBtn.innerText = 'Salvar';
      editBanner.classList.remove('hidden');
    } else {
      textoSecao.classList.add('hidden');
      textoView.classList.remove('hidden');
      uploadDiv.classList.add('hidden');
      editarBtn.innerText = 'Editar';
      editBanner.classList.add('hidden');
    }

    sectionBtns.forEach(btn => {
      if (btn.dataset.section === section) {
        btn.classList.add('bg-primary', 'text-white');
        btn.classList.remove('border', 'text-primary');
      } else {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('border', 'text-primary');
      }
    });

    card.style.opacity = 1;
  }, 50);
}

// ------------------ Imagens ------------------
function proximaImagem() {
  if (conteudo[section].imagens.length > 0) {
    imagemAtual = (imagemAtual + 1) % conteudo[section].imagens.length;
    renderSection();
  }
}

function imagemAnterior() {
  if (conteudo[section].imagens.length > 0) {
    imagemAtual = (imagemAtual - 1 + conteudo[section].imagens.length) % conteudo[section].imagens.length;
    renderSection();
  }
}

function removerImagem(index) {
  salvarHistorico();
  conteudo[section].imagens.splice(index, 1);
  imagemAtual = 0;
  renderSection();
}

function substituirImagem(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      salvarHistorico();
      conteudo[section].imagens[imagemAtual] = e.target.result;
      renderSection();
    };
    reader.readAsDataURL(file);
  }
}

inputImagens.addEventListener('change', event => {
  Array.from(event.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      salvarHistorico();
      conteudo[section].imagens.push(e.target.result);
      renderSection();
    };
    reader.readAsDataURL(file);
  });
  inputImagens.value = '';
});

// ------------------ Autenticação ------------------
entrarBtn.addEventListener('click', () => {
  if (senhaInput.value === senhaCorreta) {
    autenticado = true;
    editando = true;
    loginDiv.classList.add('hidden');
    editControls.classList.remove('hidden');
    editarBtn.classList.remove('hidden');
    renderSection();
  } else {
    alert('Senha incorreta!');
  }
  senhaInput.value = '';
});

// ------------------ Edição ------------------
editarBtn.addEventListener('click', () => {
  if (editando) {
    salvarHistorico();
    conteudo[section].texto = textoSecao.value;
    editando = false;
  } else {
    editando = true;
  }
  renderSection();
});

desfazerBtn.addEventListener('click', () => {
  if (historico.length > 0) {
    const ultimo = historico.pop();
    Object.assign(conteudo, ultimo);
    renderSection();
  } else {
    alert('Nenhuma alteração para desfazer.');
  }
});

sectionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    section = btn.dataset.section;
    renderSection();
  });
});

// ------------------ Bate-papo ------------------
function carregarComentarios() {
  comentariosList.innerHTML = '';
  const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentarios.forEach(c => {
    const div = document.createElement('div');
    div.className = 'flex items-start gap-2 bg-accent/40 p-2 rounded shadow';
    div.innerHTML = `
      <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">${c.nome[0].toUpperCase()}</div>
      <div><strong>${c.nome}</strong> <span class="text-gray-600 text-xs ml-2">${c.data}</span><p>${c.texto}</p></div>
    `;
    comentariosList.appendChild(div);
  });
}

enviarComentario.addEventListener('click', () => {
  const nome = nomeUsuario.value.trim();
  const texto = textoComentario.value.trim();
  if (!nome || !texto) { alert('Preencha nome e comentário.'); return; }
  const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentarios.push({ nome, texto, data: new Date().toLocaleString() });
  localStorage.setItem('comentarios', JSON.stringify(comentarios));
  nomeUsuario.value = '';
  textoComentario.value = '';
  carregarComentarios();
});

// ------------------ Tema ------------------
function aplicarPaleta() {
  document.documentElement.style.setProperty('--primary', corPrimaria.value);
  document.documentElement.style.setProperty('--secondary', corSecundaria.value);
  document.documentElement.style.setProperty('--accent', corAccent.value);
  localStorage.setItem('tema', JSON.stringify({ primary: corPrimaria.value, secondary: corSecundaria.value, accent: corAccent.value }));
}

aplicarTema.addEventListener('click', aplicarPaleta);

// Carregar tema salvo
const temaSalvo = JSON.parse(localStorage.getItem('tema'));
if (temaSalvo) {
  corPrimaria.value = temaSalvo.primary;
  corSecundaria.value = temaSalvo.secondary;
  corAccent.value = temaSalvo.accent;
  aplicarPaleta();
}

// Inicialização
carregarComentarios();
renderSection();
