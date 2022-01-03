import { login, logout} from './login'

import {displayMap} from './mapbox'
import {updateSettings} from './updateSettings'

// Dom Elements
const mapBox = document.getElementById('map')
const form = document.querySelector('.form--login')
const formUpdate = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
// Values


const logoutBtn =document.querySelector('.nav__el--logout')


if(form){
    form.addEventListener('submit', e=>{
        e.preventDefault();
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
       
        login(email, password)
    })
    
}

if(logoutBtn){
    logoutBtn.addEventListener('click',logout)
}

if(formUpdate){
    formUpdate.addEventListener('submit', e=>{
        e.preventDefault()
        const name = document.getElementById('name').value
        const email = document.getElementById('email--update').value
        console.log('it calling')
        updateSettings({name: name, email: email}, 'data')
    })
}


if(userPasswordForm){
    console.log('here we go')
    userPasswordForm.addEventListener('submit', async e=>{
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent ='Updating'
        const currentPassword = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('password-confirm').value
     
        console.log('it calling')
      await  updateSettings({currentPassword, password, confirmPassword}, 'password')
      document.querySelector('.btn--save-password').textContent='Save Password'
      document.getElementById('password-current').value  =''
      document.getElementById('password').value =''
      document.getElementById('password-confirm').value=''
    })
}


if(mapBox){
    

    const locations = JSON.parse(mapBox?.dataset?.locations)
    displayMap(locations)

}