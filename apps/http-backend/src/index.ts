import express from 'express';
import cors from 'cors';
import * as bcrypt from 'bcrypt';
import { prisma } from '@repo/db';
const app = express();
const port = 4000;


app.use(cors());
app.use(express.json());

async function validatesignup(name: string, email: string, password: string): Promise<boolean | string> {
  try {
    if (!password || !email) {
      return false;
    }
    async function Hahspassword() {
      const hash = await bcrypt.hash(password, 10);
      return hash;
    }
    const hashedpassword = await Hahspassword();

    const createuser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedpassword,
      }
    })
    if (!createuser) {
      return JSON.stringify({
        message: "Signup db error"
      })
    }
  } catch (e) {
    console.error(e + "this is a error from validatesignup")
  }
  return true;
}


app.post('/api/signup', async (req, res) => {
  try {
    const name = req.body?.name;
    const email = req.body.email;
    const password = req.body.password;

    const signup = await validatesignup(name, email, password);

    if (!signup) {
      return res.status(400).json({
        message: "Password or email is not present",
      });
    }
    else {
      console.log("Signup success:", { name, email });
      return res.status(200).json({
        message: "Signup successful",
      });
    }
  } catch (e) {
    console.error(e + "error from the signup");
  }
});

async function validatesignin(email: string, password: string): Promise<boolean | string> {
  if (!email || !password) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })
  if (!user) {
    return JSON.stringify({
      message: "this email is not valid"
    })
  }
  const comparepassword = await bcrypt.compare(password, user.password)
  if (!comparepassword) {
    return JSON.stringify({
      message: "password is incorrect"
    })
  }
  const signindb = await prisma.user.create({
    data: {
      email,
      password
    }
  })
  if (!signindb) {
    return JSON.stringify({
      message: "signin db error"
    })
  }
  return true;

}

app.post('/api/signin', async (req, res) => {
  const email = req.body.email
  const password = req.body.password;
  const signin = await validatesignin(email, password);
  if (!signin) {
    res.status(400).json({
      message: "email or  password is not correct"
    })
  }
});

app.post("/projects", async (req, res) => {

})



app.listen(port, () => {
  console.log(`🚀 http-backend listening at http://localhost:${port}`);
});
