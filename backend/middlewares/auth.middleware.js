import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(400).json({
      message: 'Token is not provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};
// tạo 1 mdw mới lấy token giống 456789 cũng vất vào try ca để author
// refesh tokens
