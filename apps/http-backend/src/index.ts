import express from "express";
import cors from "cors";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma, Project, User } from "@repo/db";
import { middleware } from "./middleware";

const app = express();
const port = 4000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SUPER_SECRET_KEY";
if (JWT_SECRET === "YOUR_SUPER_SECRET_KEY") {
  console.warn("WARNING: Using default JWT_SECRET. need set a real .env file!");
}

app.use(cors());
app.use(express.json());

async function validatesignup(
  name: string,
  email: string,
  password: string
): Promise<User | null> {
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
      },
    });

    return user;
  } catch (e) {
    console.error(e + " - this is an error from validatesignup");
    return null;
  }
}

async function validatesignin(
  email: string,
  password: string
): Promise<User | null> {
  if (!email || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
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

app.post("/api/signup", async (req, res) => {
  try {
    const name = req.body?.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = await validatesignup(name, email, password);

    if (!user) {
      return res.status(400).json({
        message:
          "Signup failed. Email may already be in use or data is missing.",
      });
    } else {
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

app.post("/api/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await validatesignin(email, password);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    } else {
      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = jwt.sign(payload, JWT_SECRET, {});

      return res.status(200).json({
        message: "Sign in successful",
        token: token,
      });
    }
  } catch (e) {
    console.error(e + " - error from signin route");
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/projects", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({
      message: "User is not verified",
    });
  }
  const image = req.body.image;
  const title = req.body.title;
  const description = req.body?.description;

  if (!image || !title) {
    return res.status(400).json({
      message: "image or title is missing or invalid ",
    });
  }
  try {
    const newproject = await prisma.project.create({
      data: {
        image: image,
        title: title,
        userId: userId,
        published: true,
        description: description,
      },
    });

    return res.status(201).json(newproject);
  } catch (e) {
    console.error("Error creating project:", e);
    return res.status(500).json({
      message: "An error occurred while creating the project.",
    });
  }
});

app.get("/api/projects", async (req, res) => {
  let currentUserId = null;
  const authHeader = req.headers.authorization;

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
          id: number;
        };
        currentUserId = decoded.id;
      }
    } catch (e) {}
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
        likes: {
          where: { userId: currentUserId || -1 },
          select: { userId: true },
        },
      },
    });

    const projectsWithLikeStatus = projects.map((project) => ({
      ...project,
      isLiked: project.likes.length > 0,
    }));

    return res.status(200).json(projectsWithLikeStatus);
  } catch (e) {
    console.error("Error fetching projects:", e);
    return res.status(500).json({ message: "Error fetching projects" });
  }
});

app.get("/api/projects/mine", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return res.status(200).json(projects);
  } catch (e) {
    console.error("Error fetching user projects:", e);
    return res.status(500).json({ message: "Error fetching user projects" });
  }
});
app.get("/api/projects/saved", middleware, async (req, res) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }

  try {
    const userWithSavedProjects = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        savedprojects: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePhoto: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
    });

    if (!userWithSavedProjects) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userWithSavedProjects.savedprojects);
  } catch (error) {
    console.error("Error fetching saved projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/api/projects/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid project id" });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.status(200).json(project);
  } catch (e) {
    console.error("Error fetching project:", e);
    return res.status(500).json({ message: "Error fetching project" });
  }
});

app.put("/api/projects/:id", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }

  const id = Number(req.params.id);
  if (Number.isNaN(id))
    return res.status(400).json({ message: "Invalid project id" });

  const { title, image } = req.body;
  if (
    (!title || typeof title !== "string") &&
    (!image || typeof image !== "string")
  ) {
    return res
      .status(400)
      .json({ message: "Provide at least a title or an image to update" });
  }

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this project" });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(image ? { image } : {}),
      },
    });

    return res.status(200).json(updated);
  } catch (e) {
    console.error("Error updating project:", e);
    return res.status(500).json({ message: "Error updating project" });
  }
});

app.delete("/api/projects/:id", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }

  const id = Number(req.params.id);
  if (Number.isNaN(id))
    return res.status(400).json({ message: "Invalid project id" });

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this project" });
    }

    await prisma.project.delete({ where: { id } });
    return res.status(200).json({ message: "Project deleted" });
  } catch (e) {
    console.error("Error deleting project:", e);
    return res.status(500).json({ message: "Error deleting project" });
  }
});

app.post("/api/projects/:id/like", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  const projectId = parseInt(req.params.id!);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (isNaN(projectId)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_projectId: {
            userId: userId,
            projectId: projectId,
          },
        },
      });
      return res.json({ liked: false, message: "Unliked" });
    } else {
      await prisma.like.create({
        data: {
          userId: userId,
          projectId: projectId,
        },
      });
      return res.json({ liked: true, message: "Liked" });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/api/uploadimage", middleware, async (req, res) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }

  const profilePhoto = req.body?.profilePhoto;

  if (!profilePhoto) {
    return res.status(400).json({
      message: "Profile photo not provided",
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profilePhoto: profilePhoto,
      },
    });

    return res.status(200).json({
      message: "Profile photo uploaded successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        profilePhoto: updatedUser.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return res.status(500).json({
      message: "Failed to upload profile photo",
    });
  }
});

app.get("/api/me", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (e) {
    console.error("Error fetching user details:", e);
    return res.status(500).json({ message: "Error fetching user details" });
  }
});

app.put("/api/editprofile", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }
  try {
    const name = req.body?.name;
    const email = req.body.email;
    const profilePhoto = req.body.profilePhoto;

    if (!name && !email && !profilePhoto) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const updatedprofile = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        email: email,
        profilePhoto: profilePhoto,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
      },
    });
    return res.status(201).json(updatedprofile);
  } catch (e: any) {
    if (e.code === "P2002") {
      return res.status(409).json({ message: "This email is already in use" });
    }
    console.error("Error in editprofile:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/projects/:id/save", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }

  const projectId = parseInt(req.params.id!);
  if (isNaN(projectId)) {
    return res.status(400).json({ message: "Invalid Project ID" });
  }

  try {
    const existingSave = await prisma.project.findFirst({
      where: {
        id: projectId,
        savedby: {
          some: { id: userId },
        },
      },
    });

    if (existingSave) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          savedby: {
            disconnect: { id: userId },
          },
        },
      });
      return res.json({
        message: "Project removed from saved",
        isSaved: false,
      });
    } else {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          savedby: {
            connect: { id: userId },
          },
        },
      });
      return res.json({ message: "Project saved successfully", isSaved: true });
    }
  } catch (error) {
    console.error("Save toggle error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/projects/:id/comments", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }
  const projectId = parseInt(req.params.id!);
  if (isNaN(projectId)) {
    return res.status(400).json({ message: "Invalid Project ID" });
  }

  const text = req.body.text;
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Comment text cannot be empty" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        text: text,
        projectId: projectId,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
          },
        },
      },
    });

    return res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/projects/:id/comments", middleware, async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User is not verified" });
  }
  const projectId = parseInt(req.params.id!);
  if (isNaN(projectId)) {
    return res.status(400).json({ message: "Invalid Project ID" });
  }
  try {
    const comments = await prisma.comment.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 http-backend listening at http://localhost:${port}`);
});
