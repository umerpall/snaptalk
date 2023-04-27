import { useState, useRef, useCallback, useEffect } from "react";
import useClickOutside from "../../helpers/clickOutside";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../helpers/getCroppedImg";
import { uploadImages } from "../../functions/uploadImages";
import { useSelector } from "react-redux";
import { updateCover } from "../../functions/user";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import OldCovers from "./OldCovers";

const Cover = ({ cover, visitor, photos }) => {
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [coverPicture, setCoverPicture] = useState("");
  const [error, setError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const coverMenuRef = useRef(null);
  const coverInputRef = useRef(null);
  const coverAfterRef = useRef(null);
  useClickOutside(coverMenuRef, () => setShowCoverMenu(false));
  const { user } = useSelector((state) => ({ ...state }));

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 3) {
      setError(`${file.name} size is too large. Max 3MB is allowed.`);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCoverPicture(event.target.result);
    };
  };
  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [croppedAreaPixels]
  );
  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(coverPicture, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setCoverPicture(img);
        } else {
          return img;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [croppedAreaPixels]
  );
  const coverWidthRef = useRef(null);
  useEffect(() => {
    setWidth(coverWidthRef.current.clientWidth);
  }, [window.innerWidth]);

  const updateCoverPicture = async () => {
    try {
      setLoading(true);
      let img = await getCroppedImage();
      let blob = await fetch(img).then((b) => b.blob());
      const path = `${user.username}/cover_pictures`;
      let formData = new FormData();
      formData.append("file", blob);
      formData.append("path", path);
      const res = await uploadImages(formData, path, user.token);
      const updatedPicture = await updateCover(res[0].url, user.token);
      if (updatedPicture === "Success") {
        const new_post = await createPost(
          "cover",
          null,
          null,
          res,
          user.id,
          user.token
        );
        if (new_post.status === "Success") {
          setCoverPicture("");
          setLoading(false);
          coverAfterRef.current.src = res[0].url;
        } else {
          setLoading(false);
          setError(new_post);
        }

        setLoading(false);
      } else {
        setLoading(false);
        setError(updatedPicture);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="profile_cover" ref={coverWidthRef}>
      {coverPicture && (
        <div className="save_changes_cover">
          <button
            className="yellow_btn opacity_btn"
            onClick={() => setCoverPicture("")}
          >
            Cancel
          </button>
          <button className="yellow_btn" onClick={() => updateCoverPicture()}>
            {loading ? <PulseLoader color="#fff" size={5} /> : "Save Changes"}
          </button>
        </div>
      )}
      <input
        type="file"
        ref={coverInputRef}
        hidden
        accept="image/jpeg, image/png, image/webp, image/gif"
        onChange={handleImage}
      />
      {error && (
        <div className="comment_error cover_photo_error">
          <div className="postError_error">{error}</div>
          <button className="yellow_btn" onClick={() => setError("")}>
            Try again
          </button>
        </div>
      )}
      {coverPicture && (
        <div className="cover_cropper">
          <Cropper
            image={coverPicture}
            crop={crop}
            zoom={zoom}
            aspect={width / 300}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="horizontal-cover"
          />
        </div>
      )}
      {cover && !coverPicture && (
        <img src={cover} className="cover" alt="Cover" ref={coverAfterRef} />
      )}
      {!visitor && (
        <div className="update_cover_wrapper">
          {!coverPicture && (
            <div
              className="open_cover_update"
              onClick={() => setShowCoverMenu((prev) => !prev)}
            >
              <i className="camera_filled_icon"></i>
              <span>Add cover photo</span>
            </div>
          )}
          {showCoverMenu && (
            <div className="open_cover_menu" ref={coverMenuRef}>
              <div
                className="open_cover_menu_item hover1"
                onClick={() => setShow((prev) => !prev)}
              >
                <i className="photo_icon"></i>
                Select Photo
              </div>
              <div
                className="open_cover_menu_item hover1"
                onClick={() => coverInputRef.current.click()}
              >
                <i className="upload_icon"></i>
                Upload Photo
              </div>
            </div>
          )}
        </div>
      )}
      {show && (
        <OldCovers
          photos={photos}
          setCoverPicture={setCoverPicture}
          setShow={setShow}
        />
      )}
    </div>
  );
};

export default Cover;
