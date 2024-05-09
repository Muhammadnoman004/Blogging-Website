import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './Authentication.css'
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '../Firebase Config/Config'
import Navbar from '../Navbar/Navbar'
import { Loader } from '../Context/Context'
import LoaderComponent from '../LoaderComponent/LoaderComponent'

export default function Login() {

    const [loading, setloading] = useContext(Loader);
    let navigate = useNavigate()
    let [email, setemail] = useState('')
    let [password, setpassword] = useState('')

    const EmailInpValue = (e) => {
        setemail(e.target.value)
    }
    const PassInpValue = (e) => {
        setpassword(e.target.value)
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            navigate("/dashboard");
        }
    });

    const LogInFun = () => {

        if (email == '' || password == '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please Fill All Field!",
            });
        }
        else {
            setloading(true);
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    setloading(false);
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "LogIn successfully",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    setemail('')
                    setpassword('')
                    navigate('/dashboard')
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: errorCode,
                    });
                    setloading(false);
                });
        }
    }
    return (
        <div>
            <Navbar />
            {loading && <LoaderComponent />}
            <div className='mainDiv'>
                <h1 id='head'>LogIn</h1>
                <input onChange={EmailInpValue} value={email} className='form-control' placeholder='Email' type="email" name="" id="1" /><br />
                <input onChange={PassInpValue} value={password} className='form-control' placeholder='Password' type="password" name="" id="2" /><br />
                <button onClick={LogInFun} className='btn btn-primary LogsignUpBtn'>Login</button>

            </div>
        </div>
    )
}
