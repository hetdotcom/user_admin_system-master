const messages = require("../messages");
const Blogs = require("../schemas/blogSchema");
const User = require("../schemas/userSchema");

//Shows all the blogs present in db's collection  /* whole New */
const getBlogs = async (req, res) => {
  try {
    const blog = await Blogs.find();
    return res.status(messages.status.statusSuccess).json(blog);
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(messages.status.statusSuccess).json(user);
  } catch (error) {
    console.log(error);
  }
};

const filterOnPublished = async (req, res) => {
  try {
    const { page, limit } = req.body;
    const blog = await Blogs.find({ isPublished: true })
      .skip(page * limit - limit)
      .limit(limit);
    return res.status(messages.status.statusSuccess).json(blog);
  } catch (error) {
    console.log(error);
  }
};

const filterOnUnPublished = async (req, res) => {
  try {
    const { page, limit } = req.body;
    const blog = await Blogs.find({ isPublished: false })
      .skip(page * limit - limit)
      .limit(limit);
    return res.status(messages.status.statusSuccess).json(blog);
  } catch (error) {
    console.log(error);
  }
};

const filterOnDates = async (req, res) => {
  try {
    const { startDate, endDate, page, limit } = req.body;
    const blog = await Blogs.find({
      $or: [
        { publishedDate: { $gte: startDate.toString() } },
        { publishedDate: { $lte: endDate.toString() } },
      ],
    })
      .skip(page * limit - limit)
      .limit(limit);

    return res.status(messages.status.statusSuccess).json(blog);
  } catch (error) {
    console.log(error);
  }
};

const filterOnLikes = async (req, res) => {
  try {
    const user = await Blogs.aggregate([
      {
        $project: {
          title: 1,
          description: 1,
          coverImage: 1,
          sUsername: 1,
          numberOfLikes: { $size: "$likeButton" },
        },
      },
      { $sort: { numberOfLikes: -1 } },
    ]);

    return res.status(messages.status.statusSuccess).json(user);
  } catch (error) {
    console.log(error);
  }
};

const search = async (req, res) => {
  try {
    const { sUsername, title, description } = req.body;

    console.log(title, description, sUsername);
    const blog = await Blogs.findOne({ sUsername });
    const blog1 = await Blogs.find({ title });
    const blog2 = await Blogs.find({ description });

    if (blog1) {
      console.log(blog1);
      if (title === blog1.title) {
        const user = await Blogs.aggregate([
          { $match: { title: blog1.title.toString() } },
          {
            $project: { title: 1, description: 1, coverImage: 1, sUsername: 1 },
          },
        ]);
        return res.status(messages.status.statusSuccess).json(user);
      }
    }

    if (blog) {
      console.log("hello blog1");
      if (sUsername === blog.sUsername.toString()) {
        const user = await Blogs.aggregate([
          { $match: { sUsername: blog.sUsername.toString() } },
          { $project: { title: 1, description: 1, coverImage: 1 } },
        ]);
        return res.status(messages.status.statusSuccess).json(user);
      }
    }
    if (blog2) {
      console.log("hello blog2");
      if (description === blog2.description) {
        const user = await Blogs.aggregate([
          { $match: { description: blog2.description } },
          {
            $project: { title: 1, description: 1, coverImage: 1, sUsername: 1 },
          },
        ]);
        return res.status(messages.status.statusSuccess).json(user);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getBlogs,
  getUsers,
  filterOnPublished,
  filterOnUnPublished,
  filterOnDates,
  filterOnLikes,
  search,
};
