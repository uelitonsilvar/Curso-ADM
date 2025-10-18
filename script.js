const senhaCorreta='ADM2025_01';
let autenticado=false, editando=false, section='objetivos', historico=[], imagemAtual=0;

const conteudo={
  objetivos:{titulo:'Objetivos do Curso', texto:'O curso de Administração tem como objetivo formar profissionais capazes de planejar, organizar, dirigir e controlar recursos humanos, financeiros e materiais, promovendo a eficiência e a inovação nas organizações.', imagens:[]},
  historia:{titulo:'História do Curso', texto:'Criado em 1970, o curso de Administração surgiu com o propósito de atender à crescente demanda por gestores qualificados. Desde então, tem se atualizado constantemente para acompanhar as transformações do mercado e da sociedade.', imagens:[]},
  trabalhos:{titulo:'Trabalhos e Projetos', texto:'Os alunos participam de projetos práticos, estágios e atividades de extensão, desenvolvendo competências em liderança, empreendedorismo, responsabilidade social e gestão estratégica.', imagens:[]}
};

// Elementos
const loginDiv=document.getElementById('loginDiv');
const senhaInput=document.getElementById('senhaInput');
const entrarBtn=document.getElementById('entrarBtn');
const editarBtn=document.getElementById('editarBtn');
const textoSecao=document.getElementById('textoSecao');
const textoView=document.getElementById('textoView');
const tituloSecao=document.getElementById('tituloSecao');
const imagensContainer=document.getElementById('imagensContainer');
const desfazerBtn=document.getElementById('desfazerBtn');
const editControls=document.getElementById('editControls');
const sectionBtns=document.querySelectorAll('.sectionBtn');
const uploadDiv=document.getElementById('uploadDiv');
const inputImagens=document.getElementById('inputImagens');
const editBanner=document.getElementById('editBanner');
document.getElementById('anoAtual').innerText=new Date().getFullYear();

// Chat
const comentariosList=document.getElementById('comentariosList');
const nomeUsuario=document.getElementById('nomeUsuario');
const textoComentario=document.getElementById('textoComentario');
const enviarComentario=document.getElementById('enviarComentario');

// Tema
const corPrimaria=document.getElementById('corPrimaria');
const corSecundaria=document.getElementById('corSecundaria');
const corAccent=document.getElementById('corAccent');
const aplicarTema=document.getElementById('aplicarTema');

function salvarHistorico(){ historico.push(JSON.parse(JSON.stringify(conteudo))); }

function renderSection(){
  tituloSecao.innerText=conteudo[section].titulo;
  textoView.innerText=conteudo[section].texto;
  textoSecao.value=conteudo[section].texto;
  imagensContainer.innerHTML='';

  // imagens
  if(conteudo[section].imagens.length>0){
    conteudo[section].imagens.forEach((img,index)=>{
      const imgEl=document.createElement('img');
      imgEl.src=img;
      imagensContainer.appendChild(imgEl);
    });
  }

  // edição
  if(editando){ textoSecao.classList.remove('hidden'); textoView.classList.add('hidden'); uploadDiv.classList.remove('hidden'); editarBtn.innerText='Salvar'; editBanner.classList.remove('hidden'); }
  else{ textoSecao.classList.add('hidden'); textoView.classList.remove('hidden'); uploadDiv.classList.add('hidden'); editarBtn.innerText='Editar'; editBanner.classList.add('hidden'); }

  // botão ativo
  sectionBtns.forEach(btn=>{
    if(btn.dataset.section===section){ btn.classList.add('active'); } 
    else{ btn.classList.remove('active'); }
  });
}

// Seções
sectionBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    section=btn.dataset.section;
    renderSection();
  });
});

// Login
entrarBtn.addEventListener('click',()=>{
  if(senhaInput.value===senhaCorreta){
    autenticado=true; editando=true;
    loginDiv.classList.add('hidden'); editControls.classList.remove('hidden'); editarBtn.classList.remove('hidden');
    renderSection();
  } else alert('Senha incorreta!');
  senhaInput.value='';
});

// Editar
editarBtn.addEventListener('click',()=>{
  if(editando){ salvarHistorico(); conteudo[section].texto=textoSecao.value; editando=false; }
  else editando=true;
  renderSection();
});

// Desfazer
desfazerBtn.addEventListener('click',()=>{
  if(historico.length>0){ const ultimo=historico.pop(); Object.assign(conteudo,ultimo); renderSection(); } 
  else alert('Nenhuma alteração para desfazer.');
});

// Chat
function carregarComentarios(){
  comentariosList.innerHTML='';
  const comentarios=JSON.parse(localStorage.getItem('comentarios'))||[];
  comentarios.forEach(c=>{
    const div=document.createElement('div');
    div.innerHTML=`<strong>${c.nome}</strong>: ${c.texto} <span class="text-xs">(${c.data})</span>`;
    comentariosList.appendChild(div);
  });
}
enviarComentario.addEventListener('click',()=>{
  const nome=nomeUsuario.value.trim(), texto=textoComentario.value.trim();
  if(!nome||!texto){ alert('Preencha nome e comentário.'); return; }
  const comentarios=JSON.parse(localStorage.getItem('comentarios'))||[];
  comentarios.push({nome,texto,data:new Date().toLocaleString()});
  localStorage.setItem('comentarios',JSON.stringify(comentarios));
  nomeUsuario.value=''; textoComentario.value='';
  carregarComentarios();
});

// Tema
function aplicarPaleta(){
  document.documentElement.style.setProperty('--primary',corPrimaria.value);
  document.documentElement.style.setProperty('--secondary',corSecundaria.value);
  document.documentElement.style.setProperty('--accent',corAccent.value);
  localStorage.setItem('tema',JSON.stringify({primary:corPrimaria.value, secondary:corSecundaria.value, accent:corAccent.value}));
}
aplicarTema.addEventListener('click',aplicarPaleta);

const temaSalvo=JSON.parse(localStorage.getItem('tema'));
if(temaSalvo){
  corPrimaria.value=temaSalvo.primary;
  corSecundaria.value=temaSalvo.secondary;
  corAccent.value=temaSalvo.accent;
  aplicarPaleta();
}

carregarComentarios();
renderSection(); // 🔹 garante que "Objetivos" apareça ativo
