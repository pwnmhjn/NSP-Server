import { ErrorAPI } from '../utils/ErrorAPI.js';
import { AsyncWrap } from '../utils/AsyncWrap.js';
import { ResponseAPI } from '../utils/ResponseAPI.js';
import { Author } from '../models/authorSchema.js';
import { Book } from '../models/bookSchema.js';
import { Chapter } from '../models/chapterSchema.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { chapterValidation } from '../utils/chapterValidation.js';

const addAuthor = AsyncWrap(async (req, res) => {
  //get all info of author
  const { name, genre, popularity } = req.body;

  //validate
  if ([name, genre, popularity].some((field) => field?.trim() === '')) {
    throw new ErrorAPI(400, 'All Field are required');
  }
  const existingAuthor = await Author.findOne({ name });

  if (existingAuthor) {
    throw new ErrorAPI(400, 'Author with This name Already Exist');
  }

  //upload avatar on Cloudinary
  const avatarLocalPath = req.file.path;

  if (!avatarLocalPath) {
    throw new ErrorAPI(400, 'Author avatar localPath does not Exist');
  }

  const avatarImage = await uploadOnCloudinary(avatarLocalPath);

  if (!avatarImage) {
    throw new ErrorAPI(400, 'Author avatar cloudinary path does not exist');
  }

  //upload on database

  const author = await Author.create({
    name: name,
    avatar: avatarImage.url,
    genre: genre,
    popularity: popularity,
  });

  if (!author) {
    throw new ErrorAPI(400, 'Something went Wrong while uploading on database');
  }

  res
    .status(200)
    .json(new ResponseAPI(200, author, 'Author Created SuccessFully'));
});

const addChapter = AsyncWrap(async (req, res) => {
  //get chapter data

  const { title, ratings, bookName, chapterNumber, content } = req.body;
  //check if all data exist of not
  if (
    [title, ratings, bookName, chapterNumber, content].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ErrorAPI(400, 'Enter All Fields');
  }

  // check if chapter with this bookName and number exist in the database or not
  const chapters = await Chapter.find();

  const value = chapterValidation(chapters, title, chapterNumber);

  if (value) {
    throw new ErrorAPI(
      400,
      'this Chapter with same title and chapter no. exists'
    );
  }

  // upload in database

  const dbChapter = await Chapter.create({
    title: title,
    ratings: ratings,
    bookName: bookName,
    chapterNumber: chapterNumber,
    content: content,
  });

  if (!dbChapter) {
    throw new ErrorAPI(400, 'Error while uploading chapter in the mongodb');
  }

  res
    .status(200)
    .json(new ResponseAPI(200, dbChapter, 'Chapter Create Successfully'));
});

const addBook = AsyncWrap(async (req, res) => {
  //received data form client
  const { title, titleExtension, blurb, introduction, ratings, author, genre } =
    req.body;

  //check if required data is there on not
  if (
    [title, titleExtension, blurb, introduction, ratings, author, genre].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ErrorAPI(400, 'All Fields are Required');
  }

  // check if book with this name exist or not
  const ExistingBook = await Book.findOne({
    $and: [{ title }, { titleExtension }],
  });

  if (ExistingBook) {
    throw new ErrorAPI(400, 'This Book already Exists');
  }

  //get multer image Path

  const bookImagePath = req.file.path;

  if (!bookImagePath) {
    throw new ErrorAPI(400, 'Image is required multer');
  }

  //upload image on cloudinary and get url
  const bookImage = await uploadOnCloudinary(bookImagePath);
  if (!bookImage) {
    throw new ErrorAPI(400, 'Image is required from Cloudinary');
  }

  //find all chapter of this book form Chapter Collection of database
  const chapters = await Chapter.find({ bookName: title });
  if (!chapters) {
    throw new ErrorAPI(400, 'There is no chapters for this book');
  }

  //Find Author of this book by name in the author collection of database
  const bookAuthor = await Author.findOne({ name: author });
  if (!bookAuthor) {
    throw new ErrorAPI(400, 'These is no Author with This name in Database');
  }

  //insert book in Database

  const book = await Book.create({
    title: title,
    titleExtension: titleExtension,
    introduction: introduction,
    bookImage: bookImage.url,
    author: bookAuthor,
    blurb: blurb,
    genre: genre,
    rating: ratings,
    chapters: chapters,
  });

  // bookAuthor.books.push(book);
  // await bookAuthor.save();

  if (!book) {
    throw new ErrorAPI(400, 'No Book Available In Database');
  }

  //send response to frontend

  res.status(200).json(new ResponseAPI(200, book, 'Book Created Successfully'));
});

export { addAuthor, addBook, addChapter };
