/***************** jQuery ***********************/

/*

$(document).ready(function(){
    
    // Ocultar el modal después de guardar serie 
    
    $("#anadirSerieBtn").click(function(){
        $("#anadirSerie").modal("hide");
    });
    

    // Resetear valores del formulario al clickar en "añadir serie"
    $('#btnNuevaSerie').click(function(){
        //$('#tituloAnadirSerie').text('Añadir serie desde jQuery');
        $('#formAnadirSerie').trigger('reset');
    });

    // Acciones al enviar el formulario
    $('#formAnadirSerie').submit(function(e){
        e.preventDefault();
        console.log('no se ha enviado el formulario');
        nombre = $('#nombreSerie').val();
        console.log(nombre);
    });

});


$(document).on('click', '.btnEditar', function(e){

  
        //fila = $(this).closest('tr');
        //parent = fila.parent().parent();
        elemento = e.target;
        fila = elemento.closest('.row');
        hijo = fila.children[1].firstChild.nodeValue;


       console.log(elemento);
       console.log(fila.children);
       console.log(hijo);

       mostrarSeries();

});


*/

/******************* JavaScript **************/



// Definir const de botones y variables

// Modal Añadir Serie
const nombreSerie = document.querySelector('#nombreSerie');
const serieAcabada = document.querySelector('#serieAcabada');
const serieAlDia = document.querySelector('#serieAlDia');
const seriePendiente = document.querySelector('#seriePendiente');
const capituloPendiente = document.querySelector('#capituloPendiente');
const ultimaTemporadaVista = document.querySelector('#ultimaTemporadaVista');
const ultimoCapituloVisto = document.querySelector('#ultimoCapituloVisto');
const notaSerie = document.querySelector('#notaSerie');
const temporadasSerie = document.querySelector('#temporadasSerie');
const portadaSerie = document.querySelector('#portadaSerie');
const imgPortadaSerie = document.querySelector('#imgPortadaSerie');

// Modal Editar Serie
const nombreSerieEditar = document.querySelector('#nombreSerieEditar');
const serieAcabadaEditar = document.querySelector('#serieAcabadaEditar');
const serieAlDiaEditar = document.querySelector('#serieAlDiaEditar');
const seriePendienteEditar = document.querySelector('#seriePendienteEditar');
const ultimaTemporadaVistaEditar = document.querySelector('#ultimaTemporadaVistaEditar');
const ultimoCapituloVistoEditar = document.querySelector('#ultimoCapituloVistoEditar');
const notaSerieEditar = document.querySelector('#notaSerieEditar');
const temporadasSerieEditar = document.querySelector('#temporadasSerieEditar');
const portadaSerieEditar = document.querySelector('#portadaSerieEditar');
const imgPortadaSerieEditar = document.querySelector('#imgPortadaSerieEditar');

var estadoSerie = '';
var nombreSerieAEliminar = '';


// Botón añadir serie
const btnNuevaSerie = document.querySelector('#btnNuevaSerie');
btnNuevaSerie.addEventListener('click', () => {



    // Restaurar valores de los campos del formulario
    nombreSerie.value = '';
    serieAcabada.checked = false;
    serieAcabada.parentNode.setAttribute('class','btn btn-secondary mr-1');
    serieAlDia.checked = false;
    serieAlDia.parentNode.setAttribute('class','btn btn-secondary mr-1');
    seriePendiente.checked = false;
    seriePendiente.parentNode.setAttribute('class','btn btn-secondary mr-1');
    capituloPendiente.setAttribute('class','d-none');
    ultimaTemporadaVista.value = '';
    ultimoCapituloVisto.value = '';
    estadoSerie = '';
    notaSerie.value = '';
    temporadasSerie.value = '';
    portadaSerie.setAttribute('type', 'text');
    portadaSerie.setAttribute('type', 'file');
    imgPortadaSerie.setAttribute('src', '');
    mensajeCtrlModal.innerHTML = '';

    // Mostrar/Ocultar el div de último capítulo visto
    serieAcabada.addEventListener('click',()=>{
        capituloPendiente.setAttribute('class','d-none');
    });
    serieAlDia.addEventListener('click',()=>{
        capituloPendiente.setAttribute('class','d-block');
    });
    seriePendiente.addEventListener('click',()=>{
        capituloPendiente.setAttribute('class','d-block');
    });

});

// Botón añadir serie (dentro del modal)
const anadirSerie = document.getElementById('anadirSerieBtn');


// Agregar serie en localstorage
anadirSerie.addEventListener('click', (e) => {

    // No se envía el formulario
    e.preventDefault();

    // Validar formulario
    if (comprobarForm()) {

        // Comprobar el estado marcado de la serie
        if (serieAcabada.checked){
            estadoSerie = 'Acabada';
        } else if (serieAlDia.checked) {
            estadoSerie = 'Al día';
        } else if(seriePendiente.checked){
            estadoSerie = 'Pendiente';
        }

        let series = JSON.parse(localStorage.getItem('series'));

        // Comprobar si ya existe el objeto "series"
        //Crear array para poder ir añadiendo series posteriormente
        if(!series){
            series = [];
            //console.log('crear el objeto series');
        }

        //Comprobar si la serie ya existe en el array
        let existeSerie = false;

        series.forEach(element => {

            if (nombreSerie.value == element.nombre){
                existeSerie = true;
            }
        });

        if (!existeSerie){

            let serieNueva = {
                "nombre":nombreSerie.value,
                "estado":estadoSerie,
                "ultimaTemporadaVista":ultimaTemporadaVista.value,
                "ultimoCapituloVisto":ultimoCapituloVisto.value,
                "nota": notaSerie.value,
                "temporadas": temporadasSerie.value,
                "img": imgPortadaSerie.src
            };

            series.push(serieNueva);

            // Guardar el objeto como un string
            localStorage.setItem('series', JSON.stringify(series)); 
            mostrarSeries();
            accionesSeries();

            $("#modalAnadirSerie").modal("hide");

        } else {
            mensajeCtrlModal.innerHTML = 'La serie ya existe';
        }
        
    }    
      
});




// Comprobar datos del formulario "Añadir Serie"
function comprobarForm(){

    let msgError = '';
    const mensajeCtrlModal = document.querySelector('#mensajeCtrlModal');

    if (nombreSerie.value == ''){
        msgError = 'Debes indicar el nombre de la serie';
        mensajeCtrlModal.innerHTML = msgError;
        return false;
    }else if (!serieAcabada.checked && !serieAlDia.checked && !seriePendiente.checked){
        msgError = 'Debes indicar el estado de la serie';
        mensajeCtrlModal.innerHTML = msgError;
        return false;
    }else if ((!serieAcabada.checked && ultimaTemporadaVista.value == '') || (!serieAcabada.checked && ultimoCapituloVisto.value == '')){
        msgError = 'Debes indicar el último capítulo visto';
        mensajeCtrlModal.innerHTML = msgError;
        return false;
    }else if(notaSerie.value == ''){
        msgError = 'Debes asignar una nota a la serie';
        mensajeCtrlModal.innerHTML = msgError;
        return false;
    }else if(temporadasSerie.value == ''){
        msgError = 'Debes indicar cuantas temporadas tiene la serie';
        mensajeCtrlModal.innerHTML = msgError;
        return false;
    }else if(imgPortadaSerie.src == 'http://localhost/series/'){
        msgError = 'Debes agregar una imagen de la serie';
        mensajeCtrlModal.innerHTML = msgError;
        return false;
    }else{
        return true;
    }
    
}

// Comprobar datos del formulario "Editar Serie"
function comprobarFormEditar(){

    let msgErrorEditar = '';
    const mensajeCtrlModalEditar = document.querySelector('#mensajeCtrlModalEditar');

    if (nombreSerieEditar.value == ''){
        msgErrorEditar = 'Debes indicar el nombre de la serie';
        mensajeCtrlModalEditar.innerHTML = msgErrorEditar;
        return false;
    }else if (!serieAcabadaEditar.checked && !serieAlDiaEditar.checked && !seriePendienteEditar.checked){
        msgErrorEditar = 'Debes indicar el estado de la serie';
        mensajeCtrlModalEditar.innerHTML = msgErrorEditar;
        return false;
    }else if ((!serieAcabada.checked && ultimaTemporadaVistaEditar.value == '') || (!serieAcabada.checked && ultimoCapituloVistoEditar.value == '')){
        msgError = 'Debes indicar el último capítulo visto';
        mensajeCtrlModal.innerHTML = msgError;
        return false;
    }else if(notaSerieEditar.value == ''){
        msgErrorEditar = 'Debes asignar una nota a la serie';
        mensajeCtrlModalEditar.innerHTML = msgErrorEditar;
        return false;
    }else if(temporadasSerieEditar.value == ''){
        msgErrorEditar = 'Debes indicar cuantas temporadas tiene la serie';
        mensajeCtrlModalEditar.innerHTML = msgErrorEditar;
        return false;
    }else if(imgPortadaSerieEditar.src == 'http://localhost/series/'){
        msgErrorEditar = 'Debes agregar una imagen de la serie';
        mensajeCtrlModalEditar.innerHTML = msgErrorEditar;
        return false;
    }else{
        return true;
    }
    
}



// Mostrar el listado de series
function mostrarSeries() {

    const divListadoSeries = document.querySelector('.listadoSeries div');
    divListadoSeries.innerHTML = '';
    
    let series = JSON.parse(localStorage.getItem('series'));

    if(!series){
        
        divListadoSeries.innerHTML = 'No tienes series en tu listado';

    }else{

        series.forEach(element => {

            // Crear div´s y mostrar información de cada serie
            const rowSerie = document.createElement('div');
            rowSerie.setAttribute('class', 'row mt-2 d-flex align-items-center lead text-sm-left text-center mb-5 mb-sm-0');

            const colPortada = document.createElement('img');
            colPortada.setAttribute('class', 'col-sm-2');
            
            const colNombre = document.createElement('div');
            colNombre.setAttribute('class', 'col-sm-3 font-weight-bold');

            const colTemporadas = document.createElement('div');
            colTemporadas.setAttribute('class','col-sm-3');

            const colEstado = document.createElement('div');
            colEstado.setAttribute('class', 'col-sm-1');

            const colNota = document.createElement('div');
            colNota.setAttribute('class', 'col-sm-1');
            const nota = document.createElement('div');
            nota.setAttribute('class', 'nota');

            const colBtns = document.createElement('div');
            colBtns.setAttribute('class', 'col-sm-2');
            const btnEditarSerie = document.createElement('button');
            const btnEliminar = document.createElement('a');
            btnEditarSerie.setAttribute('class','btnEditarSerie btn btn-warning my-2 my-sm-0 mr-2');
            btnEliminar.setAttribute('class','btn btn-danger my-2 my-sm-0');
            btnEliminar.setAttribute('id','btnEliminar');
            btnEliminar.setAttribute('data-toggle','modal');
            btnEliminar.setAttribute('data-target','#modalEliminarSerie');

            
            colPortada.src = element.img;
            colNombre.innerHTML = element.nombre;
            colTemporadas.innerHTML = element.temporadas + ' temporadas';
            nota.innerHTML = element.nota;

            if (element.estado != 'Acabada'){
                colEstado.innerHTML = `${element.estado} (${element.ultimaTemporadaVista}x${element.ultimoCapituloVisto})` ;
            }else{
                colEstado.innerHTML = element.estado;
            }

            btnEditarSerie.innerHTML = 'Editar';
            btnEliminar.innerHTML = 'Eliminar';
            

            rowSerie.appendChild(colPortada);
            rowSerie.appendChild(colNombre);
            rowSerie.appendChild(colTemporadas);
            rowSerie.appendChild(colEstado);
            colNota.appendChild(nota);
            rowSerie.appendChild(colNota);
            colBtns.appendChild(btnEditarSerie);
            colBtns.appendChild(btnEliminar);
            rowSerie.appendChild(colBtns);

            divListadoSeries.appendChild(rowSerie);

        });
    }
}



function accionesSeries(){

    // Editar serie (cargar datos en modal)

    //Una vez obtenido el nombre, recorrer el array y obtener los demás datos. Hay que hacerlo igualmente para obtener la imagen, y es más "seguro"
    const btnEditarSerie = document.querySelectorAll('.btnEditarSerie');

    btnEditarSerie.forEach(element => {
        element.addEventListener('click', function(e) {


            // Restaurar valores de los campos del formulario
            nombreSerieEditar.value = '';
            serieAcabadaEditar.checked = false;
            serieAcabadaEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
            serieAlDiaEditar.checked = false;
            serieAlDiaEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
            seriePendienteEditar.checked = false;
            seriePendienteEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
            ultimaTemporadaVistaEditar.value = '';
            ultimoCapituloVistoEditar.value = '';
            estadoSerie = '';
            notaSerieEditar.value = '';
            temporadasSerieEditar.value = '';
            imgPortadaSerieEditar.setAttribute('src', '');
            mensajeCtrlModalEditar.innerHTML = '';

              // Mostrar/Ocultar el div de último capítulo visto
            serieAcabadaEditar.addEventListener('click',()=>{
                capituloPendienteEditar.setAttribute('class','d-none');
            });
            serieAlDiaEditar.addEventListener('click',()=>{
                capituloPendienteEditar.setAttribute('class','d-block');
            });
            seriePendienteEditar.addEventListener('click',()=>{
                capituloPendienteEditar.setAttribute('class','d-block');
            });


            $('#modalEditarSerie').modal('show');

            let btnEditarPulsado = e.target;
            
            // Navegar hasta el nombre de la serie. Encontrar el índice de ese nombre en el array
            let nombreSerieActual = btnEditarPulsado.parentNode.parentNode.childNodes[1].textContent;

            let series = JSON.parse(localStorage.getItem('series'));

            series.forEach(element => {
                if(element.nombre == nombreSerieActual){
                    nombreSerieEditar.value = element.nombre;
                    imgPortadaSerieEditar.src = element.img;
                    temporadasSerieEditar.value = element.temporadas;
                    estadoSerieEditar = element.estado;
                    notaSerieEditar.value = element.nota;
                    ultimaTemporadaVistaEditar.value = element.ultimaTemporadaVista;
                    ultimoCapituloVistoEditar.value = element.ultimoCapituloVisto;
                    //$('#anadirSerie').modal('show');
                    //nombreSerie.setAttribute('readonly',true);

                    if (estadoSerieEditar == 'Acabada'){

                        serieAcabadaEditar.checked = true;
                        serieAlDiaEditar.checked = false;
                        seriePendienteEditar.checked = false;
                        serieAcabadaEditar.parentNode.setAttribute('class','btn btn-secondary mr-1 active');
                        serieAlDiaEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        seriePendienteEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        capituloPendienteEditar.setAttribute('class','d-none');


                    } else if (estadoSerieEditar == 'Al día') {

                        serieAcabadaEditar.checked = false;
                        serieAlDiaEditar.checked = true;
                        seriePendienteEditar.checked = false;
                        serieAcabadaEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        serieAlDiaEditar.parentNode.setAttribute('class','btn btn-secondary mr-1 active');
                        seriePendienteEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        capituloPendienteEditar.setAttribute('class','d-block');
                        

                    } else if(estadoSerieEditar == 'Pendiente'){

                        serieAcabadaEditar.checked = false;
                        serieAlDiaEditar.checked = false;
                        seriePendienteEditar.checked = true;
                        serieAcabadaEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        serieAlDiaEditar.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        seriePendienteEditar.parentNode.setAttribute('class','btn btn-secondary mr-1 active');
                        capituloPendienteEditar.setAttribute('class','d-block');

                    }

                }
            }); 
            
            
            // Editar serie 
            const editarSerie = document.querySelector('#editarSerieBtn');
                    
            editarSerie.addEventListener('click', (e) => {

                // No se envía el formulario
                e.preventDefault();

                let conflictoNombre = false;
                let msgErrorEditar = '';
                    

                // Validar formulario
                if (comprobarFormEditar()) {

                    // Comprobar el estado marcado de la serie
                    if (serieAcabadaEditar.checked){
                        estadoSerieEditar = 'Acabada';
                    } else if (serieAlDiaEditar.checked) {
                        estadoSerieEditar = 'Al día';
                    } else if(seriePendienteEditar.checked){
                        estadoSerieEditar = 'Pendiente';
                    }

                    let series = JSON.parse(localStorage.getItem('series'));

                    //series.forEach(element => {

                        // Comprobar si se está cambiando el nombre
                        if (nombreSerieActual !== nombreSerieEditar.value){
                            //console.log('el nombre es diferente al original');
                            // Comprobar que el nuevo nombre no esté ya creado para otra serie
                            series.forEach(element2 => {
                                if (nombreSerieEditar.value === element2.nombre){
                                    //console.log('el nombre ya existe');
                                    conflictoNombre = true;
                                    msgErrorEditar = 'El nombre de la serie ya existe';
                                    mensajeCtrlModalEditar.innerHTML = msgErrorEditar;
                                }
                            });
                            
                        }

                    series.forEach(element => {

                        if (nombreSerieActual == element.nombre){

                            // Asignar nuevos valores
                            element.nombre = nombreSerieEditar.value;
                            element.estado = estadoSerieEditar;
                            element.nota = notaSerieEditar.value;
                            element.temporadas = temporadasSerieEditar.value;
                            element.img =  imgPortadaSerieEditar.src;
                            element.ultimaTemporadaVista = ultimaTemporadaVistaEditar.value;
                            element.ultimoCapituloVisto = ultimoCapituloVistoEditar.value;

                        }
                    });

                    if (!conflictoNombre){

                        localStorage.setItem('series', JSON.stringify(series)); 
                        editar = false;
                        mostrarSeries();
                        accionesSeries();


                        $("#modalEditarSerie").modal("hide");

                    }   
                
                } 

            });
            
        });
             
    });
    
    

    /*
    // Eliminar serie
    const btnEliminar = document.querySelectorAll('#btnEliminar');

    btnEliminar.forEach(element =>{
        element.addEventListener('click', function(e) {

            let obj = e.target;
            // Navegar hasta el nombre de la serie. Encontrar el índice de ese nombre en el array
            let nombreSerie = obj.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML;
            let series = JSON.parse(localStorage.getItem('series'));
            let indice = 0;

            series.forEach(element => {
                //console.log('elemento '+ element.nombre);
                if (nombreSerie === element.nombre){
                    //console.log(`la serie ${element.nombre} está en el índice ${indice}`);
                    series.splice(indice,1);
                }
            indice++;
            })

            // Guardar el objeto como un string, con las modifaciones (elemento eliminado)
            localStorage.setItem('series', JSON.stringify(series)); 
            mostrarSeries();
            accionesSeries();

        });
    });
    */

    // Eliminar serie
    const btnEliminar = document.querySelectorAll('#btnEliminar');

    btnEliminar.forEach(element => {
        element.addEventListener('click', function(e){
            
            let obj = e.target;
            // Navegar hasta el nombre de la serie. Encontrar el índice de ese nombre en el array
            nombreSerieAEliminar = obj.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML;
            //console.log(nombreSerieAEliminar);
            document.querySelector('#modalEliminarSerie .modal-body').innerHTML = '¿Deseas eliminar la serie "' + nombreSerieAEliminar + '"?';
        });
    });

    // Eliminar serie (modal)
    const eliminarSerieBtn = document.querySelector('#eliminarSerieBtn');

    eliminarSerieBtn.addEventListener('click', ()=>{

        console.log('eliminaré la serie ' + nombreSerieAEliminar);
        let series = JSON.parse(localStorage.getItem('series'));
        let indice = 0;

        series.forEach(element => {
            //console.log('elemento '+ element.nombre);
            if (nombreSerieAEliminar === element.nombre){
                //console.log(`la serie ${element.nombre} está en el índice ${indice}`);
                series.splice(indice,1);
            }
        indice++;
        })

        // Guardar el objeto como un string, con las modifaciones (elemento eliminado)
        localStorage.setItem('series', JSON.stringify(series)); 
        mostrarSeries();
        accionesSeries();
        $("#modalEliminarSerie").modal("hide");

    });

}



// Mostrar la imagen cargada, guardándola de manera "temporal" en localstorage
document.querySelector('#portadaSerie').addEventListener('change', function(){

    const reader = new FileReader();

    reader.addEventListener('load', () => {
        //console.log('grabo');
        localStorage.setItem('prueba-img',reader.result);

        // Añadido
        const recentImageDataUrl = localStorage.getItem('prueba-img');
        //console.log('recupero');
        document.querySelector('#imgPortadaSerie').setAttribute('src', recentImageDataUrl);
    })

    reader.readAsDataURL(this.files[0]);
});

/*
document.addEventListener('DOMContentLoaded', () => {
    const recentImageDataUrl = localStorage.getItem('prueba-img');

    if(recentImageDataUrl){
        document.querySelector('#imgPortadaSerie').setAttribute('src', recentImageDataUrl);
    }
})
*/


// Mostrar listado de series
mostrarSeries();
accionesSeries();
