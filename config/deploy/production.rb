set :deploy_to, "/home/veare"
set :branch, 'html'

server '138.68.112.177', user: 'root', roles: %w{web app db}
