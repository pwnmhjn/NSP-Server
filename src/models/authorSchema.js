import mongoose, { Schema } from 'mongoose';

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    genre: [
      {
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
    ],
    popularity: {
      type: String,
      default: '25-35',
    },
  },
  { timestamps: true }
);

export const Author = mongoose.model('Author', authorSchema);
