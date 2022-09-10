const $grafica = document.getElementById('myChart');

const informamesa = document.querySelector('.info-mesas')

const contenedorgrafica = document.querySelector('.grafics')

const graficaheader = document.querySelector('.header-consulta')

const boton = document.querySelector('.btn-primary')
boton.addEventListener('click', () => {
  document.querySelector('.esconder-menu  ').click()
})

let select
let selectdepartamentos

cargar_municipios()


function cargar_municipios() {
 var municipios4 = ["NIVEL DEPARTAMENTAL","GUASTATOYA", "MORAZÁN", "SAN AGUSTÍN ACASAGUASTLÁN", "SAN CRISTÓBAL ACASAGUASTLÁN", "EL JÍCARO",
 "SANSARE","SANARATE","SAN ANTONIO LA PAZ"
]; 
var municipios5 = ["GUASTATOYA", "MORAZÁN", "SAN AGUSTÍN ACASAGUASTLÁN", "SAN CRISTÓBAL ACASAGUASTLÁN", "EL JÍCARO",
 "SANSARE","SANARATE","SAN ANTONIO LA PAZ"
]; 
let municipios0 = ["NIVEL NACIONAL"]
let departamento = document.getElementById('tipoConsultaDepartamento')
let tipodepartamento = departamento.value
let listamunicipios
let eleccion = document.getElementById('tipoConsultaEleccion')
let tipoeleccion = eleccion.value
if(tipoeleccion==='4' && tipodepartamento==='4'){
 listamunicipios=municipios5
}
if(tipoeleccion==='1' && tipodepartamento === '0'){
 listamunicipios = municipios0
}
if(tipoeleccion==='1' && tipodepartamento === '4'){
 listamunicipios = municipios4
}
 addOptionsmunicipios("tipoConsultaMunicipio", listamunicipios);
}


// Rutina para agregar opciones a un <select>
function addOptionsmunicipios(elemento1, listamunicipios) {
 let eleccion = document.getElementById('tipoConsultaEleccion')
 let tipoeleccion = eleccion.value
 if(select){
   select.innerHTML = ''
 }
 select = document.getElementsByName(elemento1)[0];
 let valormun = 0
 let valormun2 = 1
 
 for (value in listamunicipios) {
   var option = document.createElement("option");
   option.text = listamunicipios[value];
   if(tipoeleccion==='4'){
     option.value = valormun2++
   }
   else{
   option.value = valormun++
   }
   select.add(option);
  }
}

function cargar_departamentos() {
 let departamentos1 = ["NIVEL NACIONAL","EL PROGRESO"]
 let departamentos4 = ["EL PROGRESO"]
 let eleccion = document.getElementById('tipoConsultaEleccion')
 let tipoeleccion = eleccion.value
 let listadepartamentos
 
 if(tipoeleccion === '1'){
   listadepartamentos = departamentos1
 }else{
   listadepartamentos = departamentos4
 }
   addOptionsDepartamentos("tipoConsultaDepartamento", listadepartamentos);
  }

function addOptionsDepartamentos(elemento1, listadepartamentos) {
 if(selectdepartamentos){
   selectdepartamentos.innerHTML = ''
 }
 selectdepartamentos = document.getElementsByName(elemento1)[0];
 let valormun = 4
 let valormun2 = -4
 for (value in listadepartamentos) {
   var option = document.createElement("option");
   option.text = listadepartamentos[value];
   if (listadepartamentos.length === 1){
   option.value = valormun
   }else{
     option.value=valormun2+=4
   }
   
   selectdepartamentos.add(option);
  }
}

let myChart
let myChart2

obtieneInfo()

function obtieneInfo(){
let eleccion = document.getElementById('tipoConsultaEleccion')
let tipoeleccion = eleccion.value
let departamento = document.getElementById('tipoConsultaDepartamento')
let tipodepartamento = departamento.value
let municipio = document.getElementById('tipoConsultaMunicipio')
let tipomunicipio = municipio.value

fetch(`https://votosgt.azurewebsites.net/api/votos?d=${tipodepartamento}&m=${tipomunicipio}&te=${tipoeleccion}`, {method: 'GET'})
.then (respuesta => respuesta.json())
.then(respuesta => JSON.parse(respuesta))
.then(response => {
const jsonCompleto = response
const jsonMesas = response.MESASPROCESADAS
const jsonVotos = response.VOTOS
const jsonParticipacion = response.PARTICIPACION

mostrarInfo(jsonMesas)
graficaVotos(jsonVotos)
graficaParticipacion(jsonParticipacion)
pageHeader(jsonCompleto)
tablavotos(jsonVotos,jsonCompleto)

})
}
console.log('esto pone un mensaje en la consola de internet')
function mostrarInfo(jsonMesas){

  const titulo = document.createElement('h3')
  titulo.textContent = jsonMesas[0].D + ':'

  const cantidadmesas = document.createElement('h4')
  cantidadmesas.textContent = jsonMesas[0].MESASPRO

  const titulo2 = document.createElement('h3')
  titulo2.textContent = ('Mesas no procesadas:')

  const cantidadmesasno = document.createElement('h4')
  cantidadmesasno.textContent = jsonMesas[0].MESASFALT

  const titulo3 = document.createElement('h3')
  titulo3.textContent = ('Total de Mesas:')

  const cantidadmesastotal = document.createElement('h4')
  cantidadmesastotal.textContent = parseInt(jsonMesas[0].MESASFALT) + parseInt(jsonMesas[0].MESASPRO) 
  
  informamesa.innerHTML = ''
  informamesa.appendChild(titulo)
  informamesa.appendChild(cantidadmesas)
  informamesa.appendChild(titulo2)
  informamesa.appendChild(cantidadmesasno)
  informamesa.appendChild(titulo3)
  informamesa.appendChild(cantidadmesastotal)

}

function graficaVotos(jsonVotos){

let etiquetas = []
for (let i=0; i<jsonVotos.length; i++){
  etiquetas[i] = jsonVotos[i].S
}
let cantidadvotos = []
for (let i=0; i<jsonVotos.length; i++){
  cantidadvotos[i] = jsonVotos[i].V
}
let colorfondo = []
for (let i=0; i<jsonVotos.length; i++){
  colorfondo[i] = jsonVotos[i].C
}

if(myChart){
  myChart.destroy()
}

myChart = new Chart($grafica, {
  type: 'doughnut',
  data: {
      labels: etiquetas,
      datasets: [{
          label: 'Votos por Organización Pólitica',
          data: cantidadvotos,
          backgroundColor: colorfondo,
          borderColor: colorfondo,
          borderWidth: 3,
          hoverOffset: 200
      }]
  },
  options: {
    indexAxis: 'x',
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }
});
  
}




const $grafica2 = document.getElementById('myChart2')
function graficaParticipacion(jsonParticipacion){

let etiquetas = []
for (let i=0; i<jsonParticipacion.length; i++){
  etiquetas[i] = jsonParticipacion[i].D
}
let cantidadvotos = []
for (let i=0; i<jsonParticipacion.length; i++){
  cantidadvotos[i] = jsonParticipacion[i].V
}
let colorfondo = []
for (let i=0; i<jsonParticipacion.length; i++){
  colorfondo[i] = jsonParticipacion[i].C
}

if(myChart2){
  myChart2.destroy()
}

myChart2 = new Chart($grafica2, {
  type: 'line',
  data: {
      labels: etiquetas,
      datasets: [{
          label: '',
          data: cantidadvotos,
          backgroundColor: colorfondo,
          hoverOffset: 5
      }]
  }
});
  
}




function pageHeader(jsonCompleto){
  const tiposeleccion = document.createElement('h3')
  tiposeleccion.textContent = jsonCompleto.NTE
  
  const breakpoint = document.createElement('br')

  const nivelConsulta = document.createElement('h4')
  nivelConsulta.textContent = jsonCompleto.NMUN + ', ' + jsonCompleto.NDEP

  const FechayHora = document.createElement('h5')
  FechayHora.textContent = 'Fecha y Hora ' + jsonCompleto.FECHAHORA

  graficaheader.innerHTML = ''
  graficaheader.appendChild(tiposeleccion)
  graficaheader.appendChild(breakpoint)
  graficaheader.appendChild(nivelConsulta)
  graficaheader.appendChild(FechayHora)
} 


function tablavotos(jsonVotos,jsonCompleto){
    contenido.innerHTML = ''
    for(let valor of jsonVotos){
        contenido.innerHTML += `

        <tr>
            <td>${valor.S}</td>
            <td>${valor.F}</td>
            <td>${valor.P}</td>
        </tr>
     
      
        `
    }
    for(let i=0;i<1;i++){
        contenido.innerHTML += `
      <tr>
        <td>Total votos válidos:</td>
        <td>${jsonCompleto.VOTOSVALIDOS}</td>
        <td>${jsonCompleto.PVOTOSVALIDOS}</td>
    </tr>
    
    
    <tr>
        <td>Votos nulos:</td>
        <td>${jsonCompleto.NULOS}</td>
        <td>${jsonCompleto.PNULOS}</td>
    </tr>
    <tr>
        <td>Votos en blanco:</td>
        <td>${jsonCompleto.BLANCOS}</td>
        <td>${jsonCompleto.PBLANCOS}</td>
    </tr>
    <tr>
        <td>Total votos válidamente emitidos:</td>
        <td>${jsonCompleto.TOTALACTA}</td>
        <td>${jsonCompleto.PTOTALACTA}</td>
    </tr>
    <tr>
        <td>Votos inválidos:</td>
        <td>${jsonCompleto.INVALIDOS}</td>
        <td>${jsonCompleto.PINVALIDOS}</td>
    </tr>
    <tr>
        <td>Impugnaciones:</td>
        <td>${jsonCompleto.CNTIMPUGNA}</td>
        <td>${jsonCompleto.PCNTIMPUGNA}</td>
    </tr>
      
        `
    }

}
