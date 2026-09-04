# Login App — React + Express + MySQL + S3

A complete signup/login system:
- **Frontend**: React (Vite)
- **Backend**: Express (Node.js)
- **Database**: MySQL (stores user accounts)
- **File storage**: Amazon S3 (stores profile pictures)

## How it fits together

```
React (port 3000)  --->  Express API (port 5000)  --->  MySQL (user data)
                                    |
                                    ---> S3 (profile picture files)
```

MySQL never stores the actual image — only the S3 URL as a text field.
That's the standard real-world pattern: databases store *pointers* to files, not the files themselves.

---

## 1. Set up MySQL

Make sure MySQL is installed and running locally, then:

```bash
cd backend
mysql -u root -p < schema.sql
```

This creates the `login_app` database and the `users` table.

## 2. Set up your S3 bucket

1. Create a bucket in the AWS Console (e.g. `yourname-profile-pics`), region `ap-south-1`.
2. Under **Permissions**, allow public read for objects (since profile pictures need to load in the browser), OR keep it private and later switch to signed URLs — start with public read for simplicity while learning.
3. Create a **new** IAM access key (don't reuse any key you've shared in chat or screenshots) with S3 permissions.

## 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your real MySQL password, JWT secret (any long random string), and AWS credentials + bucket name.

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

## 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## 5. Try it

1. Open `http://localhost:3000` → redirects to `/signup`
2. Create an account, optionally upload a profile picture
3. You'll land on the dashboard showing your name, email, and picture (loaded straight from S3)
4. Log out and log back in to confirm persistence

---

## What to learn from this project

| File | What it teaches |
|---|---|
| `backend/config/db.js` | MySQL connection pooling |
| `backend/config/s3.js` | Uploading files to S3 with the AWS SDK |
| `backend/routes/auth.js` | Password hashing (bcrypt), JWT issuing |
| `backend/middleware/auth.js` | Protecting routes with JWT verification |
| `frontend/src/pages/Signup.jsx` | Handling file input + FormData in React |
| `frontend/src/pages/Dashboard.jsx` | Fetching protected data with a stored token |

## Common issues

- **CORS error in browser console** → make sure backend is running on port 5000 and `cors()` is enabled (it is, by default, in `server.js`).
- **S3 upload fails / Access Denied** → double check your IAM user's policy includes `s3:PutObject` on your bucket, and that the bucket name/region in `.env` match exactly.
- **"Invalid or expired token"** → your `JWT_SECRET` in `.env` must stay the same across restarts, or old tokens become invalid.
