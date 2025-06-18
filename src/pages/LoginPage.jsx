import React, { useContext, useState } from 'react'
import assets from '../assets/assests'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const[currState,setcurrState] = useState("Sign up")
  const[fullName,setFullname] = useState("")
  const[email,setEmail] = useState("")
  const[password,setPassword] = useState("")
  const[bio,setBio] = useState("")
  const[isDatasubmitted,setIsDatasubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currState === 'Sign up' && !isDatasubmitted){
      isDatasubmitted(true)
      return;
    }
    login(currState === "sign up"? 'signup':'login',{fullName,email,password,bio})
  }


  return (
    <div  className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 
    sm:justify-evenly max-sm:col backdrop-blur-2xl'>

      {/*-------left--------*/}

      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]'/>

      {/*--------right-----------*/}

      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
      <h2 className='font-medium text-2xl flex justify-between items-cemter'>
        {currState}
        {isDatasubmitted && <img onClick={()=> setIsDatasubmitted(false)} src={assets.arrow_icon} alt='' className='w-5 cursor-pointer'/> }
        
        </h2>
        {currState === "Sign up" &&  !isDatasubmitted &&(
          <input onChange={(e)=>setFullname(e.target.value)} value ={fullName}
          type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required/>

        )}
      {!isDatasubmitted && (
        <>
        <input onChange={(e)=>setEmail(e.target.value)} value ={email}
        type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus-ring-2
        focus:ring-indigo-500'/>


        <input onChange={(e)=>setPassword(e.target.value)} value ={password}
        type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus-ring-2
        focus:ring-indigo-500'/>
        
        </>
      )}

      { currState === "Sign up" && isDatasubmitted &&(

        <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
         rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500
        
        ' placeholder='provide a short bio...' required></textarea>
      )


      }
      
      <button  type ='submit' className ='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
        {currState === "Login" ? "Login Now": "Create An account"}
      </button>
      

      <div className='flex items-center gap-2 text-sm text-gray-500'>
        <input type="checkbox"/>
        <p>Agree to the terms of use & privacy policy.</p>
        
      </div>
      <div className='flex flex-col gap-2'>
        {currState === "Sign up" ? (
          <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>{setcurrState("Login");setIsDatasubmitted(false)}}
          className='font-medium text-violet-500 cursor-pointer'>Login Here</span></p>
        ):(
        <p className='text-sm text-gray-600'> Create an Account <span onClick={()=>{
          setcurrState("Sign up")
        }}
        className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>)}

      </div>


      </form>
       </div>
  )
}

export default LoginPage;