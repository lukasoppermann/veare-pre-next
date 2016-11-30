set :app_dir, "~/apps/#{fetch(:application)}"
set :deploy_to, "~/apps/#{fetch(:application)}/app"
set :branch, 'html'

server '139.59.156.243', user: 'root', roles: %w{web app db}
