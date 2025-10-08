# 🔒 SECURITY SETUP - READ THIS FIRST!

## ⚠️ IMPORTANT: Protecting Your Passwords

Your passwords and sensitive information are currently visible in `application.properties`. Follow these steps to secure them:

## 🚀 Quick Setup for New Team Members

### When cloning this project to a new PC:

1. **Copy the template file:**
   ```bash
   cp src/main/resources/application-template.properties src/main/resources/application.properties
   ```

2. **Edit `application.properties` with your real values:**
   - Replace `YOUR_MYSQL_PASSWORD_HERE` with your MySQL password
   - Replace `YOUR_GMAIL_EMAIL_HERE` with your Gmail address
   - Replace `YOUR_GMAIL_APP_PASSWORD_HERE` with your Gmail app password
   - Replace `GENERATE_A_LONG_RANDOM_SECRET_KEY_HERE...` with a secure JWT secret

3. **Your `application.properties` file will be ignored by git and won't be uploaded to GitHub**

## 📧 Gmail App Password Setup

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable it)
3. Security → App passwords
4. Generate a new app password for "Mail"
5. Use this 16-character password in your config

## 🔐 What's Protected

- ✅ `application-template.properties` - Safe template (gets uploaded to GitHub)
- ❌ `application.properties` - Your real passwords (stays on your computer)

## 🆘 If You Already Uploaded Passwords to GitHub

1. **Change all your passwords immediately**
2. **Generate a new Gmail app password**
3. **Create a new JWT secret**
4. **Follow this security setup**

## 📋 File Structure After Setup

```
src/main/resources/
├── application-template.properties  ✅ Safe template (in GitHub)
├── application.properties           ❌ Your secrets (not in GitHub)
└── static/                         ✅ Safe files (in GitHub)
```

---

**🔒 Remember: Never commit `application.properties` with real passwords to GitHub!**