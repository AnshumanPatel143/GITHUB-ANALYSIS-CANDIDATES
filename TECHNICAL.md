# Technical Documentation

## Architecture Overview

### System Design

```
┌─────────────────┐
│   User Input    │
│  (Username)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Input Parser   │
│ & Validator     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub API     │
│   Fetcher       │
└────────┬────────┘
         │
         ├──────────────┬──────────────┬──────────────┐
         ▼              ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
    │Profile │    │ Repos  │    │Events  │    │ Other  │
    │  Data  │    │  Data  │    │  Data  │    │  Data  │
    └───┬────┘    └───┬────┘    └───┬────┘    └───┬────┘
        │             │              │              │
        └─────────────┴──────────────┴──────────────┘
                      │
                      ▼
              ┌───────────────┐
              │   Analysis    │
              │    Engine     │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌────────┐   ┌────────┐   ┌────────┐
   │Scoring │   │Insights│   │ Recs   │
   │ Logic  │   │  Gen   │   │  Gen   │
   └───┬────┘   └───┬────┘   └───┬────┘
       │            │            │
       └────────────┴────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ Visualization │
            │    Engine     │
            └───────────────┘
```

## Core Components

### 1. Application Controller (`app` object)

**Purpose:** Main orchestration and state management

**Key Methods:**
- `init()` - Initialize application
- `startAnalysis()` - Trigger analysis workflow
- `analyzeProfile(username)` - Main analysis pipeline
- `fetchGitHubAPI(endpoint)` - API communication

### 2. GitHub API Integration

**Base URL:** `https://api.github.com`

**Endpoints Used:**
- `/users/{username}` - User profile data
- `/users/{username}/repos` - Repository list
- `/users/{username}/events` - Activity events

**Rate Limits:**
- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour

**Error Handling:**
- 404: User not found
- 403: Rate limit exceeded
- Network errors: Connection issues

### 3. Analysis Engine

#### Scoring System

**Documentation Quality (0-20 points)**
```javascript
Per Repository:
- Description (20+ chars): 4 pts
- Description (1-19 chars): 2 pts
- Has content: 3 pts
- Has homepage: 2 pts
- Has topics: 1 pt

Average across all repos, scaled to 20 pts
```

**Code Structure (0-20 points)**
```javascript
Criteria per repo:
- Non-trivial size (>100): +1
- Well-tagged (2+ topics): +1
- Has recognition (stars>0): +1

Score = (structured_repos / total_repos) * 20
```

**Activity Consistency (0-20 points)**
```javascript
Last 30 days:
- ≥20 events: 10 pts
- ≥10 events: 7 pts
- ≥5 events: 5 pts
- ≥1 event: 3 pts

Last 90 days:
- ≥40 events: 10 pts
- ≥20 events: 7 pts
- ≥10 events: 5 pts
- ≥5 events: 3 pts
```

**Repository Organization (0-15 points)**
```javascript
Profile completeness:
- Bio: 2 pts
- Location: 1 pt
- Blog: 1 pt
- Company: 1 pt

Quality repos (stars or good desc):
- ≥6 repos: 5 pts
- ≥3 repos: 3 pts
- ≥1 repo: 1 pt

Naming consistency:
- Consistent style: 5 pts
- Mixed style: 2 pts
```

**Project Impact (0-15 points)**
```javascript
Stars total:
- ≥100: 7 pts
- ≥50: 5 pts
- ≥20: 4 pts
- ≥10: 3 pts
- ≥5: 2 pts
- ≥1: 1 pt

Forks total:
- ≥20: 4 pts
- ≥10: 3 pts
- ≥5: 2 pts
- ≥1: 1 pt

Watchers total:
- ≥20: 4 pts
- ≥10: 3 pts
- ≥5: 2 pts
- ≥1: 1 pt
```

**Technical Depth (0-10 points)**
```javascript
Language diversity:
- ≥5 languages: 5 pts
- ≥3 languages: 3 pts
- ≥2 languages: 2 pts
- ≥1 language: 1 pt

Repository count:
- ≥20 repos: 5 pts
- ≥10 repos: 4 pts
- ≥5 repos: 3 pts
- ≥3 repos: 2 pts
- ≥1 repo: 1 pt
```

### 4. Insight Generation

#### Strengths Identification

**Criteria:**
- Documentation score ≥15
- Activity score ≥15
- Impact score ≥10
- Technical depth ≥7
- Complete profile (bio + location + blog/company)
- ≥10 original repositories

#### Red Flags Detection

**Criteria:**
- Documentation score <10
- Activity score <8
- Impact score <5
- Missing bio or location
- Fork ratio >70% (with >5 repos)
- Limited languages (<4 points)
- No repos in 6 months

#### Recommendations Algorithm

**Priority Levels:**
- **High:** Critical for recruiter perception
- **Medium:** Important but not urgent
- **Low:** Nice-to-have improvements

**Selection Logic:**
1. Check each metric against thresholds
2. Generate relevant recommendations
3. Sort by priority
4. Return top 6 recommendations

### 5. Visualization Engine

#### Score Ring Animation
```javascript
// SVG circle animation
circumference = 2π * radius (90)
dashoffset = circumference - (score/100) * circumference
transition: 1s ease-out
```

#### Progress Bars
```javascript
width = (metric_score / max_score) * 100%
transition: 1s ease-out
```

#### Activity Heatmap
```javascript
Levels (based on event count per day):
- Level 0: 0 events (gray)
- Level 1: 1-2 events (light green)
- Level 2: 3-4 events (medium green)
- Level 3: 5-7 events (dark green)
- Level 4: 8+ events (darkest green)

Display: Last 90 days
```

## Data Flow

### 1. User Input Phase
```
User enters username
  ↓
Extract/validate username
  ↓
Show loading state
```

### 2. Data Fetching Phase
```
Fetch user profile
  ↓
Fetch repositories (up to 100)
  ↓
Fetch events (up to 100)
  ↓
Update loading status
```

### 3. Analysis Phase
```
Calculate documentation score
  ↓
Calculate structure score
  ↓
Calculate activity score
  ↓
Calculate organization score
  ↓
Calculate impact score
  ↓
Calculate technical depth
  ↓
Sum to overall score
  ↓
Generate insights (strengths/flags/recommendations)
```

### 4. Presentation Phase
```
Animate overall score
  ↓
Display profile summary
  ↓
Show metric breakdown
  ↓
List top repositories
  ↓
Present strengths
  ↓
Show red flags
  ↓
Display recommendations
  ↓
Render language chart
  ↓
Draw activity heatmap
```

## Performance Considerations

### Optimization Strategies

1. **API Call Efficiency**
   - Single-pass analysis
   - Minimal data fetching
   - Pagination only when needed

2. **DOM Manipulation**
   - Batch updates
   - Fragment creation
   - Minimize reflows

3. **Animation Performance**
   - CSS transitions over JS
   - RequestAnimationFrame for complex animations
   - GPU-accelerated properties

### Expected Performance

- **Initial Load:** <1 second
- **API Fetching:** 2-5 seconds (network dependent)
- **Analysis:** <1 second
- **Rendering:** <1 second
- **Total Time:** 5-15 seconds typical

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- ES6+ JavaScript
- CSS Grid & Flexbox
- Fetch API
- SVG support

## Security Considerations

### API Token Safety
- Never commit tokens to repository
- Use environment variables for sensitive data
- Recommend users use personal tokens only locally

### XSS Prevention
- Sanitize user input
- Use textContent instead of innerHTML where possible
- Validate data from API before display

### CORS Handling
- GitHub API supports CORS
- No proxy needed
- Direct client-side calls

## Error Handling Strategy

### User-Facing Errors
```javascript
try {
  // API call
} catch (error) {
  // Show friendly message
  // Provide retry option
  // Log for debugging
}
```

### Error Types Handled
1. Network errors
2. API rate limits
3. Invalid usernames
4. Missing/private profiles
5. Malformed data

## Testing Checklist

### Functional Testing
- [ ] Valid username analysis
- [ ] Invalid username handling
- [ ] Rate limit behavior
- [ ] Private profile handling
- [ ] Empty repository handling
- [ ] Various repo counts (1, 10, 100+)

### UI Testing
- [ ] Desktop responsiveness
- [ ] Mobile responsiveness
- [ ] Tablet responsiveness
- [ ] Animation smoothness
- [ ] Loading states
- [ ] Error states

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Future Technical Improvements

1. **Caching Layer**
   - LocalStorage for recent analyses
   - Reduce API calls

2. **Backend Service**
   - Server-side analysis
   - Higher rate limits
   - Advanced caching

3. **Testing Suite**
   - Unit tests for scoring
   - Integration tests for API
   - E2E tests for workflows

4. **Analytics**
   - Usage tracking
   - Popular features
   - Error monitoring

5. **Progressive Web App**
   - Offline support
   - Install capability
   - Push notifications

## API Reference

### Internal API

#### `app.analyzeProfile(username)`
Analyzes a GitHub profile.

**Parameters:**
- `username` (string): GitHub username

**Returns:** Promise<void>

**Throws:** Error if analysis fails

#### `app.fetchGitHubAPI(endpoint)`
Fetches data from GitHub API.

**Parameters:**
- `endpoint` (string): API endpoint path

**Returns:** Promise<Object>

**Throws:** Error on HTTP errors

#### `app.performAnalysis(profile, repos, events)`
Performs comprehensive analysis.

**Parameters:**
- `profile` (Object): User profile data
- `repos` (Array): Repository list
- `events` (Array): Event list

**Returns:** Object with analysis results

## Configuration

### Customizable Parameters

```javascript
// In script.js - can be extracted to config
const CONFIG = {
  MAX_REPOS_FETCH: 100,
  MAX_EVENTS_FETCH: 100,
  ACTIVITY_DAYS_SHORT: 30,
  ACTIVITY_DAYS_MEDIUM: 90,
  TOP_REPOS_COUNT: 5,
  MAX_LANGUAGES: 6,
  ANIMATION_DURATION: 1000
};
```

## Deployment

### Static Hosting
Works on any static host:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Cloudflare Pages

### Build Process
No build process required - pure HTML/CSS/JS

### Environment Setup
None required for basic deployment

---

**Last Updated:** February 13, 2026
