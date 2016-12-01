#!/usr/bin/env bash
set -ex

HOME=/home/vagrant

# Create working dir & set permissions
mkdir -p /code
chown -R vagrant:vagrant /code

# Install Node.js (v6) and common global libs
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs
npm install -g mocha istanbul babel-cli babel-preset-es2016 eslint eslint-config-airbnb

# Install some useful stuff
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    git \
    samba \
    google-chrome-stable
timedatectl set-timezone Europe/Amsterdam
locale-gen
localectl set-locale LANG="en_US.UTF-8"

# Setup Docker config
# mkdir -p /etc/systemd/system/docker.service.d
# tee /etc/systemd/system/docker.service.d/docker.conf <<-'EOF'
# [Service]
# ExecStart=
# ExecStart=/usr/bin/docker daemon -D -H tcp://0.0.0.0:2375
# EOF

# Install & run docker engine
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo 'deb https://apt.dockerproject.org/repo ubuntu-xenial main' > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-engine
systemctl daemon-reload
systemctl restart docker
systemctl enable docker
usermod -aG docker vagrant

# Install docker compose
sudo curl -L https://github.com/docker/compose/releases/download/1.9.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo curl -L https://raw.githubusercontent.com/docker/compose/$(sudo docker-compose version --short)/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose

# Install docker machine
curl -L https://github.com/docker/machine/releases/download/v0.8.2/docker-machine-`uname -s`-`uname -m` >/usr/local/bin/docker-machine && \
chmod +x /usr/local/bin/docker-machine

# sudo cp /lib/systemd/system/docker.service /etc/systemd/system/docker.service
# sudo sed -i "s|-H fd://|-H tcp://0.0.0.0:2375|" /etc/systemd/system/docker.service
# sudo systemctl daemon-reload
# sudo service docker restart


# Setup Docker Compose
curl -L https://github.com/docker/compose/releases/download/1.8.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Setup Git
git config --global core.autocrlf false
git config --global color.ui true

# Setup Samba
# tee /etc/samba/smb.conf <<-'EOF'
# [global]
# server string = Vagrant VM
# log file = /var/log/samba/log.%m
# max log size = 50
# security = user
# passdb backend = tdbsam

# [code]
# path = /code
# public = yes
# browseable = yes
# writable = yes
# map archive = no
# create mask = 0644
# directory mask = 0755
# EOF

# systemctl restart smb
# systemctl enable smb

# echo -ne "vagrant\nvagrant\n" | smbpasswd -a -s vagrant