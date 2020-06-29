"use strict"

let correoaborrar = ""
let userList = new Array();
let pageList = new Array();
let currentPage = 1
let numberPerPage = 2
let numberOfPages = 1

loadUsers(currentPage)

function loadUsers(){
  let xhr = new XMLHttpRequest()

  xhr.open('GET', 'https://users-dasw.herokuapp.com/api/users')
  xhr.setRequestHeader('x-auth', localStorage.token)
  xhr.setRequestHeader('x-user-token', localStorage.userToken)
  xhr.send()
  
  xhr.onload = function (){
    if(xhr.status==200){
      userList = JSON.parse(xhr.response)
      currentPage = 1
      pagination()
      checkPage(currentPage)
      printUsers(currentPage)
    }
    else{
      alert(alert(xhr.status + ": " + xhr.statusText))
    }
  }
}

function printUsers(page){
  let begin = (page -1)*numberPerPage
  let end = begin + numberPerPage
  pageList = userList.slice(begin,end)
  document.querySelector("#userContainer").innerHTML = userListToHTML(pageList)
}

function userToHTML(usuario){
return `<div class="row mt-3">
      <div class="col">
        <div class="media">
          <a class="d-flex align-self-center my-2 mx-3" href="#">
            <img
              class="rounded-circle"
              src="` + usuario.url + `"
              alt="img"
            />
          </a>
          <div class="media-body">
            <div class="d-flex flex-column align-items-start">
              <h5>` + usuario.nombre + ` ` + usuario.apellido +`</h5>
              <p class="font-weight-light">Correo: ` + usuario.correo + `</p>
              <p class="font-weight-light">iid: ` + usuario.iid + `</p>
            </div>
          </div>
          <div class="media-left">
            <div class="d-flex flex-column">
              <button 
                class="btn btn-primary mt-2 mr-2" 
                onclick="verDetalle('` + usuario.correo + `')"
                >
                <i class="fas fa-search"></i>
              </button>
              <button
                class="btn btn-primary mt-2 mr-2"
                onclick="deleteusr('`+ usuario.correo +`')"
              >
                <i class="fas fa-trash"></i>
              </button>
                <button 
                    class="btn btn-primary mt-2 mr-2" 
                    onclick="editusr('`+ usuario.correo +`')"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
}

function userListToHTML(listaUsuarios){
    let htmlUsuarios=listaUsuarios.map(usuario => userToHTML(usuario))
    return htmlUsuarios.join("\n")
}

function verDetalle(correo){
    sessionStorage.correo=correo
    window.location.href = "detalle.html"
}

function deleteusr(correo){
  let xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://users-dasw.herokuapp.com/api/users/'+correo)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('x-auth', localStorage.token)
  xhr.setRequestHeader('x-user-token', localStorage.userToken)
  xhr.send()

  xhr.onload = function(){
      if(xhr.status==200){
        let usr = JSON.parse(xhr.response)
        correoaborrar = usr.correo
        document.querySelector("#erase_info").innerHTML = `<h5>Seguro que quieres borrar a este usuario:</h5>
        <p>` + usr.nombre +` `+ usr.apellido +`</p>
        <p>Correo: `+ usr.correo +`</p>
        <p>Id: `+ usr.iid +`</p>`
      }
      else{
          alert(xhr.status + ": " + xhr.statusText)
      }
  }
  $("#erase_user").modal("show")
}

document.querySelector("#erase_accept").onclick = function(event) {

  let xhr = new XMLHttpRequest()
  xhr.open('DELETE', 'https://users-dasw.herokuapp.com/api/users/'+correoaborrar)
  correoaborrar = ""
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('x-auth', localStorage.token)
  xhr.setRequestHeader('x-user-token', localStorage.userToken)
  xhr.send()

  xhr.onload = function(){
      if(xhr.status==200){
        alert("Usuario borrado")
        loadUsers()
      }
      else if(xhr.status == 404){
        alert("Usuario no encontrado")
      }
      else{
        alert(xhr.status + ": " + xhr.statusText)
      }
  }
  $("#erase_user").modal("hide")
  event.preventDefault()
}

function editusr(correo){
  let xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://users-dasw.herokuapp.com/api/users/'+correo)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('x-auth', localStorage.token)
  xhr.setRequestHeader('x-user-token', localStorage.userToken)
  xhr.send()

  xhr.onload = function(){
      if(xhr.status==200){
        let usr = JSON.parse(xhr.response)
        document.querySelector("#nombre_edit").value = usr.nombre
        document.querySelector("#apellidos_edit").value = usr.apellido
        document.querySelector("#correo_edit").value = usr.correo
        document.querySelector("#correo_edit").disabled = true
        document.querySelector("#password_edit").value = usr.password
        document.querySelector("#fecha_nac_edit").value = usr.fecha
        document.querySelector("#hombre_edit").disabled = true
        document.querySelector("#mujer_edit").disabled = true
        if(usr.sexo == "H"){
          document.querySelector("#hombre_edit").checked = true
        }
        else{
          document.querySelector("#mujer_edit").checked = true
        }
        document.querySelector("#ur_perf_edit").value = usr.url
      }
      else{
          alert(xhr.status + ": " + xhr.statusText)
      }
  }
  $("#edit_usr").modal("show")
}


edit_form.onsubmit = function(event){
  let usr = {
      nombre: document.querySelector("#nombre_edit").value,
      apellido: document.querySelector("#apellidos_edit").value,
      correo: document.querySelector("#correo_edit").value,
      url: document.querySelector("#ur_perf_edit").value,
      sexo: edit_form.querySelector("input:checked").value,
      fecha: document.querySelector("#fecha_nac_edit").value,
      password: document.querySelector("#password_edit").value  
    }


  let xhr = new XMLHttpRequest();
  xhr.open('PUT', 'https://users-dasw.herokuapp.com/api/users/' + document.querySelector("#correo_edit").value)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('x-auth', localStorage.token)
  xhr.setRequestHeader('x-user-token', localStorage.userToken)
  xhr.send([JSON.stringify(usr)])

  xhr.onload = function(){

      if (xhr.status == 200){
        alert("usuario actualizado")
        loadUsers()
      }
      else{
          console.log(xhr.status)
      }
  }
  $("#edit_usr").modal("hide")
  event.preventDefault()
}

function pagination(){
  numberOfPages = Math.ceil(userList.length / numberPerPage);
  let paginater_html = `<li id="li_prev" class="page-item">
  <a onclick="previousPAge()" class="page-link" href="#">Previous</a>
</li>`
  for(let i = 0; i<numberOfPages; i++){
    paginater_html += `<li class="page-item"><a 
                                            onclick="goToPage('` + String(i + 1) + `')" 
                                            class="page-link" href="#">`+ String(i+1) +`</a></li>`
  }
  paginater_html += `<li id="li_next" class="page-item">
  <a onclick="nextPage()" class="page-link" href="#">Next</a></li>`
  document.querySelector("#paginater").innerHTML=paginater_html
}

function checkPage(page){
  if(numberOfPages <= 1){
    document.querySelector("#li_prev").classList.add("disabled")
    document.querySelector("#li_next").classList.add("disabled")
  }
  else {
    if (page == 1){
      document.querySelector("#li_prev").classList.add("disabled")
      document.querySelector("#li_next").classList.remove("disabled")
    }
    else if (page == numberOfPages){
      document.querySelector("#li_prev").classList.remove("disabled")
      document.querySelector("#li_next").classList.add("disabled")
    }
    else{
      document.querySelector("#li_prev").classList.remove("disabled")
      document.querySelector("#li_next").classList.remove("disabled")
    }
  }
}

function nextPage(){
  currentPage += 1
  printUsers(currentPage)
  checkPage(currentPage)
}

function previousPAge(){
  currentPage -= 1
  printUsers(currentPage)
  checkPage(currentPage)
}

function goToPage(page){
  currentPage = page
  printUsers(currentPage)
  checkPage(page)
}

buscar_form.onsubmit = function(event){
  let buscar_string = document.querySelector("#buscar_text").value
  event.preventDefault()
  let xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://users-dasw.herokuapp.com/api/users/?nombre='+buscar_string)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('x-auth', localStorage.token)
  xhr.setRequestHeader('x-user-token', localStorage.userToken)
  xhr.send()

  xhr.onload = function(){
    if(xhr.status==200){
      userList = JSON.parse(xhr.response)
      currentPage = 1
      pagination()
      checkPage(currentPage)
      printUsers(currentPage)
    }
    else{
      alert(xhr.status + ": " + xhr.statusText)
    }
  }
}

