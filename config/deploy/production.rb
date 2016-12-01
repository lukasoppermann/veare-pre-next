set :deploy_to, "~/apps/#{fetch(:application)}"
set :branch, 'html'
set :server, "https://lukasoppermann.com"

server '139.59.156.243', user: 'root', roles: %w{web app db}
