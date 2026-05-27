# WebCraft — Professional Websites for Local Businesses
# موقع WebCraft — مواقع احترافية للشركات المحلية

---

## 🖥️ Windows 64-bit Setup

### المتطلبات | Requirements

| المتطلب | الحد الأدنى | ملاحظات |
|---------|-------------|---------|
| **Windows** | Windows 10/11 (64-bit) | يعمل أيضاً على Windows 8.1 |
| **Node.js** | v18 أو أحدث | [تحميل من هنا](https://nodejs.org/en/download/) |
| **RAM** | 2 GB | 4 GB مُوصى به |
| **Disk Space** | 500 MB | للتطبيق والـ dependencies |

---

### 📥 الخطوة 1: تثبيت Node.js

1. اذهب إلى: https://nodejs.org/en/download/
2. حمّل **Windows Installer (.msi)** - إختر **64-bit**
3. شغّل المثبّت واتبع التعليمات
4. تأكد من تفعيل خيار **"Add to PATH"** أثناء التثبيت
5. أعد تشغيل الكمبيوتر بعد التثبيت

**للتحقق من التثبيت:**
```cmd
node -v
npm -v
```

---

### 📦 الخطوة 2: إعداد المشروع

**الطريقة السهلة (تلقائية):**
```cmd
setup.bat
```

**الطريقة اليدوية:**
```cmd
npm install
npx prisma generate
mkdir db
npx prisma db push
```

---

### 🚀 الخطوة 3: تشغيل الموقع

**لوحة التحكم التفاعلية:**
```cmd
run.bat
```

**أو مباشرة:**
```cmd
:: تطوير
npm run dev

:: إنتاج
npm run build
npm run start
```

افتح المتصفح على: **http://localhost:3000**

---

### 🔐 بيانات المدير | Admin Login

| الحقل | القيمة |
|-------|--------|
| **البريد** | admin@webcraft.ca |
| **كلمة المرور** | admin123 |

---

### 🔑 إعداد Google OAuth (اختياري)

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد
3. اذهب إلى **APIs & Services → Credentials**
4. أنشئ **OAuth 2.0 Client ID**
5. أضف Redirect URI: `http://localhost:3000/api/auth/callback/google`
6. انسخ **Client ID** و **Client Secret**
7. افتح ملف `.env` وأضف:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```
8. أعد تشغيل السيرفر

---

### 📁 هيكل الملفات | File Structure

```
webcraft/
├── .env                    # متغيرات البيئة
├── setup.bat               # سكريبت الإعداد
├── run.bat                 # لوحة التحكم
├── seed-admin.sql          # إنشاء حساب المدير
├── package.json            # الحزم والمكتبات
├── next.config.ts          # إعدادات Next.js
├── tsconfig.json           # إعدادات TypeScript
├── tailwind.config.ts      # إعدادات Tailwind CSS
├── components.json         # إعدادات shadcn/ui
├── prisma/
│   └── schema.prisma       # مخطط قاعدة البيانات
├── public/
│   ├── logo.svg            # شعار الموقع
│   └── robots.txt          # إعدادات محركات البحث
└── src/
    ├── app/
    │   ├── page.tsx        # الصفحة الرئيسية
    │   ├── layout.tsx      # التخطيط الرئيسي
    │   ├── globals.css     # أنماط CSS العامة
    │   └── api/
    │       ├── auth/
    │       │   ├── [...nextauth]/route.ts   # NextAuth API
    │       │   └── register/route.ts         # تسجيل حساب جديد
    │       ├── admin/
    │       │   ├── login/route.ts            # دخول المدير
    │       │   ├── seed/route.ts             # إنشاء المدير
    │       │   └── stats/route.ts            # إحصائيات
    │       ├── orders/route.ts               # الطلبات
    │       ├── checkout/route.ts             # الدفع
    │       ├── chat/route.ts                 # المساعد الذكي
    │       ├── domain-check/route.ts         # فحص الدومين
    │       └── stripe-webhook/route.ts       # Stripe
    ├── components/
    │   ├── auth-provider.tsx   # مزود المصادقة
    │   └── ui/                 # مكونات shadcn/ui
    ├── hooks/
    │   ├── use-toast.ts
    │   └── use-mobile.ts
    └── lib/
        ├── db.ts             # قاعدة البيانات
        └── utils.ts          # أدوات مساعدة
```

---

### ✨ المميزات | Features

- 🌐 **12 نوع موقع** للشركات المحلية
- 🤖 **مساعد ذكي AI** للرد على الاستفسارات
- 🔍 **فحص الدومين** الحقيقي عبر DNS
- 💱 **9 عملات** مع تحويل تلقائي
- 🔐 **مصادقة حقيقية** (Google + Email/Password)
- 💳 **دفع Stripe** مع وضع تجريبي
- 📊 **لوحة إدارة** كاملة
- 📱 **تصميم متجاوب** لجميع الأجهزة
- 🌙 **وضع ليلي/نهاري**
- 🎨 **24 لون** لتصميم الموقع
- 📝 **حفظ تلقائي** لبيانات الطلب

---

### ⚠️ حل المشاكل | Troubleshooting

**مشكلة: "node" غير معروف**
→ أعد تثبيت Node.js مع تفعيل "Add to PATH"

**مشكلة: خطأ في npm install**
→ جرّب: `npm install --legacy-peer-deps`

**مشكلة: المنفذ 3000 مستخدم**
→ شغّل: `npx next dev -p 3001`

**مشكلة: قاعدة البيانات لا تعمل**
→ شغّب:
```cmd
rmdir /s /q db
mkdir db
npx prisma db push
```

**مشكلة: الصفحة بيضاء**
→ امسح الكاش:
```cmd
rmdir /s /q .next
npm run dev
```

---

### 🛠️ التقنيات | Tech Stack

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Next.js | 16 | إطار العمل |
| React | 19 | واجهة المستخدم |
| TypeScript | 5 | لغة البرمجة |
| Tailwind CSS | 4 | التصميم |
| shadcn/ui | latest | مكونات UI |
| Prisma | 6 | قاعدة البيانات |
| SQLite | 3 | قاعدة بيانات محلية |
| NextAuth.js | 4 | المصادقة |
| Stripe | latest | الدفع |
| Framer Motion | 12 | الحركات |
| z-ai-web-dev-sdk | latest | المساعد الذكي |

---

### 📄 الترخيص | License

WebCraft - Professional Websites for Local Businesses
All rights reserved.
