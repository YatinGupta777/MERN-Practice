import { FETCH_PROFILES } from "./types";

export const fetchProfiles = () => dispatch => {
  fetch("http://localhost:5000/api/profile")
    .then(res => res.json())
    .then(profiles => dispatch({ type: FETCH_PROFILES, payload: profiles }));
};

// export const createPost = postData => dispatch => {
//   fetch("https://jsonplaceholder.typicode.com/posts", {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify(postData),
//   })
//     .then(res => res.json())
//     .then(post => dispatch({ type: NEW_POST, payload: post }));
// };
