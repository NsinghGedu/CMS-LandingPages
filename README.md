# Custom CMS with Next.js, MongoDB, and Drag-and-Drop Editor

A complete, full-stack CMS application built with Next.js, MongoDB, and a powerful drag-and-drop page editor.

## Features

- ✅ **User Authentication** - Separate admin and user login
- ✅ **Drag-and-Drop Editor** - Build pages visually without code
- ✅ **Rich Components**
  - Headings (H1, H2, H3)
  - Rich Text / Paragraphs
  - Images
  - Videos
  - YouTube Videos (by video ID)
  - Editable Pods (text, heading, image)
  - Split Layouts
- ✅ **Live Preview** - See your changes in real-time
- ✅ **Publish System** - Draft and publish pages
- ✅ **Dashboard** - Manage all your pages in one place
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **MongoDB Integration** - Secure data storage

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Authentication:** JWT with bcryptjs
- **UI Components:** Shadcn/ui

## Getting Started

### 1. Clone and Install

\`\`\`bash
npm install
\`\`\`

### 2. Setup MongoDB

1. Create a MongoDB cluster at [mongodb.com](https://mongodb.com)
2. Get your connection string
3. Create `.env.local` file in the root directory:

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

### First Time Setup

1. Visit the landing page
2. Click "Sign Up" to create an account
3. Fill in your details (name, email, password)
4. You'll be redirected to the dashboard

### Creating a Page

1. From the dashboard, click "Create New Page"
2. Enter a title and description
3. Click "Create Page"
4. Click "Edit" on your page to open the editor

### Building with the Editor

1. **Add Components:** Use the left sidebar to add components
2. **Edit Components:** Hover over any component and click "Edit"
3. **Delete Components:** Hover over any component and click "Delete"
4. **Save:** Click "Save" to save your changes
5. **Preview:** Click "Preview" to see how your page looks
6. **Publish:** Click "Publish" to make your page live

### Component Guide

#### Heading
- Choose heading level (H1, H2, H3)
- Enter your heading text

#### Text
- Rich text paragraph content
- Supports multi-line text

#### Image
- Paste image URL
- Add alt text for accessibility

#### Video
- Paste video URL (MP4, WebM, etc.)
- Displays as an embedded video player

#### YouTube
- Paste YouTube video ID (the part after v= in YouTube URLs)
- Example: `dQw4w9WgXcQ` from https://www.youtube.com/watch?v=dQw4w9WgXcQ

#### Pod
- Title, heading, description, and image
- Perfect for showcasing features or products

#### Split
- Two-column layout
- Add content to left and right columns

### Publishing Your Page

1. Make sure your page looks good in preview
2. Click "Publish" button in the editor
3. Your page will be marked as published
4. Published pages are accessible via the preview URL

## Admin Features

Admin users have the same capabilities as regular users. The role is assigned during registration. To create an admin account, modify the role in the registration endpoint (currently all new registrations are users by default).

## File Structure

\`\`\`
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.jsx
│   ├── dashboard/
│   │   ├── pages/
│   │   ├── templates/
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── editor/
│   │   └── [id]/
│   │       └── page.jsx
│   ├── preview/
│   │   └── [id]/
│   │       └── page.jsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── pages/
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── editable-pod.jsx
│   ├── editor-toolbar.jsx
│   ├── page-editor.jsx
│   └── page-renderer.jsx
├── lib/
│   ├── auth.js
│   ├── mongodb.js
│   └── storage.js
└── middleware.js
\`\`\`

## Environment Variables

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing

## Deployment

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Follow the prompts and add your environment variables in the Vercel dashboard.

### Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable HTTPS
- [ ] Set up proper error monitoring
- [ ] Add rate limiting to API routes
- [ ] Regular database backups

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

### Pages

- `GET /api/pages` - Get user's pages
- `POST /api/pages` - Create new page
- `GET /api/pages/[id]` - Get page details
- `PUT /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page
- `POST /api/pages/[id]/publish` - Publish page
- `GET /api/pages/published` - Get all published pages

## Troubleshooting

### MongoDB Connection Failed
- Check your connection string in `.env.local`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database name matches

### Pages Not Saving
- Check browser console for errors
- Ensure you're logged in with a valid token
- Verify MongoDB is running

### Preview Not Working
- Make sure page components are saved
- Check if page is published for public view

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
