# Ke khai bao hiem

Website Node.js dua tren giao dien clone co san, them chuc nang dang ky, dang nhap, trang admin rieng, dashboard so nguoi dang ky va xuat Excel.

## Chay local

```powershell
npm start
```

Mo `http://localhost:3000`.

Trang chinh dung giao dien clone trong `public/index.html`. Nut `Dang ky` mo form dang ky that, nut `Dang nhap` trong modal clone goi API that.

Trang admin: `http://localhost:3000/admin`

Tai khoan admin mac dinh:

- User: `admin`
- Password: `admin12345`

Nen doi tai khoan admin khi deploy:

```powershell
$env:ADMIN_USERNAME="ten-admin"
$env:ADMIN_PASSWORD="mat-khau-manh"
npm start
```

## Deploy

Deploy nhu mot Node.js app thong thuong. Len server can cau hinh bien moi truong:

- `PORT`: cong chay app, mac dinh `3000`
- `ADMIN_USERNAME`: tai khoan admin
- `ADMIN_PASSWORD`: mat khau admin
- `DATA_DIR`: thu muc luu du lieu, mac dinh `./data`

Du lieu nguoi dung duoc luu trong `data/users.json`. Khi deploy production, nen gan `DATA_DIR` vao volume/persistent disk de khong mat du lieu sau moi lan redeploy.

## Docker

```powershell
docker build -t kekhaibaohiem .
docker run -p 3000:3000 -e ADMIN_USERNAME=admin -e ADMIN_PASSWORD=mat-khau-manh -v ${PWD}/data:/app/data kekhaibaohiem
```
