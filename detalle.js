"use strict"

loadInfo(sessionStorage.correo)

function loadInfo(correo){
    let xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://users-dasw.herokuapp.com/api/users/'+correo)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', localStorage.token)
    xhr.setRequestHeader('x-user-token', localStorage.userToken)
    xhr.send()
  
    xhr.onload = function(){
        if(xhr.status==200){

          let usr = JSON.parse(xhr.response)
          document.querySelector("#nombre_detalle").value = usr.nombre
          document.querySelector("#apellidos_detalle").value = usr.apellido
          document.querySelector("#correo_detalle").value = usr.correo
          document.querySelector("#password_detalle").value = usr.password
          document.querySelector("#fecha_nac_detalle").value = usr.fecha
          console.log("user sexo: "+usr.sexo)
          if(usr.sexo == "H"){
            document.querySelector("#hombre_detalle").checked = true
          }
          else{
            document.querySelector("#mujer_detalle").checked = true
          }
          document.querySelector("#ur_perf_detalle").value = usr.url
          document.querySelector("#image_user_detalle").src = usr.url
        }
        else{
            alert(xhr.status + ": " + xhr.statusText)
        }
    }
}

document.querySelector("#regresar_detalle").onclick= function(){
    window.location.href = "consultas.html"
}

detalle_form.onsubmit = function(event){
    event.preventDefault()
    let usr = {
        nombre: document.querySelector("#nombre_detalle").value,
        apellido: document.querySelector("#apellidos_detalle").value,
        correo: document.querySelector("#correo_detalle").value,
        url: document.querySelector("#ur_perf_detalle").value,
        sexo: detalle_form.querySelector("input:checked").value,
        fecha: document.querySelector("#fecha_nac_detalle").value,
        password: document.querySelector("#password_detalle").value  
      }
  console.log(usr)
    console.log(detalle_form.querySelector("input:checked").value)
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', 'https://users-dasw.herokuapp.com/api/users/' + sessionStorage.correo)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', localStorage.token)
    xhr.setRequestHeader('x-user-token', localStorage.userToken)
    xhr.send([JSON.stringify(usr)])
  
    xhr.onload = function(){
  
        if (xhr.status == 200){
          alert("usuario actualizado")
          loadInfo(document.querySelector("#correo_detalle").value)
        }
        else{
            console.log(xhr.status)
        }
    }  
}


