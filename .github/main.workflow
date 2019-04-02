workflow "Run tests and linter" {
  resolves = ["GitHub Action for Docker"]
  on = "push"
}

action "GitHub Action for Docker" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  args = "['-c', 'docker build --target base --cache-from eu.gcr.io/${PROJECT_ID}/${GITHUB_REPOSITORY/\\//_}:${BRANCH_NAME/\\//_}_base -t eu.gcr.io/${PROJECT_ID}/${GITHUB_REPOSITORY/\\//_}:${BRANCH_NAME/\\//_}_base .']"
  env = {
    PROJECT_ID = "terraform-test-208609"
  }
  runs = "/bin/sh"
}
