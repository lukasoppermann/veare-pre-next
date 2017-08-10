set :deploy_to, "/home/sites/veare"
set :branch, 'master'

server '138.68.112.177', user: 'root', roles: %w{web app db}
