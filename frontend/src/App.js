import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import CreatePostPopup from "./components/createPostPopup";
import { Home } from "./pages/home";
import { Activate } from "./pages/home/activate";
import { Login } from "./pages/login";
import { Profile } from "./pages/profile";
import Reset from "./pages/reset";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { postsReducer } from "./functions/reducers";
import Friends from "./pages/friends";
import Admin from "./components/admin";
import AdminHome from "./components/admin/AdminHome";
import AdminLoggedInRoutes from "./routes/AdminLoggedInRoutes";
import AdminNotLoggedInRoutes from "./routes/AdminNotLoggedInRoutes";
import Chat from "./pages/chat";

function App() {
  const { user, darkTheme } = useSelector((state) => ({ ...state }));
  const [visible, setVisible] = useState(false);
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });

  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllPosts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error.response.data.message,
      });
    }
  };
  return (
    <div className={darkTheme ? "dark" : ""}>
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={posts}
          dispatch={dispatch}
        />
      )}
      <Routes>
        <Route element={<AdminLoggedInRoutes />}>
          <Route path="/admin/home" element={<AdminHome />} exact />
        </Route>
        <Route element={<AdminNotLoggedInRoutes />}>
          <Route path="/admin" element={<Admin />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/profile"
            element={
              <Profile getAllPosts={getAllPosts} setVisible={setVisible} />
            }
            exact
          />
          <Route
            path="/profile/:username"
            element={<Profile setVisible={setVisible} />}
            exact
          />
          <Route
            path="/friends"
            element={<Friends setVisible={setVisible} />}
            exact
          />
          <Route
            path="/friends/:type"
            element={<Friends setVisible={setVisible} />}
            exact
          />
          <Route path="/chat" element={<Chat />} exact />
          <Route
            path="/"
            element={
              <Home
                posts={posts}
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                loading={loading}
              />
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} exact />
      </Routes>
    </div>
  );
}

export default App;
