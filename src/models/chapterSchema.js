import mongoose, { Schema } from 'mongoose';

const chapterSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    ratings: {
      type: Number,
      default: 2,
    },
    bookName: {
      type: String,
      required: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Chapter = mongoose.model('Chapter', chapterSchema);
