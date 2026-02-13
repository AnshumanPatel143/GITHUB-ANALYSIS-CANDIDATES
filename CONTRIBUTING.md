# Contributing to GitHub Portfolio Analyzer

First off, thank you for considering contributing to GitHub Portfolio Analyzer! It's people like you that make this tool better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by respect, kindness, and professionalism. Please treat everyone with courtesy.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use cases** - why would this be useful?
- **Mockups or examples** if applicable
- **Alternative solutions** you've considered

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Test your changes thoroughly
4. Update documentation as needed
5. Write clear, descriptive commit messages
6. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/github-portfolio-analyzer.git

# Create a branch
git checkout -b feature/your-feature-name

# Make changes and test locally
python -m http.server 8000

# Commit changes
git add .
git commit -m "Add your descriptive commit message"

# Push to your fork
git push origin feature/your-feature-name
```

## Coding Guidelines

### JavaScript
- Use modern ES6+ syntax
- Keep functions focused and single-purpose
- Add comments for complex logic
- Use meaningful variable names
- Avoid deep nesting

### CSS
- Follow BEM-like naming conventions
- Use CSS variables for colors and spacing
- Keep selectors specific but not overly complex
- Organize styles logically

### HTML
- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Keep structure clean and readable

## Testing

Before submitting:
- Test with multiple GitHub profiles
- Verify responsive design on different screen sizes
- Check browser console for errors
- Test edge cases (no repos, private profile, etc.)

## Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

Examples:
```
Add language diversity scoring algorithm
Fix profile avatar loading issue
Update documentation for API rate limits
Refactor scoring calculation logic
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
