# Use the official lightweight Nginx web server
FROM nginx:alpine

# Copy all frontend files (index.html, public folder, etc.) into Nginx's hosting folder
COPY . /usr/share/nginx/html

# Expose port 80 (Nginx's default internal port)
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]