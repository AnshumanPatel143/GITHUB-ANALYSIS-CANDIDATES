// GitHub Portfolio Analyzer - Main Application

const app = {
    githubToken: null, // Users can optionally add their token for higher rate limits
    currentUsername: null,
    analysisData: null,

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const githubUrl = document.getElementById('githubUrl');

        analyzeBtn.addEventListener('click', () => this.startAnalysis());
        githubUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startAnalysis();
        });
    },

    async startAnalysis() {
        const input = document.getElementById('githubUrl').value.trim();
        
        if (!input) {
            this.showError('Please enter a GitHub username');
            return;
        }

        // Extract username from input
        const username = this.extractUsername(input);
        if (!username) {
            this.showError('Please enter a valid GitHub username');
            return;
        }

        this.currentUsername = username;
        this.showLoading();
        
        try {
            await this.analyzeProfile(username);
        } catch (error) {
            this.showError(error.message);
        }
    },

    extractUsername(input) {
        // Handle various input formats
        input = input.replace(/^https?:\/\/(www\.)?github\.com\//, '');
        input = input.replace(/\/$/, '');
        const parts = input.split('/');
        return parts[0] || null;
    },

    async analyzeProfile(username) {
        this.updateLoadingStatus('Fetching profile data...');
        
        try {
            // Fetch user profile
            const profile = await this.fetchGitHubAPI(`/users/${username}`);
            
            this.updateLoadingStatus('Analyzing repositories...');
            
            // Fetch repositories
            const repos = await this.fetchGitHubAPI(`/users/${username}/repos?per_page=100&sort=updated`);
            
            this.updateLoadingStatus('Analyzing commit activity...');
            
            // Fetch events for activity analysis
            const events = await this.fetchGitHubAPI(`/users/${username}/events?per_page=100`);
            
            this.updateLoadingStatus('Generating insights...');
            
            // Perform comprehensive analysis
            const analysis = this.performAnalysis(profile, repos, events);
            
            this.analysisData = analysis;
            
            // Display results
            setTimeout(() => {
                this.displayResults(analysis);
            }, 500);
            
        } catch (error) {
            throw new Error(`Failed to analyze profile: ${error.message}`);
        }
    },

    async fetchGitHubAPI(endpoint) {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (this.githubToken) {
            headers['Authorization'] = `token ${this.githubToken}`;
        }

        const response = await fetch(`https://api.github.com${endpoint}`, { headers });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('GitHub user not found');
            } else if (response.status === 403) {
                throw new Error('API rate limit exceeded. Please try again later.');
            } else {
                throw new Error('Failed to fetch data from GitHub');
            }
        }

        return await response.json();
    },

    performAnalysis(profile, repos, events) {
        const analysis = {
            profile,
            repos,
            events,
            metrics: {},
            strengths: [],
            redFlags: [],
            recommendations: [],
            overallScore: 0
        };

        // Filter out forked repos for quality analysis
        const originalRepos = repos.filter(r => !r.fork);
        const publicRepos = repos.filter(r => !r.private);

        // 1. Documentation Quality Score (0-20)
        const docScore = this.analyzeDocumentation(originalRepos);
        analysis.metrics.documentation = docScore;

        // 2. Code Structure & Best Practices (0-20)
        const structureScore = this.analyzeStructure(originalRepos);
        analysis.metrics.structure = structureScore;

        // 3. Activity Consistency (0-20)
        const activityScore = this.analyzeActivity(events, repos);
        analysis.metrics.activity = activityScore;

        // 4. Repository Organization (0-15)
        const orgScore = this.analyzeOrganization(profile, originalRepos);
        analysis.metrics.organization = orgScore;

        // 5. Project Impact & Relevance (0-15)
        const impactScore = this.analyzeImpact(originalRepos);
        analysis.metrics.impact = impactScore;

        // 6. Technical Depth (0-10)
        const depthScore = this.analyzeTechnicalDepth(originalRepos);
        analysis.metrics.technicalDepth = depthScore;

        // Calculate overall score
        analysis.overallScore = Math.round(
            docScore.score + 
            structureScore.score + 
            activityScore.score + 
            orgScore.score + 
            impactScore.score + 
            depthScore.score
        );

        // Generate strengths
        analysis.strengths = this.identifyStrengths(analysis);

        // Generate red flags
        analysis.redFlags = this.identifyRedFlags(analysis);

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);

        // Language analysis
        analysis.languages = this.analyzeLanguages(originalRepos);

        // Top repositories
        analysis.topRepos = this.identifyTopRepos(originalRepos);

        return analysis;
    },

    analyzeDocumentation(repos) {
        let totalScore = 0;
        let count = 0;

        repos.forEach(repo => {
            let repoScore = 0;
            
            // Has description (4 points)
            if (repo.description && repo.description.length > 20) {
                repoScore += 4;
            } else if (repo.description) {
                repoScore += 2;
            }

            // Has README implied by size (3 points)
            if (repo.size > 0) {
                repoScore += 3;
            }

            // Has homepage/website (2 points)
            if (repo.homepage) {
                repoScore += 2;
            }

            // Has topics/tags (1 point)
            if (repo.topics && repo.topics.length > 0) {
                repoScore += 1;
            }

            totalScore += repoScore;
            count++;
        });

        const avgScore = count > 0 ? (totalScore / count / 10) * 20 : 0;

        return {
            score: Math.min(20, avgScore),
            maxScore: 20,
            details: `${count} repositories analyzed for documentation quality`
        };
    },

    analyzeStructure(repos) {
        let structuredRepos = 0;

        repos.forEach(repo => {
            let hasStructure = false;

            // Check for indicators of good structure
            if (repo.size > 100) hasStructure = true; // Non-trivial size
            if (repo.topics && repo.topics.length >= 2) hasStructure = true; // Well-tagged
            if (repo.stargazers_count > 0) hasStructure = true; // Has recognition

            if (hasStructure) structuredRepos++;
        });

        const score = repos.length > 0 ? (structuredRepos / repos.length) * 20 : 0;

        return {
            score: Math.round(score),
            maxScore: 20,
            details: `${structuredRepos} out of ${repos.length} repos show good structure`
        };
    },

    analyzeActivity(events, repos) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        // Recent activity
        const recentEvents = events.filter(e => new Date(e.created_at) > thirtyDaysAgo);
        const mediumEvents = events.filter(e => new Date(e.created_at) > ninetyDaysAgo);

        // Calculate activity score
        let score = 0;

        // Recent commits (last 30 days) - 10 points
        if (recentEvents.length >= 20) score += 10;
        else if (recentEvents.length >= 10) score += 7;
        else if (recentEvents.length >= 5) score += 5;
        else if (recentEvents.length >= 1) score += 3;

        // Medium-term consistency (last 90 days) - 10 points
        if (mediumEvents.length >= 40) score += 10;
        else if (mediumEvents.length >= 20) score += 7;
        else if (mediumEvents.length >= 10) score += 5;
        else if (mediumEvents.length >= 5) score += 3;

        return {
            score: Math.min(20, score),
            maxScore: 20,
            details: `${recentEvents.length} events in last 30 days, ${mediumEvents.length} in last 90 days`
        };
    },

    analyzeOrganization(profile, repos) {
        let score = 0;

        // Profile completeness (5 points)
        if (profile.bio) score += 2;
        if (profile.location) score += 1;
        if (profile.blog) score += 1;
        if (profile.company) score += 1;

        // Pinned repositories indicator (5 points)
        // We'll estimate based on having quality repos
        const qualityRepos = repos.filter(r => 
            r.stargazers_count > 0 || 
            (r.description && r.description.length > 30)
        );
        if (qualityRepos.length >= 6) score += 5;
        else if (qualityRepos.length >= 3) score += 3;
        else if (qualityRepos.length >= 1) score += 1;

        // Repository naming consistency (5 points)
        const hasConsistentNaming = this.checkNamingConsistency(repos);
        if (hasConsistentNaming) score += 5;
        else score += 2;

        return {
            score: Math.min(15, score),
            maxScore: 15,
            details: 'Profile completeness and repository organization'
        };
    },

    checkNamingConsistency(repos) {
        // Check if most repos use kebab-case or snake_case consistently
        const kebabCase = repos.filter(r => r.name.includes('-')).length;
        const snakeCase = repos.filter(r => r.name.includes('_')).length;
        const total = repos.length;

        return (kebabCase / total > 0.6) || (snakeCase / total > 0.6);
    },

    analyzeImpact(repos) {
        let score = 0;

        // Stars (7 points)
        const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        if (totalStars >= 100) score += 7;
        else if (totalStars >= 50) score += 5;
        else if (totalStars >= 20) score += 4;
        else if (totalStars >= 10) score += 3;
        else if (totalStars >= 5) score += 2;
        else if (totalStars >= 1) score += 1;

        // Forks (4 points)
        const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
        if (totalForks >= 20) score += 4;
        else if (totalForks >= 10) score += 3;
        else if (totalForks >= 5) score += 2;
        else if (totalForks >= 1) score += 1;

        // Watchers (4 points)
        const totalWatchers = repos.reduce((sum, r) => sum + r.watchers_count, 0);
        if (totalWatchers >= 20) score += 4;
        else if (totalWatchers >= 10) score += 3;
        else if (totalWatchers >= 5) score += 2;
        else if (totalWatchers >= 1) score += 1;

        return {
            score: Math.min(15, score),
            maxScore: 15,
            details: `${totalStars} stars, ${totalForks} forks across all repositories`
        };
    },

    analyzeTechnicalDepth(repos) {
        const languages = new Set();
        repos.forEach(r => {
            if (r.language) languages.add(r.language);
        });

        let score = 0;

        // Language diversity (5 points)
        if (languages.size >= 5) score += 5;
        else if (languages.size >= 3) score += 3;
        else if (languages.size >= 2) score += 2;
        else if (languages.size >= 1) score += 1;

        // Repository count (5 points)
        if (repos.length >= 20) score += 5;
        else if (repos.length >= 10) score += 4;
        else if (repos.length >= 5) score += 3;
        else if (repos.length >= 3) score += 2;
        else if (repos.length >= 1) score += 1;

        return {
            score: Math.min(10, score),
            maxScore: 10,
            details: `${languages.size} different languages, ${repos.length} repositories`
        };
    },

    analyzeLanguages(repos) {
        const langCount = {};
        
        repos.forEach(repo => {
            if (repo.language) {
                langCount[repo.language] = (langCount[repo.language] || 0) + 1;
            }
        });

        const total = Object.values(langCount).reduce((a, b) => a + b, 0);
        const languages = Object.entries(langCount)
            .map(([name, count]) => ({
                name,
                count,
                percentage: ((count / total) * 100).toFixed(1),
                color: this.getLanguageColor(name)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

        return languages;
    },

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C': '#555555',
            'C#': '#178600',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'PHP': '#4F5D95',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Shell': '#89e051',
            'Jupyter Notebook': '#DA5B0B'
        };

        return colors[language] || '#8b8b8b';
    },

    identifyTopRepos(repos) {
        return repos
            .sort((a, b) => {
                const scoreA = (a.stargazers_count * 3) + (a.forks_count * 2) + a.watchers_count;
                const scoreB = (b.stargazers_count * 3) + (b.forks_count * 2) + b.watchers_count;
                return scoreB - scoreA;
            })
            .slice(0, 5);
    },

    identifyStrengths(analysis) {
        const strengths = [];
        const { metrics, profile, repos } = analysis;

        // Documentation strength
        if (metrics.documentation.score >= 15) {
            strengths.push('Excellent documentation across repositories with clear descriptions and README files');
        }

        // Activity strength
        if (metrics.activity.score >= 15) {
            strengths.push('Consistent and recent commit activity showing active development');
        }

        // Impact strength
        if (metrics.impact.score >= 10) {
            strengths.push('Strong community engagement with stars and forks on repositories');
        }

        // Technical depth
        if (metrics.technicalDepth.score >= 7) {
            strengths.push('Diverse technical skill set demonstrated across multiple programming languages');
        }

        // Profile completeness
        if (profile.bio && profile.location && (profile.blog || profile.company)) {
            strengths.push('Complete and professional GitHub profile with detailed information');
        }

        // Repository count
        if (repos.filter(r => !r.fork).length >= 10) {
            strengths.push('Substantial portfolio with multiple original projects');
        }

        return strengths.length > 0 ? strengths : ['Active GitHub presence with room for improvement'];
    },

    identifyRedFlags(analysis) {
        const redFlags = [];
        const { metrics, profile, repos } = analysis;

        // Documentation issues
        if (metrics.documentation.score < 10) {
            redFlags.push('Many repositories lack proper documentation and descriptions');
        }

        // Low activity
        if (metrics.activity.score < 8) {
            redFlags.push('Limited recent activity - recruiters look for consistent contributions');
        }

        // No impact
        if (metrics.impact.score < 5) {
            redFlags.push('Repositories have minimal community engagement (stars/forks)');
        }

        // Profile incomplete
        if (!profile.bio || !profile.location) {
            redFlags.push('Incomplete profile information - missing bio or location');
        }

        // Too many forks
        const forkRatio = repos.filter(r => r.fork).length / repos.length;
        if (forkRatio > 0.7 && repos.length > 5) {
            redFlags.push('High proportion of forked repositories - showcase more original work');
        }

        // Limited language diversity
        if (metrics.technicalDepth.score < 4) {
            redFlags.push('Limited language diversity - consider exploring different technologies');
        }

        // No recent repos
        const recentRepos = repos.filter(r => {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return new Date(r.created_at) > sixMonthsAgo;
        });
        
        if (recentRepos.length === 0 && repos.length > 0) {
            redFlags.push('No new repositories in the past 6 months');
        }

        return redFlags.length > 0 ? redFlags : ['No major red flags identified'];
    },

    generateRecommendations(analysis) {
        const recommendations = [];
        const { metrics, profile, repos } = analysis;

        // Documentation recommendations
        if (metrics.documentation.score < 15) {
            recommendations.push({
                title: 'Improve Repository Documentation',
                description: 'Add comprehensive README files with project descriptions, setup instructions, usage examples, and screenshots. Include badges for build status, license, and code coverage.',
                priority: 'high',
                impact: 'High - Documentation is the first thing recruiters check'
            });
        }

        // Activity recommendations
        if (metrics.activity.score < 12) {
            recommendations.push({
                title: 'Increase Commit Consistency',
                description: 'Maintain regular commits even if small. Aim for consistent activity rather than irregular bursts. Use GitHub contribution calendar to track your streak.',
                priority: 'high',
                impact: 'High - Shows dedication and active skill development'
            });
        }

        // Profile recommendations
        if (!profile.bio || !profile.location || !profile.blog) {
            recommendations.push({
                title: 'Complete Your Profile',
                description: 'Add a professional bio, location, personal website/portfolio, and relevant social links. Consider adding a profile README (username/username repository).',
                priority: 'medium',
                impact: 'Medium - First impression matters'
            });
        }

        // Impact recommendations
        if (metrics.impact.score < 8) {
            recommendations.push({
                title: 'Build Projects with Real-World Impact',
                description: 'Create projects that solve real problems, contribute to open source, or showcase practical applications. Add project demos and deployment links.',
                priority: 'high',
                impact: 'High - Demonstrates practical problem-solving ability'
            });
        }

        // Pin repositories
        recommendations.push({
            title: 'Pin Your Best Repositories',
            description: 'Use GitHub\'s pin feature to showcase your top 6 projects. Choose diverse projects that demonstrate different skills and technologies.',
            priority: 'medium',
            impact: 'Medium - Controls recruiter\'s first impression'
        });

        // Technical depth
        if (metrics.technicalDepth.score < 6) {
            recommendations.push({
                title: 'Diversify Your Technical Stack',
                description: 'Explore additional programming languages and frameworks. Build projects using different technologies to show versatility and learning ability.',
                priority: 'low',
                impact: 'Medium - Shows adaptability and continuous learning'
            });
        }

        // Project organization
        if (metrics.organization.score < 10) {
            recommendations.push({
                title: 'Organize Your Repositories',
                description: 'Archive or delete old/incomplete projects. Use consistent naming conventions (kebab-case recommended). Add topics/tags to all repositories for discoverability.',
                priority: 'medium',
                impact: 'Medium - Shows attention to detail'
            });
        }

        // Add specific technical recommendation
        recommendations.push({
            title: 'Add Automated Testing & CI/CD',
            description: 'Implement unit tests and set up GitHub Actions for continuous integration. Add test coverage badges to READMEs to demonstrate code quality.',
            priority: 'low',
            impact: 'High - Signals professional development practices'
        });

        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }).slice(0, 6);
    },

    showLoading() {
        document.getElementById('loadingSection').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('errorSection').classList.add('hidden');
        document.getElementById('analyzeBtn').classList.add('loading');
        document.getElementById('analyzeBtn').disabled = true;
    },

    updateLoadingStatus(status) {
        document.getElementById('loadingStatus').textContent = status;
    },

    showError(message) {
        document.getElementById('errorSection').classList.remove('hidden');
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('analyzeBtn').classList.remove('loading');
        document.getElementById('analyzeBtn').disabled = false;
    },

    displayResults(analysis) {
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('analyzeBtn').classList.remove('loading');
        document.getElementById('analyzeBtn').disabled = false;

        // Display overall score
        this.displayOverallScore(analysis);

        // Display profile summary
        this.displayProfileSummary(analysis.profile);

        // Display metrics breakdown
        this.displayMetrics(analysis.metrics);

        // Display top repositories
        this.displayTopRepos(analysis.topRepos);

        // Display strengths
        this.displayStrengths(analysis.strengths);

        // Display red flags
        this.displayRedFlags(analysis.redFlags);

        // Display recommendations
        this.displayRecommendations(analysis.recommendations);

        // Display languages
        this.displayLanguages(analysis.languages);

        // Display activity
        this.displayActivity(analysis.events);

        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    },

    displayOverallScore(analysis) {
        const score = analysis.overallScore;
        const scoreElement = document.getElementById('overallScore');
        const titleElement = document.getElementById('scoreTitle');
        const descElement = document.getElementById('scoreDescription');
        const badgeElement = document.getElementById('scoreBadge');
        const circleElement = document.getElementById('scoreCircle');

        // Animate score
        let currentScore = 0;
        const increment = score / 50;
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(timer);
            }
            scoreElement.textContent = Math.round(currentScore);
        }, 20);

        // Animate circle
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (score / 100) * circumference;
        circleElement.style.strokeDashoffset = offset;

        // Set title and description based on score
        if (score >= 80) {
            titleElement.textContent = 'Excellent Profile! 🌟';
            descElement.textContent = 'Your GitHub profile is impressive and recruiter-ready. Keep up the great work!';
            badgeElement.textContent = 'Recruiter Ready';
            badgeElement.className = 'badge';
        } else if (score >= 60) {
            titleElement.textContent = 'Good Profile! 👍';
            descElement.textContent = 'Your profile is solid with room for improvement. Follow the recommendations to stand out more.';
            badgeElement.textContent = 'Above Average';
            badgeElement.className = 'badge';
        } else if (score >= 40) {
            titleElement.textContent = 'Average Profile';
            descElement.textContent = 'Your profile needs attention. Focus on the high-priority recommendations below.';
            badgeElement.textContent = 'Needs Work';
            badgeElement.className = 'badge';
        } else {
            titleElement.textContent = 'Profile Needs Improvement';
            descElement.textContent = 'Significant improvements needed to be competitive. Start with the recommendations below.';
            badgeElement.textContent = 'Work in Progress';
            badgeElement.className = 'badge';
        }
    },

    displayProfileSummary(profile) {
        document.getElementById('profileAvatar').src = profile.avatar_url;
        document.getElementById('profileName').textContent = profile.name || profile.login;
        document.getElementById('profileBio').textContent = profile.bio || 'No bio provided';
        document.getElementById('repoCount').textContent = profile.public_repos;
        document.getElementById('followerCount').textContent = profile.followers;
        document.getElementById('followingCount').textContent = profile.following;
    },

    displayMetrics(metrics) {
        const container = document.getElementById('scoreMetrics');
        container.innerHTML = '';

        const metricsList = [
            { key: 'documentation', label: 'Documentation Quality', icon: '📝' },
            { key: 'structure', label: 'Code Structure', icon: '🏗️' },
            { key: 'activity', label: 'Activity Consistency', icon: '📊' },
            { key: 'organization', label: 'Organization', icon: '📁' },
            { key: 'impact', label: 'Project Impact', icon: '⭐' },
            { key: 'technicalDepth', label: 'Technical Depth', icon: '🔧' }
        ];

        metricsList.forEach(({ key, label, icon }) => {
            const metric = metrics[key];
            const percentage = (metric.score / metric.maxScore) * 100;

            const metricDiv = document.createElement('div');
            metricDiv.className = 'metric-item';
            metricDiv.innerHTML = `
                <div class="metric-info">
                    <h4>${icon} ${label}</h4>
                    <p>${metric.details}</p>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="metric-score">${metric.score}/${metric.maxScore}</div>
            `;
            container.appendChild(metricDiv);
        });
    },

    displayTopRepos(repos) {
        const container = document.getElementById('topReposList');
        container.innerHTML = '';

        if (repos.length === 0) {
            container.innerHTML = '<p>No repositories found</p>';
            return;
        }

        repos.forEach(repo => {
            const repoDiv = document.createElement('div');
            repoDiv.className = 'repo-item';

            const topics = repo.topics && repo.topics.length > 0
                ? repo.topics.map(t => `<span class="repo-tag">${t}</span>`).join('')
                : '';

            repoDiv.innerHTML = `
                <div class="repo-header">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                    <div class="repo-stats">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🔱 ${repo.forks_count}</span>
                        ${repo.language ? `<span>💻 ${repo.language}</span>` : ''}
                    </div>
                </div>
                <p class="repo-description">${repo.description || 'No description provided'}</p>
                ${topics ? `<div class="repo-tags">${topics}</div>` : ''}
            `;
            container.appendChild(repoDiv);
        });
    },

    displayStrengths(strengths) {
        const container = document.getElementById('strengthsList');
        container.innerHTML = '';

        strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            container.appendChild(li);
        });
    },

    displayRedFlags(redFlags) {
        const container = document.getElementById('redFlagsList');
        container.innerHTML = '';

        redFlags.forEach(flag => {
            const li = document.createElement('li');
            li.textContent = flag;
            container.appendChild(li);
        });
    },

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendationsList');
        container.innerHTML = '';

        recommendations.forEach(rec => {
            const recDiv = document.createElement('div');
            recDiv.className = 'recommendation-item';
            recDiv.innerHTML = `
                <span class="recommendation-priority priority-${rec.priority}">${rec.priority.toUpperCase()}</span>
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
                <small><strong>Impact:</strong> ${rec.impact}</small>
            `;
            container.appendChild(recDiv);
        });
    },

    displayLanguages(languages) {
        const container = document.getElementById('languageChart');
        container.innerHTML = '';

        if (languages.length === 0) {
            container.innerHTML = '<p>No language data available</p>';
            return;
        }

        languages.forEach(lang => {
            const langDiv = document.createElement('div');
            langDiv.innerHTML = `
                <div class="language-item">
                    <span class="language-color" style="background: ${lang.color}"></span>
                    <span class="language-name">${lang.name}</span>
                    <span class="language-percentage">${lang.percentage}%</span>
                </div>
                <div class="language-bar">
                    <div class="language-fill" style="width: ${lang.percentage}%; background: ${lang.color}"></div>
                </div>
            `;
            container.appendChild(langDiv);
        });
    },

    displayActivity(events) {
        const container = document.getElementById('activityTimeline');
        container.innerHTML = '';

        // Create activity heatmap for last 90 days
        const today = new Date();
        const activityMap = {};

        events.forEach(event => {
            const date = new Date(event.created_at);
            const dateStr = date.toISOString().split('T')[0];
            activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
        });

        // Generate last 90 days
        for (let i = 89; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = activityMap[dateStr] || 0;

            let level = 0;
            if (count > 0) level = 1;
            if (count >= 3) level = 2;
            if (count >= 5) level = 3;
            if (count >= 8) level = 4;

            const dayDiv = document.createElement('div');
            dayDiv.className = `activity-day level-${level}`;
            dayDiv.title = `${dateStr}: ${count} events`;
            container.appendChild(dayDiv);
        }
    }
};

function resetAnalyzer() {
    document.getElementById('githubUrl').value = '';
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('errorSection').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
