## install nginx

``` bash
sudo apt-get install -y nginx
run ip, not working then http open security
cd /etc/nginx/sites-available

sudo vim default

location /api {
  rewrite ^\/api\/(.*)$ /api/$1 break;
  proxy_pass http://localhost:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

sudo systemctl restart nginx
```

2. Add domain to nginx configuration

```bash
server_name quanthinh97.com www.quanthinh97.com;

location / {
  proxy_pass http://localhost:8000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

3. add SSL to domain
```bash
sudo apt-get update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d quanthinh97.com
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```