# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "box-cutter/ubuntu1604-desktop"
  config.vm.box_download_insecure = true
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.network "forwarded_port", guest: 137, host: 137, protocol: "udp"
  config.vm.network "forwarded_port", guest: 138, host: 138, protocol: "udp"
  config.vm.network "forwarded_port", guest: 139, host: 139, protocol: "tcp"
  # config.vm.network "forwarded_port", guest: 445, host: 445, protocol: "tcp"
  # config.vm.network "forwarded_port", guest: 445, host: 445, protocol: "udp"
  config.vm.network "forwarded_port", guest: 2375, host: 2375, protocol: "tcp"
  config.vm.network "forwarded_port", guest: 5432, host: 5432, protocol: "tcp"
  config.vm.network "forwarded_port", guest: 80, host: 80
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 4000, host: 4000
  config.vm.network "forwarded_port", guest: 7200, host: 7200
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 8082, host: 8082
  config.vm.network "forwarded_port", guest: 9200, host: 9200
  config.vm.network "forwarded_port", guest: 9201, host: 9201
  config.vm.network "forwarded_port", guest: 9300, host: 9300
  config.vm.network "forwarded_port", guest: 9301, host: 9301

  config.vm.provision "file", source: "resources/vagrant", destination: "/home"
  config.vm.provision "shell", path: "script/vagrant-provision.sh"
  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  user_dir = Dir.home()
  grid_disk = "/C/Users/reinv/Documents/edna-ld-disk1.vdi"

  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    vb.gui = true
    vb.name = "edna_ld_develop"
    vb.memory = "6144"
    vb.cpus = 4
    if !File.exist?(grid_disk)
      vb.customize [
        'clonehd',
        user_dir + "/VirtualBox\ VMs/grid_develop/ubuntu1604-desktop-disk1.vmdk",
        grid_disk,
        "--format", "vdi"
      ]
      vb.customize [
        "storageattach",
        :id,
        "--storagectl",
        "SATA Controller",
        "--medium",
        grid_disk,
        "--port",
        "0",
        "--device",
        "0",
        "--type",
        "hdd"
      ]
    end
  end

end