import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/header";
import { profileReducer } from "../../functions/reducers";
import Cover from "./Cover";
import ProfilePictureInfos from "./ProfilePictureInfos";
import "./style.css";
import CreatePost from "../../components/CreatePost";
import Post from "../../components/post";
import Photos from "./Photos";
import Friends from "./Friends";
import Intro from "../../components/intro";
import CreatePostPopup from "../../components/createPostPopup";
import { HashLoader } from "react-spinners";

export const Profile = ({ getAllPosts }) => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [photos, setPhotos] = useState({});
  const [visible, setVisible] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  let userName = username === undefined ? user.username : username;
  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: {},
    error: "",
  });

  // useEffect(() => {
  //   getAllPosts();
  // }, []);

  useEffect(() => {
    saveToReducer();
  }, [userName]);

  const saveToReducer = async () => {
    try {
      dispatch({
        type: "PROFILE_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (data.message === false) {
        navigate("/profile");
      } else {
        try {
          const path = `${userName}/*`;
          const max = 30;
          const sort = "desc";
          const images = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/listImages`,
            {
              path,
              max,
              sort,
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setPhotos(images.data);
        } catch (error) {
          console.log(error);
        }
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: data,
        });
      }
    } catch (error) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };
  var visitor = userName === user.username ? false : true;
  return (
    <div className="profile">
      {visible && (
        <CreatePostPopup
          user={user}
          posts={profile?.posts}
          setVisible={setVisible}
          dispatch={dispatch}
          profile
        />
      )}
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="profile_top">
        <div className="profile_container">
          <Cover
            cover={profile.cover}
            visitor={visitor}
            photos={photos.resources}
          />
          <ProfilePictureInfos
            profile={profile}
            visitor={visitor}
            photos={photos.resources}
          />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <div className="profile_grid">
              <div className="profile_left">
                {loading ? (
                  <>
                    <div className="profile_card">
                      <div className="profile_card_header">Intro</div>
                      <div className="skeleton_loader">
                        <HashLoader color="#ffb100" />
                      </div>
                    </div>
                    <div className="profile_card">
                      <div className="profile_card_header">Photos</div>
                      <div className="skeleton_loader">
                        <HashLoader color="#ffb100" />
                      </div>
                    </div>
                    <div className="profile_card">
                      <div className="profile_card_header">Friends</div>
                      <div className="skeleton_loader">
                        <HashLoader color="#ffb100" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Intro detailss={profile.details} visitor={visitor} />
                    <Photos
                      username={userName}
                      token={user.token}
                      photos={photos}
                    />
                    <Friends friends={profile.friends} />
                  </>
                )}
              </div>
              <div className="profile_right">
                {!visitor && (
                  <CreatePost user={user} profile setVisible={setVisible} />
                )}
                {loading ? (
                  <div className="skeleton_loader">
                    <HashLoader color="#ffb100" />
                  </div>
                ) : (
                  <>
                    <div className="posts">
                      {profile.posts && profile.posts.length ? (
                        profile.posts.map((post, i) => (
                          <Post post={post} user={user} key={i} profile />
                        ))
                      ) : (
                        <div className="no_posts">No posts available</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
