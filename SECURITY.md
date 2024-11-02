# Security Policy

## Supported Versions

Currently supported versions of TaskHub Frontend with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Features

TaskHub implements several security measures:

- JWT-based authentication
- Automatic session timeout
- Secure password handling
- CORS protection
- Environment variable protection
- XSS prevention through React's built-in protections
- HTTPS enforcement in production

## Reporting a Vulnerability

We take the security of TaskHub seriously. If you believe you have found a security vulnerability, please report it to us following these steps:

1. **DO NOT** disclose the vulnerability publicly
2. Send a detailed report to: [icham.mmadi@gmail.com](mailto:icham.mmadi@gmail.com)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to expect:

- Acknowledgment of your report within 48 hours
- Regular updates on the progress
- Credit for responsible disclosure (if desired)

### Response Timeline:

- **24-48 hours**: Initial response
- **1 week**: Vulnerability assessment
- **2-4 weeks**: Fix implementation (depending on severity)

## Best Practices for Users

1. **Authentication**
   - Use strong passwords
   - Don't share authentication tokens
   - Log out after each session

2. **API Access**
   - Use HTTPS only
   - Keep API keys secure
   - Don't expose environment variables

3. **Development**
   - Keep dependencies updated
   - Review security advisories
   - Follow secure coding practices

## Security Contact

For security concerns, please contact:
- Primary: [icham.mmadi@gmail.com](mailto:icham.mmadi@gmail.com)
- Website: [https://icham-mmadi.fr](https://icham-mmadi.fr)

## Attribution

We appreciate the security research community's efforts in responsibly disclosing vulnerabilities. Contributors who report valid security issues will be acknowledged (unless they prefer to remain anonymous).

---

Last updated: 2024-03-20
