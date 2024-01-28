//DOM
let pesos=document.querySelector("#ingreso")
let moneda=document.querySelector("#moneda")
const btnBuscar=document.querySelector("#btn")
let resultado=document.querySelector("#resultadoConversion")
const apiURL="https://mindicador.cl/api/"
const apiDOLAR="https://mindicador.cl/api/dolar"
const apiEURO="https://mindicador.cl/api/euro"
const apiUF="https://mindicador.cl/api/uf"

//VARIABLES


//FUNCIONES
//conversion

async function getMindicadorURL() {
    try {
        const res=await fetch(apiURL)
        const dataURL=await res.json()
        return dataURL
    } catch (e) {
        alert(e.message)
    }
}

async function convertirMoneda(){
    const indicador=await getMindicadorURL()
    let valorMoneda
        
    switch (moneda.value) {
        case "dolar": valorMoneda=Number(indicador.dolar.valor)
            break
        case "euro": valorMoneda=Number(indicador.euro.valor)
            break
        case "uf": valorMoneda=Number(indicador.uf.valor)
            break
    }
            
    const valorPesos=Number(pesos.value)        

    if (valorPesos<=0 || isNaN(valorPesos)) {
        window.alert("El valor ingresado debe ser un numero positivo(+) y mayor a 0")
        pesos.value=""
        return
    } else {
        const cambio=Number((valorPesos/valorMoneda).toFixed(1))
        resultado.innerHTML=cambio
    }
}

//grafica

async function getMindicadorDOLAR() {
    try {
        const res=await fetch(apiDOLAR)
        const dataDOLAR=await res.json()
        const ud10=dataDOLAR.serie.slice(-10).reverse()
        const labels=ud10.map(entry=>formatDate(entry.fecha))
        const data=ud10.map(entry=>entry.valor)
        const datasets=[
            {
                label:"Fecha",
                borderColor:"rgb(255,99,132)",
                data
            }
        ]
        return {labels,datasets}
    } catch (e) {
        alert(e.message)
    }
}

async function getMindicadorEURO() {
    try {
        const res=await fetch(apiEURO)
        const dataEURO=await res.json()
        const ud10=dataEURO.serie.slice(-10).reverse()
        const labels=ud10.map(entry=>formatDate(entry.fecha))
        const data=ud10.map(entry=>entry.valor)
        const datasets=[
            {
                label:"Fecha",
                borderColor:"rgb(255,99,132)",
                data
            }
        ]
        return {labels,datasets}
    } catch (e) {
        alert(e.message)
    }
}

async function getMindicadorUF() {
    try {
        const res=await fetch(apiUF)
        const dataUF=await res.json()
        const ud10=dataUF.serie.slice(-10).reverse()
        const labels=ud10.map(entry=>formatDate(entry.fecha))
        const data=ud10.map(entry=>entry.valor)
        const datasets=[
            {
                label:"Fecha",
                borderColor:"rgb(255,99,132)",
                data
            }
        ]
        return {labels,datasets}
    } catch (e) {
        alert(e.message)
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', options)
}
    
async function renderGrafica(){
    let data
        
    switch (moneda.value) {
        case "dolar": data=await getMindicadorDOLAR() 
            break
        case "euro": data=await getMindicadorEURO()
            break
        case "uf": data=await getMindicadorUF()
            break
    }

    const myChart=document.querySelector("#myChart")

    if (myChart.chart) {
        myChart.chart.destroy()
    }

    const config={
        type:"line",
        data
    }

    myChart.style.backgroundColor="white"
    
    myChart.chart=new Chart(myChart,config)
}

//EVENTOS
btnBuscar.addEventListener("click",()=>{
    convertirMoneda()
    renderGrafica()
})