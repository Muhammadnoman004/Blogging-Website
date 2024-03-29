import React, { useEffect, useState } from 'react'
import './Blogs.css'
import user from '../assets/user.png'
import loader from '../assets/loader.gif'
import { db, collection, getDocs } from '../Firebase Config/Config'
import { Link } from 'react-router-dom'

export default function Blogs() {

  let [AllData, setAllData] = useState([])

  const getData = async () => {

    const querySnapshot = await getDocs(collection(db, "AllBlogs"));
    let Array = []
    querySnapshot.forEach((doc) => {
      Array.push(doc.data())
      console.log(doc.id, " => ", doc.data());
    });
    setAllData(Array)
  }

  useEffect(() => {
    getData()
  }, [])

  if (AllData.length == '') {
    return <div role="status">
      <img className="spinerDiv" src={loader} alt="" />
    </div>
  }

  return (
    <div className='main'>
      <h1 id='welcome'><span>W</span>elCome All Members!</h1>
      <h3 id='ABlogs'>All Blogs</h3>

      <div className="blogMainDiv">

        {
          AllData.map((data, index) => {
            return (
              <div className='blogDiv' key={index}>
                <div className="blogDetailDiv">
                  <div className="userProfileImg">
                    <img src={data.UserData.ImageURL} alt="#" id='userproimg' />
                  </div>
                  <div className="userNameDiv">
                    <h4 id='userproHead'>{data.Title}</h4>
                    <h6 id='userpronames'>{data.UserData.Full_Name} - <span>{data.Date}</span></h6>
                  </div>
                </div>
                <div className="blogDescDiv">
                  <p id='userblogpara'>{data.Blog}</p>
                </div>
                <Link to={`/UserBlogs?user=${data.Uid}`}><p id='SeeAllBlog'>See all from this user</p></Link>
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
