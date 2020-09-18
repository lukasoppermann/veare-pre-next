# config valid only for Capistrano 3.1
# lock '3.10.1'
# lock '3.11.0'
# lock '3.13.0'
lock '3.14.1'
set :stages, ["production"]
set :default_stage, "production"
set :ssh_options, {:forward_agent => true}

set :application, 'veare'
set :repo_url, 'git@github.com:lukasoppermann/veare.git'
set :user, "lukasoppermann"

set :format_options, log_file: "logs/capistrano.log"
set :default_env, { path: "/usr/local/bin:$PATH" }

namespace :deploy do

    desc 'Setup release'
    task :release do
        on roles(:app), in: :groups, limit:1 do
            # move to app dir + remove current (bad due to root linkage) + add new current
            execute "cd #{fetch(:deploy_to)} && rm current && ln -sfn ./releases/#{fetch(:release_timestamp)} ./current"
            # upload .env file from local computer to current directory on server
            # upload!('.env' , "#{fetch(:deploy_to)}/current/.env")
            # stop all forever servers
            # execute "cd #{fetch(:deploy_to)}/current && node_modules/.bin/forever stopall"
            # start server
            execute "cd #{fetch(:deploy_to)}/current && npm run restart-server"
        end
    end

end

after "deploy:symlink:release", "deploy:release"
