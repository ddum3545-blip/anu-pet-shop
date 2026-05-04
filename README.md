# Anu Pet Shop

This is a Next.js application for Anu Pet Shop.

## Deployment Instructions

### 1. Push to GitHub

Since `git` is required to push to GitHub, please run the following commands in your local terminal:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - prepared for deployment"

# Create a new repository on GitHub and then run:
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### 2. Deploy to Netlify

This project is already configured for Netlify via `netlify.toml`.

1. Go to [Netlify](https://www.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and choose this repository.
4. Netlify will automatically detect the settings from `netlify.toml`.
5. **Crucial:** You must add the following Environment Variables in the Netlify dashboard (**Site settings** > **Environment variables**):

| Variable | Value |
| :--- | :--- |
| `MONGODB_URI` | `mongodb://ddum3545_db_user:lA7EGUHxFIRiUM10@ac-qwhag2a-shard-00-00.ji0b33s.mongodb.net:27017/AnuPetShop?ssl=true&authSource=admin&retryWrites=true` |
| `CLOUDINARY_CLOUD_NAME` | `dvyuplyck` |
| `CLOUDINARY_API_KEY` | `714835755729434` |
| `CLOUDINARY_API_SECRET` | `1iopwxlWnXQkZS5i7eJFMmKpyMY` |

6. Click **Deploy site**.

## Local Development

```bash
npm install
npm run dev
```
