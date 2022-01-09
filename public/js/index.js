import { login,signUp, logout} from './login'

import {displayMap} from './mapbox'
import {updateSettings} from './updateSettings'
import {bookTour} from './stripe'
import {showAlert} from './alerts'
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
        const confirmPassword = document.getElementById('confirm-password').value
        const name = document.getElementById('user-name').value
        const photo = document.getElementById('photo').files[0]
        const signUpBtn = document.getElementById('sign-up');
        if(!confirmPassword){
            console.log('login ing')
            login(email, password)
        }else{
            const form = new FormData()
            form.append('name',  name)
            form.append('email',  email)
            form.append('password',  password)
            form.append('confirmPassword', confirmPassword)
            form.append('photo',  photo)
            form.append('role',  'user')
            form.append('signUp', true)
            if(signUpBtn){
                signUpBtn.textContent="Processing..."
            }

            signUp(form)
        }
       
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


const alertMessage = document.querySelector('body').dataset.alert

if(alertMessage) showAlert('Success', alertMessage, 20)