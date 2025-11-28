# 🎓 DAAD Course Summariser (Next.js + Supabase + AI)

The **DAAD Course Summariser** is an AI-powered tool designed to help international students instantly understand degree programmes listed on the official **DAAD (German Academic Exchange Service)** website.

By pasting any eligible DAAD course link, the tool fetches the course page, processes the academic content through an AI pipeline, and returns a **clean, concise, student-friendly summary** including key details, admission requirements, deadlines, teaching language, and more.

This project is built with **Next.js 14**, **Supabase Auth**, **Supabase RLS**, **Vectorshift AI**, and **Tailwind + shadcn/ui**.

---

## 🚀 Features

### 🧠 AI-Generated Summaries
- Paste any DAAD course link  
- Extracts and cleans academic data  
- Generates:
  - 2–3 sentence Quick Summary  
  - Key Details (course name, deadlines, language, etc.)  
  - Ideal Applicant Profile  
  - Optional: University reputation & admission difficulty  

### 🔐 Authentication
- Secure Google Sign-In using Supabase Auth  
- Protected API route for summarisation  
- Daily request quota (free vs premium users)  

### 🧾 JSON-Structured Output  
- Clean JSON output for precise rendering  
- Custom React UI to display summary  

### 🎨 Modern Responsive UI
- Next.js App Router  
- TailwindCSS + shadcn/ui  
- Lucide icons  
- Smooth dialogs, loaders, and cards  

### 📊 AdSense-Ready Page
- SEO-optimised homepage content  
- Ads appear only below meaningful content  
- Compliant with Google Publisher Policies  

---

## 🧱 Tech Stack

| Category | Tools |
|---------|-------|
| Framework | Next.js 14 (App Router) |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase Postgres + RLS |
| UI | TailwindCSS + shadcn/ui |
| Icons | lucide-react |
| AI Pipeline | Vectorshift API |
| Deployment | Vercel |
| Markdown | ReactMarkdown + remark-gfm |

---
