# MCPHub

The central directory and management platform for Model Context Protocol (MCP) servers. Discover, configure, and monitor MCPs for Claude Desktop, Cursor, and more.

## 🚀 Live Site

**Production:** https://mcphub-one.vercel.app

## Features

- **Curated Directory**: 50+ verified MCPs, categorized and searchable
- **One-Click Configs**: Generate working configs for Claude Desktop, Cursor, Continue, and Cline
- **Search & Filter**: Find MCPs by name, description, tags, or category
- **Selection Management**: Build your MCP stack with an intuitive selection panel
- **Email Capture**: Simple lead capture for future updates

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

```
MCPHub/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── directory/         # MCP directory page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── MCPCard.tsx        # MCP card component
│   ├── MCPDetailModal.tsx # MCP detail modal
│   └── SelectionPanel.tsx # Selection panel
├── lib/                   # Utilities and data
│   ├── config-generator.ts # Config file generator
│   ├── mcps.ts            # MCP data (50+ MCPs)
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## MVP Features

✅ Landing page with value proposition  
✅ MCP directory with 50+ curated MCPs  
✅ Search and category filtering  
✅ MCP detail modal with full information  
✅ Selection panel for managing chosen MCPs  
✅ Config generation for multiple platforms  
✅ Email capture form  
✅ Responsive design with dark mode support  

## Next Steps

- [ ] User authentication (Supabase)
- [ ] Save selections to user profile
- [ ] Health monitoring dashboard
- [ ] Pro subscription tier
- [ ] Community features (reviews, upvotes)
- [ ] Weekly digest emails
- [ ] Team workspaces

## License

MIT
