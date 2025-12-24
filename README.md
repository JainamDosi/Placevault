# 🏛️ PlaceVault

**PlaceVault** is a high-octane, community-driven platform designed to streamline your career placement journey. Built with a **Brutalist Design Philosophy**, it cuts through the noise to provide students and job seekers with battle-tested resources, AI-powered guidance, and real-world success stories.

---

## ⚡ Key Features

- **📂 Prep Vault**: A curated repository of HR scripts, Data Structure roadmaps, and company trackers. Access verified PDFs, Sheets, and Docs.
- **🤖 CareerBot**: An AI Career Assistant powered by **Google Gemini**, helping you refine your strategy and answer tricky interview questions in real-time.
- **🏆 Hall of Fame**: Real stories from real seniors. Learn from the experiences (and packages) of those who’ve successfully navigated the placement maze.
- **🤝 Community Contribution**: A dedicated space for the placement cell and students to contribute new resources and keep the vault updated.
- **🔍 Intelligent Search**: Quickly find company-specific prep materials using our robust filtering system.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Modern Brutalist UI)
- **AI Engine**: [Google Generative AI](https://ai.google.dev/) (Gemini API)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typeface**: Geist (Optimized for performance and readability)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- A Supabase account
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/placevault.git
   cd placevault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your credentials (refer to `env.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 🎨 Design Philosophy

PlaceVault embraces **Neo-Brutalism**:
- **Bold Typography**: High-contrast, all-caps headings.
- **Raw Aesthetics**: Defined borders (4px black), vivid "soft" colors, and hard shadows.
- **Function Over Form**: Direct, no-nonsense layouts that prioritize resource accessibility.

---

## 📂 Project Structure

```bash
├── app/               # Next.js App Router (Resources, Stories, Auth)
├── components/        # Reusable UI components (Hero, CareerBot, Navbar)
├── lib/               # Shared utilities and Supabase client
├── public/            # Static assets and images
└── tailwind.config.mjs # Custom brutalist theme configuration
```

---

## 🤝 Contributing

We welcome contributions! Whether it's adding a new resource or fixing a bug:
1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with 🖤 by the PlaceVault Community
</p>
