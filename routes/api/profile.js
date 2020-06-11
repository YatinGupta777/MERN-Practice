const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route GET api/profile/me
// @desc get current logged in user profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]); // populate brings name and avatar from user model.

    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for this user",
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/profile
// @desc create or update user profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    //Build Social object

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET api/profile
// @desc get all profile
// @access public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/user/:user_id
// @desc get profile by user ID
// @access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);

    // If user id is invalid, then different error messgae
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route DELETE api/profile
// @desc Delete profile,user, posts
// @access Private

router.delete("/", auth, async (req, res) => {
  try {
    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/profile/experience
// @desc add profile experience
// @access Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/profile/education
// @desc add profile education
// @access Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
      check("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc Delete education from profile
// @access Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Erro");
  }
});

// @route GET api/profile/friends
// @desc get Currently Logged in Users friends
// @access Private

router.get("/friends", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for this user",
      });
    }
    res.json(profile.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/friendRequests
// @desc get Currently Logged in Users friend Requests
// @access Private

router.get("/friendRequests", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for this user",
      });
    }
    let friendRequestsUsers = [];
    for (let i = 0; i < profile.friendRequests.length; i++) {
      const user = await User.findOne({
        _id: profile.friendRequests[i],
      });
      friendRequestsUsers.push(user);
    }
    res.json(friendRequestsUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/availableUsers
// @desc get all avilable users which can be added as friends
// @access Private

router.get("/availableUsers", auth, async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "name",
      "avatar",
      "email",
    ]);

    //To remove currently logged in user

    // const removeIndex = profiles
    //   .map(profile => profile.user.toString())
    //   .indexOf(req.user.id);
    // profiles.splice(removeIndex, 1);

    //To get all friends of the current user
    const userProfile = await Profile.findOne({
      user: req.user.id,
    });
    const userFriends = userProfile.friends;
    let returnedProfiles = [];

    for (let i = 0; i < profiles.length; i++) {
      let flag = true;
      for (let j = 0; j < userFriends.length; j++) {
        if (profiles[i].user.id === userFriends[j].user.id) {
          flag = false;
          break;
        }
      }
      if (flag && profiles[i].user.id != req.user.id)
        returnedProfiles.push(profiles[i].user); // Getting only users from profiles
    }
    res.json(returnedProfiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Friend Requests

// @route POST api/profile/sendFriendRequest
// @desc Send friend request using email
// @access Private
router.post(
  "/sendFriendRequest",
  [check("email", "Please include a valid email").isEmail()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
      //see if user exists
      let requestedUser = await User.findOne({ email });
      if (!requestedUser) {
        res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Cannot send friend request to oneself
      if (requestedUser.id === req.user.id)
        res.status(400).json({
          errors: [{ msg: "Cannot send friend request to yourself" }],
        });

      // Cannot send friend request to already added friends
      const userProfile = await Profile.findOne({
        user: req.user.id,
      });
      const userFriends = userProfile.friends;

      for (let i = 0; i < userFriends.length; i++) {
        if (userFriends[i] == requestedUser.id) {
          res.status(400).json({ errors: [{ msg: "Already a friend" }] });
        }
      }

      // Adding to friend requests
      const requestedUserProfile = await Profile.findOne({
        user: requestedUser.id,
      });

      requestedUserProfile.friendRequests.unshift(req.user.id);

      await requestedUserProfile.save();
      res.json(requestedUserProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route POST api/profile/acceptFriendRequest
// @desc Accept friend request using email
// @access Private
router.post(
  "/acceptFriendRequest",
  [check("email", "Please include a valid email").isEmail()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
      //see if user exists
      let requestedUser = await User.findOne({ email });
      if (!requestedUser) {
        res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const userProfile = await Profile.findOne({
        user: req.user.id,
      });
      const requestedUserProfile = await Profile.findOne({
        user: requestedUser.id,
      });
      // If friend request doesnt exist
      const userFriendRequests = userProfile.friendRequests;
      let flag = false;
      for (let i = 0; i < userFriendRequests.length; i++) {
        if (userFriendRequests[i] == requestedUser.id) {
          flag = true;
          break;
        }
      }
      if (flag == false)
        res
          .status(400)
          .json({ errors: [{ msg: "No Friend Request from this user" }] });

      // Add to friends to each other
      userProfile.friends.unshift(requestedUser.id);
      requestedUserProfile.friends.unshift(req.user.id);

      // Removing from friend requests
      var index = userProfile.friendRequests.indexOf(requestedUser.id);
      if (index !== -1) userProfile.friendRequests.splice(index, 1);

      await userProfile.save();
      await requestedUserProfile.save();
      res.json(userProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
// @route GET api/profile/availableUsers
// @desc get profiles which are available to be added as friends
// @access public

router.get('/availableUsers', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [
      'name',
      'avatar',
      'email',
    ]);
    // traverse profiles array and check if we are not the user in the profile and the user in the profile
    // is not our friend
    profilesFriends = req.friends;
    console.log(profilesFriends);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
