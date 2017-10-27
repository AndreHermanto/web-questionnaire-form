#!/bin/bash
# Note: This requires test.sh to have run first 

branch_name="$bamboo_repository_git_branch"
app_name="$bamboo_planRepository_name"
# replace / with - i.e. feature/branch_name to feature-branch-name
santized_branch_name="${branch_name/\//-}";
e2e_output_file_name="$santized_branch_name-e2e.md"
e2e_uat_output_file_name="$santized_branch_name-e2e-uat.md"

# Output E2E results with demo
launchUrl="https://sandbox.genome.one/demo/$app_name/$branch_name"
E2E_LAUNCH_URL=$launchUrl npm run e2e-test -- --env bamboo > $e2e_output_file_name

# Output E2E results for UAT
launchUrl="https://sandbox.genome.one/demo/uat/$app_name/$branch_name"
E2E_LAUNCH_URL=$launchUrl npm run e2e-test -- --env bamboo > $e2e_uat_output_file_name

repo_name="$app_name.wiki"
repo_url="https://2fa70040e61b6d5faaf08f9c382587b707711051@github.com/GenomeOne/$app_name.wiki.git"


# mv to wiku repo in order to clean up all at once
mv $e2e_output_file_name $repo_name/
mv $e2e_uat_output_file_name $repo_name/

cd $repo_name

echo $'\r' >> $e2e_output_file_name
echo $'\r' >> $e2e_uat_output_file_name

# Add all untracked files
git add -A
# Commit and push to the repo
git commit -am 'Started buiding'

git push origin master

# Send E2E Results
if grep -q "failed" $e2e_output_file_name
then
  echo "Send E2E starting to Github: Request"
  curl -H "Authorization: token 2fa70040e61b6d5faaf08f9c382587b707711051" --request POST --data "{\"state\": \"failure\", \"description\": \"Tests failed. Click Details to check them out.\", \"target_url\": \"https://github.com/GenomeOne/$app_name/wiki/$e2e_output_file_name\", \"context\": \"E2E\"}" https://api.github.com/repos/GenomeOne/$app_name/statuses/${bamboo_repository_revision_number} > /dev/null
  echo "Send E2E starting to Github: Success"
else
  echo "Send E2E starting to Github: Request"
  curl -H "Authorization: token 2fa70040e61b6d5faaf08f9c382587b707711051" --request POST --data "{\"state\": \"success\", \"description\": \"Tests passed! Hooray!\", \"target_url\": \"https://github.com/GenomeOne/$app_name/wiki/$e2e_output_file_name\", \"context\": \"E2E\"}" https://api.github.com/repos/GenomeOne/$app_name/statuses/${bamboo_repository_revision_number} > /dev/null
  echo "Send E2E starting to Github: Success"
fi

# Send E2E UAT Results
if grep -q "failed" $e2e_uat_output_file_name
then
  echo "Send E2E starting to Github: Request"
  curl -H "Authorization: token 2fa70040e61b6d5faaf08f9c382587b707711051" --request POST --data "{\"state\": \"failure\", \"description\": \"Tests failed. Click Details to check them out.\", \"target_url\": \"https://github.com/GenomeOne/$app_name/wiki/$e2e_uat_output_file_name\", \"context\": \"E2E UAT\"}" https://api.github.com/repos/GenomeOne/$app_name/statuses/${bamboo_repository_revision_number} > /dev/null
  echo "Send E2E starting to Github: Success"
else
  echo "Send E2E starting to Github: Request"
  curl -H "Authorization: token 2fa70040e61b6d5faaf08f9c382587b707711051" --request POST --data "{\"state\": \"success\", \"description\": \"Tests passed! Hooray!\", \"target_url\": \"https://github.com/GenomeOne/$app_name/wiki/$e2e_uat_output_file_name\", \"context\": \"E2E UAT\"}" https://api.github.com/repos/GenomeOne/$app_name/statuses/${bamboo_repository_revision_number} > /dev/null
  echo "Send E2E starting to Github: Success"
fi
