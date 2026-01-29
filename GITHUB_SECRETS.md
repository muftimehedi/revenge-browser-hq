# GitHub Secrets Setup Guide

## 📋 Overview

This guide explains how to add all required GitHub Secrets for the CI/CD pipeline to deploy your Revenge Browser project to Google Cloud.

**Total Secrets Required: 21**

---

## 🚀 Quick Start

### 1. Go to GitHub Secrets Page

Click this link or copy/paste into your browser:
```
https://github.com/muftimehedi/revenge-browser-hq/settings/secrets/actions
```

### 2. You'll See This Page

Click the **"New repository secret"** button.

---

## 📝 Add Each Secret

For each secret below:
1. Click **"New repository secret"**
2. Enter the **Name** exactly as shown
3. Paste the **Value**
4. Click **"Add secret"**

---

## 🔑 Core Secrets (3 required)

### 1. GCP_PROJECT_ID
```
Name: GCP_PROJECT_ID
Value: revenge-browser-hq
```

### 2. GCP_ARTIFACT_REPO
```
Name: GCP_ARTIFACT_REPO
Value: revenge-browser
```

### 3. GCP_SA_KEY
```
Name: GCP_SA_KEY
Value: ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAicmV2ZW5nZS1icm93c2VyLWhxIiwKICAicHJpdmF0ZV9rZXlfaWQiOiAiN2JiZDAwNjFjZDk2YWQ4MjZkMzE5NGM2M2MzMWExNjIyOWRhMDBjMiIsCiAgInByaXZhdGVfa2V5IjogIi0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZRSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2N3Z2dTakFnRUFBb0lCQVFEY0FmR3RseVFtNEJwclxudFJLZXN4ZHJCdzByZWN1MlhEb0ZVdlVHNWZDamZCNFlONHlJcG5iWFRnYTcxbmp1SkkvL00xZk1JcjNlYThNbFxuZExPUEFsVHR5YlFQQjhYbFoxanBISGNxd0tNY0R5a2ZidWlQeXRMT0FTSjNDYWZCY2luNVdVRjlzQi9BY3ZaV1xuV0FPTEU1cXgxT0NzNTdDWlQyT21mazd2dTV0QlhTVHRyOW5VRmEvNXlQUlBlTVozY01ad296bnRzWEdmTncyYVxuRFRnbHdxbnFxQjg2cEtjeWp5Qkt2c1R1eURVcVQ4MG41dmxuUkJ3V3JyaS9ycnBsZXNEcFdFWTloQjhYK0wrclxuMXl5SVpUTHpmQlhWS1pFYUlHd010YjIrc3FwVURQbjM4VVpPdElVdkNuOVdsOTA5NHh5MDgrM2IxaXU3TStXdFxuSEEvWVNWQzlBZ01CQUFFQ2dnRUFIVTU4L1J5M0NoNnNKbERXakNGYkt6eWpPbmxjODR4UmhzZ0lMOFVOaXhtTFxuZ0xwVmxCWm9ta0dna0FELzF1a3o3VkRQanNmSmh3bGYwMnQ2UjhDTnc2Y3N2eHZQOXNFUGpPM255ZUFqV2llQ1xuMk5jVFQ2UTY5SW9lSnpFNEVZSzlxS09GSDlNSVI4Q0lvL1BSZFFORmhQNEFkOGZkTkc3bzNWTFIvUWxHb3l3ZlxuOWhDUzdXaFR4SDZTUDJMaEFnUWIzdFBuL0xrbmV6L05lakpqVFhEUFNtMDVBNzZ5NHZuTFYrRFgvVENFc1lZelxualc2dUFJY0ozQWFQMXpMR1prWVFhaXY4YXNmUFdNSS8zbys0V3JnazZGRmhITHlBbWVFWVVQM0JFd3pGVHIwcFxuRVRRMk5RZnhMb0R1STNtaGx6ZkJyVVpLcG43Wk5uK2JVYVdPbHJFUUFRS0JnUUR2K0ZvNjhaN05RckE5YVlwc1xucWk3bytrOVFKNnViaG9DMWJVdGxXK0Fpc3JjeldWNjVBMVU0SktoSkRSemp4ZGJIWXE5cnZXcmx6TFNURDlZSlxuWDlTUTNTZUFPRlBlY2t4S1QrTFhKMGJkcUJNdTVFbmUyWnNjcDlSeWRuMnpGSXF0cWtIMWZBZFNuWlVXUW94T1xuNGZtcENpZ3FIbU9OTkRRa2FDRnhia2hXQVFLQmdRRHF0RGdYYUZKZk01alczTjI5NDJURG9TWEtxK1FNZ3FiMVxuRHlUSEgyUVBtU284dWtmSjVBVGhIdDVjZ1BGMi9CeHhvcXFVVUdFV3czdndm5pL1TWExwMXR3VjVTU2UrcW0rZlxuSnRUQS9IYWNJTkthWnNTdHlKZ0RZaDhiaE11UWM3RTQ4Rlo3RW14RWdHT0EvclF5aktyM0VWOXhmZkkvSUNvYVxudXVVbGlGWFN2UUtCZ0FzQnV6SEU3MkcrMDFLZHlxbWRUTFdHOWFoWmlYZUN2ZGlVZ01iUFpnSnhiQkhBNGFWZVxuejhQWmVwYVBNV29KSXdiV01mR2hLSXdOemFLSk1Xb1FxVEZUMDRJQUUyaTZtV0UzTk5KbGpNeVI3djlSblVuSlxuZFdIbEdNdC9QOWk4OG5kd3ZjSEN4SnMzZXlVZ1BFdEo5aWVZdmFyZzVmUU9GdTRza0l3aFlOUUJBb0dBZlJKRVxud2RTSjhNbWlMUDNOL0o3czE0Tk1qRkJHV3BWVk8wb3lveG9MVEhTbW1XMzdTNDhET3FRa2dzOEQzaEJEYUJyelxuSTg0aHJ1dkZaRmdPTjUvS2pXaFd0bWRSa3Ixb2RqdFBMUGhjako3QkhCNmZ1S3dvdGNUWUp1WUJSSjBpVitGYlxuZElKQXg5QlROaTZGQUZzTjBGT2x0T2tVNnFiTlNTbEhhMVRYeDFFQ2dZRUF6eDhnR1YrNGRzRDZYOFBVaEZWSVxuM04xdVArdVZJOVRpM2J5U0dCVWU2MWhDK1grKzlpZHB4a1RsWnVIQWFkOUtHeFNDZHRBR2IxZHV6emQ1SGgrNlxuYjlPRG55dTA5L3BCNWhya3BjUE93ZE5wYS8vVzh2dHQ1dXg3RGpsajhnUE91bkpWNEVPaHc3QzJacm12UWNsZVxuazBqMm5XOHlScmJaZUwrS2Z0OWIzUFU9XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4iLAogICJjbGllbnRfZW1haWwiOiAiZ2l0aHViLWFjdGlvbnNAcmV2ZW5nZS1icm93c2VyLWhxLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwNTUxNDg1NjcxNjMyNDQ5MzMwNCIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvZ2l0aHViLWFjdGlvbnMlNDByZXZlbmdlLWJyb3dzZXItaHEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0K
```

---

## 🔷 Dev Environment Secrets (9 required)

### 4. DEV_APP_URL
```
Name: DEV_APP_URL
Value: https://dev.revengebrowser.com
```

### 5. DEV_DB_HOST
```
Name: DEV_DB_HOST
Value: revenge-browser-hq:us-central1:revenge-browser-dev-db
```

### 6. DEV_DB_DATABASE
```
Name: DEV_DB_DATABASE
Value: revenge_browser_dev
```

### 7. DEV_DB_USERNAME
```
Name: DEV_DB_USERNAME
Value: postgres
```

### 8. DEV_DB_PASSWORD
```
Name: DEV_DB_PASSWORD
Value: hpfArgUglX2K3lNkSGTQOTY5VJhj3lE8
```

### 9. DEV_REDIS_HOST
```
Name: DEV_REDIS_HOST
Value: 127.0.0.1
```

### 10. DEV_REDIS_PASSWORD
```
Name: DEV_REDIS_PASSWORD
Value: (leave this field empty)
```

### 11. DEV_APP_KEY
```
Name: DEV_APP_KEY
Value: base64:xnDQovxN3Vk6EGmVGTalcsiNj3iIHp+5YMcqYka5Tu8=
```

### 12. DEV_STORAGE_BUCKET
```
Name: DEV_STORAGE_BUCKET
Value: revenge-browser-dev-apk
```

---

## 🔶 Production Environment Secrets (9 required)

### 13. PROD_APP_URL
```
Name: PROD_APP_URL
Value: https://revengebrowser.com
```

### 14. PROD_DB_HOST
```
Name: PROD_DB_HOST
Value: revenge-browser-hq:us-central1:revenge-browser-prod-db
```

### 15. PROD_DB_DATABASE
```
Name: PROD_DB_DATABASE
Value: revenge_browser_prod
```

### 16. PROD_DB_USERNAME
```
Name: PROD_DB_USERNAME
Value: postgres
```

### 17. PROD_DB_PASSWORD
```
Name: PROD_DB_PASSWORD
Value: Maubd3+fyICFZrS04o3Bi55zyP7kDqdi
```

### 18. PROD_REDIS_HOST
```
Name: PROD_REDIS_HOST
Value: 127.0.0.1
```

### 19. PROD_REDIS_PASSWORD
```
Name: PROD_REDIS_PASSWORD
Value: (leave this field empty)
```

### 20. PROD_APP_KEY
```
Name: PROD_APP_KEY
Value: base64:xnDQovxN3Vk6EGmVGTalcsiNj3iIHp+5YMcqYka5Tu8=
```

### 21. PROD_STORAGE_BUCKET
```
Name: PROD_STORAGE_BUCKET
Value: revenge-browser-prod-apk
```

---

## ✅ Verification

After adding all secrets, verify they appear in your secrets list:

**Go to:** https://github.com/muftimehedi/revenge-browser-hq/settings/secrets/actions

You should see all 21 secrets listed:
- GCP_PROJECT_ID
- GCP_ARTIFACT_REPO
- GCP_SA_KEY
- DEV_APP_URL
- DEV_DB_HOST
- DEV_DB_DATABASE
- DEV_DB_USERNAME
- DEV_DB_PASSWORD
- DEV_REDIS_HOST
- DEV_REDIS_PASSWORD
- DEV_APP_KEY
- DEV_STORAGE_BUCKET
- PROD_APP_URL
- PROD_DB_HOST
- PROD_DB_DATABASE
- PROD_DB_USERNAME
- PROD_DB_PASSWORD
- PROD_REDIS_HOST
- PROD_REDIS_PASSWORD
- PROD_APP_KEY
- PROD_STORAGE_BUCKET

---

## 🚀 After Adding Secrets

Once all secrets are added, GitHub Actions will automatically:

1. **Run tests** on your code
2. **Build Docker image** and push to Google Cloud
3. **Deploy to dev.revengebrowser.com** (when pushing to `dev-release` branch)
4. **Deploy to revengebrowser.com** (when pushing to `main` branch)

### Monitor Deployment

Watch your deployment here:
```
https://github.com/muftimehedi/revenge-browser-hq/actions
```

---

## 📋 Quick Reference (Copy All)

```
CORE:
GCP_PROJECT_ID = revenge-browser-hq
GCP_ARTIFACT_REPO = revenge-browser
GCP_SA_KEY = (see above - long base64 string)

DEV:
DEV_APP_URL = https://dev.revengebrowser.com
DEV_DB_HOST = revenge-browser-hq:us-central1:revenge-browser-dev-db
DEV_DB_DATABASE = revenge_browser_dev
DEV_DB_USERNAME = postgres
DEV_DB_PASSWORD = hpfArgUglX2K3lNkSGTQOTY5VJhj3lE8
DEV_REDIS_HOST = 127.0.0.1
DEV_REDIS_PASSWORD = (empty)
DEV_APP_KEY = base64:xnDQovxN3Vk6EGmVGTalcsiNj3iIHp+5YMcqYka5Tu8=
DEV_STORAGE_BUCKET = revenge-browser-dev-apk

PRODUCTION:
PROD_APP_URL = https://revengebrowser.com
PROD_DB_HOST = revenge-browser-hq:us-central1:revenge-browser-prod-db
PROD_DB_DATABASE = revenge_browser_prod
PROD_DB_USERNAME = postgres
PROD_DB_PASSWORD = Maubd3+fyICFZrS04o3Bi55zyP7kDqdi
PROD_REDIS_HOST = 127.0.0.1
PROD_REDIS_PASSWORD = (empty)
PROD_APP_KEY = base64:xnDQovxN3Vk6EGmVGTalcsiNj3iIHp+5YMcqYka5Tu8=
PROD_STORAGE_BUCKET = revenge-browser-prod-apk
```

---

## ❓ Troubleshooting

**Q: I can't find the secrets page**
- Make sure you're logged into GitHub
- Use the direct link above
- Go to: Settings → Secrets and variables → Actions

**Q: The workflow fails after adding secrets**
- Check all secret names match exactly (case-sensitive)
- Verify GCP_SA_KEY has no extra spaces
- Make sure you added all 21 secrets

**Q: How do I update a secret?**
- Click on the secret name
- Click "Update secret"
- Paste new value and save

---

## 📞 Support

If you need help:
- Check the main documentation: `DOCUMENTATION.md`
- GitHub Issues: https://github.com/muftimehedi/revenge-browser-hq/issues

---

**Last Updated:** January 29, 2026
