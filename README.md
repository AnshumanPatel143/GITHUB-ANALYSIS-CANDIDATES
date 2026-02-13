## 🚀 Live Demo

https://analysiscandidates.netlify.app/

Simply enter a GitHub username and get instant analysis in under 2 minutes!

# 🚀 GitHub Portfolio Analyzer & Enhancer

> Turn Repositories into Recruiter-Ready Proof

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Hackathon](https://img.shields.io/badge/Hackathon-UnsaidTalks%202026-purple)](https://www.unsaidtalks.com)

A comprehensive tool that analyzes GitHub profiles from a recruiter's perspective and provides actionable recommendations to help developers create standout portfolios.



## 🎯 Problem Statement

For many students and early-career developers, GitHub is their primary portfolio. Yet most profiles fail to communicate real skill, impact, or consistency to recruiters. This tool solves that problem by:

- Analyzing GitHub profiles objectively
- Providing recruiter-perspective insights
- Offering specific, actionable improvements
- Helping developers become recruiter-ready

## ✨ Features

### 📊 Comprehensive Scoring System

The tool analyzes six key dimensions that recruiters care about:

1. **Documentation Quality (20 points)** - README files, descriptions, project clarity
2. **Code Structure & Best Practices (20 points)** - Repository organization, naming conventions
3. **Activity Consistency (20 points)** - Commit frequency, recent contributions
4. **Repository Organization (15 points)** - Profile completeness, pinned repos
5. **Project Impact & Relevance (15 points)** - Stars, forks, community engagement
6. **Technical Depth (10 points)** - Language diversity, portfolio breadth

**Total Score: 0-100 points**

### 🎯 Key Insights Provided

- **Overall Portfolio Score** - Instant assessment of profile strength
- **Strengths Analysis** - What you're doing right
- **Red Flags** - Areas that concern recruiters
- **Top Repositories** - Your best projects highlighted
- **Language Distribution** - Technical skill visualization
- **Activity Timeline** - 90-day contribution heatmap

### 💡 Actionable Recommendations

Get specific, prioritized recommendations such as:

- How to improve documentation
- Strategies for consistent activity
- Profile optimization tips
- Project impact enhancement
- Technical diversity suggestions

Each recommendation includes:
- Priority level (High/Medium/Low)
- Expected impact
- Specific action steps



## 💻 Tech Stack

- **Frontend:** HTML5, CSS3 (Modern Flexbox/Grid)
- **JavaScript:** Vanilla ES6+
- **API:** GitHub REST API v3
- **Design:** Custom CSS with gradient themes
- **No frameworks** - Pure, lightweight implementation

## 🛠️ Installation & Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for GitHub API access)
- Optional: GitHub Personal Access Token (for higher rate limits)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/github-portfolio-analyzer.git
cd github-portfolio-analyzer
```

2. **Open the application**
```bash
# Option 1: Simply open index.html in your browser
open index.html

# Option 2: Use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

3. **Start analyzing!**
   - Enter any GitHub username
   - Click "Analyze Profile"
   - View comprehensive results in seconds

### Optional: GitHub Token Setup

For higher API rate limits (5000 requests/hour vs 60):

1. Generate a token at [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Open `script.js` and add your token:
```javascript
githubToken: 'your_token_here'
```

⚠️ **Note:** Never commit your token to public repositories!

## 📖 How to Use

1. **Enter GitHub Username**
   - Type the username (e.g., "torvalds" or "github.com/torvalds")
   - Don't worry about formatting - the tool handles various inputs

2. **Wait for Analysis**
   - The tool fetches profile data, repositories, and activity
   - Analysis typically takes 5-15 seconds

3. **Review Results**
   - Overall score with visual ring chart
   - Detailed metrics breakdown
   - Strengths and areas for improvement
   - Specific recommendations

4. **Take Action**
   - Download/print the report
   - Implement recommendations
   - Re-analyze to track improvement

## 🏗️ Project Structure

```
github-portfolio-analyzer/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── script.js           # Core analysis logic and GitHub API
├── README.md           # This file
└── screenshots/        # Demo images (if added)
```

## 🔍 How It Works

### Analysis Algorithm

1. **Data Collection**
   - Fetch user profile via GitHub API
   - Retrieve all public repositories
   - Analyze recent activity events

2. **Scoring Calculation**
   - Each metric has specific criteria
   - Weighted scoring based on recruiter priorities
   - Normalized to 0-100 scale

3. **Insight Generation**
   - Pattern recognition for strengths
   - Red flag identification
   - Recommendation prioritization

4. **Visualization**
   - Dynamic score rendering
   - Interactive charts
   - Clean, professional presentation

### Sample Scoring Logic

**Documentation Quality:**
- Description (20+ chars): 4 points
- Has content: 3 points
- Homepage/website: 2 points
- Topics/tags: 1 point
- Average across all repos, scaled to 20 points

**Activity Consistency:**
- Recent events (30 days): up to 10 points
- Medium-term (90 days): up to 10 points

**Project Impact:**
- Stars: up to 7 points (scaled)
- Forks: up to 4 points (scaled)
- Watchers: up to 4 points (scaled)

## 🎨 Design Highlights

- **Modern Gradient UI** - Eye-catching purple gradient theme
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Score reveals, progress bars, transitions
- **Print-Friendly** - Clean report generation for PDFs
- **Accessibility** - Semantic HTML, ARIA labels

## 📊 Sample Analysis

**Input:** `torvalds`

**Output:**
- Overall Score: 78/100
- Top Strength: "Significant impact with thousands of stars and forks"
- Top Recommendation: "Add comprehensive README files with setup instructions"
- Technical Depth: 5 languages across 25 repositories

## 🚧 Future Enhancements

- [ ] PDF report generation
- [ ] Email report delivery
- [ ] Historical tracking and comparison
- [ ] Team/organization analysis
- [ ] AI-powered recommendation specificity
- [ ] Integration with LinkedIn profiles
- [ ] Competitive benchmarking
- [ ] Custom scoring weights

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see below for details.

```
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


### Evaluation Criteria Alignment

✅ **Impact (20%)** - Analyzes GitHub in under 2 minutes  
✅ **Innovation (20%)** - Unique recruiter-perspective scoring system  
✅ **Technical Execution (20%)** - Clean code with comprehensive README  
✅ **User Experience (25%)** - Modern, intuitive UI with smooth interactions  
✅ **Presentation (15%)** - Professional demo and documentation  


