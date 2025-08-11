# 🧹 Vacuum Cleaner Path Planning (3D)

A visually stunning **3D interactive simulation** of a vacuum cleaner navigating a room, avoiding obstacles, and cleaning dirt — built with **React**, **Three.js**, and **React Three Fiber**.

This project allows you to **set start points, place dirt, add various obstacles (TV, Bed, Couch, Wardrobe, Tables & Chairs)**, and watch the vacuum cleaner autonomously navigate the space.

---

## ✨ Features

- 🚀 **Real-time 3D Simulation** using Three.js + React Three Fiber
- 🎨 **Animated gradient background** with glassmorphism UI
- 🛋 **Place obstacles** (TV, Bed, Couch, Wardrobe, Tables & Chairs)
- 🗑 **Clear all obstacles** with one click
- 🧠 **Pathfinding logic** for optimal cleaning
- 🖱 **Interactive controls** with smooth animations
- 🌟 **Stylish custom dropdowns** and glowing neon buttons

---

## 🖼 Demo

*(Add a GIF or screenshot of your project here)*

---

## 📦 Tech Stack

- **React** – Frontend UI
- **Three.js** + **React Three Fiber** – 3D rendering
- **JavaScript (ES6+)**
- **CSS3** – Glassmorphism, neon effects, animations

---

## 📂 Folder Structure

vacuum-cleaner/
│
├── public/ # Public assets (models, textures, favicon, etc.)
│ ├── models/ # 3D OBJ & MTL files for obstacles
│ └── index.html
│
├── src/
│ ├── components/
│ │ ├── Controls.jsx # UI control panel
│ │ ├── Vacuum.jsx # Vacuum cleaner 3D model
│ │ ├── Room.jsx # Room environment
│ │ ├── Obstacles/ # Individual obstacle components
│ │
│ ├── App.jsx # Main app
│ ├── App.css # Styling
│ ├── index.js # Entry point
│
└── package.json


---

## ⚙️ Installation & Setup

1️⃣ **Clone the repository**
git clone https://github.com/yourusername/vacuum-cleaner.git
cd vacuum-cleaner

2️⃣ Install dependencies
npm install

3️⃣ Start the development server
npm start

http://localhost:3000

🎮 How to Use
Set Start – Choose where the vacuum begins.

Add Dirt – Place dirt tiles to be cleaned.

Add Obstacle – Select from the dropdown to place items like TV, Bed, etc.

Clear Obstacles – Remove all placed objects.

Start Cleaning – Watch the vacuum clean autonomously.

🚀 Future Improvements
✅ More furniture options

✅ Improved pathfinding with AI

✅ Save & load room layouts

✅ Mobile-friendly touch controls