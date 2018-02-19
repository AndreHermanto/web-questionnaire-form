#!/bin/bash
set -ex # exit if anything fails

branch_name="$bamboo_planRepository_branch"
app_name="$bamboo_planRepository_name"
clean_app_name=${app_name:4}

# Build for sandbox for web-server
rm -rf build
#cp package.json package.json.bak # this makes it easier to do the UAT step
#sed -i 's#"homepage": "/'$clean_app_name'"#"homepage": "/demo/'$bamboo_planRepository_name'/'"$branch_name"'"#g' package.json
cat package.json

REACT_APP_BUILD_TIME=`date` REACT_APP_PAYMENTS_URL=/demo/web-payments/develop/# REACT_APP_BASE_URL=/api/web-server CI=true npm run build
mkdir -p $branch_name
cp -R build/* $branch_name

# SSH to sandbox
echo "Creating folder on Sandbox - /var/nfs/demo/$app_name/$branch_name"
ssh 35.189.35.255 /bin/bash <<EOF
mkdir -p "/var/nfs/demo/$app_name/$branch_name"
exit
EOF

# Copy the files over
scp -r $branch_name/. 35.189.35.255:/var/nfs/demo/$app_name/$branch_name/


# UAT!
# Build for sandbox, but pointing to UAT
rm -rf build
#cp package.json.bak package.json
#sed -i 's#"homepage": "/'$clean_app_name'"#"homepage": "/demo/uat/'$bamboo_planRepository_name'/'"$branch_name"'"#g' package.json
#cat package.json

REACT_APP_BUILD_TIME=`date` REACT_APP_PAYMENTS_URL=/demo/uat/web-payments/develop/# REACT_APP_BASE_URL=https://uat.genome.one/api/gw-questionnaire/v1 CI=true npm run build
mkdir -p $branch_name
cp -R build/* $branch_name

# SSH to sandbox
echo "Creating folder on Sandbox - /mnt/demo/uat/$app_name/$branch_name"
ssh 35.189.35.255 /bin/bash <<EOF
mkdir -p "/var/nfs/demo/uat/$app_name/$branch_name"
exit
EOF

# Copy the files over
scp  -r $branch_name/. 35.189.35.255:/var/nfs/demo/uat/$app_name/$branch_name/
