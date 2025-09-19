const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// Hash password
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare password with hash
async function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash);
}

// Generate JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verify JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Auth middleware
function authMiddleware(roleRequired) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Converte ambos para maiúsculas para comparação case-insensitive
    if (roleRequired && user.role.toUpperCase() !== roleRequired.toUpperCase()) {
      return res.status(403).json({ error: 'Permissão negada' });
    }

    req.user = user;
    next();
  };
}

module.exports = {
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
  authMiddleware
};
