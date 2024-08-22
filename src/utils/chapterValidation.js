const chapterValidation = (arr, title, chapterNumber) => {
  for (const chapter of arr) {
    if (
      (title === chapter.title && chapterNumber === chapter.chapterNumber) ||
      chapter.title === title
    ) {
      return true;
    }

    if (title !== chapter.title && chapterNumber === chapter.chapterNumber) {
      return true;
    }
  }
};

export { chapterValidation };
