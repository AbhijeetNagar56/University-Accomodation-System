#!/usr/bin/env bash
set -e

echo "🚀 Step 1: Initializing and running Terraform..."
terraform init
terraform apply -auto-approve

# Extract the dynamic server IP from the Terraform outputs
SERVER_IP=$(terraform output -raw server_public_ip)
echo "✅ Infrastructure provisioned! Target EC2 IP: $SERVER_IP"

echo "⏳ Step 2: Waiting for SSH connectivity to stabilize on target host..."
sleep 30

echo "🛠️ Step 3: Executing configuration playbook via Ansible..."
# We pass the dynamic IP inline and target the 'ubuntu' default user with your AWS private key
ansible-playbook -i "$SERVER_IP," \
  --private-key ~/.ssh/uas-key.pem \
  -u ubuntu \
  --ssh-common-args='-o StrictHostKeyChecking=no' \
  playbook.yml

echo "🎉 Deployment complete! Your stack is spinning up securely on AWS Free Tier."