# config valid only for Capistrano 3.1
# require 'capistrano/ext/multistage'
lock '3.5.0'

set :stages, ["production"]
set :default_stage, "production"
set :ssh_options, {:forward_agent => true}

set :application, 'veare'
set :repo_url, 'git@github.com:lukasoppermann/veare.git'
set :user, "lukasoppermann"

set :format_options, log_file: "storage/logs/capistrano.log"
set :default_env, { path: "/usr/local/bin:$PATH" }

namespace :deploy do

    desc 'Setup release'
    task :composer_install do
        on roles(:app), in: :groups, limit:1 do
            # move to app dir + remove current (bad due to root linkage) + add new current
            execute "cd #{fetch(:deploy_to)} && rm current && ln -sfn ./releases/#{fetch(:release_timestamp)} ./current"
        end
    end

end

after "deploy:symlink:release", "deploy:composer_install"
