const stripe = Stripe('pk_test_51KFCwBC73OZSGGrxpw5IYy8MAmhVUTgKik6P2oVPHUu5GLDOSQEwRVHKnyWazMz5bkWJSsJwcPMrdjwc2hHlEp3a00YIQhzHLX')
import axios from 'axios'
import {showAlert} from './alerts'


export const bookTour = async tourId =>{

    try{
         // 1) get session from the api
    const session = await axios(`http://localhost:3000/api/v1/booking/checkout-session/${tourId}`)

    console.log(session)
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    })

    }catch(err){
        console.log(err)
        showAlert('error', err)
    }
   

}