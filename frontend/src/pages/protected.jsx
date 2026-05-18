import React from 'react'
import { Navigate} from 'react-router-dom'
import axiosInstance  from '../api/axiosInstance'
import { useEffect } from 'react'
import { useState } from 'react'



const Protected = ({children}) => {

    const [auth, setauth
] = useState(null)

useEffect(()=>{
    axiosInstance.get("/users/auth-check")
    .then(()=>{
        setauth(true)
    })
    .catch(()=>{
         axiosInstance.get("/captain/auth-check")
        .then(()=>{
        setauth(true)
          })
        .catch(()=>{
        setauth(false)
          })
    })
       
},[])

if(auth === null) return <div>Loading...</div> ;
return auth ? children : <Navigate to="/login" />

}

export default Protected
