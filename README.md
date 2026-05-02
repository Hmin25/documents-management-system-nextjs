# Document Management System - Frontend Setup Guide

A Next.js frontend for a Document Management System with folder navigation, file uploads, search, sorting, and file previews.

---

## 📋 Prerequisites

Before you begin, install the following:

### 1. **Node.js & npm/yarn**

- Download and install [Node.js 18+](https://nodejs.org/) (LTS version recommended)
- This includes `npm` by default. To use `yarn` instead, run: `npm install -g yarn`

### 2. **Code Editor / IDE**

Choose one:

- **VS Code** (Recommended) - Download from [code.visualstudio.com](https://code.visualstudio.com/)
- **Cursor** (AI-enhanced) - Download from [cursor.com](https://cursor.com/)
- **Any editor of your choice** (JetBrains WebStorm, Sublime, etc.)

### 3. **Backend Server Running**

- The backend API server must be running on `http://localhost:3000`
- Setup instructions: See the backend project's README (`../documents-management-system-nodejs`)

---

## 🚀 Getting Started

### Step 1: Navigate to the Frontend Folder

Open your terminal and go to the `dms/` folder:

```bash
cd documents-management-system-nextjs/dms
```

**Important:** All commands below must be run from the `dms/` folder.

### Step 2: Install Dependencies

```bash
yarn install
# or
npm install
```

This installs all required packages (Next.js, React, Tailwind CSS, etc.).

### Step 3: Start the Development Server

```bash
yarn dev
# or
npm run dev
```

You should see output like:

```
▲ Next.js x.x.x
...
✓ Ready in 1000ms
Local:        http://localhost:3001
```

### Step 4: Open in Browser

Open your browser and navigate to:

```
http://localhost:3001
```

You should see the **Document Management System** interface.

---

## 🎯 What You Can Do in the UI

Once the application is loaded, you can:

### **Folder Navigation**

- Browse folders in a hierarchical structure
- Click on folder names to open them
- Use the breadcrumb at the top to navigate back to parent folders

### **Create Folders**

- Click the **"Create Folder"** button
- Enter a folder name
- The new folder appears immediately in the list

### **Upload Files**

- Click **"Upload"** button
- Select one or multiple `.pdf` or `.txt` files
- Files are uploaded and appear in the current folder
- Progress indicator shows upload status

### **Search & Filter**

- Use the **search bar** at the top
- Type a file or folder name to filter results
- Search updates in real-time as you type

### **Sort & Paginate**

- Click column headers to sort by name, size, or date
- Use pagination controls at the bottom to navigate pages
- Select items per page from the dropdown

### **Rename Files & Folders**

- Right-click on a file/folder or use the **menu icon** (⋮)
- Select **"Rename"**
- Enter a new name and confirm

### **Replace Files**

- Right-click on a file or use the **menu icon**
- Select **"Replace"**
- Choose a new file to replace the old one
- The file is updated immediately

### **Preview Files**

- Click on a `.pdf` or `.txt` file
- A preview modal opens showing the file content
- Close the preview by clicking outside or the close button

---

## 🛑 Stopping the Server

When you're done developing:

- In the terminal where `yarn dev` is running, press `Ctrl+C` (Mac/Linux) or `Ctrl+C` (Windows)

---

## 🔄 Restarting the Server

Simply run:

```bash
yarn dev
# or
npm run dev
```

The frontend has hot-reload enabled, so changes you make to the code will automatically refresh in the browser.

---

## 🏗️ Project Structure

```
dms/
├── app/                         # Next.js app directory
│   ├── layout.tsx               # Global layout
│   └── page.tsx                 # Main page
├── components/                  # React components
│   ├── Table.tsx
│   ├── SearchBar.tsx
│   ├── UploadButton.tsx
│   ├── CreateFolderButton.tsx
│   ├── EditModal.tsx
│   └── ...
├── hooks/                       # Custom React hooks
│   └── useItems.ts              # Data fetching
├── services/                    # API communication
│   ├── api.ts                   # Base API client
│   ├── items.api.ts             # Folder operations
│   └── files.api.ts             # File operations
├── public/                      # Static assets
├── package.json
└── tsconfig.json
```

---

You're all set! Start exploring the Document Management System.
For backend setup and database configuration, refer to the backend project's README.