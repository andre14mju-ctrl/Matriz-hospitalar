// Edite apenas este arquivo para trocar o conteúdo.
const USERS = [
  { user: "admin", pass: "1234", name: "Administrador" },
  { user: "gestor", pass: "abm2026", name: "Gestor ABM" }
];

const STEPS = [
  {id:"0", title:"Indicação inicial",  phase:"Entrada",         html:"<p>Registre por que o grupo será criado ou revisado.</p><ul><li>Qual necessidade motivou a indicação?</li><li>Quem apresentou a demanda?</li></ul>"},
  {id:"1", title:"Requisitos",         phase:"Entrada",         html:"<p>Liste os requisitos mínimos para prosseguir.</p>"},
  {id:"3", title:"Caracterização",     phase:"Fundamentação",   html:"<p>Descreva o perfil e o propósito do grupo.</p>"},
  {id:"4", title:"Escopo",             phase:"Fundamentação",   html:"<p>Defina o que está dentro e fora do escopo.</p>"},
  {id:"5", title:"Instrumentos",       phase:"Fundamentação",   html:"<p>Documentos e ferramentas de apoio.</p>"},
  {id:"6", title:"Regimento",          phase:"Formalização",    html:"<p>Regras de funcionamento.</p>"},
  {id:"7", title:"Composição",         phase:"Formalização",    html:"<p>Quem participa e com qual papel.</p>"},
  {id:"8", title:"Portaria",           phase:"Formalização",    html:"<p>Ato formal de instituição.</p>"}
];
const COMMISSIONS = {
  A:["Grupo Alfa 1","Grupo Alfa 2"],
  B:["Grupo Beta 1","Grupo Beta 2","Grupo Beta 3"],
  C:["Grupo Gama 1"],
  D:["Grupo Delta 1","Grupo Delta 2"]
};
