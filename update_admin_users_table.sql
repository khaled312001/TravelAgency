-- تحديث جدول admin_users لإضافة الحقول المطلوبة للملف الشخصي
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS position VARCHAR(255),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS security_settings JSONB DEFAULT '{}';

-- تحديث الحساب الإداري الرئيسي
UPDATE admin_users 
SET 
  email = 'info@worldtripagency.com',
  name = 'مدير النظام',
  phone = '+966500982394',
  position = 'مدير عام',
  department = 'الإدارة',
  birth_date = '1990-01-01',
  preferences = '{
    "darkMode": false,
    "language": "ar",
    "timezone": "Asia/Riyadh",
    "emailNotifications": true,
    "systemNotifications": true,
    "bookingNotifications": true
  }',
  security_settings = '{
    "twoFactor": false,
    "loginNotifications": true
  }'
WHERE email = 'admin@wonderland.com';

-- إنشاء حساب إداري جديد بالبريد الإلكتروني الصحيح
INSERT INTO admin_users (
  email, 
  password_hash, 
  name, 
  role, 
  phone, 
  position, 
  department, 
  birth_date,
  preferences,
  security_settings
) 
VALUES (
  'info@worldtripagency.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  'مدير النظام', 
  'super_admin',
  '+966500982394',
  'مدير عام',
  'الإدارة',
  '1990-01-01',
  '{
    "darkMode": false,
    "language": "ar",
    "timezone": "Asia/Riyadh",
    "emailNotifications": true,
    "systemNotifications": true,
    "bookingNotifications": true
  }',
  '{
    "twoFactor": false,
    "loginNotifications": true
  }'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  birth_date = EXCLUDED.birth_date,
  preferences = EXCLUDED.preferences,
  security_settings = EXCLUDED.security_settings;
