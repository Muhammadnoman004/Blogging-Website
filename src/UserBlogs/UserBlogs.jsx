import React, { useEffect, useState, useContext } from 'react'
import './UserBlogs.css'
import Navbar from '../Navbar/Navbar'
import userImg from '../assets/user.png'
import { Link, NavLink } from 'react-router-dom'
import { LoginUserID } from '../Context/Context'
import { collection, query, where, getDocs, db } from '../Firebase Config/Config'

export default function UserBlogs() {

  const [ID, setID] = useContext(LoginUserID);
  const [userBlog, setuserBlog] = useState([])
  const [userProImg, setuserProImg] = useState("")
  const [userName, setuserName] = useState("")
  const [userEmail, setuserEmail] = useState("")

  const URlParams = new URLSearchParams(window.location.search)
  const UserParams = URlParams.get("user")
  console.log(UserParams);

  const getUserBlog = async () => {
    let Arry = []
    const q = query(collection(db, "AllBlogs"), where("Uid", "==", UserParams));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setuserProImg(doc.data().UserData.ImageURL);
      setuserName(doc.data().UserData.Full_Name);
      setuserEmail(doc.data().UserData.Email);
      Arry.push(doc.data())
      setuserBlog(Arry)

    });
  }
  useEffect(() => {
    getUserBlog()
  }, [])

  return (
    <div>
      <Navbar /><br /><br /><br /><br />

      {/* {ID ? (
        <NavLink to={'/dashboard'}>
          <button className='btn dashboardNavBtn'>Dashboard</button>
          <NavLink to={'/profile'}>
            <button className='btn LoginNavBtn'>Profile</button>
            <NavLink to={'/'}>
              <button className='btn LogOutNavBtn'>Logout</button>
            </NavLink>
          </NavLink>
        </NavLink>

      ) : (
        <Link to={'/signup'}>
          <button className='btn SinupNavBtn'>Sign Up</button>
        </Link>
      )} */}

      {
        ID ?
          (
            <Link to={'/'}><h1 id='BackToHome'><img id='backArrow' src="https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/arrow-left-direction-icon.svg" alt="" /> Back to home!</h1></Link>
          ) : (
            <Link to={'/UserHome'}><h1 id='BackToHome'><img id='backArrow' src="https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/arrow-left-direction-icon.svg" alt="" /> Back to home!</h1></Link>
          )
      }

      <div className="UserProfileDiv">
        <div className='UserProfileInnerDiv'>
          <img src={!userProImg ? userImg : userProImg} alt="" id='UserProfileImg' />
          <h2 id='UserProfileName'>{!userName ? "User Name" : userName}</h2>
          <h5 id='UserProfileEmail'>{!userEmail ? "ABC@gmail.com" : userEmail}</h5>
        </div>
      </div>

      <h3 id='AllBlogs'>All Blogs</h3>

      <div className='UserBlogMainDiv'>

        {
          userBlog.map((userData, index) => {

            return (

              <div className='UserBlogDiv' key={index}>
                <div className="UserBlogDetailDiv">
                  <div className="userProfileImg">
                    <img src={!userData.UserData.ImageURL ? userImg : userData.UserData.ImageURL} alt="" id='userImg' />
                  </div>
                  <div className="userNameDiv">
                    <h4 id='userHead'>{userData.Title}</h4>
                    <h6 id='userNames'>{userData.UserData.Full_Name} - <span>{userData.Date}</span></h6>
                  </div>
                </div>
                <div className="blogDescDiv">
                  <p id='userPara'>{userData.Blog}</p>
                </div>
              </div>
            )
          })
        }

      </div>

      <div className='footerDiv'>
        <h6>Made by <a target='https://github.com/Muhammadnoman004' href="https://github.com/Muhammadnoman004">Muhammad Noman.</a></h6>
        <p>@2024-MyBlog | All rights reserved.</p>
      </div>

    </div>
  )
}
