import './App.css';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {
  AppConfig,
  UserSession,
  AuthDetails,
  showConnect,
} from "@stacks/connect";
import {useState, useEffect, useRef} from "react";
import {userSession} from './auth';


import 'bootstrap/dist/css/bootstrap.css';
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Users from "./pages/Users";
import User from "./pages/User";
import UserEdit from "./pages/UserEdit";
import UserNew from "./pages/UserNew";
import Book from "./pages/Book";
import BookEdit from "./pages/BookEdit";
import BookNew from "./pages/BookNew";
import Bookstores from "./pages/Bookstores";
import Bookstore from "./pages/Bookstore";
import Footer from './components/Footer';

function App() {
  const [userData, setUserData] = useState(undefined);
  const [navHeight, setNavHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const navRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
    if (navRef.current) {
      setNavHeight(navRef.current.getBoundingClientRect().height);
    }
    if (footerRef.current) {
      setFooterHeight(footerRef.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <section className="App">
      <Router>
        <section ref={navRef}>
          <Navigation />
        </section>
        <section style={{minHeight: `calc(100vh - ${navHeight + footerHeight}px)`}}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/users" element={<Users/>}/>
            <Route path="/user/new" element={<UserNew/>}/>
            <Route path="/user/:id" element={<User/>}/>
            <Route path="/user/:id/edit" element={<UserEdit/>}/>
            <Route path="/books" element={<Books/>}/>
            <Route path="/book/new" element={<BookNew/>}/>
            <Route path="/book/:id" element={<Book/>}/>
            <Route path="/book/:id/edit" element={<BookEdit/>}/>
            <Route path="/bookstores" element={<Bookstores/>}/>
            <Route path="/bookstore/:id" element={<Bookstore/>}/>
          </Routes>
        </section>
        <section ref={footerRef}>
          <Footer />
        </section>
      </Router>
    </section>

  );
}

export default App;
