# Devano Meeting - Team Video Conferencing Platform

A modern, fast, and easy-to-use team meeting and collaboration platform built with React, Express, WebRTC, and Supabase.

## 🎯 Features

### Core Meeting Features
- **Video Conferencing**: WebRTC-powered video calls with camera and microphone controls
- **Real-time Chat**: Instant team messaging with message timestamps and auto-scroll
- **Meeting Management**: Create, schedule, and join meetings with shareable room codes
- **Participant List**: See who's in the meeting with live mic/camera status indicators

### Team Collaboration
- **Team Directory**: Browse and manage team members with role-based badges
- **Meeting History**: Track past, active, and upcoming meetings with duration analytics
- **Dashboard**: Central hub for meeting creation, quick stats, and navigation

### User Experience
- **Dark/Light Mode**: Eye-friendly color palette with soft blues and neutral grays
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Fast & Reliable**: Zero-delay messaging and instant UI updates
- **OAuth Authentication**: Sign in with Google or Microsoft via Manus OAuth

### Security
- **Cloudflare Security Headers**: CSP, HSTS, X-Frame-Options, Permissions-Policy
- **Secure Session Management**: JWT-based authentication with secure cookies
- **Database Security**: Supabase with proper schema validation and access control

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Express.js, tRPC 11, Node.js
- **Database**: Supabase (MySQL)
- **Real-time**: WebRTC (video/audio), tRPC polling (messages)
- **Authentication**: Manus OAuth (Google/Microsoft)
- **Deployment**: Manus WebDev (Autoscale/Cloud Run)

### Project Structure
```
devano-meeting/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components (Dashboard, MeetingRoom, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utilities (formatting, tRPC client)
│   │   ├── contexts/         # React contexts (Theme)
│   │   └── App.tsx           # Main router
│   └── index.html            # HTML entry point
├── server/                    # Express backend
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   ├── security.ts           # Security headers middleware
│   └── _core/                # Framework plumbing
├── drizzle/                  # Database schema and migrations
│   └── schema.ts             # Drizzle ORM schema
├── shared/                   # Shared types and constants
└── package.json              # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+
- Supabase account (already configured)
- Manus OAuth credentials (built-in)

### Installation
```bash
cd /home/ubuntu/devano-meeting
pnpm install
pnpm dev
```

### Environment Variables
The following are automatically injected:
- `DATABASE_URL` - Supabase MySQL connection
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - Manus OAuth app ID
- `OAUTH_SERVER_URL` - Manus OAuth backend
- `VITE_OAUTH_PORTAL_URL` - Manus login portal

## 📋 Database Schema

### Users Table
- `id` - Primary key
- `openId` - OAuth identifier (unique)
- `name` - User display name
- `email` - User email
- `loginMethod` - OAuth provider (google, microsoft)
- `role` - User role (user, admin)
- `createdAt`, `updatedAt`, `lastSignedIn` - Timestamps

### Meetings Table
- `id` - Primary key
- `title` - Meeting title
- `description` - Meeting description
- `createdBy` - Creator user ID (foreign key)
- `scheduledAt` - Scheduled meeting time
- `roomCode` - Unique room identifier
- `status` - Meeting status (scheduled, active, ended)
- `createdAt`, `updatedAt` - Timestamps

### Meeting Participants Table
- `id` - Primary key
- `meetingId` - Foreign key to meetings
- `userId` - Foreign key to users
- `joinedAt` - When participant joined
- `leftAt` - When participant left
- `status` - Participant status (active, inactive)

### Messages Table
- `id` - Primary key
- `meetingId` - Foreign key to meetings
- `userId` - Foreign key to users
- `content` - Message text
- `type` - Message type (text, system)
- `createdAt` - Message timestamp

### Team Members Table
- `id` - Primary key
- `userId` - Foreign key to users
- `teamId` - Team identifier
- `role` - Member role (owner, admin, member)
- `joinedAt`, `createdAt` - Timestamps

## 🔐 Security Features

### Headers
- **Content-Security-Policy**: Prevents XSS attacks
- **Strict-Transport-Security**: Forces HTTPS (1 year)
- **X-Frame-Options**: Prevents clickjacking (DENY)
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Permissions-Policy**: Controls browser features (camera, microphone allowed)

### Authentication
- OAuth 2.0 with Manus (Google/Microsoft)
- Secure session cookies (HttpOnly, Secure, SameSite=None)
- JWT-based context for protected procedures

### Database
- Parameterized queries via Drizzle ORM
- Role-based access control (user vs admin)
- Proper foreign key constraints

## 🎨 Design System

### Color Palette
- **Light Mode**: Soft blues (#0066cc, #3399ff) and neutral grays (#f5f5f5, #e0e0e0)
- **Dark Mode**: Deep blues (#1a1a2e, #16213e) and light grays (#e0e0e0, #ffffff)
- **Accent**: Vibrant blue (#0066cc) for CTAs and highlights
- **Muted**: Soft gray (#999999) for secondary text

### Typography
- **Font Family**: Inter (via Google Fonts)
- **Headings**: 600-700 weight, 24-32px size
- **Body**: 400 weight, 14-16px size
- **Captions**: 400 weight, 12-13px size

### Spacing & Radius
- **Spacing**: 4px, 8px, 12px, 16px, 24px, 32px
- **Border Radius**: 4px (small), 8px (medium), 12px (large)
- **Shadows**: Subtle (0 1px 3px), Medium (0 4px 6px)

## 📱 Responsive Breakpoints
- **Mobile**: < 640px (full-width, stacked layout)
- **Tablet**: 640px - 1024px (2-column grid)
- **Desktop**: > 1024px (3+ column grid, sidebar)

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

Includes tests for:
- Database query helpers
- Authentication flows
- Meeting creation and management
- Message persistence

### Manual Testing Checklist
- [ ] Sign in with Google
- [ ] Sign in with Microsoft
- [ ] Create a new meeting
- [ ] Join meeting by code
- [ ] Enable/disable camera
- [ ] Mute/unmute microphone
- [ ] Send chat messages
- [ ] View team directory
- [ ] Check meeting history
- [ ] Toggle dark/light mode
- [ ] Test on mobile device

## 🚀 Deployment

### Prerequisites
1. Create a checkpoint: `webdev_save_checkpoint`
2. Ensure all tests pass: `pnpm test`
3. Build the project: `pnpm build`

### Deploy to Production
1. Click "Publish" button in Manus Management UI
2. Wait for build and deployment to complete
3. Access your live site at the provided URL

### Custom Domain
1. Go to Settings → Domains in Manus Management UI
2. Purchase or connect your custom domain
3. Update DNS records as instructed

## 📊 Performance Metrics

### Target Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Techniques
- Code splitting by route
- Lazy loading of components
- Image optimization via Tailwind
- Minification and compression
- Service worker caching (optional)

## 🔄 Real-time Updates

### Message Polling
- Polls for new messages every 2 seconds
- Auto-scrolls to latest message
- Instant send feedback with optimistic updates

### Participant Updates
- Polls for participant changes every 3 seconds
- Shows join/leave status
- Updates mic/camera indicators

### Future Enhancement: Supabase Realtime
For zero-latency updates, consider upgrading to Supabase Realtime subscriptions:
```typescript
const subscription = supabase
  .channel(`meeting:${meetingId}`)
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => setMessages([...messages, payload.new])
  )
  .subscribe();
```

## 🐛 Troubleshooting

### Camera/Microphone Not Working
1. Check browser permissions (Settings → Privacy)
2. Ensure devices are not in use by other apps
3. Try a different browser
4. Restart the browser

### Messages Not Sending
1. Check network connection
2. Verify Supabase connection string
3. Check browser console for errors
4. Refresh the page

### Meeting Room Not Loading
1. Verify room code is correct
2. Check if meeting has ended
3. Clear browser cache
4. Try incognito/private mode

## 📚 API Documentation

### tRPC Procedures

#### Meetings
- `meetings.create` - Create a new meeting
- `meetings.list` - Get user's meetings
- `meetings.getByCode` - Get meeting by room code
- `meetings.join` - Join a meeting
- `meetings.leave` - Leave a meeting
- `meetings.getUserMeetings` - Get all user meetings

#### Messages
- `messages.send` - Send a chat message
- `messages.getByMeeting` - Get messages for a meeting
- `messages.list` - List all messages

#### Participants
- `participants.list` - Get meeting participants
- `participants.getByMeeting` - Get participants for a meeting

#### Team Members
- `teamMembers.add` - Add a team member
- `teamMembers.list` - Get team members

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Support

For issues or feature requests, contact the development team or submit feedback through the Manus platform.

## 🎉 Thank You!

Thank you for using Devano Meeting. We hope it makes team collaboration faster and easier!

---

**Built with ❤️ using Manus WebDev**
