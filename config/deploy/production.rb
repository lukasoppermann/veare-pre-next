set :deploy_to, "/home/veare"
set :branch, 'master'

server '138.68.112.177', user: 'root', roles: %w{web app db}
