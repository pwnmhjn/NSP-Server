import mongoose, { Schema } from 'mongoose';

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    introduction: {
      type: String,
    },
    titleExtension: {
      type: String,
    },
    blurb: {
      type: String,
      required: true,
    },

    bookImage: {
      type: String,
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    genre: {
      type: String,
      enum: [
        'Fiction',
        'Non-Fiction',
        'Science Fiction',
        'Fantasy',
        'Romance',
        'Thriller',
        'Mystery',
        'Biography',
      ],
      default: 'Fiction',
    },
    rating: {
      type: Number,
      default: 2,
    },
    chapters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const Book = mongoose.model('Book', bookSchema);
