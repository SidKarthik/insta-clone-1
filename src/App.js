import React, { useState , useEffect } from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload'
import { auth, db } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  //👇 👇 👇 👇  is the frontend listener
  useEffect(() => {
    // 👇 👇 👇 👇  is the backend listener
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser)
      {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      }
      else
      {
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      //perform clean up actions
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc =>({
        id: doc.id,
        post: doc.data()

      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignin(false);
  }

  return (
    <div className="App">      
      <title>Insta-Clone</title>
      <Modal
        open= {open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
          <img 
            className="app_headerImage"
            src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="" 
          />
          
          <form className="app__signup">

            {/* <FormControl> */}
              
              <Input 
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />

              
              <Input 
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />

              
              <Input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signUp} variant="contained" color="secondary">Sign Up</Button>

            {/* </FormControl> */}

          </form>

          </center>
        </div>

      </Modal>

      <Modal
        open= {openSignIn}
        onClose={() => setOpenSignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
          <img 
            className="app_headerImage"
            src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="" 
          />
          
          <form className="app__signup">

            {/* <FormControl> */}
              
              
              <Input 
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />

              
              <Input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={signIn} variant="contained" color="secondary">Sign In</Button>

            {/* </FormControl> */}

          </form>

          </center>
        </div>

      </Modal>

      <div className="app__header">
        <img 
          className="app__header_Image"
          src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="" 
        />
        <div>
          {/* 👇 👇 👇 conditional rendering */}
          {user ? (
            <Button onClick={() => auth.signOut()} variant="contained" color="primary">Sign Out</Button>
          ) : (
            <div className="app__login_container">
              <Button  className="app__login" onClick={() => setOpenSignin(true)} variant="contained" color="primary">Sign In🚀 </Button>
              <Button  className="app__login" onClick={() => setOpen(true)} variant="contained" color="primary">Sign Up</Button>
            </div>
            
          )}
          
        </div>
      

      </div>
      
      <div className="app__posts">
        {
          posts.map(({id, post}) => (
            <Post key={id} postID={id} user={user}username={post.username} caption={post.caption} imageURL={post.imageURL } />
          ))
        }
      </div>

      <InstagramEmbed
        url='https://www.instagram.com/p/CHAFKdvJC03b3LprmasT9ocbvcvX987XonXoD40/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      
      <div className="bottom-nav">

      {user?.displayName ? (
              <ImageUpload username={user.displayName}/>
            ) : (
              <h3>Sorry you need to login to upload</h3>
            )}  

      </div>
      

      {/* <Post username="sidhanti" caption="HUUUUUUUUUUUUU!" imageURL="https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg"/> */}
      {/* <Post username="thikadum" caption="Woaaaaah!" imageURL="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"/> */}
      {/* <Post username="sidkarthik" caption="It Worksss!" imageURL="https://www.freecodecamp.org/news/content/images/size/w300/2020/10/15react.png" /> */}

    </div>

    
  );
}

export default App;

/* ----------------
  Post upload gui
  Post upload to firebase
  Comments Section
  Styling
  Deploying

*/

/* ------OPTIONAL IDEAS TO TRY----------
    Create Account Settings Page
    Setup Change Password

    User Registration with  layers [Profile Picture, Bio]
    Create Profile page
    Track Uploaded Posts
    Stack Uploaded Posts in Profile Page

    Create Edit Profile page or Can be Added to Account Settings
    Change Profile Picture
    Edit Bio

    Create Like Button
    Track Like Button
    Animate Like Button
    Display number of Likes   
    {
      ⏩ For number of likes create another number field in the post document
        ⏩ Increment the number everytime the like button of that post is clicked
        ⏩ For Tracking Likes create another number Array field in the post document
        ⏩ Immediately Add the username to the array when the like button is clicked
        ⏩ If (the post is unliked && the post WAS liked)
            {
              ▶ Decrement the Number
              ▶ Remove the username from the array
            }
    }
*/
