-- Admin seed SQL for WebCraft (PostgreSQL)
-- Password: admin123 (SHA-256 hash)
INSERT INTO "Admin" ("id", "email", "password", "name", "createdAt", "updatedAt")
VALUES (
  'admin-default-001',
  'admin@webcraft.ca',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'WebCraft Admin',
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO NOTHING;
