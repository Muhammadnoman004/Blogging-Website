import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/blog-removebg-preview.png';
import { signOut, auth } from '../Firebase Config/Config';
import { LoginUser } from '../Context/Context'

export default function UserHome() {

    const [Data, setData] = useContext(LoginUser);
    let navigate = useNavigate();

    //  LOGOUT  //

    const logOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate('/')
        }).catch((error) => {
            // An error happened.
            console.log(error);
        });

    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid" id='nav'>
                    <img src={logo} alt="" id='logo' />
                    <a className="navbar-brand navtext" href="#">MyBlog</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item homenav">
                                <a className="nav-link active" aria-current="page" href="#"></a>
                            </li>
                            <Link to={'/dashboard'}><button className='btn home'>Dashboard</button></Link>
                            <Link to={'/profile'}><button className='btn fullName' style={{ display: Data.Full_Name ? "block" : "none" }}>{Data.Full_Name}</button></Link>
                            <button className='btn btn-primary logout' onClick={logOut}>Logout</button>
                        </ul>

                    </div>
                </div>
            </nav>
        </div>
    )
}
