# config valid only for Capistrano 3.1
# require 'capistrano/ext/multistage'
# lock '3.5.0'
lock '3.7.1'
set :stages, ["staging","production"]
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
            execute "docker stop veare || true && docker rm veare || true"
            execute "cd #{fetch(:deploy_to)}/current/docker && docker-compose up -d"
            # execute "docker exec veare npm i --only=production"
        end
    end

end

after "deploy:symlink:release", "deploy:release"
