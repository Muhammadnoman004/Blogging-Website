import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import './Authentication.css'
import { auth, createUserWithEmailAndPassword, onAuthStateChanged } from '../Firebase Config/Config'
import { db, setDoc, doc } from '../Firebase Config/Config'
import Navbar from '../Navbar/Navbar'
import { Loader } from '../Context/Context'
import LoaderComponent from '../LoaderComponent/LoaderComponent'

export default function Signup() {

    const [loading, setloading] = useContext(Loader);
    let navigate = useNavigate()
    let [name, setname] = useState('')
    let [email, setemail] = useState('')
    let [password, setpassword] = useState('')
    let [confirmpassword, setconfirmpassword] = useState('')
    let New_Password;

    const NameInpValue = (e) => {
        setname(e.target.value)
    }
    const EmailInpValue = (e) => {
        setemail(e.target.value)
    }
    const PassInpValue = (e) => {
        setpassword(e.target.value)
    }
    const ConfirmPassInpValue = (e) => {
        setconfirmpassword(e.target.value)
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            navigate("/dashboard");
        }
    });

    const SignUpFun = () => {

        if (name == '' || email == '' || password == '' || confirmpassword == '') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please Fill All Field!",
            });
        }
        else {
            if (password == confirmpassword) {
                New_Password = confirmpassword;
            }
            setloading(true)
            createUserWithEmailAndPassword(auth, email, New_Password)
                .then(async (userCredential) => {
                    const user = userCredential.user;

                    try {
                        await setDoc(doc(db, "users", user.uid), {
                            Full_Name: name,
                            Email: email,
                            Password: New_Password,
                            Date: new Date().toLocaleString()
                        });

                    } catch (e) {
                        console.error("Error adding document: ", e);
                    } finally {
                        setloading(false)
                    }

                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "SignUp successfully",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    navigate('/login')
                    setname('')
                    setemail('')
                    setpassword('')
                    setconfirmpassword('')
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: errorCode,
                    });
                    setloading(false)
                });
        }

    }
    return (
        <div>
            <Navbar />
            {loading && <LoaderComponent />}
            <div className='mainDiv'>
                <h1 id='head'>SignUp</h1>
                <input onChange={NameInpValue} value={name} className='form-control' placeholder='Full Name' type="text" name="" id="1" /><br />
                <input onChange={EmailInpValue} value={email} className='form-control' placeholder='Email' type="email" name="" id="2" /><br />
                <input onChange={PassInpValue} value={password} className='form-control' placeholder='Password' type="password" name="" id="3" /><br />
                <input onChange={ConfirmPassInpValue} value={confirmpassword} className='form-control' placeholder='Confirm Password' type="password" name="" id="4" /><br />
                <button onClick={SignUpFun} className='btn btn-primary LogsignUpBtn'>SignUp</button>
            </div>
        </div>
    )
}
