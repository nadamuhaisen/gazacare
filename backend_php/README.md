# GazaCare EMR - Pure PHP & MySQL Backend

هذا المجلد يحتوي على الواجهة الخلفية الكاملة والمبرمجة بلغة **Pure PHP (PHP 8.0+)** مع قاعدة بيانات **MySQL / MariaDB** دون الحاجة إلى أطر عمل ثقيلة (Framework-agnostic)، وجاهزة للتشغيل على أي خادم استضافة (Apache, Nginx, XAMPP, Laragon, cPanel, VPS).

---

## 📁 هيكلية المجلد (Directory Structure)

```text
backend_php/
├── config/
│   ├── Database.php        # فئة الاتصال بقاعدة البيانات عبر PDO (UTF-8mb4)
│   └── cors.php            # الترويسات المشتركة، CORS، ودوال الـ JSON Responses
├── api/
│   ├── auth/
│   │   ├── login.php       # تسجيل الدخول والمصادقة
│   │   └── register.php    # تسجيل حساب جديد
│   ├── patients/
│   │   └── index.php       # جلب المرضى والبحث والتصفية
│   ├── appointments/
│   │   └── index.php       # جلب وجدولة المواعيد
│   ├── lab/
│   │   └── requests.php    # إدارة طلبات الفحوصات واعتماد النتائج والحالات الحرجة
│   ├── beds/
│   │   └── index.php       # إدارة الأسرة ونسب الإشغال
│   └── prescriptions/
│       └── index.php       # إصدار واسترجاع الوصفات الطبية الإلكترونية
└── schema.sql              # مخطط قاعدة البيانات الكامل مع الجداول والبيانات الأولية
```

---

## 🚀 طريقة التثبيت والتشغيل (How to Run)

### 1. استيراد قاعدة البيانات (MySQL Import)
1. افتح أداة **phpMyAdmin** أو سطر الأوامر (MySQL CLI).
2. أنشئ قاعدة بيانات باسم `gazacare_db`:
   ```sql
   CREATE DATABASE gazacare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. قم باستيراد الملف `backend_php/schema.sql`.

### 2. ضبط إعدادات الاتصال (Database Configuration)
عدّل بيانات الاتصال في `backend_php/config/Database.php` أو عبر متغيرات البيئة:
```php
private string $host = '127.0.0.1';
private string $db_name = 'gazacare_db';
private string $username = 'root';
private string $password = '';
```

### 3. تشغيل الخادم المحلي (Local PHP Server)
يمكنك تشغيل الخادم فوراً عبر أمر PHP المدمج:
```bash
cd backend_php
php -S 127.0.0.1:8000
```

---

## 🔐 الحسابات التجريبية الافتراضية (Default Logins)
كلمة المرور لجميع الحسابات هي: `password123`

1. **طبيب (Doctor):** `doctor@gazacare.ps`
2. **مريض (Patient):** `patient@gazacare.ps`
3. **مدير مستشفى (Hospital Manager):** `manager@gazacare.ps`
4. **أخصائي مختبر (Lab Analyst):** `lab@gazacare.ps`
