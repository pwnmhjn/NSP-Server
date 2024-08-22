// export const AsyncWrap = async (fn) => {
//   try {
//     return await fn(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// };

const AsyncWrap = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { AsyncWrap };
