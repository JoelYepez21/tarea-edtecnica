// vars
const from = document.querySelector('#form-padre')
const inpuTarea = document.querySelector('#input-tarea');
const btnTarea = document.querySelector('#button-from');
const listaTareas = document.querySelector('#lista-padre');

// arrays
let tareasArray = [];
let tareasCompletasArray = [];

//functions 
const validationTarea = (input) => {
    if (input.value === '') {
        input.classList.remove('tarea-lista');
        btnTarea.classList.add('desabilitado');
        btnTarea.disabled = true;
    } else {
        input.classList.add('tarea-lista');
        btnTarea.classList.remove('desabilitado');
        btnTarea.disabled = false;
    }
}
const renderTareas = () => {
    listaTareas.innerHTML = '';
    tareasArray.forEach(tarea => {
        const li = document.createElement('li');
        li.classList.add('hijo');
        li.id = tarea.id;
        li.innerHTML = `
        <button id="button-eliminar" class="button-eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" id="button-eliminar-logo">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>        
      </button>
      <p class="tarea">${tarea.descripcion}</p>
      <button id="button-completar" class="button-completar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" id="button-completar-logo">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>        
      </button>
        `;
        if (tarea.check === true) {
            li.classList.add('tachado');
            li.children[0].disabled = true;
            li.children[0].classList.remove('button-eliminar');
            li.children[0].classList.add('button-eliminado');
            li.children[2].disabled = true;
            li.children[2].classList.remove('button-completar');
            li.children[2].classList.add('button-completo');
        }
        listaTareas.append(li);
    });
    document.querySelector('#contador-total').children[1].innerHTML = tareasArray.length;
    document.querySelector('#contador-completa').children[1].innerHTML = tareasCompletasArray.length
    document.querySelector('#contador-incompleta').children[1].innerHTML = tareasArray.length - tareasCompletasArray.length;
}
const getTareas = () =>{
    const tareasDb = localStorage.getItem('tareas');
    const tareaCompletaDb = localStorage.getItem('tareaCompleta');
    if(localStorage.getItem('tareas')){
        tareasArray = JSON.parse(tareasDb);
    }
    if (localStorage.getItem('tareaCompleta')) {
        tareasCompletasArray = JSON.parse(tareaCompletaDb);
    }
    renderTareas();
}
getTareas();

//events
inpuTarea.addEventListener('input', e => {validationTarea(inpuTarea);});

from.addEventListener('submit', e => {
    e.preventDefault();
    
    //create new object
    const newTarea = {
        id : crypto.randomUUID(),
        descripcion: inpuTarea.value, 
        check: false,
    }
    //add to array
    tareasArray = tareasArray.concat(newTarea);
    //save in storage
    localStorage.setItem('tareas', JSON.stringify(tareasArray));
    
    inpuTarea.value = '';
    validationTarea(inpuTarea);
    renderTareas();
});

listaTareas.addEventListener('click', e => {
    const deleteBtn = e.target.closest('#button-eliminar');
    const checkBtn = e.target. closest('#button-completar');
    //delete
    if (deleteBtn) {
        const id = deleteBtn.parentElement.id;
        tareasArray = tareasArray.filter(tarea => {
         if (tarea.id !== id) {
            return tarea; 
         }
        });
        localStorage.setItem('tareas', JSON.stringify(tareasArray));
        renderTareas();
    }
    //check
    if(checkBtn){
        tareasArray.forEach(tarea =>{
            if (tarea.id === checkBtn.parentElement.id) {
                tarea.check = true;
            }
        });
        localStorage.setItem('tareas', JSON.stringify(tareasArray));
        tareasCompletasArray = tareasArray.filter(tarea =>{
            if(tarea.check === true){
                return tarea
            }
        });
        localStorage.setItem('tareaCompleta', JSON.stringify(tareasCompletasArray));
        renderTareas();
    }
})

