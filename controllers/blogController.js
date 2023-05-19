//const mongoose=require('mongoose')
const messages = require("../messages");
const Blogs = require("../schemas/blogSchema");
const User = require("../schemas/userSchema");
//const mongoose=require('mongoose')
//Shows all the blogs present in db's collection
const getBlogs = async (req, res) => {
  try {
    const blog = await Blogs.find();
    return res.status(messages.status.statusSuccess).json(blog);
  } catch (error) {
    console.log(error);
  }
};

const getLoggedInBlogs = async (req, res) => {
  try {
    /*Imp */ const blog = await Blogs.find({ user: req.users.id });

    return res.status(messages.status.statusSuccess).json(blog);
  } catch (error) {
    console.log(error);
  }
};

//Like this blog
const likeBlog = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.blogNotFound);
    } else {
      const user = await User.findById(req.users.id);
      if (!user) {
        return res
          .status(messages.status.statusNotFound)
          .json(messages.messages.userNotFound);
      } else {
        const id = req.params.id; //blog id
        const data = req.users.id; //user id -found from jwt token
        console.log(data)

        const updatedBlog = await Blogs.updateOne(
          { _id: id },
          { $addToSet: { likeButton: data } },
          { new: true, upsert: true }
        ).exec();
        // const newBlog= await Blogs.findById(id)
        // console.log(newBlog)
        return res.status(messages.status.statusSuccess).json(updatedBlog);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//const unlike blog /* New */
const unLikeBlog = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.blogNotFound);
    } else {
      const user = await User.findById(req.users.id);
      if (!user) {
        return res
          .status(messages.status.statusNotFound)
          .json(messages.messages.userNotFound);
      } else {
        const id = req.params.id; //blog id
        const data = req.users.id; //user id -found from jwt token
        console.log(data);

        const updatedBlog = await Blogs.updateOne(
          { _id: id },
          { $pull: { likeButton: data } },
          { returnOriginal: false }
        ).exec();
        const newBlog = await Blogs.findById(id);
        console.log(newBlog);
        return res.status(messages.status.statusSuccess).json(updatedBlog);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//Create Blogs in db collection blogs
const createBlogs = async (req, res) => {
  try {
    const { title } = req.body;
    const blogTitleExsists = await Blogs.findOne({ title });
    // const username=await User.aggregate([{$match:{matchUsername},$project:{'sUsername':1}}])
    // console.log(username)
    //console.log(Users)
    if (blogTitleExsists) {
      console.log("no");
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.duplicateTitle);
    } else {
      // const cDate=req.body.createdDate
      // const pDate=req.body.publishedDate
      // const blog1=await Blogs.updateOne({$cmp:{cDate,pDate}})
      // console.log(blog1)

      console.log(req.file);
      const blog = await Blogs.create({
        title: req.body.title,
        description: req.body.description,
        createdDate: Date.now(),
        // createdDate: req.body.createdDate,
        publishedDate: req.body.publishedDate,
        //coverImage:req.file.path,
        like: req.body.likeButton,
        user: req.users.id /*imp line*/,
        sUsername: req.users.sUsername, //newline
      });
      console.log(req.body);
      return res.status(messages.status.statusSuccess).json(blog);
    }
  } catch (error) {
    console.log(error);
  }
};

//Update Collection Blogs with id  /* New */
const updateBlogs = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.blogNotFound);
    } else {
      const user = await User.findById(req.users.id);
      if (!user) {
        return res
          .status(messages.status.statusNotFound)
          .json(messages.messages.userNotFound);
      }

      if (blog.user.toString() !== user.id) {
        console.log(blog.user.toString() !== user.id);
        console.log(user.id);
        return res
          .status(messages.status.statusNotFound)
          .json(messages.messages.unAuthorized);
      }
      const updatedBlog = await Blogs.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          description: req.body.description,
          createdDate: req.body.createdDate,
          publishedDate: req.body.publishedDate,
          //   coverImage: req.file.path,
        },
        { returnOriginal: false }
      );
      return res.status(messages.status.statusSuccess).json(updatedBlog);
    }
  } catch (error) {
    console.log(error);
  }
};

//Delete collection with id
const deleteBlogs = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.blogNotFound);
    } else {
      const user = await User.findById(req.users.id);
      if (!user) {
        return res
          .status(messages.status.statusNotFound)
          .json(messages.messages.userNotFound);
      }

      if (blog.user.toString() !== user.id) {
        console.log(blog.user.toString());
        return res
          .status(messages.status.statusNotFound)
          .json(messages.messages.unAuthorized);
      }
      const deletedBlog = await Blogs.findByIdAndRemove(req.params.id);
      return res.status(messages.status.statusSuccess).json(deletedBlog);
    }
  } catch (error) {
    console.log(error);
  }
};

const publishABlog = async (req, res) => {
  let id = req.params.id;
  const user = req.users.id;

  const blog = await Blogs.findById(id);
  console.log(user);
  console.log(blog.user.toString());
  console.log(user === blog.user.toString());
  if (user === blog.user.toString()) {
    if (
      blog.publishedDate === blog.createdDate ||
      blog.publishedDate === Date.now()
    ) {
      const update = await Blogs.findByIdAndUpdate(
        { id },
        { isPublished: true },
        { returnOriginal: false }
      );
      console.log(id);
      console.log(update);
      return res
        .status(messages.status.statusSuccess)
        .json({ message: "Succesfully Published", data: blog });
    } else if (blog.isPublished === true) {
      return res
        .status(messages.status.statusSuccess)
        .json({ message: "The blog has already been Published" });
    } else {
      return res
        .status(messages.status.statusSuccess)
        .json(messages.messages.blogNotFound);
    }
  } else {
    return res
      .status(messages.status.statusSuccess)
      .json(messages.messages.unAuthorized);
  }
};

module.exports = {
  getBlogs,
  getLoggedInBlogs,
  likeBlog,
  unLikeBlog,
  createBlogs,
  updateBlogs,
  deleteBlogs,
  publishABlog,
};
