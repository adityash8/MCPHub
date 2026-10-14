# MCPHub

Browse MCP Registry listings and generate client config templates for Claude Desktop, Cursor, Continue, and Cline.

## 🚀 Live Site

**Production:** https://mcphub-one.vercel.app

## Features

- **Registry directory**: 53 selected latest active Registry listings across developer, productivity, and client workflows. Every listing records its source and verification scope.
- **Config templates**: Generate client-specific JSON or Continue YAML where setup is supported. Five npm launch templates and five Cursor remote URLs have checked publisher instructions; other exports are blocked pending setup verification. Installation, connections, package health, and security are untested.
- **Search & Filter**: Find servers by name, description, or category
- **Selection Management**: Build your MCP stack with an intuitive selection panel
- **Email Capture**: Simple lead capture for future updates

## Tech Stack

- **Framework**: Next.js 15 (App Router)
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
✅ Searchable MCP Registry snapshot; manual curation is still pending
✅ Search and category filtering  
✅ MCP detail modal with full information  
✅ Selection panel for managing chosen MCPs  
✅ Config template generation for supported client/transport combinations
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
