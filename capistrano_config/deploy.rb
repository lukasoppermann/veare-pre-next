# config valid only for Capistrano 3.1
# require 'capistrano/ext/multistage'
# lock '3.10.1'
# lock '3.11.0'
lock '3.13.0'
set :stages, ["production"] #"staging",
set :default_stage, "production"
set :ssh_options, {:forward_agent => true}

set :application, 'veare'
set :repo_url, 'git@github.com:lukasoppermann/veare.git'
set :user, "lukasoppermann"

set :format_options, log_file: "logs/capistrano.log"
set :default_env, { path: "/usr/local/bin:$PATH" }

# set :npm_target_path, -> { release_path } # default not set
# #set :npm_flags, '--production'    # default  --silent --no-progress
# set :npm_roles, :all                                     # default
# #set :npm_env_variables, {}                               # default
# set :npm_method, 'install'                               # default

namespace :deploy do

    desc 'Setup release'
    task :release do
        on roles(:app), in: :groups, limit:1 do
            # move to app dir + remove current (bad due to root linkage) + add new current
            execute "cd #{fetch(:deploy_to)} && rm current && ln -sfn ./releases/#{fetch(:release_timestamp)} ./current"
            upload!('.env' , "#{fetch(:deploy_to)}/current/.env")
            execute "cd #{fetch(:deploy_to)}/current && node_modules/.bin/forever stopall"
            execute "cd #{fetch(:deploy_to)}/current && npm run server"
        end
    end

end

after "deploy:symlink:release", "deploy:release"
