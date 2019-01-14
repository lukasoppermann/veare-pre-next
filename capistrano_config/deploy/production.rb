set :deploy_to, "/home"
set :branch, 'master'

server '104.248.133.212', user: 'root', roles: %w{web app db}
