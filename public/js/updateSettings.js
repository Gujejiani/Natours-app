// updateUserData
import axios from 'axios'
import {showAlert} from './alerts'

// type is either password or data
export const updateSettings = async(data, type)=>{
    try{

        const url = type ==='password'? 'http://localhost:3000/api/v1/users/updatePassword': '/submit-user-data'
        const method = type ==='password'? 'PATCH': 'POST'
    const updateData = await axios({
        method: method,
        url,
        data
    })
    console.log('it is called')
    if(updateData){
        showAlert('success',`success ${type.toUpperCase()} updates successfully`)
           window.setTimeout(()=>{
               location.assign('/')
           }, 1500)
       }
    }catch(err){
        console.log(err)
        showAlert('error', err.response.data.message)
    }
}



