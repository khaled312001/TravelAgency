-- إنشاء حساب إدارة واحد فقط
-- استخدم هذا الملف إذا كنت تريد إضافة حساب إدارة واحد فقط

-- إدراج حساب الإدارة الرئيسي
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES (
  'admin@wonderland.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  'مدير النظام', 
  'super_admin'
)
ON CONFLICT (email) DO NOTHING;

-- معلومات الحساب:
-- البريد الإلكتروني: admin@wonderland.com
-- كلمة المرور: admin123
-- الصلاحيات: مدير عام (جميع الصلاحيات)
