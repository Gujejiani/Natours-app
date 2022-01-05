import '@babel/polyfill';
import {showAlert} from './alerts'
import axios from 'axios'
export const login = async (email, password) => {
    console.log(email, password)
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });
       if(res.data.status ==='success'){
        showAlert('success','Logged in successfully')
           window.setTimeout(()=>{
               location.assign('/')
           }, 1500)
       }
 
    } catch (err) {
        console.log('from hereee')
        showAlert('error',  err.response.data.message);
    };
};
 

export const  logout = async (e)=>{
    e.preventDefault()
    try{
            const res = await axios({
                method: 'GET',
                url: '/api/v1/users/logout',
            })
            console.log('hola')
            showAlert('Log out successfully')
            if(res.data.status==='success') location.assign('/')

    }catch(err){
        console.log("it's error")
        console.log(err)
        showAlert('error', 'Error logging out! try again')
    }
}
 

