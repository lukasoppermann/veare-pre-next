set :deploy_to, "~/apps/#{fetch(:application)}"
set :branch, 'html'

server '139.59.156.243', user: 'root', roles: %w{web app db}
