import './style.css'

document.querySelector('#app').innerHTML = `
    <div class="input-wrapper">
        <label for="texto" class="input-label">Buscar personaje</label>
        <input type="text" id="texto" name="usuario" placeholder="Personaje" required>
    </div>
    
    
    <div id="tabla-container" class="table-wrapper">Cargando...</div>
`


let listaPersonajes = []

let timeout = null;
const input = document.getElementById('texto');
input.addEventListener('input', function(event) {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
        buscarPersonaje(event);
    }, 700)

});

async function cargarListaPersonajesCompleta(){
    try {
        listaPersonajes.length = 0;
        for (let i = 1; i <= 42; i++) {
            const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${i}`);
            const data = await response.json();


            data.results.forEach(personaje => {
                listaPersonajes.push({
                    name: personaje.name,
                    species: personaje.species,
                    image: personaje.image
                });
            });
        }

        generarTabla(listaPersonajes)

    } catch (error) {
        document.getElementById('tabla-container').textContent = 'Error al cargar los datos.';
        console.error('Error:', error);
    }
}

async function buscarPersonaje(event) {
    const texto = event.target.value;
    if (texto === "") {
        await cargarListaPersonajesCompleta();
        return;
    }

    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${texto}`)
        const data = await response.json();

        listaPersonajes.length = 0;
        for (let i = 1; i <= data.info.pages; i++) {
            const response2 = await fetch(`https://rickandmortyapi.com/api/character/?page=${i}&name=${texto}`)
            const data2 = await response2.json();


            data2.results.forEach(personaje => {
                listaPersonajes.push({
                    name: personaje.name,
                    species: personaje.species,
                    image: personaje.image
                });
            });
        }

        generarTabla(listaPersonajes)

    } catch (e) {
        listaPersonajes.length = 0;
        generarTabla(listaPersonajes)
        console.error('Error:', e);
    }
}

function generarTabla(personajes) {
    if (personajes.length === 0) {
        document.getElementById('tabla-container').innerHTML = '<p class="no-result">No se encontraron resultados.</p>';
        return;
    }

    let tablaHTML = `
          <table class="styled-table">
                <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Especie</th>
                      <th>Imagen</th>
                    </tr>
                </thead>
            
        `;

    personajes.forEach(personaje => {
        tablaHTML += `
        <tbody>
            <tr>
              <td>${personaje.name}</td>
              <td>${personaje.species || 'XXXXXXXX'}</td>
              <td> <img src="${personaje.image}" alt="Imagen ${personaje.name}" /> </td>
            </tr>
        </tbody>
      `;
    });

    tablaHTML += '</table>';
    document.getElementById('tabla-container').innerHTML = tablaHTML;
}

cargarListaPersonajesCompleta()
