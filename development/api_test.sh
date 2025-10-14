#!/bin/bash

# This works in nixos, put it in first line:
# #!/usr/bin/env bash

# Proxmox-serverin osoite
HOST="https://proxmox.example.com:8006"
HOSTNAME="proxmox hostname"

# Käyttäjätunnus ja token
USER="apiuser@pam"
TOKENID="mytoken"
TOKEN="PASTE_THIS_TOKEN_HERE"  # Lisää tähän tokenin arvo

# VM:n ID
VMID=1017

# API-kutsu VM:n tilan hakemiseksi
# curl -s -k -H "Authorization: PVEAPIToken=${USER}!${TOKENID}=${TOKEN}" \
# "${HOST}/api2/json/nodes/${HOSTNAME}/qemu/${VMID}/status/current"

# Kokeillaan käyttäjäoikeuksien rajausta:
# Lähetä POST-pyyntö VM:n sammuttamiseksi
curl -s -k -X POST \
  -H "Authorization: PVEAPIToken=${USER}!${TOKENID}=${TOKEN}" \
  "${HOST}/api2/json/nodes/${HOSTNAME}/qemu/${VMID}/status/stop"
