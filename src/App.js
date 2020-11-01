import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  // useEffect --> Runs a piece of code based on a specific condition

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user logged out
        setUser(null);
      }
    });
    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        // every time a new post is added this code
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const handleClose = () => {
    setOpenSignIn(false);
  };

  const signUp = () => {
    setOpen(true);
  };

  const signup = event => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch(error => alert(error.message));
    setOpen(false);
  };

  const signIn = event => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram_logo"
                className="app_headerImage"
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram_logo"
                className="app_headerImage"
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signup}>
              Signup
            </Button>
          </form>
        </div>
      </Modal>

      {/* {header} */}
      <div className="app_header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram_logo"
          className="app_headerImage"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>

      {/* {posts} */}
      <div className="app_posts">
        <div className="app_postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              postId = {id}
              user = {user}
            />
          ))}
        </div>
        <div className="app_postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/BODsnyjh27h/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry, login to upload</h3>
      )}

      {/* {posts} */}
    </div>
  );
}

export default App;
