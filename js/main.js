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

// Definir const de botones y variables del formulario (modal)

const nombreSerie = document.getElementById('nombreSerie');
const serieAcabada = document.getElementById('serieAcabada');
const serieAlDia = document.getElementById('serieAlDia');
const seriePendiente = document.getElementById('seriePendiente');
const notaSerie = document.getElementById('notaSerie');
const temporadasSerie = document.getElementById('temporadasSerie');
const portadaSerie = document.querySelector('#imgPortadaSerie');
var estadoSerie = '';

const tituloAnadirSerie = document.querySelector('#tituloAnadirSerie');

var editar = false;




// Botón añadir serie
const btnNuevaSerie = document.querySelector('#btnNuevaSerie');
btnNuevaSerie.addEventListener('click', () => {
    tituloAnadirSerie.textContent = 'Añadir nueva serie';
});

// Botón añadir serie (dentro del modal)
const anadirSerie = document.getElementById('anadirSerieBtn');
/*--------------------------------------------------- Una vez editado, no se vuelve a comportar como añadir --------------------------*/
anadirSerie.textContent = 'Añadir';




// Agregar serie en localstorage
anadirSerie.addEventListener('click', (e) => {

    if (!editar){
        
        console.log('entro en añadir');

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
                    "nota": notaSerie.value,
                    "temporadas": temporadasSerie.value,
                    "img": portadaSerie.src
                };

                series.push(serieNueva);

                // Guardar el objeto como un string
                localStorage.setItem('series', JSON.stringify(series)); 
                mostrarSeries();
                accionesSeries();

                // Restaurar valores de los campos del formulario
                nombreSerie.value = '';
                serieAcabada.checked = false;
                serieAlDia.checked = false;
                seriePendiente.checked = false;
                estadoSerie = '';
                notaSerie.value = '';
                temporadasSerie.value = '';
                portadaSerie.setAttribute('src', '');

                $("#anadirSerie").modal("hide");

            } else {
                mensajeCtrlModal.innerHTML = 'La serie ya existe';
            }
            
        }    
    }    

});




// Comprobar datos del formulario "Añadir Serie"
function comprobarForm(){

    let msgError = '';
    const mensajeCtrlModal = document.querySelector('#mensajeCtrlModal');
    //console.log(portadaSerie.src);

    if (nombreSerie.value == ''){
        msgError = 'Debes indicar el nombre de la serie';
        mensajeCtrlModal.innerHTML = msgError;
        return false;
    }else if (!serieAcabada.checked && !serieAlDia.checked && !seriePendiente.checked){
        msgError = 'Debes indicar el estado de la serie';
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
    }else if(portadaSerie.src == 'http://localhost/series/'){
        msgError = 'Debes agregar una imagen de la serie';
        mensajeCtrlModal.innerHTML = msgError;
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
            const btnEditar = document.createElement('button');
            const btnEliminar = document.createElement('button');
            btnEditar.setAttribute('class','btnEditar btn btn-warning my-2 my-sm-0 mr-2');
            //btnEditar.setAttribute('id','btnEditar');
            btnEliminar.setAttribute('class','btn btn-danger my-2 my-sm-0');
            btnEliminar.setAttribute('id','btnEliminar');

            
            colPortada.src = element.img;
            colNombre.innerHTML = element.nombre;
            colTemporadas.innerHTML = element.temporadas + ' temporadas';
            nota.innerHTML = element.nota;
            colEstado.innerHTML = element.estado;
            btnEditar.innerHTML = 'Editar';
            btnEliminar.innerHTML = 'Eliminar';
            

            rowSerie.appendChild(colPortada);
            rowSerie.appendChild(colNombre);
            rowSerie.appendChild(colTemporadas);
            rowSerie.appendChild(colEstado);
            colNota.appendChild(nota);
            rowSerie.appendChild(colNota);
            colBtns.appendChild(btnEditar);
            colBtns.appendChild(btnEliminar);
            rowSerie.appendChild(colBtns);

            divListadoSeries.appendChild(rowSerie);

        });
        //paraListadoSeries.innerHTML = 'Tienes series en tu listado';
    }
}



function accionesSeries(){

    // Editar serie (cargar datos en modal)
    //Una vez obtenido el nombre, recorrer el array y obtener los demás datos. Hay que hacerlo igualmente para obtener la imagen, y es más "seguro"
    const editarSerie = document.querySelectorAll('.btnEditar');

    editarSerie.forEach(element => {
        element.addEventListener('click', function(e) {

            // Adaptar el modal en modo "editar"
            tituloAnadirSerie.textContent = 'Editar serie';
            anadirSerie.textContent = 'Editar';
            anadirSerie.setAttribute('id','editarSerieBtn');
            editar = true;

            $('#anadirSerie').modal('show');

            let btnEditarPulsado = e.target;
            // Navegar hasta el nombre de la serie. Encontrar el índice de ese nombre en el array
            let nombreSerieActual = btnEditarPulsado.parentNode.parentNode.childNodes[1].textContent;

            let series = JSON.parse(localStorage.getItem('series'));
            //let indice = 0;

            series.forEach(element => {
                if(element.nombre == nombreSerieActual){
                    //console.log('la nota de ' + element.nombre + ' es ' + element.nota);
                    nombreSerie.value = element.nombre;
                    portadaSerie.src = element.img;
                    temporadasSerie.value = element.temporadas;
                    estadoSerie = element.estado;
                    notaSerie.value = element.nota;
                    //$('#anadirSerie').modal('show');
                    //nombreSerie.setAttribute('readonly',true);

                    if (estadoSerie == 'Acabada'){

                        //console.log('entro a acabada');

                        serieAcabada.checked = true;
                        serieAlDia.checked = false;
                        seriePendiente.checked = false;
                        serieAcabada.parentNode.setAttribute('class','btn btn-secondary mr-1 active');
                        serieAlDia.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        seriePendiente.parentNode.setAttribute('class','btn btn-secondary mr-1');

                    } else if (estadoSerie == 'Al día') {

                        //console.log('entro al día');

                        serieAcabada.checked = false;
                        serieAlDia.checked = true;
                        seriePendiente.checked = false;
                        serieAcabada.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        serieAlDia.parentNode.setAttribute('class','btn btn-secondary mr-1 active');
                        seriePendiente.parentNode.setAttribute('class','btn btn-secondary mr-1');

                    } else if(estadoSerie == 'Pendiente'){

                        serieAcabada.checked = false;
                        serieAlDia.checked = false;
                        seriePendiente.checked = true;
                        serieAcabada.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        serieAlDia.parentNode.setAttribute('class','btn btn-secondary mr-1');
                        seriePendiente.parentNode.setAttribute('class','btn btn-secondary mr-1 active');

                    }

                }
            }); 
            
            // Editar serie 
            const editarSerie = document.querySelector('#editarSerieBtn');

            // Editar serie en localstorage
            editarSerie.addEventListener('click', (e) => {

                console.log('entro en editar');

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

                    series.forEach(element => {

                        if (nombreSerieActual == element.nombre){
                            element.nombre = nombreSerie.value;
                            element.estado = estadoSerie;
                            element.nota = notaSerie.value;
                            element.temporadas = temporadasSerie.value;
                            element.img =  portadaSerie.src;

                        }
                    });

                    localStorage.setItem('series', JSON.stringify(series)); 
                    mostrarSeries();
                    accionesSeries();

                    // Restaurar valores de los campos del formulario
                    nombreSerie.value = '';
                    serieAcabada.checked = false;
                    serieAlDia.checked = false;
                    seriePendiente.checked = false;
                    estadoSerie = '';
                    notaSerie.value = '';
                    temporadasSerie.value = '';
                    portadaSerie.setAttribute('src', '');

                    $("#anadirSerie").modal("hide");
                   
                }    

            });

        });


    });



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
