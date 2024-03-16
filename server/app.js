const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const http = require("http").Server(app);
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB!");

    const migrationTracker = mongoose.model(
      "Migration_Tracker",
      new mongoose.Schema({
        migrationName: String,
        executedAt: Date,
      })
    );

    migrationTracker.createIndexes({ migrationName: 1 }, { unique: true });

    // Collect migration files in sorted order
    const migrationsPath = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".js"))
      .sort((a, b) => a.localeCompare(b));

    // Execute pending migrations sequentially using async/await
    for (const file of migrationFiles) {
      console.log(`Executing migration ${file}`);

      const migrationName = path.basename(file, ".js");

      try {
        const existingMigration = await migrationTracker.findOne({
          migrationName,
        });
        if (!existingMigration) {
          const migration = require(`./migrations/${file}`);
          await migration();
          console.log(`Migration ${file} executed successfully`);
          await new migrationTracker({ migrationName }).save();
        } else {
          console.log(`Migration ${file} already executed, skipping`);
        }
      } catch (error) {
        console.error(`Error executing migration ${file}:`, error);
      }
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const Role = require("./models/role");
const Faculty = require("./models/faculty");
const User = require("./models/user");
const Contribution = require("./models/contribution");
const Event = require("./models/event");
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

//faculty
require("./routes/faculty.routes") (app);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Greenwich Magazine." });
});

http.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
