import { login, logout} from './login'

import {displayMap} from './mapbox'
import {updateSettings} from './updateSettings'
import {bookTour} from './stripe'
// Dom Elements
const mapBox = document.getElementById('map')
const form = document.querySelector('.form--login')
const formUpdate = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
// Values


const logoutBtn =document.querySelector('.nav__el--logout--s')
const bookBtn = document.getElementById('book-tour')

if(form){
    form.addEventListener('submit', e=>{
        e.preventDefault();
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
       
        login(email, password)
    })
    
}

if(logoutBtn){
 
    logoutBtn.addEventListener('click', logout)
}

if(formUpdate){
    formUpdate.addEventListener('submit', e=>{
        e.preventDefault()
        const name = document.getElementById('name').value
        const email = document.getElementById('email--update').value
        const photo = document.getElementById('photo').files[0]
        const form = new FormData()
        form.append('name',  name)
        form.append('email',  email)
        form.append('photo',  photo)
     
        updateSettings(form , 'data') // axios will recognize Form Data as an object
    })
}


if(userPasswordForm){
  
    userPasswordForm.addEventListener('submit', async e=>{
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent ='Updating'
        const currentPassword = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('password-confirm').value
     
      
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


if(bookBtn){
    
    bookBtn.addEventListener('click', e=>{
      
        e.target.textContent= 'Processing...'
        const {tourId} = e.target.dataset;

        bookTour(tourId)
    })
}