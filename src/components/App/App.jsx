import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import AboutPage from "../AboutPage/AboutPage";
import UserPage from "../UserPage/UserPage";
import InfoPage from "../InfoPage/InfoPage";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import SearchPage from "../SearchPage/SearchPage";
import AddMedia from "../AddMedia/AddMedia";
import MediaItem from "../MediaItem/MediaItem";
import DisplayCollection from "../DisplayCollection/DisplayCollection";
import BrowseSearchResults from "../BrowseSearchResults/BrowseSearchResults";
import BrowsePersonResults from "../BrowsePersonResults/BrowsePersonResults";
import FramegrabsAndComparisons from "../FramegrabsAndComparisons/FramegrabsAndComparisons";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
    dispatch({ type: "INITIALIZE_TMDB" }); // initialize API config
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          <Redirect exact from="/" to="/home" />

          {/* Visiting localhost:3000/about will show the about page. */}
          <Route
            // shows AboutPage at all times (logged in or not)
            exact
            path="/about"
          >
            <AboutPage />
          </Route>

          {/* Visiting localhost:3000/search will show the search page. */}
          <Route
            // shows SearchPage at all times (logged in or not)
            exact
            path="/search/1/:type/:tmdbId"
          >
            <BrowseSearchResults />
          </Route>

          {/* Visiting localhost:3000/search will show the search page. */}
          <Route
            // shows SearchPage at all times (logged in or not)
            exact
            path="/search/0/:type/:tmdbId"
          >
            <BrowsePersonResults />
          </Route>

          {/* Visiting localhost:3000/search will show the search page. */}
          <Route
            // shows FramegrabsAndComparisons at all times (logged in or not)
            exact
            path="/compareVersions/:tmdbId"
          >
            <FramegrabsAndComparisons />
          </Route>

          {/* Visiting localhost:3000/search will show the search page. */}
          <Route
            // shows SearchPage at all times (logged in or not)
            exact
            path="/search"
          >
            <SearchPage
              typeList={["multi", "movie", "tv", "person"]}
              genericSearch={true}
            />
          </Route>

          <Route
            // shows MediaItem (logged in or not)
            exact
            path="/media_details/:mediaId"
          >
            <MediaItem />
          </Route>

          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path="/add_media"
          >
            <AddMedia />
          </ProtectedRoute>

          <ProtectedRoute
            // with authRedirect:
            // - if logged in, redirects to "/add_media"
            // - else shows RegisterPage at "/login"
            exact
            path="/login"
            authRedirect="/collection"
          >
            <LoginPage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path="/collection"
          >
            <DisplayCollection />
          </ProtectedRoute>

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path="/user"
          >
            <UserPage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows InfoPage else shows LoginPage
            exact
            path="/info"
          >
            <InfoPage />
          </ProtectedRoute>

          {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
          <ProtectedRoute
            // with authRedirect:
            // - if logged in, redirects to "/user"
            // - else shows LoginPage at /login
            exact
            path="/login"
            authRedirect="/user"
          >
            <LoginPage />
          </ProtectedRoute>

          <ProtectedRoute
            // with authRedirect:
            // - if logged in, redirects to "/user"
            // - else shows RegisterPage at "/registration"
            exact
            path="/registration"
            authRedirect="/user"
          >
            <RegisterPage />
          </ProtectedRoute>

          <ProtectedRoute
            // with authRedirect:
            // - if logged in, redirects to "/user"
            // - else shows LandingPage at "/home"
            exact
            path="/home"
            authRedirect="/collection"
          >
            <LandingPage />
          </ProtectedRoute>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
