#!/bin/sh
set -e

echo "[api] aplicando schema no SQLite..."
npx prisma db push --skip-generate

echo "[api] executando seed..."
node dist/seed.js

echo "[api] iniciando servidor..."
exec node dist/server.js
