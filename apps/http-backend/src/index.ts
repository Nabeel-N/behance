import express from 'express';
import cors from 'cors';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prisma, User } from '@repo/db';
import { middleware } from './middleware';

const app = express();
const port = 4000;

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SUPER_SECRET_KEY";
if (JWT_SECRET === "YOUR_SUPER_SECRET_KEY") {
  console.warn("WARNING: Using default JWT_SECRET. Set a real secret in your .env file!");
}

app.use(cors());
app.use(express.json());

async function validatesignup(name: string, email: string, password: string): Promise<User | null> {
  try {
    if (!password || !email) {
      return null;
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedpassword,
      }
    });

    return user;

  } catch (e) {
    console.error(e + " - this is an error from validatesignup");
    return null;
  }
}

async function validatesignin(email: string, password: string): Promise<User | null> {
  if (!email || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!user) {
    return null;
  }

  const comparepassword = await bcrypt.compare(password, user.password);

  if (!comparepassword) {
    return null;
  }

  return user;
}

app.post('/api/signup', async (req, res) => {
  try {
    const name = req.body?.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = await validatesignup(name, email, password);

    if (!user) {
      return res.status(400).json({
        message: "Signup failed. Email may already be in use or data is missing.",
      });
    }
    else {
      console.log("Signup success:", { name, email, id: user.id });
      return res.status(200).json({
        message: "Signup successful",
      });
    }
  } catch (e) {
    console.error(e + " - error from the signup route");
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/api/signin', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await validatesignin(email, password);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    } else {
      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.status(200).json({
        message: "Sign in successful",
        token: token
      });
    }
  } catch (e) {
    console.error(e + " - error from signin route");
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/projects", middleware, async (req, res) => {
  const userId = req.user?.id
  if (!userId) {
    res.status(401).json({
      message: "User is not verified"
    })
  }
  const image = req.body.imageurl;
  const title = req.body.title;

});

app.listen(port, () => {
  console.log(`🚀 http-backend listening at http://localhost:${port}`);
});
