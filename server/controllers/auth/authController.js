const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { getDatabase } = require('../../config/database');

class AuthController {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'somna_ai_jwt_secret_key_2024';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          error: 'Missing required fields: name, email, password'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }

      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long'
        });
      }

      const db = getDatabase();

      // Check if user already exists
      const existingUser = await db.collection(User.getCollectionName())
        .findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return res.status(409).json({
          error: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash
      });

      // Save to database
      await db.collection(User.getCollectionName()).insertOne(user.toDict());

      // Generate JWT token
      const token = this._generateToken(user);

      res.status(201).json({
        message: 'User created successfully',
        user: user.toResponse(),
        access_token: token
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Failed to create user',
        details: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing required fields: email, password'
        });
      }

      const db = getDatabase();

      // Find user by email
      const userData = await db.collection(User.getCollectionName())
        .findOne({ email: email.toLowerCase() });

      if (!userData) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!userData.is_active) {
        return res.status(401).json({
          error: 'Account is deactivated'
        });
      }

      // Create user object
      const user = new User(userData);

      // Update last login
      await db.collection(User.getCollectionName()).updateOne(
        { id: user.id },
        { 
          $set: { 
            last_login: new Date(),
            updated_at: new Date()
          }
        }
      );

      // Generate JWT token
      const token = this._generateToken(user);

      res.json({
        message: 'Login successful',
        user: user.toResponse(),
        access_token: token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Failed to login',
        details: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = req.user;
      res.json({
        user: user.toResponse()
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to get profile',
        details: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: 'Name is required'
        });
      }

      const db = getDatabase();

      // Update user
      await db.collection(User.getCollectionName()).updateOne(
        { id: userId },
        {
          $set: {
            name,
            updated_at: new Date()
          }
        }
      );

      // Get updated user
      const userData = await db.collection(User.getCollectionName())
        .findOne({ id: userId });

      const user = new User(userData);

      res.json({
        message: 'Profile updated successfully',
        user: user.toResponse()
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: 'Failed to update profile',
        details: error.message
      });
    }
  }

  _generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      const db = getDatabase();
      const userData = await db.collection(User.getCollectionName())
        .findOne({ id: decoded.id });

      if (!userData || !userData.is_active) {
        return null;
      }

      return new User(userData);
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
}

module.exports = AuthController;