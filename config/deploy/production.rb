set :deploy_to, "/home/veare"
set :branch, 'html'

server '207.154.204.173', user: 'root', roles: %w{web app db}
