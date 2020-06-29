"use strict"
localStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoiNjcyNzU5IiwiaWF0IjoxNTkyOTU5NjkzfQ.nYT0I5Bg1rpvLMzJPhGMHi65C4TV004Z-vaWfaWOHVk"
reg_form = document.querySelector("#reg_form")
login_form = document.querySelector("#login_form") 
submit_btn_reg = document.querySelector("#submit_btn_reg")
warn = document.querySelector("#warn")
if(reg_form.querySelectorAll("input:invalid").length != 0) {
    submit_btn_reg.disabled = true
    warn.style.display = "none" 
}
else{
    if(document.querySelector("#password_reg").value ==
    document.querySelector("#password_confirm_reg").value){
        submit_btn_reg.disabled = false  
        warn.style.display = "none" 
    }
    else{
        submit_btn_reg.disabled = true
        warn.style.display = "block" 
    }

}

reg_form.addEventListener("input", function(){
    if(reg_form.querySelectorAll("input:invalid").length != 0) {
        submit_btn_reg.disabled = true
    }
    else{
        if(document.querySelector("#password_reg").value ==
           document.querySelector("#password_confirm_reg").value){
            submit_btn_reg.disabled = false
            warn.style.display = "none" 
        }
        else{
            submit_btn_reg.disabled = true
            warn.style.display = "block" 
        }    
    }
})

reg_form.onsubmit = function(event){
    let usr = crearUsuario(
        document.querySelector("#Nombre").value,
        document.querySelector("#Apellidos").value,
        document.querySelector("#Correo_reg").value,
        document.querySelector("#ur_perf_reg").value,
        document.querySelector("input[name=Sex]:checked").value,
        document.querySelector("#fecha_nac_reg").value,
        document.querySelector("#password_reg").value  
    )

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://users-dasw.herokuapp.com/api/users')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', localStorage.token)
    xhr.send([JSON.stringify(usr)])

    xhr.onload = function(){
        if (xhr.status == 201){
            document.querySelector("#success-alert").style.display= "block"
            document.querySelector("#fail-alert").style.display= "none"
            alert("usuario creado")
        }
        else{
            document.querySelector("#fail-alert").style.display= "block"
            document.querySelector("#success-alert").style.display= "none"
            console.log(xhr.status)
            alert(xhr.status + ": " + xhr.statusText)
        }
    }
    event.preventDefault()
    $("#Registro").modal("hide")
}

login_form.onsubmit= function(event){
    let xhr = new XMLHttpRequest()
    event.preventDefault()
    xhr.open('POST', 'https://users-dasw.herokuapp.com/api/login')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('x-auth', localStorage.token)
    xhr.send([JSON.stringify({
        correo : document.querySelector("#correo_login").value,
        password : document.querySelector("#password_login").value
    })])

    xhr.onload = function(){
        if(xhr.status==200){
            let respojnseObj = JSON.parse(xhr.response)
            localStorage.userToken = respojnseObj.token
            window.location.href = "consultas.html"
        }
        else{
            alert(xhr.status + ": " + xhr.statusText)
        }
    }
}

