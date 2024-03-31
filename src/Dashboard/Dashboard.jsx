import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import logo from '../assets/blog-removebg-preview.png'
import userImage from '../assets/user.png'
import { auth, signOut } from '../Firebase Config/Config'
import { db, addDoc, collection, onSnapshot, deleteDoc, updateDoc, doc, query, where, } from '../Firebase Config/Config'
import { LoginUser, LoginUserID } from '../Context/Context'

export default function Dashboard() {
  const [Data, setData] = useContext(LoginUser);
  const [ID, setID] = useContext(LoginUserID);

  let [UserBlogs, setUserBlogs] = useState([]);
  let [BlogTitle, setBlogTitle] = useState("");
  let [BlogDes, setBlogDes] = useState("");
  let [updateBlogTitle, setupdateBlogTitle] = useState("")
  let [updateBlogDes, setupdateBlogDes] = useState("")
  let [updateBlogID, setupdateBlogID] = useState("")
  let [ModalTitle, setModalTitle] = useState("")
  let [ModalDes, setModalDes] = useState("")
  let navigate = useNavigate()

  // console.log(Data);
  console.log(ID);

  const BlogTitleInp = (e) => {
    setBlogTitle(e.target.value)
  }
  const BlogDesInp = (e) => {
    setBlogDes(e.target.value)
  }

  //  GETDATA FROM DATDBASE //

  const GetData = () => {

    const AllBlogsRef = collection(db, "AllBlogs");
    const q = query(AllBlogsRef, where("Uid", "==", `${ID}`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let Array = []
      snapshot.docChanges().forEach((change) => {
        // console.log(change);
        if (change.type === "added") {
          let allData = {
            id: change.doc.id,
            ...change.doc.data(),
          }
          Array.push(allData)
          console.log("Array ==> ", Array);
        }
        if (change.type === "modified") {
          let allData = {
            id: change.doc.id,
            ...change.doc.data(),
          }
          Array.push(allData)
        }
        if (change.type === "removed") {
          let allData = {
            id: change.doc.id,
            ...change.doc.data(),
          }
          Array.push(allData)
        }
      });
      setUserBlogs(Array)
    });

  }
  useEffect(() => {
    GetData()
  }, [ID])

  // ADD DATA IN DATABASE //

  const AddBlog = async () => {

    if (BlogTitle == '' || BlogDes == '') {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all fields!",
      });
    }
    else {

      try {
        const docRef = await addDoc(collection(db, "AllBlogs"), {
          Title: BlogTitle,
          Blog: BlogDes,
          Uid: ID,
          UserData: Data,
          Date: new Date().toLocaleDateString()
        });
        Swal.fire({
          icon: "success",
          title: "Good job",
          text: "Your Blog Published Successfully!",
        });
        GetData(ID)
        setBlogTitle("")
        setBlogDes("")
        console.log(BlogTitle);
        console.log(BlogDes);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }

  //  DELETE DATA FROM DATABASE //

  const DelData = async (id) => {
    await deleteDoc(doc(db, "AllBlogs", id));
    Swal.fire({
      icon: "error",
      title: "Delete...",
      text: "Deleted Successfully!",
    });
    GetData(ID);
  }

  //  GET DATA IN MODAL FROM DATABASE //

  const EditData = (data) => {
    setupdateBlogTitle(data.Title)
    setupdateBlogDes(data.Blog)
    setupdateBlogID(data.id)
    console.log(data.id);
    console.log(updateBlogTitle);
    console.log(updateBlogDes);
  }

  //  UPDATE DATA FROM DATABASE //

  const updateData = async (id) => {
    console.log(id);

    const UpdateDataref = doc(db, "AllBlogs", id);

    await updateDoc(UpdateDataref, {
      Title: ModalTitle,
      Blog: ModalDes,
      Update_Time: new Date().toLocaleString()
    });
    Swal.fire({
      icon: "success",
      title: "Good job",
      text: "Updated Successfully!",
    });
    GetData(ID)
  }

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
              <Link to={'/profile'}><button className='btn fullName' style={{ display: Data.Full_Name ? "block" : "none" }}>{Data.Full_Name}</button></Link>
              <button className='btn home'>Home</button>
              <button className='btn btn-primary logout' onClick={logOut}>Logout</button>
            </ul>

          </div>
        </div>
      </nav>
      <br /><br /><br /><br />
      <h1 id='dash'><span>D</span>ashboard</h1>

      <div className='BlogTitleDiv'>

        <div className="mb-3">
          <label htmlFor="formGroupExampleInput" className="form-label" id='blogtitle'>Blog Title:</label>
          <input type="text" className="form-control" id="formGroupExampleInput" required placeholder="Enter Blog Title" value={BlogTitle} onChange={BlogTitleInp} />
        </div>

        <div className="mb-3">
          <label htmlFor="validationTextarea" className="form-label" id='blogdescription'>Blog Description:</label>
          <textarea className="form-control" id="validationTextarea" placeholder="Enter Blog Description" required value={BlogDes} onChange={BlogDesInp}></textarea>
        </div>
        <button className='btn btn-primary publishBtn' onClick={AddBlog}>Publish Blog</button>
      </div>

      <h2 id='AllBlogs'>All Blogs</h2>

      {!UserBlogs.length ?
        (
          <div>
            <div className='anyBlogDiv'>
              <h1>You don't have any blog yet!</h1>
            </div>
          </div>
        ) : (

          <div className="blogMainDiv">

            {
              UserBlogs.map((data) => {
                return (
                  <div className='blogDiv' key={data.id}>
                    <div className="blogDetailDiv">
                      <div className="userProfileImg">
                        {
                          <img src={Data.ImageURL} alt="" id='userproimg' />
                        }
                      </div>
                      <div className="userNameDiv">
                        <h4 id='userproHead'>{data.Title}</h4>
                        <h6 id='userpronames'>{Data.Full_Name} - <span>{data.Date}</span></h6>
                      </div>
                    </div>
                    <div className="blogDescDiv">
                      <p id='userblogpara'>{data.Blog}</p>
                    </div>
                    <div className='d-flex'>
                      <button id='editbtn' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => EditData(data)}><i className="fa-solid fa-pen-to-square fa-xl" style={{ color: "#216ef2" }}></i></button>
                      <button id='delbtn' onClick={() => DelData(data.id)}><i className="fa-solid fa-trash-can fa-xl" style={{ color: "#e81202" }}></i></button>
                    </div>
                  </div>
                )
              })
            }

          </div>

        )}

      <div className='footerDiv'>
        <h6>Made by <a target='https://github.com/Muhammadnoman004' href="https://github.com/Muhammadnoman004">Muhammad Noman.</a></h6>
        <p>@2024-MyBlog | All rights reserved.</p>
      </div>

      {/* Modal  */}

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "whitesmoke" }}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <div className="mb-3">
                <label htmlFor="formGroupExampleInput" className="form-label" id='blogtitle'>Blog Title:</label>
                <input type="text" className="form-control" id="formGroupExampleInput" required placeholder="Enter Blog Title" onChange={(e) => setModalTitle(e.target.value)} defaultValue={updateBlogTitle} />
              </div>

              <div className="mb-3">
                <label htmlFor="validationTextarea" className="form-label" id='blogdescription'>Blog Description:</label>
                <textarea className="form-control" id="validationTextarea" placeholder="Enter Blog Description" required onChange={(e) => setModalDes(e.target.value)} defaultValue={updateBlogDes}></textarea>
              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => updateData(updateBlogID)}>Update Blog</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
