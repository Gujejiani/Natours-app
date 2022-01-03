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
        showAlert('error',  err.response.data.message);
    };
};
 

export const  logout = async ()=>{
    try{
            const res = await axios({
                method: 'GET',
                url: '/api/v1/users/logout',
            })
            showAlert('Log out successfully')
            if(res.data.status==='success') location.reload(true)

    }catch(err){
        showAlert('error', 'Error logging out! try again')
    }
}
 

